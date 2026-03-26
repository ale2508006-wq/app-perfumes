import axios from "axios";
import { API_URL } from "../utils/constants";

export const getCartApi = async (token) => {
  const response = await axios.get(`${API_URL}/cart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const addToCartApi = async (token, productId, quantity = 1) => {
  const response = await axios.post(
    `${API_URL}/cart/add`,
    { productId, quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateCartItemApi = async (token, productId, quantity) => {
  const response = await axios.put(
    `${API_URL}/cart/update/${productId}`,
    { quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const removeCartItemApi = async (token, productId) => {
  const response = await axios.delete(`${API_URL}/cart/remove/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const clearCartApi = async (token) => {
  const response = await axios.delete(`${API_URL}/cart/clear`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};