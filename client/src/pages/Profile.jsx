import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Profile() {
  const { dbUser, firebaseUser } = useAuth();

  return (
    <section className="container" style={{ padding: "24px" }}>
      <div
        style={{
          marginBottom: "24px",
          padding: "24px",
          borderRadius: "18px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(212, 175, 55, 0.12)",
        }}
      >
        <h2 style={{ marginBottom: "12px" }}>Perfil de Usuario</h2>

        <p>
          <strong>Nombre:</strong>{" "}
          {dbUser?.name || firebaseUser?.displayName || "Sin nombre"}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {dbUser?.email || firebaseUser?.email || "Sin email"}
        </p>
        <p>
          <strong>Rol guardado:</strong> {dbUser?.role || "usuario"}
        </p>

        <div style={{ marginTop: "18px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link to="/products" className="gold-button">
            Ir a tienda
          </Link>

          <Link to="/admin" className="outline-button">
            Ir a administrador
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Profile;