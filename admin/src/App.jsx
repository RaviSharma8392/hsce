import { lazy, Suspense, useState } from "react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import {
  BookOpenCheck,
  Bot,
  CalendarDays,
  Clock,
  ExternalLink,
  GraduationCap,
  Images,
  Megaphone,
  MessageSquareText,
  PanelsTopLeft,
  RefreshCw,
  Settings,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UsersRound,
} from "lucide-react";
import PortalWatermark from "./components/common/PortalWatermark";
import { useAuthState, SUPER_ADMIN_EMAIL } from "./hooks/useAuthState";
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const FacultyPage = lazy(() => import("./pages/FacultyPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const HomepagePopupPage = lazy(() => import("./pages/HomepagePopupPage"));
const NoticesPage = lazy(() => import("./pages/NoticesPage"));
const CommitteesPage = lazy(() => import("./pages/CommitteesPage"));
const SiteSettingsPage = lazy(() => import("./pages/SiteSettingsPage"));
const EnquiriesPage = lazy(() => import("./pages/EnquiriesPage"));
const ChatbotEnquiriesPage = lazy(() => import("./pages/ChatbotEnquiriesPage"));
const CampusToursPage = lazy(() => import("./pages/CampusToursPage"));
const SyllabusPage = lazy(() => import("./pages/SyllabusPage"));
const AdminUsersPage = lazy(() => import("./pages/AdminUsersPage"));

function PendingVerificationNotice({ user, logout, checkAuth }) {
  const [checking, setChecking] = useState(false);

  const handleRecheck = async () => {
    setChecking(true);
    try {
      if (typeof checkAuth === "function") {
        await checkAuth();
      }
    } finally {
      setTimeout(() => setChecking(false), 800);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900 font-sans overflow-hidden">
      <PortalWatermark isDark={false} />
      <section className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-9 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-3.5 pb-4 mb-5 border-b border-slate-100">
          <img
            src="/assets/brand/college-logo.png"
            width="432"
            height="432"
            alt="HSCE Crest"
            className="h-12 w-auto object-contain"
          />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
              Awaiting Principal Verification
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-1">Account Pending Approval</h1>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Welcome, <strong className="text-slate-900">{user.email}</strong>. Your administrative account has been registered, but your portal access and role permissions must be verified and granted by the college administrator.
          </p>

          <div className="rounded-xl bg-slate-50/80 p-4 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Verification Authority</span>
              <span className="font-bold text-slate-800">Principal / Administrator</span>
            </div>
            <div className="flex items-center justify-between text-slate-700 font-medium">
              <span>Authority Name:</span>
              <span className="font-bold text-slate-900">Ravi Sharma</span>
            </div>
            <div className="flex items-center justify-between text-slate-700 font-medium">
              <span>Official Email:</span>
              <span className="font-mono text-blue-700 font-bold">sharmaravi8392@gmail.com</span>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50/70 p-3.5 border border-blue-200/70 text-xs text-blue-950 flex items-start gap-2.5">
            <Clock size={16} className="text-blue-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>User self-verification is not required.</strong> Principal Ravi Sharma reviews all account requests directly from the Access Governance console and allocates your permissions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-blue-800 transition-colors shadow-2xs disabled:opacity-60"
              onClick={handleRecheck}
              disabled={checking}
              type="button"
            >
              <RefreshCw size={14} className={checking ? "animate-spin" : ""} />
              <span>{checking ? "Checking Approval…" : "Check Verification Status"}</span>
            </button>

            <button
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              onClick={logout}
              type="button"
            >
              Sign out
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

const navigationGroups = [
  {
    label: "Access Governance",
    principalOnly: true,
    links: [
      {
        path: "/manage/admin-users",
        label: "Admin access & approvals",
        Icon: UserCheck,
      },
    ],
  },
  {
    label: "Admissions & student services",
    links: [
      {
        path: "/manage/enquiries",
        label: "Admission form enquiries",
        Icon: GraduationCap,
      },
      {
        path: "/manage/chatbot-enquiries",
        label: "Chatbot enquiries",
        Icon: Bot,
      },
      {
        path: "/manage/feedback",
        label: "Contact & feedback",
        Icon: MessageSquareText,
      },
      {
        path: "/manage/grievances",
        label: "Student grievances",
        Icon: ShieldAlert,
      },
      {
        path: "/manage/tours",
        label: "Campus visit requests",
        Icon: CalendarDays,
      },
    ],
  },
  {
    label: "Website content",
    links: [
      {
        path: "/manage/notices",
        label: "Notices & circulars",
        Icon: Megaphone,
      },
      {
        path: "/manage/homepage-popup",
        label: "Homepage popup",
        Icon: PanelsTopLeft,
      },
      { path: "/manage/gallery", label: "Campus gallery", Icon: Images },
      {
        path: "/manage/committees",
        label: "Committees & cells",
        Icon: ShieldAlert,
      },
      {
        path: "/manage/settings",
        label: "Institutional settings",
        Icon: Settings,
      },
    ],
  },
  {
    label: "Academic records",
    links: [
      { path: "/manage/faculty", label: "Faculty & staff", Icon: UsersRound },
      {
        path: "/manage/syllabus",
        label: "Course syllabus",
        Icon: BookOpenCheck,
      },
    ],
  },
];

const CURRENT_YEAR = new Date().getFullYear();

function AdminPortal({ user, role, permissions = {}, logout }) {
  const isPrincipalUser =
    role === "principal" ||
    (user?.email || "").toLowerCase() === SUPER_ADMIN_EMAIL;

  return (
    <div className="admin-frame relative font-sans">
      {/* Background Institutional Security Watermark for Administrative Workspace */}
      <div className="pointer-events-none fixed inset-0 lg:left-[260px] z-0 overflow-hidden flex items-center justify-center">
        <PortalWatermark isDark={false} showRepeatingPattern={true} />
      </div>

      <aside className="admin-rail z-10 relative">
        <NavLink
          to="/manage/notices"
          className="admin-brand group"
          aria-label="HSCE Admin home">
          <div className="relative p-1 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs group-hover:border-blue-300 transition-colors shrink-0">
            <img
              src="/assets/brand/college-logo.png"
              width="432"
              height="432"
              alt="HSCE Logo"
              className="admin-rail-logo"
            />
          </div>
          <span className="admin-brand-copy">
            <strong>Haryana Shakti College</strong>
            <small>COLLEGE ADMINISTRATION</small>
          </span>
        </NavLink>
        <div className="admin-rail-heading">
          <div className="flex items-center gap-1.5 text-blue-700">
            <ShieldCheck size={13} />
            <span>COLLEGE MANAGEMENT</span>
          </div>
          <small>Manage campus services and website content</small>
        </div>
        <nav aria-label="College administration" className="admin-navigation">
          {navigationGroups
            .filter((group) => !group.principalOnly || isPrincipalUser)
            .map((group) => (
              <section
                key={group.label}
                className="admin-navigation-group"
                aria-label={group.label}>
                <h2>{group.label}</h2>
                {group.links.map(({ path, label, Icon }) => (
                  <NavLink key={path} to={path} end>
                    <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </section>
            ))}
        </nav>
        <div className="admin-rail-foot">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="min-w-0">
              <strong className="truncate">Administrator Session</strong>
              <small className="truncate">256-Bit SSL Encrypted</small>
            </div>
          </div>
        </div>
      </aside>
      <section className="admin-workspace flex flex-col justify-between min-h-screen relative z-10">
        <div>
          <header className="admin-topbar">
            <div className="admin-topbar-brand">
              {/* Only show logo in topbar on mobile screens where sidebar is hidden */}
              <div className="bg-white p-1 rounded-lg border border-slate-200/80 shadow-2xs shrink-0 lg:hidden">
                <img
                  src="/assets/brand/college-logo.png"
                  width="432"
                  height="432"
                  alt="Haryana Shakti College of Education logo"
                  className="admin-college-logo"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="admin-kicker font-bold tracking-wider text-xs text-blue-900">
                    HARYANA SHAKTI COLLEGE OF EDUCATION
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
                    NCTE &bull; GGSIPU
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Official College Administration Portal &bull; Session {CURRENT_YEAR}&ndash;{(CURRENT_YEAR + 1).toString().slice(-2)}
                </p>
              </div>
            </div>

            <div className="admin-account">
              {/* Live & Encrypted Status Pill */}
              <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Live Sync Active</span>
              </div>

              {/* View Public Website Link */}
              <a
                href="https://www.hscekanjhawala.com/"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors shrink-0"
              >
                <span>Public Website</span>
                <ExternalLink size={13} className="opacity-70" />
              </a>

              {/* Executive Administrator Profile Badge */}
              <div className="flex items-center gap-2.5 bg-slate-50/90 border border-slate-200/90 rounded-xl py-1 px-2.5 shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-blue-700 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                  {user.email ? user.email.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="hidden md:flex flex-col text-left leading-tight">
                  <span className="text-xs font-semibold text-slate-800 max-w-[170px] truncate" title={user.email}>
                    {user.email}
                  </span>
                  <span className="text-[10px] font-semibold text-blue-700 tracking-wide">
                    Principal / Admin
                  </span>
                </div>
                <button
                  className="ml-1 text-xs font-semibold text-slate-500 hover:text-red-700 hover:bg-red-50/80 px-2 py-1 rounded-md transition-colors"
                  onClick={logout}
                  type="button"
                  title="Sign out of administrative portal"
                >
                  Sign out
                </button>
              </div>
            </div>
          </header>
          <div className="admin-content">
            <Suspense fallback={<main className="admin-message" role="status">Loading portal page…</main>}>
            <Routes>
              <Route
                path="enquiries"
                element={
                  <EnquiriesPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                  />
                }
              />
              <Route
                path="chatbot-enquiries"
                element={
                  <ChatbotEnquiriesPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                  />
                }
              />
              <Route
                path="feedback"
                element={
                  <EnquiriesPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                  />
                }
              />
              <Route
                path="grievances"
                element={
                  <EnquiriesPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                  />
                }
              />
              <Route
                path="tours"
                element={
                  <CampusToursPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                  />
                }
              />
              <Route
                path="notices"
                element={
                  <NoticesPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                    permissions={permissions}
                  />
                }
              />
              <Route
                path="gallery"
                element={
                  <GalleryPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                    permissions={permissions}
                  />
                }
              />
              <Route
                path="syllabus"
                element={
                  <SyllabusPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                    permissions={permissions}
                  />
                }
              />
              <Route
                path="documents"
                element={<Navigate to="/manage/notices" replace />}
              />
              <Route
                path="homepage-messages"
                element={<Navigate to="/manage/notices" replace />}
              />
              <Route
                path="committees"
                element={
                  <CommitteesPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                    permissions={permissions}
                  />
                }
              />
              <Route
                path="settings"
                element={
                  <SiteSettingsPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                    permissions={permissions}
                  />
                }
              />
              <Route
                path="homepage-popup"
                element={
                  <HomepagePopupPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                    permissions={permissions}
                  />
                }
              />
              <Route
                path="faculty"
                element={
                  <FacultyPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                    permissions={permissions}
                  />
                }
              />
              <Route
                path="admin-users"
                element={
                  isPrincipalUser ? (
                    <AdminUsersPage currentUser={user} />
                  ) : (
                    <Navigate to="/manage/notices" replace />
                  )
                }
              />
              <Route
                path="*"
                element={<Navigate to="/manage/notices" replace />}
              />
            </Routes>
            </Suspense>
          </div>
        </div>
        <footer className="admin-footer relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 py-4 px-6 border-t border-slate-200/90 bg-white/90 backdrop-blur-xs">
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-slate-700">
              &copy; {CURRENT_YEAR} Haryana Shakti College of Education. All rights reserved.
            </span>
            <span className="text-[11px] text-slate-400">
              Approved by NCTE &bull; Affiliated to Guru Gobind Singh Indraprastha University (GGSIPU), Delhi
            </span>
          </div>
          <div className="flex flex-col sm:items-end gap-0.5 text-[11px] text-slate-400">
            <span className="font-semibold text-blue-700">
              Official Administration Suite &bull; SSL 256-Bit Encrypted
            </span>
            <span>
              Restricted computer system &bull; Managed by Ravi Sharma
            </span>
          </div>
        </footer>
      </section>
    </div>
  );
}

function AuthenticatedWorkspace({ user, role, permissions, logout }) {
  return (
    <Suspense fallback={<main className="admin-message" role="status">Loading portal page…</main>}>
    <Routes>
      <Route
        path="/manage/*"
        element={
          <AdminPortal
            user={user}
            role={role}
            permissions={permissions}
            logout={logout}
          />
        }
      />
      <Route
        path="/dashboard"
        element={<Navigate to="/manage/notices" replace />}
      />
      <Route
        path="/principal/*"
        element={<Navigate to="/manage/notices" replace />}
      />
      <Route path="*" element={<Navigate to="/manage/notices" replace />} />
    </Routes>
    </Suspense>
  );
}

export default function App() {
  const { user, role, permissions, loading, logout, checkAuth } = useAuthState();

  if (loading)
    return (
      <main className="admin-message" aria-live="polite">
        Loading secure portal…
      </main>
    );

  if (user && !role) {
    return (
      <PendingVerificationNotice
        user={user}
        logout={logout}
        checkAuth={checkAuth}
      />
    );
  }

  return (
    <Suspense fallback={<main className="admin-message" role="status">Loading portal page…</main>}>
    <Routes>
      {/* PUBLIC PORTAL ENTRYWAYS (UNAUTHENTICATED) */}
      <Route
        path="/admin/register"
        element={<Navigate to="/admin/signin" replace />}
      />
      <Route
        path="/admin/signin"
        element={
          user ? <Navigate to="/manage/notices" replace /> : <LoginPage />
        }
      />
      <Route
        path="/"
        element={
          <Navigate to={user ? "/manage/notices" : "/admin/signin"} replace />
        }
      />
      <Route
        path="/login"
        element={
          <Navigate to={user ? "/manage/notices" : "/admin/signin"} replace />
        }
      />
      <Route
        path="/login/staff"
        element={<Navigate to="/admin/signin" replace />}
      />
      <Route
        path="/login/principal"
        element={<Navigate to="/admin/signin" replace />}
      />
      <Route
        path="/forgot-password"
        element={user ? <Navigate to="/" replace /> : <ForgotPasswordPage />}
      />

      {/* AUTHENTICATED WORKSPACES */}
      <Route
        path="/*"
        element={
          user ? (
            <AuthenticatedWorkspace
              user={user}
              role={role}
              permissions={permissions}
              logout={logout}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
    </Suspense>
  );
}
