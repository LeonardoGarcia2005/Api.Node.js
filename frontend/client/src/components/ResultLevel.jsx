import { useThemeContext } from "../context/ThemeContext";
import { GiAngelOutfit } from "react-icons/gi";
import { GiJeweledChalice } from "react-icons/gi";
import { useNavigate, useParams } from "react-router-dom";
/* import { useQuery } from "@apollo/client"; */
import "../styles/Loading.css";
import { RESULT_LEVEL } from "../graphql/levels";
import { useQuery } from "@apollo/client";
import { useState, useEffect } from "react";
/* Componente usado después de pasar un nivel */
function ResultLevel() {
  const cross = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const { levelId } = useParams();
  const [user, setUser] = useState();
  const { data: result } = useQuery(RESULT_LEVEL, {
    variables: {
      userId: user ? user.id : null,
      levelId: levelId,
    },
  });
  const sectionId = result && result.getProgressUser?.level?.section.id;
  const resultScore = result && result.getProgressUser?.score;
  const crossesWon = result && result.getProgressUser?.level?.scoreForLevel;
// Calcular el percentage
const percentage = (resultScore / crossesWon) * 100;

// Función para los caliz según el percentage
const chalicesWon = (percentage) => {
  if (percentage === 100) {
    return 3; // Todas las estrellas
  } else if (percentage >= 55) {
    return 2; // Dos estrellas
  } else if (percentage > 0) {
    return 1; // Una estrella
  } else {
    return 0; // Ninguna estrella
  }
};
const numberChalices = chalicesWon(percentage);
  const { contextTheme } = useThemeContext();
  const navigate = useNavigate();
  useEffect(() => {
    // Recupera la información del usuario desde localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);
  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        id={contextTheme}
        style={{ height: "100%" }}
      >
        <GiAngelOutfit
          className="position-absolute text-secondary "
          size={350}
          style={{ opacity: "0.1" }}
        ></GiAngelOutfit>
        <div className="text-center">
          <div className="font-loading-title charging">
            {result && result.getProgressUser?.resultTitle}
          </div>
          <div
            className="mb-3"
            style={{ fontSize: "60px", marginTop: "-10px" }}
          >
            {resultScore + " ptos"}
          </div>
          <div className="d-flex justify-content-center mb-3">
          {cross.map((userWon, index) => (
      <div key={userWon.id} className={`mx-2 ${index < numberChalices ? 'text-warning' : 'text-secondary'}`} style={{ zIndex: "100" }}>
        <GiJeweledChalice size={40} />
      </div>
    ))}
          </div>
          <small className="fw-bold mx-4 text-center" id={contextTheme}>
            {result && result.getProgressUser?.resultDescription}
          </small>
          <div>
            <button
              className="glow-on-hover btn rounded-3 mt-4"
              style={{ width: "50%" }}
              onClick={() => {
                navigate(`/levels/${sectionId}`);
              }}
            >
              Amén
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResultLevel;
