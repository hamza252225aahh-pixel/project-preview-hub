import surahs from "@/quran/data/surah-meta.json";
import { queryOptions } from "@tanstack/react-query";

export const ENGLISH_QURAN_SOURCE = "Muhammad Asad · The Message of the Qur’an";
export const englishSurahs = surahs;
export type EnglishSurah = { number: number; ayahs: { number: number; text: string; arabic: string }[] };
const chapters = import.meta.glob<{ default: EnglishSurah }>("../data/english/*.json");
export const englishSurahOptions = (number: number) => queryOptions({
  queryKey: ["english-quran", number],
  queryFn: async () => {
    const load = chapters[`../data/english/${number}.json`];
    if (!load) throw new Error("Surah not found");
    return (await load()).default;
  },
  staleTime: Infinity,
});