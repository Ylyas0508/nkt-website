"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { ArrowDown, Globe, TrendingUp, Package } from "lucide-react";

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 4,
}));

export default function HeroSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden animated-gradient"
    >
      {/* Parallax background photo - blurred industrial image */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?w=1920&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(2px) brightness(0.65)",
            transform: "scale(1.05)",
          }}
        />
      </motion.div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(to bottom, rgba(10,22,40,0.55) 0%, rgba(10,22,40,0.75) 60%, rgba(10,22,40,0.95) 100%)" }} />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(205,158,102,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(205,158,102,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="particle z-10"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-2 leading-tight"
          style={{ fontFamily: "var(--font-playfair, serif)" }}
        >
          {t("hero.title1")}
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight"
          style={{
            fontFamily: "var(--font-playfair, serif)",
            background: "linear-gradient(135deg, #cd9e66, #d4af7a, #e0c99a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("hero.title2")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-base sm:text-lg text-white/65 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <a
            href="#products"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all hover:brightness-110 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #cd9e66, #d4af7a)",
              color: "#0a1628",
            }}
          >
            <Package size={16} />
            {t("hero.cta1")}
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm border text-white transition-all hover:bg-white/10"
            style={{ borderColor: "rgba(255,255,255,0.25)" }}
          >
            {t("hero.cta2")}
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-8 justify-center"
        >
          {[
            { valKey: "hero.stat1.value", labelKey: "hero.stat1.label" },
            { valKey: "hero.stat2.value", labelKey: "hero.stat2.label" },
            { valKey: "hero.stat3.value", labelKey: "hero.stat3.label" },
          ].map(({ valKey, labelKey }, i) => (
            <div key={i} className="text-center">
              <div
                className="text-3xl font-bold"
                style={{ color: "#cd9e66", fontFamily: "var(--font-playfair, serif)" }}
              >
                {t(valKey)}
              </div>
              <div className="text-xs text-white/50 uppercase tracking-wider mt-1">{t(labelKey)}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-gold-500" style={{ background: "linear-gradient(to bottom, transparent, #cd9e66)" }} />
        <ArrowDown size={14} style={{ color: "#cd9e66" }} />
      </motion.div>
    </section>
  );
}
