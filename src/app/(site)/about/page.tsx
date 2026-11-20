import type { Metadata } from "next";
import { Eye, Target, Gem } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { AboutPreview, CtaBanner, ProcessSection, StatsBand, WhyUs } from "@/components/site/HomeSections";
import { Reveal } from "@/components/site/Reveal";

export const metadata: Metadata = { title: "About Us" };

export default function AboutPage() {
  const cards = [
    { Icon: Target, t: "Our mission", d: "To make quality construction simple, transparent and affordable for every family and business." },
    { Icon: Eye, t: "Our vision", d: "To be the most trusted name for construction, testing and skilled manpower in our region." },
    { Icon: Gem, t: "Our values", d: "Honesty in pricing, accountability for every job, and respect for every worker." },
  ];
  return (
    <>
      <PageHeader eyebrow="About MD Group" title="Engineering trust into every structure" subtitle="A team of engineers, testing experts and skilled craftsmen delivering complete construction solutions." />
      <StatsBand />
      <section className="section">
        <div className="container grid gap-6 md:grid-cols-3">
          {cards.map(({ Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 100}>
              <div className="card h-full p-8">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-glow">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-6 text-2xl font-bold">{t}</h3>
                <p className="mt-2 text-navy-500">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <AboutPreview />
      <ProcessSection />
      <WhyUs />
      <div className="pt-20 md:pt-28" />
      <CtaBanner />
    </>
  );
}
