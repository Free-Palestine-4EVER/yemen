"use client";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";
import type { ApplicationStatus, PaymentStatus } from "@/lib/firebase/types";

const statusTone: Record<ApplicationStatus, string> = {
  draft: "bg-navy-100 text-navy-600",
  submitted: "bg-azure-500/12 text-azure-600",
  payment_pending: "bg-amber-soft/15 text-amber-soft",
  payment_review: "bg-amber-soft/15 text-amber-soft",
  payment_verified: "bg-emerald-soft/15 text-emerald-soft",
  sent: "bg-navy-950 text-paper",
  response: "bg-gold-500/20 text-gold-600",
};

const paymentTone: Record<PaymentStatus, string> = {
  unpaid: "bg-navy-100 text-navy-600",
  pending: "bg-amber-soft/15 text-amber-soft",
  verified: "bg-emerald-soft/15 text-emerald-soft",
  rejected: "bg-rose-soft/15 text-rose-soft",
};

const statusKey: Record<ApplicationStatus, keyof ReturnType<typeof useStatusDict>> = {
  draft: "draft",
  submitted: "submitted",
  payment_pending: "payment_pending",
  payment_review: "payment_review",
  payment_verified: "payment_verified",
  sent: "sent",
  response: "response",
};

function useStatusDict() {
  return useI18n().t.status;
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const s = useStatusDict();
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", statusTone[status])}>
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {s[statusKey[status]]}
    </span>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const s = useStatusDict();
  const label: Record<PaymentStatus, string> = {
    unpaid: s.unpaid,
    pending: s.pending,
    verified: s.verified,
    rejected: s.rejected,
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", paymentTone[status])}>
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {label[status]}
    </span>
  );
}
