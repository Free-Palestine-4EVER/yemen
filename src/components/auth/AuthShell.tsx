"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useI18n } from "@/lib/i18n/provider";
import { YEMEN, DESTINATIONS } from "@/lib/data";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const { t, locale } = useI18n();
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* form side */}
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link href="/"><Logo /></Link>
          <LanguageToggle />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm"
          >
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink">{title}</h1>
            <p className="mt-2 text-ink-soft">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </motion.div>
        </div>
      </div>

      {/* brand side — flame panel */}
      <div className="relative hidden overflow-hidden border-s-2 border-ink bg-flame text-ink lg:block">
        <span className="pointer-events-none absolute -end-10 -top-16 select-none font-display text-[16rem] font-extrabold leading-none text-ink/10">
          {YEMEN.flag}
        </span>
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.2em]">
            {YEMEN.flag} {t.yemen.kicker}
          </div>
          <div>
            <p className="max-w-md font-display text-4xl font-extrabold leading-[1.02]">
              {t.brand.tagline}.
            </p>
            <p className="mt-5 max-w-md text-ink/75">{t.cta.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {DESTINATIONS.slice(0, 8).map((d) => (
                <span key={d.code} className="rounded-full border-2 border-ink bg-flame px-3 py-1 text-sm font-semibold">
                  {d.flag} {d[locale]}
                </span>
              ))}
            </div>
          </div>
          <div className="inline-flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="size-5" /> {t.hero.trustline}
          </div>
        </div>
      </div>
    </div>
  );
}

export function authError(code: string, locale: "en" | "ar") {
  const map: Record<string, { en: string; ar: string }> = {
    "auth/email-already-in-use": { en: "This email is already registered.", ar: "هذا البريد مسجّل بالفعل." },
    "auth/invalid-email": { en: "That email address looks invalid.", ar: "البريد الإلكتروني غير صحيح." },
    "auth/weak-password": { en: "Password is too weak (min 8 characters).", ar: "كلمة المرور ضعيفة (٨ أحرف على الأقل)." },
    "auth/invalid-credential": { en: "Wrong email or password.", ar: "البريد أو كلمة المرور غير صحيحة." },
    "auth/user-not-found": { en: "No account with that email.", ar: "لا يوجد حساب بهذا البريد." },
    "auth/wrong-password": { en: "Wrong email or password.", ar: "البريد أو كلمة المرور غير صحيحة." },
    "auth/too-many-requests": { en: "Too many attempts. Try again later.", ar: "محاولات كثيرة. حاول لاحقًا." },
  };
  return (map[code]?.[locale]) ?? (locale === "ar" ? "حدث خطأ. حاول مرة أخرى." : "Something went wrong. Try again.");
}
