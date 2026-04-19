"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import AnimatedSection from "@/components/ui/AnimatedSection";
import type { TeamMember } from "@/lib/data";

// Gradient backgrounds (cycles through team members)
const GRADIENTS = [
  "linear-gradient(135deg, #1a3a5c 0%, #0a1628 100%)",
  "linear-gradient(135deg, #1a3a4a 0%, #0a1628 100%)",
  "linear-gradient(135deg, #2a2a4a 0%, #0a1628 100%)",
  "linear-gradient(135deg, #1a2a4a 0%, #0a2020 100%)",
  "linear-gradient(135deg, #2a1a3a 0%, #0a0a28 100%)",
];

const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const WeChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.11.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-3.864 2.833c.568 0 1.028.465 1.028 1.03 0 .568-.46 1.033-1.028 1.033-.567 0-1.027-.465-1.027-1.032 0-.568.46-1.031 1.027-1.031zm3.87 0c.568 0 1.027.465 1.027 1.03 0 .568-.46 1.033-1.027 1.033-.567 0-1.027-.465-1.027-1.032 0-.568.46-1.031 1.027-1.031z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.7V4.6c-.3 0-1.3-.1-2.5-.1-2.4 0-4.1 1.5-4.1 4.2V11H7.5v3.1h2.7V22h3.3z"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
  </svg>
);

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
          <h2 className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: "#cd9e66", fontFamily: "var(--font-display, serif)" }}>
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

            const socialLinks = [
              m.whatsapp ? { href: `https://wa.me/${m.whatsapp.replace(/\D/g, "")}`, icon: <WhatsAppIcon />, label: "WhatsApp", color: "#25D366" } : null,
              m.wechat ? { href: `weixin://dl/chat?${m.wechat}`, icon: <WeChatIcon />, label: "WeChat", color: "#07C160" } : null,
              m.facebook ? { href: m.facebook, icon: <FacebookIcon />, label: "Facebook", color: "#1877F2" } : null,
              m.email ? { href: `mailto:${m.email}`, icon: <EmailIcon />, label: "Email", color: "#cd9e66" } : null,
            ].filter(Boolean);

            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(10,22,40,0.15)" }}
                className="bg-white rounded-2xl overflow-hidden flex flex-col text-center transition-shadow"
                style={{ boxShadow: "0 6px 20px rgba(10,22,40,0.06)" }}
              >
                {/* Photo with gradient background */}
                <div className="relative overflow-hidden" style={{ background: GRADIENTS[i % GRADIENTS.length], height: "260px" }}>
                  {m.image ? (
                    <img
                      src={m.image}
                      alt={name}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: "center 15%" }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {m.emoji || "👤"}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="px-5 pt-5 pb-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg mb-1"
                    style={{ color: "#142848", fontFamily: "var(--font-playfair, serif)" }}>
                    {name}
                  </h3>
                  <p className="text-sm italic leading-relaxed mb-4 flex-1" style={{ color: "#6b7280" }}>
                    {desc}
                  </p>

                  <div className="pt-4" style={{ borderTop: "1px solid rgba(20,40,72,0.08)" }}>
                    <p className="font-bold text-sm tracking-wide mb-3" style={{ color: "#142848" }}>{role}</p>

                    {socialLinks.length > 0 && (
                      <div className="flex items-center justify-center gap-3">
                        {socialLinks.map((link) => link && (
                          <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                            aria-label={link.label}
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                            style={{ background: `${link.color}18`, color: link.color, border: `1px solid ${link.color}30` }}
                          >
                            {link.icon}
                          </a>
                        ))}
                      </div>
                    )}
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
