import React from "react";
import {
  ShieldCheck,
  Mail,
  Building2,
  Award,
  ExternalLink,
  LogOut,
  Calendar,
  Sparkles,
  Phone,
  GraduationCap,
  Edit3,
  CheckCircle2,
} from "lucide-react";

export default function DashboardProfileCard({
  user,
  role = "principal",
  profileData,
  onManageProfile,
  logout,
}) {
  const isPrincipal = role === "principal";

  const displayName =
    profileData?.name ||
    (isPrincipal
      ? user?.displayName || "Dr. Savita Rathee"
      : user?.displayName || "Ravi Sharma");

  const designation =
    profileData?.designation ||
    (isPrincipal
      ? "Principal & Academic Head"
      : "System Administrator & Website Operations Manager");

  const department =
    profileData?.department ||
    (isPrincipal
      ? "Institutional Leadership & NCTE Compliance"
      : "IT & Digital Content Operations");

  const email = profileData?.email || user?.email || "";

  const phone =
    profileData?.phone || (isPrincipal ? "+91 98112 00001" : "+91 98112 45890");

  const employeeId =
    profileData?.employeeId ||
    (isPrincipal ? "HSCE-PRIN-01" : "HSCE-FAC-2024-08");

  const initials = isPrincipal ? "SR" : "RS";

  const todayStr = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A2540] via-[#0F3B7A] to-[#1E40AF] p-6 text-white shadow-xl border border-blue-400/30 transition-all">
      {/* Decorative ambient blue glows */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-indigo-500/20 blur-3xl" />

      {/* Top Header Row with Badges */}
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-blue-400/20">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold tracking-wider uppercase text-blue-200">
            Active Portal Session
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/25 border border-blue-300/30 px-2.5 py-0.5 text-[11px] font-semibold text-blue-100">
          <ShieldCheck size={12} className="text-blue-300" />
          {isPrincipal ? "Executive Desk" : "Staff Operations"}
        </span>
      </div>

      {/* Profile Bio Section */}
      <div className="relative z-10 mt-5 flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Avatar in Blue Theme */}
        <div className="relative shrink-0">
          {profileData?.avatarUrl ? (
            <img
              src={profileData.avatarUrl}
              alt={displayName}
              className="h-20 w-20 rounded-2xl object-cover shadow-lg ring-4 ring-blue-300/30"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-500 text-2xl font-extrabold text-white shadow-lg ring-4 ring-blue-300/30">
              {initials}
            </div>
          )}
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-[#0F3B7A]">
            <CheckCircle2 size={14} />
          </span>
        </div>

        {/* User Titles */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-medium mb-1">
            <Sparkles size={13} />
            <span>Haryana Shakti College of Education</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white truncate">
            {displayName}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-blue-200 mt-0.5">
            {designation}
          </p>
          <p className="text-[11px] text-blue-300/90 mt-0.5 truncate">
            {department}
          </p>
        </div>
      </div>

      {/* Profile Details List */}
      <div className="relative z-10 mt-5 space-y-2.5 rounded-xl bg-black/25 backdrop-blur-md p-3.5 border border-white/10 text-xs">
        <div className="flex items-center justify-between text-blue-100">
          <span className="flex items-center gap-2 text-blue-300">
            <Mail size={13} />
            <span>Official Email</span>
          </span>
          <span
            className="font-mono text-[11px] text-white truncate max-w-[190px]"
            title={email}>
            {email}
          </span>
        </div>

        <div className="flex items-center justify-between text-blue-100">
          <span className="flex items-center gap-2 text-blue-300">
            <Phone size={13} />
            <span>Contact Phone</span>
          </span>
          <span className="text-[11px] text-white">{phone}</span>
        </div>

        <div className="flex items-center justify-between text-blue-100">
          <span className="flex items-center gap-2 text-blue-300">
            <Building2 size={13} />
            <span>Affiliation</span>
          </span>
          <span className="font-medium text-white">GGSIPU & NCTE</span>
        </div>

        <div className="flex items-center justify-between text-blue-100">
          <span className="flex items-center gap-2 text-blue-300">
            <Award size={13} />
            <span>Employee / Desk ID</span>
          </span>
          <span className="font-mono text-[11px] text-amber-300">
            {employeeId}
          </span>
        </div>

        {profileData?.qualification && (
          <div className="flex items-center justify-between text-blue-100">
            <span className="flex items-center gap-2 text-blue-300">
              <GraduationCap size={13} />
              <span>Qualification</span>
            </span>
            <span className="text-[11px] text-white truncate max-w-[180px]">
              {profileData.qualification}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-blue-100">
          <span className="flex items-center gap-2 text-blue-300">
            <Calendar size={13} />
            <span>Active Session</span>
          </span>
          <span className="text-white">{todayStr}</span>
        </div>
      </div>

      {/* Quick Profile Actions */}
      <div className="relative z-10 mt-5 flex flex-wrap items-center gap-2.5">
        {onManageProfile && (
          <button
            type="button"
            onClick={onManageProfile}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-500/30 hover:bg-blue-500/50 py-2.5 px-3 text-xs font-bold text-white transition-all border border-blue-400/40 hover:border-blue-300 shadow-sm">
            <Edit3 size={14} />
            <span>Manage Profile</span>
          </button>
        )}

        <a
          href="https://www.hscekanjhawala.com/"
          target="_blank"
          rel="noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 py-2.5 px-3 text-xs font-bold text-white transition-all border border-white/20 hover:border-white/40 shadow-sm">
          <ExternalLink size={14} />
          <span>Live Website</span>
        </a>

        {logout && (
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 py-2.5 px-3.5 text-xs font-bold text-red-200 hover:text-white transition-all border border-red-400/30">
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
}
