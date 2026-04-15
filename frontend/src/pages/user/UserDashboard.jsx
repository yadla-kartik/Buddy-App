import { useState, useEffect } from "react";
import { CheckCircle2, Users2, Wallet, Plus, ArrowRight, MessageCircle, AlertTriangle } from "lucide-react";
import { getUserTasks } from "../../services/taskService";
import { useNavigate, useOutletContext } from "react-router-dom";

const UserDashboard = () => {
  const { user } = useOutletContext();
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getUserTasks();
        if (res?.tasks) setTasks(res.tasks);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  const activeTasksCount = tasks.filter((t) => ['accepted', 'in_progress'].includes(t.status)).length;
  const buddiesCount = user?.buddiesCount ?? 0;

  const stats = [
    {
      title: "Active Tasks",
      value: activeTasksCount.toString(),
      icon: <CheckCircle2 size={20} />,
      gradient: "from-violet-500 to-purple-600",
      light: "bg-violet-50 text-violet-600",
      badge: "Live",
      onClick: () => navigate("/tasks"),
    },
    {
      title: "Total Buddies",
      value: buddiesCount.toString(),
      icon: <Users2 size={20} />,
      gradient: "from-emerald-400 to-teal-500",
      light: "bg-emerald-50 text-emerald-600",
      badge: "Team",
      onClick: () => alert("Buddies coming soon"),
    },
    {
      title: "Total Spent",
      value: "₹2,400",
      icon: <Wallet size={20} />,
      gradient: "from-rose-400 to-pink-500",
      light: "bg-rose-50 text-rose-600",
      badge: "Budget",
      onClick: () => alert("Payments coming soon"),
    },
  ];

  const quickActions = [
    { label: "New Task",      icon: <Plus size={18} />,          sub: "Start a care request",   action: () => navigate("/create-task"), color: "from-violet-500 to-purple-600" },
    { label: "View Tasks",    icon: <CheckCircle2 size={18} />,  sub: "Review all updates",     action: () => navigate("/tasks"),       color: "from-blue-500 to-cyan-500"     },
    { label: "Message Buddy", icon: <MessageCircle size={18} />, sub: "Chat with your buddy",   action: () => alert("Coming soon"),     color: "from-emerald-500 to-teal-500"  },
    { label: "Emergency",     icon: <AlertTriangle size={18} />, sub: "Get urgent support",     action: () => alert("Coming soon"),     color: "from-rose-500 to-pink-500"     },
  ];

  return (
    <>
      {/* Welcome Banner */}
      <section className="relative bg-gradient-to-br from-[#6A2AFF] via-[#8B3FFF] to-[#D116A8] rounded-2xl p-6 md:p-6 mb-6 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/10 rounded-full" />
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[11px] font-semibold px-3 py-1 rounded-full mb-3">
              <CheckCircle2 size={12} /> Parent Dashboard
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
              Welcome back, {user?.fullName?.split(" ")[0] || "User"} 👋
            </h2>
            <p className="text-white/70 text-sm max-w-md leading-relaxed">
              Track your buddies, manage care tasks, and review monthly spending — all in one place.
            </p>
            <button
              onClick={() => navigate("/create-task")}
              className="mt-4 inline-flex items-center gap-2 bg-white text-[#6A2AFF] text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <Plus size={16} /> Create New Task
            </button>
          </div>
          <div className="hidden lg:block">
            <img src="/src/assets/buddyTrust.png" alt="Buddy" className="w-40 h-auto object-contain opacity-90" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            onClick={stat.onClick}
            className="bg-white rounded-2xl py-3 px-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.light} flex items-center justify-center`}>
                {stat.icon}
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${stat.gradient}`}>
                {stat.badge}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{stat.title}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={action.action}
              className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left group"
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-3 shadow-md`}>
                {action.icon}
              </div>
              <p className="text-sm font-semibold text-gray-800">{action.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{action.sub}</p>
            </button>
          ))}
        </div>
      </section>
    </>
  );
};

export default UserDashboard;
