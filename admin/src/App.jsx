import { lazy, Suspense, useState } from "react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import {
  BookOpenCheck,
  Bot,
  CalendarDays,
  Clock,
  ExternalLink,
  GraduationCap,
  LayoutDashboard,
  Images,
  Megaphone,
  MessageSquareText,
  PanelsTopLeft,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UsersRound,
} from "lucide-react";
import PortalWatermark from "./components/common/PortalWatermark";
import AdminMobileNav from "./components/layout/AdminMobileNav";
import { useAuthState, SUPER_ADMIN_EMAIL } from "./hooks/useAuthState";
const LoginPage = lazy(() => import("./pages/LoginPage"));
const FacultyPage = lazy(() => import("./pages/FacultyPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const HomepagePopupPage = lazy(() => import("./pages/HomepagePopupPage"));
const NoticesPage = lazy(() => import("./pages/NoticesPage"));
const SiteSettingsPage = lazy(() => import("./pages/SiteSettingsPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const EnquiriesPage = lazy(() => import("./pages/EnquiriesPage"));
const ChatbotEnquiriesPage = lazy(() => import("./pages/ChatbotEnquiriesPage"));
const FeedbackPage = lazy(() => import("./pages/FeedbackPage"));
const GrievancesPage = lazy(() => import("./pages/GrievancesPage"));
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
              <strong>You do not need to verify your own account.</strong>{" "}
              The principal reviews your request and chooses which areas you
              can manage.
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
    label: "Start here",
    links: [
      {
        path: "/manage/home",
        label: "Home",
        description: "See the tasks available to you",
        Icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Manage accounts",
    principalOnly: true,
    links: [
      {
        path: "/manage/admin-users",
        label: "Staff accounts",
        description: "Approve access and assign work",
        Icon: UserCheck,
      },
    ],
  },
  {
    label: "Student and visitor messages",
    links: [
      {
        path: "/manage/enquiries",
        label: "Admission requests",
        description: "Review submitted admission forms",
        permission: "enquiries",
        Icon: GraduationCap,
      },
      {
        path: "/manage/chatbot-enquiries",
        label: "Website chat questions",
        description: "Read questions sent through the website chat",
        permission: "chatbotEnquiries",
        Icon: Bot,
      },
      {
        path: "/manage/feedback",
        label: "Contact messages",
        description: "Read messages sent from Contact Us",
        permission: "feedback",
        Icon: MessageSquareText,
      },
      {
        path: "/manage/grievances",
        label: "Student concerns",
        description: "Review and respond to student concerns",
        permission: "grievances",
        Icon: ShieldAlert,
      },
      {
        path: "/manage/tours",
        label: "Campus visit requests",
        description: "Confirm or update requested visits",
        permission: "tours",
        Icon: CalendarDays,
      },
    ],
  },
  {
    label: "Update the website",
    links: [
      {
        path: "/manage/notices",
        label: "Notices and circulars",
        description: "Add, update, or remove a notice",
        permission: "notices",
        Icon: Megaphone,
      },
      {
        path: "/manage/homepage-popup",
        label: "Homepage announcement",
        description: "Show or hide the homepage announcement",
        permission: "homepagePopup",
        Icon: PanelsTopLeft,
      },
      {
        path: "/manage/gallery",
        label: "Campus photos",
        description: "Add or update campus photos",
        permission: "gallery",
        Icon: Images,
      },
    ],
  },
  {
    label: "College information",
    links: [
      {
        path: "/manage/faculty",
        label: "Faculty and staff",
        description: "Update the public staff directory",
        permission: "faculty",
        Icon: UsersRound,
      },
      {
        path: "/manage/syllabus",
        label: "Course documents",
        description: "Update published syllabus files",
        permission: "syllabus",
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
  const canAccess = (permission) =>
    isPrincipalUser ||
    permissions.all === true ||
    permissions[permission] === true;
  const visibleNavigationGroups = navigationGroups
    .filter((group) => !group.principalOnly || isPrincipalUser)
    .map((group) => ({
      ...group,
      links: group.links.filter(
        (link) => !link.permission || canAccess(link.permission),
      ),
    }))
    .filter((group) => group.links.length > 0);
  const defaultPath =
    visibleNavigationGroups.flatMap((group) => group.links)[0]?.path ??
    "/manage/home";
  const requirePermission = (permission, page) =>
    canAccess(permission) ? page : <Navigate to={defaultPath} replace />;

  return (
    <div className="admin-frame relative font-sans">
      {/* Mobile-Only App Experience (App Top Bar, Bottom Bar, and Slide-up Navigation Drawer) */}
      <AdminMobileNav
        user={user}
        isPrincipalUser={isPrincipalUser}
        visibleNavigationGroups={visibleNavigationGroups}
        logout={logout}
      />

      {/* Desktop-Only Sidebar Rail (Kept 100% same as desktop design) */}
      <aside className="admin-rail z-10 relative hidden lg:flex">
        <NavLink
          to="/manage/home"
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
          <small>Choose a task from the list</small>
        </div>
        <nav aria-label="College administration tasks" className="admin-navigation">
          {visibleNavigationGroups.map((group) => (
              <section
                key={group.label}
                className="admin-navigation-group"
                aria-label={group.label}>
                <h2>{group.label}</h2>
                {group.links.map(({ path, label, description, Icon }) => (
                  <NavLink key={path} to={path} end title={description}>
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
              <strong className="truncate">You are signed in</strong>
              <small className="truncate">College administration</small>
            </div>
          </div>
        </div>
      </aside>

      <section className="admin-workspace flex flex-col justify-between min-h-screen relative z-10 pb-20 lg:pb-0">
        <div>
          {/* Desktop-Only Topbar (Kept 100% same as desktop design) */}
          <header className="admin-topbar hidden lg:flex">
            <div className="admin-topbar-brand">
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
                <span>Admin portal</span>
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
                    {isPrincipalUser ? "Principal" : "Staff account"}
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
                  requirePermission("enquiries", <EnquiriesPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                  />)
                }
              />
              <Route
                path="chatbot-enquiries"
                element={
                  requirePermission("chatbotEnquiries", <ChatbotEnquiriesPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                  />)
                }
              />
              <Route
                path="feedback"
                element={
                  requirePermission("feedback", <FeedbackPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                  />)
                }
              />
              <Route
                path="grievances"
                element={
                  requirePermission("grievances", <GrievancesPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                  />)
                }
              />
              <Route
                path="tours"
                element={
                  requirePermission("tours", <CampusToursPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                  />)
                }
              />
              <Route
                path="notices"
                element={
                  requirePermission("notices", <NoticesPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                    permissions={permissions}
                  />)
                }
              />
              <Route
                path="gallery"
                element={
                  requirePermission("gallery", <GalleryPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                    permissions={permissions}
                  />)
                }
              />
              <Route
                path="syllabus"
                element={
                  requirePermission("syllabus", <SyllabusPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                    permissions={permissions}
                  />)
                }
              />
              <Route
                path="documents"
                element={<Navigate to="/manage/home" replace />}
              />
              <Route
                path="homepage-messages"
                element={<Navigate to="/manage/home" replace />}
              />
              <Route
                path="committees"
                element={<Navigate to="/manage/home" replace />}
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
                  requirePermission("homepagePopup", <HomepagePopupPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                    permissions={permissions}
                  />)
                }
              />
              <Route
                path="faculty"
                element={
                  requirePermission("faculty", <FacultyPage
                    currentUser={user}
                    role={isPrincipalUser ? "principal" : "staff"}
                    permissions={permissions}
                  />)
                }
              />
              <Route
                path="admin-users"
                element={
                  isPrincipalUser ? (
                    <AdminUsersPage currentUser={user} />
                  ) : (
                    <Navigate to="/manage/home" replace />
                  )
                }
              />
              <Route
                path="home"
                element={
                  <DashboardPage
                    user={user}
                    logout={logout}
                    role={isPrincipalUser ? "principal" : "staff"}
                    permissions={permissions}
                  />
                }
              />
              <Route path="*" element={<Navigate to={defaultPath} replace />} />
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
              College administration
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
        element={<Navigate to="/manage/home" replace />}
      />
      <Route
        path="/principal/*"
        element={<Navigate to="/manage/home" replace />}
      />
      <Route path="*" element={<Navigate to="/manage/home" replace />} />
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
          user ? <Navigate to="/manage/home" replace /> : <LoginPage />
        }
      />
      <Route
        path="/"
        element={
          <Navigate to={user ? "/manage/home" : "/admin/signin"} replace />
        }
      />
      <Route
        path="/login"
        element={
          <Navigate to={user ? "/manage/home" : "/admin/signin"} replace />
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
        element={<Navigate to="/admin/signin" replace />}
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
