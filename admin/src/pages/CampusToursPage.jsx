import React, { useState, useEffect, useMemo } from "react";
import {
  Compass,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  Users,
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
  X,
  Building,
  UserCheck,
} from "lucide-react";
import {
  subscribeToTours,
  updateTourStatus,
  deleteTour,
} from "../services/tourService";

const STATUS_CONFIG = {
  pending: {
    label: "Pending Review",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
  },
  confirmed: {
    label: "Confirmed Visit",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  completed: {
    label: "Completed Tour",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
    dotClass: "bg-blue-500",
  },
  rescheduled: {
    label: "Rescheduled",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
    dotClass: "bg-purple-500",
  },
  cancelled: {
    label: "Cancelled",
    badgeClass: "bg-rose-100 text-rose-800 border-rose-200",
    dotClass: "bg-rose-500",
  },
};

const LAB_LABELS = {
  curriculum_labs: "Curriculum Science & Math Labs",
  psychology_lab: "Educational Psychology Lab",
  ict_center: "ICT Computer Centre",
  library: "Academic Library & Reading Hall",
  art_craft: "Art & Craft Studio",
  seminar_hall: "Multipurpose Seminar Hall",
  principal_desk: "Principal & Faculty Consultation",
};

export default function CampusToursPage({ currentUser, role = "staff" }) {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notification, setNotification] = useState("");

  // Modal for Viewing Full Booking Details
  const [selectedTour, setSelectedTour] = useState(null);

  // Per-tour staff note editing
  const [editingNotes, setEditingNotes] = useState({});
  const [savingNoteId, setSavingNoteId] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToTours((list) => {
      setTours(list);
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
    return tours.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const candName = (item.candidateName || "").toLowerCase();
        const guardName = (item.guardianName || "").toLowerCase();
        const phone = (item.candidatePhone || "").toLowerCase();
        const email = (item.candidateEmail || "").toLowerCase();
        const refId = (item.bookingReference || "").toLowerCase();
        const city = (item.city || "").toLowerCase();
        const date = (item.preferredDate || "").toLowerCase();

        return (
          candName.includes(q) ||
          guardName.includes(q) ||
          phone.includes(q) ||
          email.includes(q) ||
          refId.includes(q) ||
          city.includes(q) ||
          date.includes(q)
        );
      }
      return true;
    });
  }, [tours, statusFilter, searchQuery]);

  // Statistics Counts
  const stats = useMemo(() => {
    const total = tours.length;
    const pending = tours.filter((t) => t.status === "pending" || !t.status).length;
    const confirmed = tours.filter((t) => t.status === "confirmed").length;
    const completed = tours.filter((t) => t.status === "completed").length;
    return { total, pending, confirmed, completed };
  }, [tours]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateTourStatus(id, newStatus);
      showToast(`Status updated to "${STATUS_CONFIG[newStatus]?.label || newStatus}"`);
      if (selectedTour && selectedTour.id === id) {
        setSelectedTour((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating tour status");
    }
  };

  const handleSaveNotes = async (id) => {
    setSavingNoteId(id);
    const notes = editingNotes[id] ?? "";
    try {
      const tour = tours.find((t) => t.id === id);
      await updateTourStatus(id, tour?.status || "pending", notes);
      showToast("Staff counseling notes saved successfully");
    } catch (err) {
      console.error(err);
      showToast("Error saving notes");
    } finally {
      setSavingNoteId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campus tour booking?")) {
      return;
    }
    try {
      await deleteTour(id);
      showToast("Campus tour record deleted");
      if (selectedTour && selectedTour.id === id) {
        setSelectedTour(null);
      }
    } catch (err) {
      console.error(err);
      showToast("Error deleting tour record");
    }
  };

  // Export CSV
  const exportToCSV = () => {
    if (tours.length === 0) {
      alert("No campus tour records to export.");
      return;
    }

    const headers = [
      "Booking Reference",
      "Date Booked",
      "Candidate Name",
      "Candidate Phone",
      "Candidate Email",
      "Parent/Guardian Name",
      "Relationship",
      "City",
      "Graduation Status",
      "Degree",
      "Percentage",
      "Previous College",
      "Preferred Visit Date",
      "Preferred Time Slot",
      "Visitors Attending",
      "Status",
      "Staff Notes",
    ];

    const rows = filteredList.map((t) => [
      `"${t.bookingReference || ""}"`,
      `"${t.createdAtFormatted || ""}"`,
      `"${t.candidateName || ""}"`,
      `"${t.candidatePhone || ""}"`,
      `"${t.candidateEmail || ""}"`,
      `"${t.guardianName || ""}"`,
      `"${t.relationship || ""}"`,
      `"${t.city || ""}"`,
      `"${t.graduationStatus || ""}"`,
      `"${t.graduationDegree || ""}"`,
      `"${t.graduationPercentage || ""}"`,
      `"${t.previousCollege || ""}"`,
      `"${t.preferredDate || ""}"`,
      `"${t.preferredTimeSlot || ""}"`,
      t.visitorsCount || 2,
      `"${t.status || "pending"}"`,
      `"${(t.staffNotes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `HSCE_Campus_Tours_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="academic-admin-page space-y-5">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-200 bg-white p-4 sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Compass className="text-[#363991]" size={26} />
              <span>Campus Tour Bookings</span>
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-[#363991] border border-indigo-100">
              B.Ed. Admissions 2026-27
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time prospective candidate & parent campus tour requests submitted via public website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition">
            <FileSpreadsheet size={15} className="text-emerald-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tour Bookings</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{stats.total}</div>
          <div className="text-[11px] text-slate-400 mt-1">All time requests</div>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Review</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{stats.pending}</div>
          <div className="text-[11px] text-slate-400 mt-1">Needs contact or schedule call</div>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confirmed Visits</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{stats.confirmed}</div>
          <div className="text-[11px] text-slate-400 mt-1">Ready for guided tour</div>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Tours</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{stats.completed}</div>
          <div className="text-[11px] text-slate-400 mt-1">Visited campus & counseled</div>
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
            placeholder="Search candidate, parent, phone, reference ID..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-md outline-none focus:bg-white focus:border-[#363991] focus:ring-1 focus:ring-[#363991]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Filter size={14} className="text-slate-400" />
            <span>Status:</span>
          </div>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
            {["all", "pending", "confirmed", "completed", "cancelled"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  statusFilter === st
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}>
                {st === "all" ? "All" : STATUS_CONFIG[st]?.label || st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List / Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200">
          <div className="h-8 w-8 rounded-full border-3 border-indigo-100 border-t-[#363991] animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-600">Loading campus tour bookings...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200 text-center px-4">
          <div className="p-3 bg-indigo-50 text-[#363991] rounded-md mb-3">
            <Compass size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No campus tours found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search criteria or filter to see more bookings."
              : "No campus tour requests have been submitted yet. New bookings from the public site will appear here automatically."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((tour) => {
            const currentStatus = tour.status || "pending";
            const cfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending;
            const noteValue = editingNotes[tour.id] !== undefined ? editingNotes[tour.id] : tour.staffNotes || "";

            return (
              <div
                key={tour.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition">
                {/* Top Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#363991] bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                      {tour.bookingReference || "HSCE-TOUR"}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Received {tour.createdAtFormatted}
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
                      onChange={(e) => handleStatusChange(tour.id, e.target.value)}
                      className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 outline-none focus:border-[#363991]">
                      {Object.keys(STATUS_CONFIG).map((key) => (
                        <option key={key} value={key}>
                          Set: {STATUS_CONFIG[key].label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setSelectedTour(tour)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                      title="View Full Booking Details">
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(tour.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Record">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Middle Info Cluster */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                  {/* Column 1: Candidate & Guardian Contact */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Candidate & Guardian</div>
                    <div className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{tour.candidateName}</span>
                    </div>

                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Guardian:</span> {tour.guardianName} ({tour.relationship})
                    </div>

                    {tour.city && (
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400" />
                        <span>{tour.city}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1.5">
                      <a
                        href={`tel:${tour.candidatePhone}`}
                        className="inline-flex items-center gap-1 text-[#363991] bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md border border-indigo-100 text-xs font-bold transition">
                        <Phone size={11} />
                        <span>{tour.candidatePhone}</span>
                      </a>

                      <a
                        href={`https://wa.me/91${tour.candidatePhone?.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Hello ${tour.candidateName}, greetings from Haryana Shakti College of Education regarding your campus tour request (${tour.bookingReference}) for ${tour.preferredDate}.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 transition">
                        <MessageCircle size={11} />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Column 2: Scheduled Date & Visitors */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visit Schedule</div>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <Calendar size={15} className="text-[#363991]" />
                      <span>{tour.preferredDate}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <Clock size={13} className="text-slate-400" />
                      <span>{tour.preferredTimeSlot}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <Users size={13} className="text-slate-400" />
                      <span>{tour.visitorsCount || 2} Visitors Attending</span>
                    </div>

                    {/* Facilities to Inspect Tags */}
                    {tour.facilitiesToInspect && tour.facilitiesToInspect.length > 0 && (
                      <div className="pt-1 flex flex-wrap gap-1">
                        {tour.facilitiesToInspect.slice(0, 2).map((fid) => (
                          <span
                            key={fid}
                            className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded border border-slate-200">
                            {LAB_LABELS[fid] || fid}
                          </span>
                        ))}
                        {tour.facilitiesToInspect.length > 2 && (
                          <span className="text-[10px] bg-slate-100 text-slate-500 font-medium px-1.5 py-0.5 rounded">
                            +{tour.facilitiesToInspect.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Column 3: Academic Background & Graduation */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Background</div>
                    <div className="text-xs font-bold text-slate-800">
                      {tour.graduationDegree || "Graduation Degree"}
                    </div>

                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Status:</span> {tour.graduationStatus}
                    </div>

                    {tour.graduationPercentage && (
                      <div className="text-xs text-slate-600">
                        <span className="font-semibold text-slate-700">Percentage:</span> {tour.graduationPercentage}
                      </div>
                    )}

                    {tour.previousCollege && (
                      <div className="text-xs text-slate-500 truncate" title={tour.previousCollege}>
                        <span className="font-semibold text-slate-700">College:</span> {tour.previousCollege}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Staff Notes Strip */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Staff Notes:</span>
                    <input
                      type="text"
                      value={noteValue}
                      onChange={(e) =>
                        setEditingNotes((prev) => ({
                          ...prev,
                          [tour.id]: e.target.value,
                        }))
                      }
                      placeholder="Add follow-up notes (e.g. Called parent, visit confirmed for 11 AM)..."
                      className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-800 outline-none focus:bg-white focus:border-[#363991]"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveNotes(tour.id)}
                      disabled={savingNoteId === tour.id}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-black text-white text-xs font-semibold shadow-2xs transition disabled:opacity-50">
                      <Save size={12} />
                      <span>{savingNoteId === tour.id ? "Saving..." : "Save"}</span>
                    </button>
                  </div>

                  {tour.specialNotes && (
                    <div className="text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 truncate max-w-xs" title={tour.specialNotes}>
                      <span className="font-bold">Visitor Query:</span> {tour.specialNotes}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL DETAILS MODAL */}
      {selectedTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <Compass className="text-[#363991]" size={22} />
                <div>
                  <h3 className="font-bold text-base">Campus Tour Application Details</h3>
                  <div className="text-xs text-slate-400 font-mono">{selectedTour.bookingReference}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedTour(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
              {/* Tour Status & Schedule */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Scheduled Date</span>
                  <span className="font-bold text-slate-900 text-base">{selectedTour.preferredDate}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Time Slot</span>
                  <span className="font-bold text-slate-900">{selectedTour.preferredTimeSlot}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">Visitors</span>
                  <span className="font-bold text-slate-900">{selectedTour.visitorsCount || 2} Persons</span>
                </div>
              </div>

              {/* Candidate & Contact Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
                  Candidate & Contact Info
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Full Name:</span>
                    <span className="font-bold text-slate-900 ml-1.5">{selectedTour.candidateName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Mobile Phone:</span>
                    <span className="font-bold text-slate-900 ml-1.5">{selectedTour.candidatePhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Parent / Guardian:</span>
                    <span className="font-bold text-slate-900 ml-1.5">
                      {selectedTour.guardianName} ({selectedTour.relationship})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Email:</span>
                    <span className="font-bold text-slate-900 ml-1.5">{selectedTour.candidateEmail || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Location / City:</span>
                    <span className="font-bold text-slate-900 ml-1.5">{selectedTour.city || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Application Date:</span>
                    <span className="font-bold text-slate-900 ml-1.5">{selectedTour.createdAtFormatted}</span>
                  </div>
                </div>
              </div>

              {/* Academic Background */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
                  Academic Background (B.Ed. Eligibility)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Graduation Degree:</span>
                    <span className="font-bold text-slate-900 ml-1.5">{selectedTour.graduationDegree}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Status:</span>
                    <span className="font-bold text-slate-900 ml-1.5">{selectedTour.graduationStatus}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Aggregate Percentage:</span>
                    <span className="font-bold text-slate-900 ml-1.5">{selectedTour.graduationPercentage || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Previous College / Univ:</span>
                    <span className="font-bold text-slate-900 ml-1.5">{selectedTour.previousCollege || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Facilities of Interest */}
              {selectedTour.facilitiesToInspect && selectedTour.facilitiesToInspect.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
                    Requested Facilities to Inspect
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTour.facilitiesToInspect.map((fid) => (
                      <span
                        key={fid}
                        className="text-xs bg-indigo-50 text-[#363991] font-semibold px-2.5 py-1 rounded-md border border-indigo-100">
                        {LAB_LABELS[fid] || fid}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Query / Questions */}
              {selectedTour.specialNotes && (
                <div className="space-y-1.5 bg-amber-50 border border-amber-200 p-3.5 rounded-xl">
                  <div className="text-xs font-bold text-amber-900">Specific Questions from Visitor:</div>
                  <div className="text-xs text-amber-800 leading-relaxed">{selectedTour.specialNotes}</div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedTour.candidatePhone}`}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#363991] text-white px-3 py-2 text-xs font-bold hover:bg-[#292c76] transition">
                  <Phone size={13} />
                  <span>Call Candidate</span>
                </a>
                <a
                  href={`https://wa.me/91${selectedTour.candidatePhone?.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 text-white px-3 py-2 text-xs font-bold hover:bg-emerald-700 transition">
                  <MessageCircle size={13} />
                  <span>WhatsApp</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTour(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
