import { useThemeContext } from "../context/ThemeContext";
import { Modal } from "react-bootstrap";
import { ImCancelCircle } from "react-icons/im";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BiSkipNext } from "react-icons/bi";
import { BiSkipPrevious } from "react-icons/bi";
import { RiArrowLeftSFill } from "react-icons/ri";
import { RiArrowRightSFill } from "react-icons/ri";
import { ALL_STORIES } from "../graphql/levels";
import { useQuery } from "@apollo/client";
import ErrorNotification from "../errors/ErrorNotification";
import { ImExit } from "react-icons/im";
import { IoMdSkipForward } from "react-icons/io";

function Stories() {
  /* ---------------------Hooks----------------------- */
  const { contextTheme } = useThemeContext(); //Modo claro y oscuro
  const [offset, setOffset] = useState(0); //cambio de estado para el funcionamiento de la paginación
  const [paginationEnabled, setPaginationEnabled] = useState(true);
  const limit = 1; // Número de personajes por página
  const [loading, setLoading] = useState(false); // Nuevo estado de carga
  const [errors, setErrors] = useState(); //Aqui almacenaremos los errores de todas las consultas para pasarlo al componente para las notificaciones
  const { levelId } = useParams(); //Se extrae el parámetro levelId, requerido para el servicio ALL_STORIES
  const navigate = useNavigate(); /* hook para retroceder a la página anterior*/
  const [showQuit, setShowQuit] =
    useState(false); /* Estado para abrir y cerrar el modal */
  const [skipStory, setSkipStory] =
    useState(false); /* Estado para confirmar su salto de Story a Question */
  const [allStories, setAllStories] = useState([]); // Nuevo estado para almacenar todas las historias
  const [indexQuestion, setIndexQuestion] = useState(0);
  /* -----------------------Servicios------------------------- */
  const { data } = useQuery(ALL_STORIES, {
    //servicio para extraer las historias
    variables: {
      getStoryByLevelIdId: levelId,
    },
  });

  /* función encargada de enviar al componente el mensaje (error) */
  const handleErrors = (errorMessage) => {
    setErrors(errorMessage);
  };

  /* handle para pasar a la primera pagina del nivel */
  const handleLoadFirstPage = () => {
    if (paginationEnabled) {
      try {
        setOffset(0); // Regresar al inicio de la paginación
        setIndexQuestion(0);
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          setPaginationEnabled(true); // Habilitar la paginación después de cargar los datos
        }, 1000);
      } catch (error) {
        handleErrors("Failed handleLoadFirstPage: " + error.message);
      }
    }
  };
  /* handle para pasar a la pagina anterior del nivel */
  const handleLoadless = async () => {
    if (offset > 0 && paginationEnabled) {
      try {
        setOffset(offset - limit);
        setLoading(true);
        if (allStories.length > 0) {
          setIndexQuestion(indexQuestion - 1);
        }
        setTimeout(() => {
          setLoading(false);
          setPaginationEnabled(true); // Habilitar la paginación después de cargar los datos
        }, 1000);
      } catch (error) {
        handleErrors("Failed handleLoadLess: " + error.message);
      }
    }
  };
  /* handle para pasar a la pagina siguiente del nivel */
  const handleLoadMore = async () => {
    if (paginationEnabled && offset + limit < allStories.length && !loading) {
      try {
        setOffset(offset + limit);
        setLoading(true);
        if (indexQuestion + 1 < allStories.length) {
          setIndexQuestion(indexQuestion + 1);
        }
        setTimeout(() => {
          setLoading(false);
          setPaginationEnabled(true);
        }, 1000);
      } catch (error) {
        handleErrors("Failed handleLoadMore: " + error.message);
      }
    }

    if (paginationEnabled && offset + limit >= allStories.length) {
      navigate(`/question/${levelId}`);
    }
  };
  /* handle para omitir el apartado de historia y pasar directamente a preguntas */
  const handleLoadLastPage = async () => {
    navigate(`/question/${levelId}`);
  };

  /*  hook usado para guardar la respuesta del servicio en setAllStories */
  useEffect(() => {
    if (data && data.getStoryByLevelId) {
      setAllStories(data.getStoryByLevelId);
    }
    // Deshabilitar la paginación al iniciar la carga
    if (loading) {
      setPaginationEnabled(false);
    }
  }, [loading, data]);

  /* handles para abrir o cerrar modal para salir a Levels.jsx */
  const handleShowQuit = () => {
    setShowQuit(true);
  };
  const handleCloseQuit = () => {
    setShowQuit(false);
  };
  /* handles para abrir y cerrar modal para saltar de Stories a Question */
  const handleShowSkip = () => {
    if (offset + limit === allStories.length) {
      navigate(`/question/${levelId}`);
    } else {
      setSkipStory(true);
    }
  };
  const handleCloseSkip = () => {
    setSkipStory(false);
  };

  // Actualizar las historias mostradas según el offset
  //El método slice en JavaScript se utiliza para extraer una porción de un array, devolviendo una copia de los elementos seleccionados
  const displayedStories = allStories.slice(offset, offset + limit);
  /* ---------------------------------- */
  return (
    <div>
      <div className="d-flex justify-content-center align-items-center fonts-letter-bible vh-100">
          <div
            className="mx-auto card p-4 shadow fonts-letter stories-card"
            id={contextTheme}
          >
            <div
              className="text-danger position-absolute"
              style={{ marginTop: "-28px", marginLeft: "-20px" }}
            >
              <ImCancelCircle
                className="icon-cancel"
                type="button"
                size={22}
                onClick={() => {
                  handleShowQuit();
                }}
              ></ImCancelCircle>
            </div>

            {loading === false &&
              displayedStories.map((story) => (
                <div key={story.id} className="my-auto">
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="my-auto d-sides-pag">
                      <BiSkipPrevious
                        size={50}
                        className="arrow-hover"
                        type="button"
                        onClick={handleLoadFirstPage}
                      ></BiSkipPrevious>
                      <RiArrowLeftSFill
                        size={50}
                        className="arrow-hover"
                        type="button"
                        onClick={handleLoadless}
                      ></RiArrowLeftSFill>
                    </div>
                    <img
                      src={story.img.imgBase64}
                      alt=""
                      className="res-img-stories mb-1 no-select rounded-2 shadow"
                    />
                    <div className="my-auto d-sides-pag">
                      <RiArrowRightSFill
                        size={50}
                        className="arrow-hover"
                        type="button"
                        onClick={handleLoadMore}
                      ></RiArrowRightSFill>
                      <BiSkipNext
                        size={50}
                        className="arrow-hover"
                        type="button"
                        onClick={handleShowSkip}
                      ></BiSkipNext>
                    </div>
                    {/*                    <div
                      className="text-white fw-bold position-absolute"
                      style={{ zIndex: "5", marginTop: "360px" }}
                    >
                      <span style={{ fontSize: "18px" }}>
                        {indexQuestion + 1} / {allStories.length}
                      </span>
                    </div> */}
                  </div>
                  <p className="mt-2 text-justify" style={{ fontSize: "17px" }}>
                    {story.text}
                  </p>
                  <div className="justify-content-evenly mb-1 mt-2 col-12 d-bottom-pag">
                    <BiSkipPrevious
                      size={50}
                      className="arrow-hover"
                      type="button"
                      onClick={handleLoadFirstPage}
                    ></BiSkipPrevious>
                    <RiArrowLeftSFill
                      size={50}
                      className="arrow-hover"
                      type="button"
                      onClick={handleLoadless}
                    ></RiArrowLeftSFill>
                    <RiArrowRightSFill
                      size={50}
                      className="arrow-hover"
                      type="button"
                      onClick={handleLoadMore}
                    ></RiArrowRightSFill>
                    <BiSkipNext
                      size={50}
                      className="arrow-hover"
                      type="button"
                      onClick={handleShowSkip}
                    ></BiSkipNext>
                  </div>
                </div>
              ))}
                     {/* Mensaje para la pantalla de carga a la hora de paginar */}
          {loading && (
            <div style={{ zIndex: "100", marginTop:"220px"}}>
              <div className="loader mx-auto"></div>
            </div>
          )}
          </div>
        {/* modal interrogativo para preguntar al usuario su salida del nivel */}
        <Modal show={showQuit} centered>
          <div
            className="p-5 text-center fonts-letter rounded-1 flex-column d-flex"
            id={contextTheme}
          >
            <ImExit className="mx-auto text-secondary" size={100}/>
            <div>¿Estas seguro de salir del nivel?</div>
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
                onClick={() => navigate(-1)}
              >
                Salir
              </button>
            </div>
          </div>
        </Modal>
        {/* -------------------------------------------------------------- */}
        {/* modal interrogativo para preguntar al usuario su salto a preguntas */}
        <Modal show={skipStory} centered>
          <div
            className="p-5 text-center fonts-letter rounded-1 d-flex flex-column"
            id={contextTheme}
          >
             <IoMdSkipForward className="mx-auto text-secondary" size={100}/>
            <div>¿Estas seguro de saltarte la historia?</div>
            <div className="mt-3 d-flex justify-content-center">
              <button
                className="btn glow-danger-hover text-white mx-2 px-5"
                onClick={handleCloseSkip}
              >
                Cancelar
              </button>
              <button
                className="btn glow-on-hover text-white mx-2 px-5"
                type="submit"
                onClick={handleLoadLastPage}
              >
                Aceptar
              </button>
            </div>
          </div>
        </Modal>
      </div>
      {/* Mostrar notificaciones de errores */}
      {errors && <ErrorNotification error={errors} />}
      {/* Mensaje para la pantalla de carga a la hora de paginar */}
    </div>
  );
}

export default Stories;
