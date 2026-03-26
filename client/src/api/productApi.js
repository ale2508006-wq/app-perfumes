import axios from "axios";
import { auth } from "../firebase/config";

const API_URL = import.meta.env.VITE_API_URL;

async function buildAuthHeaders() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("No hay usuario autenticado");
  }

  const token = await user.getIdToken(true);

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getProductsApi(params = {}) {
  const { data } = await axios.get(`${API_URL}/products`, { params });
  return data;
}

export async function getAdminProductsApi() {
  const headers = await buildAuthHeaders();
  const { data } = await axios.get(`${API_URL}/products/admin/all`, { headers });
  return data;
}

export async function createProductApi(product) {
  const headers = await buildAuthHeaders();
  const { data } = await axios.post(`${API_URL}/products`, product, { headers });
  return data;
}

export async function updateProductApi(id, product) {
  const headers = await buildAuthHeaders();
  const { data } = await axios.put(`${API_URL}/products/${id}`, product, { headers });
  return data;
}

export async function deleteProductApi(id) {
  const headers = await buildAuthHeaders();
  const { data } = await axios.delete(`${API_URL}/products/${id}`, { headers });
  return data;
}