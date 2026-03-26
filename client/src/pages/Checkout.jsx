import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../stripe";
import CheckoutForm from "../components/CheckoutForm";
import { useCart } from "../hooks/useCart";
import Navbar from "../components/Navbar";

export default function Checkout() {
  const { cart } = useCart();

  return (
    <main className="simple-page">
      <Navbar />

      <section className="simple-container">
        <h1>Pago</h1>

        <Elements stripe={stripePromise}>
          <CheckoutForm cart={cart} />
        </Elements>
      </section>
    </main>
  );
}