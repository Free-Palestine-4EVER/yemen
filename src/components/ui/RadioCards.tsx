"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  title: string;
  desc?: string;
  icon?: LucideIcon;
}

export function RadioCards({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: RadioOption[];
  value: string;
  onChange: (v: string) => void;
  columns?: 1 | 2 | 3;
}) {
  const grid = { 1: "grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" }[columns];
  return (
    <div className={cn("grid gap-3", grid)}>
      {options.map((opt) => {
        const active = value === opt.value;
        const Icon = opt.icon;
        return (
          <motion.button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "relative flex items-start gap-3 rounded-2xl border p-4 text-start transition-all",
              active
                ? "border-navy-950 bg-navy-950 text-paper shadow-lift"
                : "border-navy-200 bg-white text-navy-900 hover:border-navy-400",
            )}
          >
            {Icon && (
              <div
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-xl",
                  active ? "bg-gold-500 text-navy-950" : "bg-navy-50 text-navy-700",
                )}
              >
                <Icon className="size-5" strokeWidth={1.8} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="font-semibold">{opt.title}</div>
              {opt.desc && (
                <div className={cn("mt-0.5 text-sm", active ? "text-navy-200" : "text-navy-500")}>
                  {opt.desc}
                </div>
              )}
            </div>
            <div
              className={cn(
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border",
                active ? "border-gold-400 bg-gold-400 text-navy-950" : "border-navy-300",
              )}
            >
              {active && <Check className="size-3.5" strokeWidth={3} />}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
