import { describe, expect, it } from "vitest";
import { DAILY_CREDITS, applyDailyRefill, markIfEmpty, START_CREDITS, afterQuestion, canAsk, canShowInterstitial, isPlayerPage, rewardFor, showsBanner } from "@/quran/lib/credits";

describe("illuminated book credits", () => {
  it("starts with 30 credits", () => expect(START_CREDITS).toBe(30));
  it("30 credits are added daily", () => expect(DAILY_CREDITS).toBe(30));
  it("refill comes 24h after running out", () => expect(applyDailyRefill(0, 0, 86_400_000)).toEqual({ balance: 30, emptyAt: null }));
  it("no refill before 24h", () => expect(applyDailyRefill(0, 0, 86_399_999).balance).toBe(0));
  it("countdown starts when balance runs out", () => expect(markIfEmpty(0, null, 5)).toBe(5));
  it("each question costs 15", () => expect(afterQuestion(30)).toBe(15));
  it("cannot ask with less than 15", () => { expect(canAsk(14)).toBe(false); expect(canAsk(15)).toBe(true); });
  it("2 ads give 45", () => expect(rewardFor(2)).toBe(45));
  it("3 ads give 90", () => expect(rewardFor(3)).toBe(90));
  it("1 ad gives nothing", () => expect(rewardFor(1)).toBe(0));
});

describe("ad timing rules set by the user", () => {
  it("image ad shows when 4 minutes passed", () => expect(canShowInterstitial(0, 240_000)).toBe(true));
  it("image ad not before 4 minutes", () => expect(canShowInterstitial(0, 239_999)).toBe(false));
});

describe("where ads may appear", () => {
  it("no image ad on the murattal player page", () => expect(isPlayerPage("/quran-audio/36")).toBe(true));
  it("no image ad on the mujawwad player page", () => expect(isPlayerPage("/quran-tajweed/2")).toBe(true));
  it("image ads still allowed on the surah list", () => expect(isPlayerPage("/quran-audio")).toBe(false));
  it("no banner on the home page", () => expect(showsBanner("/")).toBe(false));
  it("banner on the hadith page", () => expect(showsBanner("/hadith")).toBe(true));
  it("banner on the illuminated book page", () => expect(showsBanner("/illuminated-book")).toBe(true));
});

import { FEATURE_UNLOCK_ADS } from "@/quran/lib/credits";
describe("qibla and prayer times unlock", () => {
  it("needs two ads once", () => expect(FEATURE_UNLOCK_ADS).toBe(2));
});
