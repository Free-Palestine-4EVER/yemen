"use client";

import { AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";

/** Shown when Firebase env keys aren't set yet, so the app fails gracefully. */
export function ConfigNotice() {
  const { locale } = useI18n();
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-soft/40 bg-amber-soft/10 p-4 text-sm text-navy-800">
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-soft" />
      <p>
        {locale === "ar"
          ? "لم تتم إضافة مفاتيح Firebase بعد. أضف القيم في .env.local لتفعيل تسجيل الدخول والحفظ. (انظر SETUP.md)"
          : "Firebase keys aren't set yet. Add them in .env.local to enable sign-in and saving. (See SETUP.md)"}
      </p>
    </div>
  );
}
