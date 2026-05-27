"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import {
  FileText, MessageSquare, Briefcase, Building2, Loader2, ArrowRight,
  FileCheck2, ExternalLink, Clock,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/firebase/auth-context";
import { subscribeApplication, getApplication } from "@/lib/firebase/applications";
import type { Application } from "@/lib/firebase/types";
import { destinationByCode } from "@/lib/data";
import { StatusBadge, PaymentBadge } from "@/components/app/StatusBadge";
import { Timeline } from "./Timeline";
import { Button, ButtonLink } from "@/components/ui/Button";
import { PaymentModal } from "@/components/apply/PaymentModal";
import { formatDate } from "@/lib/utils";

function Card({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-line bg-white p-6 shadow-card ${className ?? ""}`}>
      {title && <h2 className="mb-4 font-display text-lg font-semibold text-navy-950">{title}</h2>}
      {children}
    </section>
  );
}

export function DashboardView() {
  const { t, locale } = useI18n();
  const { user, ready } = useAuth();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [payOpen, setPayOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (!ready) {
      getApplication(user.uid).then((a) => { setApp(a); setLoading(false); }).catch(() => setLoading(false));
      return;
    }
    const unsub = subscribeApplication(user.uid, (a) => { setApp(a); setLoading(false); });
    return () => unsub();
  }, [user, ready]);

  if (loading) {
    return <div className="grid place-items-center py-32"><Loader2 className="size-7 animate-spin text-navy-300" /></div>;
  }

  const name = user?.displayName || app?.applicantName || "";

  if (!app || app.status === "draft") {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="font-display text-3xl font-semibold text-navy-950">
          {t.dashboard.welcome}{name ? `, ${name.split(" ")[0]}` : ""}.
        </h1>
        <div className="mt-8 rounded-3xl border border-dashed border-navy-200 bg-white p-12 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-navy-50 text-navy-600">
            <FileText className="size-7" />
          </div>
          <p className="mt-5 text-navy-600">{t.dashboard.noApp}</p>
          <div className="mt-6 flex justify-center">
            <ButtonLink href="/apply" size="lg" variant="primary">
              {t.dashboard.startApp}<ArrowRight className="size-4 rtl:rotate-180" />
            </ButtonLink>
          </div>
        </div>
      </div>
    );
  }

  const dest = destinationByCode(app.destination);
  const needsPayment = app.paymentStatus === "unpaid" || app.paymentStatus === "rejected";

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 lg:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold text-navy-950">
          {t.dashboard.welcome}{name ? `, ${name.split(" ")[0]}` : ""}.
        </h1>
        <StatusBadge status={app.status} />
      </div>

      {/* overview */}
      <Card className="mt-6">
        <div className="grid gap-5 sm:grid-cols-4">
          <Stat label={t.dashboard.track} value={app.track === "student" ? t.form.track.student : t.form.track.job}
            icon={app.track === "student" ? FileCheck2 : Briefcase} />
          <Stat label={t.dashboard.destination} value={dest ? `${dest.flag} ${dest[locale]}` : "—"} icon={Building2} />
          <Stat label={t.dashboard.fee} value={`$${app.payment.amount}`} icon={FileText} />
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-navy-400">{t.dashboard.paymentStatus}</div>
            <div className="mt-2"><PaymentBadge status={app.paymentStatus} /></div>
          </div>
        </div>

        {needsPayment && (
          <div className="mt-5 flex flex-col gap-3 rounded-xl bg-amber-soft/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium text-navy-800">{t.dashboard.payNow}</span>
            <Button variant="gold" size="sm" onClick={() => setPayOpen(true)}>{t.payment.title}</Button>
          </div>
        )}
        {app.paymentStatus === "pending" && (
          <p className="mt-5 inline-flex items-center gap-2 rounded-xl bg-navy-50 px-4 py-3 text-sm text-navy-700">
            <Clock className="size-4 text-amber-soft" />{t.payment.pending}
          </p>
        )}
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* responses */}
        <Card title={t.dashboard.responses}>
          {app.responses.length === 0 ? (
            <p className="text-sm leading-relaxed text-navy-500">{t.dashboard.noResponses}</p>
          ) : (
            <ul className="space-y-3">
              {[...app.responses].sort((a, b) => b.at - a.at).map((r) => (
                <li key={r.id} className="rounded-xl border border-line bg-paper p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                    {r.type === "embassy" ? <Building2 className="size-4 text-azure-600" /> : <Briefcase className="size-4 text-gold-600" />}
                    {r.type === "embassy" ? t.admin.embassy : t.admin.job}
                    <span className="ms-auto text-xs font-normal text-navy-400">{formatDate(r.at, locale)}</span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-navy-700">{r.message}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* timeline */}
        <Card title={t.dashboard.timeline}>
          <Timeline entries={app.timeline} />
        </Card>
      </div>

      {/* documents */}
      <Card title={t.dashboard.documents} className="mt-6">
        <div className="flex flex-wrap gap-3">
          {[
            { f: app.passport.passportFile, label: t.form.passport.upload },
            { f: app.passport.photoFile, label: t.form.passport.uploadPhoto },
            { f: app.payment.proofFile, label: t.payment.uploadProof },
          ]
            .filter((d) => d.f)
            .map((d, i) => (
              <a key={i} href={d.f!.url} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-paper px-4 py-2.5 text-sm font-medium text-navy-800 hover:border-navy-400">
                <FileText className="size-4 text-navy-500" />{d.label}
                <ExternalLink className="size-3.5 text-navy-400" />
              </a>
            ))}
          {!app.passport.passportFile && !app.payment.proofFile && (
            <span className="text-sm text-navy-400">—</span>
          )}
        </div>
        <div className="mt-5">
          <Link href="/apply" className="inline-flex items-center gap-1.5 text-sm font-medium text-azure-600 hover:underline">
            <MessageSquare className="size-4" />{t.dashboard.continueApp}
          </Link>
        </div>
      </Card>

      <AnimatePresence>
        {payOpen && (
          <PaymentModal app={app} onClose={() => setPayOpen(false)} onSubmitted={() => setPayOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-navy-400">{label}</div>
      <div className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-navy-950">
        <Icon className="size-4 text-navy-400" />{value}
      </div>
    </div>
  );
}
