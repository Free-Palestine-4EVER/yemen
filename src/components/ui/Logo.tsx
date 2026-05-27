"use client";

import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/** Manfath wordmark + gateway glyph (a Yemeni pointed-arch passage). */
export function Logo({
  className,
  showWord = true,
  tone = "ink",
}: {
  className?: string;
  showWord?: boolean;
  tone?: "ink" | "paper";
}) {
  const { t } = useI18n();
  const word = tone === "paper" ? "text-canvas" : "text-ink";
  const sub = tone === "paper" ? "text-bloom" : "text-flame";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <GatewayGlyph className="h-9 w-9 shrink-0" tone={tone} />
      {showWord && (
        <span className="flex flex-col leading-none">
          <span className={cn("font-display text-[22px] font-extrabold tracking-tight", word)}>
            {t.brand.name}
          </span>
          <span className={cn("mt-0.5 text-[9px] font-semibold uppercase tracking-[0.22em]", sub)}>
            Yemen → Europe
          </span>
        </span>
      )}
    </span>
  );
}

export function GatewayGlyph({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "paper";
}) {
  const frame = tone === "paper" ? "#f3ede1" : "#19140f";
  const inner = tone === "paper" ? "#19140f" : "#f3ede1";
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden>
      <rect x="1" y="1" width="38" height="38" rx="3" fill={inner} stroke={frame} strokeWidth="2" />
      {/* pointed arch passage */}
      <path d="M20 8c-6 0-10 5-10 11v13h6V19a4 4 0 0 1 8 0v13h6V19c0-6-4-11-10-11Z" fill="#ff4d17" />
      <path d="M17.5 32V20.5a2.5 2.5 0 0 1 5 0V32h-5Z" fill={inner} />
    </svg>
  );
}
