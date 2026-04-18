"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import ImageUpload from "./ImageUpload";

const LANGS = ["en", "ru", "zh", "tr"] as const;
const LANG_LABELS: Record<string, string> = { en: "English", ru: "Русский", zh: "中文", tr: "Türkçe" };
const ICONS = ["Fuel", "FlaskConical", "Hammer", "Wheat", "Shirt", "Car", "Cog", "Atom", "Package", "Globe", "Truck", "Zap", "Factory", "Layers"];

type LangMap = Record<string, string>;

interface FormData {
  name: LangMap;
  description: LangMap;
  image: string;
  color: string;
  icon: string;
}

interface CategoryData extends FormData {
  id: string;
  isCustom?: boolean;
  tKey?: string;
}

interface Props {
  initial?: CategoryData;
  isDefault?: boolean; // true for the 9 default categories (they use tKey)
}

export default function CategoryForm({ initial, isDefault }: Props) {
  const router = useRouter();
  const [activeLang, setActiveLang] = useState<"en" | "ru" | "zh" | "tr">("en");
  const [form, setForm] = useState<FormData>({
    name: (initial?.name && typeof initial.name === "object") ? initial.name : { en: (typeof initial?.name === "string" ? initial.name : ""), ru: "", zh: "", tr: "" },
    description: initial?.description || { en: "", ru: "", zh: "", tr: "" },
    image: initial?.image || "",
    color: initial?.color || "#cd9e66",
    icon: initial?.icon || "Package",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!form.name.en) { setError("Название на английском обязательно"); return; }
    setSaving(true);
    setError("");
    try {
      if (initial?.id) {
        const res = await fetch(`/api/categories/${initial.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error();
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, isCustom: true }),
        });
        if (!res.ok) throw new Error();
      }
      router.push("/admin/categories");
      router.refresh();
    } catch {
      setError("Failed to save. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <a href="/admin/categories" className="flex items-center gap-1 text-white/50 hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} />
          Категории
        </a>
        <span className="text-white/20">/</span>
        <h1 className="text-xl font-bold text-white">{initial ? "Редактировать категорию" : "Добавить категорию"}</h1>
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
              <label className="block text-xs text-white/50 mb-1.5">Название категории ({LANG_LABELS[activeLang]})</label>
              <input
                className="form-input"
                value={form.name[activeLang] || ""}
                onChange={(e) => setForm({ ...form, name: { ...form.name, [activeLang]: e.target.value } })}
                placeholder={`Название на ${LANG_LABELS[activeLang]}`}
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
          {isDefault && (
            <p className="mt-3 text-xs text-white/30">Примечание: редактирование названия и описания здесь перезапишет стандартные переводы этой категории на сайте.</p>
          )}
        </div>

        {/* Visual details */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: "#0d1f35", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h3 className="text-white font-semibold text-sm">Оформление</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Цвет акцента</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="w-10 h-9 rounded cursor-pointer border-0 bg-transparent"
                />
                <input
                  className="form-input flex-1"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  placeholder="#cd9e66"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Иконка</label>
              <select
                className="form-input"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              >
                {ICONS.map((icon) => (
                  <option key={icon} value={icon} style={{ background: "#0d1f35" }}>{icon}</option>
                ))}
              </select>
            </div>
          </div>
          <ImageUpload
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            label="Фото категории"
          />
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
            {saving ? "Сохранение..." : "Сохранить категорию"}
          </button>
          <a
            href="/admin/categories"
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
