import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Client Registration" };

export default function ClientRegisterPage() {
  return (
    <AuthShell
      title="Client registration"
      subtitle="Create your account, activate lifetime membership and report problems anytime."
      points={["Lifetime membership for just ₹50", "Upload photos & choose your problem", "Company calls you back", "Pay the company — never the worker"]}
    >
      <RegisterForm role="client" />
    </AuthShell>
  );
}
