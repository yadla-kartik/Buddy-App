import { useEffect, useState } from "react";
import { createTask } from "../../services/taskService";
import { useNavigate } from "react-router-dom";
import { User, Phone, MapPin, Tag, AlignLeft, Calendar, Clock, Zap, ArrowLeft } from "lucide-react";

const CreateNewTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1 = Parent, 2 = Task, 3 = Schedule

  const [formData, setFormData] = useState({
    parentName: "",
    parentMobile: "",
    parentCurrentLocation: "",
    taskLocationType: "",
    taskLocationDescription: "",
    taskType: "",
    taskDescription: "",
    taskDate: "",
    taskTime: "",
    priority: "normal",
  });

  useEffect(() => {}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    setErrors((prev) => ({ ...prev, [name]: "" }));
    localStorage.setItem("taskDraft", JSON.stringify(updated));
  };

  const validateForm = () => {
    const { parentName, parentMobile, parentCurrentLocation, taskLocationType, taskType, taskDescription } = formData;
    const nextErrors = {};
    if (!parentName.trim()) nextErrors.parentName = "Parent name is required";
    if (!parentMobile.trim() || !/^\d{10}$/.test(parentMobile)) nextErrors.parentMobile = "Valid 10-digit number required";
    if (!parentCurrentLocation.trim()) nextErrors.parentCurrentLocation = "Parent location is required";
    if (!taskLocationType) nextErrors.taskLocationType = "Please select location type";
    if (!taskType) nextErrors.taskType = "Please select task type";
    if (!taskDescription.trim()) nextErrors.taskDescription = "Task description is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      const res = await createTask(formData);
      if (res?.task) {
        localStorage.setItem("latestTaskId", res.task._id);
        localStorage.removeItem("taskDraft");
        alert("✅ Task created successfully!");
        navigate("/payment");
      } else {
        alert(res?.message || "❌ Failed to create task");
      }
    } catch (err) {
      console.error("Task creation error:", err);
      if (err.response?.status === 401) {
        alert("❌ Please login first");
        navigate("/login");
      } else {
        alert("❌ Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#6A2AFF] focus:ring-2 focus:ring-[#6A2AFF]/10 hover:border-[#8755F9] transition-all duration-200";
  const errorCls = "text-xs text-red-500 mt-1 font-medium";
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1";

  const LOCATION_TYPES = [
    { value: "home",     label: "🏠 Home"            },
    { value: "hospital", label: "🏥 Hospital"         },
    { value: "outside",  label: "🛒 Outside / Market" },
    { value: "others",   label: "📍 Others"           },
  ];

  const TASK_TYPES = [
    { value: "need_help",      label: "🙏 Need Help"       },
    { value: "pickup_drop",    label: "🚗 Pickup / Drop"   },
    { value: "document_work",  label: "📄 Document Work"   },
    { value: "hospital_visit", label: "🏥 Hospital Visit"  },
    { value: "walk",           label: "🚶 Walk"            },
    { value: "others",         label: "✨ Others"          },
  ];

  const PRIORITIES = [
    { value: "normal",    label: "Normal",    color: "border-gray-300 text-gray-600",   active: "border-blue-500 bg-blue-50 text-blue-600"    },
    { value: "urgent",    label: "Urgent",    color: "border-gray-300 text-gray-600",   active: "border-orange-500 bg-orange-50 text-orange-600" },
    { value: "emergency", label: "Emergency", color: "border-gray-300 text-gray-600",   active: "border-red-500 bg-red-50 text-red-600"       },
  ];

  return (
    <div
      className="min-h-screen bg-[#f7f8fc] flex items-center justify-center p-4"
      style={{ backgroundImage: "linear-gradient(to bottom, rgba(106,42,255,0.08), transparent 30%)" }}
    >
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:text-[#6A2AFF] transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
            <p className="text-sm text-gray-400">Your Buddy is ready to help your parents</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(106,42,255,0.08)] border border-gray-100 p-6 md:p-8 space-y-6">

          {/* ── PARENT DETAILS ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                <User size={14} className="text-[#6A2AFF]" />
              </div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Parent Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Parent Name <span className="text-red-400">*</span></label>
                <input name="parentName" value={formData.parentName} onChange={handleChange} placeholder="e.g. Ramesh Sharma" className={inputCls} />
                {errors.parentName && <p className={errorCls}>{errors.parentName}</p>}
              </div>
              <div>
                <label className={labelCls}>Mobile Number <span className="text-red-400">*</span></label>
                <input name="parentMobile" value={formData.parentMobile} onChange={handleChange} placeholder="10-digit number" type="tel" maxLength="10" className={inputCls} />
                {errors.parentMobile && <p className={errorCls}>{errors.parentMobile}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className={labelCls}>Parent Current Location <span className="text-red-400">*</span></label>
              <textarea name="parentCurrentLocation" value={formData.parentCurrentLocation} onChange={handleChange} placeholder="e.g. 12, MG Road, Raipur, Chhattisgarh" rows="2" className={`${inputCls} resize-none`} />
              {errors.parentCurrentLocation && <p className={errorCls}>{errors.parentCurrentLocation}</p>}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* ── TASK LOCATION ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-pink-50 flex items-center justify-center">
                <MapPin size={14} className="text-[#D116A8]" />
              </div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Task Location</h2>
            </div>

            <div>
              <label className={labelCls}>Location Type <span className="text-red-400">*</span></label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                {LOCATION_TYPES.map((lt) => (
                  <button
                    key={lt.value}
                    type="button"
                    onClick={() => handleChange({ target: { name: "taskLocationType", value: lt.value } })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      formData.taskLocationType === lt.value
                        ? "border-[#6A2AFF] bg-purple-50 text-[#6A2AFF]"
                        : "border-gray-200 text-gray-500 hover:border-purple-300"
                    }`}
                  >
                    {lt.label}
                  </button>
                ))}
              </div>
              {errors.taskLocationType && <p className={errorCls}>{errors.taskLocationType}</p>}
            </div>

            <div className="mt-4">
              <label className={labelCls}>Location Description <span className="text-gray-300">(optional)</span></label>
              <textarea name="taskLocationDescription" value={formData.taskLocationDescription} onChange={handleChange} rows="2" placeholder="Any specific details about the location..." className={`${inputCls} resize-none`} />
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* ── TASK DETAILS ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <Tag size={14} className="text-blue-600" />
              </div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Task Details</h2>
            </div>

            <div>
              <label className={labelCls}>Task Type <span className="text-red-400">*</span></label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                {TASK_TYPES.map((tt) => (
                  <button
                    key={tt.value}
                    type="button"
                    onClick={() => handleChange({ target: { name: "taskType", value: tt.value } })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all text-left ${
                      formData.taskType === tt.value
                        ? "border-[#6A2AFF] bg-purple-50 text-[#6A2AFF]"
                        : "border-gray-200 text-gray-500 hover:border-purple-300"
                    }`}
                  >
                    {tt.label}
                  </button>
                ))}
              </div>
              {errors.taskType && <p className={errorCls}>{errors.taskType}</p>}
            </div>

            <div className="mt-4">
              <label className={labelCls}>Task Description <span className="text-red-400">*</span></label>
              <textarea name="taskDescription" value={formData.taskDescription} onChange={handleChange} rows="3" placeholder="Describe what your Buddy needs to do..." className={`${inputCls} resize-none`} />
              {errors.taskDescription && <p className={errorCls}>{errors.taskDescription}</p>}
            </div>

            {/* Priority */}
            <div className="mt-4">
              <label className={labelCls}>Priority</label>
              <div className="flex gap-2 mt-1">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => handleChange({ target: { name: "priority", value: p.value } })}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      formData.priority === p.value ? p.active : p.color
                    }`}
                  >
                    {p.value === "normal" ? "🟢" : p.value === "urgent" ? "🟠" : "🔴"} {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* ── SCHEDULE ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Calendar size={14} className="text-emerald-600" />
              </div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                Schedule <span className="text-gray-300 normal-case font-normal">(optional)</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Date</label>
                <input type="date" name="taskDate" value={formData.taskDate} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Time</label>
                <input type="time" name="taskTime" value={formData.taskTime} onChange={handleChange} className={inputCls} />
              </div>
            </div>
          </div>

          {/* ── SUBMIT ── */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-sm tracking-wide shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ background: "linear-gradient(90deg, #6A2AFF, #D116A8)" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Task...
              </span>
            ) : (
              "Create Task & Proceed to Payment →"
            )}
          </button>

          <p className="text-center text-xs text-gray-400">* Required fields</p>

        </div>
      </div>
    </div>
  );
};

export default CreateNewTask;