"use client";

import { useState } from "react";
import { Copy, Check, Loader2, Send, ExternalLink, Paperclip } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextField, FieldShell } from "@/components/ui/Field";
import { useI18n } from "@/lib/i18n/provider";
import { buildEmailDraft } from "@/lib/email-template";
import { saveEmailDraft, pushTimeline } from "@/lib/firebase/applications";
import { auth } from "@/lib/firebase/client";
import type { Application } from "@/lib/firebase/types";

export function EmailDraftModal({
  app,
  onClose,
  onSent,
}: {
  app: Application;
  onClose: () => void;
  onSent: () => void;
}) {
  const { t } = useI18n();
  const draft = app.email?.body ? app.email : buildEmailDraft(app);

  const [to, setTo] = useState(app.email?.to ?? "");
  const [subject, setSubject] = useState(draft.subject);
  const [body, setBody] = useState(draft.body);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState("");

  const attachments = [
    app.passport.passportFile && { url: app.passport.passportFile.url, filename: `passport_${app.passport.number || app.uid}.${ext(app.passport.passportFile.type)}` },
    app.passport.photoFile && { url: app.passport.photoFile.url, filename: `photo_${app.uid}.${ext(app.passport.photoFile.type)}` },
  ].filter(Boolean) as { url: string; filename: string }[];

  async function markSent() {
    await saveEmailDraft(app.uid, { to, subject, body, sentAt: Date.now() });
    await pushTimeline(app.uid, "sent", to);
    onSent();
  }

  async function sendViaResend() {
    setBusy(true);
    setNote("");
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token ?? ""}` },
        body: JSON.stringify({ to, subject, body, attachments }),
      });
      const json = await res.json();
      if (json.sent) {
        await markSent();
      } else {
        setNote(reasonText(json.reason));
        setBusy(false);
      }
    } catch {
      setNote(reasonText("send_failed"));
      setBusy(false);
    }
  }

  function gmailUrl() {
    const p = new URLSearchParams({ view: "cm", fs: "1", to, su: subject, body });
    return `https://mail.google.com/mail/?${p.toString()}`;
  }

  return (
    <Modal onClose={onClose} title={t.admin.emailDraft} size="lg">
      <div className="space-y-4">
        <TextField label={t.admin.to} value={to} onChange={(e) => setTo(e.target.value)}
          placeholder="visa@embassy.example" type="email" />
        <TextField label={t.admin.subject} value={subject} onChange={(e) => setSubject(e.target.value)} />
        <FieldShell label={t.admin.body}>
          <textarea value={body} onChange={(e) => setBody(e.target.value)}
            className="min-h-64 w-full resize-y rounded-xl border border-navy-200 bg-white px-4 py-3 font-mono text-[13px] leading-relaxed text-navy-900 focus:border-azure-500 focus:outline-none focus:ring-4 focus:ring-azure-500/10" />
        </FieldShell>

        <div>
          <div className="mb-2 text-sm font-medium text-navy-800">{t.admin.attachments}</div>
          {attachments.length === 0 ? (
            <p className="text-sm text-navy-400">—</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {attachments.map((a) => (
                <li key={a.url}>
                  <a href={a.url} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-medium text-navy-700 hover:border-navy-400">
                    <Paperclip className="size-3.5" />{a.filename}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {note && <p className="rounded-lg bg-amber-soft/10 px-3 py-2 text-xs text-navy-700">{note}</p>}

        <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <Button variant="outline" size="sm"
            onClick={() => {
              navigator.clipboard?.writeText(`To: ${to}\nSubject: ${subject}\n\n${body}`);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? t.payment.copied : t.payment.copy}
          </Button>

          <a href={gmailUrl()} target="_blank" rel="noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-navy-200 px-4 text-sm font-medium text-navy-800 hover:border-navy-400">
            <ExternalLink className="size-4" /> Gmail
          </a>

          <div className="ms-auto flex gap-2">
            <Button variant="ghost" size="sm" onClick={markSent}>{t.admin.sent}</Button>
            <Button variant="primary" size="sm" onClick={sendViaResend} disabled={busy || !to}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              {t.admin.send}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function ext(mime: string) {
  if (mime?.includes("png")) return "png";
  if (mime?.includes("pdf")) return "pdf";
  return "jpg";
}

function reasonText(reason: string) {
  const map: Record<string, string> = {
    resend_not_configured: "Email sending isn't set up yet (no Resend key). Use Gmail or Copy below, then mark as sent.",
    auth_not_configured: "Server can't verify admin yet (no service account). Use Gmail or Copy below, then mark as sent.",
    unauthorized: "Your session expired. Please sign in again.",
    forbidden: "This account isn't an admin.",
  };
  return map[reason] ?? `Could not send: ${reason}. Use Gmail or Copy instead.`;
}
