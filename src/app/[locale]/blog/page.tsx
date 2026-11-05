import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getDict } from "@/lib/i18n";
import { getPosts } from "@/lib/store";

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDict(locale);
  const [featured, ...posts] = getPosts();
  const t = (p: (typeof posts)[number]) =>
    locale === "en" && p.titleEn ? p.titleEn : p.title;
  const ex = (p: (typeof posts)[number]) =>
    locale === "en" && p.excerptEn ? p.excerptEn : p.excerpt;

  return (
    <div>
      <PageHeader title={dict.blog.title} subtitle={dict.home.blogTitle} />
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Featured post */}
        {featured && (
          <Link
            href={`/${locale}/blog/${featured.slug}`}
            className="group relative grid md:grid-cols-5 rounded-2xl overflow-hidden bg-zinc-950 text-white mb-10"
          >
            <div className="md:col-span-3 relative overflow-hidden">
              {featured.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featured.image}
                  alt={t(featured)}
                  className="w-full aspect-[16/9] object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full aspect-[16/9] bg-zinc-800 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/m-mark.png" alt="" className="h-20 w-20 object-contain opacity-20 invert" />
                </div>
              )}
            </div>
            <div className="md:col-span-2 p-7 flex flex-col justify-center relative">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider border border-zinc-600 rounded-full px-3 py-1">
                  {featured.tag ?? dict.blog.title}
                </span>
                <span className="text-xs text-zinc-500">{featured.date}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-5 leading-snug">
                {t(featured)}
              </h2>
              <p className="text-zinc-400 mt-4 leading-relaxed line-clamp-3">{ex(featured)}</p>
              <div className="text-sm font-semibold mt-7 inline-flex items-center gap-2">
                {dict.blog.readMore}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/${locale}/blog/${post.slug}`}
              className="group bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-zinc-300 transition-all flex flex-col"
            >
              <div className="relative overflow-hidden bg-zinc-50 aspect-[16/9]">
                {post.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.image}
                    alt={t(post)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/m-mark.png" alt="" className="h-12 w-12 object-contain opacity-15" />
                  </div>
                )}
                {post.tag && (
                  <span className="absolute top-3 left-3 bg-zinc-950/90 text-white text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {post.tag}
                  </span>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="text-xs text-zinc-400">{post.date}</div>
                <div className="font-semibold mt-2 line-clamp-2 leading-snug group-hover:underline underline-offset-4">
                  {t(post)}
                </div>
                <p className="text-sm text-zinc-500 mt-2 line-clamp-3 leading-relaxed flex-1">{ex(post)}</p>
                <div className="text-sm font-semibold mt-4 inline-flex items-center gap-1.5 underline underline-offset-4">
                  {dict.blog.readMore}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
