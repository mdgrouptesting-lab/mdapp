"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { fbAuth, firebaseConfigured } from "@/lib/firebase";
import { useAuth } from "./AuthProvider";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, profile, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    const next = params.get("next");
    if (next && next.startsWith("/")) router.replace(next);
    else router.replace(profile?.role === "admin" ? "/admin" : "/dashboard");
  }, [authLoading, user, profile, params, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!firebaseConfigured) return setMsg({ type: "error", text: "Firebase is not configured yet (.env.local)." });
    setLoading(true);
    setMsg(null);
    try {
      await signInWithEmailAndPassword(fbAuth(), email.trim(), password);
    } catch {
      setMsg({ type: "error", text: "Incorrect email or password." });
      setLoading(false);
    }
  }

  async function reset() {
    if (!email) return setMsg({ type: "error", text: "Enter your email above first." });
    try {
      await sendPasswordResetEmail(fbAuth(), email.trim());
      setMsg({ type: "success", text: "Password reset link sent to your email." });
    } catch {
      setMsg({ type: "error", text: "Could not send reset email. Check the address." });
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="label">Email</label>
        <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label className="label">Password</label>
          <button type="button" onClick={reset} className="mb-1.5 text-xs font-semibold text-brand-600">
            Forgot password?
          </button>
        </div>
        <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
      </div>
      {msg && <Alert type={msg.type}>{msg.text}</Alert>}
      <button disabled={loading} className="btn-primary w-full py-4 text-base">
        {loading && <Spinner />} Log in
      </button>
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Link href="/register/client" className="btn-outline">
          New client
        </Link>
        <Link href="/register/worker" className="btn-outline">
          New worker
        </Link>
      </div>
    </form>
  );
}
