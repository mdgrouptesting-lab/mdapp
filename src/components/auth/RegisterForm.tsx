"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Eye, EyeOff } from "lucide-react";
import { authedFetch, fbAuth, firebaseConfigured } from "@/lib/firebase";
import { useAuth } from "./AuthProvider";
import { useWorkTypes } from "@/lib/useWorkTypes";
import { pricing } from "@/lib/config";
import { isValidIndianPhone } from "@/lib/utils";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";

const FIREBASE_ERRORS: Record<string, string> = {
  "auth/email-already-in-use": "This email is already registered. Please log in.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/invalid-email": "Please enter a valid email address.",
};
const firebaseError = (code: string) => FIREBASE_ERRORS[code] || "Registration failed. Please try again.";

export function RegisterForm({ role }: { role: "client" | "worker" }) {
  const router = useRouter();
  const { user, profile } = useAuth();
  const workTypes = useWorkTypes();
  const finishing = !!user && !profile; // logged in but profile not created yet
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", address: "", city: "", workType: "", experience: "", about: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!firebaseConfigured) return setError("Firebase is not configured yet (.env.local).");
    if (!isValidIndianPhone(f.phone)) return setError("Enter a valid 10-digit mobile number");
    if (role === "worker" && !f.workType) return setError("Please select your type of work");
    setLoading(true);
    try {
      if (!finishing) {
        const cred = await createUserWithEmailAndPassword(fbAuth(), f.email.trim(), f.password);
        await updateProfile(cred.user, { displayName: f.name });
      }
      await authedFetch("/api/auth/register", { method: "POST", body: JSON.stringify({ ...f, password: undefined, role }) });
      router.replace("/dashboard");
    } catch (err) {
      const code = (err as { code?: string })?.code;
      setError(code ? firebaseError(code) : err instanceof Error ? err.message : "Registration failed");
      setLoading(false);
    }
  }

  if (user && profile)
    return (
      <Alert type="info">
        You are already logged in as <b>{profile.name}</b>.{" "}
        <Link href="/dashboard" className="font-semibold underline">
          Go to dashboard
        </Link>
      </Alert>
    );

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2 flex items-center justify-between rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm">
        <span className="font-medium text-navy-700">{pricing[role].label}</span>
        <span className="font-display text-lg font-bold text-brand-700">
          ₹{pricing[role].amount} <span className="text-xs font-medium text-navy-500">{pricing[role].period}</span>
        </span>
      </div>
      <div className="sm:col-span-2">
        <label className="label">Full name *</label>
        <input className="input" required value={f.name} onChange={set("name")} />
      </div>
      {!finishing && (
        <div>
          <label className="label">Email *</label>
          <input className="input" type="email" required value={f.email} onChange={set("email")} autoComplete="email" />
        </div>
      )}
      <div className={finishing ? "sm:col-span-2" : ""}>
        <label className="label">Mobile number *</label>
        <input className="input" required inputMode="tel" value={f.phone} onChange={set("phone")} placeholder="10-digit mobile" />
      </div>
      {!finishing && (
        <div className="sm:col-span-2">
          <label className="label">Password *</label>
          <div className="relative">
            <input className="input pr-12" type={show ? "text" : "password"} required minLength={6} value={f.password} onChange={set("password")} autoComplete="new-password" />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400" aria-label="Show password">
              {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
      )}
      <div className="sm:col-span-2">
        <label className="label">Address</label>
        <input className="input" value={f.address} onChange={set("address")} placeholder="House / street / area" />
      </div>
      <div>
        <label className="label">City</label>
        <input className="input" value={f.city} onChange={set("city")} />
      </div>
      {role === "worker" ? (
        <>
          <div>
            <label className="label">Type of work *</label>
            <select className="input" required value={f.workType} onChange={set("workType")}>
              <option value="">Select</option>
              {workTypes.map((w) => (
                <option key={w}>{w}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Experience</label>
            <select className="input" value={f.experience} onChange={set("experience")}>
              <option value="">Select</option>
              {["Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">About your work</label>
            <textarea className="input min-h-[80px]" value={f.about} onChange={set("about")} placeholder="Skills, tools, areas you can travel to…" />
          </div>
        </>
      ) : (
        <div />
      )}
      {error && <Alert type="error" className="sm:col-span-2">{error}</Alert>}
      <button disabled={loading} className="btn-primary py-4 text-base sm:col-span-2">
        {loading && <Spinner />} {finishing ? "Complete registration" : `Create ${role} account`}
      </button>
      <p className="text-center text-sm text-navy-500 sm:col-span-2">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand-600">
          Log in
        </Link>
        {" · "}
        <Link href={role === "client" ? "/register/worker" : "/register/client"} className="font-semibold text-navy-700">
          Register as {role === "client" ? "worker" : "client"}
        </Link>
      </p>
    </form>
  );
}
