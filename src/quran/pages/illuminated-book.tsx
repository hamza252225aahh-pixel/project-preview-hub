import { useLanguage } from "@/quran/components/language-provider";
import { useEffect, useRef, useState } from "react";
import { msUntilRefill, AD_PACKAGES, QUESTION_COST, START_CREDITS, afterQuestion, canAsk, loadCredits, rewardFor, saveCredits } from "@/quran/lib/credits";
import { adsAvailable, showRewarded } from "@/quran/lib/ads";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Send, LoaderCircle, RotateCcw, ShieldCheck, SkipForward } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/quran/components/ui/button";
import { Textarea } from "@/quran/components/ui/textarea";
import { askIlluminated } from "@/quran/lib/ask-illuminated";
import videoAsset from "@/assets/video/illuminated-book-v2.mp4.asset.json";
import { questionLanguage } from "@/quran/lib/language";

type Answer = { answer: string; references: { id: string; label: string; text: string }[] };

export default function IlluminatedBook() {
  const { t: tr, dir: uiDir, language, locale } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState(false);
  const [videoDone, setVideoDone] = useState(false);
  const [credits, setCredits] = useState(START_CREDITS);
  const [adBusy, setAdBusy] = useState(false);
  const [adMsg, setAdMsg] = useState("");
  useEffect(() => { setCredits(loadCredits()); }, []);
  async function earn(count: number) {
    if (!adsAvailable()) { setAdMsg(tr("الإعلانات تعمل داخل تطبيق الأندرويد فقط.")); return; }
    setAdBusy(true); setAdMsg("");
    for (let i = 1; i <= count; i++) {
      if (i > 1) setAdMsg(tr("شاهدت {0} من {1}… جارٍ تحميل الإعلان التالي", i - 1, count));
      if (!(await showRewarded())) { setAdBusy(false); setAdMsg(tr("لم يكتمل الإعلان أو لا يتوفر إعلان الآن، فلم يُضف رصيد. تأكد من الاتصال بالإنترنت وحاول مرة أخرى.")); return; }
    }
    setCredits(c => { const n = c + rewardFor(count); saveCredits(n); return n; });
    setAdBusy(false); setAdMsg(tr("أُضيف {0} كريدت إلى رصيدك.", rewardFor(count))); setError("");
  }
  function resetVideo() {
    const v = videoRef.current;
    if (v) { v.pause(); v.currentTime = 0; }
    setPlaying(false); setVideoDone(false);
  }
  function skip() {
    videoRef.current?.pause();
    setVideoDone(true);
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy || question.trim().length < 3) return;
    if (!canAsk(credits)) { setError(tr("رصيدك لا يكفي. شاهد إعلانات لتحصل على رصيد جديد.")); return; }
    setError(""); setBusy(true); setSubmitted(question.trim());
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0; setVideoDone(false); setPlaying(true);
      v.play().catch(() => setVideoDone(true));
    } else setVideoDone(true);
    try {
      const result = await askIlluminated(question.trim());
      if (result.ok) { setAnswer(result); setCredits(c => { const n = afterQuestion(c); saveCredits(n); return n; }); }
      else { setError(result.error); resetVideo(); }
    } catch { setError(tr("تعذر الاتصال بخدمة الإجابات. حاول لاحقًا.")); resetVideo(); }
    finally { setBusy(false); }
  }
  const showAnswer = videoDone && (answer !== null || busy);
  return (
    <section dir={uiDir} className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-3xl flex-col">
      <header className="flex items-center gap-3 border-b py-4">
        {showAnswer
          ? <Button variant="ghost" size="icon" aria-label={tr("العودة لصفحة الكتاب المضيئ")} onClick={() => { setAnswer(null); setQuestion(""); setError(""); resetVideo(); }}><ArrowRight /></Button>
          : <Button asChild variant="ghost" size="icon" aria-label={tr("العودة للرئيسية")}><Link to="/"><ArrowRight /></Link></Button>}
        <div className="flex-1"><h1 className="text-xl font-bold text-primary">{tr("الكتاب المضيئ")}</h1><p className="mt-1 text-sm text-muted-foreground">{tr("اسأل واعرف وتعلم")}</p></div>
        <BookOpen className="size-7 text-accent" />
      </header>
      {showAnswer ? (
        <div className="flex-1 py-7">
          <p className="mb-2 text-sm text-muted-foreground">{tr("سؤالك")}</p>
          <h2 className="mb-8 break-words text-xl font-semibold leading-9">{submitted}</h2>
          {!answer ? <p role="status" className="flex items-center gap-2 py-10 text-base font-semibold text-primary"><LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />{tr("جاري إعداد الإجابة…")}</p> : <>
          <article dir={questionLanguage(submitted) === "en" ? "ltr" : "rtl"} lang={questionLanguage(submitted)} aria-label={tr("الإجابة")} className="prose prose-lg max-w-none break-words text-foreground prose-headings:text-primary prose-p:leading-9 prose-a:text-primary"><ReactMarkdown>{answer.answer}</ReactMarkdown></article>
          <section className="mt-10 border-t pt-6" aria-label={tr("المراجع")}>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-primary"><BookOpen className="size-5" />{tr("المراجع والنصوص")}</h2>
            {answer.references.length ? answer.references.map(ref => <details key={ref.id} className="border-b py-4"><summary className="cursor-pointer text-sm font-semibold leading-7">[{ref.id}] {ref.label}</summary><p className="quran-text mt-4 whitespace-pre-line text-xl leading-10">{ref.text}</p></details>) : <p className="text-sm text-muted-foreground">{tr("لا توجد نصوص من مكتبة التطبيق في هذه الإجابة؛ تحقق من النقول في مصادرها المذكورة.")}</p>}
          </section>
          <aside className="mt-8 border-r-2 border-accent pr-4 text-sm leading-7 text-muted-foreground"><h3 className="mb-2 flex items-center gap-2 font-bold text-foreground"><ShieldCheck className="size-4" />{tr("إخلاء المسؤولية")}</h3>{tr("هذه إجابة تعليمية مولّدة بالذكاء الاصطناعي، وقد تخطئ؛ ليست فتوى ولا بديلًا عن أهل العلم. الإجابة مستمدة من القرآن الكريم وكتب التفسير والحديث والفقه والتاريخ الإسلامي المشهورة؛ النصوص المعروضة في قسم المراجع موثقة داخل التطبيق، أما النقول الأخرى فتحقق منها في مصادرها. تحقق من النصوص وراجع عالمًا موثوقًا في الأحكام الشخصية والمسائل الخلافية.")}</aside>
          <Button className="mt-8" variant="outline" onClick={() => { setAnswer(null); setQuestion(""); setError(""); setPlaying(false); setVideoDone(false); }}><RotateCcw />{tr("سؤال جديد")}</Button>
          </>}
        </div>
      ) : (
        <>
          <div className="flex flex-1 flex-col items-center justify-start gap-5 py-7 sm:py-10">
            <div className="relative w-full max-w-xl">
              <video ref={videoRef} src={videoAsset.url} poster="/assets/video/illuminated-book-poster.jpg" playsInline preload="auto" disablePictureInPicture controlsList="nodownload noplaybackrate" onEnded={() => setVideoDone(true)} onError={() => setVideoDone(true)} onContextMenu={e => e.preventDefault()} className="pointer-events-none aspect-video w-full rounded-lg bg-muted" aria-label="فيديو الكتاب المضيئ" />
              {playing && !videoDone && <Button type="button" size="sm" variant="secondary" className="absolute bottom-3 left-3" onClick={skip}><SkipForward />تخطي</Button>}
            </div>
            {question.trim().length > 0 && question.trim().length < 3 && !busy && <p className="text-sm text-muted-foreground">{tr("اكتب سؤالًا من ثلاثة أحرف على الأقل.")}</p>}
            <p className="text-sm font-semibold text-foreground" data-testid="credits">{tr("رصيدك:")}{credits} {tr("كريدت · السؤال يكلّف")}{QUESTION_COST}</p>
            {!canAsk(credits) && !busy && (() => { const ms = msUntilRefill(); return ms !== null ? <p className="text-xs text-muted-foreground">يُضاف 30 كريدت مجانًا بعد {Math.floor(ms / 3600000)} ساعة و{Math.ceil((ms % 3600000) / 60000)} {tr("دقيقة")}</p> : null; })()}
            {!canAsk(credits) && !busy && (
              <div className="w-full max-w-xl space-y-3 rounded-xl border border-border bg-card p-4 text-center">
                <p className="font-semibold text-foreground">{tr("انتهى رصيدك. شاهد إعلانات فيديو (30 ثانية لكل إعلان) لتحصل على رصيد جديد:")}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {AD_PACKAGES.map(p => <Button key={p.ads} type="button" variant="secondary" disabled={adBusy} onClick={() => earn(p.ads)}>{p.ads} {tr("إعلانات =")}{p.credits} {tr("كريدت")}</Button>)}
                </div>
                {adMsg && <p className="text-sm text-muted-foreground">{adMsg}</p>}
              </div>
            )}
            {false && <p role="status" className="flex items-center gap-2 text-base font-semibold text-primary"><LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />{tr("جاري إعداد الإجابة…")}</p>}
          </div>
          <form onSubmit={submit} className="sticky bottom-[var(--ad-banner-height,0px)] border-t bg-background pb-4 pt-5">
            <label htmlFor="religious-question" className="mb-3 block text-sm font-semibold">{tr("ما سؤالك؟")}</label>
            <div className="rounded-lg border border-input bg-card p-3 focus-within:ring-1 focus-within:ring-ring">
              <Textarea id="religious-question" value={question} onChange={e => setQuestion(e.target.value)} placeholder={tr("اكتب سؤالك عن القرآن أو التفسير أو الشريعة أو التاريخ الإسلامي…")} maxLength={2000} disabled={busy} className="min-h-24 resize-none border-0 bg-transparent p-1 shadow-none focus-visible:ring-0" />
              <div className="mt-3 flex items-center justify-between gap-3"><span className="text-xs text-muted-foreground">{question.length} / ٢٠٠٠</span><Button type="submit" disabled={busy || question.trim().length < 3}>{busy ? <LoaderCircle className="animate-spin motion-reduce:animate-none" /> : <Send />}{tr("التجربة")}</Button></div>
            </div>
            {error && <p role="alert" className="mt-3 break-words text-sm text-foreground">{error}</p>}
          </form>
        </>
      )}
    </section>
  );
}
