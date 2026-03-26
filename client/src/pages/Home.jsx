import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="landing-page">
      <button
        className="admin-floating-btn"
        onClick={() => navigate("/login?mode=admin")}
      >
        <ShieldCheck size={16} />
        <span>Administrador</span>
      </button>

      <section className="landing-hero">
        <h1>
          Tu esencia,
          <br />
          redefinida
        </h1>

        <p>
          Descubre fragancias exclusivas que capturan la esencia de lo extraordinario
        </p>

        <button
          className="hero-main-btn"
          onClick={() => navigate("/login?mode=user")}
        >
          INICIAR SESIÓN PARA EXPLORAR
          <span className="hero-arrow">→</span>
        </button>

        <small>Inicia sesión para acceder a nuestro catálogo exclusivo</small>
      </section>
    </main>
  );
}