import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  ChevronLeft,
  KeyRound,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { auth, firebaseReady } from "../config/firebase";

const COLLEGE_LOGO_URL = "/assets/brand/college-logo.png";
const CAMPUS_HERO_BG =
  "https://res.cloudinary.com/dljt6vgkk/image/upload/f_auto,q_auto,w_1400/v1792002734/college-campus-hero_y0tjjk.png";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleReset = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    if (!firebaseReady) {
      setErrorMessage(
        "Authentication service is currently unavailable. Please verify Firebase configuration."
      );
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, trimmedEmail);
      setSuccessMessage(
        `A password reset link has been dispatched to ${trimmedEmail}. Please check your inbox.`
      );
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setErrorMessage("No account found with this email address.");
      } else if (err.code === "auth/invalid-email") {
        setErrorMessage("Please provide a valid email format.");
      } else if (err.code === "auth/too-many-requests") {
        setErrorMessage("Too many requests. Please try again after several minutes.");
      } else {
        setErrorMessage("Unable to send reset email. Please contact administration.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans">
      {/* ======================================================== */}
      {/* LEFT SECTION: Vibrant University Blue Hero               */}
      {/* ======================================================== */}
      <div
        className="relative flex flex-col justify-between w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 text-white min-h-[380px] lg:min-h-screen overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(14, 115, 240, 0.90) 0%, rgba(2, 85, 205, 0.94) 100%), url(${CAMPUS_HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Top-Left Logo & Identity */}
        <div className="flex items-center gap-3.5 z-10 relative">
          <div className="bg-white p-1.5 rounded-full shadow-md w-12 h-12 flex items-center justify-center shrink-0">
            <img
              src={COLLEGE_LOGO_URL}
              alt="Haryana Shakti College Crest"
              className="h-9 w-auto object-contain"
            />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold leading-tight tracking-tight text-white drop-shadow-xs">
              Haryana Shakti College of Education
            </h2>
            <p className="text-xs text-blue-100 font-normal mt-0.5">
              (Approved by NCTE &bull; Affiliated to GGSIPU)
            </p>
          </div>
        </div>

        {/* Center Welcome Statement */}
        <div className="my-auto py-10 z-10 relative max-w-lg">
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white tracking-tight leading-[1.2]">
            Welcome to Haryana Shakti<br />College of Education
          </h1>
          <p className="text-base sm:text-lg text-blue-100 mt-4 font-normal">
            &ldquo;Administrator Portal&rdquo;
          </p>
        </div>

        {/* Bottom Campus Location */}
        <div className="z-10 relative text-xs text-blue-100/90 font-normal">
          <span>Campus: Kanjhawala, North West Delhi - 110081</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT SECTION: Simple, Clean White Reset Form            */}
      {/* ======================================================== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-[420px] space-y-6">
          {/* Back to Sign In Link */}
          <div>
            <Link
              to="/admin/signin"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ChevronLeft size={16} />
              <span>Back To Sign In</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="flex items-center gap-3 pt-1">
            <div className="text-blue-600">
              <KeyRound size={32} strokeWidth={1.8} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              Reset Password
            </h2>
          </div>

          <p className="text-sm text-slate-600">
            Enter your institutional email address and we will dispatch a secure password reset link.
          </p>

          {/* Success Message */}
          {successMessage && (
            <div
              className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs sm:text-sm text-emerald-900 flex items-start gap-2"
              role="alert"
            >
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs sm:text-sm text-red-900 flex items-start gap-2"
              role="alert"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleReset} className="space-y-4 pt-1">
            <div>
              <label
                htmlFor="reset-email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                required
                className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 bg-[#f8faff] text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition"
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !firebaseReady}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-md text-sm tracking-wider uppercase transition shadow-xs flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>SEND RESET LINK</span>
              )}
            </button>
          </form>

          {/* Simple Clean Footer */}
          <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
            <p>Haryana Shakti College of Education &bull; Managed by Ravi Sharma</p>
          </div>
        </div>
      </div>
    </div>
  );
}
