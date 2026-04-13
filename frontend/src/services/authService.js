import api from "./api";

export const loginUser = async (data) => {
  try {
    const res = await api.post("/auth/login", data);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const registerUser = async (data) => {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (error) {
    return error.response?.data; 
  }
};

export const getMe = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (err) {
    return null;
  }
};

export const changePassword = async (data) => {
  try {
    // data should contain { currentPassword, newPassword }
    const res = await api.put("/auth/change-password", data);
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Failed to change password" };
  }
};

export const updateProfile = async (data) => {
  try {
    const res = await api.put("/auth/update-profile", data);
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Failed to update profile" };
  }
};



export const logoutUser = async () => {
  try { await api.post("/auth/logout"); } catch (e) {}
};
