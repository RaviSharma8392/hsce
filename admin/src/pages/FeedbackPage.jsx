import React, { useState, useEffect, useMemo } from "react";
import {
  MessageSquareText,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  Trash2,
  FileSpreadsheet,
  Save,
  MessageCircle,
  Eye,
  ChevronLeft,
  X,
  Star,
  Globe,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import {
  subscribeToFeedback,
  updateFeedbackStatus,
  deleteFeedback,
} from "../services/enquiryService";

const STATUS_CONFIG = {
  new: {
    label: "New Message",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
  },
  reviewed: {
    label: "Reviewed",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
    dotClass: "bg-blue-500",
  },
  responded: {
    label: "Responded",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  closed: {
    label: "Archived",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    dotClass: "bg-slate-400",
  },
};

export default function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [notification, setNotification] = useState("");

  // Modal for Viewing Full Feedback Details
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Per-feedback admin note editing: { [id]: string }
  const [editingNotes, setEditingNotes] = useState({});
  const [savingNoteId, setSavingNoteId] = useState(null);

  // Subscribe to real-time contact feedback
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToFeedback((list) => {
      setFeedbackList(list);
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

  // Filtered List
  const filteredList = useMemo(() => {
    return feedbackList.filter((item) => {
      if (statusFilter !== "all" && (item.status || "new") !== statusFilter) {
        return false;
      }
      if (categoryFilter !== "all") {
        if (!item.category || !item.category.toLowerCase().includes(categoryFilter.toLowerCase())) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return [
          item.name,
          item.phone,
          item.email,
          item.subject,
          item.message,
          item.feedbackId,
          item.profession,
          item.category,
        ].some((val) => val && String(val).toLowerCase().includes(q));
      }
      return true;
    });
  }, [feedbackList, statusFilter, categoryFilter, searchQuery]);

  // Statistics Counts
  const stats = useMemo(() => {
    const total = feedbackList.length;
    const newCount = feedbackList.filter((f) => f.status === "new" || !f.status).length;
    const responded = feedbackList.filter((f) => f.status === "responded").length;
    const highRated = feedbackList.filter((f) => (f.siteRating || "").toLowerCase().includes("excellent")).length;
    return { total, newCount, responded, highRated };
  }, [feedbackList]);

  // Handle status update (Optimistic UI)
  const handleStatusChange = async (id, newStatus) => {
    const previous = [...feedbackList];
    setFeedbackList((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );
    if (selectedFeedback && selectedFeedback.id === id) {
      setSelectedFeedback((prev) => ({ ...prev, status: newStatus }));
    }
    showToast(`Status updated to "${STATUS_CONFIG[newStatus]?.label || newStatus}"`);

    try {
      const item = feedbackList.find((f) => f.id === id);
      const notes = editingNotes[id] ?? item?.adminNotes ?? "";
      await updateFeedbackStatus(id, newStatus, notes);
    } catch (e) {
      console.error(e);
      setFeedbackList(previous);
      showToast("Error updating feedback status.");
    }
  };

  // Handle note save (Optimistic UI)
  const handleSaveNotes = async (id) => {
    setSavingNoteId(id);
    const noteText = editingNotes[id] ?? "";
    setFeedbackList((prev) =>
      prev.map((f) => (f.id === id ? { ...f, adminNotes: noteText } : f))
    );
    if (selectedFeedback && selectedFeedback.id === id) {
      setSelectedFeedback((prev) => ({ ...prev, adminNotes: noteText }));
    }
    showToast("Response note saved successfully.");

    try {
      const item = feedbackList.find((f) => f.id === id);
      await updateFeedbackStatus(id, item?.status || "new", noteText);
    } catch (e) {
      console.error(e);
      showToast("Error saving note.");
    } finally {
      setSavingNoteId(null);
    }
  };

  // Handle delete (Optimistic UI)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this feedback message?")) {
      return;
    }
    const previous = [...feedbackList];
    setFeedbackList((prev) => prev.filter((f) => f.id !== id));
    if (selectedFeedback && selectedFeedback.id === id) {
      setSelectedFeedback(null);
    }
    showToast("Feedback record deleted.");

    try {
      await deleteFeedback(id);
    } catch (e) {
      console.error(e);
      setFeedbackList(previous);
      showToast("Error deleting feedback.");
    }
  };

  // Export CSV
  const exportToCSV = () => {
    if (feedbackList.length === 0) {
      alert("No feedback messages to export.");
      return;
    }

    const headers = [
      "Feedback ID",
      "Date",
      "Sender Name",
      "Phone",
      "Email",
      "Profession",
      "Category",
      "Subject",
      "Site Rating",
      "Message",
      "Status",
      "Admin Notes",
    ];

    const rows = filteredList.map((item) => [
      `"${item.feedbackId || item.id || ""}"`,
      `"${item.createdAtFormatted || ""}"`,
      `"${(item.name || "").replace(/"/g, '""')}"`,
      `"${item.phone || ""}"`,
      `"${item.email || ""}"`,
      `"${(item.profession || "").replace(/"/g, '""')}"`,
      `"${(item.category || "").replace(/"/g, '""')}"`,
      `"${(item.subject || "").replace(/"/g, '""')}"`,
      `"${item.siteRating || ""}"`,
      `"${(item.message || "").replace(/"/g, '""')}"`,
      `"${item.status || "new"}"`,
      `"${(item.adminNotes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `HSCE_Contact_Feedback_${new Date().toISOString().split("T")[0]}.csv`
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

      {/* Page Header (CampusToursPage Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-200 bg-white p-4 sm:p-6 rounded-none sm:rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <MessageSquareText className="text-[#363991]" size={26} />
              <span>Contact Feedback & Guestbook</span>
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-[#363991] border border-indigo-100">
              Visitor Desk &bull; Session 2026-27
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            General website feedback, guestbook entries, public suggestions, and visitor ratings.
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

      {/* KPI Stats Cards (CampusToursPage Style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Feedback</div>
          <div className="text-xl sm:text-3xl font-black text-slate-900 mt-0.5 sm:mt-1">{stats.total}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 truncate">All visitor submissions</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">New Unread</div>
          <div className="text-xl sm:text-3xl font-black text-amber-600 mt-0.5 sm:mt-1">{stats.newCount}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 truncate">Needs review by staff</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Responded / Actioned</div>
          <div className="text-xl sm:text-3xl font-black text-blue-600 mt-0.5 sm:mt-1">{stats.responded}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 truncate">Replies sent to visitor</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Top Rated Reviews</div>
          <div className="text-xl sm:text-3xl font-black text-emerald-600 mt-0.5 sm:mt-1">{stats.highRated}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 truncate">Excellent campus ratings</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search visitor name, subject, phone, email, message..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-md outline-none focus:bg-white focus:border-[#363991] focus:ring-1 focus:ring-[#363991]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 shrink-0">
            <Filter size={14} className="text-slate-400" />
            <span>Status:</span>
          </div>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
            {["all", "new", "reviewed", "responded", "closed"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${statusFilter === st
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                  }`}>
                {st === "all" ? "All" : STATUS_CONFIG[st]?.label || st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200">
          <div className="h-8 w-8 rounded-full border-3 border-indigo-100 border-t-[#363991] animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading contact feedback messages...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200 text-center px-4">
          <div className="p-3 bg-indigo-50 text-[#363991] rounded-md mb-3">
            <MessageSquareText size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No feedback messages found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search query or status filter."
              : "No feedback or guestbook messages have been received yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((item) => {
            const currentStatus = item.status || "new";
            const cfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.new;
            const noteValue = editingNotes[item.id] !== undefined ? editingNotes[item.id] : item.adminNotes || "";

            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition">
                {/* Top Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#363991] bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                      {item.feedbackId || item.id}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Received {item.createdAtFormatted || "Recent"}
                    </span>
                    {item.siteRating && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span>Rating: {item.siteRating}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.badgeClass}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotClass}`} />
                      {cfg.label}
                    </span>

                    <select
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 outline-none focus:border-[#363991]">
                      {Object.keys(STATUS_CONFIG).map((key) => (
                        <option key={key} value={key}>
                          Set: {STATUS_CONFIG[key].label}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setSelectedFeedback(item)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      title="View Full Details">
                      <ExternalLink size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Delete Record">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Middle Info Cluster */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                  {/* Column 1: Sender Profile */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visitor Profile</div>
                    <div className="text-base font-bold text-slate-900">{item.name || "Anonymous Visitor"}</div>

                    {item.profession && (
                      <div className="text-xs text-slate-600 flex items-center gap-1.5">
                        <Briefcase size={12} className="text-slate-400 shrink-0" />
                        <span>{item.profession}</span>
                      </div>
                    )}

                    {item.email && (
                      <div className="text-xs text-slate-600 flex items-center gap-1.5 truncate" title={item.email}>
                        <Mail size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate">{item.email}</span>
                      </div>
                    )}

                    {item.websiteAddress && (
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                        <Globe size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate">{item.websiteAddress}</span>
                      </div>
                    )}

                    {item.phone && (
                      <div className="flex items-center gap-2 pt-2">
                        <a
                          href={`tel:${item.phone}`}
                          className="inline-flex items-center gap-1 text-[#363991] bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md border border-indigo-100 text-xs font-bold transition">
                          <Phone size={11} />
                          <span>{item.phone}</span>
                        </a>

                        <a
                          href={`https://wa.me/91${item.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 transition">
                          <MessageCircle size={11} />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Column 2: Subject & Message Body */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Message Details</div>
                    <div className="text-xs font-bold text-slate-800">
                      {item.subject || "General Inquiry / Feedback"}
                    </div>

                    <div className="pt-0.5">
                      <span className="inline-block text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        Category: {item.category || "General"}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 line-clamp-3 mt-1.5">
                      {item.message || "No text provided."}
                    </div>
                  </div>

                  {/* Column 3: Response / Administrative Notes */}
                  <div className="space-y-1.5 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Administrative Notes</div>
                      <textarea
                        value={noteValue}
                        onChange={(e) =>
                          setEditingNotes((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                        placeholder="Write follow-up notes, response status, or internal actions taken..."
                        rows={3}
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-[#363991] focus:ring-1 focus:ring-[#363991] resize-none mt-1"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        disabled={savingNoteId === item.id}
                        onClick={() => handleSaveNotes(item.id)}
                        className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-2xs cursor-pointer disabled:opacity-50">
                        <Save size={12} />
                        <span>{savingNoteId === item.id ? "Saving…" : "Save Note"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL DETAILS MODAL - FULLSCREEN ON MOBILE */}
      {selectedFeedback && (
        <div
          className="fixed inset-0 z-50 flex items-stretch justify-stretch p-0 bg-white sm:bg-slate-900/60 sm:backdrop-blur-sm sm:items-center sm:justify-center sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedFeedback(null)}
        >
          <div
            className="relative w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] sm:h-auto sm:max-w-2xl sm:max-h-[90vh] bg-white rounded-none sm:rounded-2xl shadow-none sm:shadow-2xl border-0 sm:border border-slate-200 overflow-hidden flex flex-col animate-in fade-in sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-4 sm:px-6 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 sm:py-4 border-b border-slate-100 bg-white sm:bg-slate-50/90 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedFeedback(null)}
                  className="sm:hidden p-2 -ml-1 text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  aria-label="Back"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#363991] border border-indigo-100 hidden sm:flex items-center justify-center shrink-0">
                  <MessageSquareText size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">Contact Message Details</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">ID: {selectedFeedback.feedbackId || selectedFeedback.id}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFeedback(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200 transition cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-5 overflow-y-auto overscroll-contain flex-1 -webkit-overflow-scrolling-touch">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Status:</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${STATUS_CONFIG[selectedFeedback.status || "new"]?.badgeClass
                      }`}>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${STATUS_CONFIG[selectedFeedback.status || "new"]?.dotClass
                        }`}
                    />
                    {STATUS_CONFIG[selectedFeedback.status || "new"]?.label || selectedFeedback.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Received: {selectedFeedback.createdAtFormatted || "Recent"}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Visitor Full Name
                  </span>
                  <p className="text-sm font-bold text-slate-900">{selectedFeedback.name || "—"}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Profession / Role
                  </span>
                  <p className="text-sm font-bold text-slate-900">{selectedFeedback.profession || "—"}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Phone Number
                  </span>
                  <p className="text-sm font-bold text-slate-900">{selectedFeedback.phone || "—"}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Email Address
                  </span>
                  <p className="text-sm font-bold text-slate-900 break-all">{selectedFeedback.email || "—"}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white sm:col-span-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Subject & Category
                  </span>
                  <p className="text-sm font-bold text-[#363991]">
                    [{selectedFeedback.category || "General"}] {selectedFeedback.subject || "Feedback"}
                  </p>
                </div>
              </div>

              {/* Full Message */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Complete Visitor Message
                </span>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedFeedback.message || "No text provided."}
                </p>
              </div>

              {/* Actions */}
              <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] bg-white sm:bg-transparent shadow-[0_-4px_16px_rgba(0,0,0,0.05)] sm:shadow-none -mx-4 -mb-4 sm:mx-0 sm:mb-0 px-4 sm:px-0">
                <div className="flex items-center gap-2 flex-1 flex-wrap sm:flex-nowrap">
                  {selectedFeedback.phone && (
                    <>
                      <a
                        href={`tel:${selectedFeedback.phone}`}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#363991] text-white px-4 py-3 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:bg-[#282A70] transition"
                      >
                        <Phone size={14} />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/91${selectedFeedback.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-emerald-600 text-white px-4 py-3 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:bg-emerald-700 transition"
                      >
                        <MessageCircle size={14} />
                        <span>WhatsApp</span>
                      </a>
                    </>
                  )}
                  {selectedFeedback.email && (
                    <a
                      href={`mailto:${selectedFeedback.email}?subject=Regarding your message to Haryana Shakti College`}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 border border-slate-300 text-slate-700 px-4 py-3 sm:py-2 rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-50 transition"
                    >
                      <Mail size={14} />
                      <span>Email</span>
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFeedback(null)}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer text-center"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

