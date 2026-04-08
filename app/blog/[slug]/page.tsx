"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Calendar, Clock, ArrowLeft, Loader2, User, Video, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  created_at: string;
  image_url: string;
  video_url?: string;
  slug: string;
}

export default function BlogPostDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [mediaFullscreen, setMediaFullscreen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/blogs/${slug}`)
      .then(async r => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then(data => { if (data) setBlog(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  // Lock body scroll when fullscreen
  useEffect(() => {
    document.body.style.overflow = mediaFullscreen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mediaFullscreen]);

  const readTime = (content: string) => {
    const words = (content || '').trim().split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
  };

  const fmt = (d: string) => d
    ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffaf3] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-[#8b5a3c] mx-auto mb-4" />
            <p className="text-[#2b1a12]">Loading story...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen bg-[#fffaf3] flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h1 className="font-serif text-3xl font-bold text-[#2b1a12] mb-4">Post Not Found</h1>
          <p className="text-[#5a3726] mb-8">We couldn't find the article you were looking for.</p>
          <Link href="/blog" className="text-[#8b5a3c] font-semibold hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const hasMedia = !!(blog.video_url || blog.image_url);

  return (
    <div className="min-h-screen bg-[#fffaf3] flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Full-width media hero — click to fullscreen */}
        {hasMedia && (
          <div
            className="relative w-full bg-black cursor-pointer group overflow-hidden"
            style={{ height: 'clamp(300px, 60vh, 580px)' }}
            onClick={() => setMediaFullscreen(true)}
          >
            {(() => {
              const isVideo = (url: string) => url && /\.(mp4|webm|ogg)$/i.test(url);
              if (blog.video_url || isVideo(blog.image_url)) {
                return (
                  <video
                    src={blog.video_url || blog.image_url}
                    autoPlay loop muted playsInline
                    className="w-full h-full object-cover opacity-90"
                  />
                );
              } else {
                return (
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                );
              }
            })()}

            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

            {/* Hover hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 border border-white/30">
                {(blog.video_url || (blog.image_url && /\.(mp4|webm|ogg)$/i.test(blog.image_url))) ? <Video className="w-4 h-4" /> : null}
                Click to view fullscreen
              </div>
            </div>

            {/* Title on hero */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:px-12 md:pb-10 pointer-events-none">
              <div className="max-w-4xl mx-auto">
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-lg">
                  {blog.title}
                </h1>
              </div>
            </div>
          </div>
        )}

        {/* Article body */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[#8b5a3c] hover:text-[#6d4830] font-medium mb-8 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>

          {/* Title if no hero */}
          {!hasMedia && (
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#2b1a12] mb-8 leading-tight">
              {blog.title}
            </h1>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-[#9b7b65] border-y border-[#e6dcd0] py-4 mb-8">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{fmt(blog.created_at)}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{readTime(blog.content)}</span>
            <span className="flex items-center gap-1.5 font-semibold text-[#8b5a3c]">
              <User className="w-4 h-4" />By {blog.author || 'Admin'}
            </span>
          </div>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-lg text-[#5a3726] font-medium leading-relaxed mb-8 pl-4 border-l-4 border-[#d4b896] italic">
              {blog.excerpt}
            </p>
          )}

          {/* Content */}
          <div className="space-y-4 text-[#3d2a1e] text-base md:text-lg leading-[1.85]">
            {(blog.content || '').split('\n').map((paragraph, idx) =>
              paragraph.trim()
                ? <p key={idx}>{paragraph}</p>
                : <div key={idx} className="h-2" />
            )}
          </div>
        </article>
      </main>

      <Footer />

      {/* Fullscreen overlay */}
      {mediaFullscreen && hasMedia && (
        <div
          className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
          onClick={() => setMediaFullscreen(false)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-10 text-white bg-white/10 hover:bg-white/25 rounded-full p-3 transition-colors"
            onClick={e => { e.stopPropagation(); setMediaFullscreen(false); }}
          >
            <X className="h-6 w-6" />
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-sm pointer-events-none">
            Click anywhere to close
          </p>

          {(() => {
            const isVideo = (url: string) => url && /\.(mp4|webm|ogg)$/i.test(url);
            if (blog.video_url || isVideo(blog.image_url)) {
              return (
                <video
                  src={blog.video_url || blog.image_url}
                  autoPlay controls loop
                  className="max-w-full max-h-full w-full h-full object-contain"
                  onClick={e => e.stopPropagation()}
                />
              );
            } else {
              return (
                <img
                  src={blog.image_url}
                  alt={blog.title}
                  className="max-w-full max-h-full object-contain"
                  onClick={e => e.stopPropagation()}
                />
              );
            }
          })()}
        </div>
      )}
    </div>
  );
}
