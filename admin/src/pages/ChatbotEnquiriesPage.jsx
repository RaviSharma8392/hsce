import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  CheckCircle2,
  Download,
  Trash2,
  RefreshCw,
  MessageCircle,
  Save,
  MessageSquare,
  Eye,
  EyeOff,
  User,
  Calendar,
  HelpCircle,
} from "lucide-react";
import {
  subscribeToEnquiries,
  updateEnquiry,
  deleteEnquiry,
} from "../services/enquiryService";

const STATUS_CONFIG = {
  new: {
    label: "New Lead",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
    dotClass: "bg-amber-500",
  },
  "in-progress": {
    label: "In Progress",
    badgeClass: "bg-blue-100 text-blue-900 border-blue-300",
    dotClass: "bg-blue-600",
  },
  contacted: {
    label: "Contacted",
    badgeClass: "bg-purple-100 text-purple-900 border-purple-300",
    dotClass: "bg-purple-600",
  },
  enrolled: {
    label: "Enrolled",
    badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300",
    dotClass: "bg-emerald-600",
  },
  closed: {
    label: "Closed",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
    dotClass: "bg-slate-400",
  },
};

export default function ChatbotEnquiriesPage() {
  const [allEnquiries, setAllEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all");
  const [notification, setNotification] = useState("");

  // Editing notes state per card: { [id]: string }
  const [editingNotes, setEditingNotes] = useState({});
  const [savingNoteId, setSavingNoteId] = useState(null);

  // Subscribe to real-time enquiries
  useEffect(() => {
    const unsubscribe = subscribeToEnquiries((list) => {
      setAllEnquiries(list);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  // Filter chatbot enquiries only
  const chatbotLeads = useMemo(() => {
    return allEnquiries.filter((item) => {
      const src = (item.source || "").toLowerCase();
      return (
        src.includes("chatbot") ||
        src === "website_chatbot" ||
        src === "chatbot_button_enquiry" ||
        (item.query || "").toLowerCase().includes("chatbot") ||
        (!src && !item.formType)
      );
    });
  }, [allEnquiries]);

  // Filter by search, status, and read/unread
  const filteredList = useMemo(() => {
    return chatbotLeads.filter((item) => {
      // Status Filter
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      // Read / Unread Filter
      const isRead = item.isRead === true || item.read === true;
      if (readFilter === "unread" && isRead) return false;
      if (readFilter === "read" && !isRead) return false;

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name?.toLowerCase().includes(query);
        const matchPhone = item.phone?.toLowerCase().includes(query);
        const matchEmail = item.email?.toLowerCase().includes(query);
        const matchCity = item.city?.toLowerCase().includes(query);
        const matchMsg = item.query?.toLowerCase().includes(query);
        const matchNotes = item.staffNotes?.toLowerCase().includes(query);
        return matchName || matchPhone || matchEmail || matchCity || matchMsg || matchNotes;
      }

      return true;
    });
  }, [chatbotLeads, statusFilter, readFilter, searchQuery]);

  // Summary Statistics
  const stats = useMemo(() => {
    const total = chatbotLeads.length;
    const unread = chatbotLeads.filter(
      (item) => item.isRead !== true && item.read !== true
    ).length;
    const contacted = chatbotLeads.filter(
      (item) => item.status === "contacted" || item.status === "in-progress"
    ).length;
    const enrolled = chatbotLeads.filter(
      (item) => item.status === "enrolled"
    ).length;
    return { total, unread, contacted, enrolled };
  }, [chatbotLeads]);

  // Handle read/unread toggle
  const handleReadChange = async (item) => {
    const isRead = !(item.isRead === true || item.read === true);
    try {
      await updateEnquiry(item.id, { isRead });
      showToast(isRead ? "Marked as read." : "Marked as unread.");
    } catch (error) {
      console.error("Read status error:", error);
      showToast("Failed to update status.");
    }
  };

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateEnquiry(id, { status: newStatus });
      showToast(`Status updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}.`);
    } catch (e) {
      console.error("Status update error:", e);
      showToast("Failed to update status.");
    }
  };

  // Handle staff note save
  const handleSaveNote = async (id) => {
    const noteText = editingNotes[id] ?? "";
    setSavingNoteId(id);
    try {
      await updateEnquiry(id, { staffNotes: noteText });
      showToast("Staff notes saved successfully.");
    } catch (e) {
      console.error("Notes save error:", e);
      showToast("Failed to save note.");
    } finally {
      setSavingNoteId(null);
    }
  };

  // Handle delete
  const handleDelete = async (id, studentName) => {
    if (
      window.confirm(
        `Are you sure you want to delete the enquiry from "${studentName || "Student"}"?`
      )
    ) {
      try {
        await deleteEnquiry(id);
        showToast("Enquiry deleted.");
      } catch (e) {
        console.error("Delete error:", e);
        showToast("Failed to delete enquiry.");
      }
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (chatbotLeads.length === 0) {
      alert("No leads to export.");
      return;
    }

    const headers = [
      "Student Name",
      "Phone",
      "Email",
      "Course",
      "City",
      "Student Message / Input",
      "Status",
      "Staff Follow-up Notes",
      "Date / Time",
    ];

    const rows = chatbotLeads.map((item) => [
      `"${(item.name || "").replace(/"/g, '""')}"`,
      `"${item.phone || ""}"`,
      `"${item.email || ""}"`,
      `"${(item.course || "B.Ed.").replace(/"/g, '""')}"`,
      `"${(item.city || "").replace(/"/g, '""')}"`,
      `"${(item.query || "").replace(/"/g, '""')}"`,
      `"${item.status || "new"}"`,
      `"${(item.staffNotes || "").replace(/"/g, '""')}"`,
      `"${item.createdAtFormatted || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `HSCE_Student_Leads_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported Student Leads to CSV.");
  };

  return (
    <div className="academic-admin-page min-w-0 space-y-5 font-sans pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-[#1d2861] text-white px-4 py-2.5 rounded-xl shadow-xl border border-white/20 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={16} className="text-[#FBDD23]" />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. TOP HEADER & NAVIGATION SWITCHER */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#1d2861] text-[#FBDD23] flex items-center justify-center shrink-0 shadow-xs">
              <User size={22} strokeWidth={2.4} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight font-poppins">
                Student Enquiries & Leads
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Contact details, email, phone numbers, and messages submitted by prospective students.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition cursor-pointer">
            <Download size={14} className="text-slate-600" />
            <span>Export Leads (CSV)</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Sync Active</span>
          </div>
        </div>
      </div>

      {/* 2. DUAL INBOX TABS */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2.5">
        <div className="flex items-center gap-2">
          {/* Active: Chatbot Enquiries */}
          <div className="rounded-xl border-2 border-[#1d2861] bg-[#1d2861] px-4 py-2 text-xs font-bold text-white shadow-xs flex items-center gap-2">
            <MessageSquare size={14} className="text-[#FBDD23]" />
            <span>Chatbot Enquiries</span>
            <span className="ml-1 rounded-full bg-[#FBDD23] px-2 py-0.5 text-[10px] font-black text-[#1d2861]">
              {chatbotLeads.length}
            </span>
          </div>

          {/* Inactive: Admission Form Enquiries */}
          <Link
            to="/manage/enquiries"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#1d2861] transition flex items-center gap-2">
            <GraduationCap size={15} className="text-slate-400" />
            <span>Admission Form Enquiries</span>
          </Link>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total Leads: <strong className="text-slate-900 font-bold">{chatbotLeads.length}</strong>
        </div>
      </div>

      {/* 3. SIMPLE, CLEAN METRIC COUNTERS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Leads
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#1d2861] mt-1 font-poppins">
            {stats.total}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs border-l-4 border-l-amber-500">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
            New / Unread
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-1 font-poppins">
            {stats.unread}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs border-l-4 border-l-blue-500">
          <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
            Contacted / Active
          </span>
          <div className="text-2xl sm:text-3xl font-black text-blue-700 mt-1 font-poppins">
            {stats.contacted}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs border-l-4 border-l-emerald-500">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            Enrolled
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 font-poppins">
            {stats.enrolled}
          </div>
        </div>
      </div>

      {/* 4. SEARCH & STATUS FILTERS */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, phone, email, city, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-[#1d2861] focus:ring-1 focus:ring-[#1d2861] text-xs font-sans"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap justify-end">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter size={13} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold text-slate-800 focus:outline-none focus:border-[#1d2861]">
              <option value="all">All Statuses</option>
              <option value="new">New Lead</option>
              <option value="in-progress">In Progress</option>
              <option value="contacted">Contacted</option>
              <option value="enrolled">Enrolled</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Read / Unread Filter */}
          <select
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-semibold text-slate-800 focus:outline-none focus:border-[#1d2861]">
            <option value="all">All Read Statuses</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>

          {(searchQuery || statusFilter !== "all" || readFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setReadFilter("all");
              }}
              className="text-xs text-[#1d2861] hover:underline font-bold px-2 py-1 cursor-pointer">
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 5. SIMPLE, ELEGANT STUDENT LEAD CARDS (GRID VIEW) */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-2.5">
          <RefreshCw size={26} className="animate-spin text-[#1d2861]" />
          <span className="font-semibold text-slate-600">Loading student enquiries...</span>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="py-16 bg-white rounded-2xl border border-slate-200/90 text-center p-8 space-y-3">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <User size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-800 font-poppins">
            {chatbotLeads.length === 0
              ? "No Student Enquiries Yet"
              : "No Matching Student Leads"}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {chatbotLeads.length === 0
              ? "When visitors submit their contact information on the website, their details will appear here immediately."
              : "Try adjusting your search keywords or status filter above."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {filteredList.map((item) => {
            const currentStatus = item.status || "new";
            const cfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.new;
            const noteValue =
              editingNotes[item.id] !== undefined
                ? editingNotes[item.id]
                : item.staffNotes || "";
            const isRead = item.isRead === true || item.read === true;
            const studentInitial = (item.name || "S").trim().charAt(0).toUpperCase();

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
                <div className="p-4 sm:p-5 space-y-3.5 flex-1">
                  {/* Card Header: Student Name + Status Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-[#1d2861] text-[#FBDD23] font-bold text-base flex items-center justify-center shrink-0">
                        {studentInitial}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-slate-900 leading-tight truncate font-poppins">
                          {item.name || "Anonymous Applicant"}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            <GraduationCap size={12} className="mr-1 text-slate-500" />
                            {item.course || "B.Ed. (Bachelor of Education)"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Read/Unread Pill */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cfg.badgeClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
                        <span>{cfg.label}</span>
                      </span>

                      <span
                        className={`inline-flex items-center px-2 py-0.2 rounded-full text-[10px] font-bold border ${
                          isRead
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-300 bg-amber-50 text-amber-800"
                        }`}>
                        {isRead ? "Read" : "Unread"}
                      </span>
                    </div>
                  </div>

                  {/* PROMINENT QUESTION ASKED BY STUDENT */}
                  <div className="rounded-xl bg-gradient-to-r from-amber-50/90 to-yellow-50/60 border border-amber-300/80 p-3.5 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-[#1d2861] flex items-center gap-1.5">
                        <HelpCircle size={15} className="text-amber-600 shrink-0" />
                        <span>Question Asked by Student:</span>
                      </span>
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md shrink-0">
                        Direct Chatbot Inquiry
                      </span>
                    </div>
                    <p className="text-xs sm:text-[13px] font-bold text-slate-900 leading-relaxed whitespace-pre-wrap">
                      "{item.query || "Callback and admission guidance requested."}"
                    </p>
                  </div>

                  {/* Student Details: Contact, Email, City, Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-200/80">
                    {/* Phone & Instant Contact */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <Phone size={12} className="text-slate-400" />
                        <span>Phone:</span>
                      </span>
                      {item.phone ? (
                        <div className="flex items-center gap-1">
                          <a
                            href={`tel:${item.phone}`}
                            className="font-bold text-[#1d2861] hover:underline font-mono"
                            title="Call Student">
                            {item.phone}
                          </a>

                          <a
                            href={`https://wa.me/91${item.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              `Hello ${item.name || "Student"}, thank you for your enquiry regarding: "${item.query || "B.Ed. Admission"}". Our HSCE admissions team is here to assist you.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#25D366]/15 text-[#0d6832] hover:bg-[#25D366]/25 font-bold text-[11px] transition ml-1"
                            title="Reply to Student on WhatsApp">
                            <MessageCircle size={12} />
                            <span>Reply WhatsApp</span>
                          </a>
                        </div>
                      ) : (
                        <span className="text-amber-700 font-semibold italic">Awaiting phone number</span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="flex items-center gap-1 text-slate-500 font-medium shrink-0">
                        <Mail size={12} className="text-slate-400" />
                        <span>Email:</span>
                      </span>
                      {item.email ? (
                        <a
                          href={`mailto:${item.email}`}
                          className="text-slate-700 hover:text-[#1d2861] hover:underline truncate"
                          title="Send Email">
                          {item.email}
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">Not provided</span>
                      )}
                    </div>

                    {/* City / Location */}
                    <div className="flex items-center gap-1.5">
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <MapPin size={12} className="text-slate-400" />
                        <span>City:</span>
                      </span>
                      <span className="text-slate-700 font-medium">
                        {item.city || "Delhi NCR"}
                      </span>
                    </div>

                    {/* Received Date */}
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Calendar size={12} className="text-slate-400" />
                      <span>{item.createdAtFormatted || "Recent enquiry"}</span>
                    </div>
                  </div>

                  {/* Staff Follow-up Notes Box */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <label
                        htmlFor={`notes-${item.id}`}
                        className="font-bold text-slate-600 flex items-center gap-1">
                        <span>Staff Notes:</span>
                      </label>
                      {editingNotes[item.id] !== undefined && (
                        <span className="text-[10px] text-amber-600 font-semibold">
                          ● Unsaved
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        id={`notes-${item.id}`}
                        type="text"
                        value={noteValue}
                        onChange={(e) =>
                          setEditingNotes((prev) => ({
                            ...prev,
                            [item.id]: e.target.value,
                          }))
                        }
                        placeholder="Add follow-up notes (e.g. Called candidate, provided admission fee)..."
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white focus:outline-none focus:border-[#1d2861]"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveNote(item.id)}
                        disabled={savingNoteId === item.id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1d2861] hover:bg-[#2A3178] text-white text-xs font-semibold transition disabled:opacity-50 cursor-pointer">
                        <Save size={12} />
                        <span>{savingNoteId === item.id ? "Saving..." : "Save"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Status Changer & Actions */}
                <div className="bg-slate-50 border-t border-slate-200/80 px-4 sm:px-5 py-2.5 flex items-center justify-between gap-3 flex-wrap">
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Status:</span>
                    <select
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-semibold text-slate-800 focus:outline-none focus:border-[#1d2861] cursor-pointer">
                      <option value="new">New Lead</option>
                      <option value="in-progress">In Progress</option>
                      <option value="contacted">Contacted</option>
                      <option value="enrolled">Enrolled</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  {/* Read / Unread & Delete Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleReadChange(item)}
                      title={isRead ? "Mark as unread" : "Mark as read"}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                        isRead
                          ? "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                          : "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      }`}>
                      {isRead ? (
                        <>
                          <EyeOff size={13} />
                          <span>Mark Unread</span>
                        </>
                      ) : (
                        <>
                          <Eye size={13} />
                          <span>Mark Read</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                      title="Delete Lead">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
