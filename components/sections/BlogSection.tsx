"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { Calendar, ArrowRight, Tag } from "lucide-react";

interface BlogPost {
  id: string;
  title: Record<string, string>;
  excerpt: Record<string, string>;
  image: string;
  date: string;
  category: string;
}

export default function BlogSection() {
  const { t, locale } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => setPosts(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  const categoryColors: Record<string, string> = {
    deals: "#cd9e66",
    news: "#14b8a6",
    market: "#60a5fa",
  };

  return (
    <section id="blog" className="py-24" style={{ background: "#142848" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-14">
          <SectionHeading
            title={t("blog.title")}
            subtitle={t("blog.subtitle")}
            centered
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.length === 0
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse"
                  style={{ background: "#142d4c", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="h-48 bg-white/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-white/10 rounded w-1/3" />
                    <div className="h-4 bg-white/10 rounded w-5/6" />
                    <div className="h-4 bg-white/10 rounded w-4/6" />
                  </div>
                </div>
              ))
            : posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  className="rounded-2xl overflow-hidden group cursor-pointer flex flex-col"
                  style={{ background: "#0f2040", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title[locale] || post.title.en}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0" style={{ background: "rgba(10,22,40,0.35)" }} />
                    {post.category && (
                      <div
                        className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: `${categoryColors[post.category] || "#cd9e66"}22`,
                          color: categoryColors[post.category] || "#cd9e66",
                          border: `1px solid ${categoryColors[post.category] || "#cd9e66"}44`,
                        }}
                      >
                        <Tag size={10} />
                        {post.category}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-1.5 text-xs text-white/40 mb-3">
                      <Calendar size={12} />
                      {new Date(post.date).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </div>
                    <h3 className="text-white font-semibold text-base mb-2 leading-snug line-clamp-2 group-hover:text-gold-400 transition-colors"
                      style={{ color: "white" }}>
                      {post.title[locale] || post.title.en}
                    </h3>
                    <p className="text-white/50 text-sm leading-relaxed line-clamp-3 flex-1">
                      {post.excerpt[locale] || post.excerpt.en}
                    </p>
                    <div className="mt-4 pt-4 flex items-center gap-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#cd9e66" }}>
                        {t("blog.read_more")}
                      </span>
                      <ArrowRight size={12} style={{ color: "#cd9e66" }} />
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>

      </div>
    </section>
  );
}
