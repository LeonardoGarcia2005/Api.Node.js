import Navbard from "../Navbar";
import { useThemeContext } from "../context/ThemeContext";
/* import CardMostImages from "../components/CardMostTeach"; */
import CardTeaching from "../components/CardTeaching";
import { ALL_TEACHING } from "../graphql/teaching";
import { useQuery } from "@apollo/client";

function Teaching() {
  const { contextTheme } = useThemeContext();
  const { data: AllTeaching } = useQuery(ALL_TEACHING)
  
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
            Enseñanzas
          </h3>
        </div>
        <div className="card-body row">
          <div
            className="col-12 mx-auto overflow-auto p-4 my-2 rounded-1 border-theme"
            style={{ minHeight: "600px" }}
            id={contextTheme}
          >
            <div className="border-bottom-theme text-center pb-4">
              <h4 className="fw-bold title-char" style={{ fontSize: "26px" }}>
                - Más leídos -
              </h4>
              <div className="row d-flex flex-wrap justify-content-evenly">
              {AllTeaching && AllTeaching.getAllTeaching.map((data) => (
                  <div
                    key={data.id}
                    className="col-lg-4 col-md-6 my-2 col-12"
                  >
                    <CardTeaching img={data.img.imgBase64} title={data.title}/>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <h4
                className="fw-bold mt-3 title-char"
                style={{ fontSize: "26px" }}
              >
                - Enseñanzas biblicas -
              </h4>
              <div className="row d-flex flex-wrap justify-content-evenly">
              {AllTeaching && AllTeaching.getAllTeaching.map((data) => (
                  <div
                    key={data.id}
                    className="col-lg-4 col-md-6 my-2 col-12"
                  >
                    <CardTeaching img={data.img.imgBase64} title={data.title}/>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Teaching;
