import api from "./api";

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

export const rejectBuddy = async (id, reason = "") => {
  try {
    const res = await api.patch(
      `/admin/buddies/${id}/reject`,
      { reason },
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    console.error("Reject buddy error:", err);
    return null;
  }
};
