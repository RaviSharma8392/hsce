import { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { KeyRound, ShieldCheck, Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { auth, db, firebaseReady } from "../config/firebase";
import PortalWatermark from "../components/common/PortalWatermark";

export default function AdminRegistrationPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess(null);

    if (!firebaseReady) {
      setError("Firebase service is not configured. Please verify connection.");
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Enter the institutional email address.");
      return;
    }
    if (password.length < 8) {
      setError("Use a password with at least 8 characters.");
      return;
    }
    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create the Firebase Auth user account
      const credential = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        password,
      );

      // 2. Automatically record in adminUsers for Principal verification
      await setDoc(doc(db, "adminUsers", credential.user.uid), {
        uid: credential.user.uid,
        email: normalizedEmail,
        role: "staff",
        active: false,
        verified: false,
        status: "pending_verification",
        createdAt: serverTimestamp(),
        requestedAt: serverTimestamp(),
        requiresVerificationBy: "sharmaravi8392@gmail.com",
        permissions: {
          notices: false,
          enquiries: false,
          gallery: false,
          syllabus: false,
          homepagePopup: false,
        },
      });

      // 3. Immediately sign out the newly created user until Principal approves
      await signOut(auth).catch(() => {});

      setEmail("");
      setPassword("");
      setConfirmation("");
      setSuccess({
        email: normalizedEmail,
        uid: credential.user.uid,
      });
    } catch (registrationError) {
      console.error("Registration error:", registrationError);
      const errors = {
        "auth/email-already-in-use":
          "An account with this email already exists. Sign in or use Forgot password.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/weak-password":
          "Choose a stronger password with at least 8 characters.",
      };
      setError(
        errors[registrationError.code] ||
          "Could not submit the registration request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900 overflow-hidden font-sans">
      <PortalWatermark isDark={false} />

      <section className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] sm:p-9">
        <div className="mb-6 flex items-center gap-3.5 pb-4 border-b border-slate-100">
          <img
            src="/assets/brand/college-logo.png"
            alt="HSCE Crest"
            className="h-11 w-auto object-contain"
          />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 inline-block">
              HSCE Administrator Access
            </p>
            <h1 className="text-xl font-bold text-slate-900 mt-1">Request Admin Account</h1>
          </div>
        </div>

        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 text-sm text-emerald-950 space-y-3.5">
            <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base">
              <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
              <span>Registration Request Submitted</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Your account request for <strong className="text-slate-900">{success.email}</strong> has been successfully registered in the central system.
            </p>

            <div className="rounded-lg bg-white p-3.5 border border-emerald-200/80 text-xs space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-2 font-semibold text-blue-900">
                <ShieldCheck size={16} className="text-blue-700" />
                <span>Verification by Principal Required</span>
              </div>
              <p className="text-slate-600 leading-normal">
                Per institutional policy, <strong>user self-verification is not required</strong>.
                Account verification and access permissions are granted directly by:
              </p>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-800">Ravi Sharma (Principal / Administrator)</span>
                <span className="font-mono text-blue-700">sharmaravi8392@gmail.com</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/admin/signin"
                className="w-full inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-700 to-indigo-800 px-4 py-2.5 font-bold text-white hover:from-blue-800 hover:to-indigo-900 shadow-sm transition-all text-xs uppercase tracking-wider"
              >
                <span>Return to Admin Sign In</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-5 rounded-lg bg-blue-50/80 p-3.5 border border-blue-200/70 text-xs text-blue-950 flex items-start gap-2.5">
              <Clock size={16} className="text-blue-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900">Institutional Access Policy</p>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Accounts created here are verified directly by <strong>Principal Ravi Sharma (sharmaravi8392@gmail.com)</strong>. Self-verification is not needed.
                </p>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Institutional Email Address
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@haryanashakti.ac.in"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Administrative Password
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  placeholder="Repeat your password"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-xs text-red-800 border border-red-200 flex items-start gap-2">
                  <AlertCircle size={15} className="shrink-0 text-red-600 mt-0.5" />
                  <div>{error}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !firebaseReady}
                className="w-full inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-700 to-indigo-800 px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white hover:from-blue-800 hover:to-indigo-900 disabled:cursor-not-allowed disabled:opacity-60 shadow-md transition-all"
              >
                <KeyRound size={15} />
                {loading ? "Submitting Request…" : "Submit Account for Verification"}
              </button>
            </form>
          </>
        )}

        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-600">
          <span>Already have an approved account? </span>
          <Link
            to="/admin/signin"
            className="font-bold text-blue-700 hover:text-blue-900 hover:underline"
          >
            Sign In to Portal
          </Link>
        </div>
      </section>
    </main>
  );
}
