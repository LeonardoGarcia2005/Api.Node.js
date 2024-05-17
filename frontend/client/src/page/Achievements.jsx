import Navbard from "../Navbar";
import "../styles/achieve.css";
import { useThemeContext } from "../context/ThemeContext";
import { LiaPrayingHandsSolid } from "react-icons/lia";

function Achievements() {
  const { contextTheme } = useThemeContext();
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
            style={{ fontSize: "35px" }}
          >
            Logros
          </h3>
        </div>
        <div className="card-body row">
          <div
            className="col-11 mx-auto overflow-auto p-5 my-4 rounded-1 border-theme"
            style={{ height: "600px" }}
            id={contextTheme}
          >
            <div className="d-flex justify-content-center">
              <div
                className="text-center mt-2 mb-2 position-absolute mt-5"
                style={{ opacity: "0.1" }}
              >
                <LiaPrayingHandsSolid
                  size={270}
                  className="text-secondary"
                ></LiaPrayingHandsSolid>
              </div>
              <div
                className="text-center"
                id={contextTheme}
                style={{ marginTop: "120px" }}
              >
                <p className="fw-bold" style={{ fontSize: "40px" }}>
                  ¡Muy Pronto!
                </p>
                <p className="fw-bold"> En el nombre de Dios</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Achievements;
