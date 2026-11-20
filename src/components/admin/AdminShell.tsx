"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ClipboardList, CreditCard, FileText, Globe, HardHat, Inbox, LayoutDashboard, LogOut, Menu, ShieldCheck, Tags, Users, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/enquiries", label: "Enquiries", Icon: Inbox },
  { href: "/admin/requests", label: "Service Requests", Icon: ClipboardList },
  { href: "/admin/clients", label: "Clients", Icon: Users },
  { href: "/admin/workers", label: "Workers", Icon: HardHat },
  { href: "/admin/payments", label: "Payments", Icon: CreditCard },
  { href: "/admin/blog", label: "Blog Posts", Icon: FileText },
  { href: "/admin/work-types", label: "Work Types", Icon: Tags },
  { href: "/admin/team", label: "Admins & Roles", Icon: ShieldCheck },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center px-6">
        <Logo light />
      </div>
      <p className="px-6 pb-2 text-[10px] font-bold uppercase tracking-[.2em] text-navy-400">Admin panel</p>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {nav.map(({ href, label, Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition", active ? "bg-gradient-to-r from-brand-400 to-brand-600 text-white shadow-glow" : "text-navy-200 hover:bg-white/5 hover:text-white")}>
              <Icon className="h-5 w-5" /> {label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-navy-200 hover:bg-white/5">
          <Globe className="h-5 w-5" /> View website
        </Link>
        <button
          onClick={async () => {
            await logout();
            router.replace("/login");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-navy-200 hover:bg-rose-500/20 hover:text-rose-200"
        >
          <LogOut className="h-5 w-5" /> Log out
        </button>
        {profile && <p className="truncate px-3 pt-2 text-xs text-navy-400">{profile.email}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-navy-50/70">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-navy-950 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-navy-950/60" />
          <aside className="absolute inset-y-0 left-0 w-72 bg-navy-950" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="absolute right-3 top-6 text-white" aria-label="Close menu">
              <X className="h-6 w-6" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-navy-100 bg-white/90 px-4 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-display font-bold">MD Group Admin</span>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-navy-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Empty({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-navy-200 bg-white p-12 text-center text-navy-500">{text}</div>;
}
