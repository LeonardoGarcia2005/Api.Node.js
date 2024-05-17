import Navbard from "../Navbar";
import { useThemeContext } from "../context/ThemeContext";
import "../styles/Levels.css";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { INTRO_SECTIONS } from "../graphql/sectionlvl";
import { useQuery } from "@apollo/client";

function LevIntro() {
  /* --------------------hooks------------------------*/
  const { contextTheme } = useThemeContext(); //contexto para cambiar modo claro a modo oscuro 
  /* -------------------servicios-------------------- */
  const { sectionId } = useParams(); /* obtenemos el id de Sectionlvl para el requerimiento del servicio INTRO_SECTIONS */
  const { data: introlvl } = useQuery(INTRO_SECTIONS, { /* Servicio para la extraccion de datos para la introducción de la sección */
    variables: {
      getSectionByIdId: sectionId,
    },
  });
  return (
    <>
      <Navbard />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div className="card container mt-5" id={contextTheme}>
        <div className="border-bottom-theme d-flex" style={{height: "80px"}}>
          <h3
            className="mx-auto fw-bold text-white my-auto h-text d-inline-block title"
            style={{ fontSize: "35px"}}
          >
            {introlvl && introlvl.getSectionById.book.modernName}
          </h3>
        </div>
        <div className="card-body row">
          <div
            className="col-11 mx-auto p-4 my-4 rounded-1 border-theme"
            style={{ minHeight: "600px" }}
            id={contextTheme}
          >
            {/* introducción de los niveles que pasará al componente Levels.jsx*/}
            <div className="mx-2" style={{ margin: "70px 0 0 0" }}>
              <img
                src={introlvl && introlvl.getSectionById.img.imgBase64}
                style={{ width: "350px" }}
                className="img-fluid float-sm-end ms-sm-3"
              />
              <p className="text-break p-3 fonts-letter text-justify letter-intro">
                {introlvl && introlvl.getSectionById.book.introduction}
              </p>
            </div>
            {/* ---------------------------------------------------------------------------------- */}
            <div className="text-center">
            <Link to={`/levels/${sectionId}`}>
              <BsArrowRight
                className="px-2 arrow-hover"
                size={60}
                type="button"
                id={contextTheme}
              />
            </Link>
          </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LevIntro;
