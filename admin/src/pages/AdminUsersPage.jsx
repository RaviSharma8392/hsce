import { useEffect, useState, useMemo } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import {
  ShieldCheck,
  UserCheck,
  UserX,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Trash2,
  KeyRound,
  ExternalLink,
  Users,
  UserPlus,
  Mail,
  Send,
  X,
  History,
  Laptop,
  CheckCircle,
  XCircle,
  RefreshCw,
  Lock,
} from "lucide-react";
import { auth, db, firebaseConfig, firebaseReady } from "../config/firebase";
import { SUPER_ADMIN_EMAIL } from "../hooks/useAuthState";

const PERMISSION_OPTIONS = [
  { key: "notices", label: "Notices & Circulars" },
  { key: "enquiries", label: "Admission Enquiries" },
  { key: "feedback", label: "Student Feedback & Grievances" },
  { key: "tours", label: "Campus Visit Requests" },
  { key: "gallery", label: "Campus Gallery" },
  { key: "syllabus", label: "Course Syllabus" },
  { key: "homepagePopup", label: "Homepage Popup" },
];

function formatTimestamp(ts) {
  if (!ts) return null;
  try {
    if (ts.toDate) {
      return ts.toDate().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    }
    if (ts instanceof Date) {
      return ts.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    }
    if (typeof ts === "number") {
      return new Date(ts).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    }
  } catch {
    // fallback
  }
  return "Recent";
}

