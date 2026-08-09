import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Home, Sparkles, Target, Users, User, Film } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StarField } from "./StarField";
import { cn } from "../lib/utils";
import { useApp } from "../state/AppState";
import { Flame } from "./Glyphs";
import { useLang, setLang, tr } from "../lib/lang";

const TABS = [
  { to: "/today", icon: Home, label: "Today" },
  { to: "/scroll", icon: Film, label: "Scroll" },
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
  // Reels-style feed: full-bleed under the floating dock, no top bar.
  const isScroll = pathname.startsWith("/scroll");

  return (
    <div className="min-h-screen w-full bg-bg text-text-primary">
      <StarField />

      {/* Phone-frame wrapper (mobile-first, centered on desktop with cosmic wash) */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[420px] flex-col">
        {!hideChrome && !isScroll && <TopBar />}

        <main
          className={cn(
            "flex-1 overflow-y-auto no-scrollbar",
            !hideChrome && !isScroll && "pt-14 pb-28"
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

function TopBar() {
  const { streak } = useApp();
  const lang = useLang();
  const h = new Date().getHours();
  const greetKey =
    h < 12 ? "greetMorning" : h < 17 ? "greetAfternoon" : "greetEvening";
  return (
    <header className="glass fixed left-1/2 top-0 z-20 flex h-14 w-full max-w-[420px] -translate-x-1/2 items-center justify-between border-b border-gold/15 px-4">
      <span className="serif truncate text-lg text-text-primary">
        {tr(greetKey, lang)}, Anya
      </span>
      <div className="flex items-center gap-2">
        {/* Language toggle — English / Hindi for mass Indian reach */}
        <button
          onClick={() => setLang(lang === "en" ? "hi" : "en")}
          className="rounded-full bg-cosmic/10 px-2.5 py-1 text-[11px] font-bold text-cosmic ring-1 ring-cosmic/20 active:scale-95"
          aria-label="Switch language"
        >
          {lang === "en" ? "अ / A" : "A / अ"}
        </button>
        <span className="mono flex items-center gap-1.5 rounded-full bg-gold/10 px-2.5 py-1 text-gold ring-1 ring-gold/20">
          <Flame size={16} className="animate-flame-flicker" />
          <span className="text-base font-semibold">{streak}</span>
        </span>
      </div>
    </header>
  );
}

function TabBar() {
  return (
    <nav className="fixed bottom-3 left-1/2 z-20 w-full max-w-[420px] -translate-x-1/2 px-3">
      <div className="glass flex h-[64px] items-center justify-around rounded-full border border-gold/20 shadow-[0_12px_32px_rgba(191,105,30,0.18)]">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                "relative flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors duration-300 active:scale-90",
                isActive ? "text-gold" : "text-text-muted hover:text-text-primary"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="dock-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute inset-x-0 -inset-y-0.5 rounded-2xl bg-gold/10 ring-1 ring-gold/25"
                  />
                )}
                <tab.icon
                  size={22}
                  strokeWidth={isActive ? 2.4 : 1.8}
                  className="relative"
                />
                <span className="relative text-[10px] font-medium tracking-wide">
                  {tab.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
