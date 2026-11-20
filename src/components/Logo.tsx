import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="lg-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1b356b" />
          <stop offset="1" stopColor="#071026" />
        </linearGradient>
        <linearGradient id="lg-roof" x1="10" y1="12" x2="54" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffbb4a" />
          <stop offset="1" stopColor="#f98207" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#lg-bg)" />
      <path d="M11 30.5 32 12.5l21 18" stroke="url(#lg-roof)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="42" y="14" width="5" height="9" rx="1" fill="url(#lg-roof)" />
      <path d="M15 51V35l7.5 9L30 35v16" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M35.5 35h5.5a8 8 0 0 1 0 16h-5.5V35Z" stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)} aria-label="MD Group home">
      <LogoMark className="h-10 w-10 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105" />
      <span className="leading-none">
        <span className={cn("block font-display text-lg font-extrabold tracking-tight", light ? "text-white" : "text-navy-900")}>
          MD <span className="text-brand-500">Group</span>
        </span>
        <span className={cn("block text-[10px] font-semibold uppercase tracking-[.18em]", light ? "text-navy-200" : "text-navy-400")}>
          Construction &amp; Engineering
        </span>
      </span>
    </Link>
  );
}
