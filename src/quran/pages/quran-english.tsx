import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Search, ChevronRight } from "lucide-react";
import { Button } from "@/quran/components/ui/button";
import { Input } from "@/quran/components/ui/input";
import { useLanguage } from "@/quran/components/language-provider";
import { ENGLISH_QURAN_SOURCE, englishSurahs } from "@/quran/lib/english-quran";

export default function QuranEnglish() {
  const { language, dir } = useLanguage();
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const visible = englishSurahs.filter(s => `${s.number} ${s.name} ${s.englishName} ${s.englishNameTranslation}`.toLowerCase().includes(query));
  return <section className="mx-auto max-w-3xl space-y-6 pb-10" dir={dir}>
    <header className="flex items-start gap-3 border-b py-4">
      <Button asChild variant="ghost" size="icon" aria-label={language === "ar" ? "العودة للرئيسية" : "Back home"}><Link to="/"><ArrowLeft className={language === "ar" ? "rotate-180" : ""} /></Link></Button>
      <div className="min-w-0"><h1 className="text-2xl font-bold text-primary">{language === "ar" ? "القرآن الكريم بالإنجليزية" : "Quran in English"}</h1><p className="mt-2 text-sm text-muted-foreground">{language === "ar" ? "ترجمة معاني القرآن كاملة · 114 سورة" : "Complete translation of the meanings · 114 surahs"}</p><p className="mt-1 text-xs text-muted-foreground" dir="ltr">{ENGLISH_QURAN_SOURCE}</p></div>
    </header>
    <div className="relative"><Search className="absolute start-3 top-3 size-4 text-muted-foreground" aria-hidden="true"/><Input type="search" className="ps-10" aria-label={language === "ar" ? "بحث عن سورة" : "Search surahs"} placeholder={language === "ar" ? "اسم السورة أو رقمها…" : "Surah name or number…"} value={search} onChange={e => setSearch(e.target.value)} /></div>
    <div className="divide-y divide-border" dir="ltr">
      {visible.map(s => <Link key={s.number} to="/quran-english/$number" params={{ number: String(s.number) }} className="flex min-h-20 items-center gap-4 py-4 hover:bg-muted/30" data-testid={`english-surah-${s.number}`}>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{s.number}</span>
        <div className="min-w-0 flex-1"><h2 className="font-semibold text-foreground">{s.englishName}</h2><p className="mt-1 text-sm text-muted-foreground">{s.englishNameTranslation} · {s.numberOfAyahs} verses</p></div><ChevronRight className="size-4 shrink-0 text-muted-foreground"/>
      </Link>)}
    </div>
    {!visible.length && <p role="status" className="text-center text-muted-foreground">{language === "ar" ? "لم يُعثر على سورة" : "No surahs found"}</p>}
  </section>;
}