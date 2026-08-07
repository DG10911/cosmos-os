import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Home, Sparkles, Target, Users, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
            !hideChrome && "pt-14 pb-24"
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {!hideChrome && <TabBar />}
      </div>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function TopBar() {
  const { streak } = useApp();
  return (
    <header className="glass fixed left-1/2 top-0 z-20 flex h-14 w-full max-w-[420px] -translate-x-1/2 items-center justify-between border-b border-white/[0.06] px-4">
      <span className="serif text-lg text-text-primary">{greeting()}, Anya</span>
      <span className="mono flex items-center gap-1.5 rounded-full bg-gold/10 px-2.5 py-1 text-gold ring-1 ring-gold/20">
        <span className="animate-flame-flicker inline-block">🔥</span>
        <span className="text-base font-semibold">{streak}</span>
      </span>
    </header>
  );
}

function TabBar() {
  return (
    <nav className="glass fixed bottom-0 left-1/2 z-20 flex h-[68px] w-full max-w-[420px] -translate-x-1/2 items-start justify-around border-t border-white/[0.07] pt-2.5">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            cn(
              "relative flex flex-col items-center gap-1 px-3 py-1 transition-all duration-300 ease-smooth active:scale-90",
              isActive ? "text-gold" : "text-text-muted hover:text-white"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute -top-2.5 h-1 w-1 rounded-full bg-gold shadow-[0_0_8px_2px_rgba(244,196,48,0.6)]" />
              )}
              <tab.icon
                size={22}
                strokeWidth={isActive ? 2.3 : 1.7}
                style={
                  isActive
                    ? { filter: "drop-shadow(0 0 6px rgba(244,196,48,0.5))" }
                    : undefined
                }
              />
              <span className="text-[10px] font-medium tracking-wide">
                {tab.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
