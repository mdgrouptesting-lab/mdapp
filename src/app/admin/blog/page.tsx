"use client";

import Link from "next/link";
import { collection, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { Empty, PageTitle } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { fbDb } from "@/lib/firebase";
import { useLive } from "@/lib/useLive";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function AdminBlogPage() {
  const { data } = useLive<Post>(() => collection(fbDb(), "posts"));
  return (
    <div>
      <PageTitle
        title="Blog posts"
        subtitle="Write articles, project updates and tips for your website."
        action={
          <Link href="/admin/blog/new" className="btn-primary">
            <Plus className="h-4 w-4" /> New post
          </Link>
        }
      />
      {data === null ? (
        <Empty text="Loading…" />
      ) : data.length === 0 ? (
        <Empty text="No posts yet. Click “New post” to write your first article." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.map((p) => (
            <div key={p.id} className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-card">
              <div className="aspect-[16/9] bg-navy-900">
                {p.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.coverImage} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between">
                  <Badge value={p.published ? "published" : "draft"} />
                  <span className="text-xs text-navy-400">{formatDate(p.updatedAt || p.createdAt)}</span>
                </div>
                <p className="mt-3 flex-1 font-bold leading-snug">{p.title}</p>
                <div className="mt-4 flex items-center gap-2 border-t border-navy-100 pt-4">
                  <Link href={`/admin/blog/${p.id}`} className="btn-dark btn-sm">
                    <Pencil className="h-4 w-4" /> Edit
                  </Link>
                  <button onClick={() => updateDoc(doc(fbDb(), "posts", p.id), { published: !p.published, updatedAt: serverTimestamp() })} className="btn-outline btn-sm">
                    {p.published ? "Unpublish" : "Publish"}
                  </button>
                  {p.published && (
                    <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-navy-500 hover:bg-navy-50" aria-label="View">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <button onClick={() => confirm("Delete this post?") && deleteDoc(doc(fbDb(), "posts", p.id))} className="ml-auto rounded-lg p-2 text-navy-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
