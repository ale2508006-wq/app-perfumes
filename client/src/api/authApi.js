import axios from "axios";
import { API_URL } from "../utils/constants";

export const syncUserApi = async (token) => {
  const response = await axios.post(
    `${API_URL}/auth/sync`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getProfileApi = async (token) => {
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};