"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Certificate } from "@/lib/data";
import { Save, ArrowLeft } from "lucide-react";
import ImageUpload from "./ImageUpload";
import DocumentUpload from "./DocumentUpload";

const LANGS = ["en", "ru", "zh", "tr"] as const;
const LANG_LABELS: Record<string, string> = { en: "English", ru: "Русский", zh: "中文", tr: "Türkçe" };
const CATEGORIES = ["certificate", "license", "document", "standard", "other"];

interface FormData {
  title: Record<string, string>;
  description: Record<string, string>;
  fileUrl: string;
  coverImage: string;
  category: string;
  order: number;
}

export default function CertificateForm({ initial }: { initial?: Certificate }) {
  const router = useRouter();
  const [activeLang, setActiveLang] = useState<"en" | "ru" | "zh" | "tr">("ru");
  const [form, setForm] = useState<FormData>({
    title: initial?.title || { en: "", ru: "", zh: "", tr: "" },
    description: initial?.description || { en: "", ru: "", zh: "", tr: "" },
    fileUrl: initial?.fileUrl || "",
    coverImage: initial?.coverImage || "",
    category: initial?.category || "certificate",
    order: initial?.order ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!form.title.ru && !form.title.en) { setError("Введите название"); return; }
    setSaving(true);
    setError("");
    try {
      const url = initial ? `/api/certificates/${initial.id}` : "/api/certificates";
      const method = initial ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      router.push("/admin/certificates");
      router.refresh();
    } catch {
      setError("Ошибка сохранения. Попробуйте ещё раз.");
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <a href="/admin/certificates" className="flex items-center gap-1 text-white/50 hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} />
          Сертификаты
        </a>
        <span className="text-white/20">/</span>
        <h1 className="text-xl font-bold text-white">{initial ? "Редактировать документ" : "Добавить документ"}</h1>
      </div>

      <div className="space-y-6">
        {/* Language tabs */}
        <div className="rounded-xl p-6" style={{ background: "#0d1f35", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex gap-1 mb-5 p-1 rounded-lg w-fit" style={{ background: "#0a1628" }}>
            {LANGS.map((lang) => (
              <button key={lang} onClick={() => setActiveLang(lang)}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                style={{ background: activeLang === lang ? "#cd9e66" : "transparent", color: activeLang === lang ? "#0a1628" : "rgba(255,255,255,0.5)" }}>
                {LANG_LABELS[lang]}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Название ({LANG_LABELS[activeLang]})</label>
              <input className="form-input" value={form.title[activeLang] || ""}
                onChange={(e) => setForm({ ...form, title: { ...form.title, [activeLang]: e.target.value } })}
                placeholder={`Название на ${LANG_LABELS[activeLang]}`} />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Описание ({LANG_LABELS[activeLang]})</label>
              <textarea className="form-input resize-none" rows={2}
                value={form.description[activeLang] || ""}
                onChange={(e) => setForm({ ...form, description: { ...form.description, [activeLang]: e.target.value } })}
                placeholder={`Описание на ${LANG_LABELS[activeLang]}`} />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: "#0d1f35", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h3 className="text-white font-semibold text-sm">Параметры документа</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Категория</label>
              <select className="form-input" value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c} style={{ background: "#0d1f35" }}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Порядок отображения</label>
              <input type="number" className="form-input" value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </div>
          </div>

          <DocumentUpload
            value={form.fileUrl}
            onChange={(url) => setForm({ ...form, fileUrl: url })}
            label="Файл документа (PDF, DOC, DOCX, JPG, PNG)"
          />

          <ImageUpload value={form.coverImage}
            onChange={(url) => setForm({ ...form, coverImage: url })}
            label="Обложка / превью документа" />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)", color: "#0a1628" }}>
            <Save size={15} />
            {saving ? "Сохранение..." : "Сохранить документ"}
          </button>
          <a href="/admin/certificates"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.05)" }}>
            Отмена
          </a>
        </div>
      </div>
    </div>
  );
}
