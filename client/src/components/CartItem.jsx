import { Trash2 } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { formatPrice } from "../utils/formatPrice";

function CartItem({ item }) {
  const { updateItem, removeItem } = useCart();

  const decrease = async () => {
    await updateItem(item.productId, item.quantity - 1);
  };

  const increase = async () => {
    await updateItem(item.productId, item.quantity + 1);
  };

  return (
    <div className="cart-item">
      <img
        src={item.imageUrl || "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop"}
        alt={item.name}
        className="cart-item__image"
      />

      <div className="cart-item__info">
        <p className="cart-item__brand">{item.brand || "PERFUME"}</p>
        <h3>{item.name}</h3>
        <p>{item.sizeMl || 100}ml</p>

        <div className="qty-box">
          <button onClick={decrease}>−</button>
          <span>{item.quantity}</span>
          <button onClick={increase}>+</button>
        </div>
      </div>

      <div className="cart-item__side">
        <button className="trash-btn" onClick={() => removeItem(item.productId)}>
          <Trash2 size={20} />
        </button>
        <div className="cart-item__price">{formatPrice(item.price * item.quantity)}</div>
      </div>
    </div>
  );
}

export default CartItem;