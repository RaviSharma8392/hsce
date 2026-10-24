import React, { useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  BookOpen,
  Building2,
  Clock,
  Save,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db, firebaseReady } from "../config/firebase";

export default function StaffProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
  user,
}) {
  const [formData, setFormData] = useState({
    name: profile?.name || "Ravi Sharma",
    designation: profile?.designation || "Assistant Professor & Web Operations Coordinator",
    employeeId: profile?.employeeId || "HSCE-FAC-2024-08",
    department: profile?.department || "Teacher Education & ICT Cell",
    email: profile?.email || user?.email || "Ravisharmabhimtal@gmail.com12g",
    phone: profile?.phone || "+91 98112 45890",
    qualification: profile?.qualification || "M.Ed., M.Sc. (Computer Science), UGC-NET",
    subjects: profile?.subjects || "Pedagogy of Physical Science, ICT in Education, Modern Assessment",
    officeHours: profile?.officeHours || "Monday - Friday, 09:30 AM - 04:00 PM (Room 204)",
    bio:
      profile?.bio ||
      "Dedicated educator and IT coordinator committed to advancing teacher education and digital infrastructure at Haryana Shakti College of Education.",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // 1. Always persist to Frontend LocalStorage
      localStorage.setItem("hsce_staff_profile", JSON.stringify(formData));

      // 2. Sync to Backend Firestore if available
      if (firebaseReady) {
        try {
          const profileDocId = user?.uid || "current_staff";
          await setDoc(
            doc(db, "staffProfiles", profileDocId),
            {
              ...formData,
              updatedAt: new Date().toISOString(),
              updatedBy: user?.email || "staff",
            },
            { merge: true }
          );
        } catch (backendErr) {
          console.warn("Firestore profile sync notice:", backendErr.message);
        }
      }

      onSave(formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Login-Style Gradient & Blur */}
        <div className="bg-gradient-to-r from-[#0066FF] via-[#0252cf] to-[#1E3A8A] text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl backdrop-blur-sm transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center text-xl font-bold shadow-sm">
              {formData.name.charAt(0) || "S"}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-semibold text-blue-100 backdrop-blur-sm mb-1">
                <Sparkles size={11} />
                <span>Staff Profile Management</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Manage Staff Profile
              </h2>
              <p className="text-xs text-blue-100">
                Update personal, academic, and administrative credentials for Haryana Shakti College of Education
              </p>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {success && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-3.5 px-6 flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>Profile successfully updated and synchronized!</span>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-b border-red-200 p-3 px-6 text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <User size={13} className="text-[#0066FF]" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="portal-input !py-2.5"
                placeholder="e.g. Ravi Sharma"
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Briefcase size={13} className="text-[#0066FF]" />
                Designation / Role
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className="portal-input !py-2.5"
                placeholder="e.g. Assistant Professor & IT Coordinator"
              />
            </div>

            {/* Staff ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-[#0066FF]" />
                Staff Employee Code
              </label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="portal-input !py-2.5"
                placeholder="e.g. HSCE-FAC-2024-08"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Building2 size={13} className="text-[#0066FF]" />
                Department / Cell
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="portal-input !py-2.5"
                placeholder="e.g. Teacher Education & ICT Cell"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail size={13} className="text-[#0066FF]" />
                Registered Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="portal-input !py-2.5"
                placeholder="e.g. Ravisharmabhimtal@gmail.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone size={13} className="text-[#0066FF]" />
                Contact Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="portal-input !py-2.5"
                placeholder="e.g. +91 98112 45890"
              />
            </div>
          </div>

          {/* Academic Qualifications */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <GraduationCap size={13} className="text-[#0066FF]" />
              Academic Qualifications &amp; Accreditations
            </label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="portal-input !py-2.5"
              placeholder="e.g. M.Ed., M.Sc. Computer Science, UGC-NET Qualified"
            />
          </div>

          {/* Subjects Handled */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <BookOpen size={13} className="text-[#0066FF]" />
              Teaching Subjects &amp; Specializations
            </label>
            <input
              type="text"
              name="subjects"
              value={formData.subjects}
              onChange={handleChange}
              className="portal-input !py-2.5"
              placeholder="e.g. Pedagogy of Physical Science, Educational Tech, Teacher Ethics"
            />
          </div>

          {/* Office Hours */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Clock size={13} className="text-[#0066FF]" />
              Office Hours &amp; Room Location
            </label>
            <input
              type="text"
              name="officeHours"
              value={formData.officeHours}
              onChange={handleChange}
              className="portal-input !py-2.5"
              placeholder="e.g. Monday - Friday, 09:30 AM - 04:00 PM (Room 204)"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Staff Professional Statement / Bio
            </label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className="portal-input font-normal text-xs"
              placeholder="Brief professional background..."
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all focus:outline-none"
            >
              <Save size={14} />
              <span>{saving ? "Saving Changes..." : "Save Profile"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
