import { Navbar } from "react-bootstrap";
import { useThemeContext } from "../context/ThemeContext";
import { RiCrossLine } from "react-icons/ri";
import "../styles/InicialPage.css";
import AOS from "aos"; //librería de animaciones al bajar el scroll
import "aos/dist/aos.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Mat from "../img/Mat.png";
import Jue from "../img/Jue.png";
import Jos from "../img/Jos.png";
import San from "../img/San.png";
import Dan from "../img/Dan.png";

function HomePage() {
  const { contextTheme } = useThemeContext(); /* Modo claro y modo oscuro */

  useEffect(() => {
    AOS.init(); // Inicializa AOS dentro del hook
  }, []); // Pasa un array vacío como segundo argumento
  return (
    <>
      <Navbar id={contextTheme} className="fixed-top shadow">
        <h3 className="navbar-brand text-primary mx-auto title">
          <RiCrossLine className="text-secondary" size={25} />
          <span className="main-title">PALABRA DE VIDA</span>
          <RiCrossLine className="text-secondary" size={25} />
        </h3>
      </Navbar>
      {/* -----primera presentación----- */}
      <div className="text-white bg-ip row" style={{ height: "100%" }}>
        <img
          data-aos="zoom-in"
          data-aos-duration="1000"
          src={San}
          alt="..."
          className="my-auto mx-auto col-lg-6 col-md-6 col-sm-12 col-xs-12 size-img-ip"
        />
        <div
          className="my-auto mx-auto wid-intro col-lg-6 col-md-6 col-sm-12 col-xs-12 "
          style={{zIndex:"10"}}
        >
          <h1 className="inicial-shadow-text text-center font-intro-title">
            ¡Descubre la palabra de Dios!
          </h1>
          <h4 className="p-4 text-center inicial-shadow-text font-intro">
            Aprende, mira y comparte los mensajes de la Biblia con videos,
            niveles y más. Podrás ver videos que te mostrarán cómo se escribió y
            se transmitió el libro sagrado.
          </h4>
        </div>
      </div>
      {/* ----------------------------------- */}
      {/* -------segunda presentación----------- */}
      <div className="text-white bg-ipTwo row" style={{ height: "100%" }}>
        <img
          data-aos="zoom-in"
          data-aos-duration="1000"
          src={Jos}
          alt="..."
          className="my-auto mx-auto col-lg-6 col-md-6 col-sm-12 col-xs-12 size-img-ip"
        />
        <div
          className="my-auto mx-auto wid-intro col-lg-6 col-md-6 col-sm-12 col-xs-12"
          style={{zIndex:"10"}}
        >
          <h1 className="inicial-shadow-text text-center font-intro-title">
            ¡Aventúrate en la historia sagrada!
          </h1>
          <h4 className="p-4 text-center inicial-shadow-text font-intro">
            Explora los relatos bíblicos con recursos multimedia, desafíos y
            recompensas. Se te ofrece una forma entretenida y educativa de
            acercarte a la Biblia y sus personajes.
          </h4>
        </div>
      </div>
      {/* ----------------------------------- */}
      {/* -------tercera presentación----------- */}

      <div className="text-white bg-ip row" style={{ height: "100%" }}>
        <img
          data-aos="zoom-in"
          data-aos-duration="1000"
          src={Jue}
          alt="..."
          className="my-auto mx-auto col-lg-6 col-md-6 col-sm-12 col-xs-12 size-img-ip"
        />
        <div
          className="my-auto mx-auto wid-intro col-lg-6 col-md-6 col-sm-12 col-xs-12"
          style={{zIndex:"10"}}
        >
          <h1 className="inicial-shadow-text text-center font-intro-title">
            ¡Conoce el libro más leído del mundo!
          </h1>
          <h4 className="p-4 text-center inicial-shadow-text font-intro">
            Descubre la gran variedad de contenidos que te harán conocer,
            comparar y contrastar las diferentes versiones, traducciones y
            adaptaciones.
          </h4>
        </div>
      </div>
      {/* ----------------------------------- */}
      {/* -------cuarta presentación----------- */}

      <div className="text-white bg-ipTwo row" style={{ height: "100%" }}>
        <img
          data-aos="zoom-in"
          data-aos-duration="1000"
          src={Dan}
          alt="..."
          className="my-auto mx-auto col-lg-6 col-md-6 col-sm-12 col-xs-12 size-img-ip"
        />
        <div
          className="my-auto mx-auto wid-intro col-lg-6 col-md-6 col-sm-12 col-xs-12"
          style={{zIndex:"10"}}
        >
          <h1 className="inicial-shadow-text text-center font-intro-title">
            ¡Enriquece tu fe con la Biblia!
          </h1>
          <h4 className="p-4 text-center inicial-shadow-text font-intro">
            Realiza un viaje por la Biblia que se adapta a tu ritmo y tu nivel.
            Podrás elegir entre diferentes opciones de contenido que te ofrecen
            distintas formas de profundizar en tu relación con Dios.
          </h4>
        </div>
      </div>
      {/* ----------------------------------- */}
      {/* -------quinta presentación----------- */}
      <div className="text-white bg-ip row" style={{ height: "100%" }}>
        <img
          data-aos="zoom-in"
          data-aos-duration="1000"
          src={Mat}
          alt="..."
          className="my-auto my-auto mx-auto col-lg-6 col-md-6 col-sm-12 col-xs-12 size-img-jesus"
        />
        <div
          className="my-auto mx-auto wid-intro col-lg-6 col-md-6 col-sm-12 col-xs-12"
          style={{zIndex:"10"}}
        >
          <h1 className="inicial-shadow-text text-center font-intro-title">
            ¡Empieza Ya!
          </h1>
          <h4 className="p-4 text-center inicial-shadow-text font-intro">
            Que Dios te bendiga y te acompañe en este hermoso viaje
          </h4>
          <Link to={"/login"} className="d-flex justify-content-center mb-3 no-line">
            <button
              className="btn glow-on-hover shadow text-white mx-5 fw-bold "
              type="button"
              style={{ width: "50%" }}
            >
              ¡Ingresa ya!
            </button>
          </Link>
          <Link to={"/inicialbible"} className="d-flex justify-content-center no-line">
          <button
              className="btn glow-on-hover shadow text-white mx-5 fw-bold "
              type="button"
              style={{ width: "50%" }}
            >
              Leer la Biblia
            </button>
            </Link>
        </div>
      </div>
    </>
  );
}

export default HomePage;
