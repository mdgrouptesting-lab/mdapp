"use client";

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { BadgeCheck, Briefcase, Camera, Clock, MapPin, ShieldAlert, ShieldCheck, Upload } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { MembershipCard } from "@/components/dashboard/MembershipCard";
import { ImagePicker } from "@/components/dashboard/ImagePicker";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { fbDb, uploadImage } from "@/lib/firebase";
import type { ServiceRequest, UserProfile } from "@/lib/types";
import { formatDate, isSubscriptionActive, toDate } from "@/lib/utils";

export default function WorkerDashboard() {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<ServiceRequest[] | null>(null);

  useEffect(() => {
    if (!profile) return;
    const q = query(collection(fbDb(), "serviceRequests"), where("assignedWorkerId", "==", profile.uid));
    return onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ServiceRequest);
        list.sort((a, b) => (toDate(b.updatedAt)?.getTime() || 0) - (toDate(a.updatedAt)?.getTime() || 0));
        setJobs(list);
      },
      () => setJobs([]),
    );
  }, [profile]);

  if (!profile) return null;
  const verified = profile.verification?.status === "verified";
  const active = isSubscriptionActive(profile.subscription);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-navy-500">Namaste,</p>
          <h1 className="flex items-center gap-2 text-3xl font-extrabold">
            {profile.name} {verified && <BadgeCheck className="h-7 w-7 text-emerald-500" />}
          </h1>
          <p className="text-sm text-navy-500">
            {profile.workType} {profile.experience && `· ${profile.experience}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge value={active ? "active" : "inactive"} />
          <Badge value={profile.verification?.status || "not_submitted"} />
        </div>
      </div>

      <MembershipCard profile={profile} />
      <VerificationCard profile={profile} />

      <section className="card p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Briefcase className="h-5 w-5 text-brand-500" /> My jobs
        </h2>
        {!active || !verified ? (
          <Alert type="info" className="mt-4">
            Jobs are assigned only to workers with an <b>active membership</b> and <b>company verification</b>.
          </Alert>
        ) : null}
        {jobs === null ? (
          <p className="py-10 text-center text-navy-400">Loading…</p>
        ) : jobs.length === 0 ? (
          <p className="py-10 text-center text-navy-500">No jobs assigned yet. MD Group will assign work to you here.</p>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {jobs.map((j) => (
              <JobCard key={j.id} job={j} uid={profile.uid} />
            ))}
          </div>
        )}
      </section>
      <p className="text-center text-xs text-navy-400">Customers pay MD Group directly. Do not collect money from customers — your payment comes from the company.</p>
    </div>
  );
}

function VerificationCard({ profile }: { profile: UserProfile }) {
  const v = profile.verification || { status: "not_submitted" };
  const [idFile, setIdFile] = useState<File[]>([]);
  const [work, setWork] = useState<File[]>([]);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  if (v.status === "verified")
    return (
      <div className="flex items-center gap-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
        <ShieldCheck className="h-10 w-10 text-emerald-600" />
        <div>
          <p className="font-bold text-emerald-900">Verified by MD Group</p>
          <p className="text-sm text-emerald-700">Your profile is approved. You can receive jobs.</p>
        </div>
      </div>
    );
  if (v.status === "pending")
    return (
      <div className="flex items-center gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-6">
        <Clock className="h-10 w-10 text-amber-600" />
        <div>
          <p className="font-bold text-amber-900">Verification pending</p>
          <p className="text-sm text-amber-800">MD Group is reviewing your ID and work photos.</p>
        </div>
      </div>
    );

  async function submit() {
    setError("");
    if (!idFile.length) return setError("Please upload a photo of your ID proof (Aadhaar / Voter ID / DL)");
    if (!work.length) return setError("Please upload at least one photo of your work");
    try {
      setBusy("Uploading ID proof…");
      const idProofUrl = await uploadImage(idFile[0], `workers/${profile.uid}`);
      const workPhotos: string[] = [];
      for (let i = 0; i < work.length; i++) {
        setBusy(`Uploading work photo ${i + 1}/${work.length}…`);
        workPhotos.push(await uploadImage(work[i], `workers/${profile.uid}`));
      }
      setBusy("Submitting…");
      await updateDoc(doc(fbDb(), "users", profile.uid), {
        verification: { status: "pending", idProofUrl, workPhotos, note: "" },
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy("");
    }
  }

  return (
    <section className="card p-6 md:p-8">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <ShieldAlert className="h-6 w-6" />
        </span>
        <div>
          <h2 className="text-xl font-bold">Get verified by MD Group</h2>
          <p className="text-sm text-navy-500">Upload your ID proof and photos of your past work. The company will verify and approve your profile.</p>
          {v.status === "rejected" && (
            <Alert type="error" className="mt-3">
              Verification rejected{v.note ? `: ${v.note}` : ""}. Please upload again.
            </Alert>
          )}
        </div>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <p className="label">ID proof *</p>
          <ImagePicker files={idFile} onChange={setIdFile} max={1} label="ID photo" />
        </div>
        <div>
          <p className="label">Work photos *</p>
          <ImagePicker files={work} onChange={setWork} max={4} label="Work photo" />
        </div>
      </div>
      {error && <Alert type="error" className="mt-4">{error}</Alert>}
      <button onClick={submit} disabled={!!busy} className="btn-dark mt-6">
        {busy ? <Spinner /> : <Upload className="h-4 w-4" />} {busy || "Submit for verification"}
      </button>
    </section>
  );
}

function JobCard({ job, uid }: { job: ServiceRequest; uid: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [note, setNote] = useState(job.workerNote || "");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  async function start() {
    setBusy("Updating…");
    try {
      await updateDoc(doc(fbDb(), "serviceRequests", job.id), { status: "in_progress", updatedAt: serverTimestamp() });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    }
    setBusy("");
  }

  async function submitWork() {
    setError("");
    if (!files.length) return setError("Upload at least one photo of the completed work");
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        setBusy(`Uploading ${i + 1}/${files.length}…`);
        urls.push(await uploadImage(files[i], `jobs/${job.id}/${uid}`));
      }
      setBusy("Submitting…");
      await updateDoc(doc(fbDb(), "serviceRequests", job.id), {
        workerImages: [...(job.workerImages || []), ...urls],
        workerNote: note.slice(0, 1000),
        status: "work_submitted",
        updatedAt: serverTimestamp(),
      });
      setFiles([]);
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy("");
    }
  }

  const canWork = job.status === "assigned" || job.status === "in_progress";

  return (
    <div className="rounded-2xl border border-navy-100 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold">{job.problem}</p>
          <p className="mt-1 flex items-start gap-1.5 text-sm text-navy-500">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {job.address}
          </p>
        </div>
        <Badge value={job.status} />
      </div>
      {job.description && <p className="mt-3 text-sm text-navy-600">{job.description}</p>}
      {job.adminNote && <p className="mt-2 rounded-lg bg-navy-50 p-2 text-xs text-navy-600">Company note: {job.adminNote}</p>}
      {!!job.images?.length && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {job.images.map((u) => (
            <a key={u} href={u} target="_blank" rel="noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" className="h-16 w-16 rounded-lg object-cover" />
            </a>
          ))}
        </div>
      )}
      <p className="mt-3 text-xs text-navy-400">Assigned · {formatDate(job.updatedAt, true)}</p>
      {error && <Alert type="error" className="mt-3">{error}</Alert>}
      {canWork && (
        <div className="mt-4 flex flex-wrap gap-2">
          {job.status === "assigned" && (
            <button onClick={start} disabled={!!busy} className="btn-outline btn-sm">
              Start work
            </button>
          )}
          <button onClick={() => setOpen((o) => !o)} className="btn-primary btn-sm">
            <Camera className="h-4 w-4" /> Upload completed work
          </button>
        </div>
      )}
      {open && canWork && (
        <div className="mt-4 space-y-3 rounded-xl bg-navy-50 p-4">
          <ImagePicker files={files} onChange={setFiles} max={6} label="Photo" />
          <textarea className="input" placeholder="Note for the company (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
          <button onClick={submitWork} disabled={!!busy} className="btn-dark btn-sm">
            {busy ? <Spinner className="h-4 w-4" /> : <Upload className="h-4 w-4" />} {busy || "Submit for company verification"}
          </button>
        </div>
      )}
    </div>
  );
}
