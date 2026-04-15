import { FaBell } from "react-icons/fa";
import buddyLogo from "../assets/buddyLogo.png";
import { useNavigate, useLocation } from "react-router-dom";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const getGreetingEmoji = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "🌅";
  if (hour < 18) return "☀️";
  return "🌙";
};

const navLinks = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "My Tasks",  path: "/tasks"     },
  { label: "Payments",  path: "/payment"   },
  { label: "Help",      path: "/help"      },
];

const Navbar = ({ user, notificationCount = 0, onNotificationClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "short",
  });

  return (
    <header className="w-full h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">

      {/* LEFT — Logo */}
      <div className="flex items-center shrink-0">
        <img src={buddyLogo} alt="Buddy Logo" className="h-9 w-auto" />
      </div>

      {/* CENTER — Nav Links */}
      <nav className="hidden md:flex items-center h-full">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`relative h-full px-5 text-sm font-semibold transition-all duration-200 flex items-center
                ${isActive ? "text-[#6A2AFF]" : "text-gray-500 hover:text-[#6A2AFF]"}`}
            >
              {link.label}
              {/* Active underline */}
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#6A2AFF] to-[#D116A8] rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* RIGHT — Greeting + Bell + Avatar */}
      <div className="flex items-center gap-3 shrink-0">

        {/* Greeting */}
        <div className="hidden lg:flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
          <span className="text-sm">{getGreetingEmoji()}</span>
          <div>
            <p className="text-xs font-semibold text-gray-800 leading-tight">
              {getGreeting()}, {user?.fullName?.split(" ")[0] || "User"}!
            </p>
            <p className="text-[11px] text-gray-400">{today}</p>
          </div>
        </div>

        {/* Bell */}
        <button
          onClick={onNotificationClick}
          className="relative p-2 rounded-xl hover:bg-gray-50 transition"
        >
          <FaBell className="text-gray-400" size={15} />
          {notificationCount > 0 ? (
            <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          ) : (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-gray-300 rounded-full" />
          )}
        </button>

    {/* Avatar */}
<div
  onClick={() => navigate("/profile")}
  className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
>
  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6A2AFF] to-[#D116A8] flex items-center justify-center text-white text-xs font-bold shadow-sm">
    {user?.fullName?.charAt(0).toUpperCase() || "U"}
  </div>
  <span className="hidden md:block text-xs font-semibold text-gray-700">
    {user?.fullName || "User"}
  </span>
</div>

      </div>
    </header>
  );
};

export default Navbar;
