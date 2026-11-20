"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, PlusCircle, UserCog, Home } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/components/auth/AuthProvider";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { profile, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const role = profile?.role;
  const links =
    role === "client"
      ? [
          { href: "/dashboard/client", label: "Overview", Icon: LayoutDashboard },
          { href: "/dashboard/client/new-request", label: "Report problem", Icon: PlusCircle },
          { href: "/dashboard/profile", label: "Profile", Icon: UserCog },
        ]
      : [
          { href: "/dashboard/worker", label: "Overview", Icon: LayoutDashboard },
          { href: "/dashboard/profile", label: "Profile", Icon: UserCog },
        ];

  return (
    <div className="min-h-screen bg-navy-50/60">
      <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/90 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {links.map(({ href, label, Icon }) => (
              <Link key={href} href={href} className={cn("flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold", pathname === href ? "bg-navy-900 text-white" : "text-navy-600 hover:bg-navy-50")}>
                <Icon className="h-4 w-4" /> {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {profile && (
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold leading-tight">{profile.name}</p>
                <Badge value={profile.role} className="mt-0.5" />
              </div>
            )}
            <Link href="/" className="rounded-lg p-2 text-navy-500 hover:bg-navy-50" aria-label="Website">
              <Home className="h-5 w-5" />
            </Link>
            <button
              onClick={async () => {
                await logout();
                router.replace("/login");
              }}
              className="rounded-lg p-2 text-navy-500 hover:bg-rose-50 hover:text-rose-600"
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      <main className="container py-8 pb-28 md:pb-10">{children}</main>
      {/* mobile bottom nav — app feel */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid border-t border-navy-100 bg-white md:hidden" style={{ gridTemplateColumns: `repeat(${links.length}, 1fr)` }}>
        {links.map(({ href, label, Icon }) => (
          <Link key={href} href={href} className={cn("flex flex-col items-center gap-1 py-3 text-[11px] font-semibold", pathname === href ? "text-brand-600" : "text-navy-500")}>
            <Icon className="h-5 w-5" /> {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
