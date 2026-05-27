"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Search, Loader2, FileText, ExternalLink, CheckCircle2, XCircle,
  Mail, Send,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/firebase/auth-context";
import {
  subscribeAllApplications, listApplications, setPaymentStatus, addResponse,
} from "@/lib/firebase/applications";
import type { Application, AppResponse } from "@/lib/firebase/types";
import { destinationByCode } from "@/lib/data";
import { StatusBadge, PaymentBadge } from "@/components/app/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { SelectField } from "@/components/ui/Field";
import { EmailDraftModal } from "./EmailDraftModal";
import { formatDate } from "@/lib/utils";

export function AdminView() {
  const { t, locale } = useI18n();
  const { ready } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [emailUid, setEmailUid] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) {
      listApplications().then((a) => { setApps(a); setLoading(false); }).catch(() => setLoading(false));
      return;
    }
    const unsub = subscribeAllApplications((a) => { setApps(a); setLoading(false); });
    return () => unsub();
  }, [ready]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return apps;
    return apps.filter((a) =>
      [a.applicantName, a.applicantEmail, a.personal.phone, destinationByCode(a.destination)?.en]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(term)),
    );
  }, [apps, q]);

  const selected = apps.find((a) => a.uid === selectedUid) ?? null;
  const emailApp = apps.find((a) => a.uid === emailUid) ?? null;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-navy-950">{t.admin.title}</h1>
          <p className="mt-1 text-navy-600">{t.admin.sub}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-navy-200 bg-white px-4 py-2.5">
          <Search className="size-4 text-navy-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.admin.search}
            className="w-56 bg-transparent text-sm outline-none placeholder:text-navy-300" />
        </div>
      </div>

      <div className="mt-4 flex gap-4 text-sm text-navy-500">
        <span>{t.admin.applicants}: <strong className="text-navy-900">{apps.length}</strong></span>
        <span>{t.status.pending}: <strong className="text-amber-soft">{apps.filter((a) => a.paymentStatus === "pending").length}</strong></span>
      </div>

      {loading ? (
        <div className="grid place-items-center py-24"><Loader2 className="size-7 animate-spin text-navy-300" /></div>
      ) : filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-navy-200 bg-white p-16 text-center text-navy-400">
          {t.admin.empty}
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-paper-2/50 text-start text-xs uppercase tracking-wide text-navy-400">
              <tr>
                <th className="px-5 py-3 text-start font-semibold">{t.auth.name}</th>
                <th className="px-5 py-3 text-start font-semibold">{t.dashboard.track}</th>
                <th className="px-5 py-3 text-start font-semibold">{t.common.country}</th>
                <th className="px-5 py-3 text-start font-semibold">{t.dashboard.paymentStatus}</th>
                <th className="px-5 py-3 text-start font-semibold">{t.dashboard.statusTitle}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((a) => {
                const dest = destinationByCode(a.destination);
                return (
                  <tr key={a.uid} onClick={() => setSelectedUid(a.uid)}
                    className="cursor-pointer transition-colors hover:bg-navy-50/60">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-navy-950">{a.applicantName || "—"}</div>
                      <div className="text-xs text-navy-400">{a.applicantEmail}</div>
                    </td>
                    <td className="px-5 py-3.5 text-navy-700">
                      {a.track === "student" ? t.form.track.student : a.track === "job" ? t.form.track.job : "—"}
                    </td>
                    <td className="px-5 py-3.5">{dest ? `${dest.flag} ${dest[locale]}` : "—"}</td>
                    <td className="px-5 py-3.5"><PaymentBadge status={a.paymentStatus} /></td>
                    <td className="px-5 py-3.5"><StatusBadge status={a.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <ApplicantDetail
            app={selected}
            onClose={() => setSelectedUid(null)}
            onEmail={() => { setEmailUid(selected.uid); }}
          />
        )}
        {emailApp && (
          <EmailDraftModal app={emailApp} onClose={() => setEmailUid(null)} onSent={() => setEmailUid(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ApplicantDetail({ app, onClose, onEmail }: { app: Application; onClose: () => void; onEmail: () => void }) {
  const { t, locale } = useI18n();
  const dest = destinationByCode(app.destination);
  const [resType, setResType] = useState<AppResponse["type"]>("embassy");
  const [resMsg, setResMsg] = useState("");
  const [busy, setBusy] = useState<string>("");

  const docs = [
    { f: app.passport.passportFile, label: t.form.passport.upload },
    { f: app.passport.photoFile, label: t.form.passport.uploadPhoto },
    { f: app.payment.proofFile, label: t.payment.uploadProof },
  ].filter((d) => d.f);

  const facts: [string, string][] = [
    [t.auth.name, app.applicantName],
    [t.form.personal.phone, app.personal.phone],
    [t.form.personal.city, app.personal.city],
    [t.form.passport.number, app.passport.number],
    [t.form.education.field, `${app.education.degree} · ${app.education.field}`],
    [t.form.education.institution, app.education.institution],
    [t.form.languages.title, app.languages.filter((l) => l.language).map((l) => `${l.language} (${l.level})`).join(", ")],
    [t.dashboard.fee, `$${app.payment.amount}`],
  ];

  async function verify(ok: boolean) {
    setBusy(ok ? "verify" : "reject");
    await setPaymentStatus(app.uid, ok ? "verified" : "rejected", ok ? "payment_verified" : undefined);
    setBusy("");
  }

  async function postResponse() {
    if (!resMsg.trim()) return;
    setBusy("response");
    await addResponse(app.uid, resType, resMsg.trim());
    setResMsg("");
    setBusy("");
  }

  return (
    <Modal onClose={onClose} title={app.applicantName || app.applicantEmail} size="lg">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={app.status} />
          <PaymentBadge status={app.paymentStatus} />
          {dest && <span className="rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-700">{dest.flag} {dest[locale]}</span>}
        </div>

        {/* facts */}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
          {facts.map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className="text-xs uppercase tracking-wide text-navy-400">{k}</dt>
              <dd className="truncate text-sm font-medium text-navy-900">{v || "—"}</dd>
            </div>
          ))}
        </dl>

        {/* documents */}
        <div>
          <div className="mb-2 text-sm font-semibold text-navy-800">{t.dashboard.documents}</div>
          <div className="flex flex-wrap gap-2">
            {docs.length === 0 ? <span className="text-sm text-navy-400">—</span> : docs.map((d, i) => (
              <a key={i} href={d.f!.url} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-medium text-navy-700 hover:border-navy-400">
                <FileText className="size-3.5" />{d.label}<ExternalLink className="size-3 text-navy-400" />
              </a>
            ))}
          </div>
        </div>

        {/* payment verification */}
        {app.paymentStatus === "pending" && (
          <div className="flex flex-col gap-3 rounded-xl bg-amber-soft/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm font-medium text-navy-800">{t.admin.verifyPayment}</span>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={() => verify(true)} disabled={!!busy}>
                {busy === "verify" ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                {t.admin.markVerified}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => verify(false)} disabled={!!busy}>
                <XCircle className="size-4" />{t.admin.rejectPayment}
              </Button>
            </div>
          </div>
        )}

        {/* email outreach */}
        <div className="rounded-xl border border-line p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-navy-900">
              <Mail className="size-4 text-azure-600" />{t.admin.generateEmail}
            </div>
            <Button variant="outline" size="sm" onClick={onEmail}
              disabled={app.paymentStatus !== "verified"}>
              <Send className="size-4" />{t.admin.generateEmail}
            </Button>
          </div>
          {app.paymentStatus !== "verified" && (
            <p className="mt-2 text-xs text-navy-400">{t.status.payment_pending}.</p>
          )}
          {app.email?.sentAt && (
            <p className="mt-2 text-xs text-emerald-soft">✓ {t.admin.sent}: {app.email.to} · {formatDate(app.email.sentAt, locale)}</p>
          )}
        </div>

        {/* post response */}
        <div className="rounded-xl border border-line p-4">
          <div className="mb-3 text-sm font-semibold text-navy-900">{t.admin.addResponse}</div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <SelectField className="sm:w-44" value={resType} onChange={(e) => setResType(e.target.value as AppResponse["type"])}>
              <option value="embassy">{t.admin.embassy}</option>
              <option value="job">{t.admin.job}</option>
            </SelectField>
            <textarea value={resMsg} onChange={(e) => setResMsg(e.target.value)} placeholder={t.admin.responseMessage}
              className="min-h-20 flex-1 resize-y rounded-xl border border-navy-200 bg-white px-4 py-3 text-sm focus:border-azure-500 focus:outline-none focus:ring-4 focus:ring-azure-500/10" />
          </div>
          <div className="mt-3 flex justify-end">
            <Button size="sm" onClick={postResponse} disabled={!resMsg.trim() || !!busy}>
              {busy === "response" ? <Loader2 className="size-4 animate-spin" /> : null}
              {t.admin.post}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
