import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { buddyLogin, getBuddyStatus } from "../../services/buddyAuthService";
import buddyImage from "../../assets/buddyLogin.png";

const BuddyLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Reverse guard: if already logged in, redirect to dashboard
  useEffect(() => {
    getBuddyStatus()
      .then((res) => { if (res?.buddy) navigate("/buddy/dashboard"); })
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
      const result = await buddyLogin(formData);

      if (result.message === "Login successful" && result.buddy) {
        localStorage.setItem("buddyData", JSON.stringify(result.buddy));
        navigate("/buddy/dashboard");
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
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <p className="text-xs font-semibold text-[#6A2AFF] uppercase tracking-widest mb-1">
              My Buddy
            </p>
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-400 mt-1">Buddy login</p>
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
                placeholder="you@email.com"
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
              className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-80 disabled:hover:scale-100"
              style={{ background: "linear-gradient(90deg, #6A2AFF, #D116A8)" }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm text-gray-500 pt-1">
              New Buddy?{" "}
              <Link to="/buddy/signup" className="text-[#6A2AFF] font-semibold hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>

        <div className="hidden md:flex w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#6A2AFF]/5 to-[#D116A8]/5 p-10 gap-5">
          <img
            src={buddyImage}
            alt="Buddy"
            className="max-h-[52vh] object-contain hover:scale-105 transition-transform duration-300"
          />
          <div className="text-center">
            <p className="text-base font-semibold text-gray-700">Your trusted buddy, always there.</p>
            <p className="text-sm text-gray-400 mt-1">Supporting families across every distance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuddyLogin;

