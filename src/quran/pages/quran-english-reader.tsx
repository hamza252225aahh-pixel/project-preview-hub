import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/quran/components/ui/button";
import { Switch } from "@/quran/components/ui/switch";
import { ENGLISH_QURAN_SOURCE, englishSurahs, englishSurahOptions } from "@/quran/lib/english-quran";

export default function QuranEnglishReader({ number }: { number: number }) {
  const { data } = useSuspenseQuery(englishSurahOptions(number));
  const meta = englishSurahs.find(s => s.number === number);
  const [showArabic, setShowArabic] = useState(false);
  if (!meta) return null;
  return <section className="mx-auto max-w-3xl pb-10" dir="ltr" lang="en">
    <header className="sticky top-0 z-20 space-y-4 border-b bg-background/95 py-4 backdrop-blur">
      <div className="flex items-start gap-3"><Button asChild variant="ghost" size="icon" aria-label="Back to surahs"><Link to="/quran-english"><ArrowLeft /></Link></Button><div className="min-w-0"><h1 className="text-2xl font-bold text-primary">{meta.englishName}</h1><p className="mt-1 text-sm text-muted-foreground">{meta.englishNameTranslation} · {data.ayahs.length} verses</p></div></div>
      <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-muted-foreground">{ENGLISH_QURAN_SOURCE}</p><label className="flex items-center gap-2 text-sm"><Switch checked={showArabic} onCheckedChange={setShowArabic} aria-label="Show Arabic text"/>Arabic text</label></div>
    </header>
    <div className="divide-y divide-border">
      {data.ayahs.map(a => <article key={a.number} className="space-y-4 py-6" data-testid={`english-verse-${a.number}`}>
        <p className="text-xs font-semibold text-muted-foreground">{number}:{a.number}</p>
        {showArabic && <p className="quran-text text-2xl leading-loose text-primary" dir="rtl" lang="ar">{a.arabic}</p>}
        <p className="text-lg leading-9 text-foreground">{a.text}</p>
      </article>)}
    </div>
    <nav className="flex items-center justify-between gap-3 border-t pt-5" aria-label="Surah navigation">
      {number > 1 ? <Button asChild variant="outline"><Link to="/quran-english/$number" params={{ number: String(number - 1) }}><ChevronLeft/>Previous</Link></Button> : <span/>}
      {number < 114 ? <Button asChild variant="outline"><Link to="/quran-english/$number" params={{ number: String(number + 1) }}>Next<ChevronRight/></Link></Button> : <span/>}
    </nav>
  </section>;
}