"use client";

import { useMemo, useState } from "react";
import { collection, deleteDoc, doc, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { CheckCircle2, MapPin, Phone, Search, Trash2 } from "lucide-react";
import { Empty, PageTitle } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { fbDb } from "@/lib/firebase";
import { useLive } from "@/lib/useLive";
import type { RequestStatus, ServiceRequest, UserProfile } from "@/lib/types";
import { formatDate, isSubscriptionActive } from "@/lib/utils";

const statuses: RequestStatus[] = ["new", "contacted", "assigned", "in_progress", "work_submitted", "completed", "cancelled"];

export default function RequestsPage() {
  const { data } = useLive<ServiceRequest>(() => collection(fbDb(), "serviceRequests"));
  const { data: workers } = useLive<UserProfile & { id: string }>(() => query(collection(fbDb(), "users"), where("role", "==", "worker")));
  const [filter, setFilter] = useState<string>("open");
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = data?.find((r) => r.id === selectedId) || null;

  const list = useMemo(
    () =>
      (data || []).filter((r) => {
        const okStatus = filter === "all" ? true : filter === "open" ? !["completed", "cancelled"].includes(r.status) : r.status === filter;
        const okQ = !q || `${r.clientName} ${r.clientPhone} ${r.problem} ${r.address}`.toLowerCase().includes(q.toLowerCase());
        return okStatus && okQ;
      }),
    [data, filter, q],
  );

  return (
    <div>
      <PageTitle title="Service requests" subtitle="Problems reported by clients with photos. Call, assign a verified worker and verify the completed work." />
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <input className="input pl-10" placeholder="Search client, phone, problem…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="input w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="open">Open (not completed)</option>
          <option value="all">All</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {data === null ? (
        <Empty text="Loading…" />
      ) : list.length === 0 ? (
        <Empty text="No requests" />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy-50 text-xs uppercase tracking-wider text-navy-500">
                <tr>
                  <th className="px-4 py-3">Problem</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Worker</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {list.map((r) => (
                  <tr key={r.id} onClick={() => setSelectedId(r.id)} className="cursor-pointer hover:bg-navy-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {r.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={r.images[0]} alt="" className="h-11 w-11 rounded-lg object-cover" />
                        ) : (
                          <span className="h-11 w-11 rounded-lg bg-navy-100" />
                        )}
                        <span className="font-semibold">{r.problem}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{r.clientName}</p>
                      <p className="text-xs text-navy-500">{r.clientPhone}</p>
                    </td>
                    <td className="px-4 py-3 text-navy-600">{r.assignedWorkerName || "—"}</td>
                    <td className="px-4 py-3">
                      <Badge value={r.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-navy-500">{formatDate(r.createdAt, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelectedId(null)} title="Service request" wide>
        {selected && <RequestDetail r={selected} workers={workers || []} onDeleted={() => setSelectedId(null)} />}
      </Modal>
    </div>
  );
}

function RequestDetail({ r, workers, onDeleted }: { r: ServiceRequest; workers: (UserProfile & { id: string })[]; onDeleted: () => void }) {
  const [note, setNote] = useState(r.adminNote || "");
  const [workerId, setWorkerId] = useState(r.assignedWorkerId || "");
  const [saving, setSaving] = useState(false);
  const ref = doc(fbDb(), "serviceRequests", r.id);
  const eligible = workers.filter((w) => w.verification?.status === "verified" && isSubscriptionActive(w.subscription));

  const update = async (data: Record<string, unknown>) => {
    setSaving(true);
    try {
      await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    }
    setSaving(false);
  };

  const assign = () => {
    const w = workers.find((x) => x.id === workerId);
    if (!w) return update({ assignedWorkerId: null, assignedWorkerName: null, status: r.status === "assigned" ? "contacted" : r.status });
    update({ assignedWorkerId: w.id, assignedWorkerName: `${w.name} (${w.workType || "worker"})`, status: "assigned" });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-2xl font-bold">{r.problem}</h2>
          <Badge value={r.status} />
        </div>
        <p className="mt-1 text-xs text-navy-400">
          ID {r.id} · {formatDate(r.createdAt, true)}
        </p>
        {r.description && <p className="mt-4 whitespace-pre-line text-navy-700">{r.description}</p>}
        <p className="mt-6 text-sm font-semibold">Client photos</p>
        <Gallery urls={r.images} />
        <p className="mt-6 text-sm font-semibold">Worker completion photos</p>
        <Gallery urls={r.workerImages || []} empty="Not uploaded yet" />
        {r.workerNote && <p className="mt-2 rounded-xl bg-navy-50 p-3 text-sm">Worker note: {r.workerNote}</p>}
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl bg-navy-50 p-4 text-sm">
          <p className="text-lg font-bold">{r.clientName}</p>
          <p className="text-navy-500">{r.clientEmail}</p>
          <p className="mt-2 flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /> {r.address}
          </p>
          {r.preferredTime && <p className="mt-1 text-navy-500">Best time: {r.preferredTime}</p>}
          <a href={`tel:${r.clientPhone}`} className="btn-dark btn-sm mt-3">
            <Phone className="h-4 w-4" /> Call {r.clientPhone}
          </a>
        </div>

        <div>
          <label className="label">Status</label>
          <select className="input" value={r.status} disabled={saving} onChange={(e) => update({ status: e.target.value })}>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Assign worker</label>
          <div className="flex gap-2">
            <select className="input" value={workerId} onChange={(e) => setWorkerId(e.target.value)}>
              <option value="">— Not assigned —</option>
              {eligible.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} · {w.workType} · {w.city || w.phone}
                </option>
              ))}
            </select>
            <button onClick={assign} disabled={saving} className="btn-primary btn-sm shrink-0">
              Save
            </button>
          </div>
          <p className="mt-1 text-xs text-navy-400">Only verified workers with active membership are listed ({eligible.length}).</p>
        </div>

        <div>
          <label className="label">Note for worker / internal</label>
          <textarea className="input min-h-[80px]" value={note} onChange={(e) => setNote(e.target.value)} />
          <button onClick={() => update({ adminNote: note.slice(0, 1000) })} disabled={saving} className="btn-outline btn-sm mt-2">
            Save note
          </button>
        </div>

        {r.status === "work_submitted" && (
          <button onClick={() => update({ status: "completed" })} disabled={saving} className="btn w-full bg-emerald-600 py-3 text-white hover:bg-emerald-700">
            <CheckCircle2 className="h-5 w-5" /> Verify work & mark completed
          </button>
        )}

        <button
          onClick={async () => {
            if (!confirm("Delete this request permanently?")) return;
            await deleteDoc(ref);
            onDeleted();
          }}
          className="flex items-center gap-2 text-sm text-rose-600 hover:underline"
        >
          <Trash2 className="h-4 w-4" /> Delete request
        </button>
      </div>
    </div>
  );
}

function Gallery({ urls, empty = "No photos" }: { urls: string[]; empty?: string }) {
  if (!urls?.length) return <p className="mt-2 text-sm text-navy-400">{empty}</p>;
  return (
    <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
      {urls.map((u) => (
        <a key={u} href={u} target="_blank" rel="noreferrer" className="block aspect-square overflow-hidden rounded-xl bg-navy-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={u} alt="" className="h-full w-full object-cover transition hover:scale-105" />
        </a>
      ))}
    </div>
  );
}
