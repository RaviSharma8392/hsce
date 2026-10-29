import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AdmissionModalContext = createContext(null);

export function AdmissionModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState({
    defaultProgramme: "",
    defaultState: "Delhi (NCT)",
  });

  const location = useLocation();
  const navigate = useNavigate();

  const openAdmissionModal = useCallback((options = {}) => {
    setModalOptions((prev) => ({
      ...prev,
      ...options,
    }));
    setIsOpen(true);
  }, []);

  const closeAdmissionModal = useCallback(() => {
    setIsOpen(false);
    // If URL has ?apply=true or #apply, remove it cleanly without reload
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has("apply")) {
      searchParams.delete("apply");
      const newSearch = searchParams.toString();
      navigate(
        {
          pathname: location.pathname,
          search: newSearch ? `?${newSearch}` : "",
          hash: location.hash === "#apply" ? "" : location.hash,
        },
        { replace: true }
      );
    }
  }, [location, navigate]);

  // Check URL on mount or location change for ?apply=true or #apply
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("apply") === "true" || location.hash === "#apply") {
      setIsOpen(true);
    }
  }, [location.search, location.hash]);

  // Listen to custom DOM event so any non-React code or link can also trigger it
  useEffect(() => {
    const handleCustomEvent = (event) => {
      openAdmissionModal(event.detail || {});
    };

    window.addEventListener("open-admission-modal", handleCustomEvent);
    // Also expose helper on window for easy testing/integration
    window.openAdmissionModal = openAdmissionModal;

    return () => {
      window.removeEventListener("open-admission-modal", handleCustomEvent);
      delete window.openAdmissionModal;
    };
  }, [openAdmissionModal]);

  return (
    <AdmissionModalContext.Provider
      value={{
        isOpen,
        modalOptions,
        openAdmissionModal,
        closeAdmissionModal,
      }}>
      {children}
    </AdmissionModalContext.Provider>
  );
}

export function useAdmissionModal() {
  const context = useContext(AdmissionModalContext);
  if (!context) {
    return {
      isOpen: false,
      modalOptions: {},
      openAdmissionModal: () => {
        window.dispatchEvent(new CustomEvent("open-admission-modal"));
      },
      closeAdmissionModal: () => {},
    };
  }
  return context;
}
