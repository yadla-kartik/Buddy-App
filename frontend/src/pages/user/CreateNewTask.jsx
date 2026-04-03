import { useState } from "react";
import { Heart } from "lucide-react";
import { createTask } from "../../services/taskService";
import { useNavigate } from "react-router-dom";

const CreateNewTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    parentName: "",
    parentMobile: "",
    parentCurrentLocation: "",
    taskLocationType: "",
    taskLocationDescription: "",
    taskType: "",
    taskDescription: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const {
      parentName,
      parentMobile,
      parentCurrentLocation,
      taskLocationType,
      taskType,
      taskDescription,
    } = formData;

    if (!parentName.trim()) {
      alert("❌ Please enter parent name");
      return false;
    }

    if (!parentMobile.trim() || parentMobile.length < 10) {
      alert("❌ Please enter valid mobile number (10 digits)");
      return false;
    }

    if (!parentCurrentLocation.trim()) {
      alert("❌ Please enter parent location");
      return false;
    }

    if (!taskLocationType) {
      alert("❌ Please select task location type");
      return false;
    }

    if (!taskType) {
      alert("❌ Please select task type");
      return false;
    }

    if (!taskDescription.trim()) {
      alert("❌ Please describe the task");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    // ✅ Validate form first
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const res = await createTask(formData);

      if (res?.task) {
        // ✅ Store taskId for payment
        localStorage.setItem("latestTaskId", res.task._id);

        // ✅ Success message
        alert("✅ Task created successfully!");

        // ✅ Navigate to payment
        navigate("/payment");
      } else {
        alert(res?.message || "❌ Failed to create task");
      }
    } catch (err) {
      console.error("Task creation error:", err);
      
      // ✅ Check if user is not logged in
      if (err.response?.status === 401) {
        alert("❌ Please login first to create a task");
        navigate("/login");
      } else {
        alert("❌ Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Create New Task 📝
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            Your Buddy is ready to serve you with care & trust
            <Heart size={18} className="text-red-500 animate-pulse" />
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {/* PARENT DETAILS */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Parent Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                placeholder="Parent Name *"
                className="input"
                required
              />
              <input
                name="parentMobile"
                value={formData.parentMobile}
                onChange={handleChange}
                placeholder="Mobile Number *"
                type="tel"
                maxLength="10"
                className="input"
                required
              />
            </div>

            <textarea
              name="parentCurrentLocation"
              value={formData.parentCurrentLocation}
              onChange={handleChange}
              placeholder="Parent Current Location *"
              rows="3"
              className="input mt-4"
              required
            />
          </div>

          {/* TASK LOCATION */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Task Location
            </h2>

            <select
              name="taskLocationType"
              value={formData.taskLocationType}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select Location Type *</option>
              <option value="home">Home</option>
              <option value="hospital">Hospital</option>
              <option value="outside">Outside / Market</option>
              <option value="others">Others</option>
            </select>

            <textarea
              name="taskLocationDescription"
              value={formData.taskLocationDescription}
              onChange={handleChange}
              rows="3"
              placeholder="Task location details (optional)"
              className="input mt-4"
            />
          </div>

          {/* TASK TYPE */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Task Type
            </h2>

            <select
              name="taskType"
              value={formData.taskType}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select Task Type *</option>
              <option value="need_help">Need Help</option>
              <option value="pickup_drop">Pickup / Drop</option>
              <option value="document_work">Document Work</option>
              <option value="hospital_visit">Hospital Visit</option>
              <option value="walk">Walk</option>
              <option value="others">Others</option>
            </select>
          </div>

          {/* TASK DESCRIPTION */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Task Description
            </h2>

            <textarea
              name="taskDescription"
              value={formData.taskDescription}
              onChange={handleChange}
              rows="4"
              placeholder="Briefly describe the task *"
              className="input"
              required
            />
          </div>

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg text-white font-semibold 
            bg-gradient-to-r from-[#6A2AFF] to-[#D116A8]
            hover:scale-[1.02] transition-all shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Task...
              </span>
            ) : (
              "Create Task & Proceed to Payment"
            )}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            * Required fields
          </p>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          outline: none;
          transition: all 0.2s;
        }
        .input:focus {
          border-color: #6A2AFF;
          background: white;
          box-shadow: 0 0 0 3px rgba(106, 42, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default CreateNewTask;