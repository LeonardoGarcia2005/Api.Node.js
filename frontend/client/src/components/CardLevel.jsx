import { Card } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";
import { IoIosLock } from "react-icons/io";

function CardLevel({ name, ico, levelId, unLock }) {
  const { contextTheme } = useThemeContext(); //Modo claro y oscuro
  const navigate = useNavigate()
  const [modalBlock, setModalBlock] = useState(false);

  const handleOpenModal = () => {
    setModalBlock(true)
  }
  const handleCloseModal = () => {
    setModalBlock(false)
  }

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

  const getColor = (levelId) => {
    levelId = levelId - 1;
    return colors[levelId % colors.length];
  };

  const handleIsLevelEnabled = () =>{
    if(!isCardEnabled){
      handleOpenModal()
    } else {
      navigate(`/stories/${levelId}`);
    }
  }  

  // Estado para manejar la deshabilitación de la tarjeta
  const [isCardEnabled, setIsCardEnabled] = useState(unLock);


  useEffect(() => {
    setIsCardEnabled(unLock);
  }, [unLock]);

  return (
    <>
    <Card
      className={`rounded-circle mx-auto shadow mt-4 size-card-level card-level no-select ${isCardEnabled ? "" : "disabled-card"}`}
      style={{ backgroundColor: getColor(levelId) }}
    >
      <button className={`btn w-100 h-100 rounded-circle d-flex justify-content-center text-white fw-bold text-shadow ${isCardEnabled ? "" : "disabled-link"}`} onClick={handleIsLevelEnabled}>
        <Card.Title>
          <img src={ico} className="size-img-card mt-2" alt={`Icono nivel ${levelId}`}/>
        </Card.Title>
      </button>
    </Card>

    <div className={`text-center mb-3 fw-bold no-select ${isCardEnabled ? "" : "disabled-text"}`}>
      {name}
    </div>
    <Modal show={modalBlock} centered>
    <div
            className="p-5 text-center fonts-letter rounded-1 flex-column d-flex"
            id={contextTheme}
          >
            <IoIosLock size={100} className="mx-auto text-secondary"/>
            <div>Necesitas pasar la nivel anterior</div>
            <small
              className="text-secondary"
              style={{ fontSize: "15px" }}
            >
              ¡Vamos tú puedes hacerlo!
            </small>
            <div className="mt-3 d-flex justify-content-center">
              <button
                className="btn glow-on-hover text-white mx-2 px-5"
                type="submit"
                onClick={() => handleCloseModal()}
              >
                Aceptar
              </button>
            </div>
          </div>
    </Modal>
  </>
 );
}
CardLevel.propTypes = {
  ico: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  levelId: PropTypes.string.isRequired,
  unLock: PropTypes.bool.isRequired,
};
export default CardLevel;