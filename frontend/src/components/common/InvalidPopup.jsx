const InvalidPopup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* POPUP */}
      <div className="relative bg-white rounded-xl w-[90%] max-w-sm p-6 shadow-xl">

        <h3 className="text-xl font-semibold text-red-600 mb-2">
          Invalid Credentials
        </h3>

        <p className="text-gray-600 text-sm mb-6">
          {message || "Please check your details and try again."}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-gray-600
            hover:bg-gray-100 transition cursor-pointer"
          >
            OK
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-white
            bg-[#6A2AFF] hover:bg-[#8755F9]
            transition cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvalidPopup;
