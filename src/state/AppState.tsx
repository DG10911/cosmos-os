import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { store } from "../lib/utils";

export type KarmaEntry = { delta: number; reason: string; at: string };

type AppState = {
  streak: number;
  longestStreak: number;
  karma: number;
  karmaLog: KarmaEntry[];
  ritualDone: boolean;
  missionProgress: number; // 0..7
  weeklyDone: string[]; // ids of completed weekly missions
  boughtRitual: boolean; // did the Ritual Moment convert?
  addKarma: (delta: number, reason: string) => void;
  completeRitual: () => void;
  completeMissionDay: () => void;
  toggleWeekly: (id: string, karma: number) => void;
  markBoughtRitual: () => void;
};

const KEY = "cosmos_state";

const DEFAULT = {
  streak: 12,
  longestStreak: 43,
  karma: 1240,
  karmaLog: [
    { delta: 100, reason: "Friend joined via your invite", at: "Yesterday" },
    { delta: 5, reason: "Daily login", at: "Yesterday" },
    { delta: -500, reason: "Redeemed: 5 free consultation minutes", at: "3 days ago" },
    { delta: 10, reason: "Mood log streak", at: "4 days ago" },
  ] as KarmaEntry[],
  ritualDone: false,
  missionProgress: 3,
  weeklyDone: [] as string[],
  boughtRitual: false,
};

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState(() => store.get(KEY, DEFAULT));

  const persist = useCallback((next: typeof DEFAULT) => {
    store.set(KEY, next);
    setS(next);
  }, []);

  const addKarma = useCallback(
    (delta: number, reason: string) => {
      const next = {
        ...s,
        karma: s.karma + delta,
        karmaLog: [{ delta, reason, at: "Just now" }, ...s.karmaLog],
      };
      persist(next);
    },
    [s, persist]
  );

  const completeRitual = useCallback(() => {
    if (s.ritualDone) return;
    persist({
      ...s,
      ritualDone: true,
      karma: s.karma + 10,
      karmaLog: [
        { delta: 10, reason: "Ritual completed", at: "Just now" },
        ...s.karmaLog,
      ],
    });
  }, [s, persist]);

  const completeMissionDay = useCallback(() => {
    if (s.missionProgress >= 7) return;
    persist({
      ...s,
      missionProgress: s.missionProgress + 1,
      karma: s.karma + 10,
      karmaLog: [
        { delta: 10, reason: "Mission progress", at: "Just now" },
        ...s.karmaLog,
      ],
    });
  }, [s, persist]);

  const toggleWeekly = useCallback(
    (id: string, karma: number) => {
      const done = s.weeklyDone.includes(id);
      const weeklyDone = done
        ? s.weeklyDone.filter((x) => x !== id)
        : [...s.weeklyDone, id];
      persist({
        ...s,
        weeklyDone,
        karma: s.karma + (done ? -karma : karma),
        karmaLog: done
          ? s.karmaLog
          : [
              { delta: karma, reason: "Weekly mission done", at: "Just now" },
              ...s.karmaLog,
            ],
      });
    },
    [s, persist]
  );

  const markBoughtRitual = useCallback(() => {
    persist({ ...s, boughtRitual: true });
  }, [s, persist]);

  return (
    <Ctx.Provider
      value={{
        ...s,
        addKarma,
        completeRitual,
        completeMissionDay,
        toggleWeekly,
        markBoughtRitual,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppStateProvider");
  return ctx;
}
