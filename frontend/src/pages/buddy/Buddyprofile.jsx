import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, CreditCard, FileText, BadgeCheck, Camera, Edit3, Shield, Briefcase } from "lucide-react";
import BuddyNav from "./BuddyNav"; 

export default function BuddyProfile() {
  // Mock data for the profile (in a real app, this would come from an API/localStorage)
  const buddy = {
    name: "Rahul Sharma",
    email: "rahul@example.com",
    mobile: "+91 9876543210",
    city: "Mumbai",
    dob: "12 May 1995",
    address: "102, Sunrise Apartments, Andheri West, Mumbai, Maharashtra 400053",
    panNumber: "ABCDE1234F",
    aadhaarNumber: "XXXX-XXXX-1234",
    bankName: "HDFC Bank",
    accountHolder: "Rahul Sharma",
    accountNumber: "XXXXXXXXX1234",
    ifsc: "HDFC0001234",
    status: "welcome", // Verified
    joinDate: "Jan 2025"
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] font-[Poppins,sans-serif] flex flex-col">
      {/* ── Top Navbar ── */}
      <BuddyNav buddy={buddy} status={buddy.status} unreadCount={2} />

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-8 flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-2 mt-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your personal information and account settings.</p>
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:border-[#6A2AFF] hover:text-[#6A2AFF] transition-all shadow-sm">
            <Edit3 size={16} /> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
          
          {/* ── LEFT COLUMN: Avatar & Quick Info ── */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* User Info Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center relative overflow-hidden">
              {/* Background gradient banner inside card */}
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#6A2AFF] to-[#D116A8] opacity-[0.08]"></div>
              
              {/* Avatar */}
              <div className="relative mt-4 mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6A2AFF] to-[#D116A8] flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white">
                  {buddy.name.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-[#6A2AFF] shadow-sm transition">
                  <Camera size={14} />
                </button>
              </div>

              <h2 className="text-xl font-bold text-gray-900">{buddy.name}</h2>
              <p className="text-sm text-gray-500 mb-3">{buddy.email}</p>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-xs font-semibold mb-6">
                <BadgeCheck size={14} /> Verified Buddy
              </div>

              <div className="w-full pt-6 border-t border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><Briefcase size={16} /> Joined</span>
                  <span className="font-semibold text-gray-800">{buddy.joinDate}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><MapPin size={16} /> Location</span>
                  <span className="font-semibold text-gray-800">{buddy.city}</span>
                </div>
              </div>
            </div>
            
            {/* Secure Data Notice */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-5 flex items-start gap-3">
              <Shield size={20} className="text-[#6A2AFF] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Your data is secure</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Your documents and bank details are encrypted and securely stored. We never share your personal data with third parties.
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Detailed Info ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Personal Details */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
                <User size={18} className="text-[#6A2AFF]" />
                <h3 className="text-base font-bold text-gray-900">Personal Details</h3>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <InfoItem icon={<User size={16} />} label="Full Name" value={buddy.name} />
                <InfoItem icon={<Phone size={16} />} label="Mobile Number" value={buddy.mobile} />
                <InfoItem icon={<Mail size={16} />} label="Email Address" value={buddy.email} />
                <InfoItem icon={<Calendar size={16} />} label="Date of Birth" value={buddy.dob} />
                <div className="sm:col-span-2">
                  <InfoItem icon={<MapPin size={16} />} label="Permanent Address" value={buddy.address} />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-[#D116A8]" />
                  <h3 className="text-base font-bold text-gray-900">Documents Setup</h3>
                </div>
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full border border-emerald-200">Verified</span>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <InfoItem label="PAN Number" value={buddy.panNumber} />
                <div className="flex flex-col">
                  <InfoItem label="Aadhaar Number" value={buddy.aadhaarNumber} />
                  <span className="text-xs text-gray-400 mt-1">Masked for security (Last 4 digits visible)</span>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
                <CreditCard size={18} className="text-amber-500" />
                <h3 className="text-base font-bold text-gray-900">Bank Information</h3>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <InfoItem label="Bank Name" value={buddy.bankName} />
                <InfoItem label="Account Holder Name" value={buddy.accountHolder} />
                <InfoItem label="Account Number" value={buddy.accountNumber} />
                <InfoItem label="IFSC Code" value={buddy.ifsc} />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Helper Component: Info Item ───
function InfoItem({ icon, label, value }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
        {icon && <span className="text-gray-400 opacity-80">{icon}</span>}
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900">{value || "—"}</p>
    </div>
  );
}
