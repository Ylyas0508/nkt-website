"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { Download, FileText, Award, Shield, X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import type { Certificate } from "@/lib/data";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  certificate: <Award size={20} />,
  license: <Shield size={20} />,
  document: <FileText size={20} />,
  standard: <Shield size={20} />,
  other: <FileText size={20} />,
};

interface LightboxState {
  open: boolean;
  index: number;
}

export default function CertificatesSection() {
  const { t, locale } = useTranslation();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [lightbox, setLightbox] = useState<LightboxState>({ open: false, index: 0 });

  // Only certs that have a cover image can be opened in lightbox
  const imageCerts = certs.filter((c) => c.coverImage);

  useEffect(() => {
    fetch("/api/certificates").then((r) => r.json()).then(setCerts).catch(() => {});
  }, []);

  const openLightbox = useCallback((certId: string) => {
    const idx = imageCerts.findIndex((c) => c.id === certId);
    if (idx === -1) return;
    setLightbox({ open: true, index: idx });
  }, [imageCerts]);

  const closeLightbox = useCallback(() => setLightbox((s) => ({ ...s, open: false })), []);

  const prev = useCallback(() =>
    setLightbox((s) => ({ ...s, index: (s.index - 1 + imageCerts.length) % imageCerts.length })),
    [imageCerts.length]
  );

  const next = useCallback(() =>
    setLightbox((s) => ({ ...s, index: (s.index + 1) % imageCerts.length })),
    [imageCerts.length]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!lightbox.open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox.open, closeLightbox, prev, next]);

  if (certs.length === 0) return null;

  const activeCert = imageCerts[lightbox.index];

  return (
    <>
      <section id="certificates" className="py-24" style={{ background: "#0a1628" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-14">
            <SectionHeading
              title={t("certs.title")}
              subtitle={t("certs.subtitle")}
              centered
            />
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {certs.map((cert, i) => {
              const title = cert.title[locale] || cert.title.ru || cert.title.en;
              const desc = cert.description[locale] || cert.description.ru || cert.description.en;
              const icon = CATEGORY_ICONS[cert.category] || <FileText size={20} />;
              const label = t(`certs.cat.${cert.category}`) || cert.category;
              const hasImage = !!cert.coverImage;

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
                  {/* Cover image — clickable to open lightbox */}
                  <div
                    className="relative h-40 overflow-hidden flex items-center justify-center"
                    style={{ background: "rgba(205,158,102,0.06)" }}
                  >
                    {hasImage ? (
                      <>
                        <img
                          src={cert.coverImage}
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Zoom overlay */}
                        <button
                          onClick={() => openLightbox(cert.id)}
                          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-zoom-in"
                          style={{ background: "rgba(10,22,40,0.5)" }}
                          aria-label="Открыть на весь экран"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <ZoomIn size={28} color="white" />
                            <span className="text-white text-xs font-medium">Увеличить</span>
                          </div>
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2" style={{ color: "rgba(205,158,102,0.4)" }}>
                        {icon}
                        <span className="text-xs uppercase tracking-wider">{label}</span>
                      </div>
                    )}
                    <div
                      className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: "rgba(205,158,102,0.15)", color: "#cd9e66", border: "1px solid rgba(205,158,102,0.3)" }}
                    >
                      {label}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-white font-semibold text-sm leading-snug mb-2">{title}</h3>
                    {desc && <p className="text-white/40 text-xs leading-relaxed mb-4 flex-1">{desc}</p>}

                    <div className="mt-auto flex gap-2">
                      {/* Preview button (if image exists) */}
                      {hasImage && (
                        <button
                          onClick={() => openLightbox(cert.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all hover:bg-white/10"
                          style={{ border: "1px solid rgba(205,158,102,0.3)", color: "#cd9e66" }}
                        >
                          <ZoomIn size={12} />
                          Просмотр
                        </button>
                      )}
                      {/* Download button */}
                      {cert.fileUrl ? (
                        <a
                          href={cert.fileUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
                          style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)", color: "#0a1628" }}
                        >
                          <Download size={13} />
                          {t("certs.download")}
                        </a>
                      ) : (
                        <div
                          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold opacity-30"
                          style={{ background: "rgba(255,255,255,0.05)", color: "white" }}
                        >
                          <FileText size={13} />
                          {t("certs.no_file")}
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox.open && activeCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.92)" }}
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.2)", color: "white" }}
              aria-label="Закрыть"
            >
              <X size={20} />
            </button>

            {/* Prev */}
            {imageCerts.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,0.2)", color: "white" }}
                aria-label="Назад"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* Next */}
            {imageCerts.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,0.2)", color: "white" }}
                aria-label="Вперёд"
              >
                <ChevronRight size={22} />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={activeCert.id}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeCert.coverImage}
                alt={activeCert.title[locale] || activeCert.title.ru || activeCert.title.en}
                className="max-h-[75vh] max-w-full rounded-xl object-contain"
                style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.6)" }}
              />
              {/* Caption */}
              <div className="mt-4 text-center">
                <p className="text-white font-semibold text-sm">
                  {activeCert.title[locale] || activeCert.title.ru || activeCert.title.en}
                </p>
                {activeCert.fileUrl && (
                  <a
                    href={activeCert.fileUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 px-5 py-2 rounded-xl text-xs font-semibold transition-all hover:brightness-110"
                    style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)", color: "#0a1628" }}
                  >
                    <Download size={13} />
                    {t("certs.download")}
                  </a>
                )}
                {imageCerts.length > 1 && (
                  <p className="text-white/30 text-xs mt-2">
                    {lightbox.index + 1} / {imageCerts.length}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
