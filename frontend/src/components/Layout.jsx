import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { getMe } from "../services/authService";
import { connectUserSocket, disconnectUserSocket } from "../services/socketService";

const Layout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskEvent, setTaskEvent] = useState(null);
  const [taskNotice, setTaskNotice] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getMe();
      if (res?.user) {
        setUser(res.user);
      } else {
        navigate("/login");
      }
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (!user?._id) return undefined;

    const socket = connectUserSocket(user._id);

    const onTaskUserUpdate = (payload) => {
      setTaskEvent(payload);
      setTaskNotice(payload?.message || "Task status updated");
      setNotificationCount((prev) => prev + 1);

      setTimeout(() => {
        setTaskNotice((prev) =>
          prev === (payload?.message || "Task status updated") ? "" : prev
        );
      }, 5000);
    };

    socket.on("task:user_update", onTaskUserUpdate);

    return () => {
      socket.off("task:user_update", onTaskUserUpdate);
      disconnectUserSocket();
    };
  }, [user?._id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f8fc]">
        <div className="w-10 h-10 border-4 border-[#6A2AFF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <Navbar
        user={user}
        notificationCount={notificationCount}
        onNotificationClick={() => setNotificationCount(0)}
      />
      <main className="p-5 md:p-8">
        {taskNotice ? (
          <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            {taskNotice}
          </div>
        ) : null}
        <Outlet context={{ user, taskEvent }} />
      </main>
    </div>
  );
};

export default Layout;
