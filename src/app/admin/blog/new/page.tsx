import { PageTitle } from "@/components/admin/AdminShell";
import { PostEditor } from "@/components/admin/PostEditor";

export default function NewPostPage() {
  return (
    <div>
      <PageTitle title="New blog post" />
      <PostEditor />
    </div>
  );
}
