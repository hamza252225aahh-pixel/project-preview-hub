import { createFileRoute } from "@tanstack/react-router";
import QuranEnglish from "@/quran/pages/quran-english";
export const Route = createFileRoute("/quran-english/")({
  head: () => ({ meta: [
    { title: "Quran in English | Taqwa al-Qulub" },
    { name: "description", content: "Read all 114 surahs with Muhammad Asad’s English translation of the meanings of the Quran." },
    { property: "og:title", content: "Quran in English | Taqwa al-Qulub" },
    { property: "og:description", content: "The complete English translation of Quran meanings, with optional Arabic text." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: QuranEnglish,
});