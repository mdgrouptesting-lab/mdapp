import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { PostContent } from "@/components/site/PostContent";
import { getPostBySlug } from "@/lib/posts";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 120;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPostBySlug(slug);
  return p ? { title: p.title, description: p.excerpt, openGraph: p.coverImage ? { images: [p.coverImage] } : undefined } : {};
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  return (
    <article>
      <header className="relative overflow-hidden bg-navy-950 pb-16 pt-36 text-white">
        <div className="blueprint-grid absolute inset-0 opacity-50" />
        <div className="container relative max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-navy-300 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> All posts
          </Link>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-5xl">{post.title}</h1>
          <div className="mt-6 flex flex-wrap gap-5 text-sm text-navy-300">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-400" /> {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-2">
              <User className="h-4 w-4 text-brand-400" /> {post.author}
            </span>
          </div>
        </div>
      </header>
      <div className="container max-w-3xl py-14">
        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImage} alt={post.title} className="-mt-24 mb-10 aspect-[16/9] w-full rounded-3xl object-cover shadow-card" />
        )}
        {post.excerpt && <p className="mb-8 border-l-4 border-brand-400 pl-5 text-xl font-medium text-navy-600">{post.excerpt}</p>}
        <PostContent content={post.content} />
      </div>
    </article>
  );
}
