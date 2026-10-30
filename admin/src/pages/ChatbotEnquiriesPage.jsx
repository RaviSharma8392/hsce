import React, { useState, useEffect, useMemo } from "react";
import {
  Bot,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Trash2,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
  Save,
  MessageCircle,
  Eye,
  EyeOff,
  ChevronLeft,
  X,
  UserCheck,
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
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
  },
  "in-progress": {
    label: "In Progress",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
    dotClass: "bg-blue-500",
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
};

export default function ChatbotEnquiriesPage({ role = "staff" }) {
  const isPrincipal = role === "principal";
  const [allEnquiries, setAllEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all");
  const [notification, setNotification] = useState("");

  // Modal for Viewing Full Chatbot Lead Details
  const [selectedLead, setSelectedLead] = useState(null);

  // Per-enquiry staff note editing: { [id]: string }
  const [editingNotes, setEditingNotes] = useState({});
  const [savingNoteId, setSavingNoteId] = useState(null);

  // Subscribe to real-time enquiries
  useEffect(() => {
    setLoading(true);
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

  // Filtered List
  const filteredList = useMemo(() => {
    return chatbotLeads.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      const isRead = item.isRead === true || item.read === true;
      if (readFilter === "unread" && isRead) return false;
      if (readFilter === "read" && !isRead) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const candName = (item.name || "").toLowerCase();
        const phone = (item.phone || "").toLowerCase();
        const email = (item.email || "").toLowerCase();
        const city = (item.city || "").toLowerCase();
        const course = (item.course || "").toLowerCase();
        const queryText = (item.query || "").toLowerCase();
        const notes = (item.staffNotes || "").toLowerCase();

        return (
          candName.includes(q) ||
          phone.includes(q) ||
          email.includes(q) ||
          city.includes(q) ||
          course.includes(q) ||
          queryText.includes(q) ||
          notes.includes(q)
        );
      }
      return true;
    });
  }, [chatbotLeads, statusFilter, readFilter, searchQuery]);

  // Statistics Counts
  const stats = useMemo(() => {
    const total = chatbotLeads.length;
    const newCount = chatbotLeads.filter(
      (item) => item.status === "new" || !item.status
    ).length;
    const inProgress = chatbotLeads.filter(
      (item) => item.status === "in-progress" || item.status === "contacted"
    ).length;
    const enrolled = chatbotLeads.filter(
      (item) => item.status === "enrolled"
    ).length;
    return { total, newCount, inProgress, enrolled };
  }, [chatbotLeads]);

  // Handle status update (Optimistic UI)
  const handleStatusChange = async (id, newStatus) => {
    const previous = [...allEnquiries];
    setAllEnquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead((prev) => ({ ...prev, status: newStatus }));
    }
    showToast(
      `Status updated to "${STATUS_CONFIG[newStatus]?.label || newStatus}"`
    );

    try {
      await updateEnquiry(id, { status: newStatus });
    } catch (err) {
      console.error(err);
      setAllEnquiries(previous);
      showToast("Error updating status.");
    }
  };

  // Handle read toggle (Optimistic UI)
  const handleReadToggle = async (item) => {
    const currentRead = item.isRead === true || item.read === true;
    const newRead = !currentRead;
    setAllEnquiries((prev) =>
      prev.map((e) =>
        e.id === item.id ? { ...e, isRead: newRead, read: newRead } : e
      )
    );
    if (selectedLead && selectedLead.id === item.id) {
      setSelectedLead((prev) => ({ ...prev, isRead: newRead, read: newRead }));
    }
    showToast(newRead ? "Marked as read." : "Marked as unread.");

    try {
      await updateEnquiry(item.id, { isRead: newRead });
    } catch (err) {
      console.error(err);
      showToast("Error updating read status.");
    }
  };

  // Handle Staff Follow-up Notes Save (Optimistic UI)
  const handleSaveNotes = async (id) => {
    setSavingNoteId(id);
    const notes = editingNotes[id] ?? "";
    setAllEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, staffNotes: notes } : e))
    );
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead((prev) => ({ ...prev, staffNotes: notes }));
    }
    showToast("Staff notes saved successfully.");

    try {
      await updateEnquiry(id, { staffNotes: notes });
    } catch (err) {
      console.error(err);
      showToast("Error saving staff notes.");
    } finally {
      setSavingNoteId(null);
    }
  };

  // Handle Delete (Optimistic UI)
  const handleDelete = async (id, name) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the enquiry from "${name || "Student"}"? This action cannot be undone.`
      )
    ) {
      return;
    }
    const previous = [...allEnquiries];
    setAllEnquiries((prev) => prev.filter((e) => e.id !== id));
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead(null);
    }
    showToast("Enquiry deleted successfully.");

    try {
      await deleteEnquiry(id);
    } catch (e) {
      console.error("Delete enquiry error:", e);
      setAllEnquiries(previous);
      showToast("Failed to delete enquiry.");
    }
  };

  // Export CSV
  const exportToCSV = () => {
    if (chatbotLeads.length === 0) {
      alert("No chatbot leads to export.");
      return;
    }

    const headers = [
      "Lead ID",
      "Date Received",
      "Candidate Name",
      "Phone",
      "Email",
      "Course of Interest",
      "City / Location",
      "Question / Student Message",
      "Status",
      "Staff Notes",
    ];

    const rows = filteredList.map((item) => [
      `"${item.id || ""}"`,
      `"${item.createdAtFormatted || ""}"`,
      `"${(item.name || "").replace(/"/g, '""')}"`,
      `"${item.phone || ""}"`,
      `"${item.email || ""}"`,
      `"${(item.course || "B.Ed.").replace(/"/g, '""')}"`,
      `"${(item.city || "").replace(/"/g, '""')}"`,
      `"${(item.query || "").replace(/"/g, '""')}"`,
      `"${item.status || "new"}"`,
      `"${(item.staffNotes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `HSCE_Chatbot_Enquiries_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported CSV file successfully.");
  };

  return (
    <div className="academic-admin-page space-y-5 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Page Header (Matching CampusToursPage design) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-200 bg-white p-4 sm:p-6 rounded-none sm:rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Bot className="text-[#363991]" size={26} />
              <span>Website Chatbot Enquiries</span>
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-[#363991] border border-indigo-100">
              B.Ed. Academic Session 2026-27
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time candidate questions and callback requests captured by the website virtual assistant.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition cursor-pointer">
            <FileSpreadsheet size={15} className="text-emerald-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards (Matching CampusToursPage) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Chatbot Leads
          </div>
          <div className="text-xl sm:text-3xl font-black text-slate-900 mt-0.5 sm:mt-1">
            {stats.total}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 truncate">All time chat inquiries</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            New Leads
          </div>
          <div className="text-xl sm:text-3xl font-black text-amber-600 mt-0.5 sm:mt-1">
            {stats.newCount}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 truncate">Awaiting staff response</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            In Follow-Up
          </div>
          <div className="text-xl sm:text-3xl font-black text-blue-600 mt-0.5 sm:mt-1">
            {stats.inProgress}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 truncate">Contacted / In counseling</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Enrolled Candidates
          </div>
          <div className="text-xl sm:text-3xl font-black text-emerald-600 mt-0.5 sm:mt-1">
            {stats.enrolled}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 truncate">Successfully enrolled</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate, phone, email, query, notes..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-md outline-none focus:bg-white focus:border-[#363991] focus:ring-1 focus:ring-[#363991]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 shrink-0">
            <Filter size={14} className="text-slate-400" />
            <span>Status:</span>
          </div>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
            {["all", "new", "in-progress", "contacted", "enrolled", "closed"].map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${statusFilter === st
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                    }`}>
                  {st === "all" ? "All" : STATUS_CONFIG[st]?.label || st}
                </button>
              )
            )}
          </div>

          <select
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-100 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700 outline-none focus:border-[#363991] cursor-pointer">
            <option value="all">All Read States</option>
            <option value="unread">Unread Only</option>
            <option value="read">Read Only</option>
          </select>
        </div>
      </div>

      {/* Leads List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200">
          <div className="h-8 w-8 rounded-full border-3 border-indigo-100 border-t-[#363991] animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-600">
            Loading chatbot leads...
          </p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200 text-center px-4">
          <div className="p-3 bg-indigo-50 text-[#363991] rounded-md mb-3">
            <Bot size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No chatbot leads found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1">
            {searchQuery || statusFilter !== "all" || readFilter !== "all"
              ? "Try adjusting your search criteria or filters to see more leads."
              : "No enquiries have been submitted through the chatbot virtual assistant yet. New leads will appear here automatically."}
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
                : item.staffNotes || "";
            const isRead = item.isRead === true || item.read === true;
            const refCode =
              item.referenceId ||
              `HSCE-CHAT-${(item.id || "").slice(-5).toUpperCase()}`;

            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition">
                {/* Top Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs font-bold text-[#363991] bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                      {refCode}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Received {item.createdAtFormatted || "Recently"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleReadToggle(item)}
                      title={isRead ? "Mark as unread" : "Mark as read"}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border transition cursor-pointer ${isRead
                        ? "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                        : "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                        }`}>
                      {isRead ? (
                        <>
                          <EyeOff size={11} />
                          <span>Read</span>
                        </>
                      ) : (
                        <>
                          <Eye size={11} />
                          <span>Unread</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.badgeClass}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotClass}`} />
                      {cfg.label}
                    </span>

                    <select
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 outline-none focus:border-[#363991] cursor-pointer">
                      {Object.keys(STATUS_CONFIG).map((key) => (
                        <option key={key} value={key}>
                          Set: {STATUS_CONFIG[key].label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setSelectedLead(item)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      title="View Full Lead Details">
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Delete Record">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Middle Info Cluster (3 Columns matching CampusToursPage) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                  {/* Column 1: Candidate Contact Info */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Prospective Candidate
                    </div>
                    <div className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{item.name || "Prospective Student"}</span>
                    </div>

                    {item.email && (
                      <div className="text-xs text-slate-600 flex items-center gap-1 truncate">
                        <Mail size={12} className="text-slate-400 shrink-0" />
                        <a
                          href={`mailto:${item.email}`}
                          className="hover:underline hover:text-[#363991] truncate">
                          {item.email}
                        </a>
                      </div>
                    )}

                    {item.city && (
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400 shrink-0" />
                        <span>{item.city}</span>
                      </div>
                    )}

                    {item.phone ? (
                      <div className="flex items-center gap-2 pt-1.5 flex-wrap">
                        <a
                          href={`tel:${item.phone}`}
                          className="inline-flex items-center gap-1 text-[#363991] bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md border border-indigo-100 text-xs font-bold transition">
                          <Phone size={11} />
                          <span>{item.phone}</span>
                        </a>

                        <a
                          href={`https://wa.me/91${item.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                            `Hello ${item.name || "Student"}, greetings from Haryana Shakti College of Education regarding your query: "${item.query || "B.Ed. Admission"}". How may we assist you?`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 transition">
                          <MessageCircle size={11} />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic pt-1">
                        No phone provided
                      </div>
                    )}
                  </div>

                  {/* Column 2: Chatbot Query / Question Asked */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <HelpCircle size={13} className="text-indigo-500" />
                      <span>Question / Inquiry</span>
                    </div>

                    <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      <GraduationCap size={13} className="mr-1 text-slate-500" />
                      <span>{item.course || "B.Ed. (Bachelor of Education)"}</span>
                    </div>

                    <div className="bg-amber-50/70 rounded-lg p-2.5 border border-amber-200/70 text-xs text-slate-800 leading-relaxed font-medium">
                      "{item.query || "Candidate requested callback and admission guidance."}"
                    </div>
                  </div>

                  {/* Column 3: Lead Source & System Info */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Lead Details
                    </div>

                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Source:</span>{" "}
                      Website Chatbot Assistant
                    </div>

                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Read State:</span>{" "}
                      {isRead ? (
                        <span className="text-emerald-700 font-bold">Read</span>
                      ) : (
                        <span className="text-amber-700 font-bold">Unread</span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-1 pt-1">
                      <Clock size={12} className="text-slate-400" />
                      <span>{item.createdAtFormatted || "Recent submission"}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Staff Notes Strip */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                      Staff Notes:
                    </span>
                    <input
                      type="text"
                      value={noteValue}
                      onChange={(e) =>
                        setEditingNotes((prev) => ({
                          ...prev,
                          [item.id]: e.target.value,
                        }))
                      }
                      placeholder="Add counseling notes (e.g. Called student, confirmed eligibility, sent prospectus)..."
                      className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-800 outline-none focus:bg-white focus:border-[#363991]"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveNotes(item.id)}
                      disabled={savingNoteId === item.id}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-black text-white text-xs font-semibold shadow-2xs transition disabled:opacity-50 cursor-pointer">
                      <Save size={12} />
                      <span>{savingNoteId === item.id ? "Saving..." : "Save"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL DETAIL MODAL - FULLSCREEN ON MOBILE */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-stretch justify-stretch p-0 bg-white sm:bg-slate-900/60 sm:backdrop-blur-sm sm:items-center sm:justify-center sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="relative w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] sm:h-auto sm:max-w-2xl sm:max-h-[90vh] bg-white rounded-none sm:rounded-2xl shadow-none sm:shadow-2xl border-0 sm:border border-slate-200 overflow-hidden flex flex-col animate-in fade-in sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-4 sm:px-6 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 sm:py-4 border-b border-slate-100 bg-white sm:bg-slate-50/90 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="sm:hidden p-2 -ml-1 text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  aria-label="Back"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#363991] border border-indigo-100 hidden sm:flex items-center justify-center shrink-0">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    Chatbot Lead Details
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Reference:{" "}
                    <span className="font-mono font-bold text-[#363991]">
                      {selectedLead.referenceId ||
                        `HSCE-CHAT-${(selectedLead.id || "").slice(-5).toUpperCase()}`}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200 transition cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-5 overflow-y-auto overscroll-contain flex-1 -webkit-overflow-scrolling-touch">
              {/* Status & Timestamp */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-xs text-slate-500 block">Current Status</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mt-1 ${STATUS_CONFIG[selectedLead.status || "new"]?.badgeClass
                      }`}>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${STATUS_CONFIG[selectedLead.status || "new"]?.dotClass
                        }`}
                    />
                    {STATUS_CONFIG[selectedLead.status || "new"]?.label}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Submitted On</span>
                  <span className="text-xs font-bold text-slate-800 mt-1 block">
                    {selectedLead.createdAtFormatted || "Recent submission"}
                  </span>
                </div>
              </div>

              {/* Candidate Info */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Prospective Candidate Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 block">Full Name:</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedLead.name || "Prospective Student"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Course of Interest:</span>
                    <span className="font-bold text-slate-800">
                      {selectedLead.course || "B.Ed. (Bachelor of Education)"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Phone Number:</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {selectedLead.phone || "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Email Address:</span>
                    <span className="font-bold text-slate-900 truncate block">
                      {selectedLead.email || "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">City / State:</span>
                    <span className="font-bold text-slate-800">
                      {selectedLead.city || "Delhi NCR"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Lead Source:</span>
                    <span className="font-bold text-slate-800">
                      Website Virtual Assistant Chatbot
                    </span>
                  </div>
                </div>
              </div>

              {/* Full Question / Message */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Question / Student Message
                </h4>
                <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">
                  {selectedLead.query ||
                    "Candidate requested callback and admission guidance."}
                </div>
              </div>

              {/* Quick Communication Actions */}
              {selectedLead.phone && (
                <div className="flex items-center gap-3 pt-1">
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-[#363991] text-xs font-bold hover:bg-indigo-100 transition">
                    <Phone size={14} />
                    <span>Call Candidate</span>
                  </a>

                  <a
                    href={`https://wa.me/91${selectedLead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Hello ${selectedLead.name || "Student"}, greetings from Haryana Shakti College of Education regarding your enquiry: "${selectedLead.query || "B.Ed. Admission"}". How may we assist you?`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition">
                    <MessageCircle size={14} />
                    <span>WhatsApp Chat</span>
                  </a>

                  {selectedLead.email && (
                    <a
                      href={`mailto:${selectedLead.email}?subject=${encodeURIComponent("B.Ed. Admission Enquiry - Haryana Shakti College of Education")}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-200 transition">
                      <Mail size={14} />
                      <span>Send Email</span>
                    </a>
                  )}
                </div>
              )}

              {/* Status Update In Modal */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Update Lead Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {Object.keys(STATUS_CONFIG).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedLead.id, st)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition text-center cursor-pointer ${(selectedLead.status || "new") === st
                        ? "bg-[#363991] text-white border-[#363991] shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}>
                      {STATUS_CONFIG[st].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="shrink-0 p-4 bg-white sm:bg-slate-50 border-t border-slate-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] sm:shadow-none flex items-center justify-end pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs sm:text-sm transition cursor-pointer text-center"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
