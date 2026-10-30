import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Bot,
  MessageSquareText,
  ShieldAlert,
  CalendarDays,
  Megaphone,
  PanelsTopLeft,
  Images,
  UsersRound,
  BookOpenCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  Lock,
  Plus,
} from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";
import { subscribeToEnquiries } from "../services/enquiryService";

export default function DashboardPage({
  user,
  logout,
  role = "staff",
  permissions = {},
}) {
  const isPrincipal = role === "principal";
  const canAccess = (perm) =>
    isPrincipal || permissions.all === true || permissions[perm] === true;

  // Real-time institutional counters
  const [enquiriesCount, setEnquiriesCount] = useState(0);
  const [chatbotCount, setChatbotCount] = useState(0);
  const [noticesCount, setNoticesCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);

  // Subscribe to admission form & chatbot leads
  useEffect(() => {
    const unsubscribe = subscribeToEnquiries((list) => {
      const admissionOnly = list.filter((item) => {
        const src = (item.source || "").toLowerCase();
        return !src.includes("chatbot");
      });
      const chatbotOnly = list.filter((item) => {
        const src = (item.source || "").toLowerCase();
        return src.includes("chatbot");
      });
      setEnquiriesCount(admissionOnly.length);
      setChatbotCount(chatbotOnly.length);
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // Subscribe to notices count
  useEffect(() => {
    if (!firebaseReady) return undefined;
    const unsubscribe = onSnapshot(collection(db, "notices"), (snap) => {
      setNoticesCount(snap.size);
    }, () => {});
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // Subscribe to faculty count
  useEffect(() => {
    if (!firebaseReady) return undefined;
    const unsubscribe = onSnapshot(collection(db, "faculty"), (snap) => {
      setFacultyCount(snap.size);
    }, () => {});
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // Organized Work Areas
  const taskCategories = [
    {
      title: "Student & Visitor Desk",
      description: "Direct prospective student leads, inquiries, visits, and messages",
      tasks: [
        {
          label: "Admission Form Requests",
          description: "Review and process submitted B.Ed. registration forms",
          path: "/manage/enquiries",
          permission: "enquiries",
          icon: GraduationCap,
          iconBg: "bg-blue-50 text-blue-700",
          count: enquiriesCount > 0 ? `${enquiriesCount} Leads` : null,
        },
        {
          label: "Website Chat Questions",
          description: "Inquiries submitted via live website assistant chatbot",
          path: "/manage/chatbot-enquiries",
          permission: "chatbotEnquiries",
          icon: Bot,
          iconBg: "bg-indigo-50 text-indigo-700",
          count: chatbotCount > 0 ? `${chatbotCount} Chats` : null,
        },
        {
          label: "Contact Us Messages",
          description: "General feedback & questions from public contact page",
          path: "/manage/feedback",
          permission: "feedback",
          icon: MessageSquareText,
          iconBg: "bg-purple-50 text-purple-700",
        },
        {
          label: "Campus Visit Requests",
          description: "Scheduled candidate & parent tour appointments",
          path: "/manage/tours",
          permission: "tours",
          icon: CalendarDays,
          iconBg: "bg-emerald-50 text-emerald-700",
        },
        {
          label: "Student Concerns & Grievances",
          description: "Statutory grievance redressal committee files",
          path: "/manage/grievances",
          permission: "grievances",
          icon: ShieldAlert,
          iconBg: "bg-rose-50 text-rose-700",
        },
      ],
    },
    {
      title: "Website Operations & Media",
      description: "Live content published directly to college public website",
      tasks: [
        {
          label: "Notices & Circulars",
          description: "Publish official notifications, exam dates, and updates",
          path: "/manage/notices",
          permission: "notices",
          icon: Megaphone,
          iconBg: "bg-blue-50 text-blue-700",
          count: noticesCount > 0 ? `${noticesCount} Active` : null,
        },
        {
          label: "Homepage Announcement Popup",
          description: "Toggle or update the alert flyer banner on the homepage",
          path: "/manage/homepage-popup",
          permission: "homepagePopup",
          icon: PanelsTopLeft,
          iconBg: "bg-amber-50 text-amber-700",
        },
        {
          label: "Campus Photo Gallery",
          description: "High-resolution photographs of labs, library, and campus",
          path: "/manage/gallery",
          permission: "gallery",
          icon: Images,
          iconBg: "bg-cyan-50 text-cyan-700",
        },
        {
          label: "Course Documents & Syllabus",
          description: "Official B.Ed. curriculum & academic regulations PDFs",
          path: "/manage/syllabus",
          permission: "syllabus",
          icon: BookOpenCheck,
          iconBg: "bg-emerald-50 text-emerald-700",
        },
      ],
    },
    {
      title: "Institutional Governance & Directory",
      description: "College staff profiles, statutory cells, and security controls",
      tasks: [
        {
          label: "Faculty & Staff Directory",
          description: "Teaching pedagogy mentors & administrative staff records",
          path: "/manage/faculty",
          permission: "faculty",
          icon: UsersRound,
          iconBg: "bg-indigo-50 text-indigo-700",
          count: facultyCount > 0 ? `${facultyCount} Staff` : null,
        },
        ...(isPrincipal
          ? [
              {
                label: "Admin Access & Staff Governance",
                description: "Authorize new administrative users and assign work areas",
                path: "/manage/admin-users",
                permission: "all",
                icon: ShieldCheck,
                iconBg: "bg-[#1F242C] text-white",
                count: "Principal Only",
              },
            ]
          : []),
      ],
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Mobile App Quick Action Chips (PW App Action Bar) */}
      <div className="flex lg:hidden items-center gap-2 overflow-x-auto pb-1 max-w-full">
        <Link
          to="/manage/faculty"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-[#363991] text-xs font-bold shrink-0 transition active:scale-95 shadow-2xs"
        >
          <Plus size={14} />
          <span>Add Faculty</span>
        </Link>
        <Link
          to="/manage/notices"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shrink-0 transition active:scale-95 shadow-2xs"
        >
          <Megaphone size={14} />
          <span>New Notice</span>
        </Link>
        <Link
          to="/manage/enquiries"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shrink-0 transition active:scale-95 shadow-2xs"
        >
          <GraduationCap size={14} />
          <span>Review Leads</span>
        </Link>
        <Link
          to="/manage/tours"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold shrink-0 transition active:scale-95 shadow-2xs"
        >
          <CalendarDays size={14} />
          <span>Campus Tours</span>
        </Link>
        <a
          href="https://www.hscekanjhawala.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold shrink-0 transition active:scale-95 shadow-2xs"
        >
          <ExternalLink size={13} />
          <span>Public Website</span>
        </a>
      </div>

      {/* 2. REAL-TIME INSTITUTIONAL KPI STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <Link
          to="/manage/enquiries"
          className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs hover:border-indigo-300 hover:shadow-sm transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Admission Leads
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <GraduationCap size={15} />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-black text-slate-900 mt-1 sm:mt-2">
            {enquiriesCount}
          </div>
          <div className="text-[10px] sm:text-[11px] text-blue-700 font-semibold mt-0.5 sm:mt-1 flex items-center gap-1">
            <span>Direct form applicants</span>
            <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/manage/chatbot-enquiries"
          className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs hover:border-indigo-300 hover:shadow-sm transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Chatbot Leads
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <Bot size={15} />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-black text-slate-900 mt-1 sm:mt-2">
            {chatbotCount}
          </div>
          <div className="text-[10px] sm:text-[11px] text-[#363991] font-semibold mt-0.5 sm:mt-1 flex items-center gap-1">
            <span>AI assistant inquiries</span>
            <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/manage/notices"
          className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs hover:border-indigo-300 hover:shadow-sm transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Published Notices
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <Megaphone size={15} />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-black text-slate-900 mt-1 sm:mt-2">
            {noticesCount}
          </div>
          <div className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold mt-0.5 sm:mt-1 flex items-center gap-1">
            <span>Live on public website</span>
            <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        <Link
          to="/manage/faculty"
          className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs hover:border-indigo-300 hover:shadow-sm transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Faculty &amp; Staff
            </span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <UsersRound size={15} />
            </div>
          </div>
          <div className="text-xl sm:text-3xl font-black text-slate-900 mt-1 sm:mt-2">
            {facultyCount}
          </div>
          <div className="text-[10px] sm:text-[11px] text-purple-700 font-semibold mt-0.5 sm:mt-1 flex items-center gap-1">
            <span>Directory profiles</span>
            <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>

      {/* 3. WORK AREAS & ASSIGNED TASKS (Categorized & App-Friendly) */}
      <div className="space-y-6">
        {taskCategories.map((category) => {
          const visibleTasks = category.tasks.filter((t) => canAccess(t.permission));
          if (visibleTasks.length === 0) return null;

          return (
            <div key={category.title} className="space-y-3">
              <div className="border-b border-slate-200/80 pb-2">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>{category.title}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {category.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {visibleTasks.map((task) => {
                  const Icon = task.icon;
                  return (
                    <Link
                      key={task.path}
                      to={task.path}
                      className="group relative flex items-start gap-3.5 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-[#363991]/50 hover:shadow-sm transition"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${task.iconBg} shadow-2xs group-hover:scale-105 transition-transform`}
                      >
                        <Icon size={19} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#363991] transition-colors truncate">
                            {task.label}
                          </h3>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>

                        {task.count && (
                          <div className="mt-2">
                            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-[#363991] border border-indigo-100">
                              {task.count}
                            </span>
                          </div>
                        )}
                      </div>

                      <ArrowRight
                        size={15}
                        className="text-slate-300 group-hover:text-[#363991] group-hover:translate-x-0.5 transition-all shrink-0 mt-1"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. INSTITUTIONAL STATUTORY TRUST BANNER */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Haryana Shakti College of Education
            </span>
            <span className="text-xs text-slate-400">&bull;</span>
            <span className="text-xs font-semibold text-slate-500">Kanjhawala, Delhi – 110081</span>
          </div>
          <p className="text-xs text-slate-500">
            NCTE Approved (Code: 147) &bull; Affiliated to Guru Gobind Singh Indraprastha University (GGSIPU), Delhi &bull; 100 B.Ed. Seats
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-semibold text-slate-400">Session 2026-27</span>
          <a
            href="https://www.hscekanjhawala.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
          >
            <span>Visit College Portal</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
