import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { buddyLogin } from "../../services/buddyAuthService";
import buddyImage from "../../assets/buddyPartner.png";

const BuddyLogin = () => {
  const navigate = useNavigate();

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
        console.log("✅ Login Success:", result.buddy);
        
        // Store buddy data in localStorage
        localStorage.setItem("buddyData", JSON.stringify(result.buddy));
        
        // Navigate to dashboard
        navigate("/buddy/dashboard");
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6 font-primary">
      <div className="w-full max-w-5xl flex bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* LEFT IMAGE */}
        <div className="w-1/2 hidden md:flex flex-col items-center justify-center bg-gray-50 p-6">
          <img
            src={buddyImage}
            alt="Buddy"
            className="max-h-[60vh] object-contain transition-transform duration-300 hover:scale-105"
          />
          <p className="mt-4 text-sm text-gray-500">
            Your trusted buddy, always there.
          </p>
        </div>

        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white rounded-xl p-8"
          >
            <div className="text-center mb-6">
              <p className="text-2xl text-black font-medium">
                Welcome to My Buddy
              </p>
              <h2 className="text-xl font-semibold mt-1 text-[#6A2AFF]">
                Login
              </h2>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mb-4 p-3 rounded-lg bg-gray-50
                border border-transparent focus:border-[#6A2AFF]
                hover:border-[#6a2aff6c] transition"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mb-2 p-3 rounded-lg bg-gray-50
                border border-transparent focus:border-[#6A2AFF]
                hover:border-[#6a2aff6c] transition"
            />

            <div className="text-right mb-5 text-sm text-[#D116A8] cursor-pointer hover:underline">
              Forgot Password?
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold
                hover:scale-[1.03] active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(90deg, #6A2AFF, #D116A8)",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="mt-5 text-center text-sm text-gray-600">
              New user?{" "}
              <Link to="/buddy/register" className="text-[#6A2AFF] hover:underline">
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