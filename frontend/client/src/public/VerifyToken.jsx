import { useEffect } from "react";
import { VERIFY_TOKEN } from "../graphql/auth";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@apollo/client";

const TokenVerification = () => {
  const { isAuthenticated, authenticate, loading, logout } = useAuth();
  const [verifyToken] = useMutation(VERIFY_TOKEN);

  useEffect(() => {
    const checkToken = async () => {
      if (isAuthenticated && !loading) {
        try {
          const response = await verifyToken({
            variables: {
              token: localStorage.getItem("token"),
            },
          });

          if (!response.data.verifyToken.success) {
            // Token no válido, realiza las acciones necesarias (por ejemplo, redirigir a la página de inicio de sesión)
            logout();
          }
        } catch (error) {
          console.error("Error verificando el token:", error);
        }
      }
    };

    checkToken();
  }, [isAuthenticated, loading, verifyToken, authenticate, logout]);

  return null; // No renderiza nada en el DOM
};

export default TokenVerification;
