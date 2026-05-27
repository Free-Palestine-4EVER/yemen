"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/firebase/auth-context";
import { useI18n } from "@/lib/i18n/provider";

export function Guard({
  children,
  admin = false,
}: {
  children: ReactNode;
  admin?: boolean;
}) {
  const { user, loading, isAdmin } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="size-8 animate-spin text-navy-300" />
      </div>
    );
  }

  if (admin && !isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <p className="max-w-sm text-navy-600">{t.admin.noAccess}</p>
      </div>
    );
  }

  return <>{children}</>;
}
