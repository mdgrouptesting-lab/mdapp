import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/lib/config";
import { services } from "@/lib/services";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-950 text-navy-200">
      <div className="blueprint-grid absolute inset-0 opacity-30" />
      <div className="container relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-5 text-sm leading-relaxed text-navy-300">{siteConfig.description}</p>
          <div className="mt-6 flex gap-2">
            {[
              { href: siteConfig.social.facebook, Icon: Facebook, label: "Facebook" },
              { href: siteConfig.social.instagram, Icon: Instagram, label: "Instagram" },
              { href: siteConfig.social.youtube, Icon: Youtube, label: "YouTube" },
              { href: siteConfig.social.linkedin, Icon: Linkedin, label: "LinkedIn" },
            ].map(({ href, Icon, label }) => (
              <a key={label} href={href} aria-label={label} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 transition hover:border-brand-400 hover:bg-brand-500 hover:text-white">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Services</h4>
          <ul className="mt-5 space-y-2.5 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="transition hover:text-brand-300">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Quick links</h4>
          <ul className="mt-5 space-y-2.5 text-sm">
            {[
              ["/about", "About MD Group"],
              ["/membership", "Membership plans"],
              ["/register/client", "Client registration"],
              ["/register/worker", "Worker registration"],
              ["/blog", "Blog & updates"],
              ["/contact", "Contact & enquiry"],
              ["/login", "Login"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-brand-300">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">Contact</h4>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /> {siteConfig.address}
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
              <a href={siteConfig.phoneHref} className="hover:text-white">
                {siteConfig.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                {siteConfig.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /> {siteConfig.hours}
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-navy-400 md:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <p>Designed for strong foundations.</p>
        </div>
      </div>
    </footer>
  );
}
