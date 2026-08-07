/** Curated demo data for COSMOS OS. Realistic enough to feel alive in a pitch. */

export type Astrologer = {
  id: number;
  name: string;
  trust: number;
  systems: string[];
  languages: string;
  price: number;
  online: boolean;
  accuracy: number;
  sessions: number;
  repeat: number;
  bio: string;
  origin: string;
};

export const ASTROLOGERS: Astrologer[] = [
  {
    id: 1,
    name: "Pt. Suresh Sharma",
    trust: 94,
    systems: ["Vedic", "KP"],
    languages: "Hindi + English",
    price: 15,
    online: true,
    accuracy: 87,
    sessions: 12400,
    repeat: 42,
    bio: "Fourth-generation Vedic astrologer from Varanasi with 40 years of practice. Specialises in career timing and Dasha analysis.",
    origin: "Varanasi",
  },
  {
    id: 2,
    name: "Acharya Deepa Iyer",
    trust: 91,
    systems: ["Vedic", "Nadi"],
    languages: "Tamil + English",
    price: 25,
    online: true,
    accuracy: 82,
    sessions: 8900,
    repeat: 38,
    bio: "Former corporate strategist turned Nadi astrologer. Known for precise relationship and marriage compatibility readings.",
    origin: "Chennai",
  },
  {
    id: 3,
    name: "Rohit Malhotra",
    trust: 89,
    systems: ["Tarot", "Numerology"],
    languages: "Hindi + Punjabi",
    price: 12,
    online: false,
    accuracy: 79,
    sessions: 15200,
    repeat: 51,
    bio: "Gen-Z tarot reader with 320k followers. Blends tarot with numerology for fast, intuitive guidance on love and decisions.",
    origin: "Delhi",
  },
  {
    id: 4,
    name: "Mrs. Prithi Ganesh",
    trust: 96,
    systems: ["Nadi", "Prashna"],
    languages: "Malayalam + English",
    price: 45,
    online: true,
    accuracy: 91,
    sessions: 6100,
    repeat: 55,
    bio: "Highest-rated Prashna specialist on the platform. Answers a single pressing question with remarkable accuracy.",
    origin: "Kochi",
  },
  {
    id: 5,
    name: "Guruji Anand Bhargav",
    trust: 92,
    systems: ["Vedic", "Vastu"],
    languages: "Hindi + Gujarati",
    price: 30,
    online: true,
    accuracy: 85,
    sessions: 18700,
    repeat: 47,
    bio: "Spiritual TV personality and Vastu consultant. Guides on home, business location and long-term life planning.",
    origin: "Ahmedabad",
  },
];

export function avatarUrl(id: number) {
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=cosmos${id}&backgroundColor=8B7CFC,F4C430,4c1d95`;
}

/** Today's cosmic weather — hardcoded but realistic for the demo user "Anya". */
export const TODAY = {
  greeting: "Good morning, Anya",
  dateLabel: "Thu, Aug 8",
  heroTitle: "Today, your Moon is illuminated.",
  heroSub: "Trust intuition over strategy.",
  mood: "Contemplative",
  luckyHour: "14:22 – 15:47",
  bestWork: "10:00 – 12:30",
  moneyEnergy: "Stable",
  loveEnergy: "Rising",
  ritual: "Light a diya at sunset",
  panchang: {
    tithi: "Panchami",
    nakshatra: "Rohini",
    rahuKaal: "4:30 – 6:00 PM",
  },
};
