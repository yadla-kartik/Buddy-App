import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getUserTasks } from "../../services/taskService";
import { CheckCircle2, Clock, Loader2, AlertCircle, Plus, User, UserCheck, MapPin, Calendar } from "lucide-react";

const statusConfig = {
  pending:     { label: "Pending",     icon: <AlertCircle size={12} />,  bg: "bg-amber-50",   text: "text-amber-600",   dot: "bg-amber-400"   },
  accepted:    { label: "Accepted",    icon: <Clock size={12} />,        bg: "bg-blue-50",    text: "text-blue-600",    dot: "bg-blue-400"    },
  in_progress: { label: "In Progress", icon: <Loader2 size={12} />,      bg: "bg-orange-50",  text: "text-orange-600",  dot: "bg-orange-400"  },
  completed:   { label: "Completed",   icon: <CheckCircle2 size={12} />, bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400" },
}

const FILTERS = ["All", "Pending", "In Progress", "Completed"]

const Tasks = () => {
  const { user } = useOutletContext()
  const [tasks, setTasks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState("All")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getUserTasks()
        if (res?.tasks) setTasks(res.tasks)
      } catch (err) {
        console.error("Failed to fetch tasks:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  const filtered = tasks.filter((t) => {
    if (filter === "All") return true
    if (filter === "Pending") return t.status === "pending"
    if (filter === "In Progress") return ["accepted", "in_progress"].includes(t.status)
    if (filter === "Completed") return t.status === "completed"
    return true
  })

  const counts = {
    all:       tasks.length,
    pending:   tasks.filter(t => t.status === "pending").length,
    active:    tasks.filter(t => ["accepted","in_progress"].includes(t.status)).length,
    completed: tasks.filter(t => t.status === "completed").length,
  }

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total",       value: counts.all,       color: "from-violet-500 to-purple-600" },
          { label: "Pending",     value: counts.pending,   color: "from-amber-400 to-orange-500"  },
          { label: "In Progress", value: counts.active,    color: "from-blue-500 to-cyan-500"     },
          { label: "Completed",   value: counts.completed, color: "from-emerald-400 to-teal-500"  },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <div className={`mt-2 h-1 rounded-full bg-gradient-to-r ${s.color} opacity-60`} />
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === f
                ? "bg-gradient-to-r from-[#6A2AFF] to-[#D116A8] text-white shadow-md"
                : "bg-white text-gray-500 border border-gray-100 hover:border-purple-200 hover:text-purple-600"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-8 h-8 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading tasks...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center">
            <CheckCircle2 size={28} className="text-purple-300" />
          </div>
          <p className="text-gray-500 text-sm font-medium">No tasks here</p>
          <button
            onClick={() => navigate("/create-task")}
            className="flex items-center gap-2 bg-gradient-to-r from-[#6A2AFF] to-[#D116A8] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={15} /> Create Task
          </button>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((task) => {
            const st = statusConfig[task.status] || statusConfig.pending
            return (
              <div
                key={task._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 flex-1">
                    {task.taskDescription}
                  </h3>
                  <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${st.bg} ${st.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    {st.label}
                  </span>
                </div>

                {task.taskType && (
                  <span className="inline-block bg-purple-50 text-purple-600 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg mb-3">
                    {task.taskType}
                  </span>
                )}

                <div className="space-y-1.5">
                  {task.parentName && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <User size={12} className="text-gray-400 shrink-0" />
                      <span className="font-medium text-gray-700">{task.parentName}</span>
                      {task.parentMobile && <span className="text-gray-400">· {task.parentMobile}</span>}
                    </div>
                  )}
                  {task.buddyName && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <UserCheck size={12} className="text-emerald-500 shrink-0" />
                      <span className="font-medium text-gray-700">{task.buddyName}</span>
                      <span className="text-gray-400">· Buddy</span>
                    </div>
                  )}
                  {task.taskLocationDescription && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin size={12} className="text-gray-400 shrink-0" />
                      <span className="truncate">{task.taskLocationType} — {task.taskLocationDescription}</span>
                    </div>
                  )}
                  {task.taskDate && task.taskTime && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={12} className="text-gray-400 shrink-0" />
                      <span>{new Date(task.taskDate).toLocaleDateString("en-IN")} at {task.taskTime}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">
                    Created {new Date(task.createdAt).toLocaleDateString("en-IN")}
                  </span>
                  {task.status === "completed" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <CheckCircle2 size={12} /> Done
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default Tasks;