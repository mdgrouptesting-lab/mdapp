"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Phone, LayoutDashboard, ChevronDown } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/components/auth/AuthProvider";
import { services } from "@/lib/services";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services", mega: true },
  { href: "/membership", label: "Join Us" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, profile } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || open;
  const dashHref = profile?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", solid ? "bg-white/90 shadow-card backdrop-blur-xl" : "bg-transparent")}>
      <div className="container flex h-20 items-center justify-between gap-4">
        <Logo light={!solid} />

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            const base = cn(
              "flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-semibold transition",
              solid ? "text-navy-700 hover:bg-navy-50 hover:text-navy-900" : "text-white/85 hover:bg-white/10 hover:text-white",
              active && (solid ? "text-brand-600" : "text-brand-300"),
            );
            if (!l.mega)
              return (
                <Link key={l.href} href={l.href} className={base}>
                  {l.label}
                </Link>
              );
            return (
              <div key={l.href} className="group relative">
                <Link href={l.href} className={base}>
                  {l.label} <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-1/2 top-full w-[520px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="grid grid-cols-2 gap-1 rounded-2xl border border-navy-100 bg-white p-3 shadow-card">
                    {services.map((s) => (
                      <Link key={s.slug} href={`/services/${s.slug}`} className="rounded-xl p-3 transition hover:bg-navy-50">
                        <p className="text-sm font-semibold text-navy-900">{s.title}</p>
                        <p className="mt-0.5 line-clamp-1 text-xs text-navy-500">{s.short}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a href={siteConfig.phoneHref} className={cn("flex items-center gap-2 px-2 text-sm font-semibold", solid ? "text-navy-700" : "text-white")}>
            <Phone className="h-4 w-4 text-brand-500" /> {siteConfig.phone}
          </a>
          {user ? (
            <Link href={dashHref} className="btn-primary btn-sm px-4 py-2.5">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className={cn("btn-sm btn px-4 py-2.5", solid ? "text-navy-800 hover:bg-navy-50" : "text-white hover:bg-white/10")}>
                Login
              </Link>
              <Link href="/contact#enquiry" className="btn-primary btn-sm px-4 py-2.5">
                Get a Quote
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen((o) => !o)} className={cn("rounded-lg p-2 lg:hidden", solid ? "text-navy-900" : "text-white")} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-navy-100 bg-white lg:hidden">
          <div className="container flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-lg px-3 py-3 font-semibold text-navy-800 hover:bg-navy-50">
                {l.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              {user ? (
                <Link href={dashHref} className="btn-primary col-span-2">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="btn-outline">
                    Login
                  </Link>
                  <Link href="/membership" className="btn-primary">
                    Register
                  </Link>
                </>
              )}
              <a href={siteConfig.phoneHref} className="btn-dark col-span-2">
                <Phone className="h-4 w-4" /> Call {siteConfig.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
