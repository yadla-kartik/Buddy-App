import api from "./api";

export const buddyLogin = async (data) => {
  try {
    const res = await api.post("/buddy/auth/login", data);
    return res.data;
  } catch (err) {
    console.error("Login Error:", err);
    return err.response?.data || { message: "Login failed" };
  }
};

export const buddySignup = async (data) => {
  try {
    const res = await api.post("/buddy/auth/signup", data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Signup Error:", err.response?.data || err);
    return err.response?.data || { message: "Signup failed" };
  }
};

export const registerBuddy = async (data) => {
  try {
    const res = await api.post("/buddy/auth/register", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Registration Error:", err.response?.data || err);
    return err.response?.data || { message: "Registration failed" };
  }
};

// ✅ NEW: Get buddy status
export const getBuddyStatus = async () => {
  try {
    const res = await api.get("/buddy/auth/status");
    return res.data;
  } catch (err) {
    console.error("Status Error:", err);
    throw err;
  }
};


export const logoutBuddyApi = async () => {
  try { await api.post("/buddy/auth/logout"); } catch (e) {}
};
