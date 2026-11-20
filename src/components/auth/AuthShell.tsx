import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/Logo";

export function AuthShell({ title, subtitle, children, points }: { title: string; subtitle: string; children: React.ReactNode; points?: string[] }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden overflow-hidden bg-navy-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="blueprint-grid absolute inset-0 opacity-60" />
        <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-brand-500/30 blur-[100px]" />
        <div className="relative">
          <Logo light />
        </div>
        <div className="relative">
          <h2 className="text-4xl font-extrabold leading-tight">
            Build strong.<br />
            <span className="text-gradient">Build smart.</span>
          </h2>
          <ul className="mt-8 space-y-4">
            {(points || ["Verified skilled workers", "Report problems with photos", "Company-managed payments", "Install as an app on your phone"]).map((p) => (
              <li key={p} className="flex items-center gap-3 text-navy-100">
                <CheckCircle2 className="h-5 w-5 text-brand-400" /> {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-navy-400">© {new Date().getFullYear()} MD Group</p>
      </aside>
      <main className="flex items-center justify-center bg-white px-5 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-3xl font-extrabold">{title}</h1>
          <p className="mt-2 text-navy-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-sm text-navy-400">
            <Link href="/" className="hover:text-navy-700">
              ← Back to website
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
