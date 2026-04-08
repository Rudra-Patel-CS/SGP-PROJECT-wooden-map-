"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Search, Loader2, Video } from "lucide-react";
import Link from "next/link";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  created_at: string;
  image_url: string;
  video_url?: string;
  published?: boolean;
  slug: string;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch("/api/blogs")
      .then(async r => {
        if (!r.ok) {
          const d = await r.json();
          throw new Error(d.error || 'Failed to load blogs');
        }
        return r.json();
      })
      .then((data: Blog[]) => setBlogs(data.filter(b => b.published !== false)))
      .catch(err => setFetchError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = blogs.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayed = filtered;

  const readTime = (content: string) => {
    const words = (content || '').trim().split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
  };

  const fmt = (d: string) => d
    ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="min-h-screen bg-[#fffaf3] flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#f7f1e8] via-[#efe6d8] to-[#e8ddd0] py-16 md:py-24 border-b border-[#e6dcd0]">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <span className="inline-block text-xs font-semibold tracking-widest text-[#8b5a3c] uppercase mb-4 bg-[#f0e6d8] px-4 py-1.5 rounded-full">
              Our Journal
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#2b1a12] leading-tight">
              Stories &amp; Inspiration
            </h1>
            <p className="mt-5 text-lg text-[#5a3726] leading-relaxed">
              Discover the artistry behind our wooden maps, interior design tips, and stories of craftsmanship.
            </p>
          </div>
        </section>

        <section className="py-14">
          <div className="container mx-auto px-4">
            {/* Search bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#2b1a12]">Recent Articles</h2>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9b7b65]" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-[#d4b896] focus:border-[#8b5a3c]"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="w-10 h-10 animate-spin text-[#8b5a3c] mb-4" />
                <p className="text-[#2b1a12] text-lg">Loading stories...</p>
              </div>
            ) : fetchError ? (
              <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-200">
                <p className="text-red-600 font-medium">{fetchError}</p>
                <button onClick={() => window.location.reload()} className="mt-4 text-sm text-[#8b5a3c] underline">
                  Try again
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 bg-[#f7f1e8] rounded-2xl border border-[#e6dcd0]">
                <p className="text-[#5a3726] text-lg">No articles found.</p>
              </div>
            ) : (
              <>


                {/* Grid */}
                <div className="grid gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {displayed.map(post => (
                    <Link
                      href={`/blog/${post.slug || post.id}`}
                      key={post.id}
                      className="group flex flex-col rounded-2xl overflow-hidden border border-[#e6dcd0] bg-white shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative overflow-hidden bg-[#efe6d8] aspect-square">
                        {(() => {
                          const isVideo = (url: string) => url && /\.(mp4|webm|ogg)$/i.test(url);
                          if (post.video_url || isVideo(post.image_url)) {
                            return (
                              <video
                                src={post.video_url || post.image_url}
                                className="absolute inset-0 w-full h-full object-cover"
                                muted loop playsInline
                              />
                            );
                          } else if (post.image_url) {
                            return (
                              <img
                                src={post.image_url}
                                alt={post.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            );
                          } else {
                            return <div className="absolute inset-0 flex items-center justify-center text-[#c4a882] text-sm">No Media</div>;
                          }
                        })()}
                        {(post.video_url || (post.image_url && /\.(mp4|webm|ogg)$/i.test(post.image_url))) && (
                          <div className="absolute top-3 left-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 z-10">
                            <Video className="w-3 h-3" /> Video
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <span className="text-xs font-medium text-[#8b5a3c] bg-[#f7f1e8] px-2.5 py-1 rounded-full self-start mb-3">
                          {readTime(post.content)}
                        </span>
                        <h3 className="font-serif text-xl font-bold text-[#2b1a12] group-hover:text-[#8b5a3c] transition-colors line-clamp-2 leading-tight mb-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-[#5a3726] line-clamp-2 flex-1 mb-4">{post.excerpt}</p>
                        <div className="pt-4 border-t border-[#f3ebe2] flex items-center gap-3 text-xs text-[#9b7b65]">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{fmt(post.created_at)}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.author || 'Admin'}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>


              </>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-gradient-to-br from-[#8b5a3c] to-[#5a3726] py-16">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">Stay Inspired</h2>
            <p className="text-white/80 mb-8">Subscribe for the latest articles, design tips, and exclusive offers.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 sm:w-80"
              />
              <Button className="bg-white text-[#8b5a3c] hover:bg-[#f7f1e8] font-semibold">Subscribe</Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
