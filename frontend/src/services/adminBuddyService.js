import api from "./api";

// ✅ GET ALL BUDDIES (ONLY NAME + EMAIL)
export const getAllBuddies = async () => {
  try {
    const res = await api.get("/admin/buddies", {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Get all buddies error:", err);
    return [];
  }
};

// ✅ GET SINGLE BUDDY (FULL DATA FOR POPUP)
export const getBuddyById = async (id) => {
  try {
    const res = await api.get(`/admin/buddies/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Get buddy by id error:", err);
    return null;
  }
};

// ✅ VERIFY BUDDY (ACCEPT)
export const verifyBuddy = async (id) => {
  try {
    const res = await api.patch(
      `/admin/buddies/${id}/verify`,
      {},
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    console.error("Verify buddy error:", err);
    return null;
  }
};
