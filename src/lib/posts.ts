import "server-only";
import { adminConfigured, adminDb } from "./firebase-admin";
import type { DocumentData } from "firebase-admin/firestore";
import type { Post } from "./types";

function serialize(id: string, d: DocumentData): Post {
  const ts = (t: { toDate?: () => Date } | undefined) => (t?.toDate ? t.toDate() : null);
  return {
    id,
    title: d.title || "",
    slug: d.slug || id,
    excerpt: d.excerpt || "",
    content: d.content || "",
    coverImage: d.coverImage || "",
    published: !!d.published,
    author: d.author || "MD Group",
    createdAt: ts(d.createdAt),
    updatedAt: ts(d.updatedAt),
  };
}

export async function getPublishedPosts(limit = 50): Promise<Post[]> {
  if (!adminConfigured()) return [];
  try {
    const snap = await adminDb().collection("posts").where("published", "==", true).get();
    return snap.docs
      .map((d) => serialize(d.id, d.data()))
      .sort((a, b) => ((b.createdAt as Date)?.getTime() || 0) - ((a.createdAt as Date)?.getTime() || 0))
      .slice(0, limit);
  } catch (e) {
    console.error("getPublishedPosts", e);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!adminConfigured()) return null;
  try {
    const snap = await adminDb().collection("posts").where("slug", "==", slug).limit(1).get();
    if (snap.empty) return null;
    const p = serialize(snap.docs[0].id, snap.docs[0].data());
    return p.published ? p : null;
  } catch (e) {
    console.error("getPostBySlug", e);
    return null;
  }
}
