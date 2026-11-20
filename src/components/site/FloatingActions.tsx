import { Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500 text-white shadow-lg transition hover:scale-110">
        <MessageCircle className="h-6 w-6" />
      </a>
      <a href={siteConfig.phoneHref} aria-label="Call" className="relative grid h-14 w-14 place-items-center rounded-full bg-brand-500 text-white shadow-glow transition hover:scale-110">
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-400" />
        <Phone className="relative h-6 w-6" />
      </a>
    </div>
  );
}
