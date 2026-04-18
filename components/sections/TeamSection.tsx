"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import type { TeamMember } from "@/lib/data";

export default function TeamSection() {
  const { locale } = useTranslation();
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetch("/api/team").then((r) => r.json()).then(setTeam).catch(() => {});
  }, []);

  if (team.length === 0) return null;

  return (
    <section id="team" className="py-24" style={{ background: "#142848" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-14">
          <SectionHeading
            title="Our Team"
            subtitle="The people behind Nanning Kazan Trading — experienced professionals dedicated to connecting global markets."
            centered
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((m, i) => {
            const name = m.name[locale] || m.name.en;
            const role = m.role[locale] || m.role.en;
            const desc = m.description[locale] || m.description.en;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="rounded-2xl p-6 flex flex-col items-center text-center transition-all"
                style={{ background: "#0f2040", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden" style={{ border: "2px solid rgba(205,158,102,0.4)" }}>
                    {m.image ? (
                      <img src={m.image} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl" style={{ background: "rgba(205,158,102,0.1)" }}>
                        {m.emoji || "👤"}
                      </div>
                    )}
                  </div>
                  {m.emoji && m.image && (
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ background: "#142848", border: "2px solid #cd9e66" }}>
                      {m.emoji}
                    </div>
                  )}
                </div>
                <h3 className="text-white font-semibold text-lg mb-1" style={{ fontFamily: "var(--font-playfair, serif)" }}>
                  {name}
                </h3>
                <p className="text-xs uppercase tracking-wider mb-3" style={{ color: "#cd9e66" }}>{role}</p>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
