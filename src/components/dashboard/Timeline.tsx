"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/provider";
import { formatDate } from "@/lib/utils";
import type { TimelineEntry } from "@/lib/firebase/types";

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const { t, locale } = useI18n();
  const sorted = [...entries].sort((a, b) => a.at - b.at);

  return (
    <ol className="relative space-y-5 ps-6">
      <span className="absolute inset-y-1 start-[7px] w-px bg-line" aria-hidden />
      {sorted.map((e, i) => {
        const last = i === sorted.length - 1;
        return (
          <motion.li
            key={`${e.status}-${e.at}`}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative"
          >
            <span
              className={`absolute -start-6 top-1 size-[15px] rounded-full border-2 ${
                last ? "border-gold-500 bg-gold-500" : "border-navy-300 bg-paper"
              }`}
            />
            <div className="flex items-baseline justify-between gap-3">
              <span className={`text-sm font-medium ${last ? "text-navy-950" : "text-navy-700"}`}>
                {t.status[e.status]}
                {e.note ? ` — ${e.note}` : ""}
              </span>
              <span className="shrink-0 text-xs text-navy-400">{formatDate(e.at, locale)}</span>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
