import React from "react";
import { Link } from "react-router-dom";
import {
  Bot,
  Megaphone,
  Image,
  Users,
  MessageSquareText,
  GraduationCap,
  PanelsTopLeft,
  BookOpenCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Compass,
} from "lucide-react";

export default function QuickAccessFeatures({
  role = "principal",
  onScrollToAddress,
  permissions = {},
}) {
  const isPrincipal = role === "principal";
  const canAccess = (permission) =>
    isPrincipal || permissions.all === true || permissions[permission] === true;

  const features = [
    {
      label: "Admission requests",
      description: "Read and follow up on submitted forms",
      path: "/manage/enquiries",
      permission: "enquiries",
      icon: GraduationCap,
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      label: "Website chat questions",
      description: "Read questions sent through the website chat",
      path: "/manage/chatbot-enquiries",
      permission: "chatbotEnquiries",
      icon: Bot,
      iconBg: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Contact messages",
      description: "Read and reply to Contact Us messages",
      path: "/manage/feedback",
      permission: "feedback",
      icon: MessageSquareText,
      iconBg: "bg-violet-50 text-violet-600",
    },
    {
      label: "Student concerns",
      description: "Review and respond to student concerns",
      path: "/manage/grievances",
      permission: "grievances",
      icon: ShieldAlert,
      iconBg: "bg-rose-50 text-rose-600",
    },
    {
      label: "Update website notices",
      description: "Add, change, or remove a notice",
      path: "/manage/notices",
      permission: "notices",
      icon: Megaphone,
      iconBg: "bg-blue-50 text-blue-600",
    },
    {
      label: "Campus visits",
      description: "Confirm or update requested visits",
      path: "/manage/tours",
      permission: "tours",
      icon: Compass,
      iconBg: "bg-red-50 text-red-600",
    },
    {
      label: "Campus photos",
      description: "Add or update campus photos",
      path: "/manage/gallery",
      permission: "gallery",
      icon: Image,
      iconBg: "bg-purple-50 text-purple-600",
    },
    {
      label: "Faculty and staff",
      description: "Update names, roles, and staff photos",
      path: "/manage/faculty",
      permission: "faculty",
      icon: Users,
      iconBg: "bg-amber-50 text-amber-600",
    },
    {
      label: "Course documents",
      description: "Update syllabus files shown on the website",
      path: "/manage/syllabus",
      permission: "syllabus",
      icon: BookOpenCheck,
      iconBg: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Homepage announcement",
      description: "Choose the image and link shown on the homepage",
      path: "/manage/homepage-popup",
      permission: "homepagePopup",
      icon: PanelsTopLeft,
      iconBg: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Header of Quick Access Panel */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
            <Sparkles size={13} />
            Your tasks
          </span>
          <h3 className="text-lg font-bold text-slate-900">
            Choose a task
          </h3>
          <p className="text-xs text-slate-500">
            Open the area you have been asked to manage.
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

      {/* Feature Tiles List */}
      {features.some((item) => canAccess(item.permission)) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features
            .filter((item) => canAccess(item.permission))
            .map((item) => {
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
      ) : (
        <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          No tasks have been assigned yet. Please ask the principal to select
          the areas you should manage.
        </p>
      )}
    </div>
  );
}
