"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/firebase/auth-context";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink, Button } from "@/components/ui/Button";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { cn } from "@/lib/utils";

export function Header() {
  const { t } = useI18n();
  const { user, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/#how", label: t.nav.how, n: "01" },
    { href: "/#pricing", label: t.nav.pricing, n: "02" },
    { href: "/#destinations", label: t.nav.destinations, n: "03" },
  ];

  return (
    <motion.header
      initial={{ y: -90 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "border-b-2 border-ink bg-canvas/90 backdrop-blur-xl" : "border-b-2 border-transparent",
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 lg:px-10">
        <Link href="/" aria-label="Manfath home"><Logo /></Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="group flex items-center gap-1.5 text-sm font-semibold text-ink">
              <span className="font-display text-[10px] text-flame">{l.n}</span>
              <span className="relative">
                {l.label}
                <span className="absolute -bottom-1 start-0 h-0.5 w-0 bg-flame transition-all duration-300 group-hover:w-full" />
              </span>
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageToggle />
          {user ? (
            <>
              <ButtonLink href={isAdmin ? "/admin" : "/dashboard"} variant="outline" size="sm">
                {t.nav.dashboard}
              </ButtonLink>
              <Button variant="ghost" size="sm" onClick={() => logout()}>{t.nav.logout}</Button>
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost" size="sm">{t.nav.login}</ButtonLink>
              <ButtonLink href="/register" variant="gold" size="sm">
                {t.nav.start}<ArrowUpRight className="size-4" />
              </ButtonLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle />
          <button onClick={() => setOpen((o) => !o)} className="rounded-full border-2 border-ink p-1.5 text-ink" aria-label="Menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden border-t-2 border-ink bg-canvas lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-lg font-semibold text-ink hover:bg-sand">
                  <span className="font-display text-xs text-flame">{l.n}</span>{l.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                {user ? (
                  <>
                    <ButtonLink href={isAdmin ? "/admin" : "/dashboard"} variant="outline" size="md">{t.nav.dashboard}</ButtonLink>
                    <Button variant="ghost" size="md" onClick={() => logout()}>{t.nav.logout}</Button>
                  </>
                ) : (
                  <>
                    <ButtonLink href="/login" variant="outline" size="md">{t.nav.login}</ButtonLink>
                    <ButtonLink href="/register" variant="gold" size="md">{t.nav.start}</ButtonLink>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
