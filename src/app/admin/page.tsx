"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getCountFromServer, getDocs, limit, orderBy, query, where, type Query } from "firebase/firestore";
import { ArrowRight, ClipboardList, HardHat, IndianRupee, Inbox, ShieldAlert, Users } from "lucide-react";
import { PageTitle } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { fbDb } from "@/lib/firebase";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Enquiry, ServiceRequest } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type Stats = { enquiries: number; requests: number; clients: number; workers: number; pendingVerify: number; revenue: number };

export default function AdminHome() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    const db = fbDb();
    const count = (q: Query) => getCountFromServer(q).then((s) => s.data().count);
    Promise.all([
      count(query(collection(db, "enquiries"), where("status", "==", "new"))),
      count(query(collection(db, "serviceRequests"), where("status", "==", "new"))),
      count(query(collection(db, "users"), where("role", "==", "client"))),
      count(query(collection(db, "users"), where("role", "==", "worker"))),
      count(query(collection(db, "users"), where("verification.status", "==", "pending"))),
      getDocs(collection(db, "payments")).then((s) => s.docs.reduce((sum, d) => sum + (Number(d.data().amount) || 0), 0)),
    ])
      .then(([enquiries, requests, clients, workers, pendingVerify, revenue]) => setStats({ enquiries, requests, clients, workers, pendingVerify, revenue }))
      .catch((e) => setErr(e.message));
    getDocs(query(collection(db, "enquiries"), orderBy("createdAt", "desc"), limit(5)))
      .then((s) => setEnquiries(s.docs.map((d) => ({ id: d.id, ...d.data() }) as Enquiry)))
      .catch(() => {});
    getDocs(query(collection(db, "serviceRequests"), orderBy("createdAt", "desc"), limit(5)))
      .then((s) => setRequests(s.docs.map((d) => ({ id: d.id, ...d.data() }) as ServiceRequest)))
      .catch(() => {});
  }, []);

  const cards = [
    { label: "New enquiries", value: stats?.enquiries, Icon: Inbox, href: "/admin/enquiries", tone: "from-sky-400 to-blue-600" },
    { label: "New service requests", value: stats?.requests, Icon: ClipboardList, href: "/admin/requests", tone: "from-brand-400 to-brand-600" },
    { label: "Pending verifications", value: stats?.pendingVerify, Icon: ShieldAlert, href: "/admin/workers", tone: "from-amber-400 to-orange-600" },
    { label: "Clients", value: stats?.clients, Icon: Users, href: "/admin/clients", tone: "from-emerald-400 to-teal-600" },
    { label: "Workers", value: stats?.workers, Icon: HardHat, href: "/admin/workers", tone: "from-violet-400 to-purple-600" },
    { label: "Membership revenue", value: stats ? `₹${stats.revenue.toLocaleString("en-IN")}` : undefined, Icon: IndianRupee, href: "/admin/payments", tone: "from-rose-400 to-pink-600" },
  ];

  return (
    <div>
      <PageTitle title={`Hello, ${profile?.name?.split(" ")[0] || "Admin"}`} subtitle="Here is what is happening at MD Group today." />
      {err && <p className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{err}</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ label, value, Icon, href, tone }) => (
          <Link key={label} href={href} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-card transition hover:-translate-y-0.5">
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${tone} opacity-15 transition group-hover:scale-125`} />
            <span className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${tone} text-white`}>
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-display text-3xl font-extrabold">{value ?? "…"}</p>
            <p className="text-sm text-navy-500">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <RecentList title="Latest enquiries" href="/admin/enquiries" items={enquiries.map((e) => ({ id: e.id, title: `${e.name} · ${e.service}`, sub: `${e.phone} · ${e.address}`, status: e.status, date: formatDate(e.createdAt, true) }))} />
        <RecentList title="Latest service requests" href="/admin/requests" items={requests.map((r) => ({ id: r.id, title: `${r.problem}`, sub: `${r.clientName} · ${r.clientPhone}`, status: r.status, date: formatDate(r.createdAt, true) }))} />
      </div>
    </div>
  );
}

function RecentList({ title, href, items }: { title: string; href: string; items: { id: string; title: string; sub: string; status: string; date: string }[] }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">{title}</h2>
        <Link href={href} className="flex items-center gap-1 text-sm font-semibold text-brand-600">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-navy-400">Nothing yet</p>
      ) : (
        <ul className="mt-4 divide-y divide-navy-100">
          {items.map((i) => (
            <li key={i.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{i.title}</p>
                <p className="truncate text-xs text-navy-500">{i.sub}</p>
              </div>
              <div className="shrink-0 text-right">
                <Badge value={i.status} />
                <p className="mt-1 text-[11px] text-navy-400">{i.date}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
