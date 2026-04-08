import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import SuccessPopup from "../../components/common/SuccessPopup";
import buddyImage from "../../assets/buddyParent.png";

const BuddySignup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mobile validation
    if (name === "mobile") {
      if (!/^\d*$/.test(value) || value.length > 10) return;

      setFormData({ ...formData, [name]: value });
      setErrors({
        ...errors,
        mobile:
          value.length > 0 && value.length < 10
            ? "Mobile number must be 10 digits"
            : "",
      });
      return;
    }

    setFormData({ ...formData, [name]: value });

    // Email validation
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors({
        ...errors,
        email:
          value && !emailRegex.test(value)
            ? "Please enter a valid email"
            : "",
      });
    }

    // Password match check
    if (name === "confirmPassword") {
      setErrors({
        ...errors,
        confirmPassword:
          value !== formData.password ? "Passwords do not match" : "",
      });
    }

    if (name === "password") {
      setErrors({
        ...errors,
        confirmPassword:
          formData.confirmPassword &&
          value !== formData.confirmPassword
            ? "Passwords do not match"
            : "",
      });
    }
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    if (formData.mobile.length !== 10) {
      setErrors({ mobile: "Mobile number must be 10 digits" });
      return;
    }

    console.log("User Registered:", formData);

    setShowSuccessPopup(true);
    setTimeout(() => navigate("/login"), 2000);
  };

  // Styles (same as original)
  const inputCls = (name) =>
    `w-full px-4 py-3 rounded-xl bg-gray-50 border text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 ${
      errors[name]
        ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-gray-200 focus:border-[#6A2AFF] focus:ring-2 focus:ring-[#6A2AFF]/10 hover:border-[#8755F9]"
    }`;

  const labelCls =
    "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1";

  const errorCls = "text-xs text-red-500 font-medium mt-1";

  const sectionCls =
    "text-xs font-bold text-[#6A2AFF] uppercase tracking-widest pb-2 border-b border-gray-100 mb-4";

  return (
    <>
      {showSuccessPopup && (
        <SuccessPopup onClose={() => setShowSuccessPopup(false)} />
      )}

      <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_60px_rgba(106,42,255,0.10)] overflow-hidden flex">

          {/* LEFT IMAGE SAME */}
          <div className="hidden md:flex w-2/5 flex-col items-center justify-center bg-gradient-to-br from-[#D116A8]/5 to-[#6A2AFF]/5 p-10 gap-5">
            <img
              src={buddyImage}
              alt="Buddy"
              className="max-h-[55vh] object-contain"
            />
            <div className="text-center">
              <p className="text-base font-semibold text-gray-700">
                Get help easily.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Connect with trusted buddies near you.
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
                User Registration
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Create your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* BASIC INFO */}
              <div>

                <div className="space-y-3">

                  {/* Name + Email */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Full Name *</label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className={inputCls("name")}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelCls}>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@email.com"
                        className={inputCls("email")}
                        required
                      />
                      {errors.email && (
                        <p className={errorCls}>{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className={labelCls}>Mobile *</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="10-digit number"
                      className={inputCls("mobile")}
                      required
                    />
                    {errors.mobile && (
                      <p className={errorCls}>{errors.mobile}</p>
                    )}
                  </div>

                  {/* Passwords */}
                  <div className="grid grid-cols-2 gap-3">

                    <div>
                      <label className={labelCls}>Password *</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={inputCls("password")}
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

                    <div>
                      <label className={labelCls}>Confirm Password *</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={inputCls("confirmPassword")}
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-3 text-gray-400"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className={errorCls}>
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                  </div>

                </div>
              </div>

              {/* TERMS */}
              <div className="flex items-start gap-2">
                <input type="checkbox" required className="mt-1" />
                <p className="text-xs text-gray-500">
                  I agree to Terms & Conditions
                </p>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl text-white font-semibold"
                style={{
                  background:
                    "linear-gradient(90deg, #6A2AFF, #D116A8)",
                }}
              >
                Register
              </button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/buddy/login" className="text-[#6A2AFF] font-semibold">
                  Login
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuddySignup;
