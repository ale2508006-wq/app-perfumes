import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: ""
  });
  const [editingId, setEditingId] = useState(null);

  // Obtener productos
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Crear o actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API}/products/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(`${API}/products`, form);
      }

      setForm({ name: "", price: "", image: "" });
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  // Eliminar
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  // Editar
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      image: product.image
    });
    setEditingId(product._id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Panel Administrador</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Precio"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <input
          placeholder="Imagen URL"
          value={form.image}
          onChange={(e) =>
            setForm({ ...form, image: e.target.value })
          }
        />

        <button type="submit">
          {editingId ? "Actualizar" : "Crear"}
        </button>
      </form>

      {/* LISTA */}
      <div>
        {products.map((p) => (
          <div key={p._id} style={{ border: "1px solid #ccc", margin: "10px" }}>
            <h3>{p.name}</h3>
            <p>${p.price}</p>

            <button onClick={() => handleEdit(p)}>Editar</button>
            <button onClick={() => handleDelete(p._id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}