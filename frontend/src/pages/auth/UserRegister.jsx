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

    const res = await registerUser(formData);

    if (res?.message === "User registered successfully") {
     setShowPopup(true);
    } else if (res?.message) {
      alert(res.message);
    } else {
      alert("Something went wrong");
    }
  };

  const inputStyle =
    "w-full p-3 mt-1 rounded-lg bg-gray-50 text-sm " +
    "border border-gray-300 " +
    "focus:outline-none focus:border-[#6A2AFF] " +
    "hover:border-[#8755F9] transition-all duration-200";

  return  (
    <>
{showPopup && (
  <SuccessPopup
  onClose={() => {
    setShowPopup(false);
    navigate("/dashboard");
  }}
/>

)}
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-6xl flex bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* LEFT IMAGE */}
        <div className="w-1/2 hidden md:flex flex-col items-center justify-center bg-gray-50 p-6">
          <img
            src={buddyImage}
            alt="Buddy"
            className="max-h-[60vh] rounded-xl object-contain"
          />
          <p className="mt-4 text-sm text-gray-500 text-center">
            A trusted buddy to take care of your parents when you can’t.
          </p>
        </div>

        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-black mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="fullName"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <input
                  name="mobile"
                  onChange={handleChange}
                  className={inputStyle}
                  />
              </div>

              <div>
                <label className="text-sm text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700">
                  Father Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="fatherName"
                  onChange={handleChange}
                  className={inputStyle}
                  />
              </div>

              <div>
                <label className="text-sm text-gray-700">
                  Father Mobile
                </label>
                <input
                  name="fatherMobile"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-700">
                  Mother Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="motherName"
                  onChange={handleChange}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="text-sm text-gray-700">
                  Mother Mobile
                </label>
                <input
                  name="motherMobile"
                  onChange={handleChange}
                  className={inputStyle}
                  />
              </div>
            </div>

            <button
              type="submit"
              className="
                w-full mt-6 py-3 rounded-lg text-white font-semibold
                bg-[#6A2AFF]
                hover:bg-[#8755F9]
                hover:shadow-lg
                hover:scale-[1.02]
                transition-all duration-200
                cursor-pointer
                "
            >
              Register
            </button>

          </form>
        </div>
      </div>
    </div>
                </>
  );
};

export default UserRegister;
