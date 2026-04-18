"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TeamMember } from "@/lib/data";
import { Save, ArrowLeft } from "lucide-react";
import ImageUpload from "./ImageUpload";

const LANGS = ["en", "ru", "zh", "tr"] as const;
const LANG_LABELS: Record<string, string> = { en: "English", ru: "Русский", zh: "中文", tr: "Türkçe" };

interface FormData {
  name: Record<string, string>;
  role: Record<string, string>;
  description: Record<string, string>;
  image: string;
  emoji: string;
  order: number;
  whatsapp: string;
  wechat: string;
  facebook: string;
  email: string;
}

interface Props {
  initial?: TeamMember;
}

export default function TeamForm({ initial }: Props) {
  const router = useRouter();
  const [activeLang, setActiveLang] = useState<"en" | "ru" | "zh" | "tr">("en");
  const [form, setForm] = useState<FormData>({
    name: initial?.name || { en: "", ru: "", zh: "", tr: "" },
    role: initial?.role || { en: "", ru: "", zh: "", tr: "" },
    description: initial?.description || { en: "", ru: "", zh: "", tr: "" },
    image: initial?.image || "",
    emoji: initial?.emoji || "",
    order: initial?.order ?? 0,
    whatsapp: initial?.whatsapp || "",
    wechat: initial?.wechat || "",
    facebook: initial?.facebook || "",
    email: initial?.email || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!form.name.en) { setError("Имя на английском обязательно"); return; }
    setSaving(true);
    setError("");
    try {
      const url = initial ? `/api/team/${initial.id}` : "/api/team";
      const method = initial ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      router.push("/admin/team");
      router.refresh();
    } catch {
      setError("Failed to save. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <a href="/admin/team" className="flex items-center gap-1 text-white/50 hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} />
          Команда
        </a>
        <span className="text-white/20">/</span>
        <h1 className="text-xl font-bold text-white">{initial ? "Редактировать сотрудника" : "Добавить сотрудника"}</h1>
      </div>

      <div className="space-y-6">
        {/* Language tabs */}
        <div className="rounded-xl p-6" style={{ background: "#0d1f35", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex gap-1 mb-5 p-1 rounded-lg w-fit" style={{ background: "#0a1628" }}>
            {LANGS.map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                style={{
                  background: activeLang === lang ? "#cd9e66" : "transparent",
                  color: activeLang === lang ? "#0a1628" : "rgba(255,255,255,0.5)",
                }}
              >
                {LANG_LABELS[lang]}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Имя ({LANG_LABELS[activeLang]})</label>
              <input
                className="form-input"
                value={form.name[activeLang] || ""}
                onChange={(e) => setForm({ ...form, name: { ...form.name, [activeLang]: e.target.value } })}
                placeholder={`Имя на ${LANG_LABELS[activeLang]}`}
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Должность ({LANG_LABELS[activeLang]})</label>
              <input
                className="form-input"
                value={form.role[activeLang] || ""}
                onChange={(e) => setForm({ ...form, role: { ...form.role, [activeLang]: e.target.value } })}
                placeholder={`Должность на ${LANG_LABELS[activeLang]}`}
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Описание ({LANG_LABELS[activeLang]})</label>
              <textarea
                className="form-input resize-none"
                rows={3}
                value={form.description[activeLang] || ""}
                onChange={(e) => setForm({ ...form, description: { ...form.description, [activeLang]: e.target.value } })}
                placeholder={`Краткое описание на ${LANG_LABELS[activeLang]}`}
              />
            </div>
          </div>
        </div>

        {/* Visual details */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: "#0d1f35", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h3 className="text-white font-semibold text-sm">Данные профиля</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Эмодзи (необязательно)</label>
              <input
                className="form-input"
                value={form.emoji}
                onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                placeholder="👔"
                maxLength={4}
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Порядок отображения</label>
              <input
                type="number"
                className="form-input"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                placeholder="1"
              />
            </div>
          </div>
          <ImageUpload
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            label="Фото сотрудника"
          />
        </div>

        {/* Social links */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: "#0d1f35", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h3 className="text-white font-semibold text-sm">Социальные сети</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">WhatsApp (номер с кодом)</label>
              <input className="form-input" value={form.whatsapp || ""}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="+905380390593" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">WeChat ID</label>
              <input className="form-input" value={form.wechat || ""}
                onChange={(e) => setForm({ ...form, wechat: e.target.value })}
                placeholder="wechat_id" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Facebook (ссылка)</label>
              <input className="form-input" value={form.facebook || ""}
                onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Email</label>
              <input className="form-input" value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@company.com" />
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)", color: "#0a1628" }}
          >
            <Save size={15} />
            {saving ? "Сохранение..." : "Сохранить сотрудника"}
          </button>
          <a
            href="/admin/team"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            Отмена
          </a>
        </div>
      </div>
    </div>
  );
}
