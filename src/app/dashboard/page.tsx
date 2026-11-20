"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { FullPageLoader } from "@/components/auth/RequireRole";

export default function DashboardIndex() {
  const { profile } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (profile) router.replace(profile.role === "worker" ? "/dashboard/worker" : "/dashboard/client");
  }, [profile, router]);
  return <FullPageLoader />;
}
