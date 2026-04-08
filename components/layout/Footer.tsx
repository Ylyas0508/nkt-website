"use client";

import { useTranslation } from "@/lib/i18n";
import { COMPANY } from "@/lib/constants";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "#050e1a", borderTop: "1px solid rgba(205,158,102,0.2)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Company info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="NKT Logo" className="w-14 h-14 object-contain" />
              <div>
                <div className="text-white font-semibold text-sm">Nanning Kazan</div>
                <div className="text-xs" style={{ color: "#cd9e66" }}>Trading Co., Ltd</div>
              </div>
            </div>
            <p className="text-sm text-white/50 mb-2">{COMPANY.nameCn}</p>
            <p className="text-sm text-white/50">{t("footer.tagline")}</p>
            <p className="text-xs text-white/30 mt-4">Reg. No. {COMPANY.registration}</p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: "#cd9e66" }}>
              {t("footer.links")}
            </h4>
            <ul className="space-y-2">
              {["#home", "#about", "#products", "#blog", "#contact"].map((href, i) => (
                <li key={href}>
                  <a href={href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {t(["nav.home", "nav.about", "nav.products", "nav.blog", "nav.contact"][i])}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: "#cd9e66" }}>
              {t("footer.products")}
            </h4>
            <ul className="space-y-2">
              {["oil-petroleum", "chemicals", "metallurgy", "agricultural", "textiles", "automotive"].map((cat) => (
                <li key={cat}>
                  <a href="#products" className="text-sm text-white/50 hover:text-white transition-colors capitalize">
                    {t(`products.${cat === "oil-petroleum" ? "oil" : cat}.name`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: "#cd9e66" }}>
              {t("footer.contact")}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "#cd9e66" }} />
                <span className="text-sm text-white/50">{COMPANY.addressShort}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} style={{ color: "#cd9e66" }} />
                <a href={`mailto:${COMPANY.email}`} className="text-sm text-white/50 hover:text-white transition-colors break-all">
                  {COMPANY.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle size={14} style={{ color: "#25D366" }} />
                <a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-white/50 hover:text-white transition-colors">
                  +{COMPANY.whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} style={{ color: "#cd9e66" }} />
                <span className="text-sm text-white/50">WeChat: {COMPANY.wechat}</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="section-divider mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>© {year} Nanning Kazan Trading Co., Ltd. {t("footer.rights")}</p>
          <p>南宁市卡赞商贸有限公司</p>
        </div>
      </div>
    </footer>
  );
}
