import { useSyncExternalStore } from "react";
import { store } from "./utils";

export type Lang = "en" | "hi";
const KEY = "cosmos_lang";
const EVT = "cosmos-lang";

export function getLang(): Lang {
  return store.get<Lang>(KEY, "en");
}

export function setLang(l: Lang) {
  store.set(KEY, l);
  window.dispatchEvent(new Event(EVT));
}

/** Reactive language hook — re-renders any component when language flips. */
export function useLang(): Lang {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener(EVT, cb);
      return () => window.removeEventListener(EVT, cb);
    },
    getLang,
    () => "en"
  );
}

/**
 * Bilingual dictionary for the primary surfaces. English + Hindi so the home
 * experience is legible to a mass Indian audience. Extend per-screen as needed.
 */
const DICT: Record<string, { en: string; hi: string }> = {
  greetMorning: { en: "Good morning", hi: "सुप्रभात" },
  greetAfternoon: { en: "Good afternoon", hi: "नमस्ते" },
  greetEvening: { en: "Good evening", hi: "शुभ संध्या" },

  secMoment: { en: "Your Moment", hi: "आपका मुहूर्त" },
  secMomentSub: { en: "Time-sensitive — act now", hi: "समय रहते — अभी करें" },
  secSky: { en: "Today's Sky", hi: "आज का आकाश" },
  secSkySub: { en: "Your live cosmic weather", hi: "आपका जीवंत ग्रह-मौसम" },
  secPractice: { en: "Daily Practice", hi: "आज का अभ्यास" },
  secPracticeSub: { en: "Small acts, big shifts", hi: "छोटे कर्म, बड़ा बदलाव" },
  secTools: { en: "Free Tools", hi: "मुफ़्त सेवाएँ" },
  secToolsSub: { en: "No charges, ever", hi: "हमेशा निःशुल्क" },
  secExpert: { en: "Talk to an Expert", hi: "ज्योतिषी से बात करें" },
  secExpertSub: { en: "Verified · 1st chat free", hi: "प्रमाणित · पहली चैट मुफ़्त" },
  secExplore: { en: "Explore More", hi: "और खोजें" },
  secWisdom: { en: "Today's Wisdom", hi: "आज का ज्ञान" },

  seeAll: { en: "See all", hi: "सभी देखें" },
  view: { en: "View", hi: "देखें" },
  readBrief: { en: "Read your Morning Brief", hi: "आज का ब्रीफ़ पढ़ें" },
  ritual: { en: "Today's Ritual", hi: "आज का अनुष्ठान" },
  mission: { en: "Mission of the Day", hi: "आज का लक्ष्य" },
  panchang: { en: "Today's Panchang", hi: "आज का पंचांग" },
  freeKundli: { en: "Your Free Kundli", hi: "आपकी मुफ़्त कुंडली" },
  auspicious: { en: "Auspicious day", hi: "शुभ दिन" },
};

export function tr(key: keyof typeof DICT, lang: Lang): string {
  return DICT[key]?.[lang] ?? DICT[key]?.en ?? key;
}
