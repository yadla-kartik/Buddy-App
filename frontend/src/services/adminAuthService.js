import api from "./api";

// ✅ ADMIN LOGIN
export const adminLogin = async (data) => {
  try {
    const res = await api.post("/admin/login", data, {
      withCredentials: true, // cookie ke liye important
    });
    return res.data;
  } catch (err) {
    console.error("Admin Login Error:", err);
    return err.response?.data || { message: "Admin login failed" };
  }
};

export const getAdminMe = async () => {
  try {
    const res = await api.get("/admin/me", {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    return null;
  }
};



export const logoutAdminApi = async () => {
  try { await api.post("/admin/logout"); } catch (e) {}
};
