import { useEffect, useState, type ReactNode } from "react";
import { Wifi, BatteryFull, SignalHigh } from "lucide-react";
import { store } from "../lib/utils";

/**
 * Wraps the whole app in a realistic phone handset on larger screens (desktop
 * demos, judges' laptops) — device bezel, live status bar, iOS Dynamic Island
 * or Android punch-hole, and a home indicator. On an actual phone (< 480px)
 * none of this renders: the app is full-screen native and the real OS provides
 * the status bar. All chrome is CSS-gated so it never affects mobile layout.
 */
type Skin = "ios" | "android";
const KEY = "cosmos_os_skin";

export function PhoneShell({ children }: { children: ReactNode }) {
  const [skin, setSkin] = useState<Skin>(() => store.get<Skin>(KEY, "ios"));
  const [now, setNow] = useState(() => clock());

  useEffect(() => {
    const t = setInterval(() => setNow(clock()), 15_000);
    return () => clearInterval(t);
  }, []);

  function choose(s: Skin) {
    setSkin(s);
    store.set(KEY, s);
  }

  return (
    <>
      <div className="desk-bg" aria-hidden />

      <div className="device-outer">
        <div className="device-screen">
          {/* faux status bar (desktop frame only) */}
          <div className="status-bar device-chrome" aria-hidden>
            <span className="sb-time">{now}</span>
            <span className="sb-icons">
              <SignalHigh size={15} strokeWidth={2.4} />
              <Wifi size={15} strokeWidth={2.4} />
              <BatteryFull size={17} strokeWidth={2} />
            </span>
          </div>

          {skin === "ios" ? (
            <div className="island device-chrome" aria-hidden />
          ) : (
            <div className="punch-hole device-chrome" aria-hidden />
          )}

          {children}

          <div
            className={`home-indicator device-chrome ${skin === "android" ? "android" : ""}`}
            aria-hidden
          />
        </div>
      </div>

      {/* OS skin toggle — lives in the desk area, desktop only */}
      <div className="os-toggle" role="group" aria-label="Device skin">
        <button className={skin === "ios" ? "on" : ""} onClick={() => choose("ios")}>
           iOS
        </button>
        <button className={skin === "android" ? "on" : ""} onClick={() => choose("android")}>
          Android
        </button>
      </div>
    </>
  );
}

function clock(): string {
  const d = new Date();
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  h = h % 12 || 12;
  return `${h}:${m}`;
}
