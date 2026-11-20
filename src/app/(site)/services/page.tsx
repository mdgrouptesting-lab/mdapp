import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { Reveal } from "@/components/site/Reveal";
import { CtaBanner } from "@/components/site/HomeSections";
import { services } from "@/lib/services";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <>
      <PageHeader eyebrow="Our services" title="Complete construction solutions" subtitle="Construction · Planning · Soil Testing · Survey · Material Testing · G+1 Houses · Interiors" />
      <section className="section">
        <div className="container space-y-8">
          {services.map((s, i) => (
            <Reveal key={s.slug}>
              <div className={`grid items-center gap-8 overflow-hidden rounded-[2rem] border border-navy-100 bg-white p-6 shadow-card md:p-10 lg:grid-cols-2 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div className={`blueprint-grid relative grid aspect-[16/10] place-items-center overflow-hidden rounded-3xl bg-navy-950`}>
                  <div className={`absolute h-48 w-48 rounded-full bg-gradient-to-br ${s.accent} opacity-40 blur-3xl`} />
                  <span className={`relative grid h-28 w-28 place-items-center rounded-[2rem] bg-gradient-to-br ${s.accent} text-white shadow-2xl`}>
                    <ServiceIcon name={s.icon} className="h-14 w-14" />
                  </span>
                  <span className="absolute bottom-4 left-5 font-mono text-xs text-navy-300">MD/{String(i + 1).padStart(2, "0")} — {s.title.toUpperCase()}</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{s.title}</h2>
                  <p className="mt-3 text-navy-600">{s.description}</p>
                  <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm font-medium">
                        <Check className="h-4 w-4 text-emerald-500" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href={`/services/${s.slug}`} className="btn-dark">
                      Details <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href={`/contact?service=${encodeURIComponent(s.title)}#enquiry`} className="btn-outline">
                      Enquire now
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
