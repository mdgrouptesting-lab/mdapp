import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { ServiceIcon } from "@/components/site/ServiceIcon";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { getService, services } from "@/lib/services";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  return s ? { title: s.title, description: s.short } : {};
}

export default async function ServiceDetail({ params }: Props) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const others = services.filter((x) => x.slug !== s.slug).slice(0, 4);

  return (
    <>
      <PageHeader eyebrow="Service" title={s.title} subtitle={s.short} />
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${s.accent} text-white shadow-lg`}>
              <ServiceIcon name={s.icon} className="h-8 w-8" />
            </span>
            <p className="mt-6 text-lg leading-relaxed text-navy-600">{s.description}</p>
            <h2 className="mt-10 text-2xl font-bold">What&apos;s included</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {s.features.map((f) => (
                <li key={f} className="flex items-center gap-3 rounded-2xl border border-navy-100 p-4">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="font-medium">{f}</span>
                </li>
              ))}
            </ul>
            <h2 className="mt-12 text-2xl font-bold">Other services</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {others.map((o) => (
                <Link key={o.slug} href={`/services/${o.slug}`} className="group flex items-center justify-between rounded-2xl bg-navy-50 p-4 font-semibold transition hover:bg-navy-900 hover:text-white">
                  {o.title} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card p-6 md:p-8">
              <h3 className="text-xl font-bold">Enquire about {s.title}</h3>
              <p className="mb-6 mt-1 text-sm text-navy-500">We&apos;ll call you back shortly.</p>
              <EnquiryForm compact defaultService={s.title} />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
