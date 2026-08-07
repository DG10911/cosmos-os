import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Home, Sparkles, Target, Users, User } from "lucide-react";
import { StarField } from "./StarField";
import { cn } from "../lib/utils";
import { useApp } from "../state/AppState";

const TABS = [
  { to: "/today", icon: Home, label: "Today" },
  { to: "/consult", icon: Sparkles, label: "Consult" },
  { to: "/missions", icon: Target, label: "Missions" },
  { to: "/circle", icon: Users, label: "Circle" },
  { to: "/me", icon: User, label: "Me" },
];

/** Routes where the top bar + tab bar should be hidden (immersive screens). */
const HIDE_CHROME_ROUTES = ["/splash", "/onboarding", "/replay"];

export function AppLayout() {
  const { pathname } = useLocation();
  // Hide chrome on immersive routes and the live chat, but KEEP it on the
  // session summary so users can navigate back into the app.
  const isLiveSession =
    pathname.startsWith("/session/") && !pathname.endsWith("/summary");
  const hideChrome =
    HIDE_CHROME_ROUTES.some((r) => pathname.startsWith(r)) || isLiveSession;

  return (
    <div className="min-h-screen w-full bg-bg text-text-primary">
      <StarField />

      {/* Phone-frame wrapper (mobile-first, centered on desktop with cosmic wash) */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[420px] flex-col">
        {!hideChrome && <TopBar />}

        <main
          className={cn(
            "flex-1 overflow-y-auto no-scrollbar",
            !hideChrome && "pt-14 pb-20"
          )}
        >
          <Outlet />
        </main>

        {!hideChrome && <TabBar />}
      </div>
    </div>
  );
}

function TopBar() {
  const { streak } = useApp();
  return (
    <header className="fixed left-1/2 top-0 z-20 flex h-14 w-full max-w-[420px] -translate-x-1/2 items-center justify-between px-4 backdrop-blur-md bg-bg/70 border-b border-white/[0.04]">
      <span className="serif text-lg text-text-primary">Good morning, Anya</span>
      <span className="mono flex items-center gap-1 text-gold">
        <span className="animate-flame-flicker inline-block">🔥</span>
        <span className="text-lg font-medium">{streak}</span>
      </span>
    </header>
  );
}

function TabBar() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-20 flex h-16 w-full max-w-[420px] -translate-x-1/2 items-center justify-around border-t border-white/[0.06] bg-bg/85 backdrop-blur-xl pb-safe">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 px-3 py-2 transition-colors duration-300 ease-smooth",
              isActive ? "text-gold" : "text-text-muted hover:text-white"
            )
          }
        >
          {({ isActive }) => (
            <>
              <tab.icon size={22} strokeWidth={isActive ? 2.2 : 1.6} />
              <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
