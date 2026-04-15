import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminMe, logoutAdminApi } from "../../services/adminAuthService";
import { FaUsers, FaUserCheck, FaSignOutAlt, FaSearch, FaBell, FaFilter, FaBriefcase, FaTasks } from "react-icons/fa";
import { X, ChevronLeft, ChevronRight, Mail, Phone, MapPin, CheckCircle, LayoutDashboard, Clock, Activity, TrendingUp, MoreVertical, Calendar, AlertTriangle } from "lucide-react";
import { getAllBuddies, getBuddyById, verifyBuddy, rejectBuddy } from "../../services/adminBuddyService";
import { connectAdminSocket, disconnectAdminSocket } from "../../services/socketService";

// --- DUMMY DATA ---
const dummyUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Applicant", status: "Active", joined: "2024-03-15" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User", status: "Inactive", joined: "2024-03-12" },
  { id: 3, name: "Charlie Davis", email: "charlie@example.com", role: "Applicant", status: "Active", joined: "2024-03-10" },
  { id: 4, name: "Diana Prince", email: "diana@example.com", role: "User", status: "Active", joined: "2024-03-08" },
];

const dummyInterviews = [
  { id: 1, candidate: "Sarah Wilson", role: "Frontend Buddy", date: "Apr 12, 10:00 AM", status: "Scheduled", interviewer: "Admin" },
  { id: 2, candidate: "James Brown", role: "Backend Buddy", date: "Apr 12, 02:00 PM", status: "Completed", interviewer: "Admin" },
  { id: 3, candidate: "Emily Clark", role: "UI/UX Buddy", date: "Apr 13, 11:30 AM", status: "Pending", interviewer: "Unassigned" },
];

const getBuddyId = (buddy) => buddy?._id || buddy?.id;

const getVerificationStatus = (buddy) => {
  if (!buddy) return "pending";
  if (buddy.verificationStatus) return buddy.verificationStatus;
  return buddy.isVerified ? "approved" : "pending";
};

