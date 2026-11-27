import { describe, expect, it } from "vitest";
import { questionLanguage, resolveLanguage } from "@/quran/lib/language";
import { englishSurahs } from "@/quran/lib/english-quran";

describe("Arabic and English app language", () => {
  it("uses the saved choice before the phone language", () => {
    expect(resolveLanguage("ar", "en-US")).toBe("ar");
    expect(resolveLanguage("en", "ar-SA")).toBe("en");
  });
  it("uses English on English phones and Arabic otherwise", () => {
    expect(resolveLanguage(null, "en-GB")).toBe("en");
    expect(resolveLanguage(null, "fr-FR")).toBe("ar");
  });
  it("answers in the language of the question", () => {
    expect(questionLanguage("What is patience in the Quran?")).toBe("en");
    expect(questionLanguage("ما فضل الصبر؟")).toBe("ar");
  });
  it("includes the complete English Quran", () => {
    expect(englishSurahs).toHaveLength(114);
    expect(englishSurahs.reduce((total, surah) => total + surah.numberOfAyahs, 0)).toBe(6236);
  });
});
