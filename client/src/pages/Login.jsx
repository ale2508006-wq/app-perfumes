import { useState } from "react";
import { ArrowLeft, Chrome } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithGoogle } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const mode = searchParams.get("mode") || "user";
  const isAdmin = mode === "admin";

  const title = isAdmin ? "Acceso de administrador" : "Acceso a la tienda";
  const description = isAdmin
    ? "Solo las cuentas autorizadas como administrador podrán entrar al panel."
    : "Cualquier persona puede iniciar sesión con Google para ver el catálogo y comprar.";

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const backendUser = await loginWithGoogle(
        isAdmin ? "administrador" : "usuario"
      );

      if (isAdmin) {
        if (backendUser?.role !== "administrador") {
          setErrorMessage("Esta cuenta no tiene permisos de administrador.");
          return;
        }

        navigate("/admin", { replace: true });
        return;
      }

      navigate("/products", { replace: true });
    } catch (error) {
      console.error("Error de login:", error);

      const backendMessage =
        error?.response?.data?.message ||
        "No se pudo iniciar sesión. Verifica Firebase, backend y la URL de la API.";

      setErrorMessage(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <button className="back-link" onClick={() => navigate("/")}>
          <ArrowLeft size={18} />
          Volver
        </button>

        <h1>{title}</h1>
        <p>{description}</p>

        <button
          className="google-login-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          <Chrome size={20} />
          {loading ? "Ingresando..." : "Iniciar sesión con Google"}
        </button>

        {errorMessage && <div className="login-error">{errorMessage}</div>}
      </div>
    </main>
  );
}