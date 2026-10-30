import { useEffect, useState, useRef } from "react";
import { imageData } from "../../data/imagesData";

const STORAGE_KEY = "hsce_welcome_splash_shown";

export default function WelcomeSplashScreen() {
  const [visible, setVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const forceSplash = urlParams.has("welcome") || urlParams.has("splash");
      const alreadyShown = sessionStorage.getItem(STORAGE_KEY);

      if (!alreadyShown || forceSplash) {
        setVisible(true);
        document.body.style.overflow = "hidden";

        // Display for 1.8 seconds, then smoothly fade out
        timerRef.current = setTimeout(() => {
          setIsExiting(true);
          try {
            sessionStorage.setItem(STORAGE_KEY, "true");
          } catch {
            /* ignore */
          }
          document.body.style.overflow = "";

          // Remove from DOM after fade out transition
          setTimeout(() => {
            setVisible(false);
          }, 500);
        }, 1800);
      }
    } catch {
      setVisible(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="Loading Haryana Shakti College of Education"
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-gray-100 text-slate-800 select-none px-4 transition-opacity duration-500 ease-out ${
        isExiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center text-center max-w-sm">
        {/* College Logo */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 mb-4 flex items-center justify-center">
          <img
            src={imageData.collegeLogo}
            alt="Haryana Shakti College of Education Logo"
            className="w-full h-full object-contain"
            loading="eager"
          />
        </div>

        {/* College Name */}
        <h1 className="text-lg sm:text-xl font-bold text-slate-800 leading-snug tracking-tight">
          Haryana Shakti College of Education
        </h1>

        {/* Subtle Loading Dots */}
        <div className="mt-4 flex items-center justify-center gap-1.5" aria-hidden="true">
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse [animation-delay:200ms]" />
          <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse [animation-delay:400ms]" />
        </div>
      </div>
    </div>
  );
}
