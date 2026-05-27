"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import { Logo } from "@/components/ui/Logo";
import { CONTACT } from "@/lib/config";
import { Mail, MessageCircle } from "lucide-react";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-auto border-t border-navy-800 bg-navy-950 text-navy-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="max-w-sm">
          <Logo tone="paper" />
          <p className="mt-4 text-sm leading-relaxed text-navy-300">{t.brand.tagline}</p>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-navy-400">
            {t.footer.product}
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/#how" className="hover:text-paper">{t.nav.how}</Link></li>
            <li><Link href="/#pricing" className="hover:text-paper">{t.nav.pricing}</Link></li>
            <li><Link href="/#destinations" className="hover:text-paper">{t.nav.destinations}</Link></li>
            <li><Link href="/register" className="hover:text-paper">{t.nav.start}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-navy-400">
            {t.footer.contact}
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`} className="inline-flex items-center gap-2 hover:text-paper">
                <MessageCircle className="size-4" /> WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 hover:text-paper">
                <Mail className="size-4" /> {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-800">
        <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
          <p className="text-xs leading-relaxed text-navy-400">{t.footer.disclaimer}</p>
          <p className="mt-3 text-xs text-navy-500">
            © {new Date().getFullYear()} {t.brand.name}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
