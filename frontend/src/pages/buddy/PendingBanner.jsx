import { CheckCircle2, Clock, ClipboardList, Award, TrendingUp } from "lucide-react";

// ─── Pending / Verification Banner ───────────────────────────────
// Shown after registration, while admin review is in progress.
// Props:
//   onApprove  — demo callback to simulate admin approval (optional)
// ─────────────────────────────────────────────────────────────────
export default function PendingBanner({ onApprove }) {
  const STEPS   = ["Registered", "Under Review", "Active"];
  const CURRENT = 1; // "Under Review" is active

  const nextSteps = [
    { n: "1", text: "Admin reviews your submitted documents & details",  color: "from-[#6A2AFF] to-[#8B3FFF]" },
    { n: "2", text: "You receive an approval / rejection email",          color: "from-[#8B3FFF] to-[#D116A8]"  },
    { n: "3", text: "Full dashboard access unlocks instantly on approval", color: "from-[#D116A8] to-rose-500"   },
  ];

  const preview = [
    { icon: <ClipboardList size={20} className="text-[#6A2AFF]" />, title: "Task Management", desc: "Browse & accept tasks near you",      bg: "bg-purple-50"  },
    { icon: <Award size={20} className="text-amber-500" />,          title: "Leaderboard",     desc: "Rank among top buddies in your city", bg: "bg-amber-50"   },
    { icon: <TrendingUp size={20} className="text-pink-500" />,      title: "Impact Tracker",  desc: "See your community contribution",    bg: "bg-pink-50"    },
    { icon: <CheckCircle2 size={20} className="text-emerald-600" />, title: "Task History",    desc: "Full log of every completed task",   bg: "bg-emerald-50" },
  ];

  return (
    <div className="w-full p-8 grid grid-cols-3 gap-6 content-start">

      {/* ── Status card — 2 cols ── */}
      <section className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="flex items-start gap-8">

          {/* Pulsing clock icon */}
          <div className="relative shrink-0">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,rgba(106,42,255,0.1),rgba(209,22,168,0.1))" }}
            >
              <Clock size={40} className="text-[#6A2AFF] animate-pulse" />
            </div>
            <span className="absolute -top-2 -right-2 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
              !
            </span>
          </div>

          {/* Text + step tracker */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Registration Submitted! 🎉
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-md">
              Your profile is currently under admin review. This usually takes
              1–2 business days. You'll receive an email once your account is
              approved and activated.
            </p>

            {/* Step tracker */}
            <div className="flex items-center w-fit">
              {STEPS.map((label, i) => (
                <div key={label} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    {/* Circle */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border-2 transition-all
                        ${i < CURRENT
                          ? "border-transparent text-white shadow-md"
                          : i === CURRENT
                          ? "border-[#6A2AFF] text-[#6A2AFF] bg-purple-50 animate-pulse"
                          : "border-gray-200 text-gray-300 bg-white"
                        }`}
                      style={i < CURRENT
                        ? { background: "linear-gradient(135deg,#6A2AFF,#D116A8)" }
                        : {}}
                    >
                      {i < CURRENT ? <CheckCircle2 size={16} /> : i + 1}
                    </div>

                    {/* Label */}
                    <span
                      className={`text-[11px] font-semibold whitespace-nowrap
                        ${i === CURRENT ? "text-[#6A2AFF]" : "text-gray-300"}`}
                    >
                      {label}
                    </span>
                  </div>

                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div
                      className={`w-20 h-0.5 mx-2 mb-4 rounded-full ${i < CURRENT ? "" : "bg-gray-200"}`}
                      style={i < CURRENT
                        ? { background: "linear-gradient(90deg,#6A2AFF,#D116A8)" }
                        : {}}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What happens next — right col ── */}
      <section className="col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          What Happens Next?
        </h3>

        {nextSteps.map((item) => (
          <div key={item.n} className="flex items-start gap-3">
            <div
              className={`w-7 h-7 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5`}
            >
              {item.n}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
          </div>
        ))}

        {/* Demo-only button — remove in production */}
        {onApprove && (
          <button
            onClick={onApprove}
            className="mt-auto w-full py-3 rounded-xl border border-purple-200 bg-purple-50 text-[#6A2AFF] text-sm font-semibold hover:bg-purple-100 transition-all"
          >
            [Demo] Simulate Approval →
          </button>
        )}
      </section>

      {/* ── Feature preview — full width ── */}
      <section className="col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">
          What You'll Get After Approval
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {preview.map((item) => (
            <div key={item.title} className={`${item.bg} rounded-2xl p-4`}>
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm mb-3">
                {item.icon}
              </div>
              <p className="text-sm font-bold text-gray-800">{item.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
