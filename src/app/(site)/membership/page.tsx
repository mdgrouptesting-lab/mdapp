import type { Metadata } from "next";
import Link from "next/link";
import { Check, HardHat, UserRound } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { pricing } from "@/lib/config";

export const metadata: Metadata = { title: "Membership — Client & Worker Registration" };

export default function MembershipPage() {
  const plans = [
    {
      key: "client",
      Icon: UserRound,
      title: "Client",
      price: pricing.client.amount,
      period: pricing.client.period,
      href: "/register/client",
      cta: "Register as Client",
      features: [
        "Lifetime access — pay once",
        "Report problems with photos",
        "Choose problem type in a simple form",
        "Company calls you back quickly",
        "Verified workers sent by MD Group",
        "Pay the company only — never the worker",
        "Track all your requests",
      ],
      highlight: false,
    },
    {
      key: "worker",
      Icon: HardHat,
      title: "Worker",
      price: pricing.worker.amount,
      period: pricing.worker.period,
      href: "/register/worker",
      cta: "Register as Worker",
      features: [
        "Profile with your trade (carpenter, mason, plumber…)",
        "Company verification badge",
        "Get jobs assigned by MD Group",
        "Upload completion photos for verification",
        "Payments handled through the company",
        "Renew yearly — simple online payment",
      ],
      highlight: true,
    },
  ];
  return (
    <>
      <PageHeader eyebrow="Join MD Group" title="Simple, affordable membership" subtitle="Clients pay once for lifetime access. Workers renew once a year." />
      <section className="section">
        <div className="container grid max-w-5xl gap-8 md:grid-cols-2">
          {plans.map(({ key, Icon, title, price, period, href, cta, features, highlight }) => (
            <div key={key} className={`relative flex flex-col rounded-[2rem] p-8 md:p-10 ${highlight ? "bg-navy-950 text-white shadow-2xl" : "card"}`}>
              {highlight && <span className="absolute -top-3 right-8 rounded-full bg-gradient-to-r from-brand-400 to-brand-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">Get work</span>}
              <span className={`grid h-14 w-14 place-items-center rounded-2xl ${highlight ? "bg-white/10 text-brand-300" : "bg-brand-50 text-brand-600"}`}>
                <Icon className="h-7 w-7" />
              </span>
              <h2 className="mt-6 text-2xl font-bold">{title} membership</h2>
              <p className="mt-4 flex items-end gap-2">
                <span className="font-display text-6xl font-extrabold">₹{price}</span>
                <span className={highlight ? "pb-2 text-navy-300" : "pb-2 text-navy-500"}>{period}</span>
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check className={`mt-0.5 h-5 w-5 shrink-0 ${highlight ? "text-brand-400" : "text-emerald-500"}`} />
                    <span className={highlight ? "text-navy-100" : "text-navy-700"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={href} className={`${highlight ? "btn-primary" : "btn-dark"} mt-10 py-4 text-base`}>
                {cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="container mt-10 max-w-3xl text-center text-sm text-navy-500">
          Already registered? <Link href="/login" className="font-semibold text-brand-600">Log in</Link> to pay or renew from your dashboard. Payments are processed securely by Razorpay (UPI, cards, net banking).
        </p>
      </section>
    </>
  );
}
