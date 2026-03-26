import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getDefaultRouteByRole } from "../utils/roles";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "usuario",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return setErrorMsg("Todos los campos son obligatorios");
    }

    if (form.password.length < 6) {
      return setErrorMsg("La contraseña debe tener mínimo 6 caracteres");
    }

    if (form.password !== form.confirmPassword) {
      return setErrorMsg("Las contraseñas no coinciden");
    }

    try {
      setLoading(true);

      const user = await register(
        form.name,
        form.email,
        form.password,
        form.role
      );

      navigate(getDefaultRouteByRole(user?.role), {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      switch (error.code) {
        case "auth/email-already-in-use":
          setErrorMsg("Este correo ya existe. Inicia sesión.");
          break;
        case "auth/weak-password":
          setErrorMsg("Contraseña muy débil");
          break;
        case "auth/invalid-email":
          setErrorMsg("Correo inválido");
          break;
        default:
          setErrorMsg("Error al registrarse");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="hero-page">
      <div className="hero-card" style={{ maxWidth: 460, width: "100%" }}>
        <h2 className="hero-title" style={{ fontSize: "2rem", marginBottom: 12 }}>
          Crear cuenta
        </h2>

        <p className="hero-note" style={{ marginBottom: 24 }}>
          Elige el perfil con el que deseas registrarte.
        </p>

        {errorMsg && (
          <div
            style={{
              width: "100%",
              marginBottom: 16,
              padding: "12px 14px",
              borderRadius: 14,
              background: "rgba(153, 27, 27, 0.16)",
              border: "1px solid rgba(248, 113, 113, 0.3)",
              color: "#fecaca",
            }}
          >
            {errorMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", display: "grid", gap: 14 }}
        >
          <select
            value={form.role}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, role: e.target.value }))
            }
            style={inputStyle}
          >
            <option value="usuario">Usuario normal</option>
            <option value="administrador">Administrador</option>
          </select>

          <input
            type="text"
            placeholder="Nombre completo"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            style={inputStyle}
          />

          <button className="hero-button" type="submit" disabled={loading}>
            <span>{loading ? "Creando cuenta..." : "Crear cuenta"}</span>
          </button>
        </form>

        <p className="hero-note" style={{ marginTop: 20 }}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </section>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid rgba(212, 175, 55, 0.25)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  outline: "none",
};

export default Register;