import BuddyNav from "./BuddyNav";
import UnregisteredBanner from "./UnregisteredBanner";
import PendingBanner from "./PendingBanner";
import VerifiedDashboard from "./VerifiedDashboard";

function getBuddyFromStorage() {
  try {
    return JSON.parse(localStorage.getItem("buddyData") || "null");
  } catch {
    return null;
  }
}

function detectState(buddy) {
  if (!buddy) return "unregistered";
  return buddy.isVerified ? "welcome" : "pending";
}

export default function BuddyDashboard() {
  const liveBuddy = getBuddyFromStorage();
  const state = detectState(liveBuddy);
  const unreadCount = 2;

  const handleLogout = () => {
    localStorage.removeItem("buddyData");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] font-[Poppins,sans-serif] flex flex-col">
      <BuddyNav buddy={liveBuddy} status={state} unreadCount={unreadCount} />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-col gap-6 py-6">
          <UnregisteredBanner />
          <PendingBanner />
        </div>

        <VerifiedDashboard buddy={liveBuddy} onLogout={handleLogout} />
      </div>
    </div>
  );
}
