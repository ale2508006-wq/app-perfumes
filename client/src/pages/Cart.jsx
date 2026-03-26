import Navbar from "../components/Navbar";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, updateItem, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const items = cart?.items || [];

  return (
    <main className="simple-page">
      <Navbar />

      <section className="simple-container">
        <h1>Carrito</h1>

        {items.length === 0 ? (
          <div className="empty-box">Tu carrito está vacío.</div>
        ) : (
          <div className="cart-list-simple">
            {items.map((item) => (
              <article key={item.productId} className="cart-item-card">
                <img src={item.image || item.imageUrl} alt={item.name} />
                <div className="cart-item-main">
                  <h3>{item.name}</h3>
                  <p>{item.size} ml</p>
                  <strong>${Number(item.price).toFixed(2)}</strong>
                </div>

                <div className="cart-item-actions">
                  <button
                    onClick={() =>
                      updateItem(item.productId, item.quantity - 1)
                    }
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateItem(item.productId, item.quantity + 1)
                    }
                  >
                    +
                  </button>

                  <button
                    className="danger-light"
                    onClick={() => removeItem(item.productId)}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}

            <div className="cart-summary-box">
              <p>Subtotal: ${Number(cart?.subtotal || 0).toFixed(2)}</p>
              <p>Total: ${Number(cart?.total || 0).toFixed(2)}</p>

              <button className="danger-solid" onClick={clearCart}>
                Vaciar carrito
              </button>

                <button 
                className="btn-primary"
                onClick={() => navigate("/checkout")}>
                Ir a pagar
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}