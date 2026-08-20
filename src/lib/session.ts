/**
 * The last generated consultation — the visible output of the Astro-Brain.
 * Written by SessionPage when a consultation ends, read by the Summary and
 * Prediction pages so what the user was told is what they see tracked. Stored
 * only in the browser (localStorage), never uploaded.
 */
import { store } from "./utils";
import type { Ritual } from "./astrologer";

export type GeneratedPrediction = {
  text: string;
  category: string;
  dueOn: string; // human date, e.g. "22 Nov 2026"
};

export type GeneratedSession = {
  astrologerName: string;
  astrologerId: number;
  minutes: number;
  said: string[];
  todo: string[];
  prediction: GeneratedPrediction;
  ritual: Ritual;
  ritualBought: boolean;
  at: number;
};

const KEY = "cosmos_last_session";

export function saveSession(s: GeneratedSession) {
  store.set(KEY, s);
}

export function getSession(): GeneratedSession | null {
  return store.get<GeneratedSession | null>(KEY, null);
}
