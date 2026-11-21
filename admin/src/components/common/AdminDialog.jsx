import { createRoot } from "react-dom/client";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";

function showAdminDialog({ message, title, confirmLabel = "Confirm", alertOnly = false }) {
  return new Promise((resolve) => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const root = createRoot(host);

    const close = (value) => {
      root.unmount();
      host.remove();
      resolve(value);
    };

    root.render(
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]"
        role="presentation"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) close(false);
        }}>
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-dialog-title"
          className="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.28)]">
          <div className="h-1 w-full bg-[#363991]" />
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                {alertOnly ? (
                  <CheckCircle2 size={22} />
                ) : (
                  <AlertTriangle size={22} />
                )}
              </div>
              <button
                type="button"
                onClick={() => close(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <h2
              id="admin-dialog-title"
              className="mt-4 font-serif text-lg font-bold text-slate-900">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {!alertOnly && (
                <button
                  type="button"
                  onClick={() => close(false)}
                  className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
              )}
              <button
                type="button"
                autoFocus
                onClick={() => close(true)}
                className="inline-flex items-center justify-center rounded-md bg-[#363991] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#292c76]">
                {alertOnly ? "OK" : confirmLabel}
              </button>
            </div>
          </div>
        </section>
      </div>,
    );
  });
}

export function adminConfirm(message, title = "Please confirm") {
  return showAdminDialog({ message, title });
}

export function adminAlert(message, title = "Admin notice") {
  return showAdminDialog({
    message,
    title,
    confirmLabel: "OK",
    alertOnly: true,
  }).then(() => undefined);
}
