import { useState, useEffect } from "react";
import { getAdminMe } from "../../services/adminAuthService";
import { FaUsers, FaCalendarAlt, FaUserCheck, FaChartBar, FaSignOutAlt, FaSearch, FaBell, FaFilter } from "react-icons/fa";
import { X, ChevronLeft, ChevronRight, Mail, Phone, MapPin, CreditCard, Building, CheckCircle, XCircle } from "lucide-react";
import { getAllBuddies, getBuddyById, verifyBuddy } 
from "../../services/adminBuddyService";



const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [buddies, setBuddies] = useState([]);
  const [activeMenu, setActiveMenu] = useState("Buddies");
  const [selectedBuddy, setSelectedBuddy] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

const perPage = 5;

// ✅ SEARCH SAFE FILTER
const filteredBuddies = buddies.filter((b) => {
  const name = b.name ? b.name.toLowerCase() : "";
  const email = b.email ? b.email.toLowerCase() : "";

  return (
    name.includes(searchQuery.toLowerCase()) ||
    email.includes(searchQuery.toLowerCase())
  );
});

// ✅ PAGINATION
const totalPages = Math.ceil(filteredBuddies.length / perPage);
const start = (page - 1) * perPage;
const visibleBuddies = filteredBuddies.slice(start, start + perPage);


  const stats = [
    { label: "Total Buddies", value: "156", icon: <FaUserCheck />, color: "from-purple-500 to-pink-500" },
    { label: "Pending", value: "24", icon: <FaCalendarAlt />, color: "from-orange-500 to-yellow-500" },
    { label: "Verified", value: "132", icon: <CheckCircle />, color: "from-green-500 to-emerald-500" },
    { label: "Interviews", value: "8", icon: <FaUsers />, color: "from-blue-500 to-cyan-500" },
  ];

  useEffect(() => {
  const fetchBuddies = async () => {
    const data = await getAllBuddies();
    setBuddies(data);
  };
  fetchBuddies();
}, []);


  useEffect(() => {
  const fetchAdmin = async () => {
    const res = await getAdminMe();
    if (res) {
      setAdmin(res);
    }
  };
  fetchAdmin();
}, []);


  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ========== SIDEBAR ========== */}
      <aside className="w-72 bg-white shadow-xl p-6 hidden md:block border-r border-gray-200">
        {/* Logo Section */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Buddy Admin
          </h2>
          <p className="text-xs text-gray-500 mt-1">Employee Panel</p>
        </div>

        <ul className="space-y-2">
          {[
            { label: "Buddies", icon: <FaUserCheck size={18} /> },
            { label: "Schedule Interview", icon: <FaCalendarAlt size={18} /> },
            { label: "Users", icon: <FaUsers size={18} /> },
            { label: "Reports", icon: <FaChartBar size={18} /> },
          ].map((item) => (
            <li
              key={item.label}
              onClick={() => setActiveMenu(item.label)}
              className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105
              ${activeMenu === item.label
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-300"
                  : "text-gray-600 hover:bg-purple-50"}`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-10">
          <div className="flex items-center gap-3 text-red-500 cursor-pointer p-4 rounded-xl hover:bg-red-50 transition-all">
            <FaSignOutAlt size={18} />
            <span className="font-medium">Logout</span>
          </div>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <div className="flex-1 flex flex-col">

        {/* ========== NAVBAR ========== */}
        <header className="h-20 bg-white shadow-md border-b border-gray-200 flex items-center justify-between px-8">
          <div>
           <h1 className="text-2xl font-bold text-gray-800">
  Welcome {admin?.name || "Admin"} 👋
</h1>

            <p className="text-sm text-gray-500">Manage buddy verifications efficiently</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <FaBell className="text-gray-600 text-xl cursor-pointer hover:text-purple-600 transition" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </div>

            <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full px-4 py-2">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
  {admin?.name || "Admin"}
</p>

                <p className="text-xs text-gray-500">My Buddy</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {admin?.name ? admin.name.charAt(0).toUpperCase() : "A"}
              </div>
            </div>
          </div>
        </header>

        {/* ========== STATS CARDS ========== */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* ========== SEARCH & FILTER BAR ========== */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search buddy by name, email or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-purple-50 border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                />
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all">
                <FaFilter />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* ========== MAIN CONTENT ========== */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-purple-100">
              <h2 className="text-xl font-bold text-gray-800">
                Buddy Verification Requests
              </h2>
              <p className="text-sm text-gray-500 mt-1">Review and approve buddy applications</p>
            </div>

            {/* Buddy List */}
            <div className="divide-y divide-purple-100">
              {visibleBuddies.map((buddy, idx) => (
                <div
                  key={buddy._id}
                 onClick={async () => {
  const fullBuddy = await getBuddyById(buddy._id);
  setSelectedBuddy(fullBuddy);
}}

                  className="p-5 cursor-pointer hover:bg-purple-50 transition-all duration-300 group"
                  style={{
                    animation: `fadeIn 0.3s ease-in-out ${idx * 0.1}s both`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                        {buddy.name ? buddy.name.charAt(0) : "?"}

                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition">
                          {buddy.name}
                        </h3>
                        <p className="text-sm text-gray-500">{buddy.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                     <span
  className={`px-3 py-1 rounded-full text-xs font-medium ${
    buddy.isVerified
      ? "bg-green-100 text-green-700"
      : "bg-orange-100 text-orange-700"
  }`}
>
  {buddy.isVerified ? "Verified" : "Pending"}
</span>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ========== ENHANCED PAGINATION ========== */}
            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-t border-purple-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing Showing{" "}
<span className="font-semibold text-gray-800">
  {start + 1}
</span>{" "}
to{" "}
<span className="font-semibold text-gray-800">
  {Math.min(start + perPage, buddies.length)}
</span>{" "}
of{" "}
<span className="font-semibold text-gray-800">
  {buddies.length}
</span>

                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="p-3 rounded-xl bg-white border border-purple-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-50 hover:border-purple-400 transition-all shadow-sm hover:shadow-md"
                  >
                    <ChevronLeft size={20} className="text-purple-600" />
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-xl font-medium transition-all ${
                          page === pageNum
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-110"
                            : "bg-white border border-purple-200 text-gray-600 hover:bg-purple-50 hover:border-purple-400"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="p-3 rounded-xl bg-white border border-purple-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-50 hover:border-purple-400 transition-all shadow-sm hover:shadow-md"
                  >
                    <ChevronRight size={20} className="text-purple-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== ENHANCED MODAL ========== */}
      {selectedBuddy && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedBuddy(null)}>
          <div 
            className="bg-white/95 backdrop-blur-xl w-full max-w-2xl rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
            style={{
              animation: "modalFadeIn 0.3s ease-out"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBuddy(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-red-50 hover:bg-red-100 rounded-full flex items-center justify-center transition-all hover:scale-110"
            >
              <X className="text-red-500" size={20} />
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white rounded-t-3xl">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg">
                 {selectedBuddy.name ? selectedBuddy.name.charAt(0) : "?"}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedBuddy.name}</h3>
                  <p className="text-purple-100 mt-1">Buddy Application Details</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                  <Mail className="text-purple-600 mt-1" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Email Address</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedBuddy.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-xl">
                  <Phone className="text-pink-600 mt-1" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Mobile Number</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedBuddy.mobile}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                  <MapPin className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Address</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedBuddy.permanentAddress}
</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                  <CreditCard className="text-green-600 mt-1" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">PAN Number</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedBuddy.panNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
                  <CreditCard className="text-orange-600 mt-1" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Aadhaar Number</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedBuddy.aadhaarNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-xl">
                  <Building className="text-indigo-600 mt-1" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Bank Name</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedBuddy.bankName}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-xs text-gray-500 font-medium">Banking Details</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Account Number</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedBuddy.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">IFSC Code</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedBuddy.ifscCode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-8 pt-0 flex gap-4">
              <button 
                onClick={async () => {
  const res = await verifyBuddy(selectedBuddy._id);

  if (res) {
    alert(`Buddy ${selectedBuddy.name} verified successfully ✅`);

    // 🔁 UI refresh
    const updatedBuddies = await getAllBuddies();
    setBuddies(updatedBuddies);

    setSelectedBuddy(null);
  }
}}

                className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Accept Buddy
              </button>
              <button 
                onClick={() => {
                  alert(`Buddy ${selectedBuddy.name} rejected!`);
                  setSelectedBuddy(null);
                }}
                className="flex-1 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <XCircle size={20} />
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;