import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { PostCard } from "@/components/site/HomeSections";
import { getPublishedPosts } from "@/lib/posts";

export const metadata: Metadata = { title: "Blog" };
export const revalidate = 120;

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return (
    <>
      <PageHeader eyebrow="Blog" title="News, tips & project stories" subtitle="Construction advice, testing know-how and updates from MD Group." />
      <section className="section">
        <div className="container">
          {posts.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-md rounded-3xl border border-dashed border-navy-200 p-12 text-center">
              <Newspaper className="mx-auto h-10 w-10 text-navy-300" />
              <p className="mt-4 font-semibold">No posts yet</p>
              <p className="mt-1 text-sm text-navy-500">Articles published from the admin panel will appear here.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
