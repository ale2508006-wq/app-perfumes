import { useEffect, useState } from "react";
import axios from "axios";
import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

export default function CheckoutForm({ cart }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { token } = useAuth();

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const items = cart?.items || [];
  const total = Number(cart?.total || 0);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        if (!items.length) return;

        const response = await axios.post(
          `${API_URL}/payments/create-payment-intent`,
          { items }
        );

        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Error creando PaymentIntent:", error);
        setMessage("No se pudo inicializar el pago.");
      }
    };

    createPaymentIntent();
  }, [items]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    if (!clientSecret) {
      setMessage("No se pudo preparar el pago.");
      return;
    }

    setLoading(true);
    setMessage("");

    const card = elements.getElement(CardElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
      },
    });

    if (result.error) {
      setMessage(
        result.error.message || "Ocurrió un error al procesar el pago."
      );
      setLoading(false);
      return;
    }

    if (result.paymentIntent?.status === "succeeded") {
      try {
        await axios.post(
          `${API_URL}/orders`,
          {
            shippingAddress: {},
            paymentIntentId: result.paymentIntent.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("Pago exitoso 🎉");
        clearCart();

        setTimeout(() => {
          navigate("/orders");
        }, 1200);
      } catch (error) {
        console.error("Error guardando pedido:", error);
        console.error("Respuesta backend:", error?.response?.data);

        setMessage(
          error?.response?.data?.message ||
            "El pago se realizó, pero no se pudo guardar el pedido."
        );
      }
    }

    setLoading(false);
  };

  if (!items.length) {
    return <div className="empty-box">Tu carrito está vacío.</div>;
  }

  return (
    <div className="checkout-box">
      <div className="cart-summary-box" style={{ marginBottom: "1rem" }}>
        <p>Productos: {items.length}</p>
        <p>Total a pagar: ${total.toFixed(2)}</p>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <div
          style={{
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: "#fff",
            marginBottom: "16px",
          }}
        >
          <CardElement />
        </div>

        <button
          type="submit"
          className="btn-pay"
          disabled={!stripe || loading || !clientSecret || !token}
        >
          {loading ? "Procesando..." : `Pagar ahora • $${total.toFixed(2)}`}
        </button>

        {message && (
          <div
            className={`payment-message ${
              message.includes("exitoso") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}