import axios from "axios";
import { API_URL } from "../utils/constants";

export const createOrderApi = async (token, shippingAddress) => {
  const response = await axios.post(
    `${API_URL}/orders`,
    { shippingAddress },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getOrdersApi = async (token) => {
  const response = await axios.get(`${API_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};