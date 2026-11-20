"use client";

import { useState } from "react";
import { addDoc, collection, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore";
import { Plus, Trash2 } from "lucide-react";
import { Empty, PageTitle } from "@/components/admin/AdminShell";
import { fbDb } from "@/lib/firebase";
import { useLive } from "@/lib/useLive";
import { defaultWorkTypes } from "@/lib/workTypes";
import type { WorkType } from "@/lib/types";

export default function WorkTypesPage() {
  const { data } = useLive<WorkType>(() => collection(fbDb(), "workTypes"));
  const [name, setName] = useState("");
  const list = (data || []).slice().sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.name.localeCompare(b.name));

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    if (list.some((w) => w.name.toLowerCase() === n.toLowerCase())) return alert("Already exists");
    await addDoc(collection(fbDb(), "workTypes"), { name: n, active: true, order: list.length + 1 });
    setName("");
  }

  async function seed() {
    const batch = writeBatch(fbDb());
    defaultWorkTypes.forEach((n, i) => batch.set(doc(collection(fbDb(), "workTypes")), { name: n, active: true, order: i + 1 }));
    await batch.commit();
  }

  return (
    <div className="max-w-3xl">
      <PageTitle title="Types of work" subtitle="Trades workers can choose when registering (carpenter, mason, plumber…)." />
      <form onSubmit={add} className="mb-6 flex gap-2">
        <input className="input" placeholder="e.g. Glass Fitter" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn-primary shrink-0">
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>
      {data === null ? (
        <Empty text="Loading…" />
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-navy-200 bg-white p-10 text-center">
          <p className="text-navy-500">No work types saved yet — the website is using the default list.</p>
          <button onClick={seed} className="btn-dark mt-4">
            Load default list ({defaultWorkTypes.length})
          </button>
        </div>
      ) : (
        <ul className="divide-y divide-navy-100 overflow-hidden rounded-2xl bg-white shadow-card">
          {list.map((w) => (
            <li key={w.id} className="flex items-center gap-3 px-5 py-3">
              <span className={`flex-1 font-medium ${w.active ? "" : "text-navy-400 line-through"}`}>{w.name}</span>
              <label className="flex items-center gap-2 text-sm text-navy-600">
                <input type="checkbox" checked={w.active} onChange={(e) => updateDoc(doc(fbDb(), "workTypes", w.id), { active: e.target.checked })} className="h-4 w-4 accent-brand-500" />
                Active
              </label>
              <button onClick={() => confirm(`Delete "${w.name}"?`) && deleteDoc(doc(fbDb(), "workTypes", w.id))} className="rounded-lg p-2 text-navy-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
