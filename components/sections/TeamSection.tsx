"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

const FacebookIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.7V4.6c-.3 0-1.3-.1-2.5-.1-2.4 0-4.1 1.5-4.1 4.2V11H7.5v3.1h2.7V22h3.3z"/>
  </svg>
);
const TwitterIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2H21.5l-7.5 8.58L22.5 22h-6.5l-5.1-6.66L5.1 22H1.84l8.03-9.18L1.5 2h6.66l4.6 6.08L18.244 2zm-1.14 18h1.8L7.02 4H5.1l12.004 16z"/>
  </svg>
);
const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
import AnimatedSection from "@/components/ui/AnimatedSection";
import type { TeamMember } from "@/lib/data";

export default function TeamSection() {
  const { locale } = useTranslation();
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetch("/api/team").then((r) => r.json()).then(setTeam).catch(() => {});
  }, []);

  if (team.length === 0) return null;

  return (
    <section id="team" className="py-24" style={{ background: "#f4f5f7" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: "#cd9e66", fontFamily: "var(--font-display, serif)" }}
          >
            Meet Our Team
          </h2>
          <div className="w-16 h-1 mx-auto mb-5 rounded-full" style={{ background: "#cd9e66" }} />
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: "#4b5563" }}>
            The people behind Nanning Kazan Trading — experienced professionals dedicated to connecting global markets.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
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
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(10,22,40,0.15)" }}
                className="bg-white rounded-2xl px-6 pt-10 pb-8 flex flex-col items-center text-center transition-shadow"
                style={{ boxShadow: "0 6px 20px rgba(10,22,40,0.06)" }}
              >
                <div className="mb-6 rounded-full p-[4px]" style={{ border: "3px solid #cd9e66" }}>
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                    {m.image ? (
                      <img src={m.image} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: "rgba(205,158,102,0.1)" }}>
                        {m.emoji || "👤"}
                      </div>
                    )}
                  </div>
                </div>

                <h3
                  className="font-semibold text-xl mb-5"
                  style={{ color: "#142848", fontFamily: "var(--font-playfair, serif)" }}
                >
                  {name}
                </h3>

                <p
                  className="text-sm italic leading-relaxed mb-5 px-2"
                  style={{ color: "#6b7280" }}
                >
                  {desc}
                </p>

                <div
                  className="w-full pt-5 mt-auto"
                  style={{ borderTop: "1px solid rgba(20,40,72,0.08)" }}
                >
                  <p
                    className="font-bold text-sm tracking-wide mb-4"
                    style={{ color: "#142848" }}
                  >
                    {role}
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <a
                      href="#"
                      aria-label={`${name} Facebook`}
                      className="transition-opacity hover:opacity-60"
                      style={{ color: "#142848" }}
                    >
                      <FacebookIcon size={16} />
                    </a>
                    <a
                      href="#"
                      aria-label={`${name} Twitter`}
                      className="transition-opacity hover:opacity-60"
                      style={{ color: "#142848" }}
                    >
                      <TwitterIcon size={16} />
                    </a>
                    <a
                      href="#"
                      aria-label={`${name} Instagram`}
                      className="transition-opacity hover:opacity-60"
                      style={{ color: "#142848" }}
                    >
                      <InstagramIcon size={16} />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
