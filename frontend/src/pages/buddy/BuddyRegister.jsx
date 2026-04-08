import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Upload, User, FileText, CreditCard, ArrowLeft, ArrowRight } from "lucide-react";
import { registerBuddy } from "../../services/buddyAuthService";

const STEPS = [
  { number: 1, label: "Basic Info",   icon: <User size={14} />       },
  { number: 2, label: "Documents",    icon: <FileText size={14} />   },
  { number: 3, label: "Bank Details", icon: <CreditCard size={14} /> },
];

const BuddyRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "", email: "", mobile: "", password: "", confirmPassword: "",
    city: "", dob: "", permanentAddress: "",
    panNumber: "", aadhaarNumber: "",
    bankName: "", accountHolderName: "", accountNumber: "", ifscCode: "",
  });

  const [files, setFiles] = useState({
    panImage: null, aadhaarImage: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      if (!/^\d*$/.test(value) || value.length > 10) return;
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, mobile: value.length > 0 && value.length < 10 ? "Mobile number must be 10 digits" : "" });
      return;
    }

    if (name === "panNumber") {
      const upperValue = value.toUpperCase();
      if (upperValue.length > 10) return;
      setFormData({ ...formData, [name]: upperValue });
      setErrors({ ...errors, panNumber: upperValue.length > 0 && upperValue.length < 10 ? "PAN must be 10 characters" : "" });
      return;
    }

    if (name === "aadhaarNumber") {
      if (!/^\d*$/.test(value) || value.length > 12) return;
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, aadhaarNumber: value.length > 0 && value.length < 12 ? "Aadhaar must be 12 digits" : "" });
      return;
    }

    if (name === "accountNumber") {
      if (!/^\d*$/.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors({ ...errors, email: value && !emailRegex.test(value) ? "Please enter a valid email" : "" });
    }

    if (name === "confirmPassword") {
      setErrors({ ...errors, confirmPassword: value !== formData.password ? "Passwords do not match" : "" });
    }

    if (name === "password") {
      setErrors({ ...errors, confirmPassword: formData.confirmPassword && value !== formData.confirmPassword ? "Passwords do not match" : "" });
    }

    if (name === "dob") {
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
      setErrors({ ...errors, dob: age < 18 ? "You must be at least 18 years old" : "" });
    }
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!formData.name.trim())                                          e.name            = "Full name is required";
      if (!formData.email.trim())                                         e.email           = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))       e.email           = "Enter a valid email";
      if (!formData.mobile.trim() || formData.mobile.length !== 10)       e.mobile          = "Enter a valid 10-digit number";
      if (!formData.city.trim())                                          e.city            = "City is required";
      if (!formData.password.trim() || formData.password.length < 8)     e.password        = "Min. 8 characters required";
      if (formData.password !== formData.confirmPassword)                 e.confirmPassword = "Passwords do not match";
      if (!formData.dob)                                                  e.dob             = "Date of birth is required";
      if (!formData.permanentAddress.trim())                              e.permanentAddress= "Address is required";
    }
    if (s === 2) {
      if (formData.panNumber.length !== 10)     e.panNumber     = "PAN must be exactly 10 characters";
      if (formData.aadhaarNumber.length !== 12) e.aadhaarNumber = "Aadhaar must be exactly 12 digits";
      if (!files.panImage)                      e.panImage      = "PAN card image is required";
      if (!files.aadhaarImage)                  e.aadhaarImage  = "Aadhaar card image is required";
    }
    if (s === 3) {
      if (!formData.bankName.trim())            e.bankName          = "Bank name is required";
      if (!formData.accountHolderName.trim())   e.accountHolderName = "Account holder name is required";
      if (!formData.accountNumber.trim())       e.accountNumber     = "Account number is required";
      if (!formData.ifscCode.trim())            e.ifscCode          = "IFSC code is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    data.append("panImage", files.panImage);
    data.append("aadhaarImage", files.aadhaarImage);

    const res = await registerBuddy(data);
    setIsSubmitting(false);

    if (res?.message === "Buddy registered successfully") {
      // Save to localStorage → dashboard reads this and shows PendingView
      localStorage.setItem("buddyData", JSON.stringify({
        name: formData.name,
        email: formData.email,
        isVerified: false,
      }));
      navigate("/buddy/dashboard");
    } else {
      alert(res?.message || "Registration failed");
    }
  };

  const inputCls = (name) =>
    `w-full px-4 py-3 rounded-xl bg-gray-50 border text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 ${
      errors[name]
        ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-gray-200 focus:border-[#6A2AFF] focus:ring-2 focus:ring-[#6A2AFF]/10 hover:border-[#8755F9]"
    }`;

  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1";
  const errorCls = "text-xs text-red-500 font-medium mt-1";

  const FileUpload = ({ name, label, required }) => (
    <div>
      <label className={labelCls}>{label} {required && <span className="text-red-400">*</span>}</label>
      <input type="file" name={name} onChange={handleFileChange} className="hidden" id={name} accept="image/*,.pdf" />
      <label
        htmlFor={name}
        className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gray-50 border cursor-pointer transition-all text-sm text-gray-500 ${
          errors[name] ? "border-red-400" : "border-gray-200 hover:border-[#8755F9] hover:bg-purple-50"
        }`}
      >
        <Upload size={15} className="text-gray-400" />
        <span className="truncate">{files[name] ? files[name].name : `Choose ${label}`}</span>
      </label>
      {errors[name] && <p className={errorCls}>{errors[name]}</p>}
    </div>
  );

  return (
    <>

      <div
        className="min-h-screen bg-white flex items-center justify-center p-4 text-slate-900"
        style={{ backgroundImage: "linear-gradient(to bottom, rgba(106,42,255,0.08), rgba(106,42,255,0.02) 20%, transparent 40%)" }}
      >
        <div className="w-full max-w-2xl">

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : navigate("/buddy/login")}
              className="p-2 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:text-[#6A2AFF] transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Register as Buddy</h1>
              <p className="text-sm text-gray-400">Join us in caring for elderly parents</p>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center gap-1 mb-6">
            {STEPS.map((s, i) => {
              const isActive = step === s.number;
              const isDone   = step > s.number;
              return (
                <div key={s.number} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold border-2 transition-all ${
                      isDone || isActive
                        ? "bg-gradient-to-br from-[#6A2AFF] to-[#D116A8] border-transparent text-white shadow-md"
                        : "border-gray-200 text-gray-400 bg-white"
                    }`}>
                      {isDone ? "✓" : s.number}
                    </div>
                    <span className={`text-[11px] whitespace-nowrap font-semibold ${isActive ? "text-[#6A2AFF]" : "text-gray-400"}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 mb-4 rounded-full transition-all ${step > s.number ? "bg-gradient-to-r from-[#6A2AFF] to-[#D116A8]" : "bg-gray-200"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(106,42,255,0.08)] border border-gray-100 p-6 md:p-8 space-y-5">

            {/* ── STEP 1: Basic Info ── */}
            {step === 1 && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                    <User size={14} className="text-[#6A2AFF]" />
                  </div>
                  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Basic Information</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Full Name <span className="text-red-400">*</span></label>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" className={inputCls("name")} />
                    {errors.name && <p className={errorCls}>{errors.name}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Email <span className="text-red-400">*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@email.com" className={inputCls("email")} />
                    {errors.email && <p className={errorCls}>{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Mobile <span className="text-red-400">*</span></label>
                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="10-digit number" className={inputCls("mobile")} />
                    {errors.mobile && <p className={errorCls}>{errors.mobile}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>City <span className="text-red-400">*</span></label>
                    <input name="city" value={formData.city} onChange={handleChange} placeholder="e.g. Mumbai, Delhi" className={inputCls("city")} />
                    {errors.city && <p className={errorCls}>{errors.city}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Password <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Min. 8 characters" className={inputCls("password")} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className={errorCls}>{errors.password}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Confirm Password <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password" className={inputCls("confirmPassword")} />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className={errorCls}>{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Date of Birth <span className="text-red-400">*</span></label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inputCls("dob")} />
                  {errors.dob && <p className={errorCls}>{errors.dob}</p>}
                </div>

                <div>
                  <label className={labelCls}>Permanent Address <span className="text-red-400">*</span></label>
                  <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} placeholder="Your full address" rows="2" className={`${inputCls("permanentAddress")} resize-none`} />
                  {errors.permanentAddress && <p className={errorCls}>{errors.permanentAddress}</p>}
                </div>
              </>
            )}

            {/* ── STEP 2: Documents ── */}
            {step === 2 && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-pink-50 flex items-center justify-center">
                    <FileText size={14} className="text-[#D116A8]" />
                  </div>
                  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Document Details</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>PAN Number <span className="text-red-400">*</span></label>
                    <input name="panNumber" value={formData.panNumber} onChange={handleChange} placeholder="10-character PAN" className={inputCls("panNumber")} />
                    {errors.panNumber && <p className={errorCls}>{errors.panNumber}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Aadhaar Number <span className="text-red-400">*</span></label>
                    <input name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} placeholder="12-digit Aadhaar" className={inputCls("aadhaarNumber")} />
                    {errors.aadhaarNumber && <p className={errorCls}>{errors.aadhaarNumber}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FileUpload name="panImage" label="PAN Card Image" required />
                  <FileUpload name="aadhaarImage" label="Aadhaar Card Image" required />
                </div>
              </>
            )}

            {/* ── STEP 3: Bank Details ── */}
            {step === 3 && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                    <CreditCard size={14} className="text-blue-600" />
                  </div>
                  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Bank Account Details</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Bank Name <span className="text-red-400">*</span></label>
                    <input name="bankName" value={formData.bankName} onChange={handleChange} placeholder="e.g. SBI, HDFC" className={inputCls("bankName")} />
                    {errors.bankName && <p className={errorCls}>{errors.bankName}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>Account Holder Name <span className="text-red-400">*</span></label>
                    <input name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} placeholder="As per bank records" className={inputCls("accountHolderName")} />
                    {errors.accountHolderName && <p className={errorCls}>{errors.accountHolderName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Account Number <span className="text-red-400">*</span></label>
                    <input name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="Account number" className={inputCls("accountNumber")} />
                    {errors.accountNumber && <p className={errorCls}>{errors.accountNumber}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>IFSC Code <span className="text-red-400">*</span></label>
                    <input name="ifscCode" value={formData.ifscCode} onChange={handleChange} placeholder="e.g. SBIN0001234" className={inputCls("ifscCode")} />
                    {errors.ifscCode && <p className={errorCls}>{errors.ifscCode}</p>}
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2 pt-1">
                  <input type="checkbox" id="terms" required className="mt-0.5 accent-[#6A2AFF] w-4 h-4 cursor-pointer" />
                  <label htmlFor="terms" className="text-xs text-gray-500 cursor-pointer">
                    I agree to the <span className="text-[#6A2AFF] hover:underline">Terms & Conditions</span> and <span className="text-[#6A2AFF] hover:underline">Privacy Policy</span>
                  </label>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  <ArrowLeft size={15} /> Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                  style={{ background: "linear-gradient(90deg, #6A2AFF, #D116A8)" }}
                >
                  Continue <ArrowRight size={15} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-[2] py-3 rounded-xl text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ background: "linear-gradient(90deg, #6A2AFF, #D116A8)" }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Registering...
                    </span>
                  ) : "Register as Buddy"}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default BuddyRegister;