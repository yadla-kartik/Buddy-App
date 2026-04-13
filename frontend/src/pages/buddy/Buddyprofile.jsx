import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  BadgeCheck,
  Shield,
  Briefcase,
  Car,
  IdCard,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BuddyNav from "./BuddyNav";
import { getBuddyStatus } from "../../services/buddyAuthService";
import api from "../../services/api";

const getFileUrl = (filePath) => {
  if (!filePath) return "";
  if (/^https?:\/\//i.test(filePath)) return filePath;
  const origin = (api.defaults.baseURL || "").replace(/\/api\/?$/, "");
  const normalized = filePath.replace(/\\/g, "/");
  return `${origin}/${normalized}`;
};

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const maskAadhaar = (value) => {
  if (!value) return "-";
  if (value.length <= 4) return value;
  return `XXXX-XXXX-${value.slice(-4)}`;
};

const maskAccount = (value) => {
  if (!value) return "-";
  if (value.length <= 4) return value;
  return `${"X".repeat(value.length - 4)}${value.slice(-4)}`;
};

export default function BuddyProfile() {
  const navigate = useNavigate();
  const [buddy, setBuddy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getBuddyStatus();
        if (!res?.buddy) {
          navigate("/buddy/login");
          return;
        }
        setBuddy(res.buddy);
      } catch (e) {
        navigate("/buddy/login");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#6A2AFF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!buddy) return null;

  const status = buddy.isVerified ? "welcome" : "pending";

  return (
    <div className="min-h-screen bg-[#f7f8fc] font-[Poppins,sans-serif] flex flex-col">
      <BuddyNav buddy={buddy} status={status} unreadCount={0} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 md:px-6 py-5 md:py-6">
        <div className="rounded-3xl bg-white border border-gray-100 shadow-[0_18px_50px_rgba(17,24,39,0.06)] overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-[#6A2AFF]/15 via-[#6A2AFF]/8 to-[#D116A8]/15"></div>

          <div className="px-4 md:px-6 -mt-12 pb-5">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div className="flex items-start gap-4">
                {buddy.profilePhoto ? (
                  <img
                    src={getFileUrl(buddy.profilePhoto)}
                    alt="Profile"
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#6A2AFF] to-[#D116A8] text-white text-3xl font-bold flex items-center justify-center border-4 border-white shadow-lg">
                    {buddy.name?.charAt(0)?.toUpperCase() || "B"}
                  </div>
                )}
                <div className="pt-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{buddy.name || "-"}</h1>
                  <p className="text-sm text-gray-500 mt-1">{buddy.email || "-"}</p>
                  <div
                    className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-semibold ${
                      buddy.isVerified
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    <BadgeCheck size={14} />
                    {buddy.isVerified ? "Verified Buddy" : "Pending Verification"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 w-full lg:w-auto">
                <MiniCard
                  icon={<Briefcase size={14} />}
                  label="Joined"
                  value={formatDate(buddy.createdAt)}
                />
                <MiniCard
                  icon={<MapPin size={14} />}
                  label="City"
                  value={buddy.city || "-"}
                />
                <MiniCard
                  icon={<IdCard size={14} />}
                  label="Requested"
                  value={buddy.verificationRequested ? "Yes" : "No"}
                />
                <MiniCard
                  icon={<Calendar size={14} />}
                  label="Requested On"
                  value={formatDate(buddy.verificationRequestedAt)}
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="xl:col-span-2 grid grid-cols-1 gap-4">
                <Section title="Personal Details" icon={<User size={18} className="text-[#6A2AFF]" />}>
                  <InfoItem icon={<User size={16} />} label="Full Name" value={buddy.name} />
                  <InfoItem icon={<Phone size={16} />} label="Mobile Number" value={buddy.mobile} />
                  <InfoItem icon={<Mail size={16} />} label="Email Address" value={buddy.email} />
                  <InfoItem icon={<Calendar size={16} />} label="Date of Birth" value={formatDate(buddy.dob)} />
                  <div className="sm:col-span-2">
                    <InfoItem icon={<MapPin size={16} />} label="Permanent Address" value={buddy.permanentAddress} />
                  </div>
                </Section>

                <Section title="Documents Details" icon={<FileText size={18} className="text-[#D116A8]" />}>
                  <InfoItem label="PAN Number" value={buddy.panNumber} />
                  <InfoItem label="Aadhaar Number" value={maskAadhaar(buddy.aadhaarNumber)} />
                  <InfoItem label="Driving Licence Number" value={buddy.drivingLicenseNumber} />
                  <InfoItem
                    label="Driving Licence Image"
                    value={buddy.drivingLicenseImage ? "Uploaded" : "-"}
                  />
                </Section>

                <Section title="Bank Details" icon={<CreditCard size={18} className="text-amber-500" />}>
                  <InfoItem label="Bank Name" value={buddy.bankName} />
                  <InfoItem label="Account Holder Name" value={buddy.accountHolderName} />
                  <InfoItem label="Account Number" value={maskAccount(buddy.accountNumber)} />
                  <InfoItem label="IFSC Code" value={buddy.ifscCode} />
                </Section>
              </div>

              <div className="grid grid-cols-1 gap-4 h-fit">
                <Section title="Vehicle Details" icon={<Car size={18} className="text-blue-500" />} compact>
                  <InfoItem label="Vehicle Type" value={buddy.vehicleType} />
                  <InfoItem label="Vehicle Number" value={buddy.vehicleNumber} />
                  <InfoItem
                    icon={<IdCard size={16} />}
                    label="Verification Requested"
                    value={buddy.verificationRequested ? "Yes" : "No"}
                  />
                  <InfoItem label="Verification Requested At" value={formatDate(buddy.verificationRequestedAt)} />
                </Section>

                <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-pink-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-purple-100 flex items-center justify-center">
                      <Shield size={17} className="text-[#6A2AFF]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Secure Profile</h3>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        Your submitted identity and bank information is kept in a protected system.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-purple-100/70 flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                    <CheckCircle2 size={14} />
                    Profile data synced from server
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, icon, children, compact = false }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2 bg-gray-50/70">
        {icon}
        <h3 className="text-[15px] font-bold text-gray-900">{title}</h3>
      </div>
      <div
        className={`p-4 grid grid-cols-1 sm:grid-cols-2 ${
          compact ? "gap-y-4 gap-x-4" : "gap-y-4 gap-x-6"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function MiniCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-2.5 py-2 min-w-[110px]">
      <p className="text-[11px] text-gray-500 flex items-center gap-1.5 font-medium">
        <span className="text-gray-400">{icon}</span>
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900 mt-0.5">{value || "-"}</p>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
        {icon ? <span className="text-gray-400 opacity-80">{icon}</span> : null}
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900 break-words">{value || "-"}</p>
    </div>
  );
}
