import React from "react";
import { Link } from "react-router-dom";
import {
  Megaphone,
  Files,
  Image,
  Users,
  Building,
  MessageSquare,
  Settings,
  ArrowRight,
  BookOpen,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  Compass,
} from "lucide-react";

export default function QuickAccessFeatures({
  role = "principal",
  onScrollToAddress,
  noticesCount,
}) {
  const isPrincipal = role === "principal";

  const features = [
    {
      label: "Website Notices & Circulars",
      badge: noticesCount ? `${noticesCount} Active` : "Live",
      badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
      description: "Manage admissions alerts, examinations, and official student circulars",
      path: "/notices",
      icon: Megaphone,
      color: "from-blue-600 to-indigo-600",
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      label: "Campus Tour Bookings",
      badge: "Tours",
      badgeColor: "bg-red-100 text-red-800 border-red-200",
      description: "Review, confirm and manage prospective student campus visit requests",
      path: "/manage/tours",
      icon: Compass,
      color: "from-red-600 to-rose-600",
      iconBg: "bg-red-50 text-red-600",
    },
    {
      label: "Campus Gallery & Media",
      badge: "Photos",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      description: "Update campus photos, labs, cultural events, and ceremonies",
      path: "/gallery",
      icon: Image,
      color: "from-purple-600 to-pink-600",
      iconBg: "bg-purple-50 text-purple-600",
    },
    {
      label: "Faculty & Staff Directory",
      badge: "Verified",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      description: "Maintain verified teacher-educator profiles and credentials",
      path: "/faculty",
      icon: Users,
      color: "from-amber-600 to-orange-600",
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      label: "Governance Committees",
      badge: "Statutory",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
      description: "Academic Advisory, Grievance Redressal, and Anti-Ragging cells",
      path: "/committees",
      icon: Building,
      color: "from-rose-600 to-red-600",
      iconBg: "bg-rose-50 text-rose-600",
    },
    {
      label: "Site Settings & Contact",
      badge: "Config",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
      description: "Official phone numbers, email, campus address, and metadata",
      path: "/site-settings",
      icon: Settings,
      color: "from-slate-700 to-slate-900",
      iconBg: "bg-slate-100 text-slate-700",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Header of Quick Access Panel */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
            <Sparkles size={13} />
            Quick Navigation
          </span>
          <h3 className="text-lg font-bold text-slate-900">
            Easily Accessible Features
          </h3>
          <p className="text-xs text-slate-500">
            Direct 1-click access to all college website operational modules.
          </p>
        </div>

        {isPrincipal && onScrollToAddress && (
          <button
            type="button"
            onClick={onScrollToAddress}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors shadow-2xs"
          >
            <span>Principal's Address</span>
            <ArrowRight size={13} />
          </button>
        )}
      </div>

      {/* Institutional Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Programme
            </span>
            <BookOpen size={14} className="text-blue-600" />
          </div>
          <div className="text-base font-extrabold text-slate-900">B.Ed.</div>
          <p className="text-[10.5px] text-slate-500 truncate">2-Year Approved</p>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Affiliation
            </span>
            <Building size={14} className="text-amber-600" />
          </div>
          <div className="text-base font-extrabold text-slate-900">GGSIPU</div>
          <p className="text-[10.5px] text-slate-500 truncate">Delhi University</p>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Recognition
            </span>
            <Shield size={14} className="text-emerald-600" />
          </div>
          <div className="text-base font-extrabold text-slate-900">NCTE</div>
          <p className="text-[10.5px] text-slate-500 truncate">Statutory Body</p>
        </div>

        <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Committees
            </span>
            <Users size={14} className="text-indigo-600" />
          </div>
          <div className="text-base font-extrabold text-slate-900">2 Active</div>
          <p className="text-[10.5px] text-slate-500 truncate">Advisory & Grievance</p>
        </div>
      </div>

      {/* Feature Tiles List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="group relative flex items-start gap-3.5 rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs hover:border-blue-500/60 hover:shadow-md transition-all"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.iconBg} group-hover:scale-105 transition-transform`}
              >
                <Icon size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {item.label}
                  </h4>
                  <span
                    className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold border ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">
                  {item.description}
                </p>
              </div>

              <ArrowRight
                size={14}
                className="shrink-0 self-center text-slate-400 group-hover:translate-x-0.5 group-hover:text-blue-600 transition-all"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
