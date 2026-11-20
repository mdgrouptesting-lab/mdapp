"use client";

import { useMemo, useState } from "react";
import { addDoc, collection, doc, query, serverTimestamp, Timestamp, updateDoc, where } from "firebase/firestore";
import { BadgeCheck, Crown, Mail, MapPin, Phone, Search, XCircle } from "lucide-react";
import { Empty } from "./AdminShell";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { fbDb } from "@/lib/firebase";
import { useLive } from "@/lib/useLive";
import { pricing } from "@/lib/config";
import type { UserProfile } from "@/lib/types";
import { daysLeft, formatDate, isSubscriptionActive, toDate } from "@/lib/utils";

type U = UserProfile & { id: string };
const YEAR = 365 * 86400000;

export function UsersManager({ role }: { role: "client" | "worker" }) {
  const { data } = useLive<U>(() => query(collection(fbDb(), "users"), where("role", "==", role)), [role]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = data?.find((u) => u.id === selectedId) || null;

  const list = useMemo(
    () =>
      (data || []).filter((u) => {
        const active = isSubscriptionActive(u.subscription);
        const okF =
          filter === "all" ||
          (filter === "active" && active) ||
          (filter === "inactive" && !active) ||
          (filter === "pending" && u.verification?.status === "pending") ||
          (filter === "verified" && u.verification?.status === "verified");
        const okQ = !q || `${u.name} ${u.email} ${u.phone} ${u.city} ${u.workType}`.toLowerCase().includes(q.toLowerCase());
        return okF && okQ;
      }),
    [data, q, filter],
  );

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <input className="input pl-10" placeholder={`Search ${role}s…`} value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="input w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Membership active</option>
          <option value="inactive">Not paid / expired</option>
          {role === "worker" && <option value="pending">Verification pending</option>}
          {role === "worker" && <option value="verified">Verified</option>}
        </select>
      </div>

      {data === null ? (
        <Empty text="Loading…" />
      ) : list.length === 0 ? (
        <Empty text={`No ${role}s found`} />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy-50 text-xs uppercase tracking-wider text-navy-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  {role === "worker" && <th className="px-4 py-3">Work</th>}
                  <th className="px-4 py-3">Membership</th>
                  {role === "worker" && <th className="px-4 py-3">Verification</th>}
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {list.map((u) => {
                  const active = isSubscriptionActive(u.subscription);
                  return (
                    <tr key={u.id} onClick={() => setSelectedId(u.id)} className="cursor-pointer hover:bg-navy-50/60">
                      <td className="px-4 py-3 font-semibold">{u.name}</td>
                      <td className="px-4 py-3">
                        <p>{u.phone}</p>
                        <p className="text-xs text-navy-500">{u.email}</p>
                      </td>
                      {role === "worker" && (
                        <td className="px-4 py-3">
                          <p>{u.workType}</p>
                          <p className="text-xs text-navy-500">{u.experience}</p>
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <Badge value={active ? "active" : toDate(u.subscription?.expiresAt) ? "expired" : "inactive"} />
                        {role === "worker" && active && <p className="mt-1 text-xs text-navy-400">{daysLeft(u.subscription)} days left</p>}
                      </td>
                      {role === "worker" && (
                        <td className="px-4 py-3">
                          <Badge value={u.verification?.status || "not_submitted"} />
                        </td>
                      )}
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-navy-500">{formatDate(u.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelectedId(null)} title={role === "worker" ? "Worker details" : "Client details"} wide={role === "worker"}>
        {selected && <UserDetail u={selected} />}
      </Modal>
    </div>
  );
}

function UserDetail({ u }: { u: U }) {
  const [note, setNote] = useState(u.verification?.note || "");
  const [busy, setBusy] = useState(false);
  const ref = doc(fbDb(), "users", u.id);
  const active = isSubscriptionActive(u.subscription);
  const plan = u.role === "worker" ? "worker" : "client";

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    }
    setBusy(false);
  };

  const activateManual = () =>
    run(async () => {
      if (!confirm(`Mark ₹${pricing[plan].amount} as received (cash/UPI) and activate membership?`)) return;
      let expiresAt: Timestamp | null = null;
      if (plan === "worker") {
        const cur = toDate(u.subscription?.expiresAt);
        const base = cur && cur.getTime() > Date.now() ? cur.getTime() : Date.now();
        expiresAt = Timestamp.fromMillis(base + YEAR);
      }
      await updateDoc(ref, { subscription: { status: "active", plan, paidAt: serverTimestamp(), expiresAt }, updatedAt: serverTimestamp() });
      await addDoc(collection(fbDb(), "payments"), {
        uid: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        plan,
        amount: pricing[plan].amount,
        orderId: "manual",
        paymentId: `manual-${Date.now()}`,
        status: "manual",
        createdAt: serverTimestamp(),
      });
    });

  const deactivate = () =>
    run(async () => {
      if (!confirm("Deactivate this membership?")) return;
      await updateDoc(ref, { "subscription.status": "inactive", updatedAt: serverTimestamp() });
    });

  const setVerification = (status: "verified" | "rejected") =>
    run(() => updateDoc(ref, { "verification.status": status, "verification.note": note.slice(0, 300), updatedAt: serverTimestamp() }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-2xl font-bold">
            {u.name} {u.verification?.status === "verified" && <BadgeCheck className="h-6 w-6 text-emerald-500" />}
          </p>
          {u.workType && (
            <p className="text-sm font-semibold text-brand-600">
              {u.workType} · {u.experience}
            </p>
          )}
          <div className="mt-3 space-y-1 text-sm text-navy-600">
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <a href={`tel:${u.phone}`} className="hover:underline">
                {u.phone}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> {u.email}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {[u.address, u.city].filter(Boolean).join(", ") || "—"}
            </p>
          </div>
          {u.about && <p className="mt-3 max-w-lg text-sm text-navy-600">{u.about}</p>}
        </div>
        <div className="rounded-2xl bg-navy-50 p-4 text-sm">
          <p className="font-semibold">Membership</p>
          <Badge value={active ? "active" : "inactive"} className="mt-1" />
          <p className="mt-2 text-xs text-navy-500">Paid: {formatDate(u.subscription?.paidAt)}</p>
          {plan === "worker" && <p className="text-xs text-navy-500">Expires: {formatDate(u.subscription?.expiresAt)}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={activateManual} disabled={busy} className="btn-primary btn-sm">
              <Crown className="h-4 w-4" /> {active && plan === "worker" ? "Extend 1 year" : "Activate (cash)"}
            </button>
            {active && (
              <button onClick={deactivate} disabled={busy} className="btn-outline btn-sm">
                Deactivate
              </button>
            )}
          </div>
        </div>
      </div>

      {u.role === "worker" && (
        <div className="rounded-2xl border border-navy-100 p-5">
          <div className="flex items-center justify-between">
            <p className="font-bold">Verification documents</p>
            <Badge value={u.verification?.status || "not_submitted"} />
          </div>
          {u.verification?.idProofUrl || u.verification?.workPhotos?.length ? (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[u.verification?.idProofUrl, ...(u.verification?.workPhotos || [])].filter(Boolean).map((url, i) => (
                <a key={url} href={url} target="_blank" rel="noreferrer" className="relative block aspect-square overflow-hidden rounded-xl bg-navy-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url!} alt="" className="h-full w-full object-cover" />
                  <span className="absolute bottom-1 left-1 rounded bg-navy-950/70 px-1.5 py-0.5 text-[10px] text-white">{i === 0 && u.verification?.idProofUrl ? "ID proof" : "Work"}</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-navy-400">Worker has not uploaded documents yet.</p>
          )}
          <textarea className="input mt-4" placeholder="Note to worker (e.g. reason for rejection)" value={note} onChange={(e) => setNote(e.target.value)} />
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => setVerification("verified")} disabled={busy} className="btn btn-sm bg-emerald-600 text-white hover:bg-emerald-700">
              <BadgeCheck className="h-4 w-4" /> Approve / verify
            </button>
            <button onClick={() => setVerification("rejected")} disabled={busy} className="btn btn-sm bg-rose-600 text-white hover:bg-rose-700">
              <XCircle className="h-4 w-4" /> Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
