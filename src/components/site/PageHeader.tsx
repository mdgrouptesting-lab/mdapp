export function PageHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-20 pt-36 text-white">
      <div className="blueprint-grid absolute inset-0 opacity-60" />
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-500/25 blur-3xl" />
      <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-navy-500/30 blur-3xl" />
      <div className="container relative">
        {eyebrow && <span className="eyebrow border-white/20 bg-white/10 text-brand-200">{eyebrow}</span>}
        <h1 className="mt-4 max-w-3xl animate-fade-up text-4xl font-extrabold md:text-6xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl animate-fade-up text-lg text-navy-200 [animation-delay:120ms]">{subtitle}</p>}
      </div>
    </section>
  );
}
