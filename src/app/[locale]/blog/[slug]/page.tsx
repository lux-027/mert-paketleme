import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { getPost, getPosts } from "@/lib/store";

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const dict = getDict(locale);
  const post = getPost(slug);
  if (!post) notFound();
  const title = locale === "en" && post.titleEn ? post.titleEn : post.title;
  const content = locale === "en" && post.contentEn ? post.contentEn : post.content;
  const others = getPosts().filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-zinc-950 text-white py-14">
        <div className="max-w-3xl mx-auto px-4">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 bg-white text-zinc-950 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-zinc-200 transition-colors"
          >
            ← {dict.blog.title}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-5">{title}</h1>
          <div className="text-sm text-zinc-400 mt-4">{post.date}</div>
        </div>
      </div>

      {post.image && (
        <div className="max-w-3xl mx-auto px-4 -mt-8">
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl aspect-[16/8] flex items-center justify-center p-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt={title} className="max-h-full object-contain" />
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 mt-10">
        <p className="text-zinc-600 leading-relaxed text-lg whitespace-pre-line">{content}</p>
      </div>

      {/* Other posts */}
      <div className="max-w-7xl mx-auto px-4 mt-16 border-t border-zinc-200 pt-10">
        <h2 className="text-xl font-bold tracking-tight mb-6">{dict.home.blogTitle}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {others.map((p) => (
            <Link
              key={p.id}
              href={`/${locale}/blog/${p.slug}`}
              className="border border-zinc-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-xs text-zinc-400">{p.date}</div>
              <div className="font-semibold mt-2 line-clamp-2">
                {locale === "en" && p.titleEn ? p.titleEn : p.title}
              </div>
              <div className="text-sm font-semibold mt-4 underline underline-offset-4">
                {dict.blog.readMore}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
