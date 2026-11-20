import Link from "next/link";
import { ArrowRight, BadgeCheck, HardHat, Phone, ShieldCheck, Star, TrendingUp, Users } from "lucide-react";
import { HeroIllustration } from "./HeroIllustration";
import { RotatingWord } from "./RotatingWord";
import { siteConfig } from "@/lib/config";
import { services } from "@/lib/services";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      {/* background layers */}
      <div className="blueprint-grid absolute inset-0 -z-10 opacity-70" />
      <div className="absolute -left-40 top-20 -z-10 h-[520px] w-[520px] rounded-full bg-navy-500/30 blur-[120px]" />
      <div className="absolute -right-20 -top-20 -z-10 h-[460px] w-[460px] rounded-full bg-brand-500/25 blur-[120px]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-navy-950 to-transparent" />

      <div className="container grid items-center gap-12 pb-16 pt-32 lg:min-h-[100svh] lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-28">
        {/* copy */}
        <div>
          <div className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/15 bg-white/5 py-1.5 pl-1.5 pr-4 text-xs font-semibold text-navy-100 backdrop-blur">
            <span className="rounded-full bg-gradient-to-r from-brand-400 to-brand-600 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white">MD Group</span>
            Construction · Planning · Testing · Interiors
          </div>

          <h1 className="mt-6 animate-fade-up text-[2.6rem] font-extrabold leading-[1.05] [animation-delay:100ms] sm:text-6xl xl:text-7xl">
            We Build Strong <br className="hidden sm:block" />
            <RotatingWord words={["Homes", "Foundations", "Offices", "Interiors", "Futures"]} />
          </h1>

          <p className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-navy-200 [animation-delay:200ms]">
            From soil testing and land survey to planning, G+1 construction and beautiful interiors — one trusted team, verified skilled workers, and quality you can measure.
          </p>

          <div className="mt-9 flex animate-fade-up flex-wrap items-center gap-3 [animation-delay:300ms]">
            <Link href="/contact#enquiry" className="btn-primary px-7 py-4 text-base">
              Get a Free Quote <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/register/worker" className="btn-ghost-light px-7 py-4 text-base">
              <HardHat className="h-5 w-5" /> Join as Worker
            </Link>
          </div>

          <a href={siteConfig.phoneHref} className="group mt-8 inline-flex animate-fade-up items-center gap-4 [animation-delay:400ms]">
            <span className="relative grid h-12 w-12 place-items-center rounded-full bg-brand-500">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-400" />
              <Phone className="relative h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs uppercase tracking-wider text-navy-300">Call us for site visit</span>
              <span className="block font-display text-xl font-bold group-hover:text-brand-300">{siteConfig.phone}</span>
            </span>
          </a>

          <div className="mt-10 flex animate-fade-up flex-wrap gap-x-6 gap-y-3 text-sm text-navy-200 [animation-delay:500ms]">
            {["Verified skilled workers", "Lab-tested materials", "On-time delivery"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-brand-400" /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* visual */}
        <div className="relative mx-auto aspect-[52/50] w-full max-w-[600px] animate-fade-up [animation-delay:200ms]">
          <HeroIllustration />

          <div className="glass absolute left-0 top-[12%] hidden animate-float rounded-2xl p-4 shadow-2xl sm:block">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-navy-200">Soil test report</p>
                <p className="font-bold">SBC Passed ✓</p>
              </div>
            </div>
          </div>

          <div className="glass absolute -right-2 top-[44%] hidden w-52 animate-float-slow rounded-2xl p-4 shadow-2xl sm:block">
            <div className="flex items-center justify-between text-xs text-navy-200">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-brand-300" /> Project progress
              </span>
              <span className="font-bold text-white">78%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[78%] rounded-full bg-[linear-gradient(90deg,#ffbb4a,#f98207,#ffbb4a)] bg-[length:200%_100%] animate-shimmer" />
            </div>
            <p className="mt-2 text-[11px] text-navy-300">G+1 Residence · Slab 2 done</p>
          </div>

          <div className="glass absolute bottom-[4%] left-[8%] hidden animate-float rounded-2xl px-4 py-3 shadow-2xl [animation-delay:1.5s] sm:block">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/20 text-brand-300">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-navy-200">Workers on site today</p>
                <p className="flex items-center gap-1 font-bold">
                  24 <Star className="h-3.5 w-3.5 fill-brand-400 text-brand-400" /> verified
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* service marquee */}
      <div className="relative border-y border-white/10 bg-white/[.03] py-5 backdrop-blur">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
          {[...services, ...services].map((s, i) => (
            <span key={i} className="flex items-center gap-12 font-display text-lg font-semibold text-navy-200">
              {s.title}
              <span className="text-brand-400">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
