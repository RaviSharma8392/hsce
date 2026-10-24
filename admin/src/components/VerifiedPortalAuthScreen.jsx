import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import { auth, firebaseReady } from "../config/firebase";
import heroImage from "../assets/login-hero.jpg";

const COLLEGE_LOGO_URL = "/assets/brand/college-logo.png";

export default function VerifiedPortalAuthScreen({
  role = "staff",
  roleBadge = "STAFF & WEBSITE OPERATIONS",
  roleSubtitle = "STAFF & WEBSITE OPERATIONS",
  switchLabel = "Principal Login",
  switchPath = "/login/principal",
  redirectPath = "/dashboard",
}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState(
    localStorage.getItem(`hsce_remembered_${role}_email`) || "",
  );
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!firebaseReady) {
      setError("Firebase is not configured. Add values to admin/.env.local.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError("Enter your registered email and password.");
      return;
    }

    if (rememberMe) {
      localStorage.setItem(`hsce_remembered_${role}_email`, normalizedEmail);
    } else {
      localStorage.removeItem(`hsce_remembered_${role}_email`);
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, normalizedEmail, password);
      navigate(redirectPath, { replace: true });
    } catch (authError) {
      const messages = {
        "auth/invalid-credential": "Invalid email or password.",
        "auth/user-not-found": "Invalid email or password.",
        "auth/wrong-password": "Invalid email or password.",
        "auth/invalid-email": "Enter a valid email address.",
        "auth/too-many-requests": "Too many attempts. Try again later.",
      };
      setError(messages[authError.code] || "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    "w-full rounded-lg border border-[#c6d8f5] bg-[#f4f7ff] px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition focus:border-transparent focus:ring-2 focus:ring-[#0066FF]";

  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-white lg:flex-row">
      <div
        className="relative hidden h-full min-h-screen flex-col justify-between overflow-hidden p-10 text-white shadow-xl lg:flex lg:w-1/2 lg:p-14"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0, 102, 255, 0.92), rgba(2, 60, 205, 0.94)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
        <div className="z-10 flex items-center gap-3.5">
          <img
            src={COLLEGE_LOGO_URL}
            alt="College logo"
            className="h-14 w-auto rounded-md bg-white/10 p-1 object-contain"
          />
          <div>
            <h2 className="text-lg font-bold leading-tight">
              Haryana Shakti College of Education
            </h2>
            <p className="mt-0.5 text-xs text-blue-100">
              Approved by NCTE &amp; affiliated to GGSIPU, Delhi
            </p>
          </div>
        </div>
        <div className="z-10 my-auto max-w-lg py-8">
          <span className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
            {roleBadge}
          </span>
          <h1 className="text-3xl font-bold leading-tight xl:text-[42px]">
            Haryana Shakti College of Education
          </h1>
          <p className="mt-3.5 text-lg text-blue-100">College Portal</p>
        </div>
        <p className="z-10 text-xs text-blue-100/80">
          Haryana Shakti College of Education
        </p>
      </div>

      <main className="relative flex min-h-screen w-full flex-col overflow-y-auto bg-white p-5 sm:p-8 lg:w-1/2 lg:p-12">
        <div className="flex items-center justify-between pb-6 pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0066FF] hover:text-[#0052cc]">
            <ChevronLeft size={16} />
            Back to home
          </Link>
          <Link
            to={switchPath}
            className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800">
            {switchLabel}
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center pb-8">
          <div className="mb-6">
            <span className="inline-block rounded-md border border-[#d6e4ff] bg-[#eff4ff] px-3.5 py-1.5 text-[11px] font-bold uppercase text-[#0066FF]">
              {roleSubtitle}
            </span>
          </div>
          {error && (
            <div
              className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800"
              role="alert">
              <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-600" />
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-bold text-slate-800">
              Registered email
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@college.edu.in"
                autoComplete="username"
                required
                className={`${inputStyles} mt-1.5`}
              />
            </label>
            <label className="block text-sm font-bold text-slate-800">
              Password
              <span className="relative mt-1.5 block">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  className={`${inputStyles} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1.5 text-slate-400 hover:text-slate-700">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>
            <div className="flex items-center justify-between py-0.5 text-[13px]">
              <label className="flex cursor-pointer select-none items-center gap-2 font-medium text-slate-500">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#0066FF] focus:ring-[#0066FF]"
                />
                Remember email
              </label>
              <Link
                to="/forgot-password"
                className="font-medium text-[#0066FF] hover:text-[#0052cc]">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading || !firebaseReady}
              className="mt-2 w-full rounded-lg bg-[#005DEB] px-4 py-3.5 text-sm font-bold uppercase text-white shadow-md transition hover:bg-[#004cc2] disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
