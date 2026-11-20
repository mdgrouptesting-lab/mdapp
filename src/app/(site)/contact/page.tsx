import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Contact & Enquiry" };

type Props = { searchParams: Promise<{ service?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const { service = "" } = await searchParams;
  const items = [
    { Icon: Phone, label: "Phone", value: siteConfig.phone, href: siteConfig.phoneHref },
    { Icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: siteConfig.whatsapp },
    { Icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    { Icon: Clock, label: "Working hours", value: siteConfig.hours },
  ];
  return (
    <>
      <PageHeader eyebrow="Contact" title="Talk to MD Group" subtitle="Call, WhatsApp or send an enquiry with your phone number, address and requirement." />
      <section className="section">
        <div className="container">
          <div className="-mt-36 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map(({ Icon, label, value, href }) => {
              const inner = (
                <>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-glow">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-navy-400">{label}</p>
                  <p className="mt-1 font-semibold">{value}</p>
                </>
              );
              return href ? (
                <a key={label} href={href} className="card relative p-6 transition hover:-translate-y-1">
                  {inner}
                </a>
              ) : (
                <div key={label} className="card relative p-6">
                  {inner}
                </div>
              );
            })}
          </div>

          <div id="enquiry" className="mt-16 grid scroll-mt-28 gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div className="card p-6 md:p-10">
              <h2 className="text-3xl font-bold">Add an enquiry</h2>
              <p className="mb-8 mt-2 text-navy-500">Fill in your details — the enquiry goes straight to the MD Group team.</p>
              <EnquiryForm defaultService={service} />
            </div>
            <div className="space-y-6">
              <div className="card p-6">
                <div className="flex gap-4">
                  <MapPin className="h-6 w-6 shrink-0 text-brand-500" />
                  <div>
                    <p className="font-bold">Office address</p>
                    <p className="mt-1 text-navy-500">{siteConfig.address}</p>
                  </div>
                </div>
              </div>
              <div className="card overflow-hidden">
                {siteConfig.mapEmbedUrl ? (
                  <iframe src={siteConfig.mapEmbedUrl} className="h-80 w-full border-0" loading="lazy" title="MD Group location" />
                ) : (
                  <div className="blueprint-grid grid h-80 place-items-center bg-navy-950 p-6 text-center text-navy-200">
                    <div>
                      <MapPin className="mx-auto h-10 w-10 text-brand-400" />
                      <p className="mt-3 text-sm">Add your Google Maps embed link in <code className="text-brand-300">src/lib/config.ts</code></p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
