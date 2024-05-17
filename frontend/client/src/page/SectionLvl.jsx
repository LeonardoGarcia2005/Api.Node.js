import { useState, useEffect } from "react";
import { ProgressBar } from "react-bootstrap";
import CardSection from "../components/CardSection";
import "../styles/Sectionlvl.css";
import Navbard from "../Navbar";
import { useThemeContext } from "../context/ThemeContext";
import { ALL_SECTIONS } from "../graphql/sectionlvl";
import { useQuery } from "@apollo/client";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import ErrorNotification from "../errors/ErrorNotification";

function SectionLvl() {
  /* ---------------------------- HOOKS ---------------------------- */
  const { contextTheme } = useThemeContext(); /* constante para traer modo claro */
  const [offset, setOffset] = useState(0); /* cambio de estado para el funcionamiento de la paginación */
  const [loading, setLoading] = useState(false); // Nuevo estado de carga para controlar la paginación
  const [paginationEnabled, setPaginationEnabled] = useState(true);
  const limit = 12; /* Número de secciones que queremos visualizar por cada consulta*/
  /* ---------------------------Servicio----------------------------- */
  const { data: sectionlvl } = useQuery(ALL_SECTIONS, { /* Servicio para obtener las secciones */
    variables: { offset, limit },
    onCompleted: () => {
      // funcion que permite verificar si la query se ejecutó con exito, hasta que no tenga el valor del localStorage no da como completado la query
      const storedOffset = localStorage.getItem("sectionOffset");
      if (storedOffset !== null) {
        setOffset(parseInt(storedOffset, 10));
      }
    },
  });
  /* ------------------------- METODOS ---------------------------- */
  const [errors, setErrors] = useState(); //Aqui almacenaremos los errores de todas las consultas para pasarlo al componente para las notificaciones

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
    id = id - 1; //se resta un numero al id para estar ordenado de acuerdo a la base de datos
    return colors[id % colors.length];
  }
  //handle para dirigirse a la carga anterior de las secciones
  const handleLoadLess = () => {
    if (offset > 0 && paginationEnabled) {
      try {
        setOffset(offset - limit);
        localStorage.setItem("sectionOffset", (offset - limit).toString()); // Almacenar el valor de la paginacion en el localStorage
        setLoading(true);

        setTimeout(() => {
          setLoading(false);
          setPaginationEnabled(true); // Habilitar la paginación después de cargar los datos
        }, 1000);
      } catch (error) {
        handleErrors("Failed handleLoadLess:  " + error.message);
      }
    }
  };
//handle para dirigirse a la carga siguiente de las secciones
  const handleLoadMore = () => {
    if (
      sectionlvl &&
      sectionlvl.getSections.length === limit &&
      paginationEnabled && 
      offset < 48
    ) {
      try {
        setOffset(offset + limit);
        localStorage.setItem("sectionOffset", (offset + limit).toString()); // Almacenar el valor de la paginacion en el localStorage
        setLoading(true);

        setTimeout(() => {
          setLoading(false);
          setPaginationEnabled(true); // Habilitar la paginación después de cargar los datos
        }, 1000);
      } catch (error) {
        handleErrors("Failed handleLoadMore: " + error.message);
      }
    }
  };

  useEffect(() => {
    // Deshabilitar la paginación al iniciar la carga
    if (loading) {
      setPaginationEnabled(false);
    }
  }, [loading]);
/* 
  // El estado que guarda el valor actual de la barra de progreso
  const [value, setValue] = useState(0);

  // El estado que guarda el número de niveles que has pasado
  const [level, setLevel] = useState(0);

  // La función que se ejecuta cuando pasas un nivel
  const handleLevelUp = () => {
    // Verificar si el nivel es menor que 66
    if (level < 66) {
      // Incrementar el número de niveles en uno
      setLevel((prevLevel) => prevLevel + 1);

      // Calcular el valor de la barra de progreso según el número de niveles
      setValue(Math.round(((level + 1) / 66) * 100));
    }
  }; */
  return (
    <>
      <Navbard />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div className="card container mt-5" id={contextTheme}>
{/*         <button
          className="btn float-start position-absolute text-white"
          onClick={handleLevelUp}
        >
          Sección Pasada
        </button> */}
        <div className="border-0 d-flex justify-content-center" style={{height: "70px"}}>
          <h3
            className="text-center title fw-bold my-auto d-inline-block"
            style={{ fontSize: "35px" }}
          >
            Secciones
          </h3>
          <div></div>
        </div>
        <ProgressBar
          className="mx-4 my-2"
          animated
          /* now={value} */
          variant="primary"
          /* label={`${value.toFixed(2)}%`} */
          style={{
            height: "25px",
            fontSize: "15px",
            borderRadius: "10px",
          }}
        />
        {/*   Map que muestra los cards de las secciones de niveles*/}
        <div className="card-body" style={{ minHeight: "450px" }}>
          {/* Mensaje para la pantalla de carga a la hora de paginar */}
          {loading && (
            <div style={{ marginTop: "170px" }}>
              <div className="loader mx-auto"></div>
            </div>
          )}
          {/* ----------------------------------------------- */}
          <div className="row d-flex aling-items-center ">
            {loading === false &&
              sectionlvl &&
              sectionlvl.getSections &&
              sectionlvl.getSections.map((card) => (
                <div className="col-lg-4 col-md-6  my-2 col-12" key={card.id}>
                  <CardSection
                    title={card.book.modernName}
                    style={{ backgroundColor: getColor(card.id) }}
                    img={card.img.imgBase64}
                    sectionId={card.id}
                    unLock={card.unLockSection}
                  />
                </div>
              ))}
          </div>
        </div>
        {/*  --------------------------------------------------- */}
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
      </div>
      {/* Mostrar notificaciones de errores */}
      {errors && <ErrorNotification error={errors} />}
    </>
  );
}

export default SectionLvl;
