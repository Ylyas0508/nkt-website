"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { COMPANY } from "@/lib/constants";
import { MapPin, Mail, MessageCircle, Phone, CheckCircle2, Send } from "lucide-react";

export default function ContactSection() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      // fallback to mailto
      const body = encodeURIComponent(
        `Name: ${form.name}\nPhone: ${form.phone}\nSubject: ${form.subject}\n\n${form.message}`
      );
      window.open(`mailto:${COMPANY.email}?subject=${encodeURIComponent(form.subject || "Inquiry")}&body=${body}`);
      setStatus("done");
    }
  };

  return (
    <section id="contact" className="py-24" style={{ background: "#0f2040" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-14">
          <SectionHeading
            title={t("contact.title")}
            subtitle={t("contact.subtitle")}
            centered
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact form (3 cols) */}
          <AnimatedSection variant="fade-left" className="lg:col-span-3">
            <div
              className="rounded-2xl p-8"
              style={{ background: "#142848", border: "1px solid rgba(205,158,102,0.15)" }}
            >
              {status === "done" ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <CheckCircle2 size={48} style={{ color: "#cd9e66" }} />
                  <p className="text-white font-semibold text-lg">{t("contact.form.success")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">{t("contact.form.name")}</label>
                      <input
                        className="form-input"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={t("contact.form.name")}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">{t("contact.form.email")}</label>
                      <input
                        type="email"
                        className="form-input"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder={t("contact.form.email")}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">{t("contact.form.phone")}</label>
                      <input
                        className="form-input"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">{t("contact.form.subject")}</label>
                      <input
                        className="form-input"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder={t("contact.form.subject")}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">{t("contact.form.message")}</label>
                    <textarea
                      className="form-input resize-none"
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={t("contact.form.message")}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all hover:brightness-110"
                    style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)", color: "#0f2040" }}
                  >
                    <Send size={15} />
                    {status === "sending" ? t("contact.form.sending") : t("contact.form.submit")}
                  </button>
                </form>
              )}
            </div>
          </AnimatedSection>

          {/* Map + info (2 cols) */}
          <AnimatedSection variant="fade-right" delay={0.2} className="lg:col-span-2 flex flex-col gap-6">
            {/* Google Map */}
            <div className="rounded-2xl overflow-hidden flex-1 min-h-64" style={{ border: "1px solid rgba(205,158,102,0.2)" }}>
              <iframe
                src="https://maps.google.com/maps?q=22.838611,108.303806&z=17&output=embed&hl=en&markers=color:red%7C22.838611,108.303806"
                width="100%"
                height="260"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Nanning Kazan Trading Location"
              />
            </div>

            {/* Contact info */}
            <div
              className="rounded-2xl p-6 space-y-4"
              style={{ background: "#142848", border: "1px solid rgba(205,158,102,0.15)" }}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(205,158,102,0.15)" }}>
                  <MapPin size={15} style={{ color: "#cd9e66" }} />
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-0.5">{t("contact.info.address")}</p>
                  <p className="text-sm text-white/80 leading-snug">{COMPANY.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(205,158,102,0.15)" }}>
                  <Mail size={15} style={{ color: "#cd9e66" }} />
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-0.5">{t("contact.info.email")}</p>
                  <a href={`mailto:${COMPANY.email}`} className="text-sm text-white/80 hover:text-white transition-colors">
                    {COMPANY.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(37,211,102,0.15)" }}>
                  <MessageCircle size={15} style={{ color: "#25D366" }} />
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-0.5">{t("contact.info.whatsapp")}</p>
                  <a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-white/80 hover:text-white transition-colors">
                    +{COMPANY.whatsapp}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(205,158,102,0.15)" }}>
                  <Phone size={15} style={{ color: "#cd9e66" }} />
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-0.5">{t("contact.info.wechat")}</p>
                  <p className="text-sm text-white/80">{COMPANY.wechat}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
