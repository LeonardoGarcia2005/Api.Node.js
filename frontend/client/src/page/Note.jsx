import { Formik, Form, Field, ErrorMessage } from "formik";
import "../styles/Note.css";
import { useMutation } from "@apollo/client";
import { ALL_NOTES, CREATE_NOTES } from "../graphql/notes.js";
import Navbard from "../Navbar";
import { useState, useEffect } from "react";
import { GiNotebook } from "react-icons/gi";
import { Modal } from "react-bootstrap";
import CardNote from "../components/CardNote";
import { useThemeContext } from "../context/ThemeContext";
import { useQuery } from "@apollo/client";
import ErrorNotification from "../errors/ErrorNotification";

function Notas() {
  /* ------------------hooks--------------------- */
  const { contextTheme } = useThemeContext(); //contexto para cambiar modo claro a modo oscuro 
  const [show, setShow] = useState(false); //cambios de estados para mostrar el modal de crear nota
  const [user, setUser] = useState(); //estados para recuperar información del usuario
  const [errors, setErrors] = useState(); //Aqui almacenaremos los errores de todas las consultas para pasarlo al componente para las notificaciones
  /* ---------------servicios------------------ */
  const { data: notesData } = useQuery(ALL_NOTES); /* Servicio para mostrar todas las notas creadas */
  const [createNotes] = useMutation(CREATE_NOTES); /* Servicio para crear notas */
  const handleSubmit = async (values) => {

      /* función encargada de enviar al componente el mensaje (error) */
      const handleErrors = (errorMessage) => {
        setErrors(errorMessage);
      };

    // Lógica para enviar los values que provienen del formulario (formik) posteriormente se 
    try {
      await createNotes({
        variables: {
          input: {
            title: values.title, 
            description: values.description,
            userId: user.id,
          },
        },
      });

      window.location.href = "/add-nota";
      setShow(false);
    } catch (error) {
     handleErrors("Failed handleSubmit:  " + error.message);
    }
  };

  const handleShow = () => setShow(true);
  const handleCloseCancel = () => setShow(false);
  const handleCloseAccept = () => setShow(false);

  useEffect(() => {
    // Recupera la información del usuario desde localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  return (
    <>
      <Navbard />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div className="card container mt-5" id={contextTheme}>
        <div className="d-flex border-bottom-theme" style={{height: "80px"}}>
          <h3
            className="mx-auto fw-bold text-white my-auto d-inline-flex title"
            style={{ fontSize: "35px" }}
          >
            Notas
          </h3>
        </div>
        <div className="card-body row">
          <div
            className="col-11 mx-auto overflow-auto p-3 my-4 rounded-1 border-theme"
            style={{ height: "600px" }}
            id={contextTheme}
          >
            {/* icono que abre el modal para crear nota */}
            <GiNotebook
              type="button"
              className="text-secondary note-icon"
              size={35}
              onClick={handleShow}
            />
            <span className="text-secondary fw-bold">Crear Nota</span>
            {/* --------------------------------------- */}

            {/* map que crea las cards de acuerdo a la cantidad que haya */}
            <div className="d-flex justify-content-center flex-wrap my-3">
              {notesData &&
                notesData.getAllNote.map((note) => (
                  <div className="m-1 col-12" key={note.id}>
                    <CardNote task={note} />
                  </div>
                ))}
            </div>
            {/*  ------------------------------------------------------------ */}

            {/* -------------------modal para crear nota-------------------- */}
            <Modal show={show} centered>
              <Formik
                // Validación de campos
                validate={(values) => {
                  const errors = {};
                  if (!values.title) {
                    errors.title = "Debes ingresar un titulo";
                  }
                  if (!values.description) {
                    errors.description = "Debes ingresar algun contenido";
                  }
                  return errors;
                }}
                initialValues={{
                  title: "",
                  description: "",
                  completed: false,
                }}
                onSubmit={handleSubmit}
              >
                <div>
                  <Form
                    className="note-form p-5 fonts-letter rounded-1"
                    id={contextTheme}
                  >
                    <h3 className="text-center title res-title-note">
                      Crear Nota
                    </h3>
                    <label htmlFor="title" className="note-label text-primary">
                      - Titulo
                    </label>
                    <Field
                      id={contextTheme}
                      type="text"
                      name="title"
                      autoFocus
                      maxLength="20"
                      className="note-input rounded border border-secondary"
                      placeholder="Ingrese el nombre del libro"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="note-error-message"
                      style={{ fontSize: "12px" }}
                    />
                    <label
                      htmlFor="description"
                      className="note-label text-primary"
                    >
                      - Descripción
                    </label>
                    <Field
                      id={contextTheme}
                      as="textarea" // Utilizamos "as" para indicar que queremos un textarea
                      name="description"
                      rows="8"
                      placeholder="Ingrese una descripción"
                      className="note-textarea rounded border border-secondary"
                      style={{ height: "150px" }}
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="note-error-message"
                      style={{ fontSize: "12px" }}
                    />
                    <div className="mt-3 d-flex justify-content-center">
                      <button
                        className="btn glow-danger-hover text-white mx-2 px-5"
                        type="button"
                        onClick={handleCloseCancel}
                      >
                        Cancelar
                      </button>
                      <button
                        className="btn glow-on-hover text-white mx-2 px-5"
                        type="submit"
                        onClick={handleCloseAccept}
                      >
                        Guardar
                      </button>
                    </div>
                  </Form>
                </div>
              </Formik>
            </Modal>
            {/* --------------------------------------- */}
          </div>
        </div>
      </div>
            {/* Mostrar notificaciones de errores */}
            {errors && <ErrorNotification error={errors} />}
    </>
  );
}

export default Notas;
