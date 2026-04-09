"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { CATEGORIES } from "@/lib/constants";
import {
  Fuel, FlaskConical, Hammer, Wheat, Shirt, Car, Cog, Atom, Package
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Fuel, FlaskConical, Hammer, Wheat, Shirt, Car, Cog, Atom, Package,
};

interface Category {
  id: string;
  tKey?: string;
  icon?: string;
  color: string;
  image: string;
  name?: string;
  isCustom?: boolean;
}

export default function ProductsSection() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(setCategories).catch(() => {});
  }, []);

  return (
    <section id="products" className="py-24" style={{ background: "#0f2040" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-14">
          <SectionHeading
            title={t("products.title")}
            subtitle={t("products.subtitle")}
            centered
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => {
            const Icon = ICON_MAP[cat.icon || "Package"] || Package;
            const name = cat.isCustom && cat.name ? cat.name : (cat.tKey ? t(`products.${cat.tKey}.name`) : (cat.name || cat.id));
            const desc = cat.tKey ? t(`products.${cat.tKey}.desc`) : "";

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="product-card relative rounded-2xl overflow-hidden group cursor-pointer"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                onClick={() => window.location.href = `/products/${cat.id}`}
              >
                {/* Background image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{ background: "linear-gradient(to top, rgba(15,32,64,0.5) 0%, transparent 60%)" }}
                  />
                  <div
                    className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${cat.color}25`, border: `1px solid ${cat.color}50` }}
                  >
                    <Icon size={18} style={{ color: cat.color }} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5" style={{ background: "#142848" }}>
                  <h3 className="text-white font-semibold text-base mb-2 group-hover:text-gold-400 transition-colors">
                    {name}
                  </h3>
                  {desc && (
                    <p className="text-white/50 text-sm leading-relaxed line-clamp-3">{desc}</p>
                  )}
                  <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <a
                      href={`/products/${cat.id}`}
                      className="text-xs font-semibold uppercase tracking-wider transition-colors"
                      style={{ color: cat.color }}
                    >
                      View Products →
                    </a>
                  </div>
                </div>

                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ border: `1px solid ${cat.color}40` }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
