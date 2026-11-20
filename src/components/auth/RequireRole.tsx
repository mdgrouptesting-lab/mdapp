"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import type { Role } from "@/lib/types";
import { Spinner } from "@/components/ui/Spinner";

/** Client-side gate. Real protection is enforced by Firestore rules + API checks. */
export function RequireRole({ roles, children }: { roles: Role[]; children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    else if (profile && !roles.includes(profile.role)) router.replace(profile.role === "admin" ? "/admin" : "/dashboard");
  }, [loading, user, profile, roles, router, pathname]);

  if (loading || !user) return <FullPageLoader />;
  if (!profile)
    return (
      <div className="grid min-h-[60vh] place-items-center p-6 text-center">
        <div>
          <p className="font-semibold">Setting up your account…</p>
          <p className="mt-1 text-sm text-navy-500">If this takes long, finish your registration:</p>
          <div className="mt-4 flex justify-center gap-2">
            <a href="/register/client" className="btn-outline btn-sm">I am a client</a>
            <a href="/register/worker" className="btn-outline btn-sm">I am a worker</a>
          </div>
        </div>
      </div>
    );
  if (!roles.includes(profile.role)) return <FullPageLoader />;
  return <>{children}</>;
}

export function FullPageLoader() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <Spinner className="h-8 w-8 text-brand-500" />
    </div>
  );
}
