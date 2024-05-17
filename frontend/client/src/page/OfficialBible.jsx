import Navbar from "../Navbar";
import CardChapter from "../components/CardChapter";
import CardVerses from "../components/CardVerses";
import "../styles/bibleOf.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useThemeContext } from "../context/ThemeContext";
import { FaMicrophoneAlt } from "react-icons/fa";
import {
  VERSIONES_BIBLIA,
  LIBROS_BIBLIA,
  CAPITULOS_BIBLIA,
  VERSICULO_BIBLIA,
} from "../graphql/bible";
import { useQuery } from "@apollo/client";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import ErrorNotification from "../errors/ErrorNotification";
import { useRef } from "react";
import { useParams } from "react-router-dom";

function OfficialBible() {
  /* -------------------------------Servicios-------------------------------- */
  const { data: versionData } =
    useQuery(
      VERSIONES_BIBLIA
    ); /* Servicio para obtener las versiones de la biblia */
  const [getBooksByVersion, { data: libroData }] =
    useLazyQuery(
      LIBROS_BIBLIA
    ); /* Servicio para obtener los libros de la biblia */
  const [getChaptersByBook, { data: capituloData }] =
    useLazyQuery(
      CAPITULOS_BIBLIA
    ); /* Servicio para obtener todos los capitulos  */
  const [getAllVersesByChapterId, { data: versiculoData }] =
    useLazyQuery(
      VERSICULO_BIBLIA
    ); /* Servicio para obtener todos los versiculos */
  /* -----------------------hooks------------------------------------- */
  const { bookName, bookNumber, chapterNum, chapterId } = useParams(); //Valores que provienen desde el componente characterData para ver en que versiculo nombran a un personaje
  const { contextTheme } = useThemeContext(); //contexto para cambiar modo claro a modo oscuro
  const [selectedVersion, setSelectedVersion] = useState(1); //Estado para colocar por defecto la primera opción de la versión
  const [selectedBook, setSelectedBook] = useState(bookNumber || 1); //Estado para colocar por defecto el primer libro
  const [nameVersion, setNameVersion] = useState("Reina-Valera 1909"); //Estado para colocar por defecto el nombre de la versión
  const [selectedBookName, setSelectedBookName] = useState(
    bookName || "Génesis"
  ); //Estado para colocar por defecto el nombre del libro
  const [chapterNumber, setChapterNumber] = useState(chapterNum || 1); //Estado para ir actualizando el numero de capitulo en la parte superior
  const [chapterLoaded, setChapterLoaded] = useState(false); //Estado para cambiar la vista entre el capitulo y el versiculo
  const [selectedVerse, setSelectedVerse] = useState(); //Estado para almacenar los datos del versiculo
  const [currentChapter, setCurrentChapter] = useState(chapterId || 1); //Estado para ubicar el capitulo en 1 y poder ir sumando o restando en la paginación
  const [currentVerse, setCurrentVerse] = useState(1); //Estado para la paginación de los versiculos
  const [arrowsCapVisible, setArrowsCapVisible] = useState(true); // Estado para controlar la visibilidad de las flechas en el capitulo
  const [arrowsVerseVisible, setArrowsVerseVisible] = useState(false);
  const topOfPageRef = useRef(); // Se utiliza para referenciar un div para que suba cada vez que se pase de pagina
  const [errors, setErrors] = useState(); //Aqui almacenaremos los errores de todas las consultas para pasarlo al componente para las notificaciones
  const [isLoading, setIsLoading] = useState(true);

  /* función encargada de enviar al componente el mensaje (error) */
  const handleErrors = (errorMessage) => {
    setErrors(errorMessage);
  };

  /* Selección de la versión de la biblia */
  const handleVersionChange = async (e) => {
    const versionId = e.target.value;
    setSelectedVersion(versionId);

    // Obtener los Libros de cada version
    const result = await getBooksByVersion({
      variables: {
        getBooksByBibleIdId: versionId,
      },
    });
    /* Obtener mensaje en caso de error */
    if (result.error) {
      handleErrors("Failed handleVersionChange:  " + result.error.message);
      return;
    }
    /* Obtener el nombre de la version a partir de data.getAllVersion */
    const versionName = versionData.getAllVersion.find(
      (version) => version.id === versionId
    );
    if (versionName) {
      setNameVersion(versionName.version);
    }
  };

  /* Selección del libro */
  const handleBookChange = async (e) => {
    setIsLoading(true); // Inicia la pantalla de carga

    try {
      const bookId = e.target.value;
      setSelectedBook(bookId);
      // Obtener los capitulos de cada libro al seleccionarlo
      const result = await getChaptersByBook({
        variables: { getChaptersByBookIdId: bookId },
      });
      // Obtener los versiculos mediante el primer capitulo a la hora de cambiar el libro
      const firstChapter = result.data.getChaptersByBookId[0];
      const resultVerses = await getAllVersesByChapterId({
        variables: { getVersesByChapterIdId: chapterId || firstChapter.id },
      });
      /* Condicional para evaluar si el numero del capitulo es mayor para reiniciarlo a uno, a la hora de cambiar el libro y no tener irregularidades */
      if (chapterNumber > 1) {
        setChapterNumber(1);
      }
      /* Obtener mensaje en caso de error */
      if (result.error || resultVerses.error) {
        handleErrors(
          "Failed handleBookChange: " +
            (result.error ? result.error.message : "") +
            (resultVerses.error ? resultVerses.error.message : "")
        );
        return;
      }
      // Obtener el nombre del libro a partir de libroData (que es el que almacena los valores que vienen del servicio)
      const selectedBook = libroData.getBooksByBibleId.find(
        (book) => book.id === bookId
      );
      if (selectedBook) {
        setSelectedBookName(selectedBook.modernName);
      } else {
        setSelectedBookName("");
      }
    } catch (error) {
      handleErrors(error);
    } finally {
      setIsLoading(false); // Finaliza la pantalla de carga
    }
  };

  // Cambio entre capitulos al presionar algún botón
  const handleChapterChange = async (chapter, chapterNumber) => {
    const result = await getAllVersesByChapterId({
      variables: { getVersesByChapterIdId: chapter },
    });
    /* Obtener mensaje en caso de error */
    if (result.error) {
      handleErrors("Failed handleChapterChange:  " + result.error.message);
      return;
    }
    /*---------------------- hooks --------------------------- */
    setChapterLoaded(true); // Indica que la información del capítulo se ha cargado.
    setCurrentChapter(chapter); // Actualiza el capítulo actual
    setArrowsCapVisible(true); // ocultar las flechas del capitulo
    setArrowsVerseVisible(false); // mostrar las flechas del versiculo

    /* evaluar si hay un capitulo para almacenar su número */
    if (chapter) {
      setChapterNumber(chapterNumber);
    } else {
      setChapterNumber("");
    }
  };

  const handleVerseById = (verse) => {
    /* ----------------- hooks ---------------------*/
    setChapterLoaded(false); // Indica que la información del versiculo se ha cargado.
    setArrowsCapVisible(false); // ocultar las flechas del capitulo
    setArrowsVerseVisible(true); // mostrar las flechas del versiculo
    setSelectedVerse(verse); // Informacion que se pinta en la pantalla
    setCurrentVerse(verse); //enviarle los valores que genera el servicio cuando se presiona por primera vez
  };

  /* llamado de servicios para precargar la información */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Inicia la pantalla de carga

        //Cada vez que cargue la pagina me consulte los libros por defecto
        const resultBook = await getBooksByVersion({
          variables: {
            getBooksByBibleIdId: selectedVersion,
          },
        });
        /* Obtener mensaje en caso de error */
        if (resultBook.error) {
          handleErrors(
            "failed useEffect with preloaded data: " + resultBook.error.message
          );
        }
        //Llamar a getChaptersByBook con el id del libro para traer los numeros de los capitulo
        const resultChapter = await getChaptersByBook({
          variables: {
            getChaptersByBookIdId: selectedBook,
          },
        });
        /* Obtener mensaje en caso de error */
        if (resultChapter.error) {
          handleErrors(
            "failed useEffect with preloaded data: " +
              resultChapter.error.message
          );
        }

        //Llamar a handleChapterChange que es el evento onclick y se le pasara el valor por defecto de uno para que muestre los valores por defectos en el la parte visual
        handleChapterChange(currentChapter, chapterNumber);
      } catch (error) {
        handleErrors("Error al cargar la versión: " + error);
      } finally {
        setIsLoading(false); // Finaliza la pantalla de carga
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {isLoading && (
        // Pantalla de carga aquí
        <div className="d-flex justify-content-center h-100 w-100 text-light loading-screen">
          <div className="spinner-border my-auto" role="status"></div>
        </div>
      )}
      <Navbar />
      <br />
      <br />
      <br />
      <br />
      <div className="card container mt-5" id={contextTheme} ref={topOfPageRef}>
        <div className="border-bottom-theme d-flex" style={{ height: "80px" }}>
          <h3
            className="mx-auto fw-bold text-white my-auto d-inline-flex title"
            style={{ fontSize: "35px" }}
          >
            {selectedBookName}
          </h3>
        </div>
        <div className="card-body row">
          {/* Card que muestra el texto del capitulo y/o versiculo */}
          <div
            className="col-md-7 col-xs-10 mx-auto overflow-auto my-4 rounded-1 border-theme fonts-letter-bible"
            style={{ height: "600px" }}
          >
            {/* Card que se visualiza solo cuando se adapta a la pantalla de tablets o telefono. Su función es poder
             seleccionar la versión, libro, capitulo y versiculo de la biblia */}
            <div className="row display-select-bible mt-3">
              <div className="col-6">
                <select
                  className="form-select border border-secondary"
                  aria-label="Seleccionar versión"
                  id={contextTheme}
                  onChange={handleVersionChange}
                  value={selectedVersion}
                >
                  {versionData &&
                    versionData.getAllVersion.map((version) => (
                      <option key={version.id} value={version.id}>
                        {version.version}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-6">
                <select
                  className="form-select border border-secondary"
                  aria-label="Seleccionar libro"
                  id={contextTheme}
                  onChange={handleBookChange}
                  value={selectedBook}
                >
                  {libroData &&
                    libroData.getBooksByBibleId.map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.modernName}
                      </option>
                    ))}
                </select>
              </div>
              <div
                className="border-theme rounded-1 mx-auto overflow-auto mt-3"
                style={{ width: "95%" }}
              >
                <div
                  className="d-flex"
                  style={{ height: "45px", width: "100%" }}
                >
                  <div className="my-auto">Capitulo</div>
                  {capituloData &&
                    capituloData.getChaptersByBookId.map((chapter) => (
                      <div
                        className="p-2"
                        key={chapter.id}
                        onClick={() =>
                          handleChapterChange(chapter.id, chapter.chapter)
                        }
                      >
                        <CardChapter chapter={chapter} />
                      </div>
                    ))}
                </div>
              </div>
              <div
                className="border-theme rounded-1 mx-auto overflow-auto mt-3"
                style={{ width: "95%" }}
              >
                <div
                  className="d-flex"
                  style={{ height: "45px", width: "100%" }}
                >
                  <div className="my-auto">Versiculo</div>
                  {versiculoData &&
                    versiculoData.getVersesByChapterId.map((verse) => (
                      <div
                        className="p-2"
                        key={verse.id}
                        onClick={() => handleVerseById(verse)}
                        value={selectedVerse}
                      >
                        <CardVerses verse={verse} />
                      </div>
                    ))}
                </div>
              </div>
              <div
                className="border mt-4 mx-auto"
                style={{ width: "95%" }}
              ></div>
            </div>
            {/* --------------------------------------------------- */}
            <div className="padding-res">
              <h3>Capitulo {chapterNumber}</h3>
              <div className="text-secondary hover-subtext d-inline-block">
                <h6>- {nameVersion} </h6>
              </div>
              <div className="d-flex" type="button">
                <FaMicrophoneAlt /> <h6>Escuchar</h6>
              </div>
              {chapterLoaded ? (
                <div>
                  {versiculoData &&
                    versiculoData.getVersesByChapterId.map((chapter) => (
                      <div key={chapter.id}>
                        <div className="d-flex flex-row">
                          <div className="text-primary biblia mx-1">
                            {chapter.verse}
                          </div>
                          <div
                            className="mb-2 underline"
                            key={chapter.id}
                            onClick={() => handleVerseById(chapter)}
                            value={selectedVerse}
                          >
                            {chapter.text}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div>
                  {selectedVerse && (
                    <div className="mt-3">
                      <div className="h6">
                        Versículo:{" "}
                        <small className="text-primary">
                          {selectedVerse.verse}
                        </small>
                      </div>
                      <p>{selectedVerse.text}</p>
                    </div>
                  )}
                </div>
              )}
              {/* iconos para la paginación de capitulos/versiculos */}
              <div className="row mt-3">
                <div className="col-6 text-center">
                  <IoIosArrowBack
                    style={{ display: arrowsCapVisible ? "" : "none" }}
                    className="px-2 arrow-size arrow-hover"
                    size={60}
                    type="button"
                    id={contextTheme}
                    onClick={() => {
                      if (chapterNumber > 1) {
                        handleChapterChange(
                          currentChapter - 1,
                          chapterNumber - 1
                        );
                        topOfPageRef.current.scrollIntoView({
                          behavior: "smooth",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-6 text-center">
                  <IoIosArrowForward
                    style={{ display: arrowsCapVisible ? "" : "none" }}
                    className="px-2 arrow-size arrow-hover"
                    size={60}
                    type="button"
                    id={contextTheme}
                    onClick={() => {
                      if (
                        chapterNumber < capituloData.getChaptersByBookId.length
                      ) {
                        handleChapterChange(
                          parseInt(currentChapter) + 1,
                          chapterNumber + 1
                        );
                        topOfPageRef.current.scrollIntoView({
                          behavior: "smooth",
                        });
                      }
                    }}
                  />
                </div>
              </div>
              <div className="row mt-3 d-flex justify-content-center">
                <div className="col-6 text-center">
                  <IoIosArrowBack
                    style={{ display: arrowsVerseVisible ? "" : "none" }}
                    className="arrow-size arrow-hover px-2"
                    size={60}
                    type="button"
                    id={contextTheme}
                    onClick={() => {
                      if (
                        currentVerse &&
                        currentVerse.verse &&
                        versiculoData &&
                        versiculoData.getVersesByChapterId
                      ) {
                        const currentVerseIndex =
                          versiculoData.getVersesByChapterId.findIndex(
                            (verse) => verse.verse === currentVerse.verse
                          );
                        if (currentVerseIndex > 0) {
                          const updatedVerse =
                            versiculoData.getVersesByChapterId[
                              currentVerseIndex - 1
                            ];
                          handleVerseById(updatedVerse);
                        }
                      }
                    }}
                  />
                </div>
                <div className="col-6 text-center">
                  <IoIosArrowForward
                    style={{ display: arrowsVerseVisible ? "" : "none" }}
                    className="arrow-size arrow-hover px-2"
                    size={60}
                    type="button"
                    id={contextTheme}
                    onClick={() => {
                      if (
                        currentVerse &&
                        currentVerse.verse &&
                        versiculoData &&
                        versiculoData.getVersesByChapterId
                      ) {
                        const currentVerseIndex =
                          versiculoData.getVersesByChapterId.findIndex(
                            (verse) => verse.verse === currentVerse.verse
                          );
                        if (
                          currentVerseIndex <
                          versiculoData.getVersesByChapterId.length - 1
                        ) {
                          const updatedVerse =
                            versiculoData.getVersesByChapterId[
                              currentVerseIndex + 1
                            ];
                          handleVerseById(updatedVerse);
                        }
                      }
                    }}
                  />
                </div>
              </div>
              {/* ------------------------------------------------- */}
              {/* ------------------------------------------------- */}
            </div>
          </div>
          {/* card para seleccionar la version, libro, capitulo y versiculo de la biblia. Es eliminada al adaptarse
          para pantallas de tablets y telefono para ser remplazado por otro card*/}
          {/* ----------------------------------------------------- */}
          <div
            className="col-4 mx-auto overflow-auto p-5 my-4 rounded-1 border-theme bible-tlf fonts-letter-bible"
            style={{ height: "600px" }}
            id={contextTheme}
          >
            <div className="text-secondary hover-subtext d-inline-block">
              <h6>- Versión</h6>
            </div>
            <select
              className="form-select border border-secondary"
              aria-label="Seleccionar versión"
              id={contextTheme}
              value={selectedVersion}
              onChange={handleVersionChange}
            >
              {versionData &&
                versionData.getAllVersion.map((version) => (
                  <option key={version.id} value={version.id}>
                    {version.version}
                  </option>
                ))}
            </select>

            <div className="text-secondary mt-4 hover-subtext d-inline-block">
              <h6>- Libro</h6>
            </div>
            <select
              className="form-select border border-secondary"
              aria-label="Seleccionar libro"
              id={contextTheme}
              onChange={handleBookChange}
              value={selectedBook}
            >
              {libroData &&
                libroData.getBooksByBibleId.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.modernName}
                  </option>
                ))}
            </select>
            <div className="text-secondary mt-4 hover-subtext d-inline-block">
              <h6>- Capitulo</h6>
            </div>
            <div
              className="border-theme rounded-1 mx-auto overflow-auto res-card-chap-ver"
              style={{ height: "200px" }}
            >
              <div className="d-flex flex-wrap my-1">
                {capituloData &&
                  capituloData.getChaptersByBookId.map((chapter) => (
                    <div
                      className="p-2"
                      key={chapter.id}
                      onClick={() =>
                        handleChapterChange(chapter.id, chapter.chapter)
                      }
                    >
                      <CardChapter chapter={chapter} />
                    </div>
                  ))}
              </div>
            </div>
            <div className="text-secondary mt-4 hover-subtext d-inline-block">
              <h6>- Versiculo</h6>
            </div>
            <div
              className="border-theme rounded-1 mx-auto overflow-auto res-card-chap-ver"
              style={{
                height: "200px",
              }}
            >
              <div className="d-flex flex-wrap my-1">
                {versiculoData &&
                  versiculoData.getVersesByChapterId.map((verse) => (
                    <div
                      className="p-2"
                      key={verse.id}
                      onClick={() => handleVerseById(verse)}
                    >
                      <CardVerses verse={verse} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mostrar notificaciones de errores */}
      {errors && <ErrorNotification error={errors} />}
    </div>
  );
}

export default OfficialBible;
