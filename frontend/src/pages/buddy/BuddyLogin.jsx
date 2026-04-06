import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { buddyLogin } from "../../services/buddyAuthService";
import buddyImage from "../../assets/buddyParent.png";

const BuddyLogin = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
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
        setError(result.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = () =>
    `w-full px-4 py-3 rounded-xl bg-gray-50 border text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 border-gray-200 focus:border-[#6A2AFF] focus:ring-2 focus:ring-[#6A2AFF]/10 hover:border-[#8755F9]`;

  const labelCls =
    "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1";

  return (
    <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_60px_rgba(106,42,255,0.10)] overflow-hidden flex">

        {/* LEFT SAME IMAGE */}
        <div className="hidden md:flex w-2/5 flex-col items-center justify-center bg-gradient-to-br from-[#D116A8]/5 to-[#6A2AFF]/5 p-10 gap-5">
          <img
            src={buddyImage}
            alt="Buddy"
            className="max-h-[55vh] object-contain"
          />
          <div className="text-center">
            <p className="text-base font-semibold text-gray-700">
              Welcome Back!
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Login to continue helping others.
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="w-full md:w-3/5 p-8 md:p-10">

          <div className="mb-6">
            <p className="text-xs font-semibold text-[#6A2AFF] uppercase tracking-widest mb-1">
              My Buddy
            </p>
            <h2 className="text-2xl font-bold text-gray-900">
              Buddy Login
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Enter your credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ERROR */}
            {error && (
              <div className="text-sm text-red-500">{error}</div>
            )}

            {/* EMAIL */}
            <div>
              <label className={labelCls}>Email *</label>
              <input
                type="email"
                name="email"
                placeholder="you@email.com"
                value={formData.email}
                onChange={handleChange}
                className={inputCls()}
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className={labelCls}>Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputCls()}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* FORGOT */}
            <div className="text-right text-sm text-[#D116A8] cursor-pointer hover:underline">
              Forgot Password?
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold transition"
              style={{
                background: "linear-gradient(90deg, #6A2AFF, #D116A8)",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* REGISTER LINK */}
            <p className="text-center text-sm text-gray-500">
              New Buddy?{" "}
              <Link
                to="/buddy/register"
                className="text-[#6A2AFF] font-semibold hover:underline"
              >
                Register
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default BuddyLogin;