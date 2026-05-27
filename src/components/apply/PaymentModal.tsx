"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Loader2, Landmark, ShieldCheck } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { FileDrop } from "@/components/ui/FileDrop";
import { useI18n } from "@/lib/i18n/provider";
import { PAYMENT } from "@/lib/config";
import { TRACK_FEE, type Track } from "@/lib/data";
import { uploadFile, saveApplication } from "@/lib/firebase/applications";
import { useAuth } from "@/lib/firebase/auth-context";
import type { Application, UploadedFile } from "@/lib/firebase/types";
import { cn } from "@/lib/utils";

function CopyRow({ label, value, hint }: { label: string; value: string; hint?: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-xl border border-line bg-white p-3.5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wide text-navy-400">{label}</div>
          <div className="mt-0.5 truncate font-mono text-sm font-semibold text-navy-950">{value}</div>
        </div>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            copied ? "border-emerald-soft text-emerald-soft" : "border-navy-200 text-navy-700 hover:border-navy-400",
          )}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? t.payment.copied : t.payment.copy}
        </button>
      </div>
      {hint && <p className="mt-1.5 text-xs text-navy-400">{hint}</p>}
    </div>
  );
}

export function PaymentModal({
  app,
  onClose,
  onSubmitted,
}: {
  app: Application;
  onClose: () => void;
  onSubmitted: (updated: Application) => void;
}) {
  const { t } = useI18n();
  const { ready } = useAuth();
  const amount = app.payment.amount || TRACK_FEE[(app.track || "student") as Track];
  const reference = `${app.personal.firstName} ${app.personal.lastName}`.trim() || app.applicantName;

  const [proof, setProof] = useState<UploadedFile | undefined>(app.payment.proofFile);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function handleProof(file: File) {
    if (!ready) return;
    setUploading(true);
    try {
      const meta = await uploadFile(app.uid, "payment", file);
      setProof(meta);
    } finally {
      setUploading(false);
    }
  }

  async function submit() {
    setBusy(true);
    const updated: Application = {
      ...app,
      paymentStatus: "pending",
      status: "payment_review",
      payment: { ...app.payment, amount, proofFile: proof, submittedAt: Date.now() },
      timeline: [...app.timeline, { status: "payment_review", at: Date.now() }],
    };
    try {
      await saveApplication(updated);
    } catch {
      /* keep going even if offline */
    }
    setDone(true);
    setTimeout(() => onSubmitted(updated), 1100);
  }

  return (
    <Modal onClose={onClose} title={t.payment.title} size="lg">
      {done ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="grid size-16 place-items-center rounded-full bg-emerald-soft/15 text-emerald-soft"
          >
            <Check className="size-8" strokeWidth={3} />
          </motion.div>
          <p className="max-w-xs text-navy-700">{t.payment.pending}</p>
        </div>
      ) : (
        <div>
          <p className="text-sm leading-relaxed text-navy-600">{t.payment.sub}</p>

          {/* amount */}
          <div className="mt-5 flex items-center justify-between rounded-2xl bg-navy-950 px-5 py-4 text-paper">
            <span className="text-sm text-navy-200">{t.payment.amount}</span>
            <span className="font-display text-3xl font-semibold">${amount}</span>
          </div>

          {/* bank details */}
          <div className="mt-4 space-y-2.5">
            <div className="flex items-center gap-2 text-sm font-medium text-navy-700">
              <Landmark className="size-4 text-gold-500" />
              {PAYMENT.bankName}
            </div>
            <CopyRow label={t.payment.bankName} value={PAYMENT.accountNumber} />
            <CopyRow label={t.payment.beneficiary} value={PAYMENT.beneficiary} />
            <CopyRow label={t.payment.reference} value={reference} hint={t.payment.referenceHint} />
          </div>

          {/* proof upload */}
          <div className="mt-5">
            <FileDrop
              label={t.payment.uploadProof}
              value={proof}
              uploading={uploading}
              onFile={handleProof}
            />
          </div>

          <p className="mt-4 inline-flex items-center gap-2 text-xs text-navy-500">
            <ShieldCheck className="size-4 text-emerald-soft" />
            {t.hero.trustline}
          </p>

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button variant="ghost" onClick={onClose}>
              {t.payment.later}
            </Button>
            <Button variant="gold" size="lg" onClick={submit} disabled={busy || uploading || !proof}>
              {busy && <Loader2 className="size-4 animate-spin" />}
              {t.payment.iPaid}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
