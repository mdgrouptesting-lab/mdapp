import { PageTitle } from "@/components/admin/AdminShell";
import { UsersManager } from "@/components/admin/UsersManager";

export default function ClientsPage() {
  return (
    <div>
      <PageTitle title="Clients" subtitle="Registered clients and their ₹50 lifetime membership." />
      <UsersManager role="client" />
    </div>
  );
}
