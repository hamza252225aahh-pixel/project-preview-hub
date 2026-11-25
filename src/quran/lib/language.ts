export type AppLanguage = "ar" | "en";
export const LANGUAGE_KEY = "quran-app-language";
export function resolveLanguage(saved: string | null, device: string): AppLanguage {
  if (saved === "ar" || saved === "en") return saved;
  return device.toLowerCase().startsWith("en") ? "en" : "ar";
}
export function questionLanguage(question: string): AppLanguage {
  const arabic = question.match(/[\u0621-\u064A]/g)?.length ?? 0;
  const english = question.match(/[a-z]/gi)?.length ?? 0;
  return english > arabic ? "en" : "ar";
}