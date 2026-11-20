import type { Metadata } from "next";
import { RequireRole } from "@/components/auth/RequireRole";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireRole roles={["admin"]}>
      <AdminShell>{children}</AdminShell>
    </RequireRole>
  );
}
