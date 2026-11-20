import { cn } from "@/lib/utils";

export function Alert({ type = "info", children, className }: { type?: "info" | "error" | "success" | "warning"; children: React.ReactNode; className?: string }) {
  const tone = {
    info: "border-sky-200 bg-sky-50 text-sky-800",
    error: "border-rose-200 bg-rose-50 text-rose-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
  }[type];
  return <div className={cn("rounded-xl border px-4 py-3 text-sm", tone, className)}>{children}</div>;
}
