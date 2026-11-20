"use client";

import { useMemo, useState } from "react";
import { collection } from "firebase/firestore";
import { IndianRupee } from "lucide-react";
import { Empty, PageTitle } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { fbDb } from "@/lib/firebase";
import { useLive } from "@/lib/useLive";
import type { Payment } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function PaymentsPage() {
  const { data } = useLive<Payment>(() => collection(fbDb(), "payments"));
  const [plan, setPlan] = useState("all");
  const list = useMemo(() => (data || []).filter((p) => plan === "all" || p.plan === plan), [data, plan]);
  const total = (arr: Payment[]) => arr.reduce((s, p) => s + (Number(p.amount) || 0), 0);

  return (
    <div>
      <PageTitle title="Payments" subtitle="Membership payments received (online via Razorpay and manual cash entries)." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total collected", value: total(data || []) },
          { label: "From clients", value: total((data || []).filter((p) => p.plan === "client")) },
          { label: "From workers", value: total((data || []).filter((p) => p.plan === "worker")) },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-5 shadow-card">
            <p className="text-sm text-navy-500">{c.label}</p>
            <p className="mt-1 flex items-center font-display text-3xl font-extrabold">
              <IndianRupee className="h-6 w-6" />
              {c.value.toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>
      <select className="input mb-4 w-auto" value={plan} onChange={(e) => setPlan(e.target.value)}>
        <option value="all">All plans</option>
        <option value="client">Client lifetime</option>
        <option value="worker">Worker yearly</option>
      </select>
      {data === null ? (
        <Empty text="Loading…" />
      ) : list.length === 0 ? (
        <Empty text="No payments yet" />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy-50 text-xs uppercase tracking-wider text-navy-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment ID</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {list.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{p.name || "—"}</p>
                      <p className="text-xs text-navy-500">{p.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge value={p.plan} />
                    </td>
                    <td className="px-4 py-3 font-semibold">₹{p.amount}</td>
                    <td className="px-4 py-3 font-mono text-xs">{p.paymentId}</td>
                    <td className="px-4 py-3">
                      <Badge value={p.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-navy-500">{formatDate(p.createdAt, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
