import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { getProductsApi } from "../api/productApi";
import { useCart } from "../hooks/useCart";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("Todos");
  const [maxPrice, setMaxPrice] = useState(2000);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProductsApi();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = category === "Todos" ? true : product.category === category;
      const priceMatch = Number(product.price) <= Number(maxPrice);
      return categoryMatch && priceMatch;
    });
  }, [products, category, maxPrice]);

  const handleAddToCart = async (id) => {
    try {
      await addToCart(id, 1);
      alert("Producto agregado al carrito");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "No se pudo agregar al carrito.");
    }
  };

  return (
    <main className="store-page">
      <Navbar />

      <section className="store-hero">
        <h1>Nuestra Colección</h1>
        <p>{filteredProducts.length} fragancias exclusivas disponibles</p>
      </section>

      <section className="store-content">
        <aside className="filters-card">
          <h3>Filtros</h3>

          <div className="filter-group">
            <p>CATEGORÍA</p>

            <label className="radio-option">
              <input
                type="radio"
                name="category"
                checked={category === "Todos"}
                onChange={() => setCategory("Todos")}
              />
              <span>Todos</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="category"
                checked={category === "Hombre"}
                onChange={() => setCategory("Hombre")}
              />
              <span>Hombre</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="category"
                checked={category === "Mujer"}
                onChange={() => setCategory("Mujer")}
              />
              <span>Mujer</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="category"
                checked={category === "Unisex"}
                onChange={() => setCategory("Unisex")}
              />
              <span>Unisex</span>
            </label>
          </div>

          <div className="filter-group">
            <p>RANGO DE PRECIO</p>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="price-range"
            />
            <div className="price-range-values">
              <span>$0</span>
              <span>${maxPrice}</span>
            </div>
          </div>
        </aside>

        <div className="products-grid-custom">
          {filteredProducts.map((product) => (
            <article className="product-card-custom" key={product._id}>
              <div className="product-image-wrap">
                <img src={product.image} alt={product.name} />
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                <div className="product-meta-row">
                  <span>{product.category}</span>
                  <span>{product.size} ml</span>
                </div>
                <div className="product-bottom-row">
                  <strong>${Number(product.price).toFixed(2)}</strong>
                  <button onClick={() => handleAddToCart(product._id)}>
                    Agregar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}