"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Quote } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useI18n } from "@/lib/i18n/provider";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const { t } = useI18n();
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm"
          >
            <h1 className="font-display text-3xl font-semibold tracking-tight text-navy-950">{title}</h1>
            <p className="mt-2 text-navy-600">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </motion.div>
        </div>
      </div>

      {/* brand side */}
      <div className="relative hidden overflow-hidden bg-navy-950 text-paper lg:block">
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-50" />
        <div className="pointer-events-none absolute -top-32 -end-24 size-[30rem] rounded-full bg-azure-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -start-20 size-[28rem] rounded-full bg-gold-500/10 blur-[120px]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="rule-gold w-40 opacity-60" />
          <div>
            <Quote className="size-10 text-gold-400" />
            <p className="mt-6 max-w-md font-display text-2xl leading-snug">
              {t.brand.tagline}.
            </p>
            <p className="mt-6 max-w-md text-navy-300">{t.cta.subtitle}</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-navy-200">
            <ShieldCheck className="size-5 text-emerald-soft" />
            {t.hero.trustline}
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
