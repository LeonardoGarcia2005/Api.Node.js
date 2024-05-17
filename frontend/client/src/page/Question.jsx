import { useThemeContext } from "../context/ThemeContext";
import { ProgressBar, Modal } from "react-bootstrap";
import { ImCancelCircle } from "react-icons/im";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GET_QUESTION, ALL_ANSWERS } from "../graphql/levels";
import { useMutation, useQuery } from "@apollo/client";
import { SEND_RESPONSE, SEND_SCORE } from "../graphql/levels";
import Confetti from "react-confetti";
import ErrorNotification from "../errors/ErrorNotification";
import { ImExit } from "react-icons/im";

function Stories() {
  /* ---------------------Hooks----------------------- */
  const { contextTheme } = useThemeContext(); //Modo claro y oscuro
  const { levelId } = useParams(); //Se extrae el parámetro levelId, requerido para el servicio GET_QUESTION
  const [offset, setOffset] = useState(0); //cambio de estado para pasar a otra pregunta
  const [allQuestions, setAllQuestions] = useState([]); // Nuevo estado para almacenar todas las preguntas
  const navigate = useNavigate(); /* hook para retroceder a la página anterior*/
  const [showQuit, setShowQuit] =
    useState(false); /* estado para abrir y cerrar el modal */
  const [user, setUser] = useState();
  const [questionId, setQuestionId] = useState(); // guardar el id de la pregunta para luego usarlo en el servicio de respuestas
  const [selectAnswerId, setSelectAnswerId] = useState(null); // Donde almacenaremos el id de la pregunta que le han dado click
  const [mostrarRespuestaCorrecta, setMostrarRespuestaCorrecta] =
    useState(false); // con esto evaluaremos la respuesta correcta para mostrarla si el usuario se equivoco
  const [showConfetti, setShowConfetti] = useState(false); //estado para mostrar la animacion del confetti
  const [progress, setProgress] = useState(0); //estado para manejar la barra de progreso
  const [userResponses, setUserResponses] = useState([]); //Estado para almacenar las respuestas y despues enviarlas en conjunto
  const [errors, setErrors] = useState(); //Aqui almacenaremos los errores de todas las consultas para pasarlo al componente para las notificaciones
  /* -----------------------Servicios------------------------- */
  const [sendResponse] = useMutation(SEND_RESPONSE);
  const [sendScore] = useMutation(SEND_SCORE);
  const { data: dataQuestion } = useQuery(GET_QUESTION, {
    //servicio para obtener la funcionalidad de las preguntas
    variables: {
      getQuestionsByLevelIdId: levelId,
    },
  });

  const { data: dataAnswers } = useQuery(ALL_ANSWERS, {
    //servicio para obtener la funcionalidad de las respuesta
    variables: {
      getAllAnswerByQuestionIdId: questionId,
    },
    skip: !questionId,
  });

  const limit = 1; //limite para traer una sola pregunta
  const displayQuestion = allQuestions.slice(offset, offset + limit); //se realiza un metodo de arreglo para poder definir una pregunta especifica y se guarda en una constante

  /* función encargada de enviar al componente el mensaje (error) */
  const handleErrors = (errorMessage) => {
    setErrors(errorMessage);
  };

  /* handles para abrir o cerrar modal para salir a Levels.jsx */
  const handleShowQuit = () => {
    setShowQuit(true);
  };
  const handleCloseQuit = () => {
    setShowQuit(false);
  };

  /* handle para avanzar la barra de progreso */
  const handleProgress = () => {
    if (progress < 100) {
      setProgress(progress + 20);
    }
  };

  /*   Verificar si la respuesta es correcta, guardar la respuesta a los datos del usuario y paginar a la siguiente pregunta o mostrar resultados */
  const checkAnswer = async (answer) => {
    try {
      if (answer.isCorrect) {
        setShowConfetti(true); // Mostrar animación confetti
      }

      const newResponse = { userId: user.id, answerId: answer.id, questionId: answer.question.id };

      // Almacenar las respuestas en una variable
      const updatedResponses = [...userResponses, newResponse];

      // Actualiza el estado con todas las respuestas
      setUserResponses(updatedResponses);

      setSelectAnswerId(answer.id); // Almacenar el id para despues evaluar si es el mismo al que se le ha dado click

      /* Una vez presionada la respuesta le damos un setTimeout para darle un tiempo en pasar a la siguiente pregunta */
      setTimeout(async () => {
        if (offset + limit < allQuestions.length) {
          setOffset(offset + limit);
        } else {
          // Enviar todas las respuestas cuando todas las preguntas fueron respondidas
          await sendAllResponses(updatedResponses);
          navigate(`/ResultLevel/${levelId}`);
        }
        setShowConfetti(false); // Ocultar animación de confetti
        setSelectAnswerId(null); //Lo convertimos en null para no dejar ninguna respuesta seleccionada
      }, 2000);
    } catch (error) {
      handleErrors("Error checking answer:", error);
    }
  };

  /* Función que se ejecutara cuando se terminen todas las preguntas */
  const sendAllResponses = async (responses) => {
    try {
      for (const response of responses) {
        await sendResponse({
          variables: {
            input: {
              userId: response.userId,
              answerId: response.answerId,
              questionId: response.questionId,
            },
          },
        });
      }

      // Despues de enviar todas las respuestas enviar la suma del score
      await sendScore({
        variables: {
          userId: user.id,
          levelId: levelId,
        },
      });
    } catch (error) {
      handleErrors("Error sending responses:", error);
    }
  };

  /* -------------------------------------------------------------- */

  /* función para guardar colores de dificultad */
  function getColor(difficulty) {
    switch (difficulty) {
      case "F":
        return "#32CD32";
      case "I":
        return "#FFA500";
      case "D":
        return "#FF4500";
      default:
        return "black";
    }
  }
  
      // Esta función se ejecuta cuando el usuario quiere salir de la página
      const alertarUsuario = (e) => {
        e.preventDefault();
        e.returnValue = '';
      };

  useEffect(() => {
    // Agregar el evento beforeunload al objeto window
    window.addEventListener('beforeunload', alertarUsuario);
    // Remover el evento al desmontar el componente
    return () => {
      window.removeEventListener('beforeunload', alertarUsuario);
    };
  }, []);

  useEffect(() => {
    // Recupera la información del usuario desde localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  /*  hook usado para guardar la respuesta del servicio en setAllQuestions */
  useEffect(() => {
    /* Condicion para evaluar si el servicio trae los datos */
    if (dataQuestion && dataQuestion.getQuestionsByLevelId) {
      setAllQuestions(dataQuestion.getQuestionsByLevelId);
    }
    /* Condicion para obtener el id del arreglo de preguntas para poder enviarlo al servicio ALL_ANSWERS */
    if (displayQuestion && displayQuestion.length > 0) {
      setQuestionId(displayQuestion[0].id);
    }
  }, [dataQuestion, displayQuestion]);
  /* ---------------------------------- */
  return (
    <div className="height-res">
      {/* boton para salir y barra de progreso */}
        {showConfetti && <Confetti style={{width:"100%"}}></Confetti>}
      <div className="d-flex">
        {/* Componente para mostrar la animación del confetti */}
        <div className="mt-2 text-danger position-absolute mx-2">
          <ImCancelCircle
            className="icon-cancel"
            type="button"
            size={30}
            onClick={() => {
              handleShowQuit();
            }}
          ></ImCancelCircle>
        </div>
        <div className="mt-3 col-12">
          <ProgressBar
            className="mx-auto"
            now={progress}
            style={{
              width: "75%",
              height: "15px",
              fontSize: "12px",
              borderRadius: "10px",
            }}
          />
        </div>
      </div>
      {/*  ------------------------------------------------------- */}
      <div className="d-flex flex-column justify-content-center fonts-letter-bible mt-5">
        {/*  Cards de preguntas y respuestas */}
        <div className="mx-auto card p-4 shadow fonts-letter question-card fw-bold">
          {displayQuestion.map((question) => (
            <div key={question} className="position-relative">
              <div
                className="rounded-circle p-2"
                style={{
                  position: "absolute",
                  top: "-10px",
                  left: "-10px",
                  backgroundColor: getColor(question.difficulty),
                }}
              ></div>
              <p className="m-auto text-center my-5">{question.question}</p>
            </div>
          ))}
        </div>
        <div className="d-flex flex-wrap justify-content-evenly mt-1 p-4">
          {dataAnswers &&
            dataAnswers.getAllAnswerByQuestionId.map((dataAns) => (
              <div
                key={dataAns.id}
                className={`card mb-4 shadow card-sublevel fw-bold col-lg-5 col-md-5 col-12 ${
                  selectAnswerId !== null && dataAns.id === selectAnswerId
                    ? dataAns.isCorrect
                      ? "bg-success text-white border border-white"
                      : "bg-danger text-white border border-white"
                    : mostrarRespuestaCorrecta && dataAns.isCorrect
                    ? "bg-success text-white border border-white"
                    : dataAns.isCorrect
                    ? "" // Respuesta correcta, no se aplican estilos
                    : "bg-light border border-white text-dark"
                }`}
                type="button"
                onClick={() => {
                  /* Evaluamos si respondieron para deshabilitar las demas respuestas */
                  if (selectAnswerId === null) {
                    checkAnswer(dataAns);
                    if (!dataAns.isCorrect) {
                      setMostrarRespuestaCorrecta(true);
                      handleProgress(true);
                      setTimeout(() => {
                        setMostrarRespuestaCorrecta(false);
                      }, 2000);
                    } else {
                      /* en caso de haber respondido bien, avanza la barra de progreso igualmente */
                      handleProgress(true);
                    }
                  }
                }}
              >
                <p className="my-4 mx-auto">{dataAns && dataAns.answer}</p>
              </div>
            ))}
        </div>
        {/* -------------------------------------- */}
        {/* ------------------------------- */}

        {/* modal interrogativo para preguntar al usuario su salida del nivel */}
        <Modal show={showQuit} centered>
          <div
            className="p-5 text-center fonts-letter rounded-1 flex-column d-flex"
            id={contextTheme}
          >
            <ImExit className="mx-auto text-secondary" size={100}/>
            <div>¿Estas seguro de salir del nivel?</div>
            <small
              className="text-secondary"
              style={{ fontSize: "15px" }}
            >
              ¡Tu avance no se va a guardar!
            </small>
            <div className="mt-3 d-flex justify-content-center">
              <button
                className="btn glow-danger-hover text-white mx-2 px-5"
                onClick={handleCloseQuit}
              >
                Cancelar
              </button>
              <button
                className="btn glow-on-hover text-white mx-2 px-5"
                type="submit"
                onClick={() => navigate(-2)}
              >
                Salir
              </button>
            </div>
          </div>
        </Modal>
        {/* -------------------------------------------------------------- */}
      </div>
      {/* Mostrar notificaciones de errores */}
      {errors && <ErrorNotification error={errors} />}
    </div>
  );
}

export default Stories;
