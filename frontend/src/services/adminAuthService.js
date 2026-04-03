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

// ✅ ADMIN REGISTER
export const adminRegister = async (data) => {
  try {
    const res = await api.post("/admin/register", data, {
      withCredentials: true, // cookie set hoga
    });
    return res.data;
  } catch (err) {
    console.error("Admin Register Error:", err);
    return err.response?.data || { message: "Admin registration failed" };
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
