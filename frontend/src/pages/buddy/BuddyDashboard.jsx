import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBuddyStatus } from "../../services/buddyAuthService";
import { connectBuddySocket, disconnectBuddySocket } from "../../services/socketService";
import BuddyNav from "./BuddyNav";
import UnregisteredBanner from "./UnregisteredBanner";
import PendingBanner from "./PendingBanner";
import RejectedBanner from "./RejectedBanner";
import VerifiedDashboard from "./VerifiedDashboard";

export default function BuddyDashboard() {
  const navigate = useNavigate();
  const [buddy, setBuddy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveNotice, setLiveNotice] = useState("");
  const unreadCount = liveNotice ? 1 : 0;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getBuddyStatus();
        if (res?.buddy) {
          setBuddy(res.buddy);
          localStorage.setItem("buddyData", JSON.stringify(res.buddy));
        } else {
          localStorage.removeItem("buddyData");
          navigate("/buddy/login");
        }
      } catch {
        localStorage.removeItem("buddyData");
        navigate("/buddy/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!buddy?.id) return undefined;

    const socket = connectBuddySocket(buddy.id);

    const onVerificationUpdated = (payload) => {
      const updatedBuddy = payload?.buddy;
      if (!updatedBuddy) return;

      const updatedId = String(updatedBuddy.id || updatedBuddy._id || "");
      if (!updatedId || updatedId !== String(buddy.id)) return;

      setBuddy((prev) => {
        const next = {
          ...prev,
          ...updatedBuddy,
          id: updatedBuddy.id || updatedBuddy._id || prev?.id,
        };
        localStorage.setItem("buddyData", JSON.stringify(next));
        return next;
      });

      setLiveNotice(payload?.message || "Verification status updated");
    };

    socket.on("buddy:verification:updated", onVerificationUpdated);

    return () => {
      socket.off("buddy:verification:updated", onVerificationUpdated);
      disconnectBuddySocket();
    };
  }, [buddy?.id]);

  const detectState = (b) => {
    if (!b) return "unregistered";

    if (b.verificationStatus === "rejected") return "rejected";
    if (b.verificationStatus === "approved" || b.isVerified) return "welcome";
    if (b.verificationStatus === "pending" || b.registrationCompleted) return "pending";

    return "unregistered";
  };

  const handleLogout = async () => {
    try {
      const { logoutBuddyApi } = await import("../../services/buddyAuthService");
      await logoutBuddyApi();
    } catch {
      // ignore logout errors and continue cleanup
    }
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
        {liveNotice ? (
          <div className="mx-8 mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
            {liveNotice}
          </div>
        ) : null}

        <div className="flex flex-col gap-6 py-6">
          {state === "unregistered" && <UnregisteredBanner />}
          {state === "pending" && <PendingBanner />}
          {state === "rejected" && (
            <RejectedBanner
              reason={buddy?.verificationRejectionReason}
              onRetry={() => navigate("/buddy/register")}
            />
          )}
        </div>

        {state === "welcome" && (
          <VerifiedDashboard buddy={buddy} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}
