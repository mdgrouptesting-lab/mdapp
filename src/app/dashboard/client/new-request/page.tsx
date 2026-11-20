"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Send } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ImagePicker } from "@/components/dashboard/ImagePicker";
import { MembershipCard } from "@/components/dashboard/MembershipCard";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { authedFetch, uploadImage } from "@/lib/firebase";
import { problemTypes } from "@/lib/workTypes";
import { isSubscriptionActive } from "@/lib/utils";

export default function NewRequestPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [f, setF] = useState({ problem: "", description: "", address: "", phone: "", preferredTime: "" });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (profile) setF((s) => ({ ...s, address: s.address || [profile.address, profile.city].filter(Boolean).join(", "), phone: s.phone || profile.phone }));
  }, [profile]);

  if (!profile) return null;
  if (!isSubscriptionActive(profile.subscription))
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-extrabold">Report a problem</h1>
        <MembershipCard profile={profile} />
      </div>
    );

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!f.problem) return setError("Please choose the problem type");
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        setStatus(`Uploading photo ${i + 1} of ${files.length}…`);
        urls.push(await uploadImage(files[i], `requests/${profile!.uid}`));
      }
      setStatus("Sending to MD Group…");
      await authedFetch("/api/requests", { method: "POST", body: JSON.stringify({ ...f, images: urls }) });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit");
    } finally {
      setStatus("");
    }
  }

  if (done)
    return (
      <div className="card mx-auto max-w-xl p-10 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
        <h1 className="mt-4 text-2xl font-bold">Request sent!</h1>
        <p className="mt-2 text-navy-500">MD Group has received your problem and photos. Our team will call you shortly on {f.phone}.</p>
        <div className="mt-8 flex justify-center gap-3">
          <button onClick={() => router.push("/dashboard/client")} className="btn-dark">
            View my requests
          </button>
          <button
            onClick={() => {
              setDone(false);
              setFiles([]);
              setF((s) => ({ ...s, problem: "", description: "", preferredTime: "" }));
            }}
            className="btn-outline"
          >
            Report another
          </button>
        </div>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard/client" className="text-sm text-navy-500 hover:text-navy-800">
        ← Back
      </Link>
      <h1 className="mt-2 text-3xl font-extrabold">Report a problem</h1>
      <p className="mt-1 text-navy-500">Upload photos and choose the problem. The company gets it instantly and will call you.</p>
      <form onSubmit={submit} className="card mt-8 space-y-6 p-6 md:p-8">
        <div>
          <label className="label">What is the problem? *</label>
          <div className="grid gap-2 sm:grid-cols-2">
            {problemTypes.map((p) => (
              <label key={p} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${f.problem === p ? "border-brand-400 bg-brand-50 ring-4 ring-brand-100" : "border-navy-100 hover:border-navy-300"}`}>
                <input type="radio" name="problem" value={p} checked={f.problem === p} onChange={set("problem")} className="accent-brand-500" />
                {p}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Photos of the problem</label>
          <ImagePicker files={files} onChange={setFiles} />
        </div>
        <div>
          <label className="label">Describe the problem</label>
          <textarea className="input min-h-[110px]" value={f.description} onChange={set("description")} placeholder="Where is it, since when, how big…" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Site address *</label>
            <input className="input" required value={f.address} onChange={set("address")} />
          </div>
          <div>
            <label className="label">Contact number *</label>
            <input className="input" required value={f.phone} onChange={set("phone")} />
          </div>
          <div>
            <label className="label">Best time to call</label>
            <select className="input" value={f.preferredTime} onChange={set("preferredTime")}>
              <option value="">Any time</option>
              <option>Morning (9–12)</option>
              <option>Afternoon (12–4)</option>
              <option>Evening (4–7)</option>
            </select>
          </div>
        </div>
        {error && <Alert type="error">{error}</Alert>}
        <button disabled={!!status} className="btn-primary w-full py-4 text-base">
          {status ? (
            <>
              <Spinner /> {status}
            </>
          ) : (
            <>
              <Send className="h-5 w-5" /> Send to MD Group
            </>
          )}
        </button>
      </form>
    </div>
  );
}
