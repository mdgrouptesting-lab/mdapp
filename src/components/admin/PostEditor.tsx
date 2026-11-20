"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, doc, getDoc, getDocs, limit, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { Eye, ImagePlus, Save } from "lucide-react";
import { fbDb, uploadImage } from "@/lib/firebase";
import { slugify } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { PostContent } from "@/components/site/PostContent";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";

const empty = { title: "", slug: "", excerpt: "", content: "", coverImage: "", published: false };

export function PostEditor({ id }: { id?: string }) {
  const router = useRouter();
  const { profile } = useAuth();
  const [f, setF] = useState(empty);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(fbDb(), "posts", id)).then((s) => {
      if (s.exists()) {
        const d = s.data();
        setF({ title: d.title || "", slug: d.slug || "", excerpt: d.excerpt || "", content: d.content || "", coverImage: d.coverImage || "", published: !!d.published });
        setSlugTouched(true);
      }
      setLoading(false);
    });
  }, [id]);

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v = e.target.value;
    setF((s) => ({ ...s, [k]: v, ...(k === "title" && !slugTouched ? { slug: slugify(v) } : {}) }));
  };

  async function onCover(file?: File) {
    if (!file) return;
    setBusy("Uploading image…");
    try {
      const url = await uploadImage(file, "blog");
      setF((s) => ({ ...s, coverImage: url }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    }
    setBusy("");
  }

  async function save(publish?: boolean) {
    setError("");
    const slug = slugify(f.slug || f.title);
    if (!f.title.trim() || !slug) return setError("Title is required");
    if (!f.content.trim()) return setError("Content is required");
    setBusy("Saving…");
    try {
      const dup = await getDocs(query(collection(fbDb(), "posts"), where("slug", "==", slug), limit(1)));
      if (!dup.empty && dup.docs[0].id !== id) throw new Error("Another post already uses this URL slug");
      const data = {
        ...f,
        slug,
        title: f.title.trim(),
        excerpt: f.excerpt.trim() || f.content.trim().slice(0, 160),
        published: publish ?? f.published,
        author: profile?.name || "MD Group",
        updatedAt: serverTimestamp(),
      };
      if (id) await updateDoc(doc(fbDb(), "posts", id), data);
      else await addDoc(collection(fbDb(), "posts"), { ...data, createdAt: serverTimestamp() });
      router.push("/admin/blog");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
      setBusy("");
    }
  }

  if (loading) return <p className="text-navy-500">Loading…</p>;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-card">
        <div>
          <label className="label">Title</label>
          <input className="input text-lg font-semibold" value={f.title} onChange={set("title")} placeholder="e.g. 5 things to check before buying a plot" />
        </div>
        <div>
          <label className="label">URL slug</label>
          <div className="flex items-center rounded-xl border border-navy-100 bg-navy-50 pl-3 text-sm text-navy-500">
            /blog/
            <input
              className="w-full rounded-r-xl bg-white px-2 py-3 text-navy-900 outline-none"
              value={f.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setF((s) => ({ ...s, slug: slugify(e.target.value) }));
              }}
            />
          </div>
        </div>
        <div>
          <label className="label">Short summary</label>
          <textarea className="input min-h-[70px]" value={f.excerpt} onChange={set("excerpt")} placeholder="Shown on blog cards (1–2 lines)" />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="label mb-0">Content</label>
            <button type="button" onClick={() => setPreview((p) => !p)} className="flex items-center gap-1 text-xs font-semibold text-brand-600">
              <Eye className="h-4 w-4" /> {preview ? "Edit" : "Preview"}
            </button>
          </div>
          {preview ? (
            <div className="min-h-[360px] rounded-xl border border-navy-100 p-5">
              <PostContent content={f.content} />
            </div>
          ) : (
            <textarea className="input min-h-[360px] font-mono text-[13px] leading-relaxed" value={f.content} onChange={set("content")} placeholder={"Write your article…\n\n## Heading\nParagraph text with **bold** words.\n\n- Bullet point\n- Another point"} />
          )}
          <p className="mt-1 text-xs text-navy-400">Formatting: blank line = new paragraph · ## Heading · ### Sub-heading · - bullet · **bold**</p>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <p className="label">Cover image</p>
          <label className="block cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-navy-200 hover:border-brand-400">
            {f.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.coverImage} alt="" className="aspect-[16/10] w-full object-cover" />
            ) : (
              <span className="flex aspect-[16/10] flex-col items-center justify-center gap-1 text-navy-400">
                <ImagePlus className="h-8 w-8" />
                <span className="text-xs font-semibold">Upload image</span>
              </span>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onCover(e.target.files?.[0])} />
          </label>
          {f.coverImage && (
            <button onClick={() => setF((s) => ({ ...s, coverImage: "" }))} className="mt-2 text-xs text-rose-600">
              Remove image
            </button>
          )}
        </div>
        <div className="space-y-2 rounded-2xl bg-white p-5 shadow-card">
          <p className="text-sm text-navy-500">
            Status: <b className="text-navy-900">{f.published ? "Published" : "Draft"}</b>
          </p>
          {error && <Alert type="error">{error}</Alert>}
          <button onClick={() => save(true)} disabled={!!busy} className="btn-primary w-full">
            {busy ? <Spinner /> : <Save className="h-4 w-4" />} {busy || (f.published ? "Update & keep published" : "Publish")}
          </button>
          <button onClick={() => save(false)} disabled={!!busy} className="btn-outline w-full">
            Save as draft
          </button>
        </div>
      </aside>
    </div>
  );
}
