import { PageTitle } from "@/components/admin/AdminShell";
import { UsersManager } from "@/components/admin/UsersManager";

export default function WorkersPage() {
  return (
    <div>
      <PageTitle title="Workers" subtitle="Verify workers' ID & work photos, and manage their ₹100/year membership." />
      <UsersManager role="worker" />
    </div>
  );
}
