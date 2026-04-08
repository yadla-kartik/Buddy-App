import {
  CheckCircle2, Clock, Flame, TrendingUp,
  ClipboardList, BadgeCheck, Users, Target,
  ArrowUpRight, Calendar,
} from "lucide-react";

// ─── Mock data (replace with real API data in production) ─────────
const MOCK = {
  name: "Rahul Sharma",
  email: "rahul@example.com",
  city: "Mumbai",
  joinDate: "Jan 2025",
  totalTasks: 42,
  thisMonth: 7,
  monthlyGoal: 10,
  streak: 6,
  tasks: [
    { id: 1, name: "Campus orientation support", date: "Apr 6",  type: "Orientation" },
    { id: 2, name: "Mentorship session — 1hr",   date: "Apr 3",  type: "Mentorship"  },
    { id: 3, name: "Library resource guide",      date: "Mar 29", type: "Resource"    },
    { id: 4, name: "Welcome week event help",     date: "Mar 22", type: "Event"       },
    { id: 5, name: "Study group facilitation",    date: "Mar 18", type: "Education"   },
  ],
  upcomingTasks: [
    { id: 6, name: "Hospital escort for Mr. Patel", date: "Apr 10", time: "10:00 AM", type: "Hospital Visit" },
    { id: 7, name: "Grocery pickup — Juhu",          date: "Apr 12", time: "3:00 PM",  type: "Pickup/Drop"   },
  ],
  notifications: [
    { id: 1, msg: "Your April report is ready",  time: "2h ago",    read: false },
    { id: 2, msg: "New task assigned near you",  time: "5h ago",    read: false },
    { id: 3, msg: "Admin verified your account", time: "Yesterday", read: true  },
  ],
};

