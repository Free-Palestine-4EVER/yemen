"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import { Logo } from "@/components/ui/Logo";
import { CONTACT } from "@/lib/config";
import { YEMEN } from "@/lib/data";
import { Mail, MessageCircle, ArrowUpRight } from "lucide-react";

export function Footer() {
  const { t, locale } = useI18n();
  return (
    <footer className="mt-auto bg-ink text-canvas">
      {/* big marquee word */}
      <div className="overflow-hidden border-b border-canvas/15 py-6">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="flex items-center">
              {[t.cta.button, YEMEN[locale], "→", "Europe", t.brand.name].map((w, i) => (
                <span key={i} className="mx-6 font-display text-3xl font-extrabold uppercase tracking-tight text-canvas/90">
                  {w}<span className="mx-6 text-flame">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 md:grid-cols-[1.5fr_1fr_1fr] lg:px-10">
        <div className="max-w-sm">
          <Logo tone="paper" />
          <p className="mt-4 text-sm leading-relaxed text-canvas/70">{t.brand.tagline}</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-canvas/20 px-3 py-1 text-xs font-semibold">
            {YEMEN.flag} {t.yemen.kicker}
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-flame">{t.footer.product}</h4>
          <ul className="space-y-2.5 text-sm text-canvas/80">
            <li><Link href="/#how" className="hover:text-flame">{t.nav.how}</Link></li>
            <li><Link href="/#pricing" className="hover:text-flame">{t.nav.pricing}</Link></li>
            <li><Link href="/#destinations" className="hover:text-flame">{t.nav.destinations}</Link></li>
            <li><Link href="/register" className="hover:text-flame">{t.nav.start}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-flame">{t.footer.contact}</h4>
          <ul className="space-y-2.5 text-sm text-canvas/80">
            <li>
              <a href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`} className="inline-flex items-center gap-2 hover:text-flame">
                <MessageCircle className="size-4" /> WhatsApp <ArrowUpRight className="size-3" />
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 hover:text-flame">
                <Mail className="size-4" /> {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-canvas/15">
        <div className="mx-auto max-w-[1400px] px-5 py-6 lg:px-10">
          <p className="text-xs leading-relaxed text-canvas/50">{t.footer.disclaimer}</p>
          <p className="mt-3 text-xs text-canvas/40">
            © {new Date().getFullYear()} {t.brand.name} · {YEMEN[locale]}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
