"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/constants";
import { ArrowLeft, MessageCircle, Phone, Mail, CheckCircle2, Tag } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import type { Product } from "@/lib/data";

export default function ProductDetailPage() {
  const params = useParams();
  const categoryId = params.category as string;
  const productId = params.id as string;
  const { t, locale } = useTranslation();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const category = CATEGORIES.find((c) => c.id === categoryId);

  useEffect(() => {
    fetch(`/api/products/${productId}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f2040" }}>
        <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#cd9e66", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f2040" }}>
        <div className="text-center">
          <p className="text-white/50 text-lg mb-4">Product not found.</p>
          <a href={`/products/${categoryId}`} className="text-sm" style={{ color: "#cd9e66" }}>← Back to category</a>
        </div>
      </div>
    );
  }

  const name = (product.name as Record<string, string>)[locale] || product.name.en;
  const description = (product.description as Record<string, string>)[locale] || product.description.en;

  // Parse description into bullet points (split by ". " or newlines)
  const bullets = description.split(/\.\s+|\n/).filter((s) => s.trim().length > 5);

  return (
    <div style={{ background: "#0f2040", minHeight: "100vh" }}>
      {/* Slim top banner */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={product.image}
          alt={name}
          className="w-full h-full object-cover"
          style={{ filter: "blur(2px) brightness(0.35)" }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(10,22,40,0.6)" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
            style={{ background: `${category?.color ?? "#cd9e66"}22`, color: category?.color ?? "#cd9e66", border: `1px solid ${category?.color ?? "#cd9e66"}44` }}
          >
            {category ? t(`products.${category.tKey}.name`) : categoryId}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8 flex-wrap" style={{ color: "rgba(255,255,255,0.4)" }}>
          <a href="/#products" className="hover:text-white transition-colors">Products</a>
          <span>/</span>
          <a href={`/products/${categoryId}`} className="hover:text-white transition-colors" style={{ color: "#cd9e66" }}>
            {category ? t(`products.${category.tKey}.name`) : categoryId}
          </a>
          <span>/</span>
          <span className="text-white/70 truncate max-w-xs">{name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(205,158,102,0.2)" }}>
              <img
                src={product.image}
                alt={name}
                className="w-full h-96 object-cover"
              />
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            <h1
              className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "var(--font-playfair, serif)" }}
            >
              {name}
            </h1>

            {/* Price tag */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-xl w-fit"
              style={{ background: "rgba(205,158,102,0.1)", border: "1px solid rgba(205,158,102,0.25)" }}>
              <span className="text-xs text-white/50 uppercase tracking-wider">Price</span>
              <span className="font-semibold" style={{ color: "#cd9e66" }}>{product.price}</span>
            </div>

            {/* Description bullets */}
            <div className="space-y-2.5 mb-8">
              {bullets.map((bullet, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: "#cd9e66" }} />
                  <p className="text-white/70 text-sm leading-relaxed">{bullet.trim().replace(/\.$/, '')}.</p>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a
                href={`https://wa.me/${COMPANY.whatsapp}?text=Hello, I'm interested in: ${name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all hover:brightness-110"
                style={{ background: "#25D366", color: "white" }}
              >
                <MessageCircle size={16} />
                Inquire on WhatsApp
              </a>
              <a
                href="/#contact"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all hover:brightness-110"
                style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)", color: "#0f2040" }}
              >
                <Mail size={16} />
                Send Enquiry
              </a>
            </div>

            {/* Contact card */}
            <div className="rounded-xl p-4" style={{ background: "#142848", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Direct Contact</p>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 text-white/60">
                  <Mail size={13} style={{ color: "#cd9e66" }} />
                  <a href={`mailto:${COMPANY.email}`} className="hover:text-white transition-colors">{COMPANY.email}</a>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Phone size={13} style={{ color: "#cd9e66" }} />
                  <span>WeChat: {COMPANY.wechat}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <a
            href={`/products/${categoryId}`}
            className="inline-flex items-center gap-2 text-sm transition-colors hover:text-white"
            style={{ color: "#cd9e66" }}
          >
            <ArrowLeft size={15} />
            Back to {category ? t(`products.${category.tKey}.name`) : "Category"}
          </a>
        </div>
      </div>
    </div>
  );
}
