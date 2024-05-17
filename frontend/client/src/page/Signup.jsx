import { useMutation } from '@apollo/client'
import { REGISTER_USER } from '../graphql/auth.js'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import '../styles/LoginSignup.css'
import { useThemeContext } from '../context/ThemeContext'

function Signup() {
/* -----------------------------hooks------------------------------- */
  const { contextTheme } = useThemeContext() /* constante para traer modo claro */
  const [showAlert, setShowAlert] = useState(false); //estados que muestran el alert en caso de error
  const [alertMessage, setAlertMessage] = useState(""); //estados para mostrar un mensaje de error
  const [alertType, setAlertType] = useState('success')
  const { authenticate } = useAuth()
  const navigate = useNavigate() /* hook usado para navegar entre paginas, en este caso, a la pagina principal Homepage*/
/* ---------------------------servicios----------------------------- */
  const [registerUser] = useMutation(REGISTER_USER) /* Servicio para registrar al nuevo usuario */

  
  const handleSubmit = async (values) => {
    try {
      // Llamada a la mutación con los valores del formulario
      const { data } = await registerUser({
        variables: {
          input: {
            username: values.username,
            email: values.email,
            password: values.password,
          },
        },
      })

      const token = data.registerUser.userJwtToken.token
      const infoUser = data.registerUser

      authenticate(token, infoUser)

      // Redirige al usuario a la página de inicio
      navigate('/homepage')

      // Ocultar alerta después de 3000 milisegundos (3 segundos)
      setTimeout(() => {
        setShowAlert(false)
      }, 3000)
    } catch (error) {
      // Manejar errores de la mutación
      console.error(error)

      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        // Si hay errores de GraphQL, mostrar el primer mensaje de error
        setShowAlert(true)
        setAlertType('error')
        setAlertMessage(error.graphQLErrors[0].message)
      } else {
        // Si no hay errores de GraphQL, mostrar un mensaje genérico
        setShowAlert(true)
        setAlertType('error')
        setAlertMessage('Error en el registro')
      }

      // Ocultar alerta después de 3000 milisegundos (3 segundos)
      setTimeout(() => {
        setShowAlert(false)
      }, 3000)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center animate__animated animate__fadeIn bg-ip">
      <div className="form_container p-5 rounded-5" id={contextTheme}>
        {/* inicio del formulario usando la librería formik */}
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
          }}
          // Validación de campos
          validate={(values) => {
            const errors = {}
            if (!values.username) {
              errors.username = 'El usuario es obligatorio'
            }
            if (!values.email) {
              errors.email = 'El correo electrónico es obligatorio'
            }
            if (!values.password) {
              errors.password = 'Contraseña obligatoria'
            }
            return errors
          }}
          // Función a ejecutar al enviar el formulario
          onSubmit={handleSubmit}
        >
          <Form>
            <h3 className="text-center title-log text-bold res-text">
              Registrarse
            </h3>
            <div className="mb-2 text-primary mt-2">
              <label htmlFor="username" className="res-label">
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
                style={{ fontSize: '12px' }}
              />
            </div>
            <div className="mb-2 text-primary">
              <label htmlFor="email" className="res-label">
                Correo Electrónico
              </label>
              <Field
                type="email"
                name="email"
                placeholder="Ingrese su correo electronico"
                className="form-control"
                id={contextTheme}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger"
                style={{ fontSize: '12px' }}
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
                style={{ fontSize: '12px' }}
              />
            </div>
            <div className="d-grid mt-4">
              <button className="glow-on-hover btn rounded-3" type="submit">
                Aceptar
              </button>
            </div>
            <p className="text-center mt-2 text-secondary">
              <small>
                <Link to="/login">Inicia Sesión Aquí</Link>
              </small>
            </p>
          </Form>
        </Formik>
        {/* final del formulario usando la librería formik */}
      </div>
      {/* mostrar alerta */}
      {showAlert && (
        <div
          className={`alert position-absolute bottom-0 end-0 alert-container mt-5 me-3 ${
            alertType === 'success' ? 'alert-success' : 'alert-danger'
          }`}
          role="alert"
        >
          {alertMessage}
        </div>
      )}

      {/* ----------------- */}
    </div>
  )
}

export default Signup
