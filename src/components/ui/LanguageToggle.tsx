"use client";

import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

export function LanguageToggle({ tone = "navy" }: { tone?: "navy" | "paper" }) {
  const { locale, setLocale } = useI18n();
  const isPaper = tone === "paper";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border p-1 text-sm",
        isPaper ? "border-white/20 text-paper" : "border-navy-200 text-navy-700",
      )}
    >
      <Globe className="ms-1.5 size-3.5 opacity-60" />
      {(["en", "ar"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={cn(
            "rounded-full px-2.5 py-1 font-medium transition-colors",
            locale === l
              ? isPaper
                ? "bg-paper text-navy-950"
                : "bg-navy-950 text-paper"
              : "opacity-70 hover:opacity-100",
          )}
          aria-pressed={locale === l}
        >
          {l === "en" ? "EN" : "ع"}
        </button>
      ))}
    </div>
  );
}
