import { FaBell } from "react-icons/fa";
import buddyLogo from "../../assets/buddyLogo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { BadgeCheck, Clock, Shield } from "lucide-react";
import api from "../../services/api";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const getGreetingEmoji = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "🌄";
  if (hour < 18) return "☀️";
  return "🌙";
};

const getFileUrl = (filePath) => {
  if (!filePath) return "";
  if (/^https?:\/\//i.test(filePath)) return filePath;
  const origin = (api.defaults.baseURL || "").replace(/\/api\/?$/, "");
  const normalized = filePath.replace(/\\/g, "/");
  return `${origin}/${normalized}`;
};

const navLinks = [
  { label: "Dashboard", path: "/buddy/dashboard" },
  { label: "My Tasks", path: "/buddy/tasks" },
  { label: "Leaderboard", path: "/buddy/leaderboard" },
  { label: "Settings", path: "/buddy/settings" },
];

function StatusBadge({ status }) {
  if (status === "welcome") {
    return (
      <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-full">
        <BadgeCheck size={10} /> Verified Buddy
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-full">
        <Clock size={10} /> Pending Approval
      </span>
    );
  }
  return (
    <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-semibold bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
      Not Registered
    </span>
  );
}

const BuddyNav = ({ buddy, status = "unregistered", unreadCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const isVerified = status === "welcome";
  const showMinimalNav = !isVerified;

  return (
    <header className="w-full h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center gap-3 shrink-0">
        <img src={buddyLogo} alt="Buddy Logo" className="h-9 w-auto" />
        {!showMinimalNav && (
          <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold text-[#6A2AFF] bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">
            <Shield size={9} /> Buddy Portal
          </span>
        )}
      </div>

      {!showMinimalNav && (
        <nav className="hidden md:flex items-center h-full">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const locked = !isVerified && link.label !== "Dashboard";

            return (
              <button
                key={link.path}
                onClick={() => !locked && navigate(link.path)}
                title={locked ? "Available after verification" : ""}
                className={`relative h-full px-5 text-sm font-semibold transition-all duration-200 flex items-center gap-1 ${
                  isActive
                    ? "text-[#6A2AFF]"
                    : locked
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-[#6A2AFF]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#6A2AFF] to-[#D116A8] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      )}

      <div className="flex items-center gap-3 shrink-0">
        {!showMinimalNav && <StatusBadge status={status} />}

        <div className="hidden lg:flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
          <span className="text-sm">{getGreetingEmoji()}</span>
          <div>
            <p className="text-xs font-semibold text-gray-800 leading-tight">
              {getGreeting()}, {buddy?.name?.split(" ")[0] || "Buddy"}!
            </p>
            <p className="text-[11px] text-gray-400">{today}</p>
          </div>
        </div>

        {!showMinimalNav && (
          <button className="relative p-2 rounded-xl hover:bg-gray-50 transition">
            <FaBell className="text-gray-400" size={15} />
            {unreadCount > 0 ? (
              <span
                className="absolute top-1 right-1 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#6A2AFF,#D116A8)" }}
              >
                {unreadCount}
              </span>
            ) : (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            )}
          </button>
        )}

        <div
          onClick={() => navigate("/buddy/profile")}
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
        >
          {buddy?.profilePhoto ? (
            <img
              src={getFileUrl(buddy.profilePhoto)}
              alt="Profile"
              className="w-8 h-8 rounded-xl object-cover shadow-sm border border-gray-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6A2AFF] to-[#D116A8] flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {buddy?.name?.charAt(0).toUpperCase() || "B"}
            </div>
          )}
          <span className="hidden md:block text-xs font-semibold text-gray-700">
            {buddy?.name?.split(" ")[0] || "Buddy"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default BuddyNav;
