import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Plug, Check, ShieldCheck, Server } from "lucide-react";
import {
  SERVICES,
  getServiceKey,
  setServiceKey,
  fetchWeather,
  moonPhase,
} from "../lib/services";
import { setAiKey } from "../lib/ai";
import { useToast } from "../components/Toast";

export default function ConnectPage() {
  const nav = useNavigate();
  const toast = useToast();
  const [open, setOpen] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [, force] = useState(0);
  const [weatherStatus, setWeatherStatus] = useState<string | null>(null);

  const moon = moonPhase();

  function save(k: string) {
    setServiceKey(k, draft);
    if (k === "openai") setAiKey(draft); // powers the live Twin immediately
    setOpen(null);
    setDraft("");
    force((n) => n + 1);
    toast(draft.trim() ? "Connected ✦ powering its feature now" : "Disconnected");
  }

  async function testWeather() {
    setWeatherStatus("testing…");
    try {
      const w = await fetchWeather();
      setWeatherStatus(`${w.emoji} ${w.temp}°C · ${w.label} — LIVE`);
    } catch {
      setWeatherStatus("offline");
    }
  }

  return (
    <div className="px-4 pt-3 pb-8">
      <button
        onClick={() => nav(-1)}
        className="mb-2 flex items-center gap-1 text-sm text-text-muted"
      >
        <ChevronLeft size={16} /> Back
      </button>
      <h1 className="serif text-2xl text-text-primary">API Connections</h1>
      <p className="mt-1 text-sm text-text-muted">
        Keys stay in <b>your browser only</b> — never uploaded, never in our code.
      </p>

      {/* Always-live keyless services */}
      <h3 className="mt-5 px-1 text-sm font-semibold text-text-primary">
        Live now — no key needed
      </h3>
      <div className="mt-2 space-y-2">
        <div className="cosmic-card flex items-center gap-3 p-3.5">
          <span className="text-xl">🌦️</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary">
              Open-Meteo Weather
            </p>
            <p className="text-[11px] text-text-muted">
              {weatherStatus ?? "Real weather in your Morning Brief"}
            </p>
          </div>
          <button
            onClick={testWeather}
            className="rounded-btn bg-gold/10 px-3 py-1.5 text-xs font-bold text-gold"
          >
            Test live
          </button>
        </div>
        <div className="cosmic-card flex items-center gap-3 p-3.5">
          <span className="text-xl">{moon.emoji}</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary">Lunar engine</p>
            <p className="text-[11px] text-text-muted">
              {moon.name} · {moon.illum}% illuminated — computed live
            </p>
          </div>
          <span className="rounded-full bg-success/12 px-2 py-1 text-[10px] font-bold text-success">
            LIVE
          </span>
        </div>
        <div className="cosmic-card flex items-center gap-3 p-3.5">
          <span className="text-xl">💬</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary">
              WhatsApp & Calendar
            </p>
            <p className="text-[11px] text-text-muted">
              Real share sheets + Google Calendar muhurat events
            </p>
          </div>
          <span className="rounded-full bg-success/12 px-2 py-1 text-[10px] font-bold text-success">
            LIVE
          </span>
        </div>
      </div>

      {/* Key-based services */}
      <h3 className="mt-6 px-1 text-sm font-semibold text-text-primary">
        Connect with your key
      </h3>
      <div className="mt-2 space-y-2">
        {SERVICES.map((s, i) => {
          const connected = !!getServiceKey(s.key);
          const editing = open === s.key;
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="cosmic-card p-3.5"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    connected ? "bg-success/12 text-success" : "bg-cosmic/10 text-cosmic"
                  }`}
                >
                  {connected ? <Check size={17} /> : <Plug size={16} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-text-primary">
                    {s.name}
                    {s.tier === "server" && (
                      <span className="flex items-center gap-0.5 rounded-full bg-black/[0.05] px-1.5 py-0.5 text-[9px] font-bold text-text-muted">
                        <Server size={9} /> via Edge Fn
                      </span>
                    )}
                  </p>
                  <p className="truncate text-[11px] text-text-muted">{s.purpose}</p>
                </div>
                <button
                  onClick={() => {
                    setOpen(editing ? null : s.key);
                    setDraft("");
                  }}
                  className={`rounded-btn px-3 py-1.5 text-xs font-bold ${
                    connected
                      ? "bg-success/12 text-success"
                      : "bg-gold px-3 text-white"
                  }`}
                >
                  {connected ? "Connected" : "Connect"}
                </button>
              </div>
              {editing && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="password"
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={s.placeholder}
                    className="h-11 flex-1 rounded-btn border border-gold/25 bg-white px-3 text-sm text-text-primary outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                  />
                  <button
                    onClick={() => save(s.key)}
                    className="btn-gold rounded-btn px-4 text-xs"
                  >
                    Save
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <p className="mt-5 flex items-start gap-1.5 text-[11px] leading-relaxed text-text-muted">
        <ShieldCheck size={13} className="mt-0.5 shrink-0 text-success" />
        Services marked "via Edge Fn" need server-side secrets in production —
        the key you paste here only enables demo mode. Full wiring map lives in
        SETUP.md.
      </p>
    </div>
  );
}
