import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Search,
  User,
  MapPin,
  Phone,
  ClipboardList,
} from "lucide-react";
import BuddyNav from "./BuddyNav";
import { getBuddyStatus } from "../../services/buddyAuthService";
import {
  acceptTask,
  completeTask,
  getBuddyTasks,
  getPendingTasks,
  rejectTask,
} from "../../services/taskService";
import { connectBuddySocket, disconnectBuddySocket } from "../../services/socketService";
import { useNavigate } from "react-router-dom";

const getTaskId = (task) => String(task?._id || task?.id || "");

const statusConfig = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-600" },
  accepted: { label: "Accepted", className: "bg-blue-50 text-blue-600" },
  in_progress: { label: "In Progress", className: "bg-orange-50 text-orange-600" },
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-600" },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-600" },
};

const detectBuddyStatus = (buddy) => {
  if (!buddy) return "unregistered";
  if (buddy.verificationStatus === "rejected") return "rejected";
  if (buddy.verificationStatus === "approved" || buddy.isVerified) return "welcome";
  if (buddy.verificationStatus === "pending" || buddy.registrationCompleted) return "pending";
  return "unregistered";
};

export default function MyTasks() {
  const navigate = useNavigate();
  const [buddy, setBuddy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("available");
  const [searchQuery, setSearchQuery] = useState("");
  const [availableTasks, setAvailableTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [liveNotice, setLiveNotice] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const res = await getBuddyStatus();
        if (!res?.buddy) {
          navigate("/buddy/login");
          return;
        }

        setBuddy(res.buddy);
      } catch (error) {
        console.error("Failed to load buddy status:", error);
        navigate("/buddy/login");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  const refreshTasks = async () => {
    const [pendingRes, myRes] = await Promise.all([getPendingTasks(), getBuddyTasks()]);
    setAvailableTasks(pendingRes?.tasks || []);
    setMyTasks(myRes?.tasks || []);
  };

  useEffect(() => {
    if (!buddy?.id) return;
    refreshTasks();
  }, [buddy?.id]);

  useEffect(() => {
    if (!buddy?.id) return undefined;

    const socket = connectBuddySocket(buddy.id);

    const pushNotice = (message) => {
      if (!message) return;
      setLiveNotice(message);
      setTimeout(() => {
        setLiveNotice((prev) => (prev === message ? "" : prev));
      }, 4000);
    };

    const upsertMyTask = (incomingTask) => {
      if (!incomingTask) return;
      const incomingId = getTaskId(incomingTask);
      if (!incomingId) return;

      setMyTasks((prev) => {
        const index = prev.findIndex((item) => getTaskId(item) === incomingId);
        if (index === -1) return [incomingTask, ...prev];

        const next = [...prev];
        next[index] = { ...next[index], ...incomingTask };
        return next;
      });
    };

    const onTaskNewForCity = (payload) => {
      const incomingTask = payload?.task;
      if (!incomingTask) return;

      setAvailableTasks((prev) => {
        const incomingId = getTaskId(incomingTask);
        if (!incomingId) return prev;
        if (prev.some((item) => getTaskId(item) === incomingId)) return prev;
        return [incomingTask, ...prev];
      });

      pushNotice(payload?.message || "New task available in your city");
    };

    const onTaskUpdatedForCity = (payload) => {
      const targetTaskId = String(payload?.taskId || "");
      if (!targetTaskId) return;

      setAvailableTasks((prev) => prev.filter((item) => getTaskId(item) !== targetTaskId));
    };

    const onTaskAssignedToBuddy = (payload) => {
      const task = payload?.task;
      if (task) {
        upsertMyTask(task);
        setAvailableTasks((prev) => prev.filter((item) => getTaskId(item) !== getTaskId(task)));
      }
      pushNotice(payload?.message || "Task assigned to you");
    };

    const onTaskCompletedByBuddy = (payload) => {
      if (payload?.task) {
        upsertMyTask(payload.task);
      }
      pushNotice(payload?.message || "Task marked completed");
    };

    const onTaskRejectedByBuddy = (payload) => {
      const targetTaskId = String(payload?.taskId || "");
      if (targetTaskId) {
        setAvailableTasks((prev) => prev.filter((item) => getTaskId(item) !== targetTaskId));
      }
      pushNotice(payload?.message || "Task removed from your list");
    };

    socket.on("task:new_for_city", onTaskNewForCity);
    socket.on("task:updated_for_city", onTaskUpdatedForCity);
    socket.on("task:assigned_to_buddy", onTaskAssignedToBuddy);
    socket.on("task:completed_by_buddy", onTaskCompletedByBuddy);
    socket.on("task:rejected_by_buddy", onTaskRejectedByBuddy);

    return () => {
      socket.off("task:new_for_city", onTaskNewForCity);
      socket.off("task:updated_for_city", onTaskUpdatedForCity);
      socket.off("task:assigned_to_buddy", onTaskAssignedToBuddy);
      socket.off("task:completed_by_buddy", onTaskCompletedByBuddy);
      socket.off("task:rejected_by_buddy", onTaskRejectedByBuddy);
      disconnectBuddySocket();
    };
  }, [buddy?.id]);

  const availableFiltered = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return availableTasks;

    return availableTasks.filter((task) => {
      const text = [
        task.taskDescription,
        task.parentName,
        task.parentCurrentLocation,
        task.taskCity,
        task.userName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return text.includes(query);
    });
  }, [availableTasks, searchQuery]);

  const assignedTasks = useMemo(
    () => myTasks.filter((task) => ["accepted", "in_progress"].includes(task.status)),
    [myTasks]
  );

  const completedTasks = useMemo(
    () => myTasks.filter((task) => task.status === "completed"),
    [myTasks]
  );

  const status = detectBuddyStatus(buddy);

  const handleAccept = async (taskId) => {
    const res = await acceptTask(taskId);
    if (!res?.task) {
      alert(res?.message || "Unable to accept task");
      return;
    }

    setAvailableTasks((prev) => prev.filter((item) => getTaskId(item) !== taskId));
    setMyTasks((prev) => [res.task, ...prev.filter((item) => getTaskId(item) !== taskId)]);
    setLiveNotice(res.message || "Task accepted successfully");
  };

  const handleReject = async (taskId) => {
    const res = await rejectTask(taskId);
    if (!res) return;

    setAvailableTasks((prev) => prev.filter((item) => getTaskId(item) !== taskId));
    setLiveNotice(res.message || "Task rejected");
  };

  const handleComplete = async (taskId) => {
    const res = await completeTask(taskId);
    if (!res?.task) {
      alert(res?.message || "Unable to complete task");
      return;
    }

    setMyTasks((prev) =>
      prev.map((item) => (getTaskId(item) === taskId ? { ...item, ...res.task } : item))
    );
    setLiveNotice(res.message || "Task completed");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#6A2AFF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!buddy || status !== "welcome") {
    return (
      <div className="min-h-screen bg-[#f7f8fc] font-[Poppins,sans-serif] flex flex-col">
        <BuddyNav buddy={buddy} status={status} unreadCount={0} />
        <div className="max-w-4xl mx-auto w-full p-8">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-700 font-semibold">
            Tasks are available only after verification approval.
          </div>
        </div>
      </div>
    );
  }

  const activeList =
    activeTab === "available"
      ? availableFiltered
      : activeTab === "assigned"
      ? assignedTasks
      : completedTasks;

  return (
    <div className="min-h-screen bg-[#f7f8fc] font-[Poppins,sans-serif] flex flex-col">
      <BuddyNav buddy={buddy} status={status} unreadCount={liveNotice ? 1 : 0} />

      <main className="max-w-5xl w-full mx-auto p-6 md:p-8">
        {liveNotice ? (
          <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            {liveNotice}
          </div>
        ) : null}

        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex gap-2">
            {["available", "assigned", "completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-[#6A2AFF] to-[#D116A8] text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                {tab === "available"
                  ? `Available (${availableTasks.length})`
                  : tab === "assigned"
                  ? `My Active (${assignedTasks.length})`
                  : `Completed (${completedTasks.length})`}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks"
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#6A2AFF]"
            />
          </div>
        </div>

        {activeList.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <ClipboardList size={38} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500 font-medium">No tasks found in this section.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {activeList.map((task) => {
              const taskId = getTaskId(task);
              const st = statusConfig[task.status] || statusConfig.pending;

              return (
                <div key={taskId} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-base font-bold text-gray-900">{task.taskDescription}</h3>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${st.className}`}>
                          <Clock size={12} /> {st.label}
                        </span>
                        <span className="inline-flex rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-600">
                          {task.taskType}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <p className="flex items-center gap-2"><User size={14} /> Parent: {task.parentName}</p>
                        <p className="flex items-center gap-2"><Phone size={14} /> Parent Mobile: {task.parentMobile}</p>
                        <p className="flex items-center gap-2"><MapPin size={14} /> City: {task.taskCity}</p>
                        <p className="flex items-center gap-2"><User size={14} /> User: {task.userName || "N/A"}</p>
                      </div>

                      <p className="mt-2 text-sm text-gray-500">{task.parentCurrentLocation}</p>
                    </div>

                    <div className="flex gap-2 md:flex-col md:min-w-[180px]">
                      {activeTab === "available" ? (
                        <>
                          <button
                            onClick={() => handleAccept(taskId)}
                            className="flex-1 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(taskId)}
                            className="flex-1 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-600"
                          >
                            Reject
                          </button>
                        </>
                      ) : null}

                      {activeTab === "assigned" ? (
                        <button
                          onClick={() => handleComplete(taskId)}
                          className="flex-1 rounded-xl bg-gradient-to-r from-[#6A2AFF] to-[#D116A8] px-4 py-2.5 text-sm font-semibold text-white"
                        >
                          Mark Completed
                        </button>
                      ) : null}

                      {activeTab === "completed" ? (
                        <span className="inline-flex items-center justify-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
                          <CheckCircle2 size={14} /> Done
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
