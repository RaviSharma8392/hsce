import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import {
  Eye,
  EyeOff,
  ChevronLeft,
  GraduationCap,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { auth, db, firebaseReady } from "../config/firebase";

const COLLEGE_LOGO_URL = "/assets/brand/college-logo.png";
const CAMPUS_HERO_BG =
  "https://res.cloudinary.com/dljt6vgkk/image/upload/f_auto,q_auto,w_1400/v1792002734/college-campus-hero_y0tjjk.png";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_SECONDS = 300; // 5 minutes

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(
    localStorage.getItem("hsce_remembered_admin_email") || ""
  );
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("hsce_remember_me") === "true"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Anti-brute force lockout state
  const [failedAttempts, setFailedAttempts] = useState(() => {
    const stored = localStorage.getItem("hsce_failed_logins");
    return stored ? Number(stored) : 0;
  });
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  useEffect(() => {
    if (localStorage.getItem("hsce_remember_me") !== "true") {
      localStorage.removeItem("hsce_remembered_admin_email");
    }

    // Check existing lockout timer
    const lockUntil = localStorage.getItem("hsce_lockout_until");
    if (lockUntil) {
      const remaining = Math.max(0, Math.ceil((Number(lockUntil) - Date.now()) / 1000));
      if (remaining > 0) {
        setLockoutRemaining(remaining);
      } else {
        localStorage.removeItem("hsce_lockout_until");
        localStorage.removeItem("hsce_failed_logins");
        setFailedAttempts(0);
      }
    }
  }, []);

  // Countdown timer for security lockout
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          localStorage.removeItem("hsce_lockout_until");
          localStorage.removeItem("hsce_failed_logins");
          setFailedAttempts(0);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  // Log authentication events to Firestore for administrative auditing
  const recordSecurityLog = async (email, outcome, details) => {
    try {
      if (!firebaseReady) return;
      await addDoc(collection(db, "securityLogs"), {
        email: (email || "").toLowerCase().trim(),
        outcome,
        details,
        timestamp: serverTimestamp(),
        deviceInfo: typeof navigator !== "undefined" ? navigator.userAgent : "Web Terminal",
      });
    } catch {
      // Non-blocking fallback
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (lockoutRemaining > 0) {
      setError(`Terminal locked due to excessive failed attempts. Please wait ${lockoutRemaining} seconds.`);
      return;
    }

    if (!firebaseReady) {
      setError("Administrative authentication service is currently unavailable. Please verify Firebase configuration.");
      return;
    }

    const trimmedIdentifier = identifier.trim().toLowerCase();

    if (!trimmedIdentifier || !password) {
      setError("Please provide your registered institutional email and password.");
      return;
    }

    try {
      setLoading(true);

      if (rememberMe) {
        localStorage.setItem("hsce_remembered_admin_email", trimmedIdentifier);
        localStorage.setItem("hsce_remember_me", "true");
      } else {
        localStorage.removeItem("hsce_remembered_admin_email");
        localStorage.removeItem("hsce_remember_me");
      }

      const userCredential = await signInWithEmailAndPassword(auth, trimmedIdentifier, password);

      // Reset failed attempts upon successful login
      localStorage.removeItem("hsce_failed_logins");
      localStorage.removeItem("hsce_lockout_until");
      setFailedAttempts(0);

      // Record successful login in security audit logs and update lastLoginAt
      await recordSecurityLog(trimmedIdentifier, "SUCCESS", "Authorized portal login");
      await updateDoc(doc(db, "adminUsers", userCredential.user.uid), {
        lastLoginAt: serverTimestamp(),
        lastLoginEmail: trimmedIdentifier,
      }).catch(() => {});
    } catch (err) {
      console.warn("Authentication failed for terminal attempt:", err.code);

      const newFailedCount = failedAttempts + 1;
      setFailedAttempts(newFailedCount);
      localStorage.setItem("hsce_failed_logins", String(newFailedCount));

      await recordSecurityLog(trimmedIdentifier, "FAILED", `Failed login attempt: ${err.code}`);

      if (newFailedCount >= MAX_FAILED_ATTEMPTS) {
        const lockUntil = Date.now() + LOCKOUT_DURATION_SECONDS * 1000;
        localStorage.setItem("hsce_lockout_until", String(lockUntil));
        setLockoutRemaining(LOCKOUT_DURATION_SECONDS);
        setError("Terminal locked for 5 minutes due to multiple failed login attempts.");
      } else {
        // High-security generic error message to prevent email guessing
        setError("Access denied: Invalid institutional credentials or unauthorized terminal access.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans">
      {/* ======================================================== */}
      {/* LEFT SECTION: Vibrant University Blue Hero (as in Image 2)*/}
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
        {/* Top-Left: College Logo & Identity */}
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

        {/* Center: Hero Welcome Statement */}
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
      {/* RIGHT SECTION: Simple, Clean White Login Form            */}
      {/* ======================================================== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-[420px] space-y-6">
          {/* Back to Home Link */}
          <div>
            <a
              href="https://hsce.pages.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ChevronLeft size={16} />
              <span>Back To Home</span>
            </a>
          </div>

          {/* Form Header */}
          <div className="flex items-center gap-3 pt-1">
            <div className="text-blue-600">
              <GraduationCap size={34} strokeWidth={1.8} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              College Login
            </h2>
          </div>

          {/* Lockout Banner */}
          {lockoutRemaining > 0 && (
            <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900 border border-amber-200 flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <span>
                Terminal locked due to excessive failed attempts. Please wait{" "}
                <strong>{lockoutRemaining}s</strong>.
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && lockoutRemaining <= 0 && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-800 border border-red-200 flex items-start gap-2">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Simple Login Form: Only Email and Password */}
          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter email address"
                required
                autoComplete="email"
                disabled={lockoutRemaining > 0}
                className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 bg-[#f8faff] text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                  disabled={lockoutRemaining > 0}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-md border border-slate-300 bg-[#f8faff] text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={lockoutRemaining > 0}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || lockoutRemaining > 0 || !firebaseReady}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-md text-sm tracking-wider uppercase transition shadow-xs disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>LOGIN</span>
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
