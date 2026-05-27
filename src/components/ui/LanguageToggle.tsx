"use client";

import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  const { locale, setLocale } = useI18n();
  const isPaper = tone === "paper";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border-2 p-0.5 text-[13px] font-semibold",
        isPaper ? "border-canvas/30 text-canvas" : "border-ink text-ink",
      )}
    >
      {(["en", "ar"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={cn(
            "rounded-full px-2.5 py-0.5 transition-colors",
            locale === l
              ? isPaper
                ? "bg-canvas text-ink"
                : "bg-ink text-canvas"
              : "opacity-60 hover:opacity-100",
          )}
          aria-pressed={locale === l}
        >
          {l === "en" ? "EN" : "ع"}
        </button>
      ))}
    </div>
  );
}
