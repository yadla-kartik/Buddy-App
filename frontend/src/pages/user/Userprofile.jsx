import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, Home, AlertTriangle,
  Camera, Lock, LogOut, Edit3, Save, X
} from "lucide-react";
import { changePassword, updateProfile, logoutUser } from "../../services/authService";

const Profile = () => {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    city: user?.city || "",
    state: user?.state || "",
    address: user?.address || "",
    emergencyContact: user?.emergencyContact || "",
    alternateContact: user?.alternateContact || "",
  });

  React.useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        mobile: user.mobile || prev.mobile,
        city: user.city || prev.city,
        state: user.state || prev.state,
        address: user.address || prev.address,
        emergencyContact: user.emergencyContact || prev.emergencyContact,
        alternateContact: user.alternateContact || prev.alternateContact,
      }));
    }
  }, [user]);

  const [passwords, setPasswords] = useState({
    current: "", newPass: "", confirm: "",
  });

  // ── Validation ──────────────────────────────────────────
  const validateForm = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    else if (form.fullName.trim().length < 3) e.fullName = "Name must be at least 3 characters.";
    else if (!/^[A-Za-z ]+$/.test(form.fullName.trim())) e.fullName = "Name can contain alphabets only.";

    if (!form.mobile.trim()) e.mobile = "Mobile number is required.";
    else if (!/^\d{10}$/.test(form.mobile.trim())) e.mobile = "Enter a valid 10-digit number.";

    if (!form.city.trim()) e.city = "City is required.";
    else if (!/^[A-Za-z ]+$/.test(form.city.trim())) e.city = "City can contain alphabets only.";

    if (form.state && !/^[A-Za-z ]+$/.test(form.state.trim()))
      e.state = "State can contain alphabets only.";

    if (!form.address.trim()) e.address = "Address is required.";
    else if (form.address.trim().length < 5) e.address = "Address must be at least 5 characters.";

    if (!form.emergencyContact.trim()) e.emergencyContact = "Emergency contact is required.";
    else if (!/^\d{10}$/.test(form.emergencyContact.trim())) e.emergencyContact = "Enter a valid 10-digit number.";

    if (form.alternateContact && !/^\d{10}$/.test(form.alternateContact.trim())) {
      e.alternateContact = "Enter a valid 10-digit number.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePasswords = () => {
    const e = {};
    if (!passwords.current.trim()) e.current = "Current password is required.";
    if (!passwords.newPass.trim()) e.newPass = "New password is required.";
    else if (passwords.newPass.length < 8) e.newPass = "Password must be at least 8 characters.";
    if (!passwords.confirm.trim()) e.confirm = "Please confirm your password.";
    else if (passwords.newPass !== passwords.confirm) e.confirm = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const res = await updateProfile(form);
    if (res?.message === "Profile updated successfully") {
      alert("Profile updated successfully!");
      setEditing(false);
      // Ideally update context or local storage user here if needed
    } else {
      alert(res?.message || "Failed to update profile");
    }
  };

  const handlePasswordSave = async () => {
    if (!validatePasswords()) return;

    // Call the backend service
    const res = await changePassword({
      currentPassword: passwords.current,
      newPassword: passwords.newPass,
    });

    if (res?.message === "Password updated successfully") {
      alert("Password completed updated! \n" + res.message);
      setChangingPassword(false);
      setPasswords({ current: "", newPass: "", confirm: "" });
      setErrors({});
    } else {
      alert(res?.message || "Failed to update password");
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    localStorage.clear();
    navigate("/login");
  };

  const inputCls = (name) =>
    `w-full px-4 py-3 rounded-xl bg-gray-50 border text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${errors[name]
      ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-[#6A2AFF] focus:ring-2 focus:ring-[#6A2AFF]/10 hover:border-[#8755F9]"
    }`;

  const labelCls = "block text-xs font-bold text-[#6A2AFF] uppercase tracking-wide mb-1";
  const errorCls = "text-xs text-red-500 font-medium mt-1";

  const fields = [
    { label: "Full Name", name: "fullName", icon: <User size={15} />, placeholder: "Your full name", type: "text" },
    { label: "Email", name: "email", icon: <Mail size={15} />, placeholder: "your@email.com", type: "email", disabled: true },
    { label: "Mobile", name: "mobile", icon: <Phone size={15} />, placeholder: "10-digit number", type: "tel" },
    { label: "City", name: "city", icon: <MapPin size={15} />, placeholder: "e.g. Mumbai", type: "text" },
    { label: "State", name: "state", icon: <MapPin size={15} />, placeholder: "e.g. Maharashtra", type: "text" },
    { label: "Address", name: "address", icon: <Home size={15} />, placeholder: "Your full address", type: "text" },
    { label: "Emergency Contact", name: "emergencyContact", icon: <AlertTriangle size={15} />, placeholder: "Emergency phone number", type: "tel" },
    { label: "Alternate Number", name: "alternateContact", icon: <Phone size={15} />, placeholder: "Alternate phone number", type: "tel" },
  ];

  return (
    <div className="max-w-2xl mx-auto">

      {/* Avatar Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-4 flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6A2AFF] to-[#D116A8] flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {form.fullName?.charAt(0).toUpperCase() || "U"}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all">
            <Camera size={13} className="text-gray-500" />
          </button>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{form.fullName || "User"}</h2>
          <p className="text-sm text-gray-400">{form.email}</p>
          {form.city && (
            <span className="inline-flex items-center gap-1 mt-1 text-xs text-[#6A2AFF] bg-purple-50 px-2.5 py-0.5 rounded-full font-medium">
              <MapPin size={11} /> {form.city}{form.state ? `, ${form.state}` : ""}
            </span>
          )}
        </div>
        <button
          onClick={() => { setEditing(!editing); setErrors({}); }}
          className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${editing
              ? "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
              : "bg-purple-50 text-[#6A2AFF] hover:bg-purple-100 border border-purple-200"
            }`}
        >
          {editing ? <><Save size={13} />Save</> : <><Edit3 size={13} /> Edit Profile</>}
        </button>
      </div>

      {/* Profile Fields */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-4">
        <h3 className="text-sm font-bold text-[#6A2AFF] uppercase tracking-wide mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.name} className={field.name === "address" ? "md:col-span-2" : ""}>
              <label className={labelCls}>
                <span className="inline-flex items-center gap-1.5">
                  {field.icon} {field.label}
                </span>
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                disabled={!editing || field.disabled}
                className={inputCls(field.name)}
              />
              {field.disabled && editing && (
                <p className="text-[11px] text-gray-400 mt-1">Email cannot be changed</p>
              )}
              {errors[field.name] && <p className={errorCls}>{errors[field.name]}</p>}
            </div>
          ))}
        </div>

        {editing && (
          <button
            onClick={handleSave}
            className="mt-5 w-full py-3 rounded-xl text-white text-sm font-semibold hover:scale-[1.02] active:scale-95 transition-all shadow-md hover:shadow-lg"
            style={{ background: "linear-gradient(90deg, #6A2AFF, #D116A8)" }}
          >
            <span className="flex items-center justify-center gap-2">
              <Save size={15} /> Save Changes
            </span>
          </button>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <Lock size={14} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Change Password</h3>
              <p className="text-xs text-gray-400">Update your account password</p>
            </div>
          </div>
          <button
            onClick={() => { setChangingPassword(!changingPassword); setErrors({}); }}
            className="text-xs font-semibold text-[#6A2AFF] bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl transition-all"
          >
            {changingPassword ? "Cancel" : "Change"}
          </button>
        </div>

        {changingPassword && (
          <div className="mt-4 space-y-3">
            {[
              { label: "Current Password", name: "current", placeholder: "Enter current password" },
              { label: "New Password", name: "newPass", placeholder: "Min. 8 characters" },
              { label: "Confirm New Password", name: "confirm", placeholder: "Re-enter new password" },
            ].map((f) => (
              <div key={f.name}>
                <label className={labelCls}>{f.label}</label>
                <input
                  type="password"
                  name={f.name}
                  value={passwords[f.name]}
                  onChange={handlePasswordChange}
                  placeholder={f.placeholder}
                  className={inputCls(f.name)}
                />
                {errors[f.name] && <p className={errorCls}>{errors[f.name]}</p>}
              </div>
            ))}
            <button
              onClick={handlePasswordSave}
              className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95"
              style={{ background: "linear-gradient(90deg, #6A2AFF, #D116A8)" }}
            >
              Update Password
            </button>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 mb-8">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-red-500 font-semibold text-sm bg-red-50 hover:bg-red-100 transition-all"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

    </div>
  );
};

export default Profile;