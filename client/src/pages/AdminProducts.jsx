import { useEffect, useMemo, useState } from "react";
import { LogOut, Pencil, Plus, Trash2, X, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  createProductApi,
  deleteProductApi,
  getAdminProductsApi,
  updateProductApi,
} from "../api/productApi";

const initialForm = {
  name: "",
  price: "",
  stock: "",
  size: "",
  category: "Unisex",
  image: "",
  description: "",
};

function ProductModal({ open, onClose, onSave, form, setForm, editing }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="product-modal">
        <div className="product-modal-header">
          <h2>{editing ? "Editar Producto" : "Nuevo Producto"}</h2>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="product-modal-body">
          <label>
            Nombre del Producto *
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>

          <div className="two-columns">
            <label>
              Precio (MXN) *
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </label>

            <label>
              Tamaño (ml) *
              <input
                type="number"
                min="0"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
              />
            </label>
          </div>

          <div className="two-columns">
            <label>
              Stock *
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </label>

            <label>
              Categoría *
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="Unisex">Unisex</option>
                <option value="Hombre">Hombre</option>
                <option value="Mujer">Mujer</option>
              </select>
            </label>
          </div>

          <label>
            URL de la Imagen *
            <input
              type="text"
              placeholder="https://..."
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </label>

          <label>
            Descripción
            <textarea
              rows="5"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
        </div>

        <div className="product-modal-actions">
          <button className="primary-save-btn" onClick={onSave}>
            {editing ? "Actualizar Producto" : "Crear Producto"}
          </button>
          <button className="secondary-cancel-btn" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const loadProducts = async () => {
    try {
      const data = await getAdminProductsApi();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const resetModal = () => {
    setForm(initialForm);
    setEditing(null);
    setShowModal(false);
  };

  const handleOpenCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const handleOpenEdit = (product) => {
    setEditing(product._id);
    setForm({
      name: product.name || "",
      price: product.price || "",
      stock: product.stock || "",
      size: product.size || "",
      category: product.category || "Unisex",
      image: product.image || "",
      description: product.description || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock || !form.size || !form.category || !form.image) {
      alert("Completa los campos obligatorios.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      size: Number(form.size),
      category: form.category,
      image: form.image.trim(),
      description: form.description.trim(),
    };

    try {
      setSaving(true);

      if (editing) {
        await updateProductApi(editing, payload);
      } else {
        await createProductApi(payload);
      }

      resetModal();
      await loadProducts();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "No se pudo guardar el producto.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("¿Deseas eliminar este producto?");
    if (!confirmed) return;

    try {
      await deleteProductApi(id);
      await loadProducts();
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "No se pudo eliminar.");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const tableRows = useMemo(() => {
    return products.map((product) => (
      <tr key={product._id}>
        <td>
          <div className="admin-product-cell">
            <img src={product.image} alt={product.name} />
            <div>
              <h4>{product.name}</h4>
              <p>{product.description || "Fragancia exclusiva..."}</p>
            </div>
          </div>
        </td>
        <td>${Number(product.price).toFixed(2)}</td>
        <td>
          <span
            className={
              Number(product.stock) > 14
                ? "stock-pill stock-green"
                : Number(product.stock) > 7
                ? "stock-pill stock-yellow"
                : "stock-pill stock-red"
            }
          >
            {product.stock} unidades
          </span>
        </td>
        <td>{product.size} ml</td>
        <td>{product.category}</td>
        <td>
          <div className="admin-actions">
            <button className="edit-btn" onClick={() => handleOpenEdit(product)}>
              <Pencil size={18} />
            </button>
            <button className="delete-btn" onClick={() => handleDelete(product._id)}>
              <Trash2 size={18} />
            </button>
          </div>
        </td>
      </tr>
    ));
  }, [products]);

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <div className="brand-block">
          <div className="brand-logo-circle">◈</div>
          <div>
            <h2>L&apos;ESSENCE</h2>
            <p>BOUTIQUE</p>
          </div>
        </div>

        <button className="logout-pill" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Salir</span>
        </button>
      </header>

      <section className="admin-content">

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1>Panel de Administrador</h1>
            <p>Gestiona los productos de tu tienda</p>
          </div>
        </div>

        <button className="add-product-btn" onClick={handleOpenCreate}>
          <Plus size={22} />
          <span>Agregar Producto</span>
        </button>

        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>PRODUCTO</th>
                <th>PRECIO</th>
                <th>STOCK</th>
                <th>TAMAÑO</th>
                <th>CATEGORÍA</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>{tableRows}</tbody>
          </table>
        </div>
      </section>

      <ProductModal
        open={showModal}
        onClose={resetModal}
        onSave={handleSave}
        form={form}
        setForm={setForm}
        editing={editing}
      />

      {saving && <div className="page-loader-overlay">Guardando...</div>}
    </main>
  );
}