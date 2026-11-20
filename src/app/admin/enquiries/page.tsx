"use client";

import { useMemo, useState } from "react";
import { collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { MapPin, MessageCircle, Phone, Search, Trash2 } from "lucide-react";
import { Empty, PageTitle } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { fbDb } from "@/lib/firebase";
import { useLive } from "@/lib/useLive";
import type { Enquiry } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const statuses = ["all", "new", "contacted", "closed"] as const;

export default function EnquiriesPage() {
  const { data, error } = useLive<Enquiry>(() => collection(fbDb(), "enquiries"));
  const [filter, setFilter] = useState<(typeof statuses)[number]>("all");
  const [q, setQ] = useState("");

  const list = useMemo(
    () =>
      (data || []).filter(
        (e) => (filter === "all" || e.status === filter) && (!q || `${e.name} ${e.phone} ${e.address} ${e.service} ${e.requirement}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [data, filter, q],
  );

  const setStatus = (id: string, status: string) => updateDoc(doc(fbDb(), "enquiries", id), { status });
  const remove = (id: string) => confirm("Delete this enquiry?") && deleteDoc(doc(fbDb(), "enquiries", id));
  const wa = (p: string) => `https://wa.me/${p.replace(/\D/g, "").replace(/^(?!91)(\d{10})$/, "91$1")}`;

  return (
    <div>
      <PageTitle title="Enquiries" subtitle="Enquiries from the website — call the customer and update the status." />
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          <input className="input pl-10" placeholder="Search name, phone, address…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex gap-1 rounded-xl bg-white p-1 shadow-sm">
          {statuses.map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize ${filter === s ? "bg-navy-900 text-white" : "text-navy-600"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="mb-4 text-sm text-rose-600">{error}</p>}
      {data === null ? (
        <Empty text="Loading…" />
      ) : list.length === 0 ? (
        <Empty text="No enquiries found" />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {list.map((e) => (
            <div key={e.id} className="rounded-2xl bg-white p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold">{e.name}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{e.service}</p>
                </div>
                <Badge value={e.status} />
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-navy-700">{e.requirement}</p>
              <div className="mt-3 space-y-1 text-sm text-navy-500">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> {e.phone} {e.email && `· ${e.email}`}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {e.address}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-navy-100 pt-4">
                <a href={`tel:${e.phone}`} className="btn-dark btn-sm">
                  <Phone className="h-4 w-4" /> Call
                </a>
                <a href={wa(e.phone)} target="_blank" rel="noreferrer" className="btn-sm btn bg-emerald-500 text-white hover:bg-emerald-600">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <select className="input w-auto py-2 text-xs" value={e.status} onChange={(ev) => setStatus(e.id, ev.target.value)}>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
                <span className="ml-auto text-xs text-navy-400">{formatDate(e.createdAt, true)}</span>
                <button onClick={() => remove(e.id)} className="rounded-lg p-2 text-navy-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
