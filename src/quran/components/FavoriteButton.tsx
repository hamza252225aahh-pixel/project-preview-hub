import { useLanguage } from "@/quran/components/language-provider";
import { Heart } from "lucide-react";
import { useDhikrFavorites, type FavoriteItem } from "@/quran/hooks/useDhikrFavorites";

export function FavoriteButton({ item, className = "" }: { item: FavoriteItem; className?: string }) {
  const { t: tr, dir: uiDir, language, locale } = useLanguage();
  const { isFavorite, toggle } = useDhikrFavorites();
  const active = isFavorite(item.key);
  return (
    <button
      type="button"
      aria-label={active ? tr("إزالة من المفضلة") : tr("إضافة إلى المفضلة")}
      data-testid={`button-favorite-${item.key}`}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggle(item);
      }}
      className={`p-2 rounded-full transition-colors ${
        active ? "text-accent" : "text-muted-foreground hover:text-accent"
      } ${className}`}
    >
      <Heart className={`w-5 h-5 ${active ? "fill-accent" : ""}`} />
    </button>
  );
}
