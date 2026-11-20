import { RequireRole } from "@/components/auth/RequireRole";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole roles={["client", "worker"]}>
      <DashboardShell>{children}</DashboardShell>
    </RequireRole>
  );
}
