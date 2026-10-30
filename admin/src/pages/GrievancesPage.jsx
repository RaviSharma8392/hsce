import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldAlert,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  FileSpreadsheet,
  Save,
  MessageCircle,
  Eye,
  ChevronLeft,
  X,
  UserCheck,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import {
  subscribeToGrievances,
  updateGrievanceStatus,
  deleteGrievance,
} from "../services/enquiryService";

const STATUS_CONFIG = {
  new: {
    label: "Under Investigation",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
  },
  "under-review": {
    label: "Under Committee Review",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
    dotClass: "bg-blue-500",
  },
  resolved: {
    label: "Grievance Resolved",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  closed: {
    label: "Closed / Archived",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    dotClass: "bg-slate-400",
  },
};

export default function GrievancesPage({ role = "staff" }) {
  const isPrincipal = role === "principal";
  const [grievanceList, setGrievanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notification, setNotification] = useState("");

  // Modal for Viewing Full Grievance Record
  const [selectedGrievance, setSelectedGrievance] = useState(null);

  // Per-grievance committee action note: { [id]: string }
  const [editingNotes, setEditingNotes] = useState({});
  const [savingNoteId, setSavingNoteId] = useState(null);

  // Subscribe to real-time student grievances
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToGrievances((list) => {
      setGrievanceList(list);
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
    return grievanceList.filter((item) => {
      if (statusFilter !== "all" && (item.status || "new") !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return [
          item.name,
          item.rollNo,
          item.phone,
          item.email,
          item.category,
          item.subject,
          item.description,
          item.grievanceId,
        ].some((val) => val && String(val).toLowerCase().includes(q));
      }
      return true;
    });
  }, [grievanceList, statusFilter, searchQuery]);

  // Statistics Counts
  const stats = useMemo(() => {
    const total = grievanceList.length;
    const pending = grievanceList.filter((g) => g.status === "new" || !g.status).length;
    const reviewing = grievanceList.filter((g) => g.status === "under-review").length;
    const resolved = grievanceList.filter((g) => g.status === "resolved").length;
    return { total, pending, reviewing, resolved };
  }, [grievanceList]);

  // Handle status update (Optimistic UI)
  const handleStatusChange = async (id, newStatus) => {
    const previous = [...grievanceList];
    setGrievanceList((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: newStatus } : g))
    );
    if (selectedGrievance && selectedGrievance.id === id) {
      setSelectedGrievance((prev) => ({ ...prev, status: newStatus }));
    }
    showToast(`Status updated to "${STATUS_CONFIG[newStatus]?.label || newStatus}"`);

    try {
      const item = grievanceList.find((g) => g.id === id);
      const notes = editingNotes[id] ?? item?.adminNotes ?? "";
      await updateGrievanceStatus(id, newStatus, notes);
    } catch (e) {
      console.error(e);
      setGrievanceList(previous);
      showToast("Error updating grievance status.");
    }
  };

  // Handle note save (Optimistic UI)
  const handleSaveNotes = async (id) => {
    setSavingNoteId(id);
    const noteText = editingNotes[id] ?? "";
    setGrievanceList((prev) =>
      prev.map((g) => (g.id === id ? { ...g, adminNotes: noteText } : g))
    );
    if (selectedGrievance && selectedGrievance.id === id) {
      setSelectedGrievance((prev) => ({ ...prev, adminNotes: noteText }));
    }
    showToast("Resolution note saved successfully.");

    try {
      const item = grievanceList.find((g) => g.id === id);
      await updateGrievanceStatus(id, item?.status || "new", noteText);
    } catch (e) {
      console.error(e);
      showToast("Error saving resolution note.");
    } finally {
      setSavingNoteId(null);
    }
  };

  // Handle delete (Optimistic UI)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this grievance complaint record?")) {
      return;
    }
    const previous = [...grievanceList];
    setGrievanceList((prev) => prev.filter((g) => g.id !== id));
    if (selectedGrievance && selectedGrievance.id === id) {
      setSelectedGrievance(null);
    }
    showToast("Grievance record removed.");

    try {
      await deleteGrievance(id);
    } catch (e) {
      console.error(e);
      setGrievanceList(previous);
      showToast("Error removing grievance record.");
    }
  };

  // Export CSV
  const exportToCSV = () => {
    if (grievanceList.length === 0) {
      alert("No grievances to export.");
      return;
    }

    const headers = [
      "Grievance ID",
      "Date Lodged",
      "Student Name",
      "Roll Number",
      "Phone",
      "Email",
      "Committee Cell",
      "Subject",
      "Complaint Description",
      "Resolution Status",
      "Committee Action Notes",
    ];

    const rows = filteredList.map((item) => [
      `"${item.grievanceId || item.id || ""}"`,
      `"${item.createdAtFormatted || ""}"`,
      `"${(item.name || "").replace(/"/g, '""')}"`,
      `"${item.rollNo || ""}"`,
      `"${item.phone || ""}"`,
      `"${item.email || ""}"`,
      `"${(item.category || "").replace(/"/g, '""')}"`,
      `"${(item.subject || "").replace(/"/g, '""')}"`,
      `"${(item.description || "").replace(/"/g, '""')}"`,
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
      `HSCE_Student_Grievances_${new Date().toISOString().split("T")[0]}.csv`
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
              <ShieldAlert className="text-[#363991]" size={26} />
              <span>Student Grievance Redressal</span>
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
              Statutory Compliance &bull; UGC / NCTE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Confidential redressal portal for student grievances, anti-ragging complaints, and academic cell submissions.
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
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Complaints</div>
          <div className="text-xl sm:text-3xl font-black text-slate-900 mt-0.5 sm:mt-1">{stats.total}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 truncate">Lodged grievances</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Under Investigation</div>
          <div className="text-xl sm:text-3xl font-black text-amber-600 mt-0.5 sm:mt-1">{stats.pending}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 truncate">New submissions</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Committee Review</div>
          <div className="text-xl sm:text-3xl font-black text-blue-600 mt-0.5 sm:mt-1">{stats.reviewing}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 truncate">Hearing in progress</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Resolved Cases</div>
          <div className="text-xl sm:text-3xl font-black text-emerald-600 mt-0.5 sm:mt-1">{stats.resolved}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 truncate">Redressal completed</div>
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
            placeholder="Search student name, roll number, grievance ID, subject..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-md outline-none focus:bg-white focus:border-[#363991] focus:ring-1 focus:ring-[#363991]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 shrink-0">
            <Filter size={14} className="text-slate-400" />
            <span>Status:</span>
          </div>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
            {["all", "new", "under-review", "resolved", "closed"].map((st) => (
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

      {/* Grievances List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200">
          <div className="h-8 w-8 rounded-full border-3 border-indigo-100 border-t-[#363991] animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading student grievances...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200 text-center px-4">
          <div className="p-3 bg-indigo-50 text-[#363991] rounded-md mb-3">
            <ShieldAlert size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No grievance complaints found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search criteria or filter to see more records."
              : "No student complaints or grievances have been lodged."}
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
                    <span className="font-mono text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                      {item.grievanceId || item.id}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Lodged {item.createdAtFormatted || "Recent"}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Roll No: {item.rollNo || "N/A"}
                    </span>
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
                      onClick={() => setSelectedGrievance(item)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      title="View Full Case Details">
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
                  {/* Column 1: Student Identity */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Complainant Details</div>
                    <div className="text-base font-bold text-slate-900">{item.name || "Anonymous Student"}</div>

                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Roll No:</span> {item.rollNo || "Not specified"}
                    </div>

                    {item.email && (
                      <div className="text-xs text-slate-600 flex items-center gap-1.5 truncate" title={item.email}>
                        <Mail size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate">{item.email}</span>
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

                  {/* Column 2: Grievance Cell & Subject */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Classification & Subject</div>
                    <div className="text-xs font-bold text-slate-800">
                      {item.subject || "Student Grievance Case"}
                    </div>

                    <div className="pt-0.5">
                      <span className="inline-block text-[11px] font-semibold bg-rose-50 text-rose-800 px-2 py-0.5 rounded border border-rose-200">
                        Cell: {item.category || "Grievance Committee"}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 line-clamp-3 mt-1.5">
                      {item.description || "No detailed description provided."}
                    </div>
                  </div>

                  {/* Column 3: Redressal Committee Action Notes */}
                  <div className="space-y-1.5 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Committee Action Notes</div>
                      <textarea
                        value={noteValue}
                        onChange={(e) =>
                          setEditingNotes((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                        placeholder="Enter committee hearings, counseling outcome, or formal resolution..."
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
                        <span>{savingNoteId === item.id ? "Saving…" : "Save Resolution"}</span>
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
      {selectedGrievance && (
        <div
          className="fixed inset-0 z-50 flex items-stretch justify-stretch p-0 bg-white sm:bg-slate-900/60 sm:backdrop-blur-sm sm:items-center sm:justify-center sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedGrievance(null)}
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
                  onClick={() => setSelectedGrievance(null)}
                  className="sm:hidden p-2 -ml-1 text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  aria-label="Back"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 border border-rose-100 hidden sm:flex items-center justify-center shrink-0">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">Grievance Investigation File</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">ID: {selectedGrievance.grievanceId || selectedGrievance.id}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedGrievance(null)}
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
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${STATUS_CONFIG[selectedGrievance.status || "new"]?.badgeClass
                      }`}>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${STATUS_CONFIG[selectedGrievance.status || "new"]?.dotClass
                        }`}
                    />
                    {STATUS_CONFIG[selectedGrievance.status || "new"]?.label || selectedGrievance.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  Lodged: {selectedGrievance.createdAtFormatted || "Recent"}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Student Full Name
                  </span>
                  <p className="text-sm font-bold text-slate-900">{selectedGrievance.name || "—"}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    College Roll Number
                  </span>
                  <p className="text-sm font-bold text-slate-900">{selectedGrievance.rollNo || "—"}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Contact Phone
                  </span>
                  <p className="text-sm font-bold text-slate-900">{selectedGrievance.phone || "—"}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Student Email
                  </span>
                  <p className="text-sm font-bold text-slate-900 break-all">{selectedGrievance.email || "—"}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white sm:col-span-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Committee Cell & Subject
                  </span>
                  <p className="text-sm font-bold text-[#363991]">
                    [{selectedGrievance.category || "Grievance Committee"}] {selectedGrievance.subject || "Complaint"}
                  </p>
                </div>
              </div>

              {/* Full Description */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Detailed Grievance Statement
                </span>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedGrievance.description || "No statement provided."}
                </p>
              </div>

              {/* Actions */}
              <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] bg-white sm:bg-transparent shadow-[0_-4px_16px_rgba(0,0,0,0.05)] sm:shadow-none -mx-4 -mb-4 sm:mx-0 sm:mb-0 px-4 sm:px-0">
                <div className="flex items-center gap-2 flex-1">
                  {selectedGrievance.phone && (
                    <>
                      <a
                        href={`tel:${selectedGrievance.phone}`}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#363991] text-white px-4 py-3 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:bg-[#282A70] transition"
                      >
                        <Phone size={14} />
                        <span>Call Student</span>
                      </a>
                      <a
                        href={`https://wa.me/91${selectedGrievance.phone.replace(/\D/g, "")}`}
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
                  onClick={() => setSelectedGrievance(null)}
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

