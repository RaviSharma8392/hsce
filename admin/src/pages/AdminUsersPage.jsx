import { useEffect, useState, useMemo, useRef } from "react";
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
  getDocs,
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
  UserX,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Trash2,
  Users,
  UserPlus,
  Mail,
  Send,
  ChevronLeft,
  X,
  History,
  Laptop,
  CheckCircle,
  XCircle,
  Lock,
  GraduationCap,
} from "lucide-react";
import { auth, db, firebaseConfig, firebaseReady } from "../config/firebase";
import {
  normalizePermissions,
  SUPER_ADMIN_EMAIL,
} from "../hooks/useAuthState";

const PERMISSION_OPTIONS = [
  { key: "notices", label: "Publish notices" },
  { key: "enquiries", label: "Admission requests" },
  { key: "chatbotEnquiries", label: "Website chat questions" },
  { key: "feedback", label: "Contact messages" },
  { key: "grievances", label: "Student concerns" },
  { key: "tours", label: "Campus visits" },
  { key: "gallery", label: "Campus photos" },
  { key: "faculty", label: "Faculty and staff" },
  { key: "syllabus", label: "Course documents" },
  { key: "homepagePopup", label: "Homepage announcement" },
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
  const isPrincipal =
    (currentUser?.email || "").toLowerCase() === SUPER_ADMIN_EMAIL ||
    currentUser?.role === "principal";

  const [users, setUsers] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all" | "pending" | "active" | "suspended" | "logs"
  const [savingId, setSavingId] = useState(null);

  // Cached audit logs in memory to avoid repeated queries and save Firestore read costs
  const cachedLogsRef = useRef(null);

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
  const [logFilter, setLogFilter] = useState("all");

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
          permissions: normalizePermissions(docItem.data().permissions),
        }));

        setUsers(list);
        setLoading(false);

        // Pre-populate edit states
        setEditStates((prev) => {
          const next = { ...prev };
          list.forEach((item) => {
            if (!next[item.id]) {
              next[item.id] = {
                role: item.role || "staff",
                permissions: normalizePermissions(item.permissions),
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

  // 2. Load audit history only when requested, with in-memory caching and limit(50) to save server costs
  useEffect(() => {
    if (activeTab !== "logs") {
      setLogsLoading(false);
      return undefined;
    }

    if (!firebaseReady) {
      setLogsLoading(false);
      return undefined;
    }

    // Check if we already have cached logs to avoid unnecessary reads
    if (cachedLogsRef.current && cachedLogsRef.current.length > 0) {
      setSecurityLogs(cachedLogsRef.current);
      setLogsLoading(false);
      return undefined;
    }

    setLogsLoading(true);
    setError("");
    const logsCol = collection(db, "securityLogs");
    const logsQuery = query(logsCol, orderBy("timestamp", "desc"), limit(50));
    let active = true;

    const loadLogs = async () => {
      try {
        const snapshot = await getDocs(logsQuery);
        if (!active) return;
        const items = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));
        cachedLogsRef.current = items;
        setSecurityLogs(items);
      } catch (err) {
        console.warn("Could not load ordered audit history; trying fallback.", err);
        try {
          const snapshot = await getDocs(query(logsCol, limit(50)));
          if (!active) return;
          const logs = snapshot.docs.map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          }));
          logs.sort((left, right) => {
            const leftTime = left.timestamp?.toMillis?.() ?? 0;
            const rightTime = right.timestamp?.toMillis?.() ?? 0;
            return rightTime - leftTime;
          });
          cachedLogsRef.current = logs;
          setSecurityLogs(logs);
        } catch (fallbackError) {
          if (!active) return;
          console.error("Could not load audit history.", fallbackError);
          setError("Could not load account activity. Please try again.");
        }
      } finally {
        if (active) setLogsLoading(false);
      }
    };

    loadLogs();

    return () => {
      active = false;
    };
  }, [activeTab]);

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

  // 1. Verify & Activate User (Optimistic UI)
  const handleVerifyAndApprove = async (userRecord) => {
    setSavingId(userRecord.id);
    setError("");

    const draft = editStates[userRecord.id] || {
      role: userRecord.role || "staff",
      permissions: userRecord.permissions || {},
    };

    // Optimistic instant update: user immediately shows as Active
    const previousUsers = [...users];
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userRecord.id
          ? {
            ...u,
            active: true,
            verified: true,
            status: "active",
            role: draft.role,
            permissions: draft.permissions,
          }
          : u
      )
    );
    showToast(
      `Account for ${userRecord.email} has been verified and activated! Verification email dispatched.`
    );

    try {
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

      // Dispatch password reset / email verification link
      await sendPasswordResetEmail(auth, userRecord.email).catch(() => { });

      await addDoc(collection(db, "securityLogs"), {
        email: userRecord.email.toLowerCase().trim(),
        outcome: "USER_VERIFIED",
        details: `Account verified and approved by Principal Ravi Sharma with role ${draft.role}`,
        timestamp: serverTimestamp(),
        deviceInfo: typeof navigator !== "undefined" ? navigator.userAgent : "Admin Terminal",
      }).catch(() => { });
    } catch (err) {
      console.error("Verification error:", err);
      setUsers(previousUsers); // Rollback on failure
      setError(`Failed to verify ${userRecord.email}: ${err.message}`);
    } finally {
      setSavingId(null);
    }
  };

  // 2. Save Updated Permissions & Role (Optimistic UI)
  const handleSavePermissions = async (userRecord) => {
    setSavingId(userRecord.id);
    setError("");

    const draft = editStates[userRecord.id] || {
      role: userRecord.role || "staff",
      permissions: userRecord.permissions || {},
    };

    // Optimistic instant update
    const previousUsers = [...users];
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userRecord.id
          ? { ...u, role: draft.role, permissions: draft.permissions }
          : u
      )
    );
    showToast(`Assigned work areas updated for ${userRecord.email}.`);

    try {
      await updateDoc(doc(db, "adminUsers", userRecord.id), {
        role: draft.role,
        permissions: draft.permissions,
        lastUpdatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Save permissions error:", err);
      setUsers(previousUsers); // Rollback on failure
      setError(`Failed to update permissions: ${err.message}`);
    } finally {
      setSavingId(null);
    }
  };

  // 3. Suspend / Deactivate Access (Optimistic UI)
  const handleToggleActive = async (userRecord, newActiveState) => {
    if (userRecord.email?.toLowerCase() === SUPER_ADMIN_EMAIL) {
      alert("The Super Administrator (Principal) account cannot be deactivated.");
      return;
    }

    setSavingId(userRecord.id);
    setError("");

    // Optimistic instant update
    const previousUsers = [...users];
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userRecord.id
          ? {
            ...u,
            active: newActiveState,
            status: newActiveState ? "active" : "suspended",
          }
          : u
      )
    );
    showToast(
      newActiveState
        ? `Access reactivated for ${userRecord.email}.`
        : `Access suspended for ${userRecord.email}.`
    );

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
      }).catch(() => { });
    } catch (err) {
      console.error("Status toggle error:", err);
      setUsers(previousUsers); // Rollback on failure
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
      }).catch(() => { });

      showToast(`Official password setup & verification email dispatched to ${userRecord.email}.`);
    } catch (err) {
      console.error("Resend email error:", err);
      setError(`Failed to dispatch verification email to ${userRecord.email}: ${err.message}`);
    } finally {
      setSavingId(null);
    }
  };

  // 5. Delete Access Record (Optimistic UI)
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

    // Optimistic instant removal
    const previousUsers = [...users];
    setUsers((prev) => prev.filter((u) => u.id !== userRecord.id));
    showToast(`Access record for ${userRecord.email} has been permanently deleted.`);

    try {
      await deleteDoc(doc(db, "adminUsers", userRecord.id));
      await addDoc(collection(db, "securityLogs"), {
        email: userRecord.email.toLowerCase().trim(),
        outcome: "USER_DELETED",
        details: `Access record deleted by Principal Ravi Sharma`,
        timestamp: serverTimestamp(),
        deviceInfo: typeof navigator !== "undefined" ? navigator.userAgent : "Admin Terminal",
      }).catch(() => { });
    } catch (err) {
      console.error("Delete error:", err);
      setUsers(previousUsers); // Rollback on failure
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

      const newRecord = {
        id: newUid,
        email: targetEmail,
        displayName: provisionName.trim() || targetEmail.split("@")[0],
        role: provisionRole,
        permissions: provisionPermissions,
        active: true,
        verified: true, // Pre-verified by Principal Ravi Sharma!
        status: "active",
        createdBy: currentUser?.email || SUPER_ADMIN_EMAIL,
        createdAt: new Date(),
        lastLoginAt: null,
        provisionedByAdmin: true,
      };

      // Optimistic update: instantly add to UI
      setUsers((prev) => [newRecord, ...prev]);
      setEditStates((prev) => ({
        ...prev,
        [newUid]: {
          role: provisionRole,
          permissions: provisionPermissions,
        },
      }));

      // Create document in adminUsers collection
      await setDoc(doc(db, "adminUsers", newUid), {
        ...newRecord,
        createdAt: serverTimestamp(),
      });

      // Dispatch official Firebase Auth password setup / email verification link
      await sendPasswordResetEmail(auth, targetEmail);

      // Record administrative provisioning event in security audit logs
      await addDoc(collection(db, "securityLogs"), {
        email: targetEmail,
        outcome: "USER_PROVISIONED",
        details: `Account provisioned by Principal Ravi Sharma with role ${provisionRole}. Verification email dispatched.`,
        timestamp: serverTimestamp(),
        deviceInfo: typeof navigator !== "undefined" ? navigator.userAgent : "Admin Terminal",
      }).catch(() => { });

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

  // Security Guard: Check if non-principal somehow visited this route
  if (!isPrincipal) {
    return (
      <div className="academic-admin-page font-sans space-y-5">
        <div className="bg-white rounded-xl border border-red-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <Lock size={24} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Access Restricted to Principal Authority
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Administrative user governance and permission provisioning is strictly restricted to Principal Ravi Sharma ({SUPER_ADMIN_EMAIL}).
          </p>
        </div>
      </div>
    );
  }

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
    <div className="academic-admin-page space-y-5 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-xs">
          <AlertCircle size={18} className="text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Page Header (Consistent with FacultyPage, CampusToursPage, EnquiriesPage) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-200 bg-white p-4 sm:p-6 rounded-none sm:rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <ShieldCheck className="text-[#363991]" size={26} />
              <span>Admin Access &amp; Staff Governance</span>
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-[#363991] border border-indigo-100">
              Principal Authority
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Authorized provisioning, verification &amp; permission governance managed by Principal <strong>Ravi Sharma ({SUPER_ADMIN_EMAIL})</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Policy: Admin-Only Provisioning</span>
          </div>

          <button
            type="button"
            onClick={() => setIsProvisionOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#363991] hover:bg-[#2A3178] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer"
          >
            <UserPlus size={15} />
            <span>Provision New User</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div
          onClick={() => setActiveTab("all")}
          className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs cursor-pointer hover:border-indigo-300 transition"
        >
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Accounts
          </div>
          <div className="text-xl sm:text-3xl font-black text-slate-900 mt-0.5 sm:mt-1">
            {users.length}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 truncate">Registered administrators</div>
        </div>

        <div
          onClick={() => setActiveTab("pending")}
          className={`rounded-xl border p-3 sm:p-4 shadow-xs cursor-pointer transition ${pendingUsers.length > 0
              ? "bg-amber-50/50 border-amber-300 hover:border-amber-400"
              : "bg-white border-slate-200 hover:border-indigo-300"
            }`}
        >
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Pending Approvals</span>
            {pendingUsers.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
          <div className="text-xl sm:text-3xl font-black text-amber-600 mt-0.5 sm:mt-1">
            {pendingUsers.length}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 truncate">Needs verification / approval</div>
        </div>

        <div
          onClick={() => setActiveTab("active")}
          className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs cursor-pointer hover:border-indigo-300 transition"
        >
          <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Staff
          </div>
          <div className="text-xl sm:text-3xl font-black text-emerald-600 mt-0.5 sm:mt-1">
            {activeUsers.length}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 truncate">Authorized portal access</div>
        </div>

        <div
          onClick={() => setActiveTab("logs")}
          className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs cursor-pointer hover:border-indigo-300 transition"
        >
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Audit Events</span>
            <History size={14} className="text-[#363991]" />
          </div>
          <div className="text-xl sm:text-3xl font-black text-[#363991] mt-0.5 sm:mt-1">
            {securityLogs.length}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 truncate">Recent security audits</div>
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeTab === "logs"
                ? "Search login email or event details..."
                : "Search administrator name, email, or role..."
            }
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-md outline-none focus:bg-white focus:border-[#363991] focus:ring-1 focus:ring-[#363991]"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer whitespace-nowrap ${activeTab === "all"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
              }`}
          >
            All Accounts ({users.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${activeTab === "pending"
                ? "bg-white text-amber-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <Clock size={12} />
            <span>Pending ({pendingUsers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer whitespace-nowrap ${activeTab === "active"
                ? "bg-white text-emerald-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
              }`}
          >
            Active ({activeUsers.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("suspended")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer whitespace-nowrap ${activeTab === "suspended"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
              }`}
          >
            Suspended ({suspendedUsers.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer whitespace-nowrap flex items-center gap-1 ${activeTab === "logs"
                ? "bg-white text-[#363991] shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <History size={12} />
            <span>Audit Events</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: SECURITY AUDIT LOGS TABLE */}
      {activeTab === "logs" ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          {/* Lavender Header Bar (Matching Reference Image) */}
          <div className="bg-[#E4E7F5] px-5 py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <History size={18} className="text-[#363991]" />
                <span>Security Audit History</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time security auditing: monitor authorized sign-ins, verification approvals, and account modifications.
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setLogFilter("all")}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition ${logFilter === "all"
                    ? "bg-[#363991] text-white"
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                  }`}
              >
                All Events
              </button>
              <button
                type="button"
                onClick={() => setLogFilter("SUCCESS")}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition ${logFilter === "SUCCESS"
                    ? "bg-emerald-700 text-white"
                    : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                  }`}
              >
                <CheckCircle size={12} />
                <span>Success</span>
              </button>
              <button
                type="button"
                onClick={() => setLogFilter("FAILED")}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition ${logFilter === "FAILED"
                    ? "bg-red-700 text-white"
                    : "bg-red-50 text-red-800 border border-red-200 hover:bg-red-100"
                  }`}
              >
                <XCircle size={12} />
                <span>Failed</span>
              </button>
              <button
                type="button"
                onClick={() => setLogFilter("USER_PROVISIONED")}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition ${logFilter === "USER_PROVISIONED"
                    ? "bg-[#363991] text-white"
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                  }`}
              >
                Provisioned
              </button>
            </div>
          </div>

          {logsLoading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white">
              <div className="h-8 w-8 rounded-full border-3 border-indigo-100 border-t-[#363991] animate-spin mb-3" />
              <p className="text-sm font-semibold text-slate-600">Loading audit history...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              <History size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700">No security audit logs found</p>
              <p className="text-xs text-slate-400 mt-0.5">
                New login events and terminal attempts will appear here automatically.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs font-sans min-w-[750px]">
                  <thead>
                    <tr className="bg-[#1F242C] text-white">
                      <th className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider border-r border-[#333a44] w-[26%]">
                        User / Identity
                      </th>
                      <th className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider border-r border-[#333a44] w-[18%]">
                        Event Outcome
                      </th>
                      <th className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider border-r border-[#333a44] w-[36%]">
                        Event Details
                      </th>
                      <th className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider text-right w-[20%]">
                        Terminal &amp; Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredLogs.map((log, idx) => {
                      const isSuccess = log.outcome === "SUCCESS";
                      const isFailed = log.outcome === "FAILED";
                      const isProvisioned = log.outcome === "USER_PROVISIONED";

                      return (
                        <tr
                          key={log.id}
                          className={`transition-colors hover:bg-slate-50 ${idx % 2 === 1 ? "bg-[#F9FAFB]" : "bg-white"
                            }`}
                        >
                          <td className="py-3 px-4 font-medium text-slate-800 border-r border-slate-200/80">
                            <span className="font-bold text-slate-900 block truncate text-xs sm:text-sm">
                              {log.email || "Unknown User"}
                            </span>
                          </td>
                          <td className="py-3 px-4 border-r border-slate-200/80">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isSuccess
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : isFailed
                                    ? "bg-red-100 text-red-800 border border-red-200"
                                    : isProvisioned
                                      ? "bg-indigo-100 text-[#363991] border border-indigo-200"
                                      : "bg-slate-200 text-slate-700"
                                }`}
                            >
                              {isSuccess ? (
                                <CheckCircle size={10} />
                              ) : isFailed ? (
                                <ShieldAlert size={10} />
                              ) : isProvisioned ? (
                                <UserPlus size={10} />
                              ) : (
                                <Laptop size={10} />
                              )}
                              <span>{log.outcome || "EVENT"}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-700 border-r border-slate-200/80">
                            <p className="text-xs leading-relaxed text-slate-700">
                              {log.details}
                            </p>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex flex-col text-[11px] leading-tight">
                              <span className="font-semibold text-slate-800">
                                {formatTimestamp(log.timestamp) || "Just now"}
                              </span>
                              <span
                                className="text-[10px] text-slate-400 truncate mt-0.5"
                                title={log.deviceInfo}
                              >
                                {log.deviceInfo?.includes("Windows")
                                  ? "Windows Terminal"
                                  : log.deviceInfo?.includes("Mac")
                                    ? "Mac Terminal"
                                    : log.deviceInfo?.includes("Android") ||
                                      log.deviceInfo?.includes("iPhone")
                                      ? "Mobile Terminal"
                                      : "Web Terminal"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile App Cards View for Security Audit Logs */}
              <div className="block lg:hidden divide-y divide-slate-200 bg-white">
                {filteredLogs.map((log) => {
                  const isSuccess = log.outcome === "SUCCESS";
                  const isFailed = log.outcome === "FAILED";
                  const isProvisioned = log.outcome === "USER_PROVISIONED";

                  return (
                    <div key={log.id} className="p-3.5 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 text-xs truncate">
                          {log.email || "Unknown User"}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${isSuccess
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : isFailed
                                ? "bg-red-100 text-red-800 border border-red-200"
                                : isProvisioned
                                  ? "bg-indigo-100 text-[#363991] border border-indigo-200"
                                  : "bg-slate-200 text-slate-700"
                            }`}
                        >
                          {log.outcome || "EVENT"}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">
                        {log.details}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                        <span>{formatTimestamp(log.timestamp) || "Just now"}</span>
                        <span>
                          {log.deviceInfo?.includes("Windows")
                            ? "Windows"
                            : log.deviceInfo?.includes("Mac")
                              ? "Mac"
                              : log.deviceInfo?.includes("Android") || log.deviceInfo?.includes("iPhone")
                                ? "Mobile"
                                : "Web"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      ) : (
        /* VIEW 2: ADMINISTRATION TABLE (Matching Reference Image 1 & FacultyPage Style) */
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          {/* Lavender Header Bar (Matching Image 1 & FacultyPage line 1119) */}
          <div className="bg-[#E4E7F5] px-5 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Administration
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/90 text-slate-700 border border-slate-300">
              {filteredUsers.length} Staff Members
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white">
              <div className="h-8 w-8 rounded-full border-3 border-indigo-100 border-t-[#363991] animate-spin mb-3" />
              <p className="text-sm font-semibold text-slate-600">
                Loading administrative access records...
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white text-center px-4">
              <div className="p-3 bg-indigo-50 text-[#363991] rounded-lg mb-3">
                <Users size={28} />
              </div>
              <h3 className="text-base font-bold text-slate-800">No account records found</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1">
                {activeTab === "pending"
                  ? "All pending account registration requests have been reviewed."
                  : "No administrative accounts match your search filter."}
              </p>
              <button
                type="button"
                onClick={() => setIsProvisionOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#363991] hover:bg-[#2A3178] text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <UserPlus size={14} />
                <span>Provision an Account Now</span>
              </button>
            </div>
          ) : (
            <>
              {/* Black Table Header & Crisp Clean Rows matching Reference Image 1 */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs font-sans min-w-[750px]">
                  <thead>
                    <tr className="bg-[#1F242C] text-white">
                      <th className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider border-r border-[#333a44] w-[26%]">
                        Name
                      </th>
                      <th className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider border-r border-[#333a44] w-[22%]">
                        Designation
                      </th>
                      <th className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider border-r border-[#333a44] w-[34%]">
                        Department &amp; Qualifications
                      </th>
                      <th className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider text-right w-[18%]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredUsers.map((u, idx) => {
                      const isSuperAdmin = u.email?.toLowerCase() === SUPER_ADMIN_EMAIL;
                      const draft = editStates[u.id] || {
                        role: u.role || "staff",
                        permissions: normalizePermissions(u.permissions),
                      };
                      const isPending =
                        u.verified !== true || u.status === "pending_verification";
                      const isSaving = savingId === u.id;
                      const lastLoginFormatted = formatTimestamp(u.lastLoginAt);

                      return (
                        <tr
                          key={u.id}
                          className={`transition-colors hover:bg-indigo-50/25 ${idx % 2 === 1 ? "bg-[#F9FAFB]" : "bg-white"
                            }`}
                        >
                          {/* COLUMN 1: NAME (Matching Reference Image 1) */}
                          <td className="py-3 px-4 align-top border-r border-slate-200/80">
                            <span className="font-bold text-slate-900 block text-sm">
                              {u.displayName || u.email}
                            </span>
                            {u.email ? (
                              <a
                                href={`mailto:${u.email}`}
                                className="text-xs text-blue-700 hover:underline block mt-0.5 truncate"
                              >
                                {u.email}
                              </a>
                            ) : (
                              <span className="text-xs text-slate-400 italic block mt-0.5">
                                No email listed
                              </span>
                            )}

                            <div className="mt-1.5 space-y-0.5 text-[11px] text-slate-500">
                              <div>
                                UID:{" "}
                                <code className="font-mono text-[10px] text-[#363991] bg-indigo-50 px-1 py-0.5 rounded border border-indigo-100">
                                  {u.id.length > 14 ? u.id.slice(0, 14) + "…" : u.id}
                                </code>
                              </div>
                              {u.createdBy && (
                                <div className="text-[10px] text-slate-400 truncate">
                                  Added by: {u.createdBy}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* COLUMN 2: DESIGNATION (Matching Reference Image 1) */}
                          <td className="py-3 px-4 align-top border-r border-slate-200/80">
                            <div className="space-y-1.5">
                              <div>
                                {isSuperAdmin ? (
                                  <span className="font-bold text-slate-900 text-xs sm:text-sm block">
                                    Principal / Super Admin
                                  </span>
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-slate-500">Role:</span>
                                    <select
                                      value={draft.role || "staff"}
                                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                      className="px-2 py-0.5 rounded border border-slate-300 text-xs font-bold bg-white text-slate-800 outline-none focus:border-[#363991] cursor-pointer"
                                    >
                                      <option value="staff">Staff</option>
                                      <option value="principal">Principal</option>
                                    </select>
                                  </div>
                                )}
                              </div>

                              {/* Status badge */}
                              <div>
                                {isSuperAdmin ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1F242C] text-white uppercase tracking-wider">
                                    <ShieldCheck size={11} /> Master Authority
                                  </span>
                                ) : isPending ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
                                    <Clock size={11} /> Pending Verification
                                  </span>
                                ) : u.active ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                                    <CheckCircle2 size={11} /> Active Access
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 uppercase tracking-wider">
                                    <UserX size={11} /> Suspended
                                  </span>
                                )}
                              </div>

                              <div className="text-[11px] text-slate-500 pt-0.5">
                                <span className="text-slate-400">Last login:</span>{" "}
                                <strong
                                  className={
                                    lastLoginFormatted
                                      ? "text-slate-800 font-semibold"
                                      : "text-slate-400 font-normal"
                                  }
                                >
                                  {lastLoginFormatted || "Never"}
                                </strong>
                              </div>
                            </div>
                          </td>

                          {/* COLUMN 3: DEPARTMENT & QUALIFICATIONS / PERMISSIONS (Matching Reference Image 1) */}
                          <td className="py-3 px-4 align-top border-r border-slate-200/80 text-xs">
                            {isSuperAdmin ? (
                              <div className="space-y-1">
                                <span className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs">
                                  <GraduationCap size={14} className="text-[#363991] shrink-0" />
                                  <span>Campus Administration &amp; Institutional Governance</span>
                                </span>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                  Full unhindered master access across all modules, notices, admissions, syllabus, faculty, and system security controls.
                                </p>
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-[#363991] border border-indigo-100 mt-1">
                                  Full Master Access (10/10)
                                </span>
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs">
                                    <GraduationCap size={14} className="text-[#363991] shrink-0" />
                                    <span>Work Areas &amp; Tasks</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => grantAllPermissions(u.id)}
                                    className="text-[11px] font-bold text-[#363991] hover:underline cursor-pointer"
                                  >
                                    Choose all tasks
                                  </button>
                                </div>

                                {/* Interactive Permission Badges in Black & White Theme */}
                                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                                  {PERMISSION_OPTIONS.map((opt) => {
                                    const isGranted = Boolean(draft.permissions?.[opt.key]);
                                    return (
                                      <label
                                        key={opt.key}
                                        className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[11px] cursor-pointer select-none transition ${isGranted
                                            ? "bg-[#1F242C] text-white border-[#1F242C] font-semibold"
                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                          }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isGranted}
                                          onChange={() => handlePermissionToggle(u.id, opt.key)}
                                          className="w-3 h-3 rounded border-slate-300 accent-black shrink-0"
                                        />
                                        <span className="truncate">{opt.label}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </td>

                          {/* COLUMN 4: ACTIONS */}
                          <td className="py-3 px-4 align-top text-right">
                            {isSuperAdmin ? (
                              <div className="text-right">
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 italic">
                                  <Lock size={12} /> Master Account Protected
                                </span>
                              </div>
                            ) : isPending ? (
                              <div className="space-y-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleVerifyAndApprove(u)}
                                  disabled={isSaving}
                                  className="w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-bold shadow-xs transition disabled:opacity-60 cursor-pointer"
                                >
                                  <ShieldCheck size={13} />
                                  <span>{isSaving ? "Verifying…" : "Verify & Grant Access"}</span>
                                </button>
                                <div className="flex items-center justify-end">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteUser(u)}
                                    disabled={isSaving}
                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                                    title="Delete access record"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSavePermissions(u)}
                                  disabled={isSaving}
                                  className="w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-[#1F242C] hover:bg-black text-white rounded-md text-xs font-bold shadow-xs transition disabled:opacity-60 cursor-pointer"
                                >
                                  <span>{isSaving ? "Saving…" : "Save task choices"}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleSendVerificationEmail(u)}
                                  disabled={isSaving}
                                  title="Send password reset and email verification link to user's inbox"
                                  className="w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-md text-xs font-semibold border border-slate-300 transition disabled:opacity-60 cursor-pointer"
                                >
                                  <Mail size={12} className="text-[#363991]" />
                                  <span>Send Setup Link</span>
                                </button>

                                <div className="flex items-center justify-between gap-1 pt-0.5">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleActive(u, !u.active)}
                                    disabled={isSaving}
                                    className={`flex-1 inline-flex items-center justify-center gap-1 px-2 py-1 rounded text-[11px] font-semibold border transition cursor-pointer ${u.active
                                        ? "border-amber-200 text-amber-800 bg-amber-50 hover:bg-amber-100"
                                        : "border-emerald-200 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                                      }`}
                                  >
                                    {u.active ? "Suspend" : "Reactivate"}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteUser(u)}
                                    disabled={isSaving}
                                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer shrink-0"
                                    title="Delete access record"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile App Cards View for Administration Users */}
              <div className="block lg:hidden divide-y divide-slate-200 bg-white">
                {filteredUsers.map((u) => {
                  const isSuperAdmin = u.email?.toLowerCase() === SUPER_ADMIN_EMAIL;
                  const draft = editStates[u.id] || {
                    role: u.role || "staff",
                    permissions: normalizePermissions(u.permissions),
                  };
                  const isPending =
                    u.verified !== true || u.status === "pending_verification";
                  const isSaving = savingId === u.id;
                  const lastLoginFormatted = formatTimestamp(u.lastLoginAt);

                  return (
                    <div key={u.id} className="p-4 space-y-3">
                      {/* Header: Name, Email & Status */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block text-sm truncate">
                            {u.displayName || u.email}
                          </span>
                          {u.email && (
                            <a
                              href={`mailto:${u.email}`}
                              className="text-xs text-blue-700 hover:underline block mt-0.5 truncate"
                            >
                              {u.email}
                            </a>
                          )}
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0">
                          {isSuperAdmin ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1F242C] text-white uppercase tracking-wider">
                              <ShieldCheck size={10} /> Master
                            </span>
                          ) : isPending ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
                              <Clock size={10} /> Pending
                            </span>
                          ) : u.active ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                              <CheckCircle2 size={10} /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 uppercase tracking-wider">
                              <UserX size={10} /> Suspended
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Role & Last Login */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                        <div>
                          {isSuperAdmin ? (
                            <span className="font-bold text-slate-900 text-xs">
                              Principal / Super Admin
                            </span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500 font-semibold">Role:</span>
                              <select
                                value={draft.role || "staff"}
                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                className="px-2 py-0.5 rounded border border-slate-300 text-xs font-bold bg-white text-slate-800 outline-none"
                              >
                                <option value="staff">Staff</option>
                                <option value="principal">Principal</option>
                              </select>
                            </div>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          Last login: <strong className="text-slate-700">{lastLoginFormatted || "Never"}</strong>
                        </span>
                      </div>

                      {/* Work Areas & Tasks */}
                      <div className="pt-2 border-t border-slate-100">
                        {isSuperAdmin ? (
                          <p className="text-xs text-slate-500">
                            Full master access across all institutional management modules.
                          </p>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-700">Work Areas & Tasks</span>
                              <button
                                type="button"
                                onClick={() => grantAllPermissions(u.id)}
                                className="text-[11px] font-bold text-[#363991] hover:underline cursor-pointer"
                              >
                                Choose all
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                              {PERMISSION_OPTIONS.map((opt) => {
                                const isGranted = Boolean(draft.permissions?.[opt.key]);
                                return (
                                  <button
                                    key={opt.key}
                                    type="button"
                                    onClick={() => handlePermissionToggle(u.id, opt.key)}
                                    className={`flex items-center justify-between p-1.5 rounded text-[11px] font-semibold border transition text-left cursor-pointer ${isGranted
                                        ? "bg-[#1F242C] text-white border-[#1F242C]"
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                      }`}
                                  >
                                    <span className="truncate">{opt.label}</span>
                                    {isGranted && <CheckCircle size={10} className="shrink-0 text-emerald-400" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions Strip */}
                      <div className="pt-2 border-t border-slate-100">
                        {isSuperAdmin ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500">
                            <Lock size={12} /> Master Account Protected
                          </span>
                        ) : isPending ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleVerifyAndApprove(u)}
                              disabled={isSaving}
                              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition disabled:opacity-60 cursor-pointer"
                            >
                              <ShieldCheck size={14} />
                              <span>{isSaving ? "Verifying…" : "Verify & Grant Access"}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u)}
                              disabled={isSaving}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition cursor-pointer"
                              title="Delete access record"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleSavePermissions(u)}
                                disabled={isSaving}
                                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-[#1F242C] hover:bg-black text-white rounded-lg text-xs font-bold shadow-xs transition disabled:opacity-60 cursor-pointer"
                              >
                                <span>{isSaving ? "Saving…" : "Save task choices"}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSendVerificationEmail(u)}
                                disabled={isSaving}
                                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition disabled:opacity-60 cursor-pointer"
                              >
                                <Mail size={13} className="text-[#363991]" />
                                <span>Send Setup Link</span>
                              </button>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleActive(u, !u.active)}
                                disabled={isSaving}
                                className={`flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${u.active
                                    ? "border-amber-200 text-amber-800 bg-amber-50 hover:bg-amber-100"
                                    : "border-emerald-200 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                                  }`}
                              >
                                {u.active ? "Suspend User" : "Reactivate User"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u)}
                                disabled={isSaving}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition cursor-pointer"
                                title="Delete access record"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* MODAL: PROVISION NEW USER - FULLSCREEN ON MOBILE */}
      {isProvisionOpen && (
        <div
          className="fixed inset-0 z-50 flex items-stretch justify-stretch p-0 bg-white sm:bg-slate-900/60 sm:backdrop-blur-sm sm:items-center sm:justify-center sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsProvisionOpen(false)}
        >
          <div
            className="relative w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] sm:h-auto sm:max-w-lg sm:max-h-[90vh] bg-white rounded-none sm:rounded-2xl shadow-none sm:shadow-2xl border-0 sm:border border-slate-200 overflow-hidden flex flex-col animate-in fade-in sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 sm:py-4 border-b border-slate-100 bg-white sm:bg-slate-50/90 shrink-0">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsProvisionOpen(false)}
                  className="sm:hidden p-2 -ml-1 text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  aria-label="Back"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#363991] border border-indigo-100 hidden sm:flex items-center justify-center shrink-0">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    Provision New Portal User
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Create administrative account with automatic verification link
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsProvisionOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200 transition cursor-pointer"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleProvisionUserSubmit} className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4 -webkit-overflow-scrolling-touch">
              {provisionError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                  <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                  <span>{provisionError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name / Designation <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={provisionName}
                  onChange={(e) => setProvisionName(e.target.value)}
                  placeholder="e.g. Dr. Priya Verma (Faculty)"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#363991] focus:ring-2 focus:ring-[#363991]/15 transition bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Institutional Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={provisionEmail}
                  onChange={(e) => setProvisionEmail(e.target.value)}
                  placeholder="e.g. priya.verma@haryanashakti.ac.in"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 outline-none focus:border-[#363991] focus:ring-2 focus:ring-[#363991]/15 transition font-mono bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Administrative Role
                </label>
                <select
                  value={provisionRole}
                  onChange={(e) => setProvisionRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-800 outline-none focus:border-[#363991] focus:ring-2 focus:ring-[#363991]/15 font-medium transition bg-white"
                >
                  <option value="staff">Staff</option>
                  <option value="principal">Principal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Choose the work areas for this person
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50">
                  {PERMISSION_OPTIONS.map((opt) => {
                    const isChecked = Boolean(provisionPermissions[opt.key]);
                    return (
                      <label
                        key={opt.key}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer select-none transition ${isChecked
                            ? "bg-[#1F242C] text-white border-[#1F242C] font-semibold"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
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
                          className="w-3.5 h-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 accent-black"
                        />
                        <span className="truncate">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg bg-indigo-50/80 p-3 border border-indigo-100 text-xs text-[#363991] flex items-start gap-2.5">
                <Mail size={16} className="text-[#363991] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Verification &amp; Password link:</strong> An official invitation will be sent to the user&apos;s email allowing them to securely set their password and verify access.
                </p>
              </div>

              {/* Modal Actions */}
              <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-slate-100 bg-white sm:bg-transparent shadow-[0_-4px_16px_rgba(0,0,0,0.05)] sm:shadow-none -mx-4 -mb-4 sm:mx-0 sm:mb-0 px-4 sm:px-0">
                <button
                  type="button"
                  onClick={() => setIsProvisionOpen(false)}
                  disabled={provisioning}
                  className="w-full sm:w-auto px-4 py-3 sm:py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={provisioning}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-[#363991] hover:bg-[#2A3178] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition disabled:opacity-60 cursor-pointer text-center"
                >
                  {provisioning ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Provisioning Account…</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
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
