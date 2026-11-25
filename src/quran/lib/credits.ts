export const START_CREDITS = 30;
/** Daily refill: added 24 hours after the balance ran out. */
export const DAILY_CREDITS = 30;
export const REFILL_MS = 24 * 60 * 60 * 1000;
export const QUESTION_COST = 15;
/** Rewarded-ad packages: number of 30s videos watched -> credits earned. */
export const AD_PACKAGES = [
  { ads: 2, credits: 45 },
  { ads: 3, credits: 90 },
] as const;

export const canAsk = (balance: number) => balance >= QUESTION_COST;
export const afterQuestion = (balance: number) => Math.max(0, balance - QUESTION_COST);
export function rewardFor(adsWatched: number): number {
  const pkg = AD_PACKAGES.find((p) => p.ads === adsWatched);
  return pkg ? pkg.credits : 0;
}

/** Image interstitial: shown on navigation when at least 4 minutes passed since the last one. */
export const INTERSTITIAL_MIN_GAP_MS = 4 * 60 * 1000;
export const canShowInterstitial = (lastShownAt: number, now: number) =>
  now - lastShownAt >= INTERSTITIAL_MIN_GAP_MS;

/** Recitation player pages (murattal and mujawwad): no full-screen image ad there. */
export const isPlayerPage = (path: string) => /^\/quran-(audio|tajweed)\/\d+\/?$/.test(path);

/** The bottom banner shows on every page except the home page. */
export const showsBanner = (path: string) => path !== "/" && path !== "";

/** Returns the balance after any due refill and the (possibly cleared) time the balance ran out. */
export function applyDailyRefill(balance: number, emptyAt: number | null, now: number) {
  if (emptyAt !== null && now - emptyAt >= REFILL_MS) return { balance: balance + DAILY_CREDITS, emptyAt: null };
  return { balance, emptyAt };
}
/** Starts the 24-hour countdown the moment the balance can no longer pay for a question. */
export function markIfEmpty(balance: number, emptyAt: number | null, now: number) {
  return !canAsk(balance) && emptyAt === null ? now : emptyAt;
}

const KEY = "illuminated-credits";
const EMPTY_KEY = "illuminated-credits-empty-at";
const isWebPreview = () => !/^(capacitor:|https?:\/\/localhost)/.test(window.location.origin);
export function loadCredits(): number {
  // Preview/web testing: refill credits so the owner can keep trying (the APK keeps real credits).
  if (isWebPreview()) return 9999;
  const v = localStorage.getItem(KEY);
  const stored = v === null ? START_CREDITS : Number(v) || 0;
  const e = localStorage.getItem(EMPTY_KEY);
  const now = Date.now();
  const r = applyDailyRefill(stored, e === null ? null : Number(e), now);
  saveCredits(r.balance, r.emptyAt);
  return r.balance;
}
export function saveCredits(n: number, emptyAt?: number | null) {
  if (isWebPreview()) return;
  localStorage.setItem(KEY, String(n));
  const prev = localStorage.getItem(EMPTY_KEY);
  const next = emptyAt !== undefined ? emptyAt : markIfEmpty(n, prev === null ? null : Number(prev), Date.now());
  if (next === null) localStorage.removeItem(EMPTY_KEY);
  else localStorage.setItem(EMPTY_KEY, String(next));
}
/** Milliseconds until the next daily refill, or null when no refill is waiting. */
export function msUntilRefill(): number | null {
  const e = localStorage.getItem(EMPTY_KEY);
  return e === null ? null : Math.max(0, Number(e) + REFILL_MS - Date.now());
}

/** Qibla and prayer times: unlocked forever after watching two rewarded ads once. */
export const FEATURE_UNLOCK_ADS = 2;
const UNLOCK_KEY = "qibla-prayer-unlocked";
export const isFeaturesUnlocked = () => isWebPreview() || localStorage.getItem(UNLOCK_KEY) === "1";
export const unlockFeatures = () => localStorage.setItem(UNLOCK_KEY, "1");
