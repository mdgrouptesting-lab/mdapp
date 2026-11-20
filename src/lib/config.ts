/**
 * ✏️  EDIT THIS FILE with MD Group's real details.
 * Everything on the website (header, footer, contact page, emails) reads from here.
 */
export const siteConfig = {
  name: "MD Group",
  legalName: "MD Group Construction & Engineering",
  tagline: "Build Strong. Build Smart.",
  description:
    "MD Group delivers end-to-end construction, planning, soil testing, land survey, material testing, G+1 house construction and interior solutions — with verified skilled workers on call.",
  phone: "+91 90000 00000",
  phoneHref: "tel:+919000000000",
  whatsapp: "https://wa.me/919000000000",
  email: "info@mdgroup.in",
  address: "MD Group Office, Main Road, Your City, State - 000000",
  mapEmbedUrl: "", // optional: paste Google Maps "Embed a map" src URL here
  hours: "Mon – Sat · 9:00 AM – 7:00 PM",
  social: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
    linkedin: "#",
  },
  // Numbers shown on the homepage — update with real figures
  stats: [
    { value: 250, suffix: "+", label: "Projects delivered" },
    { value: 15, suffix: "+", label: "Years of experience" },
    { value: 120, suffix: "+", label: "Verified workers" },
    { value: 98, suffix: "%", label: "Client satisfaction" },
  ],
};

/** Membership pricing (in rupees). Server uses these values to create payment orders. */
export const pricing = {
  client: { amount: 50, label: "Client Lifetime Membership", period: "one-time · lifetime" },
  worker: { amount: 100, label: "Worker Annual Membership", period: "per year · renewable" },
} as const;

export type PlanKey = keyof typeof pricing;
