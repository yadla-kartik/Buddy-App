import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import adminImage from "../../assets/admin.png";
import { adminRegister } from "../../services/adminAuthService";

const AdminRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ✅ THIS WAS MISSING / BROKEN
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ MUST BE ASYNC
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await adminRegister(formData);

    if (res?.message === "Admin registered successfully") {
      navigate("/admin/dashboard");
    } else {
      alert(res?.message || "Admin registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-5xl flex bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* LEFT IMAGE */}
        <div className="w-1/2 hidden md:flex flex-col items-center justify-center bg-gray-50 p-6">
          <img
            src={adminImage}
            alt="Admin"
            className="max-h-[60vh] object-contain"
          />
          <p className="mt-4 text-sm text-gray-500">
            Create Admin Account
          </p>
        </div>

        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white rounded-xl p-8"
          >
            <div className="text-center mb-6">
              <p className="text-2xl font-medium">Admin Panel</p>
              <h2 className="text-xl font-semibold text-[#6A2AFF] mt-1">
                Register
              </h2>
            </div>

            <input
              type="text"
              name="name"
              placeholder="Admin Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full mb-4 p-3 rounded-lg bg-gray-50 border focus:border-[#6A2AFF]"
            />

            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mb-4 p-3 rounded-lg bg-gray-50 border focus:border-[#6A2AFF]"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mb-4 p-3 rounded-lg bg-gray-50 border focus:border-[#6A2AFF]"
            />

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold
              bg-linear-to-r from-[#6A2AFF] to-[#D116A8]
              hover:scale-[1.03] transition"
            >
              Register Admin
            </button>

            <p className="mt-5 text-center text-sm text-gray-600">
              Already an admin?{" "}
              <Link to="/admin/login" className="text-[#6A2AFF] hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminRegister;
