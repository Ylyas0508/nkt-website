"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (1800 / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function AboutSection() {
  const { t } = useTranslation();

  const stats = [
    { value: 10, suffix: "+", labelKey: "about.stat1.label" },
    { value: 50, suffix: "+", labelKey: "about.stat2.label" },
    { value: 500, suffix: "+", labelKey: "about.stat3.label" },
    { value: 9, suffix: "", labelKey: "about.stat4.label" },
  ];

  return (
    <section id="about" className="py-24" style={{ background: "#0d1f35" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Text */}
          <AnimatedSection variant="fade-left">
            <SectionHeading title={t("about.title")} />
            <div className="space-y-4 mt-6">
              <p className="text-white/70 leading-relaxed">{t("about.p1")}</p>
              <p className="text-white/70 leading-relaxed">{t("about.p2")}</p>
              <p className="text-white/70 leading-relaxed">{t("about.p3")}</p>
              <p className="text-white/70 leading-relaxed">{t("about.p4")}</p>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:brightness-110 mt-8"
              style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)", color: "#0a1628" }}
            >
              {t("nav.contact")} →
            </a>
          </AnimatedSection>

          {/* Right: Image + Stats */}
          <AnimatedSection variant="fade-right" delay={0.2}>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(205,158,102,0.2)" }}>
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"
                  alt="Global trade operations"
                  className="w-full h-72 object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-10">
                {stats.map(({ value, suffix, labelKey }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="rounded-xl p-4 text-center"
                    style={{ background: "rgba(205,158,102,0.07)", border: "1px solid rgba(205,158,102,0.15)" }}
                  >
                    <div className="text-3xl font-bold mb-1" style={{ color: "#cd9e66", fontFamily: "var(--font-playfair, serif)" }}>
                      <CountUp target={value} suffix={suffix} />
                    </div>
                    <div className="text-xs text-white/50 uppercase tracking-wider">{t(labelKey)}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
