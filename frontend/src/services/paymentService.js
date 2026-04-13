import api from "./api";

export const createPayment = async (taskId) => {
  const res = await api.get("/payment/create", {
    params: { taskId },
    withCredentials: true,
  });
  return res.data;
};
