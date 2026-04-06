import api from "./api";

// ✅ User creates task
export const createTask = async (data) => {
  try {
    const res = await api.post("/tasks/create", data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    return err.response?.data;
  }
};

// ✅ Buddy gets all pending tasks
export const getPendingTasks = async () => {
  try {
    const res = await api.get("/tasks/pending", {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Get Tasks Error:", err);
    throw err;
  }
};

// ✅ Buddy accepts a task
export const acceptTask = async (taskId) => {
  try {
    const res = await api.post(`/tasks/accept/${taskId}`, {}, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Accept Task Error:", err);
    return err.response?.data || { message: "Failed to accept task" };
  }
};

// ✅ User gets their own tasks
export const getUserTasks = async () => {
  try {
    const res = await api.get("/tasks/user", {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Get User Tasks Error:", err);
    throw err;
  }
};