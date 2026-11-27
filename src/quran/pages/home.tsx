import { Link } from "@/quran/wouter-shim";
import illuminatedBookAsset from "@/assets/home-buttons/illuminated-book-button.jpg.asset.json";
import minshawiHeaderUrl from "@/assets/minshawi-header-clear.webp";
import { useLanguage } from "@/quran/components/language-provider";
import { LanguagePicker } from "@/quran/components/language-picker";
import { BookOpen, Sparkles, Headphones, Compass, Clock, Heart } from "lucide-react";

const homeBackground = `${import.meta.env.BASE_URL}quran-home-soft.jpg`;
const buttonAsset = (name: string) =>
  `${import.meta.env.BASE_URL}home-buttons/${name}.png`;

const homeButtons = [
  {
    href: "/quran-audio",
    image: "offline-new",
    label: "القرآن الكريم مرتل بدون نت",
    testid: "link-quran-audio",
  },
  {
    href: "/quran-tajweed",
    image: "tajweed-new",
    label: "القرآن الكريم مجود",
    testid: "link-quran-tajweed",
  },
  {
    href: "/asma-husna",
    image: "asma",
    label: "أسماء الله الحسنى",
    testid: "link-asma-husna",
  },
  {
    href: "/hadith",
    image: "hadith-new",
    label: "الأحاديث النبوية",
    testid: "link-hadith",
  },
  {
    href: "/quran-written",
    image: "written-new",
    label: "القرآن الكريم مكتوب",
    testid: "link-quran-written",
  },
  {
    href: "/prayer-times",
    image: "prayer-new",
    label: "مواقيت الصلاة",
    testid: "link-prayer-times",
  },
  {
    href: "/qibla",
    image: "qibla-new",
    label: "تحديد اتجاه القبلة",
    testid: "link-qibla",
  },
  {
    href: "/duas",
    image: "duas-new",
    label: "الدعاء",
    testid: "link-duas",
  },
  {
    href: "/adhkar",
    image: "adhkar-new",
    label: "الأذكار",
    testid: "link-adhkar",
  },
  {
    href: "/tasbeeh",
    image: "tasbeeh-new",
    label: "التسابيح",
    testid: "link-tasbeeh",
  },
] as const;

export default function Home() {
  const { language, dir, t } = useLanguage();
  const icons = [Headphones, Headphones, Sparkles, BookOpen, BookOpen, Clock, Compass, Heart, Heart, Sparkles];
  return (
    <main
      className="quran-home-screen"
      dir={dir}
      aria-label={t("الصفحة الرئيسية")}
    >
      <div className="quran-home-art">
        <img
          className="quran-home-header"
          src={minshawiHeaderUrl}
          alt={t("فضيلة الشيخ محمد صديق المنشاوي")}
          draggable={false}
        />
        <div
          className="quran-home-bottom-background"
          style={{ backgroundImage: `url(${homeBackground})` }}
          aria-hidden="true"
        />
        <nav className="home-button-stack" aria-label={t("أقسام التطبيق")}>
          <div className="flex flex-wrap items-center justify-between gap-3 py-2"><LanguagePicker/><Link href="/notifications" className="text-sm text-primary underline">{language === "ar" ? "الإعدادات" : "Settings"}</Link></div>
          <Link href="/quran-english" className="flex items-center gap-3 rounded-lg border border-primary/30 bg-card p-4 text-primary" data-testid="link-quran-english"><BookOpen className="size-6 shrink-0"/><span className="font-semibold">{language === "ar" ? "القرآن الكريم بالإنجليزية" : "Quran in English"}</span></Link>
              <Link
                href="/illuminated-book"
                className="home-image-button"
                data-testid="link-illuminated-book"
                aria-label={t("الكتاب المضيئ")}
              >
                {language === "ar" ? <img src={illuminatedBookAsset.url} alt="الكتاب المضيئ — اسأل واعرف وتعلم" draggable={false} /> : <span className="flex items-center gap-4 rounded-lg border border-border bg-card p-5"><Sparkles className="size-6 shrink-0 text-accent"/><span className="font-semibold text-primary">Illuminated Book</span></span>}
              </Link>
          {homeButtons.map((button, index) => {
            const Icon = icons[index] ?? BookOpen;
            return (
            <Link
              key={button.href}
              href={button.href}
              className="home-image-button"
              data-testid={button.testid}
              aria-label={t(button.label)}
            >
              {language === "en" ? <span className="flex items-center gap-4 rounded-lg border border-border bg-card p-5"><Icon className="size-6 shrink-0 text-accent"/><span className="font-semibold text-primary">{t(button.label)}</span></span> : <img
                src={buttonAsset(button.image)}
                alt={button.label}
                draggable={false}
              />}
            </Link>
          ); })}
          <Link href="/privacy" className="block py-2 text-center text-sm text-muted-foreground underline" data-testid="link-privacy">
            {t("سياسة الخصوصية")}
          </Link>
        </nav>
      </div>
    </main>
  );
}