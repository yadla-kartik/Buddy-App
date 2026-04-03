import { useEffect, useState, useRef } from "react";
import { FaBell, FaTasks, FaWallet, FaChartLine } from "react-icons/fa";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import buddyLogo from "../../assets/buddyLogo.png";
import buddyIcon from "../../assets/buddy.png";
import { getBuddyStatus } from "../../services/buddyAuthService";
import { getPendingTasks, acceptTask } from "../../services/taskService";

const BuddyDashboard = () => {
  const [buddyData, setBuddyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [acceptingTaskId, setAcceptingTaskId] = useState(null);
  const navigate = useNavigate();
  const verificationIntervalRef = useRef(null);
  const taskIntervalRef = useRef(null);

  // ✅ Initial data fetch
  useEffect(() => {
    fetchBuddyData();

    return () => {
      // Cleanup all intervals on unmount
      if (verificationIntervalRef.current) {
        clearInterval(verificationIntervalRef.current);
      }
      if (taskIntervalRef.current) {
        clearInterval(taskIntervalRef.current);
      }
    };
  }, []);

  // ✅ Auto-refresh verification status if not verified
  useEffect(() => {
    // Clear existing interval
    if (verificationIntervalRef.current) {
      clearInterval(verificationIntervalRef.current);
    }

    if (buddyData && !buddyData.isVerified) {
      verificationIntervalRef.current = setInterval(() => {
        checkVerificationStatus();
      }, 5000);
    }

    return () => {
      if (verificationIntervalRef.current) {
        clearInterval(verificationIntervalRef.current);
      }
    };
  }, [buddyData?.isVerified]);

  // ✅ Auto-refresh tasks if verified
  useEffect(() => {
    // Clear existing interval
    if (taskIntervalRef.current) {
      clearInterval(taskIntervalRef.current);
    }

    if (buddyData?.isVerified) {
      taskIntervalRef.current = setInterval(() => {
        fetchTasks();
      }, 10000); // Refresh every 10 seconds
    }

    return () => {
      if (taskIntervalRef.current) {
        clearInterval(taskIntervalRef.current);
      }
    };
  }, [buddyData?.isVerified]);

  const fetchBuddyData = async () => {
    try {
      await fetchBuddyStatus();
    } catch (err) {
      console.error("Data fetch error:", err);
      setLoading(false);
    }
  };

  const fetchBuddyStatus = async () => {
    try {
      const res = await getBuddyStatus();
      console.log("✅ Buddy Status:", res.buddy);
      
      setBuddyData(res.buddy);
      localStorage.setItem("buddyData", JSON.stringify(res.buddy));
      
      if (res.buddy.isVerified) {
        await fetchTasks();
      }
    } catch (err) {
      console.error("Status fetch error:", err);
      
      if (err.response?.status === 401) {
        localStorage.removeItem("buddyData");
        navigate("/buddy/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Silent verification check
  const checkVerificationStatus = async () => {
    try {
      const res = await getBuddyStatus();
      
      // Only update if status changed
      if (res.buddy.isVerified !== buddyData?.isVerified) {
        console.log("🔄 Verification status changed!");
        setBuddyData(res.buddy);
        localStorage.setItem("buddyData", JSON.stringify(res.buddy));
        
        if (res.buddy.isVerified) {
          await fetchTasks();
        }
      }
    } catch (err) {
      console.error("Verification check error:", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await getPendingTasks();
      console.log("✅ Tasks fetched:", res.tasks?.length || 0);
      setTasks(res.tasks || []);
    } catch (err) {
      console.error("Tasks fetch error:", err);
      setTasks([]);
    }
  };

  const handleAcceptTask = async (taskId) => {
    try {
      setAcceptingTaskId(taskId);
      const res = await acceptTask(taskId);
      
      if (res.message === "Task accepted successfully") {
        alert("✅ Task accepted successfully!");
        await fetchTasks();
      } else {
        alert(res.message || "Failed to accept task");
      }
    } catch (err) {
      console.error("Accept task error:", err);
      alert("Failed to accept task");
    } finally {
      setAcceptingTaskId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // ❌ NOT VERIFIED - WAITING SCREEN
  if (!buddyData?.isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
        <header className="w-full h-16 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <img src={buddyIcon} alt="Buddy Icon" className="w-20 mb-3" />
            <img src={buddyLogo} alt="Buddy Logo" className="w-32 h-auto" />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer hover:scale-110 transition">
              <FaBell className="text-xl text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                1
              </span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
              <div className="w-9 h-9 bg-gradient-to-br from-[#6A2AFF] to-[#D116A8] rounded-full flex items-center justify-center text-white font-semibold">
                {buddyData?.name?.charAt(0) || "B"}
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {buddyData?.name || "Buddy Partner"}
              </span>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-10 flex justify-center">
          <div className="w-full max-w-3xl">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300/30 rounded-full -mr-32 -mt-32 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-pink-300/30 rounded-full -ml-28 -mb-28 blur-2xl"></div>

              <div className="relative z-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                  Welcome {buddyData?.name || "Buddy"} 👋
                </h1>
                <p className="text-gray-600 text-lg mb-6">
                  Thank you for joining <span className="font-semibold">My Buddy</span>
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 inline-block">
                  <p className="text-yellow-700 font-semibold text-lg mb-2">
                    Verification in Progress ⏳
                  </p>
                  <p className="text-gray-600 text-sm max-w-md mb-4">
                    Our team is reviewing your details.
                    Once verified, you'll be able to accept tasks and start earning.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    Checking status automatically every 5 seconds...
                  </div>
                </div>
                <button
                  onClick={fetchBuddyStatus}
                  className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  🔄 Refresh Status Now
                </button>
                <p className="mt-8 text-gray-500 flex items-center justify-center gap-2">
                  We appreciate your patience
                  <Heart size={16} className="text-red-500 animate-pulse" />
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ✅ VERIFIED - TASKS DASHBOARD
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="w-full h-16 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <img src={buddyIcon} alt="Buddy Icon" className="w-20 mb-3" />
          <img src={buddyLogo} alt="Buddy Logo" className="w-32 h-auto" />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer hover:scale-110 transition">
            <FaBell className="text-xl text-gray-600" />
            {tasks.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                {tasks.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
            <div className="w-9 h-9 bg-gradient-to-br from-[#6A2AFF] to-[#D116A8] rounded-full flex items-center justify-center text-white font-semibold">
              {buddyData?.name?.charAt(0) || "B"}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {buddyData?.name}
            </span>
          </div>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {/* Welcome Message */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {buddyData?.name}! 🎉
          </h1>
          <p className="text-gray-600 mt-1">Ready to earn today?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Available Tasks</p>
                <p className="text-3xl font-bold text-gray-800">{tasks.length}</p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                <FaTasks className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-800">₹0</p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <FaWallet className="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Tasks Completed</p>
                <p className="text-3xl font-bold text-gray-800">0</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <FaChartLine className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Available Tasks</h2>
            <button 
              onClick={fetchTasks}
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2 transition"
            >
              <span>🔄</span> Refresh
            </button>
          </div>
          
          {tasks.length === 0 ? (
            <div className="text-center py-16">
              <FaTasks className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No tasks available at the moment</p>
              <p className="text-gray-400 text-sm mt-2">
                Tasks refresh automatically every 10 seconds • Check back soon!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div 
                  key={task._id} 
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-lg hover:border-purple-300 transition-all"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      {/* Task Type Badge */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                          {task.taskType?.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          {task.taskLocationType?.toUpperCase()}
                        </span>
                      </div>

                      {/* Parent Info */}
                      <h3 className="font-semibold text-lg text-gray-800 mb-1">
                        {task.parentName}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">📱 {task.parentMobile}</p>

                      {/* Task Description */}
                      <p className="text-gray-700 text-sm mb-3 bg-gray-50 p-3 rounded-lg">
                        {task.taskDescription}
                      </p>

                      {/* Location */}
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600">
                          <span className="font-medium">📍 Parent Location:</span> {task.parentCurrentLocation}
                        </p>
                        {task.taskLocationDescription && (
                          <p className="text-gray-600">
                            <span className="font-medium">🎯 Task Location:</span> {task.taskLocationDescription}
                          </p>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          Posted by: <span className="font-medium">{task.user?.name || "User"}</span> • {new Date(task.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <button 
                        onClick={() => handleAcceptTask(task._id)}
                        disabled={acceptingTaskId === task._id}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                      >
                        {acceptingTaskId === task._id ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Accepting...
                          </span>
                        ) : (
                          "Accept Task"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BuddyDashboard;