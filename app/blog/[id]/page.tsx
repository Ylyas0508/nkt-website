"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { ArrowLeft, Calendar, Tag, MessageCircle, Mail, Share2 } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import type { BlogPost } from "@/lib/data";

const categoryColors: Record<string, string> = {
  deals: "#cd9e66",
  news: "#14b8a6",
  market: "#60a5fa",
  announcement: "#a78bfa",
};

export default function BlogDetailPage() {
  const params = useParams();
  const postId = params.id as string;
  const { locale } = useTranslation();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch(`/api/blog/${postId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch("/api/blog")
      .then((r) => r.json())
      .then((posts: BlogPost[]) => {
        setRelated(posts.filter((p) => p.id !== postId).slice(0, 3));
      })
      .catch(() => {});
  }, [postId]);

  const share = async () => {
    if (!post) return;
    const title = post.title[locale] || post.title.en;
    if (navigator.share) {
      try {
        await navigator.share({ title, url: window.location.href });
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f2040" }}>
        <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: "#cd9e66", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f2040" }}>
        <div className="text-center">
          <p className="text-white/50 text-lg mb-4">Article not found.</p>
          <a href="/#blog" className="text-sm" style={{ color: "#cd9e66" }}>← Back to blog</a>
        </div>
      </div>
    );
  }

  const title = post.title[locale] || post.title.en;
  const excerpt = post.excerpt[locale] || post.excerpt.en;
  const content = post.content[locale] || post.content.en || excerpt;
  const accent = categoryColors[post.category] || "#cd9e66";

  // Split content into paragraphs
  const paragraphs = content.split(/\n\n+|\n/).filter((p) => p.trim().length > 0);

  return (
    <div style={{ background: "#0f2040", minHeight: "100vh" }}>
      {/* Hero */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <img src={post.image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(15,32,64,0.4) 0%, rgba(15,32,64,0.95) 100%)" }} />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-10 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {post.category && (
                <div
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{
                    background: `${accent}22`,
                    color: accent,
                    border: `1px solid ${accent}44`,
                  }}
                >
                  <Tag size={11} /> {post.category}
                </div>
              )}
              <h1
                className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3"
                style={{ fontFamily: "var(--font-playfair, serif)" }}
              >
                {title}
              </h1>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Calendar size={14} />
                {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-10 flex-wrap" style={{ color: "rgba(255,255,255,0.4)" }}>
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <span>/</span>
          <a href="/#blog" className="hover:text-white transition-colors" style={{ color: "#cd9e66" }}>News & Deals</a>
          <span>/</span>
          <span className="text-white/70 truncate max-w-xs">{title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            {/* Lead excerpt */}
            <p className="text-white/80 text-lg leading-relaxed mb-8 font-medium">{excerpt}</p>

            {/* Body */}
            <div className="space-y-5 text-white/70 leading-relaxed">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-base">
                  {para.trim()}
                </p>
              ))}
            </div>

            {/* Share */}
            <div className="mt-10 pt-8 flex items-center justify-between flex-wrap gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <button
                onClick={share}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
                style={{ color: "#cd9e66", border: "1px solid rgba(205,158,102,0.3)" }}
              >
                <Share2 size={14} /> Share this article
              </button>
              <a href="/#blog" className="inline-flex items-center gap-2 text-sm transition-colors hover:text-white" style={{ color: "#cd9e66" }}>
                <ArrowLeft size={14} /> Back to all news
              </a>
            </div>
          </motion.article>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* CTA */}
            <div className="rounded-2xl p-6" style={{ background: "#142848", border: "1px solid rgba(205,158,102,0.2)" }}>
              <h3 className="text-white font-semibold mb-1">Interested in trading?</h3>
              <p className="text-white/50 text-sm mb-4">Reach out to our team for quotations and partnerships.</p>
              <a
                href={`https://wa.me/${COMPANY.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:brightness-110 mb-2"
                style={{ background: "#25D366", color: "white" }}
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
              <a
                href="/#contact"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)", color: "#0f2040" }}
              >
                <Mail size={14} /> Send enquiry
              </a>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="rounded-2xl p-6" style={{ background: "#142848", border: "1px solid rgba(255,255,255,0.07)" }}>
                <h3 className="text-white font-semibold mb-4">More Articles</h3>
                <div className="space-y-4">
                  {related.map((r) => (
                    <a key={r.id} href={`/blog/${r.id}`} className="flex gap-3 group">
                      <img src={r.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium leading-snug line-clamp-2 group-hover:text-gold-400 transition-colors" style={{ color: "white" }}>
                          {r.title[locale] || r.title.en}
                        </p>
                        <p className="text-white/40 text-xs mt-1">
                          {new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
