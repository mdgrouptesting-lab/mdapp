"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { ClipboardList, Phone, PlusCircle } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { MembershipCard } from "@/components/dashboard/MembershipCard";
import { Badge } from "@/components/ui/Badge";
import { fbDb } from "@/lib/firebase";
import { siteConfig } from "@/lib/config";
import type { ServiceRequest } from "@/lib/types";
import { formatDate, isSubscriptionActive, toDate } from "@/lib/utils";

const statusText: Record<string, string> = {
  new: "Received — our team will call you soon",
  contacted: "We have contacted you",
  assigned: "A verified worker has been assigned",
  in_progress: "Work in progress",
  work_submitted: "Work done — company is verifying",
  completed: "Completed & verified",
  cancelled: "Cancelled",
};

export default function ClientDashboard() {
  const { profile } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[] | null>(null);

  useEffect(() => {
    if (!profile) return;
    const q = query(collection(fbDb(), "serviceRequests"), where("clientId", "==", profile.uid));
    return onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ServiceRequest);
        list.sort((a, b) => (toDate(b.createdAt)?.getTime() || 0) - (toDate(a.createdAt)?.getTime() || 0));
        setRequests(list);
      },
      () => setRequests([]),
    );
  }, [profile]);

  if (!profile) return null;
  const active = isSubscriptionActive(profile.subscription);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-navy-500">Welcome back,</p>
          <h1 className="text-3xl font-extrabold">{profile.name} 👋</h1>
        </div>
        {active && (
          <Link href="/dashboard/client/new-request" className="btn-primary">
            <PlusCircle className="h-5 w-5" /> Report a problem
          </Link>
        )}
      </div>

      <MembershipCard profile={profile} />

      <section className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <ClipboardList className="h-5 w-5 text-brand-500" /> My requests
          </h2>
          <a href={siteConfig.phoneHref} className="flex items-center gap-1.5 text-sm font-semibold text-navy-600">
            <Phone className="h-4 w-4" /> Help
          </a>
        </div>
        {requests === null ? (
          <p className="py-10 text-center text-navy-400">Loading…</p>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-semibold">No requests yet</p>
            <p className="mt-1 text-sm text-navy-500">{active ? "Upload photos of any problem and choose the type — we’ll call you." : "Activate membership to report a problem."}</p>
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-navy-100">
            {requests.map((r) => (
              <li key={r.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
                <div className="flex -space-x-3">
                  {(r.images || []).slice(0, 3).map((u) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={u} src={u} alt="" className="h-14 w-14 rounded-xl border-2 border-white object-cover" />
                  ))}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{r.problem}</p>
                  <p className="text-sm text-navy-500">{statusText[r.status] || r.status}</p>
                  {r.assignedWorkerName && <p className="text-xs text-navy-400">Worker: {r.assignedWorkerName}</p>}
                </div>
                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <Badge value={r.status} />
                  <span className="text-xs text-navy-400">{formatDate(r.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <p className="text-center text-xs text-navy-400">Note: Please pay only MD Group for services. Do not pay workers directly.</p>
    </div>
  );
}
