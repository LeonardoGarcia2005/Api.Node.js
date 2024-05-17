import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TbCross } from "react-icons/tb";
import { useThemeContext } from "../context/ThemeContext";
import { LOADING_VERSE } from "../graphql/verses";
import { useQuery } from "@apollo/client";
import "../styles/Loading.css";

function ProtectedRouter() {
  const { data: loadingVerse } = useQuery(LOADING_VERSE);
  const { isAuthenticated } = useAuth();
  const [showLoading, setShowLoading] = useState(true);
  const { contextTheme } = useThemeContext();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowLoading(false);
    }, 4000);

    // Limpiar el temporizador si el componente se desmonta antes de que se complete el tiempo de espera
    return () => clearTimeout(timeoutId);
  }, []);

  if (!isAuthenticated) {
    // Si no está autenticado, redirige a la página de inicio de sesión
    return <Navigate to="/login" />;
  }

  if (showLoading || !loadingVerse) {
    // Si la autenticación aún se está cargando o los datos no están disponibles, renderiza un indicador de carga
    return (
      <>
        <div
          className="d-flex justify-content-center align-items-center vh-100"
          id={contextTheme}
          style={{ height: "100%" }}
        >
          <TbCross
            className="position-absolute text-secondary "
            size={350}
            style={{ opacity: "0.1" }}
          ></TbCross>
          <div className="text-center">
            <div className="my-4 font-loading-title charging">Cargando</div>
            <div className="loader mx-auto mb-4"></div>
            <div style={{ height: "40px" }}>
              <p
                className="fw-bold mx-4 font-loading-subtitle"
                id={contextTheme}
              >
                {loadingVerse && loadingVerse.loadVerse?.verse?.text || ""}
              </p>
              <h6 className="fw-bold" id={contextTheme}>
                {loadingVerse && loadingVerse.loadVerse?.book?.modernName + " "}{loadingVerse && loadingVerse.loadVerse?.chapter?.chapter + ":"}{loadingVerse && loadingVerse.loadVerse?.verse?.verse}
              </h6>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Si está autenticado y los datos están disponibles, renderiza el componente solicitado
  return <Outlet />;
}

export default ProtectedRouter;