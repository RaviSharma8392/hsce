import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ExternalLink } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db, firebaseReady } from "../../config/firebase";
import { fetchPublishedRecords } from "../../hooks/usePublishedRecords";
import { cloudinaryImageUrl } from "../../data/imagesData";

function getCleanDestination(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  const destination = rawUrl.trim();
  if (!destination) return null;

  if (/^https?:\/\/\S+$/i.test(destination)) {
    return { url: destination, external: true };
  }

  const cleanPath = destination.startsWith("/") ? destination : `/${destination}`;
  return { url: cleanPath, external: false };
}

function computeVersion(popup) {
  if (!popup) return "";
  const img = popup.image || popup.imageUrl || "";
  const link = popup.linkUrl || popup.redirectLink || "";
  const time =
    typeof popup.updatedAt?.toMillis === "function"
      ? popup.updatedAt.toMillis()
      : popup.updatedAt || "";
  return `${img}_${link}_${time}`;
}

export default function HomepagePopup() {
  const navigate = useNavigate();
  const [activeDocPopup, setActiveDocPopup] = useState(null);
  const [visibleVersion, setVisibleVersion] = useState("");

  // Read active popup with 5-minute session caching to save Firestore reads
  useEffect(() => {
    if (!firebaseReady) return undefined;

    let active = true;
    const cacheKey = "hsce_cached_popup_active";
    try {
      const raw = sessionStorage.getItem(cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
          setActiveDocPopup(parsed.data);
          return undefined;
        }
      }
    } catch {}

    const loadPopup = async () => {
      try {
        const docSnap = await getDoc(doc(db, "homepagePopups", "active"));
        if (docSnap.exists()) {
          const activePopup = { id: docSnap.id, ...docSnap.data() };
          if (
            activePopup.isPublished !== false &&
            (activePopup.image || activePopup.imageUrl)
          ) {
            if (active) {
              setActiveDocPopup(activePopup);
              try {
                sessionStorage.setItem(
                  cacheKey,
                  JSON.stringify({ data: activePopup, timestamp: Date.now() })
                );
              } catch {}
            }
            return;
          }
        }
      } catch (error) {
        console.warn("Could not load homepage popup doc:", error);
      }

      const [legacyPopup] = await fetchPublishedRecords("homepagePopups", {
        limitCount: 1,
      });
      if (active) {
        setActiveDocPopup(legacyPopup || null);
        try {
          sessionStorage.setItem(
            cacheKey,
            JSON.stringify({ data: legacyPopup || null, timestamp: Date.now() })
          );
        } catch {}
      }
    };

    loadPopup();

    return () => {
      active = false;
    };
  }, []);

  const popup = activeDocPopup;

  const imageUrl = popup?.image || popup?.imageUrl || "";
  const redirectTarget = getCleanDestination(popup?.linkUrl || popup?.redirectLink);
  const currentVersion = computeVersion(popup);

  const dismissPopup = useCallback(() => {
    if (currentVersion) {
      try {
        window.sessionStorage.setItem("hsce-popup-dismissed", currentVersion);
      } catch (err) {
        console.warn("Could not save popup dismissal:", err);
      }
    }
    setVisibleVersion("");
  }, [currentVersion]);

  // Handle auto-display
  useEffect(() => {
    if (!imageUrl || popup?.isPublished === false || popup?.status === "inactive") {
      setVisibleVersion("");
      return undefined;
    }

    const version = currentVersion;
    try {
      if (window.sessionStorage.getItem("hsce-popup-dismissed") === version) {
        return undefined;
      }
    } catch {
      // sessionStorage unavailable
    }

    // Delay slightly so it doesn't jarringly block the initial hero load
    const timer = window.setTimeout(() => {
      setVisibleVersion(version);
    }, 600);

    return () => window.clearTimeout(timer);
  }, [imageUrl, currentVersion, popup]);

  // Handle ESC key and scroll lock
  useEffect(() => {
    if (!visibleVersion) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") dismissPopup();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visibleVersion, dismissPopup]);

  if (!visibleVersion || !imageUrl || visibleVersion !== currentVersion) {
    return null;
  }

  const handleImageClick = (e) => {
    if (!redirectTarget) return;

    e.preventDefault();
    dismissPopup();

    if (redirectTarget.external) {
      window.open(redirectTarget.url, "_blank", "noopener,noreferrer");
    } else {
      navigate(redirectTarget.url);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-3 sm:p-5 backdrop-blur-sm animate-fade-in"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) dismissPopup();
      }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Important Announcement"
        className="relative my-auto w-full max-w-md sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl transition-transform animate-scale-up">
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={dismissPopup}
          aria-label="Close Announcement"
          className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-lg ring-1 ring-black/10 transition hover:bg-white hover:scale-105 active:scale-95 focus:outline-none">
          <X size={19} strokeWidth={2.5} />
        </button>

        {/* The Popup Image Flyer */}
        <div
          onClick={redirectTarget ? handleImageClick : undefined}
          className={`relative group ${
            redirectTarget ? "cursor-pointer" : ""
          }`}>
          <img
            src={cloudinaryImageUrl(imageUrl, 1200)}
            width="1200"
            height="1600"
            alt="HSCE Announcement"
            className="block max-h-[85vh] w-full object-contain bg-slate-900 mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
          />

          {/* Optional visual indicator that image is clickable */}
          {redirectTarget && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent py-2.5 px-4 text-center text-white flex items-center justify-center gap-1.5 opacity-90 group-hover:opacity-100 transition">
              <span className="text-xs font-bold tracking-wide">
                Tap / Click to view details
              </span>
              <ExternalLink size={13} className="text-[#FBDD23]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
