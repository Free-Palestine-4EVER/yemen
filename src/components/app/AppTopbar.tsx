"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useAuth } from "@/lib/firebase/auth-context";
import { useI18n } from "@/lib/i18n/provider";

export function AppTopbar({ right }: { right?: React.ReactNode }) {
  const { logout, user } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  async function onLogout() {
    await logout();
    router.replace("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
        <Link href="/"><Logo /></Link>
        <div className="flex items-center gap-3">
          {right}
          <LanguageToggle />
          {user && (
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">{t.nav.logout}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
