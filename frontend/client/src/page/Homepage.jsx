import Navbard from "../Navbar";
import { useState, useEffect } from "react";
import { ALL_FEELING } from "../graphql/feeling";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import "../styles/NavHomepage.css";
import { useThemeContext } from "../context/ThemeContext";
import { Modal } from "react-bootstrap";
import CardFeel from "../components/CardFeel";
import { AiOutlineClose } from "react-icons/ai";
import { GiChampions } from "react-icons/gi";
import { GiNotebook } from "react-icons/gi";
import { GiRetroController } from "react-icons/gi";
import { GiTrophy } from "react-icons/gi";
import { GiAngelOutfit } from "react-icons/gi";
import { GiHeartWings } from "react-icons/gi";
import { GiDiscussion } from "react-icons/gi";
import { FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";
import CardDay from "../components/CardDay";
import { DAILY_VERSE } from "../graphql/verses";
import { GET_USER, UPDATE_LAST_LOGIN } from "../graphql/userLastLogin";
/* import ErrorNotification from "../errors/ErrorNotification"; */

function Homepage() {
  /* -----------------------hooks------------------------ */
  const { contextTheme } = useThemeContext(); //Modo claro y oscuro
  const [showFeeling, setShowFeeling] = useState(false); //estado para abrir y cerrar modal de 24hrs
 /*  const [errors, setErrors] = useState(); //Aqui almacenaremos los errores de todas las consultas para pasarlo al componente para las notificaciones */
  const [showVerseFeel, setShowVerseFeel] = useState(false); // El estado que abre y cierra el versiculo del sentimineto elegido
  const [bookName, setbookName] = useState();
  const [chapterNumber, setchapterNumber] = useState();
  const [verseNumber, setVerseNumber] = useState();
  const [verseText, setVerseText] = useState();
  const [imgBackground, setImgBackground] = useState();
  const [user, setUser] = useState(); //estado para obtener el usuario desde el localStorage

  /* ---------------------servicios------------------------ */
  const [getUserInfo] = useLazyQuery(GET_USER);
  const [updateLastLogin] = useMutation(UPDATE_LAST_LOGIN);
  const { data: dailyVerse } =
    useQuery(DAILY_VERSE); /* Servicio para mostrar un versiculo diario */
  const { data: allfeeling } = useQuery(ALL_FEELING, {
    /* Servicio para mostrar todos los sentimientos */
    skip: !showFeeling, // No ejecutará este servicio hasta que la modal este en true
  });

  /* -----------------variables--------------------------- */
  const dailyImg =
    dailyVerse &&
    dailyVerse.getDailyWord.img
      .imgBase64; /* guardamos la imagen del versiculo diario en una constante */

  /* función encargada de enviar al componente el mensaje (error) */
/*   const handleErrors = (errorMessage) => {
    setErrors(errorMessage);
  }; */

  /* función encargada de traer los datos que provienen de CardFeel.jsx, siendo guardada en useState's. Además de activar el segundo modal*/
  const openVerseFeel = async (e) => {
    setbookName(e.book.modernName);
    setchapterNumber(e.chapter.chapter);
    setVerseNumber(e.verse.verse);
    setVerseText(e.verse.text);
    setImgBackground(e.img.imgBase64);
    setShowVerseFeel(true);
  };

  /*  función que cierra el segundo modal que muestra el versiculo del sentimiento seleccionado */
  const closeVerseFeel = () => {
    setShowVerseFeel(false);
  };

  /* función que cierra modal que pregunta como te sientes cada 24hrs */
  const closeShowFeeling = () => {
    setShowFeeling(false);
  };

  //constante que guarda un array de colores para los cards
  const colors = [
    "#3ae4e4",
    "#2eade4",
    "#2225c2",
    "#7142e9",
    "#d835d8",
    "#fd30db",
    "#f72929",
  ];

  //función para ingresar los colores en las cards
  function getColor(id) {
    return colors[id % colors.length];
  }

  // Recupera la información del usuario desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.id);
    }
  }, []);

  // Consulta la información del usuario y actualiza el campo para calcular las 24 horas para mostrar el modal
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (user) {
          const result = await getUserInfo({
            variables: { getOneUserId: user },
          });

          const currentTime = new Date();
          const currentHour = currentTime.getHours();

          const handleTimeFeeling = new Date(
            parseInt(result.data.getOneUser.handleTimeFeeling, 10)
          );

          const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
          const hasDayPassed =
            currentTime - handleTimeFeeling >= oneDayInMilliseconds;

          // Verificar si ya se mostró el modal hoy
          const hasShownToday =
            localStorage.getItem('hasShownToday') ===
            currentTime.toDateString();

          if ((hasDayPassed || currentHour >= 8) && !hasShownToday) {
            setShowFeeling(true);

            // Servicio para actualizar la fecha solo si ha pasado un día
            if (hasDayPassed) {
              await updateLastLogin({
                variables: {
                  updateLastLoginId: result.data.getOneUser.id,
                  handleTimeFeeling: currentTime,
                },
              });
            }

            // Marcar que se ha mostrado el modal hoy
            localStorage.setItem('hasShownToday', currentTime.toDateString());
          }
        }
      } catch (error) {
        console.error("Error al verificar el último inicio de sesión:", error);
      }
    };

    // Verificar si user tiene un valor antes de ejecutar la consulta
    if (user !== null) {
      fetchUserInfo();
    }
  }, [user, getUserInfo, updateLastLogin]); // A estos se le dicen dependencias hasta que no este la informacion de usuario y la data no responda o no se ejecutara este useEffect
  
  const days = [
    {
      id: 0,
      title: "L",
    },
    {
      id: 1,
      title: "M",
    },
    {
      id: 2,
      title: "M",
    },
    {
      id: 3,
      title: "J",
    },
    {
      id: 4,
      title: "V",
    },
    {
      id: 5,
      title: "S",
    },
    {
      id: 6,
      title: "D",
    },
  ];

  return (
    <>
      <Navbard />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div className="card container mt-5" id={contextTheme}>
        <div className="border-bottom-theme d-flex" style={{ height: "80px" }}>
          <h4
            className="mx-auto fw-bold text-white my-auto d-inline-block title"
            style={{ fontSize: "35px" }}
          >
            ¡Bienvenido!
          </h4>
        </div>
        <div className="card-body row">
          <div
            className="col-12 mx-auto mt-2 rounded-1 border-theme"
            id={contextTheme}
          >
            <h6
              className="position-absolute week-number fw-bold mt-3 mx-1 "
              style={{ fontSize: "20px" }}
            >
              EXP Total: 920
            </h6>
            <div className="row mt-2">
              {/* -------racha del usuario------- */}
              <div className="col-12 mb-3">
                <div className="text-center mt-3 mb-2">
                  <GiHeartWings
                    size={180}
                    className="text-danger animation-streak"
                  ></GiHeartWings>
                </div>
                <div className="text-center" style={{ marginTop: "-50px" }}>
                  <span
                    className="week-number fw-bold"
                    style={{ fontSize: "80px" }}
                  >
                    7
                  </span>
                </div>
                <div className="d-flex flex-wrap mb-2 justify-content-center">
                  {days.map((day) => (
                    <div key={day.id}>
                      <CardDay
                        week={day.title}
                        style={{ backgroundColor: getColor(day.id) }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {/* ------------------------------ */}
              {/* card de la palabra del día */}
              <div
                className="rounded-4 shadow col-11 mx-auto"
                style={{
                  minHeight: "180px",
                  backgroundImage: dailyImg ? `url(${dailyImg})` : "",
                  backgroundSize: "cover",
                  backgroundAttachment: "fixed",
                }}
              >
                <div>
                  <div
                    className="position-absolute text-white d-flex"
                    style={{ marginTop: "-32px" }}
                    type="button"
                  >
                    <FaPlay className="p-1" size={20}></FaPlay>
                    <span style={{ marginTop: "-2px", fontSize: "14px" }}>
                      Escuchar La Palabra
                    </span>
                  </div>
                  <h1
                    className="text-center text-white txt-shadow mt-5"
                    style={{ fontSize: "30px" }}
                  >
                    {dailyVerse &&
                      dailyVerse.getDailyWord?.book?.modernName + " "}
                    {dailyVerse &&
                      dailyVerse.getDailyWord?.chapter?.chapter + ":"}
                    {dailyVerse && dailyVerse.getDailyWord?.verse?.verse}
                  </h1>
                  <p
                    style={{
                      fontSize: "19px",
                    }}
                    className="fonts-letter mx-2 text-white txt-shadow text-center pb-4"
                  >
                    {(dailyVerse && dailyVerse.getDailyWord?.verse?.text) || ""}
                  </p>
                </div>
              </div>
              {/* ------------------------------ */}
            </div>
            {/* -------cards de elección------ */}
            <div className="row mt-4">
              <div className="col-md-6 col-sm-12 col-12">
                <Link to="/Sectionlvl" className="no-line">
                  <div
                    className="mb-4 shadow mx-auto fw-bold rounded-4 text-white txt-shadow card-section d-flex"
                    style={{
                      background:
                        "linear-gradient(to bottom right, #1fefec 0%, #0159a7 100%)",
                      height: "85%",
                    }}
                  >
                    <h2 className="my-auto col-md-5 col-sm-5 col-xs-5 col-4 text-center font-section">
                      Aventura
                    </h2>
                    <GiAngelOutfit
                      size={130}
                      style={{ opacity: "0.3" }}
                      className="col-7"
                    />
                  </div>
                </Link>
              </div>
              <div className="col-md-6 col-sm-12">
                <Link to="/games" className="no-line">
                  <div
                    className="mb-4 shadow mx-auto fw-bold rounded-4 text-white txt-shadow card-section d-flex"
                    style={{
                      background:
                        "linear-gradient(to bottom right, #0083f5 0%, #121594 100%)",
                      height: "85%",
                    }}
                  >
                    <h2 className="my-auto col-md-5 col-sm-5 col-xs-5 col-4 text-center font-section">
                      Juegos
                    </h2>
                    <GiRetroController
                      size={130}
                      style={{ opacity: "0.3" }}
                      className="col-7"
                    />
                  </div>
                </Link>
              </div>
              <div className="col-md-6 col-sm-12">
                <Link to="/ranking" className="no-line">
                  <div
                    className="mb-4 shadow mx-auto fw-bold rounded-4 text-white txt-shadow card-section d-flex"
                    style={{
                      background:
                        "linear-gradient(to bottom right, #3531f3 0%, #040681 100%)",
                      height: "85%",
                    }}
                  >
                    <h2 className="my-auto col-md-5 col-sm-5 col-xs-5 col-4 text-center font-section">
                      Ranking
                    </h2>
                    <GiChampions
                      size={130}
                      style={{ opacity: "0.3" }}
                      className="col-7"
                    />
                  </div>
                </Link>
              </div>
              <div className="col-md-6 col-sm-12">
                <Link to="/discussion" className="no-line">
                  <div
                    className="mb-4 shadow mx-auto fw-bold rounded-4 text-white txt-shadow card-section d-flex"
                    style={{
                      background:
                        "linear-gradient(to bottom right, #a731ec 0%, #620188 100%)",
                      height: "85%",
                    }}
                  >
                    <h2 className="my-auto col-md-5 col-sm-5 col-xs-5 col-4 text-center font-section">
                      Debate
                    </h2>
                    <GiDiscussion
                      size={130}
                      style={{ opacity: "0.3" }}
                      className="col-7"
                    />
                  </div>
                </Link>
              </div>
              <div className="col-md-6 col-sm-12">
                <Link to="/achievements" className="no-line">
                  <div
                    className="mb-4 shadow mx-auto fw-bold rounded-4 text-white txt-shadow card-section d-flex"
                    style={{
                      background:
                        "linear-gradient(to bottom right, #f337f3 0%, #68035c 100%)",
                      height: "85%",
                    }}
                  >
                    <h2 className="my-auto col-md-5 col-sm-5 col-xs-5 col-4 text-center font-section">
                      Logros
                    </h2>
                    <GiTrophy
                      size={130}
                      style={{ opacity: "0.3" }}
                      className="col-7"
                    />
                  </div>
                </Link>
              </div>
              <div className="col-md-6 col-sm-12">
                <Link to="/add-nota" className="no-line">
                  <div
                    className="mb-4 shadow mx-auto fw-bold rounded-4 text-white txt-shadow card-section d-flex"
                    style={{
                      background:
                        "linear-gradient(to bottom right, #f72929 0%, #910101 100%)",
                      height: "85%",
                    }}
                  >
                    <h2 className="my-auto col-md-5 col-sm-5 col-xs-5 col-4 text-center font-section">
                      Notas
                    </h2>
                    <GiNotebook
                      size={130}
                      style={{ opacity: "0.3" }}
                      className="col-7"
                    />
                  </div>
                </Link>
              </div>
            </div>
            {/* ------------------------------ */}
          </div>
        </div>
      </div>
      {/* Este modal pregunta como te sientes cada 24 horas */}
      <Modal show={showFeeling} centered>
        <div
          className="p-5 text-center fonts-letter rounded-1"
          id={contextTheme}
        >
          <p className="d-inline">¿Como te sientes hoy?</p>
          <div
            className="row d-flex aling-items-center mt-2 overflow-auto"
            id={contextTheme}
            style={{ height: "400px" }}
          >
            {allfeeling &&
              allfeeling.getAllFeeling.map((cardFeel) => (
                <div
                  key={cardFeel.id}
                  className="col-6 col-md-4 my-2 mt-3 mx-auto"
                  onClick={() => {
                    closeShowFeeling();
                  }}
                >
                  <CardFeel
                    title={cardFeel.typeFeeling}
                    img={cardFeel.img.imgBase64}
                    id={cardFeel.id}
                    openVerseFeel={openVerseFeel}
                  />
                </div>
              ))}
          </div>
          <div className="mt-3 d-flex justify-content-center">
            <button
              className="btn glow-danger-hover text-white mx-5"
              type="button"
              onClick={() => closeShowFeeling()}
            >
              Ahora no
            </button>
          </div>
        </div>
      </Modal>
      {/* --------------------------------------------------------- */}
      {/*  Modal que se abre al elegir una emoción especifica */}
      <Modal show={showVerseFeel} centered>
        <div
          style={{
            height: "350px",
            backgroundImage: `url(${imgBackground})`,
            backgroundSize: "cover",
            width: "100%",
          }}
          className="overflow-auto"
        >
          <AiOutlineClose
            style={{ zIndex: "2" }}
            className="position-absolute text-white m-2"
            type="button"
            size={20}
            onClick={closeVerseFeel}
          ></AiOutlineClose>
          <div>
            <div className="d-flex justify-content-center">
              <div
                style={{ zIndex: "2", fontSize: "20px" }}
                className="fonts-letter text-white p-2 mt-2 position-absolute"
              >
                {bookName + " " + chapterNumber + ":" + verseNumber}
              </div>
            </div>
            <div className="">
              <div
                style={{
                  fontSize: "19px",
                  zIndex: "1",
                  width: "100%",
                  height: "100%",
                }}
                className="text-white fonts-letter p-5"
              >
                {verseText}
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {/* --------------------------------------------------------- */}
      {/* Mostrar notificaciones de errores */}
      {/* errors && <ErrorNotification error={errors} /> */}
    </>
  );
}

export default Homepage;
