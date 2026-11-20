import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, Award, CalendarCheck, CheckCircle2, ClipboardList, Clock, FileSearch, HardHat, Hammer,
  IndianRupee, Mail, MapPin, Phone, ShieldCheck, Smartphone, Sparkles, Upload, Wrench,
} from "lucide-react";
import { Counter } from "./Counter";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { ServiceIcon } from "./ServiceIcon";
import { EnquiryForm } from "./EnquiryForm";
import { services } from "@/lib/services";
import { pricing, siteConfig } from "@/lib/config";
import { defaultWorkTypes } from "@/lib/workTypes";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function StatsBand() {
  return (
    <section className="relative z-10 -mt-px bg-navy-950 pb-16">
      <div className="container">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:grid-cols-4">
          {siteConfig.stats.map((s) => (
            <div key={s.label} className="bg-navy-950/90 p-6 text-center md:p-8">
              <p className="font-display text-4xl font-extrabold text-white md:text-5xl">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm text-navy-300">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicesGrid() {
  return (
    <section className="section bg-white" id="services">
      <div className="container">
        <SectionHeading eyebrow="What we do" title={<>Every stage of your project, <span className="text-brand-500">under one roof</span></>} subtitle="From testing the ground to the last coat of paint — engineers, labs and skilled workers working as one team." />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 100}>
              <Link href={`/services/${s.slug}`} className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-navy-100 bg-white p-7 transition duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-card">
                <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${s.accent} opacity-10 blur-2xl transition duration-500 group-hover:scale-150 group-hover:opacity-30`} />
                <span className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${s.accent} text-white shadow-lg`}>
                  <ServiceIcon name={s.icon} className="h-7 w-7" />
                </span>
                <h3 className="mt-6 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 flex-1 text-navy-500">{s.short}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                  Learn more <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
          <Reveal delay={100}>
            <Link href="/contact#enquiry" className="group flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-brand-400 to-brand-600 p-7 text-white shadow-glow transition hover:-translate-y-1.5">
              <Sparkles className="h-10 w-10" />
              <div>
                <h3 className="mt-6 text-2xl font-bold">Not sure what you need?</h3>
                <p className="mt-2 text-white/85">Tell us about your plot or problem — our engineer will guide you for free.</p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold">
                  Talk to an expert <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function AboutPreview() {
  const points = ["Qualified civil engineers & site supervisors", "In-house soil & material testing", "Transparent estimate and milestone billing", "Background-verified skilled workforce"];
  return (
    <section className="section overflow-hidden bg-navy-50/60">
      <div className="container grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex aspect-[4/5] flex-col justify-end rounded-3xl bg-gradient-to-br from-navy-700 to-navy-950 p-6 text-white shadow-card">
                  <Hammer className="h-10 w-10 text-brand-400" />
                  <p className="mt-4 font-display text-2xl font-bold">Built to last</p>
                  <p className="mt-1 text-sm text-navy-200">Strong RCC structures with tested materials.</p>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-card">
                  <p className="font-display text-4xl font-extrabold text-brand-500">
                    <Counter value={siteConfig.stats[1].value} suffix="+" />
                  </p>
                  <p className="text-sm font-medium text-navy-500">Years building trust</p>
                </div>
              </div>
              <div className="mt-10 space-y-4">
                <div className="rounded-3xl bg-gradient-to-br from-brand-400 to-brand-600 p-6 text-white shadow-glow">
                  <Award className="h-9 w-9" />
                  <p className="mt-3 font-display text-xl font-bold">Quality first</p>
                  <p className="text-sm text-white/85">Every stage inspected.</p>
                </div>
                <div className="blueprint-grid flex aspect-[4/5] flex-col justify-end rounded-3xl bg-navy-900 p-6 text-white shadow-card">
                  <ClipboardList className="h-10 w-10 text-brand-300" />
                  <p className="mt-4 font-display text-2xl font-bold">Planned precisely</p>
                  <p className="mt-1 text-sm text-navy-200">Survey-accurate drawings & BOQ.</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <SectionHeading center={false} eyebrow="About MD Group" title={<>A complete construction partner you can <span className="text-brand-500">rely on</span></>} />
          <p className="mt-5 text-lg leading-relaxed text-navy-600">
            MD Group brings engineering, testing and craftsmanship together. Whether you are planning a new G+1 home, a commercial building, an interior makeover or simply need a reliable carpenter or plumber, we handle it with the same care — from the first soil sample to the final handover.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-sm font-medium">{p}</span>
              </li>
            ))}
          </ul>
          <Link href="/about" className="btn-dark mt-8">
            More about us <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function ProcessSection() {
  const steps = [
    { Icon: Phone, title: "Enquire or report", text: "Send an enquiry or upload photos of your problem from the app." },
    { Icon: FileSearch, title: "Site visit & testing", text: "Our engineer visits, surveys and tests soil or materials if needed." },
    { Icon: ClipboardList, title: "Plan & estimate", text: "You get drawings, a clear estimate and timeline before work starts." },
    { Icon: HardHat, title: "Build & handover", text: "Verified workers execute; company verifies every stage and hands over." },
  ];
  return (
    <section className="section relative overflow-hidden bg-navy-950 text-white">
      <div className="blueprint-grid absolute inset-0 opacity-40" />
      <div className="container relative">
        <SectionHeading light eyebrow="How it works" title="Simple process. Zero headaches." subtitle="A clear path from your first call to the keys in your hand." />
        <div className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-brand-400/60 to-transparent lg:block" />
          {steps.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 120}>
              <div className="relative rounded-3xl border border-white/10 bg-white/[.04] p-7 backdrop-blur transition hover:border-brand-400/50 hover:bg-white/[.07]">
                <div className="flex items-center justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-glow">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-5xl font-extrabold text-white/10">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-300">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AppSection() {
  return (
    <section className="section bg-white">
      <div className="container">
        <SectionHeading eyebrow="MD Group App" title={<>One app for <span className="text-brand-500">clients</span> and <span className="text-brand-500">workers</span></>} subtitle="Install MD Group on your phone from the browser — report problems, track your requests and get work, all in one place." />
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-[2rem] border border-navy-100 bg-gradient-to-br from-sky-50 to-white p-8 md:p-10">
              <span className="eyebrow border-sky-200 bg-sky-100 text-sky-700">For clients</span>
              <h3 className="mt-4 text-3xl font-bold">Got a problem at home or site?</h3>
              <ul className="mt-6 space-y-4">
                {[
                  { Icon: Upload, t: "Upload photos and choose your problem" },
                  { Icon: Phone, t: "Company receives it instantly and calls you" },
                  { Icon: ShieldCheck, t: "Verified worker is sent — you pay the company, never the worker" },
                  { Icon: CalendarCheck, t: "Track status until the job is complete" },
                ].map(({ Icon, t }) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-sky-600 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-medium text-navy-700">{t}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/register/client" className="btn-dark">
                  Register as Client <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="flex items-center text-sm text-navy-500">
                  <IndianRupee className="h-4 w-4" />
                  <b className="text-navy-900">{pricing.client.amount}</b>&nbsp;one-time · lifetime
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="relative h-full overflow-hidden rounded-[2rem] bg-navy-950 p-8 text-white md:p-10">
              <div className="blueprint-grid absolute inset-0 opacity-50" />
              <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/30 blur-3xl" />
              <div className="relative">
                <span className="eyebrow border-white/20 bg-white/10 text-brand-200">For workers</span>
                <h3 className="mt-4 text-3xl font-bold">Skilled? Get regular work with MD Group.</h3>
                <div className="mt-6 flex flex-wrap gap-2">
                  {defaultWorkTypes.slice(0, 10).map((w) => (
                    <span key={w} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-navy-100">
                      {w}
                    </span>
                  ))}
                  <span className="rounded-full border border-brand-400/40 bg-brand-500/15 px-3 py-1.5 text-sm text-brand-200">+ more</span>
                </div>
                <ul className="mt-6 space-y-3 text-navy-200">
                  {["Register & upload ID + work photos", "Company verifies your profile", "Get assigned jobs, upload completion photos", "Payment handled by the company"].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-brand-400" /> {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href="/register/worker" className="btn-primary">
                    Register as Worker <ArrowRight className="h-4 w-4" />
                  </Link>
                  <p className="flex items-center text-sm text-navy-300">
                    <IndianRupee className="h-4 w-4" />
                    <b className="text-white">{pricing.worker.amount}</b>&nbsp;/ year · renewable
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal>
          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-3xl border border-dashed border-navy-200 p-6 text-center md:flex-row md:text-left">
            <div className="flex items-center gap-4">
              <Smartphone className="h-10 w-10 text-brand-500" />
              <div>
                <p className="font-bold">Install the MD Group app</p>
                <p className="text-sm text-navy-500">On your phone open this website → browser menu → “Add to Home screen” / “Install app”.</p>
              </div>
            </div>
            <Link href="/membership" className="btn-outline shrink-0">
              Compare plans
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function WhyUs() {
  const items = [
    { Icon: ShieldCheck, t: "Verified workforce", d: "Every worker is ID-checked and approved by the company." },
    { Icon: FileSearch, t: "Tested quality", d: "Soil and material tests backed by clear reports." },
    { Icon: IndianRupee, t: "Transparent pricing", d: "Detailed estimates. No hidden charges." },
    { Icon: Clock, t: "On-time delivery", d: "Planned schedules and daily supervision." },
  ];
  return (
    <section className="section bg-navy-50/60">
      <div className="container grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <SectionHeading center={false} eyebrow="Why MD Group" title={<>Trust is the strongest <span className="text-brand-500">material</span> we use</>} subtitle="We are accountable for every job — the worker reports to us, and we report to you." />
          <Link href="/contact#enquiry" className="btn-primary mt-8">
            Book a site visit <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {items.map(({ Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 100}>
              <div className="h-full rounded-3xl bg-white p-7 shadow-card transition hover:-translate-y-1">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-900 text-brand-400">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{t}</h3>
                <p className="mt-1.5 text-sm text-navy-500">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LatestPosts({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  return (
    <section className="section bg-white">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading center={false} eyebrow="Blog" title="Tips, updates & project stories" />
          <Link href="/blog" className="btn-outline">
            View all posts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col overflow-hidden rounded-3xl border border-navy-100 bg-white transition hover:-translate-y-1 hover:shadow-card">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-navy-700 to-navy-950">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="blueprint-grid grid h-full place-items-center">
            <HardHat className="h-12 w-12 text-brand-400" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{formatDate(post.createdAt)}</p>
        <h3 className="mt-2 text-lg font-bold leading-snug group-hover:text-brand-600">{post.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-navy-500">{post.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-900">
          Read more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export function EnquirySection() {
  return (
    <section id="enquiry" className="section relative overflow-hidden bg-white">
      <div className="absolute inset-x-0 top-0 h-1/2 bg-navy-50/60" />
      <div className="container relative">
        <div className="grid overflow-hidden rounded-[2rem] shadow-card lg:grid-cols-[1fr_1.4fr]">
          <div className="relative overflow-hidden bg-navy-950 p-8 text-white md:p-12">
            <div className="blueprint-grid absolute inset-0 opacity-50" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
            <div className="relative">
              <span className="eyebrow border-white/20 bg-white/10 text-brand-200">Enquiry</span>
              <h2 className="mt-4 text-3xl font-bold md:text-4xl">Let&apos;s build something great together</h2>
              <p className="mt-4 text-navy-200">Share your phone number, address and requirement — our team will call you back.</p>
              <ul className="mt-10 space-y-6">
                <li className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10">
                    <Phone className="h-5 w-5 text-brand-400" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-navy-300">Call us</p>
                    <a href={siteConfig.phoneHref} className="text-lg font-semibold hover:text-brand-300">
                      {siteConfig.phone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10">
                    <Mail className="h-5 w-5 text-brand-400" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-navy-300">Email</p>
                    <a href={`mailto:${siteConfig.email}`} className="text-lg font-semibold hover:text-brand-300">
                      {siteConfig.email}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10">
                    <MapPin className="h-5 w-5 text-brand-400" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-navy-300">Office</p>
                    <p className="font-semibold">{siteConfig.address}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-white p-8 md:p-12">
            <h3 className="text-2xl font-bold">Send us your requirement</h3>
            <p className="mb-8 mt-1 text-navy-500">Free consultation · No obligation</p>
            <EnquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}

export function CtaBanner() {
  return (
    <section className="pb-20 md:pb-28">
      <div className="container">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-brand-500 to-brand-700 px-8 py-14 text-white md:px-14">
          <div className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(45deg,#000_0_14px,transparent_14px_28px)]" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-extrabold md:text-4xl">Ready to start your project?</h2>
              <p className="mt-2 text-lg text-white/85">Get a free site visit and estimate from MD Group engineers.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={siteConfig.phoneHref} className="btn bg-white px-6 py-4 text-navy-900 hover:bg-navy-50">
                <Phone className="h-5 w-5" /> Call now
              </a>
              <Link href="/contact#enquiry" className="btn border border-white/40 px-6 py-4 hover:bg-white/10">
                Send enquiry <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
