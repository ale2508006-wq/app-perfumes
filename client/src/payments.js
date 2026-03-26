import { api, getAuthHeaders } from "./api/api";

export async function createPaymentIntent(items) {
  const headers = await getAuthHeaders();

  const { data } = await api.post(
    "/api/payments/create-payment-intent",
    { items },
    { headers }
  );

  if (!data?.clientSecret) {
    throw new Error(data?.message || "No se recibió clientSecret");
  }

  return {
    clientSecret: data.clientSecret,
    amountCents: data.amountCents,
  };
}