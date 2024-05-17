import CardLevel from "../components/CardLevel";
import Grid from "@mui/material/Grid"; // Importamos el componente Grid
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { ALL_LEVEL } from "../graphql/levels";
import { useThemeContext } from "../context/ThemeContext";
import Navbard from "../Navbar";
import { useEffect, useState } from "react";

function Levels() {
  const { contextTheme } = useThemeContext(); /* Modo claro y modo oscuro */
  const { sectionId } =
    useParams(); /* obtenemos el id de Sectionlvl para el requerimiento del servicio ALL_LEVEL */
  const [user, setUser] = useState();
  const {
    data: getAllLevels,
    loading,
    error,
    refetch,
  } = useQuery(ALL_LEVEL, {
    /*  Servicio para obtener todos los niveles de la sección */ 
    skip: !user,
    variables: {
      userId: user ? user.id : null,
      sectionId,
    },
  });

  /*   Guardamos la información del servicio en una constante para ser usado en un mapeo  */
  const cards =
    getAllLevels && getAllLevels.getAllLevelsBySectionId
      ? getAllLevels.getAllLevelsBySectionId.map((level, index) => (
          <CardLevel
            key={index}
            name={level.name}
            ico={level.img.imgBase64}
            levelId={level.id}
            unLock={level.unLockLevel}
          />
        ))
      : [];

  // Esta es la función que recibe el índice del elemento y devuelve un porcentaje de desplazamiento
  const getTranslateX = (index) => {
    const translateXValues = [
      "-10%", // Primera fila a la izquierda
      "0%", // Segunda fila al centro
      "10%", // Tercera fila a la derecha
      "0%", // Cuarta fila al centro
      "-10%", // Quinta fila a la izquierda
      "0%", // Sexta fila al centro
      "10%", // Séptima fila a la derecha
      "0%", // Por defecto al centro
    ];
    return translateXValues[index % translateXValues.length];
  };

  useEffect(() => {
    // Recupera la información del usuario desde localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Refetch solo si no hay errores y los datos ya están cargados
      if (!loading && !error && getAllLevels) {
        await refetch();
      }
    };
  
    fetchData();
  }, [loading, error, refetch, getAllLevels]);
  

  // Esta es la parte donde se renderiza el resultado dentro de un componente Grid con un número variable de columnas
  return (
    <>
      <Navbard />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div className="card container mt-5" id={contextTheme}>
        <div className="border-bottom-theme d-flex" style={{ height: "80px" }}>
          <h3
            className="mx-auto fw-bold text-white my-auto h-text d-inline-block title"
            style={{ fontSize: "35px" }}
          >
            {getAllLevels &&
              // Mostrar el nombre del libro del primer nivel (asumiendo que todos los niveles tienen el mismo libro)
              getAllLevels.getAllLevelsBySectionId[0].section?.book?.name}
          </h3>
        </div>
        <div className="card-body row">
          <div
            className="col-11 mx-auto p-3 my-4 rounded-1 border-theme"
            style={{ minHeight: "600px" }}
            id={contextTheme}
          >
            <Grid
              container
              spacing={2}
              columns={{ xs: 12, sm: 12, md: 12 }}
              className="d-flex justify-content-center"
            >
              {/* // Usamos el componente Grid y le pasamos la propiedad columns con el número máximo de columnas */}
              {cards.map((card, index) => (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  key={index}
                  style={{ transform: `translateX(${getTranslateX(index)})` }}
                >
                  {/* // Cada tarjeta es un elemento del Grid con las props adecuadas para ocupar una fila completa y el estilo de desplazamiento */}
                  {card}
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
      </div>
    </>
  );
}

export default Levels;
