import { House, LogOut, ShoppingCart, User, ClipboardList } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { cart } = useCart();

  const totalItems = (cart?.items || []).reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="store-navbar">
      <div className="brand-block" onClick={() => navigate("/products")}>
        <div className="brand-logo-circle">◈</div>
        <div>
          <h2>L&apos;ESSENCE</h2>
          <p>BOUTIQUE</p>
        </div>
      </div>

      <nav className="store-center-nav">
        <button
          className={location.pathname === "/products" ? "nav-pill active" : "nav-pill"}
          onClick={() => navigate("/products")}
        >
          Tienda
        </button>

        <button
          className={location.pathname === "/orders" ? "nav-link-btn active-text" : "nav-link-btn"}
          onClick={() => navigate("/orders")}
        >
          Pedidos
        </button>

        <button
          className={location.pathname === "/cart" ? "nav-link-btn active-text" : "nav-link-btn"}
          onClick={() => navigate("/cart")}
        >
          Carrito
        </button>
      </nav>

      <div className="store-actions">
        <button className="icon-btn" onClick={() => navigate("/products")} title="Inicio">
          <House size={22} />
        </button>

        <button className="icon-btn" onClick={() => navigate("/orders")} title="Pedidos">
          <ClipboardList size={22} />
        </button>

        <button className="icon-btn" onClick={() => navigate("/cart")} title="Carrito">
          <div className="cart-icon-wrap">
            <ShoppingCart size={22} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </div>
        </button>

        <button className="icon-btn" onClick={() => navigate("/products")} title="Perfil">
          <User size={22} />
        </button>

        <button className="logout-pill" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Salir</span>
        </button>
      </div>
    </header>
  );
}