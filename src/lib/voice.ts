/**
 * Voice engine for COSMOS OS — uses the browser's built-in Web Speech API
 * (SpeechRecognition + SpeechSynthesis). Zero cost, no keys, works today.
 * Production upgrades to Sarvam (Indic STT/TTS) + ElevenLabs behind the same
 * two functions — listen() and speak() — so callers never change.
 */

import { fetchSarvamTts } from "./cosmosApi";

/* eslint-disable @typescript-eslint/no-explicit-any */
const w = window as any;
const SR = w.SpeechRecognition || w.webkitSpeechRecognition;

let currentAudio: HTMLAudioElement | null = null;

export function voiceSupported(): boolean {
  return typeof window !== "undefined" && !!SR && "speechSynthesis" in window;
}

export function ttsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Speak text aloud. lang: "en-IN" | "hi-IN" | "ta-IN" … */
export function speak(text: string, lang = "en-IN") {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.98;
  u.pitch = 1.02;
  const voices = window.speechSynthesis.getVoices();
  const match =
    voices.find((v) => v.lang === lang) ||
    voices.find((v) => v.lang.startsWith(lang.split("-")[0]));
  if (match) u.voice = match;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }
}

/**
 * Premium voice: try Sarvam AI (natural Indic/Hindi voices, via the secure
 * Edge Function) and play the returned audio; fall back to the browser's
 * Web Speech voice if Sarvam isn't available. Same signature as speak().
 * Speaker examples (bulbul:v2): "anushka", "manisha" (f), "abhilash" (m).
 */
export async function speakSmart(
  text: string,
  lang = "hi-IN",
  speaker?: string,
): Promise<void> {
  stopSpeaking();
  try {
    const res = await fetchSarvamTts({ text, lang, speaker });
    if (res?.audio) {
      const audio = new Audio(`data:audio/wav;base64,${res.audio}`);
      currentAudio = audio;
      await audio.play();
      return;
    }
  } catch {
    /* fall back to Web Speech */
  }
  speak(text, lang);
}

/** Listen once and return the transcript. Returns the recognition handle. */
export function listen(opts: {
  lang?: string;
  onResult: (text: string) => void;
  onEnd?: () => void;
  onError?: (e?: unknown) => void;
}): { stop: () => void } | null {
  if (!SR) {
    opts.onError?.();
    return null;
  }
  const rec = new SR();
  rec.lang = opts.lang ?? "en-IN";
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.onresult = (e: any) => {
    const t = e?.results?.[0]?.[0]?.transcript ?? "";
    if (t) opts.onResult(t);
  };
  rec.onend = () => opts.onEnd?.();
  rec.onerror = (e: any) => opts.onError?.(e);
  try {
    rec.start();
  } catch {
    opts.onError?.();
  }
  return { stop: () => rec.stop() };
}
