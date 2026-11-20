"use client";

import { useState } from "react";
import { BadgeCheck, Crown, Lock } from "lucide-react";
import type { UserProfile } from "@/lib/types";
import { pricing } from "@/lib/config";
import { daysLeft, formatDate, isSubscriptionActive } from "@/lib/utils";
import { PayButton } from "./PayButton";
import { Alert } from "@/components/ui/Alert";

export function MembershipCard({ profile }: { profile: UserProfile }) {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const role = profile.role === "worker" ? "worker" : "client";
  const plan = pricing[role];
  const active = isSubscriptionActive(profile.subscription);
  const left = daysLeft(profile.subscription);
  const canRenew = role === "worker" && active && left !== null && left <= 30;

  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 md:p-8 ${active ? "bg-navy-950 text-white" : "border-2 border-dashed border-brand-300 bg-brand-50/60"}`}>
      {active && <div className="blueprint-grid absolute inset-0 opacity-40" />}
      {active && <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/30 blur-3xl" />}
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${active ? "bg-gradient-to-br from-brand-400 to-brand-600" : "bg-white text-brand-600 shadow-sm"}`}>
            {active ? <Crown className="h-7 w-7" /> : <Lock className="h-7 w-7" />}
          </span>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wider ${active ? "text-brand-300" : "text-brand-700"}`}>{plan.label}</p>
            {active ? (
              <>
                <p className="mt-1 flex items-center gap-2 text-2xl font-bold">
                  Active <BadgeCheck className="h-6 w-6 text-emerald-400" />
                </p>
                <p className="mt-1 text-sm text-navy-300">
                  {role === "client" ? "Lifetime access — no renewal needed." : `Valid till ${formatDate(profile.subscription.expiresAt)} · ${left} days left`}
                </p>
              </>
            ) : (
              <>
                <p className="mt-1 text-2xl font-bold text-navy-900">{profile.subscription?.status === "expired" || (role === "worker" && profile.subscription?.expiresAt) ? "Membership expired" : "Activate your membership"}</p>
                <p className="mt-1 text-sm text-navy-600">
                  Pay <b>₹{plan.amount}</b> ({plan.period}) to {role === "client" ? "report problems and get service" : "get verified and receive jobs"}.
                </p>
              </>
            )}
          </div>
        </div>
        {(!active || canRenew) && <PayButton label={active ? `Renew · ₹${plan.amount}` : `Pay ₹${plan.amount}`} className="shrink-0 px-7 py-4 text-base" onDone={(ok, text) => setMsg({ ok, text })} />}
      </div>
      {msg && (
        <Alert type={msg.ok ? "success" : "error"} className="relative mt-5">
          {msg.text}
        </Alert>
      )}
    </div>
  );
}
