import axios from "axios";
import { API_URL } from "../utils/constants";

export const createPaymentIntentApi = async (token, orderId) => {
  const response = await axios.post(
    `${API_URL}/payments/create-intent`,
    { orderId },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};
