import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "./context/LanguageContext";
import { AdmissionModalProvider } from "./context/AdmissionModalContext";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AdmissionModalProvider>
            <App />
          </AdmissionModalProvider>
        </BrowserRouter>
      </LanguageProvider>
    </HelmetProvider>
  </StrictMode>,
);

