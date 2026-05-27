"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthShell, authError } from "@/components/auth/AuthShell";
import { ConfigNotice } from "@/components/auth/ConfigNotice";
import { TextField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/provider";
import { useAuth } from "@/lib/firebase/auth-context";
import { isAdminEmail } from "@/lib/config";

export default function LoginPage() {
  const { t, locale } = useI18n();
  const { login, ready } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email.trim(), password);
      router.push(isAdminEmail(email.trim()) ? "/admin" : "/dashboard");
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      setError(authError(code, locale));
      setBusy(false);
    }
  }

  return (
    <AuthShell title={t.auth.loginTitle} subtitle={t.auth.loginSub}>
      <form onSubmit={onSubmit} className="space-y-4">
        {!ready && <ConfigNotice />}
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
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-sm font-medium text-rose-soft">{error}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={busy || !ready}>
          {busy && <Loader2 className="size-4 animate-spin" />}
          {t.auth.login}
        </Button>

        <p className="text-center text-sm text-navy-600">
          {t.auth.noAccount}{" "}
          <Link href="/register" className="font-semibold text-azure-600 hover:underline">
            {t.auth.register}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
