import "./styles/NavHomepage.css";
import { useAuth } from "./context/AuthContext";
import { useState, useCallback, useEffect } from "react";
import { Offcanvas, Navbar } from "react-bootstrap";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaBible } from "react-icons/fa";
import { BiSolidHome } from "react-icons/bi";
import { BiSolidPhoneCall } from "react-icons/bi";
import { TiGroup } from "react-icons/ti";
import { FaCross } from "react-icons/fa";
import { BiSolidVideos } from "react-icons/bi";
import { FaBook } from "react-icons/fa";
import { BiPowerOff } from "react-icons/bi";
import { RiCrossLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import img1 from "./img/img1.png";
import { BiSolidSun } from "react-icons/bi";
import { PiMoonStarsFill } from "react-icons/pi";
import { useThemeContext } from "./context/ThemeContext";
import { useNavigate } from "react-router-dom";

function Navbard() {
  /* -------------------hooks---------------------- */
  const { contextTheme, setContextTheme } = useThemeContext(); //contexto para cambiar modo claro a modo oscuro
  const { logout } = useAuth();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [iconToShow, setIconToShow] = useState(null);
  const handleClose = useCallback(() => setShow(false), []);

  const handleLogout = async () => {
    try {
      await logout();
      // despues de remover el token dirigir a el login
      navigate(`/login`);
    } catch (error) {
      console.log(error);
    }
  };
  // Manipulación del tema de claro a oscuro
  const handleSwitch = () => {
    setContextTheme((state) => (state === "dark" ? "light" : "dark"));
  };
  //Recuperar los datos del usuario que se encuentra en el localStorage
  const storedUserInfo = JSON.parse(localStorage.getItem("user"));

  const refreshPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIconToShow(
        contextTheme === "dark" ? (
          <BiSolidSun size={20} className="d-flex justify-content-center" />
        ) : (
          <PiMoonStarsFill
            size={20}
            className="d-flex justify-content-center"
          />
        )
      );
    }, 1000);

    return () => clearTimeout(timeoutId); // Limpia el timeout si el componente se desmonta antes de que termine
  }, [contextTheme]);

  return (
    <Navbar id={contextTheme} className="fixed-top shadow" expand="lg">
      {/* en el navbar se ubica icono del menú, titulo principal y un icono que envía directamente a la biblia*/}
      <GiHamburgerMenu
        className="navbar-brand ms-3 text-secondary menu-icon"
        onClick={() => setShow(true)}
      />

      <h3 className="navbar-brand text-primary mx-auto title">
        <RiCrossLine className="text-secondary display-cross" size={25} />
        <Link to="/homepage" className="main-title">
          PALABRA DE VIDA
        </Link>
        <RiCrossLine className="text-secondary display-cross" size={25} />
      </h3>

      <Link to="/officialbible">
        <FaBible className="navbar-brand me-3 text-secondary bible-icon" />
      </Link>
      {/* ------------------------------------------------------------------------------------ */}
      {/* menu para navegar por todas las funcionalidades de las paginas */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="start"
        scroll={true}
        id={contextTheme}
      >
        {/* Boton para cambiar modo claro y modo oscuro */}
        <div
          className=" position-absolute p-2"
          style={{ right: "0px" }}
          id={contextTheme}
        >
          <button
            className="border rounded-2 hover-card d-flex justify-content-center"
            style={{ height: "32px", width: "32px" }}
            id={contextTheme}
            onClick={() => {
              handleSwitch(), refreshPage();
            }}
          >
            <div className="my-auto">{iconToShow}</div>
          </button>
        </div>
        {/*  ------------------------------------------- */}

        <Offcanvas.Header closebutton="true">
          <div className="mx-auto">
            <Avatar
              className="mx-auto"
              src={img1}
              sx={{ width: 150, height: 150 }}
              alt="..."
            />
            <h3 className="offcanvas-title text-center text-white profile-name">
              {storedUserInfo.username}
            </h3>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body
          className="scroll-auto"
          id={contextTheme}
          style={{ marginTop: "-20px" }}
        >
          <ul className="list-group list-group-flush">
            <Link
              to="/homepage"
              className="list-group-item fw-bold"
              id={contextTheme}
            >
              <BiSolidHome className="mb-1" size={18} /> Inicio{" "}
            </Link>
            <Link
              to="/character"
              className="list-group-item fw-bold"
              id={contextTheme}
            >
              <TiGroup className="mb-1" size={18} /> Personajes{" "}
            </Link>
            <Link
              to="/teaching"
              className="list-group-item fw-bold"
              id={contextTheme}
            >
              <FaCross className="mb-1" size={18} /> Enseñanzas{" "}
            </Link>
            <Link
              to="/officialbible"
              className="list-group-item fw-bold"
              id={contextTheme}
            >
              <FaBible className="mb-1" size={18} /> Biblia{" "}
            </Link>
            <Link
              to="/video"
              className="list-group-item fw-bold"
              id={contextTheme}
            >
              <BiSolidVideos className="mb-1" size={18} /> Videos{" "}
            </Link>
            <Link
              to="/glossary"
              className="list-group-item fw-bold"
              id={contextTheme}
            >
              <FaBook className="mb-1" size={18} /> Glosario{" "}
            </Link>
            <Link
              to="/contactUs"
              className="list-group-item fw-bold"
              id={contextTheme}
            >
              <BiSolidPhoneCall className="mb-1" size={18} /> Contactar{" "}
            </Link>
            <Link
              className="list-group-item fw-bold"
              onClick={handleLogout}
              id={contextTheme}
            >
              <BiPowerOff className="mb-1" size={18} /> Salir{" "}
            </Link>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
      {/* -------------------------------------------------------------- */}
    </Navbar>
  );
}

export default Navbard;
