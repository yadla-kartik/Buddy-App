import { useEffect } from "react";

const SuccessPopup = ({ onClose }) => {

  // ⏳ AUTO REDIRECT AFTER 1.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); 
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKGROUND BLUR */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* POPUP BOX */}
      <div className="relative bg-white w-[90%] max-w-sm rounded-xl p-6 shadow-xl text-center">

        {/* CLOSE ICON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold text-green-600 mb-2">
          Successfully Registered 🎉
        </h3>

        <p className="text-gray-600 text-sm">
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  );
};

export default SuccessPopup;
