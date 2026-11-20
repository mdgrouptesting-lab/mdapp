import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Worker Registration" };

export default function WorkerRegisterPage() {
  return (
    <AuthShell
      title="Worker registration"
      subtitle="Join MD Group's verified workforce and get regular work."
      points={["Carpenter, mason, plumber, electrician & more", "Company-verified profile badge", "Jobs assigned by MD Group", "₹100 per year — renew online"]}
    >
      <RegisterForm role="worker" />
    </AuthShell>
  );
}
