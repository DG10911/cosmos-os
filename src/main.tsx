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
