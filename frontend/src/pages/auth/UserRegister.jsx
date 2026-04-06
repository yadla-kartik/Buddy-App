import { useState } from "react";
import { registerUser } from "../../services/authService";
import buddyImage from "../../assets/buddyParent.png";
import { useNavigate } from "react-router-dom";
import SuccessPopup from "../../components/common/SuccessPopup";

const UserRegister = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    city: "",
    fatherName: "",
    fatherMobile: "",
    motherName: "",
    motherMobile: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const res = await registerUser(formData);
    if (res?.message === "User registered successfully") {
      setShowPopup(true);
    } else if (res?.message) {
      alert(res.message);
    } else {
      alert("Something went wrong");
    }
  };

  const inputCls =
    "w-full p-3 rounded-xl bg-gray-50 text-sm border border-gray-200 outline-none " +
    "focus:border-[#6A2AFF] focus:ring-2 focus:ring-[#6A2AFF]/10 " +
    "hover:border-[#8755F9] transition-all duration-200 text-gray-800 placeholder-gray-400";

  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1";

  return (
    <>
      {showPopup && (
        <SuccessPopup
          onClose={() => {
            setShowPopup(false);
            navigate("/dashboard");
          }}
        />
      )}

      <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center px-4">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_60px_rgba(106,42,255,0.10)] overflow-hidden flex min-h-[580px]">

          {/* LEFT — Image */}
          <div className="hidden md:flex w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#D116A8]/5 to-[#6A2AFF]/5 p-10 gap-5">
            <img
              src={buddyImage}
              alt="Buddy"
              className="max-h-[52vh] object-contain hover:scale-105 transition-transform duration-300"
            />
            <div className="text-center">
              <p className="text-base font-semibold text-gray-700">Care from anywhere.</p>
              <p className="text-sm text-gray-400 mt-1">A trusted buddy for your parents when you can't be there.</p>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
            <div className="mb-6">
              <p className="text-xs font-semibold text-[#6A2AFF] uppercase tracking-widest mb-1">My Buddy</p>
              <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
              <p className="text-sm text-gray-400 mt-1">Join thousands of families using My Buddy</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Full Name <span className="text-red-400">*</span></label>
                  <input name="fullName" onChange={handleChange} placeholder="Rahul Sharma" className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>Email <span className="text-red-400">*</span></label>
                  <input type="email" name="email" onChange={handleChange} placeholder="rahul@email.com" className={inputCls} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Mobile <span className="text-red-400">*</span></label>
                  <input name="mobile" onChange={handleChange} placeholder="9876543210" maxLength={10} className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>Your City <span className="text-red-400">*</span></label>
                  <input name="city" onChange={handleChange} placeholder="Mumbai, Delhi..." className={inputCls} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Password <span className="text-red-400">*</span></label>
                  <input type="password" name="password" onChange={handleChange} placeholder="Min. 8 characters" className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>Confirm Password <span className="text-red-400">*</span></label>
                  <input type="password" name="confirmPassword" onChange={handleChange} placeholder="Re-enter password" className={inputCls} required />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input type="checkbox" id="terms" required className="mt-0.5 accent-[#6A2AFF] w-4 h-4 cursor-pointer" />
                <label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer">
                  I agree to the{" "}
                  <span className="text-[#6A2AFF] hover:underline">Terms & Conditions</span>{" "}
                  and{" "}
                  <span className="text-[#6A2AFF] hover:underline">Privacy Policy</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
                style={{ background: "linear-gradient(90deg, #6A2AFF, #D116A8)" }}
              >
                Create Account
              </button>

              <p className="text-center text-sm text-gray-500 pt-1">
                Already have an account?{" "}
                <a href="/login" className="text-[#6A2AFF] font-semibold hover:underline">
                  Login
                </a>
              </p>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserRegister;