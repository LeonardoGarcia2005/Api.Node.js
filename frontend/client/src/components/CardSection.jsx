import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";
import { IoIosLock } from "react-icons/io";

/* componente secundario proveniente del componente SectionLvl */
function CardSection({ title, style, img, sectionId, unLock }) {
    const { contextTheme } = useThemeContext(); //Modo claro y oscuro
    const navigate = useNavigate()
    const [modalBlock, setModalBlock] = useState(false);

    const handleOpenModal = () => {
      setModalBlock(true)
    }
    const handleCloseModal = () => {
      setModalBlock(false)
    }
    // Estado para manejar la deshabilitación de la tarjeta
    const [isCardEnabled, setIsCardEnabled] = useState(unLock);

    useEffect(() => {
      setIsCardEnabled(unLock);
    }, [unLock]);
  
    const handleIsSectionEnabled = () =>{
      if(!isCardEnabled){
        handleOpenModal()
      } else {
        navigate(`/levintro/${sectionId}`);
      }
    }  

  return (
    <>
      <div
        className={`card card-scale shadow mx-2 p-2 text-white no-line ${isCardEnabled ? "" : "disabled-card"}`}
        style={style}
        type="button"
        onClick={handleIsSectionEnabled}
      >
        <div className="d-flex justify-content-between">
          <h4 className="text-start my-auto mx-2 font-char no-select">
            {title}
          </h4>
          <img
            src={img}
            className="me-1 no-select"
            alt="..."
            style={{ width: "70px", height: "70px" }}
          />
        </div>
      </div>
      <Modal show={modalBlock} centered>
    <div
            className="p-5 text-center fonts-letter rounded-1 flex-column d-flex"
            id={contextTheme}
          >
            <IoIosLock size={100} className="mx-auto text-secondary"/>
            <div>Necesitas pasar la sección anterior</div>
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

CardSection.propTypes = {
  title: PropTypes.string.isRequired,
  style: PropTypes.object,
  img: PropTypes.string.isRequired,
  sectionId: PropTypes.string.isRequired,
  unLock: PropTypes.bool.isRequired
};

export default CardSection;
