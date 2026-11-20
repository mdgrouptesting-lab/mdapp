"use client";

import { useState } from "react";
import { collection, doc, getDocs, limit, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { ShieldCheck, UserMinus, UserPlus } from "lucide-react";
import { Empty, PageTitle } from "@/components/admin/AdminShell";
import { Alert } from "@/components/ui/Alert";
import { useAuth } from "@/components/auth/AuthProvider";
import { fbDb } from "@/lib/firebase";
import { useLive } from "@/lib/useLive";
import type { UserProfile } from "@/lib/types";

type U = UserProfile & { id: string; previousRole?: "client" | "worker" };

export default function TeamPage() {
  const { profile } = useAuth();
  const { data } = useLive<U>(() => query(collection(fbDb(), "users"), where("role", "==", "admin")));
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);

  async function promote(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const snap = await getDocs(query(collection(fbDb(), "users"), where("email", "==", email.trim().toLowerCase()), limit(1)));
    if (snap.empty) return setMsg({ ok: false, t: "No registered user with this email. Ask them to register first." });
    const d = snap.docs[0];
    const data = d.data() as U;
    if (data.role === "admin") return setMsg({ ok: false, t: "Already an admin." });
    if (!confirm(`Give FULL admin access to ${data.name}?`)) return;
    await updateDoc(doc(fbDb(), "users", d.id), { role: "admin", previousRole: data.role, updatedAt: serverTimestamp() });
    setMsg({ ok: true, t: `${data.name} is now an admin.` });
    setEmail("");
  }

  async function demote(u: U) {
    if (u.id === profile?.uid) return alert("You cannot remove your own admin access.");
    if (!confirm(`Remove admin access from ${u.name}?`)) return;
    await updateDoc(doc(fbDb(), "users", u.id), { role: u.previousRole || "client", updatedAt: serverTimestamp() });
  }

  return (
    <div className="max-w-3xl">
      <PageTitle title="Admins & roles" subtitle="The owner has all access. Give admin access to trusted staff only." />
      <Alert type="info" className="mb-6">
        Owner emails listed in <code>ADMIN_EMAILS</code> (in .env) automatically become admin when they register.
      </Alert>
      <form onSubmit={promote} className="mb-4 flex gap-2">
        <input className="input" type="email" required placeholder="Registered user's email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn-primary shrink-0">
          <UserPlus className="h-4 w-4" /> Make admin
        </button>
      </form>
      {msg && <Alert type={msg.ok ? "success" : "error"} className="mb-4">{msg.t}</Alert>}
      {data === null ? (
        <Empty text="Loading…" />
      ) : (
        <ul className="divide-y divide-navy-100 overflow-hidden rounded-2xl bg-white shadow-card">
          {data.map((u) => (
            <li key={u.id} className="flex items-center gap-4 px-5 py-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-semibold">
                  {u.name} {u.id === profile?.uid && <span className="text-xs text-navy-400">(you)</span>}
                </p>
                <p className="text-sm text-navy-500">{u.email}</p>
              </div>
              {u.id !== profile?.uid && (
                <button onClick={() => demote(u)} className="btn-outline btn-sm">
                  <UserMinus className="h-4 w-4" /> Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
