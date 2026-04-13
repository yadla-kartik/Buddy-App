import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { createPayment } from "../services/paymentService";
import { useNavigate } from "react-router-dom";

const PAYMENT_MODES = ["UPI", "Card", "NetBanking", "Cash"];

const Payment = () => {
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState("UPI");

  const loadPayment = async () => {
    const taskId = localStorage.getItem("latestTaskId");
    if (!taskId) {
      setError("No latest task found. Please create a task first.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await createPayment(taskId);
      setPayment(res);
      setError(null);
    } catch (err) {
      setError("Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayment();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadPayment}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!payment) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          Payment
        </h2>

        <div className="bg-gray-50 rounded-xl p-4 border">
          <h3 className="font-semibold text-gray-800 mb-3">Task Summary</h3>
          <div className="space-y-1 text-sm text-gray-700">
            <p><span className="font-medium">Task:</span> {payment.taskSummary?.taskDescription}</p>
            <p><span className="font-medium">Task Type:</span> {payment.taskSummary?.taskType}</p>
            <p><span className="font-medium">Parent:</span> {payment.taskSummary?.parentName}</p>
            <p><span className="font-medium">Location:</span> {payment.taskSummary?.parentCurrentLocation}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Pay with</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PAYMENT_MODES.map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`py-2 rounded-lg text-sm font-semibold border transition ${
                  selectedMode === mode
                    ? "border-[#6A2AFF] bg-purple-50 text-[#6A2AFF]"
                    : "border-gray-200 text-gray-600 hover:border-purple-300"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {selectedMode === "UPI" ? (
          <div className="flex flex-col items-center bg-gray-50 p-5 rounded-xl border">
            <QRCode value={payment.upiString} size={190} />
            <p className="mt-3 text-sm text-gray-500">Scan & pay via UPI</p>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-xl border text-sm text-gray-600">
            {selectedMode} payment UI will be integrated here.
          </div>
        )}

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Task Amount</span>
            <span className="text-gray-800">Rs {payment.amount}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
            <span>Total Amount</span>
            <span className="text-purple-600">Rs {payment.amount}</span>
          </div>
        </div>

        <div className="p-3 bg-purple-50 rounded-lg">
          <p className="text-xs text-gray-500">Transaction ID</p>
          <p className="text-sm font-mono text-purple-700">{payment.txnId}</p>
        </div>

        <button
          onClick={() => {
            alert("Payment Successful (Mock)");
            navigate("/dashboard");
          }}
          className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-[#6A2AFF] to-[#D116A8] hover:scale-[1.02] transition shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Payment;
