import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión con Google");
      navigate("/");
      return;
    }

    try {
      await addToCart(product._id, 1);
      alert("Producto agregado al carrito");
    } catch (error) {
      alert(error?.response?.data?.message || "No se pudo agregar al carrito");
    }
  };

  return (
    <article className="product-card">
      <div className="product-card__image-box">
        <span className="pill-tag">{product.gender === "hombre" ? "Hombre" : product.gender === "mujer" ? "Mujer" : "Unisex"}</span>

        <button className="wishlist-btn" type="button">
          <Heart size={20} />
        </button>

        <img
          src={product.imageUrl || "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop"}
          alt={product.name}
          className="product-card__image"
        />
      </div>

      <div className="product-card__body">
        <p className="product-card__brand">{product.brand}</p>
        <h3 className="product-card__title">{product.name}</h3>

        <div className="chips">
          {(product.tags || []).slice(0, 4).map((tag, index) => (
            <span key={index} className="chip">
              {tag}
            </span>
          ))}
        </div>

        <div className="product-card__footer">
          <div>
            <div className="product-card__price">{formatPrice(product.price)}</div>
            <div className="product-card__size">{product.sizeMl || 100}ml</div>
          </div>

          <button className="cart-round-btn" onClick={handleAddToCart}>
            <ShoppingBag size={20} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;