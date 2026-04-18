"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { Download, FileText, Award, Shield } from "lucide-react";
import type { Certificate } from "@/lib/data";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  certificate: <Award size={20} />,
  license: <Shield size={20} />,
  document: <FileText size={20} />,
  standard: <Shield size={20} />,
  other: <FileText size={20} />,
};

const CATEGORY_LABELS_RU: Record<string, string> = {
  certificate: "Сертификат",
  license: "Лицензия",
  document: "Документ",
  standard: "Стандарт",
  other: "Прочее",
};

export default function CertificatesSection() {
  const { locale } = useTranslation();
  const [certs, setCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    fetch("/api/certificates").then((r) => r.json()).then(setCerts).catch(() => {});
  }, []);

  if (certs.length === 0) return null;

  return (
    <section id="certificates" className="py-24" style={{ background: "#0a1628" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-14">
          <SectionHeading
            title="Сертификаты и документы"
            subtitle="Наши лицензии, сертификаты соответствия и корпоративные документы — доступны для скачивания."
            centered
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {certs.map((cert, i) => {
            const title = cert.title[locale] || cert.title.ru || cert.title.en;
            const desc = cert.description[locale] || cert.description.ru || cert.description.en;
            const icon = CATEGORY_ICONS[cert.category] || <FileText size={20} />;
            const label = CATEGORY_LABELS_RU[cert.category] || cert.category;

            return (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl overflow-hidden flex flex-col transition-all"
                style={{ background: "#0f2040", border: "1px solid rgba(205,158,102,0.12)" }}
              >
                {/* Cover image or icon placeholder */}
                <div className="relative h-40 overflow-hidden flex items-center justify-center"
                  style={{ background: "rgba(205,158,102,0.06)" }}>
                  {cert.coverImage ? (
                    <img src={cert.coverImage} alt={title}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2" style={{ color: "rgba(205,158,102,0.4)" }}>
                      {icon}
                      <span className="text-xs uppercase tracking-wider">{label}</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(205,158,102,0.15)", color: "#cd9e66", border: "1px solid rgba(205,158,102,0.3)" }}>
                    {label}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-white font-semibold text-sm leading-snug mb-2">{title}</h3>
                  {desc && <p className="text-white/40 text-xs leading-relaxed mb-4 flex-1">{desc}</p>}

                  {cert.fileUrl ? (
                    <a
                      href={cert.fileUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
                      style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)", color: "#0a1628" }}
                    >
                      <Download size={13} />
                      Скачать документ
                    </a>
                  ) : (
                    <div className="mt-auto flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold opacity-30"
                      style={{ background: "rgba(255,255,255,0.05)", color: "white" }}>
                      <FileText size={13} />
                      Файл не загружен
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
