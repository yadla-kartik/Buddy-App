import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import adminImage from "../../assets/admin.png";
import { adminLogin } from "../../services/adminAuthService";



const AdminLogin = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    
    const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
    const handleSubmit = async (e) => {
  e.preventDefault();

  const res = await adminLogin(formData); // 👈 YAHI USE HOTA HAI

  if (res?.message === "Admin login successful") {
    navigate("/admin/dashboard");
  } else {
    alert(res?.message || "Login failed");
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
            Secure Admin Access
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
                Login
              </h2>
            </div>

            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              onChange={handleChange}
              required
              className="w-full mb-4 p-3 rounded-lg bg-gray-50 border focus:border-[#6A2AFF]"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
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
              Login as Admin
            </button>

            <p className="mt-5 text-center text-sm text-gray-600">
              New admin?{" "}
              <Link to="/admin/register" className="text-[#6A2AFF] hover:underline">
                Create account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
