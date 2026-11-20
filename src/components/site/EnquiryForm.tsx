"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { services } from "@/lib/services";
import { isValidIndianPhone } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";
import { Alert } from "@/components/ui/Alert";

const empty = { name: "", phone: "", email: "", address: "", service: "", requirement: "", website: "" };

export function EnquiryForm({ compact = false, defaultService = "" }: { compact?: boolean; defaultService?: string }) {
  const [form, setForm] = useState({ ...empty, service: defaultService });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!isValidIndianPhone(form.phone)) return setError("Please enter a valid 10-digit mobile number");
    setLoading(true);
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send enquiry");
      setDone(true);
      setForm({ ...empty, service: defaultService });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (done)
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-9 w-9" />
        </span>
        <h3 className="mt-4 text-2xl font-bold">Thank you!</h3>
        <p className="mt-2 max-w-sm text-navy-500">Your enquiry has reached MD Group. Our team will call you shortly.</p>
        <button onClick={() => setDone(false)} className="btn-outline mt-6">
          Send another enquiry
        </button>
      </div>
    );

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <input type="text" name="website" value={form.website} onChange={set("website")} className="hidden" tabIndex={-1} autoComplete="off" />
      <div>
        <label className="label">Full name *</label>
        <input className="input" required value={form.name} onChange={set("name")} placeholder="Your name" />
      </div>
      <div>
        <label className="label">Phone number *</label>
        <input className="input" required inputMode="tel" value={form.phone} onChange={set("phone")} placeholder="10-digit mobile" />
      </div>
      {!compact && (
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" value={form.email} onChange={set("email")} placeholder="Optional" />
        </div>
      )}
      <div className={compact ? "sm:col-span-2" : ""}>
        <label className="label">Service required *</label>
        <select className="input" required value={form.service} onChange={set("service")}>
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.slug} value={s.title}>
              {s.title}
            </option>
          ))}
          <option value="Repair / Maintenance">Repair / Maintenance</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="label">Site address *</label>
        <input className="input" required value={form.address} onChange={set("address")} placeholder="House / plot, area, city" />
      </div>
      <div className="sm:col-span-2">
        <label className="label">Your requirement *</label>
        <textarea className="input min-h-[110px] resize-y" required value={form.requirement} onChange={set("requirement")} placeholder="E.g. Plot size 30x40, need G+1 house plan and construction estimate…" />
      </div>
      {error && <Alert type="error" className="sm:col-span-2">{error}</Alert>}
      <div className="sm:col-span-2">
        <button disabled={loading} className="btn-primary w-full py-4 text-base">
          {loading ? <Spinner /> : <Send className="h-5 w-5" />} Send Enquiry
        </button>
        <p className="mt-3 text-center text-xs text-navy-400">We usually call back within a few working hours.</p>
      </div>
    </form>
  );
}
