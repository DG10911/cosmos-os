import { store } from "../lib/utils";

export type CosmosUser = {
  phone: string;
  name?: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  goals: string[];
  notifyTime: string;
  whatsapp: boolean;
  onboardedAt: number;
};

const KEY = "cosmos_user";

export function getUser(): CosmosUser | null {
  return store.get<CosmosUser | null>(KEY, null);
}

export function saveUser(u: CosmosUser) {
  store.set(KEY, u);
}

export function clearUser() {
  store.remove(KEY);
}

export function hasOnboarded(): boolean {
  return getUser() !== null;
}
