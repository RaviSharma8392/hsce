import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Menu,
  X,
  ExternalLink,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function AdminMobileNav({
  user,
  isPrincipalUser,
  visibleNavigationGroups = [],
  logout,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigationLinks = useMemo(
    () => visibleNavigationGroups.flatMap((group) => group.links),
    [visibleNavigationGroups],
  );

  const isCurrentActive = useCallback(
    (path) => {
      if (path === "/manage/home") {
        return (
          location.pathname === "/manage/home" ||
          location.pathname === "/manage"
        );
      }
      return (
        location.pathname === path || location.pathname.startsWith(`${path}/`)
      );
    },
    [location.pathname],
  );

  const bottomLinks = useMemo(() => {
    const home = navigationLinks.find((link) => link.path === "/manage/home");
    const preferredPaths = [
      "/manage/enquiries",
      "/manage/notices",
      "/manage/faculty",
      "/manage/chatbot-enquiries",
      "/manage/feedback",
      "/manage/grievances",
      "/manage/tours",
      "/manage/gallery",
      "/manage/syllabus",
      "/manage/homepage-popup",
      "/manage/admin-users",
    ];
    const availableLinks = preferredPaths
      .map((path) => navigationLinks.find((link) => link.path === path))
      .filter(Boolean);
    const activeLink = navigationLinks.find(({ path }) => isCurrentActive(path));
    const shortcuts = availableLinks.slice(0, 3);

    if (
      activeLink &&
      activeLink.path !== home?.path &&
      !shortcuts.some(({ path }) => path === activeLink.path)
    ) {
      if (shortcuts.length === 3) shortcuts[2] = activeLink;
      else shortcuts.push(activeLink);
    }

    return [home, ...shortcuts].filter(Boolean);
  }, [navigationLinks, isCurrentActive]);

  const shortLabel = (label) =>
    ({
      "Admission requests": "Admissions",
      "Website chat questions": "Chat",
      "Contact messages": "Contact",
      "Student concerns": "Concerns",
      "Campus visit requests": "Visits",
      "Notices and circulars": "Notices",
      "Homepage announcement": "Announcement",
      "Campus photos": "Photos",
      "Faculty and staff": "Faculty",
      "Course documents": "Courses",
      "Staff accounts": "Accounts",
    })[label] || label;

  useEffect(() => {
    if (!drawerOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [drawerOpen]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const navItemClass = (isActive) =>
    `flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1 text-[10px] font-semibold transition-all select-none active:scale-95 ${
      isActive ? "text-[#363991] font-bold" : "text-slate-500 hover:text-slate-900"
    }`;

  return (
    <>
      <header className="admin-mobile-header sticky top-0 z-30 flex items-center justify-between px-3.5 pb-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs lg:hidden">
        <NavLink
          to="/manage/home"
          className="flex items-center gap-2.5 min-w-0"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 p-0.5 shrink-0 flex items-center justify-center shadow-2xs">
            <img
              src="/assets/brand/college-logo.png"
              width="432"
              height="432"
              alt="HSCE Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-tight text-slate-900 truncate">
                HSCE Admin
              </span>
            </div>
            <p className="text-[10px] text-slate-500 truncate leading-none mt-0.5">
              {navigationLinks.find(({ path }) => isCurrentActive(path))?.label ||
                (isPrincipalUser ? "Principal Desk" : "Staff Portal")}
            </p>
          </div>
        </NavLink>

        <div className="flex items-center gap-2">
          <a
            href="https://www.hscekanjhawala.com/"
            target="_blank"
            rel="noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
            title="Public Website"
            aria-label="Open the public website in a new tab"
          >
            <ExternalLink size={18} />
          </a>

          <button
            type="button"
            onClick={() => setDrawerOpen((prev) => !prev)}
            aria-label={drawerOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={drawerOpen}
            aria-controls="admin-mobile-drawer"
            className="flex h-10 items-center gap-2 rounded-xl bg-slate-100 px-2.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-200"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#363991] text-[10px] font-bold text-white">
              {user.email ? user.email.charAt(0).toUpperCase() : "A"}
            </div>
            {drawerOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      <nav
        aria-label="Admin mobile navigation"
        className="admin-mobile-bottom-nav fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] px-1.5 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] lg:hidden"
      >
        <div className="mx-auto flex max-w-md items-stretch justify-around">
          {bottomLinks.map(({ path, label, Icon }) => {
            const active = isCurrentActive(path);
            const ItemIcon =
              path === "/manage/home" ? LayoutDashboard : Icon;
            return (
              <NavLink
                key={path}
                to={path}
                aria-label={label}
                onClick={() => setDrawerOpen(false)}
                className={navItemClass(active)}
              >
                <span
                  className={`flex h-8 w-12 items-center justify-center rounded-full transition-all duration-200 ${
                    active ? "bg-[#363991] text-white shadow-xs" : "text-slate-600"
                  }`}
                >
                  <ItemIcon size={19} strokeWidth={active ? 2.3 : 1.8} />
                </span>
                <span className="max-w-full truncate">{shortLabel(label)}</span>
              </NavLink>
            );
          })}
          <button
            type="button"
            onClick={() => setDrawerOpen((prev) => !prev)}
            aria-expanded={drawerOpen}
            aria-label={drawerOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-controls="admin-mobile-drawer"
            className={navItemClass(drawerOpen)}
          >
            <div
              className={`flex h-8 w-12 items-center justify-center rounded-full transition-all duration-200 ${
                drawerOpen ? "bg-[#363991] text-white shadow-xs" : "text-slate-600"
              }`}
            >
              {drawerOpen ? <X size={19} /> : <Menu size={19} />}
            </div>
            <span>Menu</span>
          </button>
        </div>
      </nav>

      {drawerOpen && (
        <div
          className="admin-mobile-drawer-backdrop fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs lg:hidden animate-fade-in"
          role="presentation"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            id="admin-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Administration menu"
            className="admin-mobile-drawer w-full h-[100dvh] min-h-[100dvh] max-h-[100dvh] bg-white rounded-none shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 px-4 sm:px-6 flex items-center justify-between border-b border-slate-100 bg-slate-50/90 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#363991] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                  {user.email ? user.email.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="min-w-0">
                  <strong className="text-xs font-bold text-slate-900 block truncate max-w-[200px]">
                    {user.email}
                  </strong>
                  <span className="text-[10px] font-semibold text-[#363991] bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 inline-block">
                    {isPrincipalUser ? "Principal Authority" : "Staff Member"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200/60 hover:text-slate-900 active:scale-95 transition"
              >
                <X size={19} />
              </button>
            </div>

            <div className="admin-mobile-drawer-links overflow-y-auto p-4 space-y-4 flex-1 overscroll-contain">
              {visibleNavigationGroups.map((group) => (
                <div key={group.label} className="space-y-1">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                    {group.label}
                  </h3>
                  <div className="space-y-0.5">
                    {group.links.map(({ path, label, description, Icon }) => {
                      const active = isCurrentActive(path);
                      return (
                        <NavLink
                          key={path}
                          to={path}
                          onClick={() => setDrawerOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={`flex min-h-14 items-center justify-between px-3 py-2.5 rounded-xl transition ${
                            active
                              ? "bg-indigo-50 text-[#363991] font-bold border border-indigo-100"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`p-1.5 rounded-lg ${
                                active
                                  ? "bg-[#363991] text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              <Icon size={16} />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-semibold block truncate">
                                {label}
                              </span>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {description}
                              </span>
                            </div>
                          </div>
                          <ChevronRight
                            size={14}
                            className={`shrink-0 ${
                              active ? "text-[#363991]" : "text-slate-300"
                            }`}
                          />
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-mobile-drawer-actions p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-slate-100 bg-slate-50/90 flex items-center justify-between gap-3 shrink-0">
              <a
                href="https://www.hscekanjhawala.com/"
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
              >
                <ExternalLink size={13} />
                <span>Public Website</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  logout();
                }}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100 active:scale-95 cursor-pointer"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
