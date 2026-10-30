import React, { useState } from "react";
import {
  X,
  Users,
  Mail,
  Phone,
  Search,
  Sparkles,
  Building2,
} from "lucide-react";

export const DEFAULT_COLLEGE_PEOPLE = [
  {
    id: "p1",
    name: "Dr. Savita Rathee",
    role: "Principal & Head of Institution",
    department: "Executive Administration",
    phone: "+91 98112 00001",
    tag: "Principal",
  },
  {
    id: "p2",
    name: "Suman Sharma",
    role: "Teacher & B.Ed. Faculty",
    department: "Pedagogy & Curriculum",
    email: "suman.sharma@hsce.edu.in",
    phone: "+91 98112 45890",
    tag: "Current User",
  },
  {
    id: "p3",
    name: "Ravi Sharma",
    role: "Asst. Professor & ICT Coordinator",
    department: "Educational Technology",
    email: "Ravisharmabhimtal@gmail.com12g",
    phone: "+91 98112 45891",
    tag: "Staff Ops",
  },
  {
    id: "p4",
    name: "Dr. Anju Bala",
    role: "Associate Professor",
    department: "Teacher Education",
    email: "anju.bala@hsce.edu.in",
    phone: "+91 98112 00003",
    tag: "Faculty",
  },
  {
    id: "p5",
    name: "Sh. Rajesh Kumar",
    role: "Office Superintendent",
    department: "Accounts & Administration",
    email: "admin.super@hsce.edu.in",
    phone: "+91 98112 00004",
    tag: "Admin",
  },
  {
    id: "p6",
    name: "Smt. Sunita Verma",
    role: "Chief Librarian",
    department: "Library & Documentation",
    email: "library@hsce.edu.in",
    phone: "+91 98112 00005",
    tag: "Staff",
  },
];

export default function ManagePeopleModal({ isOpen, onClose }) {
  const [search, setSearch] = useState("");
  if (!isOpen) return null;

  const people = DEFAULT_COLLEGE_PEOPLE.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-stretch p-0 bg-white sm:bg-slate-900/60 sm:backdrop-blur-sm sm:items-center sm:justify-center sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}>
      <div
        className="relative w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] sm:h-auto sm:max-w-2xl sm:max-h-[90vh] bg-white rounded-none sm:rounded-2xl shadow-none sm:shadow-2xl border-0 sm:border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0066FF] via-[#0252cf] to-[#1E3A8A] text-white p-4 pt-[max(0.75rem,env(safe-area-inset-top))] sm:p-6 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl backdrop-blur-sm transition-colors"
            aria-label="Close modal">
            <X size={18} />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center shadow-sm">
              <Users size={22} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-semibold text-blue-100 backdrop-blur-sm mb-1">
                <Sparkles size={11} />
                <span>Institutional Directory</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Manage My People
              </h2>
              <p className="text-xs text-blue-100">
                Colleagues, teaching staff, and administrators at Haryana Shakti
                College
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search people by name, role, or department..."
              className="portal-input !pl-9 !py-2 text-xs"
            />
          </div>
        </div>

        {/* People List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {people.map((person) => (
            <div
              key={person.id}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0066FF] font-bold text-sm flex items-center justify-center shrink-0 border border-blue-100">
                  {person.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {person.name}
                    </h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {person.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {person.role}
                  </p>
                  <p className="text-[11px] text-[#0066FF] flex items-center gap-1 mt-0.5">
                    <Building2 size={11} />
                    <span>{person.department}</span>
                  </p>
                </div>
              </div>

              <div className="text-right text-xs text-slate-500 shrink-0 hidden sm:block">
                <div className="flex items-center gap-1 justify-end">
                  <Mail size={12} className="text-slate-400" />
                  <span className="text-[11px] font-mono">{person.email}</span>
                </div>
                <div className="flex items-center gap-1 justify-end text-[11px] mt-0.5">
                  <Phone size={12} className="text-slate-400" />
                  <span>{person.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="shrink-0 p-3.5 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-slate-200 bg-white sm:bg-slate-50 flex items-center justify-between text-xs text-slate-500 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] sm:shadow-none">
          <span>{people.length} members listed</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
