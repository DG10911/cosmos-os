import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AppStateProvider } from "./state/AppState";
import { ToastProvider } from "./components/Toast";
import { PhoneShell } from "./components/PhoneShell";
import { initAnalytics } from "./lib/analytics";
import "./index.css";

initAnalytics();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppStateProvider>
      <ToastProvider>
        <PhoneShell>
          <App />
        </PhoneShell>
      </ToastProvider>
    </AppStateProvider>
  </StrictMode>
);

// Fade out the branded launch screen once the app has painted.
requestAnimationFrame(() => {
  setTimeout(() => {
    const boot = document.getElementById("boot");
    if (!boot) return;
    boot.classList.add("hide");
    setTimeout(() => boot.remove(), 600);
  }, 500);
});

// Register the (cache-less) service worker so the app is installable as a PWA.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* installability is a progressive enhancement — ignore failures */
    });
  });
}
