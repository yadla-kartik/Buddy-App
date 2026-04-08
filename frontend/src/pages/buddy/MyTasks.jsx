import { useState } from "react";
import { 
  CheckCircle2, Clock, Calendar, MapPin, ChevronRight, Filter, Search, 
  ClipboardList, User, XCircle, Phone, Navigation, AlertCircle, HeartPulse, FileText 
} from "lucide-react";
import BuddyNav from "./BuddyNav"; 

export default function MyTasks() {
  const [activeTab, setActiveTab] = useState("current");
  const [searchQuery, setSearchQuery] = useState("");

  const buddy = {
    name: "Rahul Sharma",
    status: "welcome", 
  };

  // Detailed mock data for the SINGLE current task
  const currentTask = {
    id: 6, 
    name: "Hospital escort for Mr. Patel", 
    date: "10 April, 2025", 
    time: "10:00 AM - 1:00 PM", 
    location: "Lilavati Hospital, A-791, Bandra Reclamation, Bandra West, Mumbai, 400050", 
    type: "Hospital Visit", 
    status: "in-progress",
    elderly: {
      name: "Mr. Raj Patel",
      age: 72,
      bloodGroup: "O+",
      phone: "+91 98765 43210",
      emergencyContact: "+91 91234 56789"
    },
    instructions: "Please arrive 15 minutes early. Mr. Patel will be waiting in the ground floor lobby. Wheelchair assistance is required from the hospital entrance to the Cardiology department. Collect medical file from his desk before leaving."
  };

  // Lists for other tabs
  const completedTasks = [
    { id: 1, name: "Campus orientation support", date: "Apr 6", time: "11:00 AM", location: "Main Campus", type: "Orientation", assignee: "College Admin", status: "completed" },
    { id: 2, name: "Mentorship session — 1hr", date: "Apr 3", time: "2:00 PM", location: "Library", type: "Mentorship", assignee: "Freshmen Group", status: "completed" },
  ];

  const cancelledTasks = [
    { id: 5, name: "Doctor appointment accompaniment", date: "Apr 8", time: "11:00 AM", location: "Asian Heart Institute", type: "Hospital Visit", assignee: "Mrs. Gupta", status: "cancelled" }
  ];

  const displayedListTasks = activeTab === "completed" ? completedTasks : cancelledTasks;
  
  const filteredListTasks = displayedListTasks.filter(task => 
    task.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    task.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f7f8fc] font-[Poppins,sans-serif] flex flex-col">
      <BuddyNav buddy={buddy} status={buddy.status} unreadCount={2} />

      <main className="flex-1 max-w-5xl w-full mx-auto flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          
          {activeTab !== "current" && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search tasks..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#6A2AFF] focus:ring-1 focus:ring-[#6A2AFF]/20 transition-all w-full sm:w-64 bg-white"
                />
              </div>
              <button className="flex items-center justify-center p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:text-[#6A2AFF] hover:border-[#6A2AFF] transition-all shadow-sm">
                <Filter size={18} />
              </button>
            </div>
          )}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 border-b border-gray-200 flex-wrap">
          <button 
            onClick={() => setActiveTab("current")}
            className={`px-5 py-3 text-sm font-semibold transition-all relative ${
              activeTab === "current" ? "text-[#6A2AFF]" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Current Task
            <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-[10px]">1</span>
            {activeTab === "current" && (
              <span className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-gradient-to-r from-[#6A2AFF] to-[#D116A8] rounded-t-full"></span>
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab("completed")}
            className={`px-5 py-3 text-sm font-semibold transition-all relative ${
              activeTab === "completed" ? "text-[#D116A8]" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Completed
            <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-[10px]">{completedTasks.length}</span>
            {activeTab === "completed" && (
              <span className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-gradient-to-r from-[#6A2AFF] to-[#D116A8] rounded-t-full"></span>
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab("cancelled")}
            className={`px-5 py-3 text-sm font-semibold transition-all relative ${
              activeTab === "cancelled" ? "text-rose-500" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Cancelled
            <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-[10px]">{cancelledTasks.length}</span>
            {activeTab === "cancelled" && (
              <span className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-rose-500 rounded-t-full"></span>
            )}
          </button>
        </div>

        {/* ── Content View ── */}
        <div className="pb-12 mt-2">
          
          {/* DETAILED CURRENT TASK VIEW */}
          {activeTab === "current" && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden">
              
              {/* Top Banner indicating status */}
              <div className="bg-purple-50 px-8 py-4 border-b border-purple-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6A2AFF] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#6A2AFF]"></span>
                  </span>
                  <span className="text-sm font-bold text-[#6A2AFF] uppercase tracking-widest">Active Mission</span>
                </div>
                <div className="text-xs font-semibold bg-white border border-purple-200 text-gray-700 px-3 py-1 rounded-full shadow-sm">
                  {currentTask.type}
                </div>
              </div>

              {/* Task Details Content */}
              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* Left Column: Task Core Details */}
                <div className="flex flex-col gap-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-4">{currentTask.name}</h2>
                    
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                          <Calendar size={18} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date & Time</p>
                          <p className="text-base font-bold text-gray-900">{currentTask.date}</p>
                          <p className="text-sm text-gray-600">{currentTask.time}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                          <MapPin size={18} className="text-orange-500" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</p>
                          <p className="text-sm font-semibold text-gray-900 leading-relaxed">{currentTask.location}</p>
                          <button className="text-xs font-bold text-[#6A2AFF] mt-1 flex items-center gap-1 hover:underline">
                            <Navigation size={12} /> Get Directions
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 flex items-start gap-3">
                    <AlertCircle className="text-amber-500 mt-0.5 shrink-0" size={20} />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">Special Instructions</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{currentTask.instructions}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Elderly Information & Actions */}
                <div className="flex flex-col justify-between border-l border-gray-100 pl-0 lg:pl-10">
                  <div className="flex flex-col gap-6">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">Assigned Elderly Details</p>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6A2AFF] to-[#D116A8] flex items-center justify-center text-white text-xl font-bold border-2 border-white shadow-md">
                          {currentTask.elderly.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{currentTask.elderly.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                              Age: {currentTask.elderly.age}
                            </span>
                            <span className="text-xs font-semibold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                              <HeartPulse size={10} /> {currentTask.elderly.bloodGroup}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-500" />
                            <span className="text-sm font-semibold text-gray-800">{currentTask.elderly.phone}</span>
                          </div>
                          <button className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors">Call</button>
                        </div>
                        <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-500" />
                            <div className="flex flex-col">
                              <span className="text-xs text-gray-500">Emergency</span>
                              <span className="text-sm font-semibold text-gray-800">{currentTask.elderly.emergencyContact}</span>
                            </div>
                          </div>
                          <button className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 hover:bg-rose-100 transition-colors">Call Alert</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Actions block */}
                  <div className="pt-8 flex flex-col gap-3 mt-8 lg:mt-0">
                    <button className="w-full bg-gradient-to-r from-[#6A2AFF] to-[#D116A8] text-white py-3.5 rounded-xl text-sm font-bold shadow-md hover:shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2">
                      <CheckCircle2 size={18} /> Mark Task as Completed
                    </button>
                    <button className="w-full bg-white border border-gray-200 text-gray-600 py-3.5 rounded-xl text-sm font-semibold hover:border-[#6A2AFF] hover:text-[#6A2AFF] transition-all">
                      Report an Issue / Reschedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LIST VIEW FOR COMPLETED & CANCELLED */}
          {activeTab !== "current" && (
            <div className="flex flex-col gap-4">
              {filteredListTasks.length > 0 ? (
                filteredListTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 hover:shadow-md transition-shadow group flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {/* Icon Block */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm
                        ${task.status === "completed" ? "bg-emerald-50 border border-emerald-100 text-emerald-500" : "bg-rose-50 border border-rose-100 text-rose-500"}`}
                      >
                        {task.status === "completed" ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
                      </div>
                      
                      {/* Task Details */}
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-gray-900">{task.name}</h3>
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full
                            ${task.status === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                            {task.status}
                          </span>
                          <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                            {task.type}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center gap-4 text-xs font-medium text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-400" /> {task.date}</span>
                          <span className="flex items-center gap-1.5"><Clock size={14} className="text-gray-400" /> {task.time}</span>
                        </div>
                        
                        <div className="mt-1 flex items-center gap-4 text-xs font-semibold text-gray-600 flex-wrap">
                          <span className="flex items-center gap-1.5 text-gray-500"><MapPin size={14} className="text-gray-400" /> {task.location}</span>
                          <span className="flex items-center gap-1.5 ml-0 sm:ml-2"><User size={14} className="text-gray-400" /> For: <span className="text-gray-800">{task.assignee}</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                      <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-gray-50 border border-gray-200 text-gray-600 hover:text-[#6A2AFF] hover:bg-purple-50 hover:border-purple-200 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all">
                        <FileText size={16} /> Summary 
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                  <ClipboardList size={48} className="text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-800 mb-1">No tasks found</h3>
                  <p className="text-sm text-gray-500">You don't have any {activeTab} tasks matching your search.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
