/** Verified vendor catalog for the Muhurat Marketplace. Demo data, realistic. */
import type { VendorCat } from "../lib/muhurat";

export type Vendor = {
  id: number;
  name: string;
  cat: VendorCat;
  city: string;
  rating: number;
  reviews: number;
  price: number; // booking / advance amount (INR)
  priceNote: string;
  tag: string;
  verified: boolean;
};

export const VENDORS: Vendor[] = [
  // Wedding
  { id: 101, name: "Vedic Vivah Pandits", cat: "wedding", city: "Bengaluru", rating: 4.9, reviews: 612, price: 2100, priceNote: "sankalp advance", tag: "Vivah specialist · 4 languages", verified: true },
  { id: 102, name: "Saat Phere Decor", cat: "wedding", city: "Bengaluru", rating: 4.7, reviews: 388, price: 5000, priceNote: "date-hold advance", tag: "Mandap + floral · full setup", verified: true },
  { id: 103, name: "Annapurna Caterers", cat: "wedding", city: "Bengaluru", rating: 4.8, reviews: 921, price: 3500, priceNote: "tasting + hold", tag: "Pure-veg · 200–2000 pax", verified: true },
  // Pandit (griha/business/naming/property)
  { id: 201, name: "Pt. Sharma Griha Seva", cat: "pandit", city: "Bengaluru", rating: 4.9, reviews: 540, price: 1500, priceNote: "pooja booking", tag: "Griha Pravesh · Havan kit incl.", verified: true },
  { id: 202, name: "Acharya Digital Pooja", cat: "pandit", city: "Pan-India", rating: 4.8, reviews: 1180, price: 1100, priceNote: "online pooja", tag: "Live-streamed · Sankalp by name", verified: true },
  { id: 203, name: "Shubh Aarambh Pandits", cat: "pandit", city: "Bengaluru", rating: 4.7, reviews: 296, price: 1800, priceNote: "muhurat pooja", tag: "Business & Namkaran rituals", verified: true },
  // Decor
  { id: 301, name: "Rangoli Event Studio", cat: "decor", city: "Bengaluru", rating: 4.6, reviews: 244, price: 4000, priceNote: "date-hold", tag: "Home & stage decor", verified: true },
  // Catering
  { id: 401, name: "Sattvik Bhoj", cat: "catering", city: "Bengaluru", rating: 4.7, reviews: 502, price: 2500, priceNote: "menu + hold", tag: "Satvik · no onion-garlic option", verified: true },
  // Vehicle
  { id: 501, name: "Wheels Muhurat Delivery", cat: "vehicle", city: "Bengaluru", rating: 4.8, reviews: 173, price: 999, priceNote: "muhurat slot", tag: "Dealer-coordinated auspicious delivery", verified: true },
  { id: 502, name: "Pt. Rao Vahan Pooja", cat: "vehicle", city: "Bengaluru", rating: 4.9, reviews: 231, price: 1200, priceNote: "vahan pooja", tag: "New-vehicle pooja at your door", verified: true },
];

export function vendorsForCat(cat: VendorCat): Vendor[] {
  return VENDORS.filter((v) => v.cat === cat);
}
