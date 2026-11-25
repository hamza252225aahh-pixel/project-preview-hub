import { Languages } from "lucide-react";
import { useLanguage } from "./language-provider";
import { Button } from "./ui/button";

export function LanguagePicker() {
  const { language, setLanguage } = useLanguage();
  return <div className="flex items-center gap-2" dir="ltr" role="group" aria-label={language === "ar" ? "لغة التطبيق" : "App language"}>
    <Languages className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
    <Button size="sm" variant={language === "ar" ? "default" : "outline"} aria-pressed={language === "ar"} onClick={() => setLanguage("ar")}>العربية</Button>
    <Button size="sm" variant={language === "en" ? "default" : "outline"} aria-pressed={language === "en"} onClick={() => setLanguage("en")}>English</Button>
  </div>;
}