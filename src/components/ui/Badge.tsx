import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  new: "bg-sky-50 text-sky-700 ring-sky-200",
  contacted: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  assigned: "bg-violet-50 text-violet-700 ring-violet-200",
  in_progress: "bg-amber-50 text-amber-700 ring-amber-200",
  work_submitted: "bg-orange-50 text-orange-700 ring-orange-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  closed: "bg-slate-100 text-slate-600 ring-slate-200",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  inactive: "bg-slate-100 text-slate-600 ring-slate-200",
  expired: "bg-rose-50 text-rose-700 ring-rose-200",
  verified: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  not_submitted: "bg-slate-100 text-slate-600 ring-slate-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  manual: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  published: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  draft: "bg-slate-100 text-slate-600 ring-slate-200",
  admin: "bg-brand-50 text-brand-700 ring-brand-200",
  client: "bg-sky-50 text-sky-700 ring-sky-200",
  worker: "bg-violet-50 text-violet-700 ring-violet-200",
};

export function Badge({ value, className }: { value: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset",
        tones[value] || "bg-slate-100 text-slate-600 ring-slate-200",
        className,
      )}
    >
      {value.replace(/_/g, " ")}
    </span>
  );
}
