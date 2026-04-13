import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBuddyStatus } from "../../services/buddyAuthService";
import BuddyNav from "./BuddyNav";
import UnregisteredBanner from "./UnregisteredBanner";
import PendingBanner from "./PendingBanner";
import VerifiedDashboard from "./VerifiedDashboard";

export default function BuddyDashboard() {
  const navigate = useNavigate();
  const [buddy, setBuddy] = useState(null);
  const [loading, setLoading] = useState(true);
  const unreadCount = buddy?.isVerified ? 2 : 0;

  // ✅ Token check: verify with backend on every load/reload
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getBuddyStatus();
        if (res?.buddy) {
          setBuddy(res.buddy);
          localStorage.setItem("buddyData", JSON.stringify(res.buddy));
        } else {
          // No valid token → redirect to login
          localStorage.removeItem("buddyData");
          navigate("/buddy/login");
        }
      } catch (err) {
        // Token deleted/expired/invalid → redirect to login
        localStorage.removeItem("buddyData");
        navigate("/buddy/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const detectState = (b) => {
    if (!b) return "unregistered";
    if (b.isVerified) return "welcome";
    if (b.registrationCompleted) return "pending";
    return "unregistered";
  };

  const handleLogout = async () => {
    try {
      const { logoutBuddyApi } = await import("../../services/buddyAuthService");
      await logoutBuddyApi();
    } catch (e) {}
    localStorage.removeItem("buddyData");
    navigate("/buddy/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#6A2AFF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const state = detectState(buddy);

  return (
    <div className="min-h-screen bg-[#f7f8fc] font-[Poppins,sans-serif] flex flex-col">
      <BuddyNav buddy={buddy} status={state} unreadCount={unreadCount} />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-col gap-6 py-6">
          {state === "unregistered" && <UnregisteredBanner />}
          {state === "pending" && <PendingBanner />}
        </div>

        {state === "welcome" && (
          <VerifiedDashboard buddy={buddy} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}