const getStatusMeta = (status) => {
  if (status === "approved") {
    return {
      label: "Verified",
      className: "bg-emerald-100 text-emerald-700",
      icon: <CheckCircle size={12} />,
    };
  }

  if (status === "rejected") {
    return {
      label: "Rejected",
      className: "bg-red-100 text-red-700",
      icon: <AlertTriangle size={12} />,
    };
  }

  return {
    label: "Pending",
    className: "bg-amber-100 text-amber-700",
    icon: <Clock size={12} />,
  };
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [buddies, setBuddies] = useState([]);
  const [activeMenu, setActiveMenu] = useState("Overview");

  // Buddy States
  const [selectedBuddy, setSelectedBuddy] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [liveNotice, setLiveNotice] = useState("");

  const perPage = 5;

  const filteredBuddies = buddies.filter((b) => {
    const name = b.name ? b.name.toLowerCase() : "";
    const email = b.email ? b.email.toLowerCase() : "";
    return name.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredBuddies.length / perPage);
  const start = (page - 1) * perPage;
  const visibleBuddies = filteredBuddies.slice(start, start + perPage);

  const pendingCount = buddies.filter(
    (buddy) => getVerificationStatus(buddy) === "pending"
  ).length;
  const verifiedCount = buddies.filter(
    (buddy) => getVerificationStatus(buddy) === "approved"
  ).length;

  const statsCards = [
    { label: "Total Buddies", value: String(buddies.length), icon: <FaUserCheck size={20} />, color: "from-indigo-500 to-blue-600", trend: "+12%" },
    { label: "Pending verifications", value: String(pendingCount), icon: <Clock size={20} />, color: "from-orange-400 to-amber-500", trend: "-5%" },
    { label: "Verified Buddies", value: String(verifiedCount), icon: <CheckCircle size={20} />, color: "from-emerald-400 to-green-600", trend: "+18%" },
    { label: "Scheduled Interviews", value: "8", icon: <Calendar size={20} />, color: "from-purple-500 to-pink-600", trend: "+2%" },
  ];

  const pushLiveNotice = useCallback((message) => {
    if (!message) return;
    setLiveNotice(message);
    setTimeout(() => {
      setLiveNotice((prev) => (prev === message ? "" : prev));
    }, 4000);
  }, []);

  const upsertBuddy = useCallback((incomingBuddy) => {
    if (!incomingBuddy) return;

    const incomingId = String(getBuddyId(incomingBuddy) || "");
    if (!incomingId) return;

    setBuddies((prev) => {
      const existingIndex = prev.findIndex(
        (item) => String(getBuddyId(item) || "") === incomingId
      );

      if (existingIndex === -1) {
        return [{ ...incomingBuddy, _id: incomingId }, ...prev];
      }

      const next = [...prev];
      next[existingIndex] = {
        ...next[existingIndex],
        ...incomingBuddy,
        _id: incomingId,
      };
      return next;
    });
  }, []);

  useEffect(() => {
    const fetchBuddies = async () => {
      try {
        const data = await getAllBuddies();
        if (data) setBuddies(data);
      } catch (error) {
        console.error("Failed to load buddies:", error);
      }
    };
    fetchBuddies();
  }, []);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await getAdminMe();
        if (res) setAdmin(res);
        else navigate("/admin/login");
      } catch (error) {
        console.error("Failed to load admin:", error);
        navigate("/admin/login");
      }
    };
    fetchAdmin();
  }, [navigate]);

  useEffect(() => {
    if (!admin) return undefined;

    const socket = connectAdminSocket();

    const onRegistrationSubmitted = (payload) => {
      const incomingBuddy = payload?.buddy;
      if (incomingBuddy) {
        upsertBuddy(incomingBuddy);
      }
      pushLiveNotice(payload?.message || "New buddy registration submitted");
    };

    const onVerificationUpdated = (payload) => {
      const incomingBuddy = payload?.buddy;
      if (incomingBuddy) {
        upsertBuddy(incomingBuddy);
      }
      pushLiveNotice(payload?.message || "Buddy verification status updated");
    };

    socket.on("buddy:registration:submitted", onRegistrationSubmitted);
    socket.on("buddy:verification:updated", onVerificationUpdated);

    return () => {
      socket.off("buddy:registration:submitted", onRegistrationSubmitted);
      socket.off("buddy:verification:updated", onVerificationUpdated);
      disconnectAdminSocket();
    };
  }, [admin, pushLiveNotice, upsertBuddy]);

  // SUBCOMPONENTS //
  const OverviewView = () => (
    <div className="animate-fade-in-up space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full`}></div>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-3xl font-extrabold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Recent Applications</h3>
            <button className="text-sm text-indigo-600 font-semibold hover:underline" onClick={() => setActiveMenu("Buddies")}>View All</button>
          </div>
          <div className="space-y-4">
            {buddies.slice(0, 4).map(buddy => (
              <div key={getBuddyId(buddy) || buddy.email} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    {buddy.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{buddy.name || "Unknown"}</p>
                    <p className="text-xs text-gray-500">{buddy.email || "No email"}</p>
                  </div>
                </div>
                {(() => {
                  const statusMeta = getStatusMeta(getVerificationStatus(buddy));
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusMeta.className}`}>
                      {statusMeta.icon}
                      {statusMeta.label}
                    </span>
                  );
                })()}
              </div>
            ))}
            {buddies.length === 0 && <p className="text-gray-500 text-sm">No applications found.</p>}
          </div>
        </div>
        {/* Upcoming Interviews Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Upcoming Interviews</h3>
          </div>
          <div className="space-y-4">
            {dummyInterviews.slice(0, 3).map(interview => (
              <div key={interview.id} className="border-l-4 border-indigo-500 pl-4 py-1">
                <p className="text-sm font-bold text-gray-800">{interview.candidate}</p>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Clock size={12} /> {interview.date}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition" onClick={() => setActiveMenu("Interviews")}>
            Manage Interveiws
          </button>
        </div>
      </div>
    </div>
  );

  const BuddiesListView = () => (
    <div className="animate-fade-in-up">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search applicant by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all font-medium border-dashed">
            <FaFilter size={14} /> <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="p-5 font-semibold">Applicant</th>
                <th className="p-5 font-semibold">Status</th>
                <th className="p-5 font-semibold">Joined Date</th>
                <th className="p-5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {visibleBuddies.map((buddy, idx) => (
                <tr key={getBuddyId(buddy) || idx} className="hover:bg-indigo-50/50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                        {buddy.name ? buddy.name.charAt(0) : "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{buddy.name}</p>
                        <p className="text-sm text-gray-500">{buddy.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    {(() => {
                      const statusMeta = getStatusMeta(getVerificationStatus(buddy));
                      return (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusMeta.className}`}>
                          {statusMeta.icon}
                          {statusMeta.label}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="p-5 text-sm text-gray-600">
                    {buddy.createdAt ? new Date(buddy.createdAt).toLocaleDateString() : "2 days ago"}
                  </td>
                  <td className="p-5 text-right">
                    <button
                      onClick={async () => {
                        const buddyId = getBuddyId(buddy);
                        if (!buddyId) {
                          setSelectedBuddy(buddy);
                          return;
                        }
                        try {
                          const fullBuddy = await getBuddyById(buddyId);
                          setSelectedBuddy(fullBuddy || buddy); // fallback if fullbuddy fails
                        } catch (error) {
                          console.error("Failed to load full buddy details:", error);
                          setSelectedBuddy(buddy);
                        }
                      }}
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-600 hover:text-white transition-colors border border-indigo-100 hover:border-indigo-600"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
              {visibleBuddies.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">No applicants found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <p className="text-sm text-gray-500">Showing <span className="font-semibold text-gray-700">{buddies.length > 0 ? start + 1 : 0} - {Math.min(start + perPage, filteredBuddies.length)}</span> of <span className="font-semibold text-gray-700">{filteredBuddies.length}</span></p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-2 border border-gray-200 rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50 transition">
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${page === pageNum
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "bg-transparent text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)} className="p-2 border border-gray-200 rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50 transition">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const UsersView = () => (
    <div className="animate-fade-in-up bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-lg font-bold text-gray-800">All System Users</h2>
          <p className="text-sm text-gray-500">Manage all registered users in the platform.</p>
        </div>
        <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold shadow-md hover:bg-gray-800 transition">
          Export CSV
        </button>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 text-gray-500 text-sm">
            <th className="p-5 font-semibold">User Details</th>
            <th className="p-5 font-semibold">Role</th>
            <th className="p-5 font-semibold">Status</th>
            <th className="p-5 font-semibold">Joined Date</th>
            <th className="p-5 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {dummyUsers.map(user => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="p-5">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-bold">{user.role}</span>
              </td>
              <td className="p-5">
                <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${user.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  {user.status}
                </span>
              </td>
              <td className="p-5 text-sm text-gray-600">{user.joined}</td>
              <td className="p-5 text-right">
                <button className="text-gray-400 hover:text-gray-800 transition"><MoreVertical size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const InterviewsView = () => (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Interview Schedule</h2>
          <p className="text-sm text-gray-500">Manage upcoming buddy interviews</p>
        </div>
        <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 transition flex items-center gap-2">
          <Calendar size={16} /> Schedule Interview
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyInterviews.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition">
            <div className={`absolute top-0 left-0 w-1.5 h-full ${item.status === 'Scheduled' ? 'bg-blue-500' : item.status === 'Completed' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
            <div className="flex justify-between items-start mb-4 pl-2">
              <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${item.status === 'Scheduled' ? 'bg-blue-50 text-blue-600' : item.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                {item.status}
              </span>
              <button className="text-gray-400 hover:text-gray-800"><MoreVertical size={16} /></button>
            </div>
            <div className="pl-2">
              <h3 className="text-lg font-bold text-gray-800">{item.candidate}</h3>
              <p className="text-sm text-indigo-500 font-semibold mb-4">{item.role}</p>
              <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <Clock size={14} className="text-gray-400" /> <span>{item.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <FaUserCheck size={14} className="text-gray-400" /> <span>Reviewer: {item.interviewer}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ReportsView = () => (
    <div className="animate-fade-in-up flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm h-full">
      <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
        <Activity className="text-indigo-500" size={40} />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Analytics & Reports</h2>
      <p className="text-gray-500 max-w-md text-center">Detailed charts and system wide analytics will be available in the next major performance update.</p>
      <button className="mt-8 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold shadow-md hover:bg-gray-800 transition hover:shadow-lg">
        Generate Quick Report PDF
      </button>
    </div>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case "Overview": return <OverviewView />;
      case "Buddies": return <BuddiesListView />;
      case "Users": return <UsersView />;
      case "Interviews": return <InterviewsView />;
      case "Reports": return <ReportsView />;
      default: return <OverviewView />;
    }
  };

  const navItems = [
    { label: "Overview", icon: <LayoutDashboard size={18} /> },
    { label: "Buddies", icon: <FaUserCheck size={18} /> },
    { label: "Users", icon: <FaUsers size={18} /> },
    { label: "Interviews", icon: <FaTasks size={18} /> },
    { label: "Reports", icon: <TrendingUp size={18} /> },
  ];

  return (
    <div className="min-h-screen flex bg-[#f4f7fb] font-sans text-gray-800 selection:bg-indigo-100 selection:text-indigo-900">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
        @keyframes modalPop {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-modal-pop {
          animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af; 
        }
      `}</style>

      {/* ========== SIDEBAR ========== */}
      <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col fixed h-full z-10 transition-all shadow-sm">
        <div className="p-6 pt-8 flex items-center justify-center border-b border-gray-50/50">
          <div className="flex items-center gap-3 w-full px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
              <FaBriefcase className="text-white text-lg" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-xl font-extrabold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent tracking-tight truncate">
                AdminSpace
              </h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">Control Panel</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-1.5 custom-scrollbar">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-3">Main Menu</p>
          {navItems.map((item) => {
            const isActive = activeMenu === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveMenu(item.label)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                    ? "bg-indigo-50 text-indigo-700 font-bold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 font-semibold"
                  }`}
              >
                <div className={`${isActive ? "text-indigo-600" : "text-gray-400"}`}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
                {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-indigo-600 shadow-sm shadow-indigo-400"></div>}
              </button>
            )
          })}
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50/50">
          <button onClick={async () => { await logoutAdminApi(); navigate("/admin/login"); }} className="w-full flex items-center justify-center gap-2 py-3 bg-white text-red-500 font-bold rounded-xl hover:bg-red-50 border border-gray-200 hover:border-red-100 transition shadow-sm">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main className="flex-1 ml-[280px] flex flex-col min-h-screen">

        {/* Navbar */}
        <header className="h-[80px] bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100 px-8 flex flex-row items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              {activeMenu}
            </h1>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 opacity-50 cursor-not-allowed">
              <FaSearch className="text-gray-400 mr-2" size={14} />
              <span className="text-sm text-gray-400 font-medium">Quick search cmd+k</span>
            </div>

            <button className="relative p-2.5 text-gray-400 hover:text-gray-700 transition bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 rounded-full">
              <FaBell size={18} />
              <span className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${liveNotice ? "bg-red-500" : "bg-gray-300"}`}></span>
            </button>

            <div className="w-px h-8 bg-gray-200"></div>

            <div className="flex items-center gap-3 cursor-pointer p-1.5 pr-4 rounded-full hover:bg-gray-50 transition border border-transparent hover:border-gray-200">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 shadow-md flex items-center justify-center text-white font-bold text-sm">
                {admin?.name ? admin.name.charAt(0).toUpperCase() : "SA"}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-bold text-gray-800 leading-tight">{admin?.name || "Super Admin"}</p>
                <p className="text-[11px] text-gray-500 font-semibold tracking-wide">ADMINISTRATOR</p>
              </div>
            </div>
          </div>
        </header>

        {liveNotice ? (
          <div className="mx-8 mt-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            {liveNotice}
          </div>
        ) : null}

        {/* Dynamic View */}
        <div className="p-8 max-w-7xl mx-auto w-full flex-1">
          {renderContent()}
        </div>
      </main>

      {/* ========== BUDDY REVIEW MODAL ========== */}
      {selectedBuddy && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedBuddy(null)}>
          <div
            className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-modal-pop border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80 backdrop-blur-md">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Application Review</h3>
                <p className="text-sm text-gray-500 font-medium">Review the details submitted by the applicant</p>
              </div>
              <button onClick={() => setSelectedBuddy(null)} className="w-10 h-10 bg-white border border-gray-200 text-gray-500 rounded-full flex items-center justify-center hover:bg-gray-100 hover:text-gray-800 hover:border-gray-300 transition shadow-sm">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto space-y-8 flex-1 custom-scrollbar">

              {/* Profile Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100/50">
                <div className="w-20 h-20 bg-white text-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-sm border border-indigo-100">
                  {selectedBuddy.name ? selectedBuddy.name.charAt(0) : "U"}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">{selectedBuddy.name}</h2>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-sm text-gray-600 font-medium bg-white px-3 py-1 rounded-lg border border-indigo-100/50 shadow-sm"><Mail size={14} className="text-indigo-500" /> {selectedBuddy.email}</span>
                    <span className="flex items-center gap-1.5 text-sm text-gray-600 font-medium bg-white px-3 py-1 rounded-lg border border-indigo-100/50 shadow-sm"><Phone size={14} className="text-indigo-500" /> {selectedBuddy.mobile || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* ID Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-8 h-px bg-indigo-200 inline-block"></span> Identity Details
                  </h4>
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl border border-gray-100 flex justify-between items-center transition hover:border-indigo-200 hover:shadow-sm">
                      <span className="text-sm font-medium text-gray-500">PAN Number</span>
                      <span className="text-sm font-bold text-gray-800">{selectedBuddy.panNumber || 'N/A'}</span>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 flex justify-between items-center transition hover:border-indigo-200 hover:shadow-sm">
                      <span className="text-sm font-medium text-gray-500">Aadhaar No.</span>
                      <span className="text-sm font-bold text-gray-800">{selectedBuddy.aadhaarNumber || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-8 h-px bg-indigo-200 inline-block"></span> Banking Details
                  </h4>
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl border border-gray-100 flex justify-between items-center transition hover:border-indigo-200 hover:shadow-sm">
                      <span className="text-sm font-medium text-gray-500">Bank Name</span>
                      <span className="text-sm font-bold text-gray-800">{selectedBuddy.bankName || 'N/A'}</span>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 flex justify-between items-center transition hover:border-indigo-200 hover:shadow-sm">
                      <span className="text-sm font-medium text-gray-500">Account No.</span>
                      <span className="text-sm font-bold text-gray-800">{selectedBuddy.accountNumber || 'N/A'}</span>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 flex justify-between items-center transition hover:border-indigo-200 hover:shadow-sm">
                      <span className="text-sm font-medium text-gray-500">IFSC Code</span>
                      <span className="text-sm font-bold text-gray-800">{selectedBuddy.ifscCode || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Address Info */}
                <div className="md:col-span-2 space-y-4">
                  <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-8 h-px bg-indigo-200 inline-block"></span> Location
                  </h4>
                  <div className="p-5 rounded-xl border border-gray-100 flex items-start gap-4 transition hover:border-indigo-200 hover:shadow-sm bg-gray-50/50">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div className="flex flex-col justify-center min-h-[40px]">
                      <p className="text-sm font-semibold text-gray-800 leading-relaxed">{selectedBuddy.permanentAddress || 'Address not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer actions */}
            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/80 backdrop-blur-md flex gap-4">
              <button
                onClick={() => setSelectedBuddy(null)}
                className="px-6 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold shadow-sm hover:bg-gray-50 hover:border-gray-300 transition flex-1"
              >
                Close View
              </button>
              <button
                onClick={async () => {
                  const buddyId = getBuddyId(selectedBuddy);
                  if (!buddyId) return;

                  const reason = window.prompt("Reason for rejection (optional):", "");
                  if (reason === null) return;

                  try {
                    const res = await rejectBuddy(buddyId, reason);
                    if (res?.buddy) {
                      upsertBuddy(res.buddy);
                    }
                    pushLiveNotice(res?.message || `${selectedBuddy.name} rejected`);
                    setSelectedBuddy(null);
                  } catch (error) {
                    console.error("Failed to reject buddy:", error);
                  }
                }}
                className="px-6 py-3.5 bg-red-500 text-white rounded-xl font-bold shadow-md shadow-red-500/30 hover:bg-red-600 hover:shadow-lg transition flex-1 flex justify-center items-center gap-2"
              >
                <AlertTriangle size={18} /> Reject Applicant
              </button>
              <button
                onClick={async () => {
                  const buddyId = getBuddyId(selectedBuddy);
                  if (!buddyId) return;
                  try {
                    const res = await verifyBuddy(buddyId);
                    if (res) {
                      if (res?.buddy) {
                        upsertBuddy(res.buddy);
                      }
                      pushLiveNotice(res?.message || `${selectedBuddy.name} verified`);
                      setSelectedBuddy(null);
                    }
                  } catch (error) {
                    console.error("Failed to verify buddy:", error);
                  }
                }}
                className="px-6 py-3.5 bg-emerald-500 text-white rounded-xl font-bold shadow-md shadow-emerald-500/30 hover:bg-emerald-600 hover:shadow-lg transition flex-1 flex justify-center items-center gap-2"
              >
                <CheckCircle size={18} /> Approve Applicant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