export default function AdminUsersPage({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all" | "pending" | "active" | "suspended" | "logs"
  const [savingId, setSavingId] = useState(null);

  // Local draft states for editing permissions per user
  const [editStates, setEditStates] = useState({});

  // Provisioning Modal State
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);
  const [provisionEmail, setProvisionEmail] = useState("");
  const [provisionName, setProvisionName] = useState("");
  const [provisionRole, setProvisionRole] = useState("staff");
  const [provisionPermissions, setProvisionPermissions] = useState({
    notices: true,
    enquiries: true,
  });
  const [provisioning, setProvisioning] = useState(false);
  const [provisionError, setProvisionError] = useState("");

  // Filter for security logs
  const [logFilter, setLogFilter] = useState("all"); // "all" | "SUCCESS" | "FAILED" | "USER_PROVISIONED"

  // 1. Subscribe to adminUsers collection
  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    const usersCol = collection(db, "adminUsers");
    const unsubscribeUsers = onSnapshot(
      usersCol,
      (snapshot) => {
        const list = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));

        setUsers(list);
        setLoading(false);

        // Pre-populate edit states for smooth toggle interactions
        setEditStates((prev) => {
          const next = { ...prev };
          list.forEach((item) => {
            if (!next[item.id]) {
              next[item.id] = {
                role: item.role || "staff",
                permissions: item.permissions || {},
              };
            }
          });
          return next;
        });
      },
      (snapshotError) => {
        console.error("AdminUsers subscription error:", snapshotError);
        setError("Unable to stream user records. Please check permissions.");
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribeUsers === "function") unsubscribeUsers();
    };
  }, []);

  // 2. Subscribe to securityLogs collection
  useEffect(() => {
    if (!firebaseReady) {
      setLogsLoading(false);
      return undefined;
    }

    setLogsLoading(true);
    const logsCol = collection(db, "securityLogs");
    const logsQuery = query(logsCol, orderBy("timestamp", "desc"), limit(120));

    const unsubscribeLogs = onSnapshot(
      logsQuery,
      (snapshot) => {
        const logsList = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));
        setSecurityLogs(logsList);
        setLogsLoading(false);
      },
      (err) => {
        console.warn("Security logs subscription warning, falling back:", err);
        // Fallback without ordering in case index is pending
        onSnapshot(logsCol, (snap) => {
          const raw = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          raw.sort((a, b) => {
            const timeA = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
            const timeB = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
            return timeB - timeA;
          });
          setSecurityLogs(raw.slice(0, 120));
          setLogsLoading(false);
        });
      }
    );

    return () => {
      if (typeof unsubscribeLogs === "function") unsubscribeLogs();
    };
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 5000);
  };

  const handleRoleChange = (userId, newRole) => {
    setEditStates((prev) => ({
      ...prev,
      [userId]: {
        ...(prev[userId] || {}),
        role: newRole,
      },
    }));
  };

  const handlePermissionToggle = (userId, permKey) => {
    setEditStates((prev) => {
      const currentPerms = prev[userId]?.permissions || {};
      return {
        ...prev,
        [userId]: {
          ...(prev[userId] || {}),
          permissions: {
            ...currentPerms,
            [permKey]: !currentPerms[permKey],
          },
        },
      };
    });
  };

  const grantAllPermissions = (userId) => {
    setEditStates((prev) => ({
      ...prev,
      [userId]: {
        ...(prev[userId] || {}),
        permissions: PERMISSION_OPTIONS.reduce((acc, opt) => {
          acc[opt.key] = true;
          return acc;
        }, {}),
      },
    }));
  };

  // 1. Verify & Activate User (Principal approval action)
  const handleVerifyAndApprove = async (userRecord) => {
    setSavingId(userRecord.id);
    setError("");

    try {
      const draft = editStates[userRecord.id] || {
        role: userRecord.role || "staff",
        permissions: userRecord.permissions || {},
      };

      await updateDoc(doc(db, "adminUsers", userRecord.id), {
        active: true,
        verified: true,
        status: "active",
        role: draft.role,
        permissions: draft.permissions,
        verifiedBy: currentUser.email || SUPER_ADMIN_EMAIL,
        verifiedAt: serverTimestamp(),
        lastUpdatedAt: serverTimestamp(),
      });

      // Also dispatch password reset / email verification link so user has secure access credentials
      await sendPasswordResetEmail(auth, userRecord.email).catch(() => {});

      await addDoc(collection(db, "securityLogs"), {
        email: userRecord.email.toLowerCase().trim(),
        outcome: "USER_VERIFIED",
        details: `Account verified and approved by Principal Ravi Sharma with role ${draft.role}`,
        timestamp: serverTimestamp(),
        deviceInfo: typeof navigator !== "undefined" ? navigator.userAgent : "Admin Terminal",
      }).catch(() => {});

      showToast(`Account for ${userRecord.email} has been verified and activated by Principal Ravi Sharma! Verification link dispatched.`);
    } catch (err) {
      console.error("Verification error:", err);
      setError(`Failed to verify ${userRecord.email}: ${err.message}`);
    } finally {
      setSavingId(null);
    }
  };

  // 2. Save Updated Permissions & Role
  const handleSavePermissions = async (userRecord) => {
    setSavingId(userRecord.id);
    setError("");

    try {
      const draft = editStates[userRecord.id] || {
        role: userRecord.role || "staff",
        permissions: userRecord.permissions || {},
      };

      await updateDoc(doc(db, "adminUsers", userRecord.id), {
        role: draft.role,
        permissions: draft.permissions,
        lastUpdatedAt: serverTimestamp(),
      });

      showToast(`Permissions updated for ${userRecord.email}.`);
    } catch (err) {
      console.error("Save permissions error:", err);
      setError(`Failed to update permissions: ${err.message}`);
    } finally {
      setSavingId(null);
    }
  };

  // 3. Suspend / Deactivate Access
  const handleToggleActive = async (userRecord, newActiveState) => {
    if (userRecord.email?.toLowerCase() === SUPER_ADMIN_EMAIL) {
      alert("The Super Administrator (Principal) account cannot be deactivated.");
      return;
    }

    setSavingId(userRecord.id);
    setError("");

    try {
      await updateDoc(doc(db, "adminUsers", userRecord.id), {
        active: newActiveState,
        status: newActiveState ? "active" : "suspended",
        lastUpdatedAt: serverTimestamp(),
      });

      await addDoc(collection(db, "securityLogs"), {
        email: userRecord.email.toLowerCase().trim(),
        outcome: newActiveState ? "USER_REACTIVATED" : "USER_SUSPENDED",
        details: `Access ${newActiveState ? "reactivated" : "suspended"} by Principal Ravi Sharma`,
        timestamp: serverTimestamp(),
        deviceInfo: typeof navigator !== "undefined" ? navigator.userAgent : "Admin Terminal",
      }).catch(() => {});

      showToast(
        newActiveState
          ? `Access reactivated for ${userRecord.email}.`
          : `Access suspended for ${userRecord.email}.`
      );
    } catch (err) {
      console.error("Status toggle error:", err);
      setError(`Failed to update status: ${err.message}`);
    } finally {
      setSavingId(null);
    }
  };

  // 4. Send / Resend Password Setup & Email Verification Link
  const handleSendVerificationEmail = async (userRecord) => {
    setSavingId(userRecord.id);
    setError("");

    try {
      await sendPasswordResetEmail(auth, userRecord.email);
      await addDoc(collection(db, "securityLogs"), {
        email: userRecord.email.toLowerCase().trim(),
        outcome: "VERIFICATION_SENT",
        details: `Password setup & email verification link sent by Principal Ravi Sharma`,
        timestamp: serverTimestamp(),
        deviceInfo: typeof navigator !== "undefined" ? navigator.userAgent : "Admin Terminal",
      }).catch(() => {});

      showToast(`Official password setup & verification email dispatched to ${userRecord.email}.`);
    } catch (err) {
      console.error("Resend email error:", err);
      setError(`Failed to dispatch verification email to ${userRecord.email}: ${err.message}`);
    } finally {
      setSavingId(null);
    }
  };

  // 5. Delete Access Record
  const handleDeleteUser = async (userRecord) => {
    if (userRecord.email?.toLowerCase() === SUPER_ADMIN_EMAIL) {
      alert("The Super Administrator account cannot be deleted.");
      return;
    }

    if (!window.confirm(`Permanently remove administrative access record for ${userRecord.email}?`)) {
      return;
    }

    setSavingId(userRecord.id);
    setError("");

    try {
      await deleteDoc(doc(db, "adminUsers", userRecord.id));
      await addDoc(collection(db, "securityLogs"), {
        email: userRecord.email.toLowerCase().trim(),
        outcome: "USER_DELETED",
        details: `Access record deleted by Principal Ravi Sharma`,
        timestamp: serverTimestamp(),
        deviceInfo: typeof navigator !== "undefined" ? navigator.userAgent : "Admin Terminal",
      }).catch(() => {});

      showToast(`Access record for ${userRecord.email} has been permanently deleted.`);
    } catch (err) {
      console.error("Delete error:", err);
      setError(`Failed to delete record: ${err.message}`);
    } finally {
      setSavingId(null);
    }
  };

  // 6. Provision New User (Admin Only - Without logging out Ravi Sharma)
  const handleProvisionUserSubmit = async (e) => {
    e.preventDefault();
    setProvisionError("");

    const targetEmail = provisionEmail.trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes("@")) {
      setProvisionError("Please provide a valid institutional email address.");
      return;
    }

    // Check if user already exists
    const existing = users.find((u) => (u.email || "").toLowerCase() === targetEmail);
    if (existing) {
      setProvisionError(`An account record for ${targetEmail} already exists in the system.`);
      return;
    }

    setProvisioning(true);

    try {
      // Use secondary Firebase App instance so current administrator (Ravi Sharma) remains logged in!
      const provisioningApp =
        getApps().find((a) => a.name === "HSCEProvisioning") ||
        initializeApp(firebaseConfig, "HSCEProvisioning");
      const provisioningAuth = getAuth(provisioningApp);

      // Generate secure high-entropy temporary password for initial Firebase Auth creation
      const secureTempPassword =
        "Hsce@Adm" + Math.random().toString(36).slice(-8) + "!9" + Date.now().toString(36);

      const userCredential = await createUserWithEmailAndPassword(
        provisioningAuth,
        targetEmail,
        secureTempPassword
      );
      const newUid = userCredential.user.uid;

      // Clean up secondary auth session immediately
      await signOut(provisioningAuth);

      // Create document in adminUsers collection with pre-verified status by Ravi Sharma
      await setDoc(doc(db, "adminUsers", newUid), {
        email: targetEmail,
        displayName: provisionName.trim() || targetEmail.split("@")[0],
        role: provisionRole,
        permissions: provisionPermissions,
        active: true,
        verified: true, // Pre-verified by Principal Ravi Sharma!
        status: "active",
        createdBy: currentUser?.email || SUPER_ADMIN_EMAIL,
        createdAt: serverTimestamp(),
        lastLoginAt: null,
        provisionedByAdmin: true,
      });

      // Dispatch official Firebase Auth password setup / email verification link to user's inbox
      await sendPasswordResetEmail(auth, targetEmail);

      // Record administrative provisioning event in security audit logs
      await addDoc(collection(db, "securityLogs"), {
        email: targetEmail,
        outcome: "USER_PROVISIONED",
        details: `Account provisioned by Principal Ravi Sharma with role ${provisionRole}. Verification email dispatched.`,
        timestamp: serverTimestamp(),
        deviceInfo: typeof navigator !== "undefined" ? navigator.userAgent : "Admin Terminal",
      });

      showToast(
        `New account successfully created for ${targetEmail}! An official password setup and email verification link has been sent directly to their email.`
      );

      // Reset form and close modal
      setProvisionEmail("");
      setProvisionName("");
      setProvisionRole("staff");
      setProvisionPermissions({ notices: true, enquiries: true });
      setIsProvisionOpen(false);
    } catch (err) {
      console.error("Provisioning error:", err);
      if (err.code === "auth/email-already-in-use") {
        setProvisionError(
          "This email address is already registered in Firebase Authentication. You can send them a verification link or adjust their permissions."
        );
      } else {
        setProvisionError(`Provisioning failed: ${err.message}`);
      }
    } finally {
      setProvisioning(false);
    }
  };

  // Filtered and sorted records
  const pendingUsers = useMemo(
    () => users.filter((u) => u.verified !== true || u.status === "pending_verification"),
    [users]
  );

  const activeUsers = useMemo(
    () => users.filter((u) => u.verified === true && u.active === true),
    [users]
  );

  const suspendedUsers = useMemo(
    () => users.filter((u) => u.verified === true && u.active === false),
    [users]
  );

  const filteredUsers = useMemo(() => {
    let list = users;
    if (activeTab === "pending") list = pendingUsers;
    else if (activeTab === "active") list = activeUsers;
    else if (activeTab === "suspended") list = suspendedUsers;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (u) =>
          (u.email || "").toLowerCase().includes(q) ||
          (u.displayName || "").toLowerCase().includes(q)
      );
    }

    return list;
  }, [users, activeTab, pendingUsers, activeUsers, suspendedUsers, search]);

  const filteredLogs = useMemo(() => {
    let list = securityLogs;
    if (logFilter !== "all") {
      list = list.filter((item) => item.outcome === logFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (item) =>
          (item.email || "").toLowerCase().includes(q) ||
          (item.details || "").toLowerCase().includes(q) ||
          (item.outcome || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [securityLogs, logFilter, search]);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-7 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs shrink-0">
              <ShieldCheck size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Admin Access &amp; User Governance
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  Principal Authority
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Authorized provisioning, verification &amp; permission governance by Principal <strong>Ravi Sharma ({SUPER_ADMIN_EMAIL})</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>Policy: <strong>Admin-Only Provisioning</strong></span>
            </div>

            {/* Button to open Provision User Modal */}
            <button
              type="button"
              onClick={() => setIsProvisionOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white rounded-lg text-xs font-bold shadow-sm transition"
            >
              <UserPlus size={15} />
              <span>Provision New User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="text-xs font-semibold uppercase text-slate-500">Total Accounts</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{users.length}</div>
        </div>

        <div
          className={`p-4 rounded-xl border shadow-2xs ${
            pendingUsers.length > 0
              ? "bg-amber-50/80 border-amber-300 text-amber-950"
              : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold uppercase">
            <span>Pending Approvals</span>
            {pendingUsers.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            )}
          </div>
          <div className="text-2xl font-extrabold mt-1 text-amber-700">
            {pendingUsers.length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="text-xs font-semibold uppercase text-slate-500">Active Admins &amp; Staff</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">{activeUsers.length}</div>
        </div>

        <div
          onClick={() => setActiveTab("logs")}
          className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs cursor-pointer hover:border-blue-300 transition-colors"
        >
          <div className="flex items-center justify-between text-xs font-semibold uppercase text-slate-500">
            <span>Login Audit Events</span>
            <History size={14} className="text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">
            {securityLogs.length}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-medium flex items-center gap-2 shadow-xs transition-all"
          role="alert"
        >
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div
          className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm font-medium flex items-center gap-2 shadow-xs"
          role="alert"
        >
          <AlertCircle size={18} className="text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === "all"
                ? "bg-blue-700 text-white shadow-2xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            All Accounts ({users.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "pending"
                ? "bg-amber-600 text-white shadow-2xs"
                : "text-amber-800 bg-amber-50 hover:bg-amber-100/80"
            }`}
          >
            <Clock size={13} />
            <span>Pending Approvals ({pendingUsers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === "active"
                ? "bg-blue-700 text-white shadow-2xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Active ({activeUsers.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("suspended")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === "suspended"
                ? "bg-blue-700 text-white shadow-2xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Suspended ({suspendedUsers.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "logs"
                ? "bg-indigo-700 text-white shadow-2xs"
                : "text-indigo-800 bg-indigo-50 hover:bg-indigo-100/80"
            }`}
          >
            <History size={13} />
            <span>Live Login Audit ({securityLogs.length})</span>
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeTab === "logs"
                ? "Search login email or events…"
                : "Search administrator email or name…"
            }
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: SECURITY & LIVE LOGIN AUDIT LOGS                */}
      {/* ======================================================== */}
      {activeTab === "logs" ? (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <History size={18} className="text-blue-700" />
                <span>Live Login &amp; Terminal Activity Logs</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time security auditing: monitor authorized sign-ins, blocked guessing attempts, and account modifications.
              </p>
            </div>

            {/* Filter by outcome */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setLogFilter("all")}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  logFilter === "all"
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Events
              </button>
              <button
                type="button"
                onClick={() => setLogFilter("SUCCESS")}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                  logFilter === "SUCCESS"
                    ? "bg-emerald-700 text-white"
                    : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                }`}
              >
                <CheckCircle size={12} />
                <span>Success</span>
              </button>
              <button
                type="button"
                onClick={() => setLogFilter("FAILED")}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                  logFilter === "FAILED"
                    ? "bg-red-700 text-white"
                    : "bg-red-50 text-red-800 hover:bg-red-100"
                }`}
              >
                <XCircle size={12} />
                <span>Failed Attempts</span>
              </button>
              <button
                type="button"
                onClick={() => setLogFilter("USER_PROVISIONED")}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  logFilter === "USER_PROVISIONED"
                    ? "bg-blue-700 text-white"
                    : "bg-blue-50 text-blue-800 hover:bg-blue-100"
                }`}
              >
                Provisioned
              </button>
            </div>
          </div>

          {logsLoading ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>Loading real-time security events…</span>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              <History size={28} className="mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No security audit logs found</p>
              <p className="text-xs text-slate-400 mt-0.5">
                New login events and terminal attempts will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredLogs.map((log) => {
                const isSuccess = log.outcome === "SUCCESS";
                const isFailed = log.outcome === "FAILED";
                const isProvisioned = log.outcome === "USER_PROVISIONED";

                return (
                  <div
                    key={log.id}
                    className={`p-3.5 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                      isSuccess
                        ? "bg-emerald-50/40 border-emerald-200/80"
                        : isFailed
                        ? "bg-red-50/50 border-red-200"
                        : isProvisioned
                        ? "bg-blue-50/40 border-blue-200/80"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSuccess
                            ? "bg-emerald-600 text-white"
                            : isFailed
                            ? "bg-red-600 text-white"
                            : isProvisioned
                            ? "bg-blue-700 text-white"
                            : "bg-slate-600 text-white"
                        }`}
                      >
                        {isSuccess ? (
                          <CheckCircle size={15} />
                        ) : isFailed ? (
                          <ShieldAlert size={15} />
                        ) : isProvisioned ? (
                          <UserPlus size={15} />
                        ) : (
                          <Laptop size={15} />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong className="text-slate-900 font-semibold truncate">
                            {log.email || "Unknown User"}
                          </strong>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isSuccess
                                ? "bg-emerald-100 text-emerald-800"
                                : isFailed
                                ? "bg-red-100 text-red-800"
                                : isProvisioned
                                ? "bg-blue-100 text-blue-800"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {log.outcome || "EVENT"}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-0.5 truncate">{log.details}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-slate-400 shrink-0 sm:text-right pl-10 sm:pl-0">
                      <div className="flex flex-col text-[11px] leading-tight">
                        <span className="font-semibold text-slate-700">
                          {formatTimestamp(log.timestamp) || "Just now"}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[200px]" title={log.deviceInfo}>
                          {log.deviceInfo?.includes("Windows")
                            ? "Windows Terminal"
                            : log.deviceInfo?.includes("Mac")
                            ? "Mac Terminal"
                            : log.deviceInfo?.includes("Android") || log.deviceInfo?.includes("iPhone")
                            ? "Mobile Terminal"
                            : "Web Terminal"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* ======================================================== */
        /* VIEW 2: ADMINISTRATOR & USER ACCOUNTS LIST               */
        /* ======================================================== */
        <div>
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm bg-white rounded-xl border border-slate-200/90 shadow-2xs">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>Loading administrative access records…</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200/90 shadow-2xs">
              <Users size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No account records found</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeTab === "pending"
                  ? "All pending account registration requests have been reviewed."
                  : "No administrative accounts match your search filter."}
              </p>
              <button
                type="button"
                onClick={() => setIsProvisionOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800 transition shadow-2xs"
              >
                <UserPlus size={14} />
                <span>Provision an Account Now</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((u) => {
                const isSuperAdmin = u.email?.toLowerCase() === SUPER_ADMIN_EMAIL;
                const draft = editStates[u.id] || {
                  role: u.role || "staff",
                  permissions: u.permissions || {},
                };
                const isPending =
                  u.verified !== true || u.status === "pending_verification";
                const isSaving = savingId === u.id;
                const lastLoginFormatted = formatTimestamp(u.lastLoginAt);

                return (
                  <div
                    key={u.id}
                    className={`p-5 sm:p-6 rounded-xl border transition-all shadow-2xs ${
                      isSuperAdmin
                        ? "bg-blue-50/40 border-blue-200 ring-1 ring-blue-100"
                        : isPending
                        ? "bg-amber-50/30 border-amber-200"
                        : u.active
                        ? "bg-white border-slate-200/90"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs ${
                            isSuperAdmin
                              ? "bg-blue-700 text-white"
                              : isPending
                              ? "bg-amber-500 text-white"
                              : u.active
                              ? "bg-slate-700 text-white"
                              : "bg-slate-300 text-slate-600"
                          }`}
                        >
                          {u.email ? u.email.charAt(0).toUpperCase() : "U"}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <strong className="text-sm sm:text-base font-bold text-slate-900 truncate">
                              {u.displayName || u.email}
                            </strong>

                            {u.displayName && (
                              <span className="text-xs text-slate-500 font-normal">
                                ({u.email})
                              </span>
                            )}

                            {isSuperAdmin ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-700 text-white uppercase tracking-wider">
                                <ShieldCheck size={12} />
                                Master Principal
                              </span>
                            ) : isPending ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
                                <Clock size={11} />
                                Pending Verification
                              </span>
                            ) : u.active ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                                <CheckCircle2 size={11} />
                                Active &bull; {u.role === "principal" ? "Principal" : "Staff"}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 uppercase tracking-wider">
                                <UserX size={11} />
                                Suspended
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-3.5 flex-wrap">
                            <span>
                              UID: <code className="font-mono text-[11px] text-slate-600">{u.id}</code>
                            </span>
                            <span>
                              Last Login:{" "}
                              <strong className={lastLoginFormatted ? "text-slate-800" : "text-slate-400 font-normal"}>
                                {lastLoginFormatted ? lastLoginFormatted : "Never logged in yet"}
                              </strong>
                            </span>
                            {u.createdBy && (
                              <span>Provisioned by: <strong>{u.createdBy}</strong></span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions Bar for User */}
                      {!isSuperAdmin && (
                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          {isPending ? (
                            <button
                              type="button"
                              onClick={() => handleVerifyAndApprove(u)}
                              disabled={isSaving}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white rounded-lg text-xs font-bold shadow-sm transition disabled:opacity-60"
                            >
                              <ShieldCheck size={14} />
                              <span>{isSaving ? "Verifying…" : "Verify & Grant Access"}</span>
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSendVerificationEmail(u)}
                                disabled={isSaving}
                                title="Send password reset and email verification link to user's inbox"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition disabled:opacity-60"
                              >
                                <Mail size={13} className="text-blue-600" />
                                <span>Send Setup Link</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSavePermissions(u)}
                                disabled={isSaving}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition disabled:opacity-60"
                              >
                                <span>Save Permissions</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleActive(u, !u.active)}
                                disabled={isSaving}
                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                                  u.active
                                    ? "border-amber-200 text-amber-800 bg-amber-50 hover:bg-amber-100"
                                    : "border-emerald-200 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                                }`}
                              >
                                {u.active ? "Suspend Access" : "Reactivate Access"}
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u)}
                            disabled={isSaving}
                            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                            title="Delete this access record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Permissions & Role Configuration (Disabled for Super Admin who has all permissions) */}
                    {!isSuperAdmin && (
                      <div className="pt-4 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                              Assigned Role:
                            </label>
                            <select
                              value={draft.role || "staff"}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              className="px-3 py-1 rounded-lg border border-slate-300 text-xs font-semibold bg-white text-slate-800 outline-none focus:border-blue-600"
                            >
                              <option value="staff">Staff (Selected Permissions)</option>
                              <option value="principal">Principal (Full System Access)</option>
                            </select>
                          </div>

                          <button
                            type="button"
                            onClick={() => grantAllPermissions(u.id)}
                            className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 hover:underline text-left sm:text-right"
                          >
                            Select All Permissions
                          </button>
                        </div>

                        {/* Permissions Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 pt-1">
                          {PERMISSION_OPTIONS.map((opt) => {
                            const isGranted = Boolean(draft.permissions?.[opt.key]);
                            return (
                              <label
                                key={opt.key}
                                className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer select-none transition ${
                                  isGranted
                                    ? "bg-blue-50/80 border-blue-300 text-blue-950 font-medium"
                                    : "bg-slate-50 border-slate-200 text-slate-600"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isGranted}
                                  onChange={() => handlePermissionToggle(u.id, opt.key)}
                                  className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="truncate">{opt.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PROVISION NEW USER (ADMIN EXCLUSIVE)              */}
      {/* ======================================================== */}
      {isProvisionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center">
                  <UserPlus size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    Provision New Portal User
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Administrator creation with automatic email verification link
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsProvisionOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleProvisionUserSubmit} className="p-6 space-y-4">
              {provisionError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                  <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                  <span>{provisionError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name / Designation
                </label>
                <input
                  type="text"
                  value={provisionName}
                  onChange={(e) => setProvisionName(e.target.value)}
                  placeholder="e.g. Dr. Priya Verma (Faculty)"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Institutional Email Address
                </label>
                <input
                  type="email"
                  value={provisionEmail}
                  onChange={(e) => setProvisionEmail(e.target.value)}
                  placeholder="e.g. priya.verma@haryanashakti.ac.in"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Assigned Administrative Role
                </label>
                <select
                  value={provisionRole}
                  onChange={(e) => setProvisionRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 outline-none focus:border-blue-600 font-medium"
                >
                  <option value="staff">Staff (Module-Specific Access)</option>
                  <option value="principal">Principal (Full Access)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Module Permissions
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 border border-slate-100 rounded-lg">
                  {PERMISSION_OPTIONS.map((opt) => {
                    const isChecked = Boolean(provisionPermissions[opt.key]);
                    return (
                      <label
                        key={opt.key}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer select-none transition ${
                          isChecked
                            ? "bg-blue-50/80 border-blue-300 text-blue-950 font-medium"
                            : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            setProvisionPermissions((prev) => ({
                              ...prev,
                              [opt.key]: !prev[opt.key],
                            }))
                          }
                          className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="truncate">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg bg-blue-50/80 p-3 border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                <Mail size={16} className="text-blue-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Verification &amp; Password link:</strong> When you click Provision, an official email from the college system will automatically be dispatched to the user's email address allowing them to set their password and verify their account.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProvisionOpen(false)}
                  disabled={provisioning}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={provisioning}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white rounded-lg text-xs font-bold shadow-md transition disabled:opacity-60"
                >
                  {provisioning ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Provisioning Account…</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Provision &amp; Send Verification Email</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