// ─── Verified / Welcome Dashboard ────────────────────────────────
// Shown when buddy is admin-verified (isVerified: true).
// Props:
//   buddy     — buddy object from localStorage (name, email, city …)
//   onLogout  — clear session and go back to unregistered
// ─────────────────────────────────────────────────────────────────
export default function VerifiedDashboard({ buddy, onLogout }) {
  const data = buddy
    ? { ...MOCK, name: buddy.name || MOCK.name, email: buddy.email || MOCK.email }
    : MOCK;

  const progress = Math.round((data.thisMonth / data.monthlyGoal) * 100);

  const stats = [
    {
      label: "Total Tasks",
      value: data.totalTasks,
      sub: `Since ${data.joinDate}`,
      badge: "All Time",
      gradient: "from-violet-500 to-purple-600",
      icon: <CheckCircle2 size={20} />,
    },
    {
      label: "This Month",
      value: data.thisMonth,
      sub: `Goal: ${data.monthlyGoal} tasks`,
      badge: "+3",
      gradient: "from-emerald-400 to-teal-500",
      icon: <Target size={20} />,
    },
    {
      label: "Active Streak",
      value: `${data.streak}d`,
      sub: "Days in a row",
      badge: "🔥",
      gradient: "from-rose-400 to-pink-500",
      icon: <Flame size={20} />,
    },
  ];

  const quickActions = [
    { label: "Browse Tasks",   icon: <ClipboardList size={20} />, sub: "Find tasks near you",       color: "from-violet-500 to-purple-600" },
    { label: "Leaderboard",    icon: <TrendingUp size={20} />,    sub: "See top buddies",            color: "from-emerald-500 to-teal-500"  },
    { label: "Streak Tracker", icon: <Flame size={20} />,         sub: `${data.streak} days active`, color: "from-rose-500 to-pink-500"     },
    { label: "My Profile",     icon: <Users size={20} />,         sub: "View & edit profile",        color: "from-amber-500 to-orange-500"  },
  ];

  return (
    <div className="flex-1 p-8 flex flex-col gap-6 min-h-0">

      {/* ── Row 1: Welcome banner + stat cards ── */}
      <div className="grid grid-cols-4 gap-5">

        {/* Welcome banner */}
        <section
          className="col-span-1 relative rounded-2xl p-5 overflow-hidden text-white flex flex-col justify-between min-h-[140px]"
          style={{ background: "linear-gradient(135deg,#6A2AFF,#8B3FFF,#D116A8)" }}
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
              <BadgeCheck size={10} /> Verified ✓
            </span>
            <h2 className="text-xl font-bold mt-2 leading-tight">
              Hey, {data.name.split(" ")[0]}! 👋
            </h2>
            <p className="text-white/70 text-xs mt-1">Since {data.joinDate} · {data.city}</p>
          </div>
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white text-lg font-bold">
              {data.name[0]}
            </div>
          </div>
        </section>

        {/* Stat cards */}
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-sm`}>
                {stat.icon}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${stat.gradient}`}>
                {stat.badge}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Row 2: Main + Right panel ── */}
      <div className="grid grid-cols-3 gap-5 flex-1">

        {/* LEFT */}
        <div className="col-span-2 flex flex-col gap-5">

          {/* Monthly Progress */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-sm font-bold text-gray-800">Monthly Goal Progress</p>
                <p className="text-xs text-gray-400 mt-0.5">April 2025</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{data.thisMonth}</span>
                <span className="text-sm text-gray-400"> / {data.monthlyGoal} tasks</span>
              </div>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg,#6A2AFF,#D116A8)" }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-xs text-gray-400">{progress}% complete — keep going!</p>
              <p className="text-xs font-semibold text-[#6A2AFF]">
                {data.monthlyGoal - data.thisMonth} tasks to goal
              </p>
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => alert("Coming soon")}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-3 shadow-sm`}>
                    {action.icon}
                  </div>
                  <p className="text-sm font-bold text-gray-800">{action.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{action.sub}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Recent Tasks Table */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Recent Tasks</h3>
                <p className="text-xs text-gray-400">Last 5 completed</p>
              </div>
              <button className="text-xs text-[#6A2AFF] font-semibold flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-xl hover:bg-purple-100 transition">
                View all <ArrowUpRight size={13} />
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["Task", "Type", "Date", "Status"].map((h, i) => (
                    <th
                      key={h}
                      className={`text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3
                        ${h === "Status" ? "text-right px-6" : i === 0 ? "text-left px-6" : "text-left px-3"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.tasks.map((task, i) => (
                  <tr
                    key={task.id}
                    className={`hover:bg-gray-50 transition-colors ${i < data.tasks.length - 1 ? "border-b border-gray-50" : ""}`}
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                          {task.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="text-[11px] font-semibold bg-purple-50 text-[#6A2AFF] px-2.5 py-0.5 rounded-full">
                        {task.type}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-xs text-gray-400">{task.date}</td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                        <CheckCircle2 size={11} /> Done
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* RIGHT */}
        <div className="col-span-1 flex flex-col gap-5">

          {/* Upcoming Tasks */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">Upcoming Tasks</h3>
              <span className="text-[10px] font-bold text-[#6A2AFF] bg-purple-50 px-2 py-0.5 rounded-full">
                {data.upcomingTasks.length} pending
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {data.upcomingTasks.map((task) => (
                <div key={task.id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <p className="text-sm font-semibold text-gray-800 mb-1 leading-snug">{task.name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={11} /> {task.date}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {task.time}</span>
                  </div>
                  <span className="inline-block mt-2 text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full">
                    {task.type}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">Notifications</h3>
              <button className="text-xs text-[#6A2AFF] font-semibold hover:underline">
                Mark all read
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {data.notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50 transition-colors ${!n.read ? "bg-purple-50/30" : ""}`}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? "bg-[#6A2AFF]" : "bg-gray-200"}`} />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-700 font-medium leading-snug">{n.msg}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Streak card */}
          <section
            className="rounded-2xl p-5 text-white"
            style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Flame size={20} />
              <p className="text-sm font-bold">Streak Bonus!</p>
            </div>
            <p className="text-3xl font-black">{data.streak} days</p>
            <p className="text-white/75 text-xs mt-1">
              Keep going — {10 - data.streak} more days for a 10-day badge 🏅
            </p>
            <div className="mt-3 flex gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1.5 rounded-full ${i < data.streak ? "bg-white" : "bg-white/25"}`}
                />
              ))}
            </div>
          </section>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors px-4 py-2 rounded-xl hover:bg-red-50 self-start border border-gray-100"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
