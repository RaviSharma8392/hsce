import React from "react";
import QuickAccessFeatures from "../components/dashboard/QuickAccessFeatures";
import DashboardProfileCard from "../components/dashboard/DashboardProfileCard";
import DashboardNoticesManager from "../components/dashboard/DashboardNoticesManager";

export default function DashboardPage({ user, logout, isPrincipalUser }) {
  const isPrincipal = isPrincipalUser === true;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <section className="dashboard-intro">
        <div>
          <span className="admin-kicker">
            {isPrincipal ? "EXECUTIVE DESK" : "ADMINISTRATOR WORKSPACE"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            {isPrincipal
              ? "Principal Executive Portal"
              : "Staff Operations Console"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isPrincipal
              ? "Oversee college governance, review circulars, and manage public publications."
              : "Manage public information and official website notices for Haryana Shakti College of Education."}
          </p>
        </div>
      </section>

      {/* 2-Column Split: Left Side Features, Right Side Blue Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Easily Accessible Features */}
        <div className="lg:col-span-7">
          <QuickAccessFeatures role={isPrincipal ? "principal" : "staff"} />
        </div>

        {/* Right Side: Profile Card in Blue Colors */}
        <div className="lg:col-span-5">
          <DashboardProfileCard
            user={user}
            role={isPrincipal ? "principal" : "staff"}
            logout={logout}
          />
        </div>
      </div>

      {/* Website Notices Section (Check details, edit, add, toggle status) */}
      <section>
        <DashboardNoticesManager
          role={isPrincipal ? "principal" : "staff"}
          currentUser={user}
        />
      </section>

      {/* Protected Workspace Security Note */}
      <section className="dashboard-note rounded-xl">
        <span className="admin-status-dot" />
        <p className="text-xs">
          <strong>Protected institutional workspace</strong>
          <br />
          All actions, notice publications, and regulatory document uploads are
          verified and encrypted under NCTE compliance and institutional
          administrative standards.
        </p>
      </section>
    </div>
  );
}
