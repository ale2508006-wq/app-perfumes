import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductByIdApi } from "../api/productApi";
import { formatPrice } from "../utils/formatPrice";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadProduct = async () => {
      const response = await getProductByIdApi(id);
      setProduct(response.data);
    };
    loadProduct();
  }, [id]);

  if (!product) return <p>Cargando...</p>;

  const handleAdd = async () => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión");
      return;
    }
    await addToCart(product._id, 1);
    alert("Producto agregado");
  };

  return (
    <div className="container">
      <img
        src={product.imageUrl || "/images/perfumes/perfume1.jpg"}
        alt={product.name}
        className="detail-image"
      />
      <h2>{product.name}</h2>
      <p>{product.brand}</p>
      <p>{product.description}</p>
      <p>Género: {product.gender}</p>
      <p>Stock: {product.stock}</p>
      <h3>{formatPrice(product.price)}</h3>
      <button onClick={handleAdd}>Agregar al carrito</button>
    </div>
  );
}

export default ProductDetail;
