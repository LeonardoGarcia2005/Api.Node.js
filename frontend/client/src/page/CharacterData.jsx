import { useThemeContext } from "../context/ThemeContext";
import Navbard from "../Navbar";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { GET_CHARACTER } from "../graphql/character";
import { CHAR_APPEAR } from "../graphql/characterAppearance";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
/* componente que es abierto desde CardChar.jsx para mostrar datos del personaje */

function CharacterData() {
  /* -----------------hooks------------------------------ */
  const { contextTheme } = useThemeContext(); /* modo claro y modo oscuro */
  const { characterId } = useParams(); /* se obtiene el id de Character para el requerimiento de los servicios */
  /* --------------------------Servicios------------------------------------------- */
  const { data } = useQuery(GET_CHARACTER, { /* servicio para obtener los datos del personaje específico */
    variables: {
      getCharacterByIdId: characterId,
    },
  });
  const { data: appearanceData } = useQuery(CHAR_APPEAR, {/*  servicio para obtener la primera aparición en la biblia del personaje */
    variables: {
      getCharacterFirstAppearanceId: characterId,
    },
  });
  /* ----------------------------------------------------------------------------------------------- */
  /* -------------------------------Variables------------------------------------------- */
/*   guardamos los datos en constantes para una mejor compresión  */
  const bookName = appearanceData && appearanceData.getCharacterFirstAppearance?.book?.modernName;
  const bookNumber = appearanceData && appearanceData.getCharacterFirstAppearance?.book?.id;
  const chapterNumber = appearanceData && appearanceData.getCharacterFirstAppearance?.chapter?.chapter;
  const chapterId = appearanceData && appearanceData.getCharacterFirstAppearance?.chapter?.id
  const verseNumber = appearanceData && appearanceData.getCharacterFirstAppearance?.verse?.verse;
  /* ----------------------------------------------------------------------------------------------- */

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
            className="mx-auto fw-bold text-white my-auto h-text title-achieve d-inline-block title"
            style={{ fontSize: "35px" }}
          >
            {data && data.getCharacterById.name}
          </h3>
        </div>
        <div className="card-body row">
          <div
            className="col-11 mx-auto p-3 my-4 rounded-1 border-theme"
            id={contextTheme}
            style={{ minHeight: "600px" }}
          >
            <div className="p-3">
              <div>
                <img
                  src={data && data.getCharacterById.img.imgBase64}
                  alt="Character"
                  className="rounded-4 Bg-img-modal mb-4 d-block mx-auto img-size-char no-select"
                />

                <p className="text-break fonts-letter text-justify size-font-data">
                  <span className="mx-2"></span>
                    {data && data.getCharacterById.description}
                </p>
              </div>
              <div className="row text-center">
                <small
                  className="fonts-letter d-block mb-2 my-1 col-lg-6 col-md-12 col-xs-12 col-sm-12"
                  style={{ fontSize: "19px" }}
                >
                  Su nombre significa:{" "}
                  <span className="title-char fonts-letter" style={{ fontSize: "19px" }}>
                    {data && data.getCharacterById.meaningName}
                  </span>
                </small>
                <small
                  className="fonts-letter my-1 col-lg-6 col-md-12 col-xs-12 col-sm-12"
                  style={{ fontSize: "19px" }}
                >
                  Aparece en:{" "}
                  <Link 
                  to={`/OfficialBible/${bookName}/${bookNumber}/${chapterNumber}/${chapterId}`}
                   className="no-line"
                   >
                  <span className="title-char fonts-letter" type="button" style={{ fontSize: "19px" }}>
                    {bookName + " " + chapterNumber + ":" + verseNumber}
                  </span>
                  </Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

CharacterData.propTypes = {
  characterId: PropTypes.number,
};

export default CharacterData;
