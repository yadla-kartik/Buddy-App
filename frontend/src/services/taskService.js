import api from "./api";

export const createTask = async (data) => {
  try {
    const res = await api.post("/tasks/create", data, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Failed to create task" };
  }
};

export const getPendingTasks = async () => {
  try {
    const res = await api.get("/tasks/pending", {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Get Tasks Error:", err);
    return { tasks: [], message: "Failed to fetch pending tasks" };
  }
};

export const getBuddyTasks = async () => {
  try {
    const res = await api.get("/tasks/buddy/my", {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Get Buddy Tasks Error:", err);
    return { tasks: [], message: "Failed to fetch buddy tasks" };
  }
};

export const acceptTask = async (taskId) => {
  try {
    const res = await api.post(
      `/tasks/accept/${taskId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    console.error("Accept Task Error:", err);
    return err.response?.data || { message: "Failed to accept task" };
  }
};

export const rejectTask = async (taskId) => {
  try {
    const res = await api.post(
      `/tasks/reject/${taskId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    console.error("Reject Task Error:", err);
    return err.response?.data || { message: "Failed to reject task" };
  }
};

export const completeTask = async (taskId) => {
  try {
    const res = await api.post(
      `/tasks/complete/${taskId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    console.error("Complete Task Error:", err);
    return err.response?.data || { message: "Failed to complete task" };
  }
};

export const getUserTasks = async () => {
  try {
    const res = await api.get("/tasks/user", {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Get User Tasks Error:", err);
    return { tasks: [], message: "Failed to fetch user tasks" };
  }
};
