"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthShell, authError } from "@/components/auth/AuthShell";
import { ConfigNotice } from "@/components/auth/ConfigNotice";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/firebase/auth-context";

function RegisterForm() {
  const { t, locale } = useI18n();
  const { register, ready } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const track = params.get("track");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) return setError(t.auth.mismatch);
    if (password.length < 8) return setError(authError("auth/weak-password", locale));
    setBusy(true);
    try {
      await register(name.trim(), email.trim(), password);
      if (track) sessionStorage.setItem("manfath.track", track);
      router.push("/apply");
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      setError(authError(code, locale));
      setBusy(false);
    }
  }

  return (
    <AuthShell title={t.auth.registerTitle} subtitle={t.auth.registerSub}>
      <form onSubmit={onSubmit} className="space-y-4">
        {!ready && <ConfigNotice />}
        <TextField
          id="name"
          label={t.auth.name}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          id="email"
          type="email"
          label={t.auth.email}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          id="password"
          type="password"
          label={t.auth.password}
          hint={t.auth.passwordHint}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          id="confirm"
          type="password"
          label={t.auth.confirm}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        {error && <p className="text-sm font-medium text-rose-soft">{error}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={busy || !ready}>
          {busy && <Loader2 className="size-4 animate-spin" />}
          {t.auth.register}
        </Button>

        <p className="text-xs leading-relaxed text-navy-400">{t.auth.agree}</p>

        <p className="text-center text-sm text-navy-600">
          {t.auth.haveAccount}{" "}
          <Link href="/login" className="font-semibold text-azure-600 hover:underline">
            {t.auth.login}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
