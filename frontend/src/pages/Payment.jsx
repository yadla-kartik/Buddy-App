import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { createPayment } from "../services/paymentService";

const Payment = () => {
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPayment = async () => {
    try {
      setLoading(true);
      const res = await createPayment();
      setPayment(res);
      setError(null);
    } catch (err) {
      console.error("Payment error:", err);
      setError("Payment initialization failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Component mount hote hi payment load karo
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
          <p className="text-red-500 mb-4">❌ {error}</p>
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
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          💳 Payment
        </h2>

        {/* QR Code */}
        <div className="flex flex-col items-center mb-6 bg-gray-50 p-6 rounded-xl">
          <QRCode value={payment.upiString} size={200} />
          <p className="mt-4 text-sm text-gray-500 text-center">
            Scan & pay using any UPI app
          </p>
        </div>

        {/* Amount Details */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Task Amount</span>
            <span className="text-gray-800">₹{payment.amount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Service Fee</span>
            <span className="text-gray-800">Included</span>
          </div>

          <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
            <span>Total Amount</span>
            <span className="text-purple-600">₹{payment.amount}</span>
          </div>
        </div>

        {/* Transaction ID */}
        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <p className="text-xs text-gray-500">Transaction ID</p>
          <p className="text-sm font-mono text-purple-700">{payment.txnId}</p>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => {
            alert("✅ Payment Successful (Mock)");
            window.location.href = "/dashboard";
          }}
          className="mt-6 w-full py-3 rounded-lg text-white font-semibold
          bg-gradient-to-r from-[#6A2AFF] to-[#D116A8]
          hover:scale-[1.02] transition shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Payment;