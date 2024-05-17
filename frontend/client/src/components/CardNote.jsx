import { useState } from "react";
import { Formik, Form, Field } from "formik";
import "../styles/CardNote.css";
import Modal from "react-bootstrap/Modal";
import { useThemeContext } from "../context/ThemeContext";
import { FaPencilAlt } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import PropTypes from "prop-types";
import { EDIT_NOTE, DELETE_NOTE } from "../graphql/notes";
import ErrorNotification from "../errors/ErrorNotification";

/* componente secundario proveniente del componente Note.js */
function NoteCardPage({ task }) {
  /* ---------------servicios------------------ */
  const [editNote] = useMutation(EDIT_NOTE);
  const [deleteNote] = useMutation(DELETE_NOTE);
  /* -----------------hooks---------------------- */
  const { contextTheme } = useThemeContext();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTrashModal, setShowTrashModal] = useState(false);
  const [errors, setErrors] = useState(); //Aqui almacenaremos los errores de todas las consultas para pasarlo al componente para las notificaciones
  const [editedTask, setEditedTask] = useState({ ...task }); // Estado hacer una copia de los valores para la tarea editada
  /* ------------------------------------------ */

  /* función encargada de enviar al componente el mensaje (error) */
  const handleErrors = (errorMessage) => {
    setErrors(errorMessage);
  };
  //Funcion para eliminar una Nota
  const handleDeleteTask = async (taskId, userId) => {
    try {
      // Llamar a la función de eliminación de tareas
      await deleteNote({
        variables: {
          deleteNoteId: taskId, 
          userId: userId,
        },
      });
      // Recargar la página después de eliminar una tarea
      window.location.href = "/add-nota";
    } catch (error) {
      handleErrors("Failed handleDeleteTask:  " + error.message);
    }
  };

  //Funcion para actualizar una Nota
  const handleUpdatetask = async (values) => {
    try {
      const { data } = await editNote({
        variables: {
          updateNoteId: task.id,
          input: {
            title: values.title,
            description: values.description,
          },
        },
      });

      // Actualiza el estado local con los cambios
      setEditedTask(data.updateNote);
      // Cierra el modal de edición después de guardar cambios
      handleCloseEditModal();
    } catch (error) {
      handleErrors("Failed handleUpdatetask:  " + error.message);
    }
  };

  /* constantes que abren y cierran el modal de editar nota  */

  const handleShowEditModal = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };
  /* ----------------------------------------------- */

  /* constantes que abren y cierran el modal de eliminar nota  */

  const handleShowTrashModal = () => {
    setShowTrashModal(true);
  };

  const handleCloseTrashModal = () => {
    setShowTrashModal(false);
  };

  /* ----------------------------------------------- */
  return (
    <>
      <div className="width-card mx-auto">
        <div className="border-theme row" id={contextTheme}>
          <div className="card-header border-bottom-theme d-flex">
            <h5 className="title h3 mt-1 res-title-note">{editedTask.title}</h5>
          </div>
          <div
            className="card-body fonts-notes overflow-auto"
            style={{ height: "200px" }}
          >
            <p id={contextTheme}>{editedTask.description}</p>
          </div>
          <div className="text-center"></div>
        </div>
        <div className="text-end">
          <FaTrashAlt
            type="button"
            className="text-danger"
            onClick={handleShowTrashModal}
            size={20}
          />
          <FaPencilAlt
            type="button"
            className="text-primary mx-3"
            onClick={handleShowEditModal}
            size={20}
          />
          <small>{formatDate(task.createdAt)}</small>
        </div>
      </div>

      {/* Modal para eliminar la tarea */}
      <Modal show={showTrashModal} centered>
        <div
          className="p-5 text-center fonts-letter rounded-1"
          id={contextTheme}
        >
          <p className="d-inline">¿Estás seguro de eliminar esta nota?</p>
          <small
            className="d-block text-secondary"
            style={{ fontSize: "15px" }}
          >
            ¡Es un cambio irreversible!
          </small>
          <div className="mt-3 d-flex justify-content-center">
            <button
              className="btn glow-danger-hover text-white mx-2 px-5"
              type="button"
              onClick={handleCloseTrashModal}
            >
              Cancelar
            </button>
            <button
              className="btn glow-on-hover text-white mx-2 px-5"
              type="submit"
              onClick={() => handleDeleteTask(task.id, task.user.id)}
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de edición */}
      <Modal show={showEditModal} centered>
        <Formik
          initialValues={{
            title: editedTask.title,
            description: editedTask.description,
          }}
          onSubmit={handleUpdatetask}
        >
          <Form
            className="note-form p-5 fonts-letter rounded-1"
            id={contextTheme}
          >
            <h3 className="text-center title">Editar Nota</h3>
            <label htmlFor="title" className="note-label text-primary">
              - Titulo
            </label>
            <Field
              type="text"
              name="title"
              maxLength="20"
              autoFocus
              className="note-input rounded border border-secondary"
              id={contextTheme}
            />

            <label htmlFor="description" className="note-label text-primary">
              - Descripción
            </label>
            <Field
              as="textarea"
              name="description"
              rows="10"
              className="note-textarea rounded border border-secondary"
              style={{ height: "250px" }}
              id={contextTheme}
            />

            <div className="mt-3 d-flex justify-content-center">
              <button
                className="btn glow-danger-hover text-white mx-2 px-5"
                type="button"
                onClick={handleCloseEditModal}
              >
                Cancelar
              </button>
              <button
                className="btn glow-on-hover text-white mx-2 px-5"
                type="submit"
                onClick={() => {
                  // Función para obtener la nota
                }}
              >
                Guardar
              </button>
            </div>
          </Form>
        </Formik>
      </Modal>
      {/* Mostrar notificaciones de errores */}
      {errors && <ErrorNotification error={errors} />}
    </>
  );
}

function formatDate(dateString) {
  const fecha = new Date(dateString * 1); //Se multiplica entre uno porque la fecha viene en microsegundos y esto lo toma como una fecha invalida
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(fecha).toLocaleDateString(undefined, options);
}

NoteCardPage.propTypes = {
  task: PropTypes.object.isRequired,
};

export default NoteCardPage;
