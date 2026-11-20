"use client";

import { useEffect, useState } from "react";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Save } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { fbDb } from "@/lib/firebase";
import { useWorkTypes } from "@/lib/useWorkTypes";
import { isValidIndianPhone } from "@/lib/utils";

export default function ProfilePage() {
  const { profile } = useAuth();
  const workTypes = useWorkTypes();
  const [f, setF] = useState({ name: "", phone: "", address: "", city: "", workType: "", experience: "", about: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);

  useEffect(() => {
    if (profile)
      setF({
        name: profile.name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        workType: profile.workType || "",
        experience: profile.experience || "",
        about: profile.about || "",
      });
  }, [profile]);

  if (!profile) return null;
  const isWorker = profile.role === "worker";
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidIndianPhone(f.phone)) return setMsg({ ok: false, t: "Enter a valid mobile number" });
    setBusy(true);
    setMsg(null);
    try {
      const data: Record<string, unknown> = { name: f.name.trim(), phone: f.phone.trim(), address: f.address.trim(), city: f.city.trim(), updatedAt: serverTimestamp() };
      if (isWorker) Object.assign(data, { workType: f.workType, experience: f.experience, about: f.about.slice(0, 600) });
      await updateDoc(doc(fbDb(), "users", profile!.uid), data);
      setMsg({ ok: true, t: "Profile saved" });
    } catch (err) {
      setMsg({ ok: false, t: err instanceof Error ? err.message : "Could not save" });
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-extrabold">My profile</h1>
      <p className="mt-1 text-navy-500">{profile.email}</p>
      <form onSubmit={save} className="card mt-8 grid gap-4 p-6 sm:grid-cols-2 md:p-8">
        <div className="sm:col-span-2">
          <label className="label">Full name</label>
          <input className="input" required value={f.name} onChange={set("name")} />
        </div>
        <div>
          <label className="label">Mobile</label>
          <input className="input" required value={f.phone} onChange={set("phone")} />
        </div>
        <div>
          <label className="label">City</label>
          <input className="input" value={f.city} onChange={set("city")} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Address</label>
          <input className="input" value={f.address} onChange={set("address")} />
        </div>
        {isWorker && (
          <>
            <div>
              <label className="label">Type of work</label>
              <select className="input" value={f.workType} onChange={set("workType")}>
                {workTypes.map((w) => (
                  <option key={w}>{w}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Experience</label>
              <input className="input" value={f.experience} onChange={set("experience")} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">About</label>
              <textarea className="input min-h-[90px]" value={f.about} onChange={set("about")} />
            </div>
          </>
        )}
        {msg && <Alert type={msg.ok ? "success" : "error"} className="sm:col-span-2">{msg.t}</Alert>}
        <button disabled={busy} className="btn-primary sm:col-span-2">
          {busy ? <Spinner /> : <Save className="h-4 w-4" />} Save changes
        </button>
      </form>
    </div>
  );
}
