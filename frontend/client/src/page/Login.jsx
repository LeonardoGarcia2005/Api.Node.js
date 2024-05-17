import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../graphql/auth";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "../styles/LoginSignup.css";
import { Link } from "react-router-dom";
import { BiLogoGoogle } from "react-icons/bi";
import { BiLogoFacebookCircle } from "react-icons/bi";
import { useThemeContext } from "../context/ThemeContext";
import { useGoogleLogin } from "@react-oauth/google";
import { SIGN_UP_GOOGLE } from "../graphql/auth";

function Login() {
  /* -------------------------hooks---------------------------- */
  const { contextTheme } = useThemeContext(); //Modo claro y oscuro
  const [showAlert, setShowAlert] = useState(false); //estados que muestran el alert en caso de error
  const [alertMessage, setAlertMessage] = useState(""); //estados para mostrar un mensaje de error
  const { authenticate } = useAuth(); //Me traigo el contexto para enviar el token necesario y validarlo
  const navigate = useNavigate(); //envía al usuario a la pagina principal si el token esta correcto
  /* -------------------------servicio------------------------------- */
  const [loginUser] = useMutation(LOGIN_USER); //envía los datos para verificar si ya existe el usuario
  const [signUpGoogle] = useMutation(SIGN_UP_GOOGLE);

  // Función para manejar el envío de datos del formulario
  const handleSubmit = async (values) => {
    try {
      const { data } = await loginUser({
        variables: {
          input: {
            username: values.username,
            password: values.password,
          },
        },
      });

      const token = data.loginUser.userJwtToken.token;
      const userInfo = {
        id: data.loginUser.id,
        username: data.loginUser.username,
        email: data.loginUser.email,
      };

      authenticate(token, userInfo);

      // Redirige al usuario a la página de inicio
      navigate("/homepage");
    } catch (error) {
      // Manejar errores de la mutación
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        // Si hay errores de GraphQL, mostrar el primer mensaje de error
        setShowAlert(true);
        setAlertMessage(error.graphQLErrors[0].message);

        // Ocultar alerta después de 3000 milisegundos (3 segundos)
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      } else {
        // Si no hay errores de GraphQL, mostrar un mensaje genérico
        setShowAlert(true);
        setAlertMessage("Error en el inicio de sesión");

        // Ocultar alerta después de 3000 milisegundos (3 segundos)
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }
    }
  };

  //Evento para manipular el envio de datos a google
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const { data } = await signUpGoogle({
          variables: { accessToken: response.access_token },
        });
        const token = data.signUpGoogle.userJwtToken.token;
        const userInfo = {
          id: data.signUpGoogle.id,
          username: data.signUpGoogle.username,
          email: data.signUpGoogle.email,
        };

        authenticate(token, userInfo);

        // Redirige al usuario a la página de inicio
        navigate("/homepage");
      } catch (error) {
        console.error(error);
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <div
      className="d-flex justify-content-center align-items-center animate__animated animate__fadeIn bg-ip"
      style={{ height: "100%" }}
    >
      {/* inicio del formulario usando la librería formik */}
      <div className="form_container p-5 rounded-5" id={contextTheme}>
        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          // Validación de campos
          validate={(values) => {
            const errors = {};
            if (!values.username) {
              errors.username = "Nombre de usuario requerido";
            }
            if (!values.password) {
              errors.password = "Contraseña requerida";
            }
            return errors;
          }}
          // Función a ejecutar al enviar el formulario
          onSubmit={handleSubmit}
        >
          <Form>
            <h3 className="text-center title-log text-bold res-text">
              Iniciar Sesión
            </h3>
            <div className="mb-2 text-primary mt-2">
              <label htmlFor="lname" className="res-label">
                Nombre de Usuario
              </label>
              <Field
                type="text"
                name="username"
                maxLength="16"
                placeholder="Ingrese su nombre de usuario"
                className="form-control"
                id={contextTheme}
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-danger"
                style={{ fontSize: "12px" }}
              />
            </div>
            <div className="mb-3 text-primary">
              <label htmlFor="password" className="res-label">
                Contraseña
              </label>
              <Field
                type="password"
                name="password"
                placeholder="Ingrese su contraseña"
                className="form-control"
                id={contextTheme}
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger"
                style={{ fontSize: "12px" }}
              />
            </div>
            <div className="d-grid mt-4">
              <button className="glow-on-hover btn rounded-3" type="submit">
                Iniciar Sesión
              </button>
            </div>
            <div className="my-3 text-secondary row res-a">
              <div className="col-md-7 col-lg-7">
                <small>
                  ¿Olvidaste la <a href="#!">Contraseña</a>?
                </small>
              </div>
              <div className="col-md-5 col-lg-5 col-xs-6">
                <small className="">
                  <Link to="/signup">Registrate Aquí</Link>
                </small>
              </div>
            </div>
            {/* botones de google y facebook */}
            <div className="grid mb-2">
              <button
                type="button"
                className="btn text-secondary btn-custom"
                onClick={handleGoogleLogin}
              >
                <small className="res-but">Ingresa con</small>
                <BiLogoGoogle size={17} />
              </button>
              <div className="text-secondary my-auto text-center container">
                o
              </div>
              <button type="button" className="btn text-secondary btn-custom">
                <small className="res-but">Ingresa con</small>
                <BiLogoFacebookCircle size={17} />
              </button>
            </div>
            {/*  ---------------------------- */}
          </Form>
        </Formik>
        {/* final del formulario usando la librería formik */}
      </div>
      {/* mostrar alerta */}
      {showAlert && (
        <div
          className="alert position-absolute bottom-0 end-0 alert-container mt-5 me-3"
          role="alert"
        >
          {alertMessage}
        </div>
      )}
      {/*  ------------------- */}
    </div>
  );
}

export default Login;
