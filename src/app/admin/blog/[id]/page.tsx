import { PageTitle } from "@/components/admin/AdminShell";
import { PostEditor } from "@/components/admin/PostEditor";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <PageTitle title="Edit blog post" />
      <PostEditor id={id} />
    </div>
  );
}
