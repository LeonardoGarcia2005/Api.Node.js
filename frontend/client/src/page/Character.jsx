import Navbard from "../Navbar";
import { useState, useEffect } from "react";
import { useThemeContext } from "../context/ThemeContext";
import CardChar from "../components/CardChar";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import "../styles/Char.css";
import { useQuery } from "@apollo/client";
import { ALL_CHARACTER } from "../graphql/character";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import useDebounce from "../util/useDebounce"; // Importacion del componente para que a la hora de ingresar valores en el input se relentice
import ErrorNotification from "../errors/ErrorNotification";

function Character() {
  /* -----------------------------Hooks---------------------------------------- */
  const { contextTheme } = useThemeContext(); //contexto que trae modo claro y modo oscuro
  const [offset, setOffset] = useState(0); //cambios de estados para la paginación
  const limit = 12; // Número de personajes por página
  const [filterName, setFilterName] = useState(""); //cambios de estados para la filtración de personajes mediante el input
  const debounceValue = useDebounce(filterName, 1000); //para no sobrecargar las búsquedas, utiliza el componente useDebounce para retrasar el tiempo búsqueda
  const [errors, setErrors] = useState(); //Aqui almacenaremos los errores de todas las consultas para pasarlo al componente para las notificaciones
  const [loading, setLoading] = useState(false); // Nuevo estado de carga
  const [paginationEnabled, setPaginationEnabled] = useState(true);//Para evitar que el usuario le de click rapidamente para saltar la paginación, se desactiva la paginación hasta que cargue los personajes
  /* -----------------------------Servicios---------------------------------------- */
  const { data: characterData, error } = useQuery(ALL_CHARACTER, { /* Servicio para obtener los cards y datos de los personajes y la paginacion */
    variables: { offset, limit, name: debounceValue },
    onCompleted: () => {
      const storedOffset = localStorage.getItem("characterOffset");
      if (storedOffset !== null) {
        setOffset(parseInt(storedOffset, 10));
      }
    },
  });

  /* función encargada de enviar al componente el mensaje (error) */
  const handleErrors = (errorMessage) => {
    setErrors(errorMessage);
  };

  //constante que guarda un array de colores para los cards
  const colors = [
    "#3ae4e4",
    "#2eade4",
    "#2958e4",
    "#2225c2",
    "#7142e9",
    "#8c31d6",
    "#d835d8",
    "#fd30db",
    "#f7295c",
  ];

  //función para ingresar los colores en las cards
  function getColor(id) {
    id = id - 1;
    return colors[id % colors.length];
  }

  //manipulador para manejar el onChange del Input
  const handleFilterCharacter = (e) => {
    const inputName = e.target.value;
    // Verificar si la longitud del inputName es mayor o igual a 3 letras para filtrar
 if (inputName.length >= 3) {
  setFilterName(inputName);
} // Para volver a mostrar todos los personajes, el input tiene que volver a 0  
if (inputName.length === 0){
  setFilterName(inputName);
}
  };

  //handle para dirigirse a la carga anterior de personajes
  const handleLoadLess = () => {
    if (offset > 0 && paginationEnabled) {
      try {
        setOffset(offset - limit);
        localStorage.setItem("characterOffset", (offset - limit).toString()); // Almacenar el valor de la paginacion en el localStorage
        setLoading(true);

        setTimeout(() => {
          setLoading(false); //Deshabilitar animación de carga para la paginación
          setPaginationEnabled(true); // Habilitar la paginación después de cargar los datos
        }, 1000);
      } catch (error) {
        handleErrors("Failed handleLoadLess:  " + error.message);
      }
    }
  };
//handle para dirigirse a la carga siguiente de personajes
  const handleLoadMore = async () => {
    if (
      characterData &&
      characterData.getCharacters.length === limit &&
      paginationEnabled
    ) {
      try {
        setOffset(offset + limit); // Actualiza el estado local offset
        localStorage.setItem("characterOffset", (offset + limit).toString()); // Almacenar el valor de la paginacion en el localStorage
        setLoading(true);

        setTimeout(() => {
          setLoading(false);
          setPaginationEnabled(true); // Habilitar la paginación después de cargar los datos
        }, 1000);
      } catch (error) {
        handleErrors("Failed handleLoadMore:  " + error.message);
      }
    }
  };

  useEffect(() => {
    // Deshabilitar la paginación al iniciar la carga
    if (loading) {
      setPaginationEnabled(false);
    }
  }, [loading]);

  return (
    <>
      <Navbard />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div
        className="card container mt-5"
        id={contextTheme}
        style={{ minHeight: "750px" }}
      >
        <div
          className="border-bottom-theme d-flex"
          style={{height: "80px"}}
        >
          <h3
            className="mx-auto fw-bold text-white my-auto h-text title-achieve d-inline-block title"
            style={{ fontSize: "35px" }}
          >
            Personajes
          </h3>
        </div>
        <div className="card-body p-4 mt-2" style={{ minHeight: "500px" }}>
          <div className="mb-4">
            <div className="text-end" style={{ marginRight: "22px" }}>
              <PiMagnifyingGlassBold
                size={14}
                className="position-absolute mt-2 text-secondary"
                type="button"
              />
            </div>
            <input
              type="text"
              name="username input-char"
              placeholder="Ingrese algún nombre (mínimo 3 letras)"
              className="form-control fw-bold py-2"
              style={{ width: "100%", fontSize:"14px" }}
              id={contextTheme}
              onChange={handleFilterCharacter}
            />
          </div>
          {/* mapeo que crea las cards  */}
          <div className="row d-flex aling-items-center">
            {loading === false &&
              characterData &&
              characterData.getCharacters.map((cardCh) => (
                <div
                  className="col-lg-4 col-md-6 my-2 col-12"
                  key={cardCh.id}
                  type="button"
                >
                  <CardChar
                    name={cardCh.name}
                    style={{ backgroundColor: getColor(cardCh.id) }}
                    img={cardCh.img.imgBase64}
                    characterId={cardCh.id}
                  />
                </div>
              ))}
          </div>
          {/* Mensaje informativo en caso de no haber un personaje */}
          {error && (
            <p className="lead text-center text-danger fw-bold no-select">
              No hay resultados
            </p>
          )}
          {/* --------------------------------- */}
          {/* Mensaje para la pantalla de carga a la hora de paginar */}
          {loading && (
            <div style={{ marginTop: "200px" }}>
              <div className="loader mx-auto"></div>
            </div>
          )}
          {/* ----------------------------------------------- */}
        </div>
        {/* arrows para cargar más personajes o menos */}
        {characterData && characterData.getCharacters.length <= limit && (
          <div className="row mb-3">
            <div className="col-6 text-center">
              <IoIosArrowBack
                className="arrow-hover px-2 arrow-size"
                type="button"
                size={60}
                id={contextTheme}
                onClick={handleLoadLess}
                disabled={paginationEnabled}
              />
            </div>
            <div className="col-6 text-center">
              <IoIosArrowForward
                className="arrow-hover px-2 arrow-size"
                type="button"
                size={60}
                id={contextTheme}
                onClick={handleLoadMore}
                disabled={paginationEnabled}
              />
            </div>
          </div>
        )}
      </div>
      {/* Mostrar notificaciones de errores */}
      {errors && <ErrorNotification error={errors} />}
    </>
  );
}

export default Character;
