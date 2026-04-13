import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminImage from "../../assets/admin.png";
import { adminLogin, getAdminMe } from "../../services/adminAuthService";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Reverse guard: if already logged in, redirect to dashboard
  useEffect(() => {
    getAdminMe()
      .then((res) => { if (res) navigate("/admin/dashboard"); })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    if (error) setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await adminLogin(formData);

      if (res?.message === "Admin login successful") {
        navigate("/admin/dashboard");
      } else {
        setError("Invalid credentials");
        setFormData((prev) => ({ ...prev, password: "" }));
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full p-3 rounded-xl bg-gray-50 text-sm border border-gray-200 outline-none " +
    "focus:border-[#6A2AFF] focus:ring-2 focus:ring-[#6A2AFF]/10 " +
    "hover:border-[#8755F9] transition-all duration-200 text-gray-800 placeholder-gray-400";

  const labelCls =
    "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1";

  return (
    <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_60px_rgba(106,42,255,0.10)] overflow-hidden flex min-h-[520px]">

        {/* LEFT FORM */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <p className="text-xs font-semibold text-[#6A2AFF] uppercase tracking-widest mb-1">
              Admin Portal
            </p>
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-400 mt-1">Admin login securely</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-sm text-red-500">{error}</div>}

            <div>
              <label className={labelCls}>
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="admin@email.com"
                value={formData.email}
                onChange={handleChange}
                className={inputCls}
                required
              />
            </div>

            <div>
              <label className={labelCls}>
                Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={inputCls}
                required
              />
            </div>

            <div className="text-right">
              <span className="text-xs text-[#D116A8] cursor-pointer hover:underline font-medium">
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl text-white font-semibold text-sm hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-80 disabled:hover:scale-100"
              style={{ background: "linear-gradient(90deg, #6A2AFF, #D116A8)" }}
            >
              {loading ? "Logging in..." : "Login as Admin"}
            </button>


          </form>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden md:flex w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#6A2AFF]/5 to-[#D116A8]/5 p-10 gap-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#6A2AFF]/10 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#D116A8]/10 to-transparent rounded-tr-full"></div>
          <img
            src={adminImage}
            alt="Admin"
            className="max-h-[52vh] object-contain hover:scale-105 transition-transform duration-500 z-10 drop-shadow-xl"
          />
          <div className="text-center z-10">
            <p className="text-base font-semibold text-gray-700">Secure Admin Workspace</p>
            <p className="text-sm text-gray-400 mt-1">Manage platform operations seamlessly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

