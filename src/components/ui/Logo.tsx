"use client";

import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/**
 * Manfath wordmark + glyph. The glyph is a stylised gateway arch —
 * a nod to "منفذ" (passage) and to Yemeni architecture.
 */
export function Logo({
  className,
  showWord = true,
  tone = "navy",
}: {
  className?: string;
  showWord?: boolean;
  tone?: "navy" | "paper";
}) {
  const { t } = useI18n();
  const word = tone === "paper" ? "text-paper" : "text-navy-950";
  const sub = tone === "paper" ? "text-navy-200" : "text-navy-500";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <GatewayGlyph className="h-8 w-8 shrink-0" tone={tone} />
      {showWord && (
        <span className="flex flex-col leading-none">
          <span className={cn("font-display text-xl font-semibold tracking-tight", word)}>
            {t.brand.name}
          </span>
          <span className={cn("text-[10px] font-medium uppercase tracking-[0.18em]", sub)}>
            Yemen → Europe
          </span>
        </span>
      )}
    </span>
  );
}

export function GatewayGlyph({
  className,
  tone = "navy",
}: {
  className?: string;
  tone?: "navy" | "paper";
}) {
  const main = tone === "paper" ? "#fbfaf7" : "#0f2747";
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
      <rect width="40" height="40" rx="9" fill={main} />
      {/* pointed arch gateway */}
      <path
        d="M20 9c-5 0-9 4-9 9v13h5V18a4 4 0 0 1 8 0v13h5V18c0-5-4-9-9-9Z"
        fill="#d4b25b"
      />
      <path d="M18.5 31V20.5a1.5 1.5 0 0 1 3 0V31h-3Z" fill={main} />
    </svg>
  );
}
