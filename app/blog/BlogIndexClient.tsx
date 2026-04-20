"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { Calendar, Tag, ArrowRight, Home } from "lucide-react";
import type { BlogPost } from "@/lib/data";

const categoryColors: Record<string, string> = {
  deals: "#cd9e66",
  news: "#14b8a6",
  market: "#60a5fa",
  announcement: "#a78bfa",
};

export default function BlogIndexClient({ posts }: { posts: BlogPost[] }) {
  const { locale } = useTranslation();

  return (
    <div style={{ background: "#0f2040", minHeight: "100vh" }}>
      {/* Hero */}
      <div className="relative py-20 md:py-28 overflow-hidden" style={{ background: "linear-gradient(135deg, #0f2040 0%, #142848 100%)" }}>
        {/* Decorative gold accent */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: "radial-gradient(ellipse at top, rgba(205,158,102,0.18) 0%, transparent 55%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-2 text-sm mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              <a href="/" className="hover:text-white transition-colors inline-flex items-center gap-1"><Home size={12} /> Home</a>
              <span>/</span>
              <span style={{ color: "#cd9e66" }}>News & Deals</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair, serif)" }}>
              News &amp; Deals
            </h1>
            {/* Gold separator */}
            <div className="w-16 h-[2px] mx-auto mb-5" style={{ background: "linear-gradient(90deg, transparent, #cd9e66, transparent)" }} />
            <p className="text-white/60 max-w-2xl mx-auto text-base">
              Stay updated with our latest trade deals, market insights, and company news.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-white/40">No articles published yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.a
                key={post.id}
                href={`/blog/${post.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.08, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="rounded-2xl overflow-hidden group cursor-pointer flex flex-col transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
                style={{ background: "#142848", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="relative h-56 overflow-hidden" style={{ background: "#0a1628" }}>
                  {/* Blurred backdrop (same image) to fill empty space elegantly */}
                  <img
                    src={post.image}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: "blur(24px) brightness(0.5)", transform: "scale(1.1)" }}
                  />
                  {/* Main image — full, uncropped */}
                  <img
                    src={post.image}
                    alt=""
                    className="relative w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  {post.category && (
                    <div
                      className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: `${categoryColors[post.category] || "#cd9e66"}22`,
                        color: categoryColors[post.category] || "#cd9e66",
                        border: `1px solid ${categoryColors[post.category] || "#cd9e66"}44`,
                      }}
                    >
                      <Tag size={10} /> {post.category}
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 text-xs text-white/40 mb-3">
                    <Calendar size={12} />
                    {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                  <h3 className="text-white font-semibold text-base mb-2 leading-snug line-clamp-2">
                    {post.title[locale] || post.title.en}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed line-clamp-3 flex-1">
                    {post.excerpt[locale] || post.excerpt.en}
                  </p>
                  <div className="mt-4 pt-4 flex items-center gap-1.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#cd9e66" }}>Read More</span>
                    <ArrowRight size={12} style={{ color: "#cd9e66" }} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
