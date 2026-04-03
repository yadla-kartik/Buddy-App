import api from "./api";

export const createPayment = async () => {
  const res = await api.get("/payment/create", {
    withCredentials: true,
  });
  return res.data;
};
