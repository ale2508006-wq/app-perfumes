import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_LABELS = {
  pending: "Pendiente",
  paid: "Pagado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
  pendiente: "Pendiente",
  pagado: "Pagado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const STATUS_CLASSES = {
  pending: "pendiente",
  paid: "paid",
  shipped: "pendiente",
  delivered: "entregado",
  cancelled: "pendiente",
  pendiente: "pendiente",
  pagado: "paid",
  enviado: "pendiente",
  entregado: "entregado",
  cancelado: "pendiente",
};

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStatusLabel = (status) => {
    const key = String(status || "pending").toLowerCase();
    return STATUS_LABELS[key] || "Pendiente";
  };

  const getStatusClass = (status) => {
    const key = String(status || "pending").toLowerCase();
    return STATUS_CLASSES[key] || "pendiente";
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data?.data || []);
      } catch (error) {
        console.error("Error obteniendo pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <main className="simple-page">
      <Navbar />

      <section className="simple-container">
        <h1>Pedidos</h1>

        {loading ? (
          <div className="empty-box">Cargando pedidos...</div>
        ) : orders.length === 0 ? (
          <div className="empty-box">Aún no tienes pedidos.</div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <p className="order-id">Pedido #{order._id.slice(-6)}</p>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`status-badge ${getStatusClass(order.status)}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={`${order._id}-${index}`} className="order-item">
                      <img
                        src={item.imageUrl || item.image || ""}
                        alt={item.name}
                      />

                      <div className="order-item-info">
                        <h4>{item.name}</h4>
                        <p>Cantidad: {item.quantity}</p>
                        <span>${Number(item.price).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <strong>Total: ${Number(order.total).toFixed(2)}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}