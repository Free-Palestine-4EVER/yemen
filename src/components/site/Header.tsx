"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
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
    { href: "/#how", label: t.nav.how },
    { href: "/#pricing", label: t.nav.pricing },
    { href: "/#destinations", label: t.nav.destinations },
  ];

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-line/70 bg-paper/85 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" aria-label="Manfath home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-navy-700 transition-colors hover:bg-navy-50 hover:text-navy-950"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageToggle />
          {user ? (
            <>
              <ButtonLink href={isAdmin ? "/admin" : "/dashboard"} variant="outline" size="sm">
                <LayoutDashboard className="size-4" />
                {t.nav.dashboard}
              </ButtonLink>
              <Button variant="ghost" size="sm" onClick={() => logout()}>
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost" size="sm">
                {t.nav.login}
              </ButtonLink>
              <ButtonLink href="/register" variant="primary" size="sm">
                {t.nav.start}
              </ButtonLink>
            </>
          )}
        </div>

        {/* mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-full p-2 text-navy-900 hover:bg-navy-50"
            aria-label="Menu"
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-line bg-paper lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 font-medium text-navy-800 hover:bg-navy-50"
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                {user ? (
                  <>
                    <ButtonLink href={isAdmin ? "/admin" : "/dashboard"} variant="outline" size="md">
                      {t.nav.dashboard}
                    </ButtonLink>
                    <Button variant="ghost" size="md" onClick={() => logout()}>
                      {t.nav.logout}
                    </Button>
                  </>
                ) : (
                  <>
                    <ButtonLink href="/login" variant="outline" size="md">
                      {t.nav.login}
                    </ButtonLink>
                    <ButtonLink href="/register" variant="primary" size="md">
                      {t.nav.start}
                    </ButtonLink>
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
