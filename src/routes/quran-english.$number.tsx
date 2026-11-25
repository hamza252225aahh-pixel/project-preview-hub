import { createFileRoute, notFound } from "@tanstack/react-router";
import { englishSurahOptions, englishSurahs } from "@/quran/lib/english-quran";
import QuranEnglishReader from "@/quran/pages/quran-english-reader";
export const Route = createFileRoute("/quran-english/$number")({
  loader: async ({ params, context }) => {
    const number = Number(params.number);
    if (!/^\d+$/.test(params.number) || !Number.isInteger(number) || number < 1 || number > 114) throw notFound();
    await context.queryClient.ensureQueryData(englishSurahOptions(number));
    return { number, name: englishSurahs.find(s => s.number === number)?.englishName ?? "Quran" };
  },
  head: ({ loaderData }) => {
    const title = `${loaderData?.name ?? "Quran"} in English | Taqwa al-Qulub`;
    const description = "Read Muhammad Asad’s English translation of Quran meanings alongside the original Arabic verses.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  component: EnglishReaderRoute,
});
function EnglishReaderRoute() { const { number } = Route.useLoaderData(); return <QuranEnglishReader key={number} number={number}/>; }