import { cn } from "@/lib/utils";

export function SectionHeading({ eyebrow, title, subtitle, center = true, light = false }: { eyebrow?: string; title: React.ReactNode; subtitle?: string; center?: boolean; light?: boolean }) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && <span className={cn("eyebrow", light && "border-white/20 bg-white/10 text-brand-200")}>{eyebrow}</span>}
      <h2 className={cn("mt-4 text-3xl font-bold leading-tight md:text-5xl", light ? "text-white" : "text-navy-900")}>{title}</h2>
      {subtitle && <p className={cn("mt-4 text-base md:text-lg", light ? "text-navy-200" : "text-navy-500")}>{subtitle}</p>}
    </div>
  );
}
