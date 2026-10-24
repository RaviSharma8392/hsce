import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  UserCheck,
  Download,
  Trash2,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
  ChevronDown,
  Save,
  ExternalLink,
  MessageCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  subscribeToEnquiries,
  subscribeToFeedback,
  subscribeToGrievances,
  updateEnquiry,
  updateGrievanceStatus,
  deleteEnquiry,
  deleteFeedback,
  deleteGrievance,
} from "../services/enquiryService";

const STATUS_CONFIG = {
  new: {
    label: "New Lead",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
    dotClass: "bg-blue-500",
  },
  "in-progress": {
    label: "In Progress",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
  },
  contacted: {
    label: "Contacted",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
    dotClass: "bg-purple-500",
  },
  enrolled: {
    label: "Enrolled",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  closed: {
    label: "Closed",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    dotClass: "bg-slate-400",
  },
  "under-review": {
    label: "Under Review",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
  },
  resolved: {
    label: "Resolved",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
};

export default function EnquiriesPage({ role = "staff" }) {
  const isPrincipal = role === "principal";
  const location = useLocation();
  const navigate = useNavigate();
  const activeInbox = location.pathname.endsWith("/feedback")
    ? "feedback"
    : location.pathname.endsWith("/grievances")
      ? "grievances"
      : "enquiries";
  const [enquiries, setEnquiries] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [notification, setNotification] = useState("");

  // Editing notes state per card: { [id]: string }
  const [editingNotes, setEditingNotes] = useState({});
  const [savingNoteId, setSavingNoteId] = useState(null);

  // Subscribe to real-time enquiries
  useEffect(() => {
    setLoading(true);
    const unsubscribers = [
      subscribeToEnquiries((list) => {
        setEnquiries(list);
        setLoading(false);
      }),
      subscribeToFeedback(setFeedback),
    ];
    if (isPrincipal) unsubscribers.push(subscribeToGrievances(setGrievances));

    return () => {
      unsubscribers.forEach((unsubscribe) => {
        if (typeof unsubscribe === "function") unsubscribe();
      });
    };
  }, [isPrincipal]);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const activeRecords =
    activeInbox === "feedback"
      ? feedback
      : activeInbox === "grievances"
        ? grievances
        : enquiries;

  const filteredList = useMemo(() => {
    return activeRecords.filter((item) => {
      // Status filter
      if (activeInbox === "enquiries") {
        if (
          statusFilter === "unread" &&
          (item.isRead === true || item.read === true)
        ) {
          return false;
        }
        if (
          statusFilter === "read" &&
          item.isRead !== true &&
          item.read !== true
        ) {
          return false;
        }
      } else if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }
      // Course filter
      if (activeInbox === "enquiries" && courseFilter !== "all") {
        if (
          !item.course ||
          !item.course.toLowerCase().includes(courseFilter.toLowerCase())
        ) {
          return false;
        }
      }
      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name?.toLowerCase().includes(query);
        const matchPhone = item.phone?.toLowerCase().includes(query);
        const matchEmail = item.email?.toLowerCase().includes(query);
        const matchCity = item.city?.toLowerCase().includes(query);
        const matchMsg = item.query?.toLowerCase().includes(query);
        const matchSubject = item.subject?.toLowerCase().includes(query);
        const matchMessage = item.message?.toLowerCase().includes(query);
        const matchDescription = item.description
          ?.toLowerCase()
          .includes(query);
        return (
          matchName ||
          matchPhone ||
          matchEmail ||
          matchCity ||
          matchMsg ||
          matchSubject ||
          matchMessage ||
          matchDescription
        );
      }
      return true;
    });
  }, [activeRecords, activeInbox, statusFilter, courseFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = enquiries.length;
    const readCount = enquiries.filter(
      (enquiry) => enquiry.isRead === true || enquiry.read === true,
    ).length;
    return { total, readCount, unreadCount: total - readCount };
  }, [enquiries]);

  const handleReadChange = async (item) => {
    const isRead = !(item.isRead === true || item.read === true);
    try {
      await updateEnquiry(item.id, { isRead });
      showToast(isRead ? "Enquiry marked as read." : "Enquiry marked as unread.");
    } catch (error) {
      console.error("Read status update error:", error);
      showToast("Failed to update read status.");
    }
  };

  // Handle status update
  const handleStatusChange = async (id, newStatus) => {
    try {
      if (activeInbox === "grievances") {
        const notes =
          editingNotes[id] ??
          grievances.find((item) => item.id === id)?.adminNotes ??
          "";
        await updateGrievanceStatus(id, newStatus, notes);
      } else {
        await updateEnquiry(id, { status: newStatus });
      }
      showToast(
        `Status updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}`,
      );
    } catch (e) {
      console.error("Status update error:", e);
      showToast("Failed to update status.");
    }
  };

  // Handle note save
  const handleSaveNote = async (id) => {
    const noteText = editingNotes[id] ?? "";
    setSavingNoteId(id);
    try {
      if (activeInbox === "grievances") {
        const status =
          grievances.find((item) => item.id === id)?.status || "new";
        await updateGrievanceStatus(id, status, noteText);
      } else {
        await updateEnquiry(id, { staffNotes: noteText });
      }
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
    const submissionType =
      activeInbox === "feedback"
        ? "feedback from"
        : activeInbox === "grievances"
          ? "grievance from"
          : "enquiry from";
    if (
      window.confirm(
        `Are you sure you want to delete the ${submissionType} "${studentName}"?`,
      )
    ) {
      try {
        if (activeInbox === "feedback") await deleteFeedback(id);
        else if (activeInbox === "grievances") await deleteGrievance(id);
        else await deleteEnquiry(id);
        showToast("Submission deleted.");
      } catch (e) {
        console.error("Delete error:", e);
        showToast("Failed to delete enquiry.");
      }
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (activeRecords.length === 0) {
      alert("No enquiries to export.");
      return;
    }

    const headers = [
      "Student Name",
      "Phone",
      "Email",
      "Course",
      "City",
      "Query / Message",
      "Status",
      "Staff Notes",
      "Submitted At",
      "Source",
    ];

    const rows = activeRecords.map((item) => [
      `"${(item.name || "").replace(/"/g, '""')}"`,
      `"${item.phone || ""}"`,
      `"${item.email || ""}"`,
      `"${(item.course || "").replace(/"/g, '""')}"`,
      `"${(item.city || "").replace(/"/g, '""')}"`,
      `"${(item.query || "").replace(/"/g, '""')}"`,
      `"${item.status || "new"}"`,
      `"${(item.staffNotes || "").replace(/"/g, '""')}"`,
      `"${item.createdAtFormatted || ""}"`,
      `"${item.source || "website_chatbot"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `HSCE_Student_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported CSV file successfully.");
  };

  return (
    <div className="academic-admin-page min-w-0 space-y-5 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={15} className="text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* TOP BANNER & ACTIONS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-[#0066FF] rounded-xl border border-blue-200">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {activeInbox === "enquiries"
                  ? "Student Enquiries & Chatbot Leads"
                  : activeInbox === "feedback"
                    ? "Contact Feedback"
                    : "Student Grievances"}
              </h2>
              <p className="text-xs text-slate-500">
                {activeInbox === "enquiries"
                  ? "Direct submissions from public admission and chatbot forms."
                  : activeInbox === "feedback"
                    ? "Messages submitted through the public contact guestbook."
                    : "Confidential submissions to the public grievance portal."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {activeInbox === "enquiries" && (
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition border border-slate-200">
              <Download size={14} className="text-slate-600" />
              <span>Export CSV</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Sync Active</span>
          </div>
        </div>
      </div>

      <nav
        aria-label="Submission inboxes"
        className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          ["enquiries", "Student Enquiries", enquiries.length],
          ["feedback", "Contact Feedback", feedback.length],
          ...(isPrincipal
            ? [["grievances", "Grievances", grievances.length]]
            : []),
        ].map(([inbox, label, count]) => (
          <button
            key={inbox}
            type="button"
            aria-current={activeInbox === inbox ? "page" : undefined}
            onClick={() => {
              navigate(`/manage/${inbox}`);
              setStatusFilter("all");
              setCourseFilter("all");
              setSearchQuery("");
            }}
            className={`border px-3 py-2 text-xs font-semibold transition ${
              activeInbox === inbox
                ? "border-[#0066FF] bg-blue-50 text-[#0052cc]"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}>
            {label} <span className="ml-1 text-slate-400">{count}</span>
          </button>
        ))}
      </nav>

      {/* METRIC CARDS */}
      {activeInbox === "enquiries" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Leads
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-poppins">
              {stats.total}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Unread
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-poppins">
              {stats.unreadCount}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Read
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-poppins">
              {stats.readCount}
            </div>
          </div>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search
            size={15}
            className="absolute left-3 top-2.5 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by name, phone, email, query..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] text-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter size={13} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs bg-white font-medium focus:outline-none focus:border-[#0066FF]">
              <option value="all">
                {activeInbox === "enquiries" ? "Read & Unread" : "All Statuses"}
              </option>
              {(activeInbox === "enquiries"
                ? ["unread", "read"]
                : activeInbox === "grievances"
                  ? ["new", "under-review", "resolved"]
                  : ["new", "in-progress", "contacted", "enrolled", "closed"]
              ).map((status) => (
                <option key={status} value={status}>
                  {activeInbox === "enquiries"
                    ? status === "unread"
                      ? "Unread"
                      : "Read"
                    : STATUS_CONFIG[status]?.label || status}
                </option>
              ))}
            </select>
          </div>

          {/* Course Filter */}
          {activeInbox === "enquiries" && (
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs bg-white font-medium focus:outline-none focus:border-[#0066FF]">
              <option value="all">All Courses</option>
              <option value="b.ed">B.Ed.</option>
              <option value="d.el.ed">D.El.Ed.</option>
            </select>
          )}

          {(searchQuery ||
            statusFilter !== "all" ||
            courseFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setCourseFilter("all");
              }}
              className="text-xs text-blue-600 hover:underline font-medium">
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ENQUIRIES LIST / GRID */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <RefreshCw size={22} className="animate-spin text-[#0066FF]" />
          <span>Loading enquiries...</span>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="py-16 bg-white rounded-2xl border border-slate-200/80 text-center p-6 space-y-3">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <MessageSquare size={22} />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {activeRecords.length === 0
              ? activeInbox === "feedback"
                ? "No Contact Feedback Yet"
                : activeInbox === "grievances"
                  ? "No Grievances Yet"
                  : "No Student Enquiries Yet"
              : "No Matching Submissions"}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {activeRecords.length === 0
              ? activeInbox === "feedback"
                ? "Messages sent through the public contact form will appear here."
                : activeInbox === "grievances"
                  ? "Submissions through the grievance portal will appear here."
                  : "When visitors submit an admission or chatbot enquiry, their details will appear here."
              : "Try adjusting your search keyword or status filter to see other enquiries."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((item) => {
            const currentStatus = item.status || "new";
            const cfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.new;
            const noteValue =
              editingNotes[item.id] !== undefined
                ? editingNotes[item.id]
                : activeInbox === "grievances"
                  ? item.adminNotes || ""
                  : item.staffNotes || "";

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left: Student Header & Basic Details */}
                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900 font-poppins">
                        {item.name || "Anonymous Applicant"}
                      </h3>

                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#363991]/10 text-[#363991] border border-[#363991]/20">
                        <GraduationCap size={12} className="mr-1" />
                        {item.course || item.category || "B.Ed."}
                      </span>

                      {activeInbox === "enquiries" ? (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                            item.isRead === true || item.read === true
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-amber-200 bg-amber-50 text-amber-700"
                          }`}>
                          {item.isRead === true || item.read === true
                            ? "Read"
                            : "Unread"}
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cfg.badgeClass}`}>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`}
                          />
                          <span>{cfg.label}</span>
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400 font-medium">
                        &bull; {item.createdAtFormatted || "Recent"}
                      </span>
                    </div>

                    {/* Contact Actions Strip */}
                    <div className="flex items-center gap-3 flex-wrap text-xs">
                      {item.phone && (
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`tel:${item.phone}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-bold font-mono transition"
                            title="Direct Phone Call">
                            <Phone size={12} />
                            <span>{item.phone}</span>
                          </a>

                          <a
                            href={`https://wa.me/91${item.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              `Hello ${item.name || "Student"}, thank you for contacting Haryana Shakti College of Education regarding ${
                                item.course || "admissions"
                              }. How can we assist you?`,
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#25D366]/10 text-[#128C7E] border border-[#25D366]/30 hover:bg-[#25D366]/20 font-bold transition"
                            title="Open WhatsApp Chat">
                            <MessageCircle size={13} />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      )}

                      {item.email && (
                        <a
                          href={`mailto:${item.email}`}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 font-medium transition"
                          title="Send Email">
                          <Mail size={12} className="text-slate-500" />
                          <span>{item.email}</span>
                        </a>
                      )}

                      {item.city && (
                        <span className="inline-flex items-center gap-1 text-slate-500 text-[11px]">
                          <MapPin size={12} />
                          <span>{item.city}</span>
                        </span>
                      )}
                    </div>

                    {/* Student Query / Message */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 leading-relaxed">
                      <span className="font-bold text-slate-600 block mb-1">
                        {activeInbox === "feedback"
                          ? item.subject || "Contact message"
                          : activeInbox === "grievances"
                            ? item.subject || "Student grievance"
                            : "Student Query / Requirement:"}
                      </span>
                      <p className="whitespace-pre-line text-slate-700">
                        {item.query ||
                          item.message ||
                          item.description ||
                          "Callback and admission guidance requested."}
                      </p>
                    </div>
                  </div>

                  {/* Right: Minimal read state for enquiries; workflow tools for other inboxes. */}
                  <div className="shrink-0 space-y-3 border-slate-100 pt-2 lg:w-72 lg:pt-0">
                    {activeInbox === "enquiries" ? (
                      <button
                        type="button"
                        onClick={() => handleReadChange(item)}
                        className={`inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                          item.isRead === true || item.read === true
                            ? "border-amber-200 bg-white text-amber-800 hover:bg-amber-50"
                            : "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                        }`}>
                        {item.isRead === true || item.read === true ? (
                          <>
                            <EyeOff size={14} />
                            Mark as unread
                          </>
                        ) : (
                          <>
                            <Eye size={14} />
                            Mark as read
                          </>
                        )}
                      </button>
                    ) : activeInbox !== "feedback" ? (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Update Status
                        </label>
                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            handleStatusChange(item.id, e.target.value)
                          }
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:outline-none focus:border-[#0066FF]">
                          {(activeInbox === "grievances"
                            ? ["new", "under-review", "resolved"]
                            : [
                                "new",
                                "in-progress",
                                "contacted",
                                "enrolled",
                                "closed",
                              ]
                          ).map((status) => (
                            <option key={status} value={status}>
                              {STATUS_CONFIG[status]?.label || status}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : null}

                    {/* Counselor / Staff Remarks */}
                    {activeInbox !== "feedback" && activeInbox !== "enquiries" && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          {activeInbox === "grievances"
                            ? "Admin Notes"
                            : "Staff Remarks & Notes"}
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="e.g. Called on 12th, visiting campus..."
                            value={noteValue}
                            onChange={(e) =>
                              setEditingNotes({
                                ...editingNotes,
                                [item.id]: e.target.value,
                              })
                            }
                            className="flex-1 px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#0066FF]"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveNote(item.id)}
                            disabled={savingNoteId === item.id}
                            className="px-2.5 py-1.5 rounded-xl bg-[#0066FF] text-white hover:bg-[#0052cc] text-xs font-semibold shrink-0 transition"
                            title="Save note">
                            <Save size={13} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Delete action */}
                    <div className="flex items-center justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.name)}
                        className="inline-flex items-center gap-1 text-[11px] text-red-500 hover:text-red-700 hover:underline">
                        <Trash2 size={12} />
                        <span>Delete Submission</span>
                      </button>
                    </div>
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
