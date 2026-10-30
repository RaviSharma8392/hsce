import React, { useState, useEffect, useMemo } from "react";
import {
  GraduationCap,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Trash2,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
  ChevronDown,
  ChevronLeft,
  Save,
  ExternalLink,
  MessageCircle,
  Eye,
  EyeOff,
  X,
  Building,
  UserCheck,
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

export default function EnquiriesPage({ role = "staff" }) {
  const isPrincipal = role === "principal";
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [notification, setNotification] = useState("");

  // Modal for Viewing Full Enquiry Details
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Per-enquiry staff note editing: { [id]: string }
  const [editingNotes, setEditingNotes] = useState({});
  const [savingNoteId, setSavingNoteId] = useState(null);

  // Subscribe to real-time admission form enquiries
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToEnquiries((list) => {
      // Filter out chatbot messages - chatbot has its own dedicated page
      const admissionOnly = list.filter((item) => {
        const src = (item.source || "").toLowerCase();
        return !src.includes("chatbot");
      });
      setEnquiries(admissionOnly);
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
    return enquiries.filter((item) => {
      // Status Filter
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      // Course Filter
      if (courseFilter !== "all") {
        if (!item.course || !item.course.toLowerCase().includes(courseFilter.toLowerCase())) {
          return false;
        }
      }

      // Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return [
          item.name,
          item.phone,
          item.email,
          item.city,
          item.state,
          item.course,
          item.query,
          item.id,
        ].some((val) => val && String(val).toLowerCase().includes(q));
      }

      return true;
    });
  }, [enquiries, statusFilter, courseFilter, searchQuery]);

  // Statistics Counts
  const stats = useMemo(() => {
    const total = enquiries.length;
    const newLeads = enquiries.filter((e) => e.status === "new" || !e.status).length;
    const inProgress = enquiries.filter((e) => e.status === "in-progress" || e.status === "contacted").length;
    const enrolled = enquiries.filter((e) => e.status === "enrolled").length;
    return { total, newLeads, inProgress, enrolled };
  }, [enquiries]);

  // Handle status update (Optimistic UI)
  const handleStatusChange = async (id, newStatus) => {
    const previous = [...enquiries];
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
    }
    showToast(`Status updated to "${STATUS_CONFIG[newStatus]?.label || newStatus}"`);

    try {
      await updateEnquiry(id, { status: newStatus });
    } catch (e) {
      console.error("Status update error:", e);
      setEnquiries(previous);
      showToast("Failed to update status.");
    }
  };

  // Handle read toggle (Optimistic UI)
  const handleReadToggle = async (item) => {
    const isRead = !(item.isRead === true || item.read === true);
    setEnquiries((prev) =>
      prev.map((e) => (e.id === item.id ? { ...e, isRead, read: isRead } : e))
    );
    if (selectedEnquiry && selectedEnquiry.id === item.id) {
      setSelectedEnquiry((prev) => ({ ...prev, isRead, read: isRead }));
    }
    showToast(isRead ? "Marked as read." : "Marked as unread.");

    try {
      await updateEnquiry(item.id, { isRead });
    } catch (e) {
      console.error("Read status error:", e);
      showToast("Failed to update read status.");
    }
  };

  // Handle staff note save (Optimistic UI)
  const handleSaveNotes = async (id) => {
    setSavingNoteId(id);
    const noteText = editingNotes[id] ?? "";
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, staffNotes: noteText } : e))
    );
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry((prev) => ({ ...prev, staffNotes: noteText }));
    }
    showToast("Counseling notes saved successfully.");

    try {
      await updateEnquiry(id, { staffNotes: noteText });
    } catch (e) {
      console.error("Notes save error:", e);
      showToast("Failed to save note.");
    } finally {
      setSavingNoteId(null);
    }
  };

  // Handle delete (Optimistic UI)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this admission enquiry?")) {
      return;
    }
    const previous = [...enquiries];
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry(null);
    }
    showToast("Admission enquiry deleted.");

    try {
      await deleteEnquiry(id);
    } catch (e) {
      console.error("Delete enquiry error:", e);
      setEnquiries(previous);
      showToast("Failed to delete enquiry.");
    }
  };

  // Export CSV
  const exportToCSV = () => {
    if (enquiries.length === 0) {
      alert("No admission enquiries to export.");
      return;
    }

    const headers = [
      "Enquiry ID",
      "Date Received",
      "Candidate Name",
      "Phone",
      "Email",
      "Course of Interest",
      "City / Location",
      "Query Details",
      "Source",
      "Status",
      "Staff Notes",
    ];

    const rows = filteredList.map((item) => [
      `"${item.id || ""}"`,
      `"${item.createdAtFormatted || ""}"`,
      `"${(item.name || "").replace(/"/g, '""')}"`,
      `"${item.phone || ""}"`,
      `"${item.email || ""}"`,
      `"${(item.course || "").replace(/"/g, '""')}"`,
      `"${(item.city || "").replace(/"/g, '""')}"`,
      `"${(item.query || "").replace(/"/g, '""')}"`,
      `"${item.source || "admission_form"}"`,
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
      `HSCE_Admission_Enquiries_${new Date().toISOString().split("T")[0]}.csv`
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
              <GraduationCap className="text-[#363991]" size={26} />
              <span>Admission Form Enquiries</span>
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-[#363991] border border-indigo-100">
              B.Ed. Academic Session 2026-27
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time prospective student admission applications and website course enquiries.
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
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Form Leads</div>
          <div className="text-xl sm:text-3xl font-black text-slate-900 mt-0.5 sm:mt-1">{stats.total}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 truncate">Direct admission inquiries</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">New / Fresh Leads</div>
          <div className="text-xl sm:text-3xl font-black text-amber-600 mt-0.5 sm:mt-1">{stats.newLeads}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 truncate">Awaiting counselor callback</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">In Contact / Follow-up</div>
          <div className="text-xl sm:text-3xl font-black text-blue-600 mt-0.5 sm:mt-1">{stats.inProgress}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 truncate">Counseled or in progress</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled Candidates</div>
          <div className="text-xl sm:text-3xl font-black text-emerald-600 mt-0.5 sm:mt-1">{stats.enrolled}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 truncate">Confirmed B.Ed. registration</div>
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
            placeholder="Search candidate name, phone, email, city..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-md outline-none focus:bg-white focus:border-[#363991] focus:ring-1 focus:ring-[#363991]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 shrink-0">
            <Filter size={14} className="text-slate-400" />
            <span>Status:</span>
          </div>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
            {["all", "new", "in-progress", "contacted", "enrolled", "closed"].map((st) => (
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

      {/* Enquiries List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200">
          <div className="h-8 w-8 rounded-full border-3 border-indigo-100 border-t-[#363991] animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading admission form enquiries...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200 text-center px-4">
          <div className="p-3 bg-indigo-50 text-[#363991] rounded-md mb-3">
            <GraduationCap size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No admission enquiries found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search criteria or filter to see more enquiries."
              : "No admission applications have been submitted yet. New form submissions from the website will appear here in real-time."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((item) => {
            const currentStatus = item.status || "new";
            const cfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.new;
            const isRead = item.isRead === true || item.read === true;
            const noteValue = editingNotes[item.id] !== undefined ? editingNotes[item.id] : item.staffNotes || "";

            return (
              <div
                key={item.id}
                className={`rounded-xl border bg-white p-5 shadow-xs transition hover:border-slate-300 ${!isRead ? "border-l-4 border-l-[#363991] border-slate-200" : "border-slate-200"
                  }`}>
                {/* Top Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#363991] bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                      {item.id.length > 15 ? item.id.substring(0, 15) + "…" : item.id}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Received {item.createdAtFormatted || "Recent"}
                    </span>
                    {!isRead && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-900">
                        NEW
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-1">
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
                      onClick={() => handleReadToggle(item)}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${isRead
                          ? "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          : "text-blue-600 hover:bg-blue-50"
                        }`}
                      title={isRead ? "Mark as unread" : "Mark as read"}>
                      {isRead ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedEnquiry(item)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      title="View Full Enquiry Details">
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

                {/* Middle Info Cluster (3 Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                  {/* Column 1: Candidate & Contact */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate Details</div>
                    <div className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{item.name || "Anonymous Candidate"}</span>
                    </div>

                    {item.email && (
                      <div className="text-xs text-slate-600 flex items-center gap-1.5 truncate" title={item.email}>
                        <Mail size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate">{item.email}</span>
                      </div>
                    )}

                    {item.city && (
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400 shrink-0" />
                        <span>{item.city}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      {item.phone && (
                        <>
                          <a
                            href={`tel:${item.phone}`}
                            className="inline-flex items-center gap-1 text-[#363991] bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md border border-indigo-100 text-xs font-bold transition">
                            <Phone size={11} />
                            <span>{item.phone}</span>
                          </a>

                          <a
                            href={`https://wa.me/91${item.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                              `Hello ${item.name || "Candidate"}, thank you for applying to Haryana Shakti College of Education regarding B.Ed. admission.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 transition">
                            <MessageCircle size={11} />
                            <span>WhatsApp</span>
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Column 2: Programme & Query Source */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Applied Course & Source</div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <GraduationCap size={15} className="text-[#363991] shrink-0" />
                      <span>{item.course || "B.Ed. (2-Year Regular)"}</span>
                    </div>

                    <div className="pt-1">
                      <span className="inline-block text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
                        Source: {item.source ? item.source.replace(/_/g, " ").toUpperCase() : "ADMISSION MODAL"}
                      </span>
                    </div>

                    {item.query && (
                      <div className="pt-1 text-xs text-slate-600 line-clamp-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span className="font-semibold text-slate-700">Message / Request:</span> {item.query}
                      </div>
                    )}
                  </div>

                  {/* Column 3: Counselor Notes & Action */}
                  <div className="space-y-1.5 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Counselor Notes</div>
                      <textarea
                        value={noteValue}
                        onChange={(e) =>
                          setEditingNotes((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                        placeholder="Add notes about call outcome, student qualification, or counseling steps..."
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

      {/* ============================================================== */}
      {/* FULL ENQUIRY DETAILS MODAL - FULLSCREEN ON MOBILE              */}
      {/* ============================================================== */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-50 flex items-stretch justify-stretch p-0 bg-white sm:bg-slate-900/60 sm:backdrop-blur-sm sm:items-center sm:justify-center sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedEnquiry(null)}
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
                  onClick={() => setSelectedEnquiry(null)}
                  className="sm:hidden p-2 -ml-1 text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  aria-label="Back"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#363991] border border-indigo-100 hidden sm:flex items-center justify-center shrink-0">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">Admission Enquiry Details</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">ID: {selectedEnquiry.id}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200 transition cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-5 overflow-y-auto overscroll-contain flex-1 -webkit-overflow-scrolling-touch">
              {/* Status and Timestamp Bar */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs text-slate-500 font-medium">Status:</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${STATUS_CONFIG[selectedEnquiry.status || "new"]?.badgeClass
                      }`}>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${STATUS_CONFIG[selectedEnquiry.status || "new"]?.dotClass
                        }`}
                    />
                    {STATUS_CONFIG[selectedEnquiry.status || "new"]?.label || selectedEnquiry.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Submitted: {selectedEnquiry.createdAtFormatted || "Recent"}
                </div>
              </div>

              {/* Candidate Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Candidate Full Name
                  </span>
                  <p className="text-sm font-bold text-slate-900">{selectedEnquiry.name || "—"}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Phone Number
                  </span>
                  <p className="text-sm font-bold text-slate-900">{selectedEnquiry.phone || "—"}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Email Address
                  </span>
                  <p className="text-sm font-bold text-slate-900 break-all">{selectedEnquiry.email || "—"}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Location / City
                  </span>
                  <p className="text-sm font-bold text-slate-900">{selectedEnquiry.city || "—"}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white sm:col-span-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Programme Applied For
                  </span>
                  <p className="text-sm font-bold text-[#363991] flex items-center gap-1.5">
                    <GraduationCap size={16} />
                    <span>{selectedEnquiry.course || "B.Ed. (2-Year Regular)"}</span>
                  </p>
                </div>
              </div>

              {/* Inquiry Message */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Application Note / Query Message
                </span>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.query || "No query message provided."}
                </p>
              </div>

              {/* Counselor Action Strip */}
              <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] bg-white sm:bg-transparent shadow-[0_-4px_16px_rgba(0,0,0,0.05)] sm:shadow-none -mx-4 -mb-4 sm:mx-0 sm:mb-0 px-4 sm:px-0">
                <div className="flex items-center gap-2 flex-1">
                  {selectedEnquiry.phone && (
                    <>
                      <a
                        href={`tel:${selectedEnquiry.phone}`}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#363991] text-white px-4 py-3 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:bg-[#282A70] transition"
                      >
                        <Phone size={14} />
                        <span>Call Student</span>
                      </a>
                      <a
                        href={`https://wa.me/91${selectedEnquiry.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-emerald-600 text-white px-4 py-3 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:bg-emerald-700 transition"
                      >
                        <MessageCircle size={14} />
                        <span>WhatsApp</span>
                      </a>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
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
