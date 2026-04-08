"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/constants";
import { ArrowLeft, MessageCircle, Tag } from "lucide-react";
import type { Product } from "@/lib/data";

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.category as string;
  const { t, locale } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const category = CATEGORIES.find((c) => c.id === categoryId);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => {
        setProducts(data.filter((p) => p.category === categoryId));
        setLoading(false);
      });
  }, [categoryId]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a1628" }}>
        <p className="text-white/50">Category not found.</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a1628", minHeight: "100vh" }}>
      {/* Category Hero Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={category.image}
          alt={t(`products.${category.tKey}.name`)}
          className="w-full h-full object-cover"
          style={{ filter: "blur(1px) brightness(0.4)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(10,22,40,0.3), rgba(10,22,40,0.85))" }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-3"
            style={{ fontFamily: "var(--font-playfair, serif)" }}
          >
            {t(`products.${category.tKey}.name`)}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-white/65 max-w-xl text-base"
          >
            {t(`products.${category.tKey}.desc`)}
          </motion.p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Back link */}
        <a
          href="/#products"
          className="inline-flex items-center gap-2 text-sm mb-10 transition-colors hover:text-white"
          style={{ color: "#cd9e66" }}
        >
          <ArrowLeft size={15} />
          All Categories
        </a>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: "#0d1f35", height: 340 }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/40 text-lg mb-4">No specific products listed yet for this category.</p>
            <a
              href={`https://wa.me/905380390593?text=Hello, I'm interested in ${t(`products.${category.tKey}.name`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
              style={{ background: "#25D366", color: "white" }}
            >
              <MessageCircle size={16} />
              Inquire via WhatsApp
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <motion.a
                key={product.id}
                href={`/products/${categoryId}/${product.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="rounded-2xl overflow-hidden group block"
                style={{ background: "#0d1f35", border: "1px solid rgba(255,255,255,0.07)", textDecoration: "none" }}
              >
                {/* Product image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={product.image}
                    alt={(product.name as Record<string, string>)[locale] || product.name.en}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,22,40,0.7) 20%, transparent)" }} />
                  <div
                    className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
                    style={{ background: `${category.color}22`, color: category.color, border: `1px solid ${category.color}44` }}
                  >
                    <Tag size={10} />
                    {category.id.replace(/-/g, " ")}
                  </div>
                </div>

                {/* Product info */}
                <div className="p-5">
                  <h3 className="text-white font-semibold text-base mb-2 leading-snug group-hover:text-white transition-colors"
                    style={{ fontFamily: "var(--font-playfair, serif)" }}>
                    {(product.name as Record<string, string>)[locale] || product.name.en}
                  </h3>
                  <p className="text-white/50 text-sm line-clamp-2 mb-4">
                    {(product.description as Record<string, string>)[locale] || product.description.en}
                  </p>
                  <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-xs text-white/40">{product.price}</span>
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: category.color }}>
                      View Details →
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-16 rounded-2xl p-8 text-center" style={{ background: "#0d1f35", border: "1px solid rgba(205,158,102,0.2)" }}>
          <h3 className="text-white font-bold text-xl mb-2">Don't see what you need?</h3>
          <p className="text-white/50 text-sm mb-6">We can source any product on request. Contact us directly for a custom quotation.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)", color: "#0a1628" }}
            >
              Send Enquiry
            </a>
            <a
              href={`https://wa.me/905380390593?text=Hello, I need a quote for ${t(`products.${category.tKey}.name`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
              style={{ background: "#25D366", color: "white" }}
            >
              <MessageCircle size={15} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
