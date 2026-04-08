import { useNavigate } from "react-router-dom";
import {
  BadgeCheck, UserPlus, Star, TrendingUp, Users, CheckCircle2,
} from "lucide-react";

// ─── Unregistered Banner ──────────────────────────────────────────
// Shown when buddy has NOT yet registered in the system.
// CTA: Register (→ /buddy/register) or Login (→ /buddy/login)
// ─────────────────────────────────────────────────────────────────
export default function UnregisteredBanner() {
  const navigate = useNavigate();

  const communityStats = [
    { value: "240+",   label: "Active Buddies",   icon: <Users size={20} />,        color: "from-violet-500 to-purple-600" },
    { value: "1,800+", label: "Tasks Completed",  icon: <CheckCircle2 size={20} />, color: "from-emerald-400 to-teal-500"  },
    { value: "98%",    label: "Satisfaction Rate", icon: <Star size={20} />,         color: "from-amber-400 to-orange-500"  },
  ];

  const reasons = [
    {
      icon: <BadgeCheck size={20} className="text-[#6A2AFF]" />,
      title: "Verified & Trusted",
      desc: "Admin-verified buddies ensure a safe, trusted care network for all families.",
      bg: "bg-purple-50",
    },
    {
      icon: <TrendingUp size={20} className="text-[#D116A8]" />,
      title: "Track Your Impact",
      desc: "Monitor your task history, contributions and grow your buddy profile over time.",
      bg: "bg-pink-50",
    },
    {
      icon: <Star size={20} className="text-emerald-500" />,
      title: "Flexible & Meaningful",
      desc: "Complete elder-care tasks on your own schedule and make a real difference.",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="w-full p-8 grid grid-cols-3 gap-6 content-start">

      {/* ── Hero banner — 2 cols ── */}
      <section
        className="col-span-2 relative rounded-2xl p-8 overflow-hidden text-white"
        style={{ background: "linear-gradient(135deg,#6A2AFF,#8B3FFF,#D116A8)" }}
      >
        {/* decorative blobs */}
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/10 rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-white/10 rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-lg">
          <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-5">
            <BadgeCheck size={12} /> Buddy Program
          </span>

          <h2 className="text-4xl font-bold mb-3 leading-tight">
            Become a Verified<br />Buddy Today 🤝
          </h2>

          <p className="text-white/75 text-sm leading-relaxed mb-6 max-w-sm">
            Join our trusted community, complete elder-care tasks, and make a
            real difference in people's lives — on your schedule.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/buddy/register")}
              className="inline-flex items-center gap-2 bg-white text-[#6A2AFF] text-sm font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <UserPlus size={16} /> Register as a Buddy
            </button>

            <button
              onClick={() => navigate("/buddy/login")}
              className="text-sm font-semibold text-white/80 hover:text-white transition underline underline-offset-2"
            >
              Already registered? Login
            </button>
          </div>
        </div>
      </section>

      {/* ── Community stats — right col ── */}
      <div className="col-span-1 flex flex-col gap-4">
        {communityStats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4"
          >
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shrink-0`}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Why join — full width ── */}
      <section className="col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">
          Why Join the Buddy Program?
        </h3>
        <div className="grid grid-cols-3 gap-5">
          {reasons.map((item) => (
            <div key={item.title} className={`${item.bg} rounded-2xl p-5`}>
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4">
                {item.icon}
              </div>
              <p className="text-sm font-bold text-gray-800 mb-1">{item.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
