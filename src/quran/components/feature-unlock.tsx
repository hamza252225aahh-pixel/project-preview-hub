import { useLanguage } from "@/quran/components/language-provider";
import { useEffect, useState, type ReactNode } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/quran/components/ui/button";
import { FEATURE_UNLOCK_ADS, isFeaturesUnlocked, unlockFeatures } from "@/quran/lib/credits";
import { adsAvailable, showRewarded } from "@/quran/lib/ads";

/** Shows its children once Qibla and prayer times were unlocked with two rewarded ads (one time only). */
export function FeatureUnlock({ children }: { children: ReactNode }) {
  const { t: tr, dir: uiDir, language, locale } = useLanguage();
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  useEffect(() => { setUnlocked(isFeaturesUnlocked()); }, []);
  if (unlocked === null) return null;
  if (unlocked) return <>{children}</>;
  async function watch() {
    if (!adsAvailable()) { setMsg(tr("الإعلانات تعمل داخل تطبيق الأندرويد فقط.")); return; }
    setBusy(true); setMsg("");
    for (let i = 1; i <= FEATURE_UNLOCK_ADS; i++) {
      if (i > 1) setMsg(tr("شاهدت {0} من {1}… جارٍ تحميل الإعلان التالي", i - 1, FEATURE_UNLOCK_ADS));
      if (!(await showRewarded())) { setBusy(false); setMsg(tr("لم يكتمل الإعلان أو لا يتوفر إعلان الآن. تأكد من الاتصال بالإنترنت وحاول مرة أخرى.")); return; }
    }
    unlockFeatures(); setBusy(false); setUnlocked(true);
  }
  return (
    <div dir={uiDir} className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
      <Lock className="size-10 text-primary" />
      <h2 className="text-xl font-bold text-primary">{tr("افتح اتجاه القبلة ومواقيت الصلاة")}</h2>
      <p className="text-sm text-muted-foreground">{tr("شاهد إعلانين مرة واحدة فقط، وتبقى الخاصيتان متاحتين لك دائمًا.")}</p>
      <Button onClick={watch} disabled={busy}>{busy ? tr("جارٍ عرض الإعلان…") : tr("شاهد إعلانين للفتح")}</Button>
      {msg && <p role="status" className="text-sm text-muted-foreground">{msg}</p>}
    </div>
  );
}
