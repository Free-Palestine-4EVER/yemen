"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "gold" | "outline" | "ghost" | "paper";
type Size = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 font-semibold rounded-full border-2 transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none select-none whitespace-nowrap";

// `gold` is the flame accent; names kept for backward compatibility.
const variants: Record<Variant, string> = {
  primary: "border-ink bg-ink text-canvas hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--color-flame)]",
  gold: "border-ink bg-flame text-ink hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--color-ink)]",
  outline: "border-ink bg-transparent text-ink hover:bg-ink hover:text-canvas",
  ghost: "border-transparent text-ink hover:bg-sand",
  paper: "border-ink bg-canvas text-ink hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--color-ink)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-[15px]",
};

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="inline-block">
      <motion.span
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={cn(base, variants[variant], sizes[size], className)}
      >
        {children}
      </motion.span>
    </Link>
  );
}
