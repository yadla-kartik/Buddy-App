import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Upload } from "lucide-react";
import { registerBuddy } from "../../services/buddyAuthService";
import SuccessPopup from "../../components/common/SuccessPopup"; 

const BuddyRegister = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); // ✅ Add this line
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    dob: "",
    permanentAddress: "",
    panNumber: "",
    aadhaarNumber: "",
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
  });

  const [files, setFiles] = useState({
    panImage: null,
    aadhaarImage: null,
    profilePhoto: null,
  });

  const [errors, setErrors] = useState({
    email: "",
    mobile: "",
    panNumber: "",
    aadhaarNumber: "",
    dob: "",
  });

  // TEXT INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mobile validation (only numbers, max 10 digits)
    if (name === "mobile") {
      if (!/^\d*$/.test(value)) {
        return; // Don't update if not a number
      }
      if (value.length > 10) {
        return; // Don't update if more than 10 digits
      }
      setFormData({ ...formData, [name]: value });
      if (value.length > 0 && value.length < 10) {
        setErrors({ ...errors, mobile: "Mobile number must be 10 digits" });
      } else {
        setErrors({ ...errors, mobile: "" });
      }
      return;
    }

    // PAN validation (max 10 characters, uppercase)
    if (name === "panNumber") {
      const upperValue = value.toUpperCase();
      if (upperValue.length > 10) {
        return;
      }
      setFormData({ ...formData, [name]: upperValue });
      if (upperValue.length > 0 && upperValue.length < 10) {
        setErrors({ ...errors, panNumber: "PAN must be 10 characters" });
      } else {
        setErrors({ ...errors, panNumber: "" });
      }
      return;
    }

    // Aadhaar validation (only numbers, max 12 digits)
    if (name === "aadhaarNumber") {
      if (!/^\d*$/.test(value)) {
        return;
      }
      if (value.length > 12) {
        return;
      }
      setFormData({ ...formData, [name]: value });
      if (value.length > 0 && value.length < 12) {
        setErrors({ ...errors, aadhaarNumber: "Aadhaar must be 12 digits" });
      } else {
        setErrors({ ...errors, aadhaarNumber: "" });
      }
      return;
    }

    // Account Number validation (only numbers)
    if (name === "accountNumber") {
      if (!/^\d*$/.test(value)) {
        return;
      }
    }

    setFormData({ ...formData, [name]: value });

    // Email validation
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setErrors({ ...errors, email: "Please enter a valid email address" });
      } else {
        setErrors({ ...errors, email: "" });
      }
    }

    // DOB validation (18+ years)
    if (name === "dob") {
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        setErrors({ ...errors, dob: "You must be at least 18 years old" });
      } else {
        setErrors({ ...errors, dob: "" });
      }
    }
  };

  // FILE INPUT
  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Final validations
  if (formData.mobile.length !== 10) {
    setErrors({ ...errors, mobile: "Mobile number must be exactly 10 digits" });
    return;
  }

  if (formData.panNumber.length !== 10) {
    setErrors({ ...errors, panNumber: "PAN must be exactly 10 characters" });
    return;
  }

  if (formData.aadhaarNumber.length !== 12) {
    setErrors({ ...errors, aadhaarNumber: "Aadhaar must be exactly 12 digits" });
    return;
  }

  if (errors.email || errors.mobile || errors.panNumber || errors.aadhaarNumber || errors.dob) {
    alert("Please fix all errors before submitting");
    return;
  }

  setIsSubmitting(true); // ✅ Start loading

  const data = new FormData();
  Object.keys(formData).forEach((key) => {
    data.append(key, formData[key]);
  });

  data.append("panImage", files.panImage);
  data.append("aadhaarImage", files.aadhaarImage);
  data.append("profilePhoto", files.profilePhoto);

  const res = await registerBuddy(data);

  setIsSubmitting(false); // ✅ Stop loading

  if (res?.message === "Buddy registered successfully") {
    setShowSuccessPopup(true); // ✅ Show popup
    
    // ✅ Auto redirect after 2.5s (popup will handle it)
    setTimeout(() => {
      navigate("/buddy/dashboard");
    }, 2500);
  } else {
    alert(res?.message || "Registration failed");
  }
};

  const input =
    "w-full p-3 rounded-lg bg-gray-50 border border-gray-300 " +
    "focus:outline-none focus:border-[#6A2AFF] transition";

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#6A2AFF] mb-3">My Buddy</h1>
          <p className="text-lg text-gray-600 italic mb-4">
            "Join us in making a difference, one care at a time"
          </p>
          <h2 className="text-2xl font-semibold text-gray-800">
            Register as a Buddy Partner
          </h2>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* BASIC INFORMATION */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Basic Information
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input 
                  name="name" 
                  onChange={handleChange}
                  value={formData.name}
                  className={input} 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  name="email" 
                  onChange={handleChange}
                  value={formData.email}
                  className={input} 
                  required 
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel" 
                  name="mobile" 
                  placeholder="10-digit mobile number"
                  value={formData.mobile}
                  onChange={handleChange} 
                  className={input} 
                  required 
                />
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                    className={input}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  name="dob" 
                  onChange={handleChange}
                  value={formData.dob}
                  className={input} 
                  required 
                />
                {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permanent Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="permanentAddress"
                  onChange={handleChange}
                  value={formData.permanentAddress}
                  className={input}
                  rows="3"
                  required
                />
              </div>
            </div>

            {/* DOCUMENT DETAILS */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Document Details
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PAN Number <span className="text-red-500">*</span>
                </label>
                <input 
                  name="panNumber" 
                  placeholder="10-character PAN"
                  value={formData.panNumber}
                  onChange={handleChange} 
                  className={input} 
                  required 
                />
                {errors.panNumber && <p className="text-red-500 text-xs mt-1">{errors.panNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload PAN Card <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="file" 
                    name="panImage" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    id="panImage"
                    accept="image/*"
                    required 
                  />
                  <label 
                    htmlFor="panImage"
                    className="flex items-center justify-center gap-2 w-full p-3 rounded-lg bg-gray-50 border border-gray-300 cursor-pointer hover:bg-gray-100 transition"
                  >
                    <Upload size={18} className="text-gray-600" />
                    <span className="text-sm text-gray-600">
                      {files.panImage ? files.panImage.name : "Choose PAN Card Image"}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhaar Number <span className="text-red-500">*</span>
                </label>
                <input 
                  name="aadhaarNumber" 
                  placeholder="12-digit Aadhaar"
                  value={formData.aadhaarNumber}
                  onChange={handleChange} 
                  className={input} 
                  required 
                />
                {errors.aadhaarNumber && <p className="text-red-500 text-xs mt-1">{errors.aadhaarNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Aadhaar Card <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="file" 
                    name="aadhaarImage" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    id="aadhaarImage"
                    accept="image/*"
                    required 
                  />
                  <label 
                    htmlFor="aadhaarImage"
                    className="flex items-center justify-center gap-2 w-full p-3 rounded-lg bg-gray-50 border border-gray-300 cursor-pointer hover:bg-gray-100 transition"
                  >
                    <Upload size={18} className="text-gray-600" />
                    <span className="text-sm text-gray-600">
                      {files.aadhaarImage ? files.aadhaarImage.name : "Choose Aadhaar Card Image"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* BANK DETAILS */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Bank Account Details
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input 
                  name="bankName" 
                  onChange={handleChange}
                  value={formData.bankName}
                  className={input} 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name <span className="text-red-500">*</span>
                </label>
                <input 
                  name="accountHolderName" 
                  onChange={handleChange}
                  value={formData.accountHolderName}
                  className={input} 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input 
                  name="accountNumber"
                  onChange={handleChange}
                  value={formData.accountNumber}
                  className={input} 
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IFSC Code <span className="text-red-500">*</span>
                </label>
                <input 
                  name="ifscCode" 
                  placeholder="e.g., SBIN0001234"
                  onChange={handleChange}
                  value={formData.ifscCode}
                  className={input} 
                  required 
                />
              </div>
            </div>

            {/* PROFILE PHOTO */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Profile Photo
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Live / Recent Photo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="file" 
                    name="profilePhoto" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    id="profilePhoto"
                    accept="image/*"
                    required 
                  />
                  <label 
                    htmlFor="profilePhoto"
                    className="flex items-center justify-center gap-2 w-full p-3 rounded-lg bg-gray-50 border border-gray-300 cursor-pointer hover:bg-gray-100 transition"
                  >
                    <Upload size={18} className="text-gray-600" />
                    <span className="text-sm text-gray-600">
                      {files.profilePhoto ? files.profilePhoto.name : "Choose Profile Photo"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

       <button
  type="submit"
  disabled={isSubmitting}
  className="w-full py-3 rounded-lg text-white font-semibold bg-linear-to-r from-[#6A2AFF] to-[#D116A8] cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
>
  <span className="relative z-10">
    {isSubmitting ? "Registering..." : "Register as Buddy"}
  </span>
  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
</button>

            <p className="text-sm text-center text-gray-600">
              Already a Buddy?{" "}
              <Link to="/buddy/login" className="text-[#6A2AFF] font-medium hover:underline transition-all duration-200">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
        {showSuccessPopup && (
      <SuccessPopup onClose={() => setShowSuccessPopup(false)} />
    )}
    </div>
  );
};

export default BuddyRegister;