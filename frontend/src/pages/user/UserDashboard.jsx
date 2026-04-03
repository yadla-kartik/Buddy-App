import { useState, useEffect } from "react";
import {
  FaBars,
  FaBell,
  FaUserCircle,
  FaSearch,
  FaHome,
  FaTasks,
  FaUsers,
  FaUserShield,
  FaMoneyBill,
  FaChartBar,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { Heart, CheckCircle2, Users2, Wallet } from "lucide-react";
import buddyLogo from "../../assets/buddyLogo.png";

import { getMe } from "../../services/authService";


// Greeting logic
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};


// Top Navbar Component
const TopNavbar = ({ onMenuClick, user }) => {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  return (
    <header className="w-full h-16 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-30">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-xl text-gray-700 hover:text-[#6A2AFF] transition"
          onClick={onMenuClick}
        >
          <FaBars />
        </button>

        <div className="flex items-center gap-2">
         <img src={buddyLogo} alt="Buddy Logo" className="h-auto w-40 ml-3 mt-2" />
      </div>
      </div>

      {/* CENTER - Greeting Card */}
      <div className="hidden lg:flex items-center gap-3 bg-linear-to-r from-purple-50 to-pink-50 px-6 py-2 rounded-full">
        <div className="text-2xl">
          {new Date().getHours() < 12 ? "🌅" : new Date().getHours() < 18 ? "☀️" : "🌙"}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">
           {getGreeting()}, {user?.name || "User"}!
          </p>
          <p className="text-xs text-gray-600">{today}</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
          <FaSearch className="text-gray-500 text-sm" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-32 lg:w-48"
          />
        </div>

        <div className="relative cursor-pointer hover:scale-110 transition">
          <FaBell className="text-xl text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
            3
          </span>
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
          <div className="w-9 h-9 bg-linear-to-br from-[#6A2AFF] to-[#D116A8] rounded-full flex items-center justify-center text-white font-semibold">
     {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <span className="hidden md:block text-sm font-medium text-gray-700">
            {user?.name || "User"}
          </span>
        </div>
      </div>
    </header>
  );
};

// Side Menu Component
const menuItems = [
  { label: "Dashboard", icon: <FaHome />, color: "purple" },
  { label: "Tasks", icon: <FaTasks />, color: "blue" },
  { label: "My Buddies", icon: <FaUsers />, color: "green" },
  { label: "Parent Profile", icon: <FaUserShield />, color: "orange" },
  { label: "Payments", icon: <FaMoneyBill />, color: "pink" },
  { label: "Reports", icon: <FaChartBar />, color: "indigo" },
  { label: "Settings", icon: <FaCog />, color: "gray" },
  { label: "Help & Support", icon: <FaQuestionCircle />, color: "teal" },
];

const SideMenu = ({ isOpen, onClose }) => {
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:relative top-0 left-0 h-full w-64 bg-white shadow-xl z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 flex flex-col
        `}
      >
        <div className="p-6 border-b md:hidden bg-linear-to-r from-[#6A2AFF] to-[#D116A8]">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Heart size={20} fill="white" />
            My Buddy
          </h2>
        </div>

        <ul className="p-4 space-y-1 md:mt-4 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <li
              key={item.label}
              className={`
                flex items-center gap-3 p-3 rounded-lg cursor-pointer
                transition-all duration-200
                ${
                  activeItem === item.label
                    ? "bg-linear-to-r from-[#6A2AFF] to-[#D116A8] text-white shadow-lg scale-105"
                    : "text-gray-600 hover:bg-gray-100 hover:text-[#6A2AFF]"
                }
              `}
              onClick={() => {
                setActiveItem(item.label);
                onClose();
              }}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </li>
          ))}
        </ul>

        <div className="p-4 border-t">
          <div
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer
              text-red-600 hover:bg-red-50 transition-all"
            onClick={onClose}
          >
            <FaSignOutAlt className="text-lg" />
            <span className="font-medium">Logout</span>
          </div>
        </div>
      </aside>
    </>
  );
};

// Main Dashboard
const UserDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState(null);


useEffect(() => {
  const fetchUser = async () => {
    const res = await getMe();
    if (res?.user) {
      setUser(res.user);
    }
  };
  fetchUser();
}, []);

  const stats = [
    {
      title: "Active Tasks",
      value: "03",
      icon: <CheckCircle2 size={24} />,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Buddies",
      value: "02",
      icon: <Users2 size={24} />,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      title: "This Month",
      value: "₹ 2,400",
      icon: <Wallet size={24} />,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-purple-50 to-pink-50">
      <TopNavbar onMenuClick={() => setMenuOpen(true)} />

      <div className="flex h-[calc(100vh-4rem)]">
        <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* Welcome Card */}
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-8 relative overflow-hidden">

  {/* COLORFUL GLASS CIRCLES */}
  <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300/30 rounded-full -mr-32 -mt-32 blur-2xl"></div>
  <div className="absolute bottom-0 left-0 w-60 h-60 bg-pink-300/30 rounded-full -ml-28 -mb-28 blur-2xl"></div>
  <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-blue-300/20 rounded-full blur-2xl"></div>

  <div className="relative z-10 flex justify-between items-center">
    
    {/* LEFT CONTENT */}
    <div>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        Welcome back, {user?.name || "User"} 👋
      </h2>

      <p className="text-gray-600 text-lg flex items-center gap-2">
        Your parents are in safe hands
        <Heart
          size={20}
          fill="currentColor"
          className="animate-pulse text-red-500"
        />
      </p>
    </div>

    {/* RIGHT IMAGE (HOME IMAGE) */}
    <div className="hidden lg:block mr-12">
        <img
          src="/src/assets/buddyTrust.png"
          alt="Home"
          className="w-48 h-auto object-contain"
        />
    </div>
  </div>
</section>


          {/* Stats Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`${stat.bgColor} p-3 rounded-xl text-gray-700`}
                  >
                    {stat.icon}
                  </div>
                  <div
                    className={`text-xs font-semibold px-3 py-1 rounded-full bg-linear-to-r ${stat.color} text-white`}
                  >
                    Active
                  </div>
                </div>
                <p className="text-gray-500 text-sm font-medium mb-1">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {stat.value}
                </h3>
              </div>
            ))}
          </section>

          {/* Quick Actions */}
        <section className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
  {[
    { label: "New Task", emoji: "➕" },
    { label: "View Reports", emoji: "📊" },
    { label: "Contact Buddy", emoji: "💬" },
    { label: "Emergency", emoji: "🚨" },
  ].map((action, index) => (
    <button
      key={index}
      onClick={() => {
        if (action.label === "New Task") {
          window.open("/create-task", "_blank");
        }
      }}
      className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all hover:-translate-y-1"
    >
      <div className="text-3xl mb-2">{action.emoji}</div>
      <p className="text-sm font-semibold text-gray-700">
        {action.label}
      </p>
    </button>
  ))}
</section>

        </main>
      </div>
    </div>
  );
};

export default UserDashboard;