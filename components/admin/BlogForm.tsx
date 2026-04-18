"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BlogPost } from "@/lib/data";
import { Save, ArrowLeft } from "lucide-react";
import ImageUpload from "./ImageUpload";

const LANGS = ["en", "ru", "zh", "tr"] as const;
const LANG_LABELS = { en: "English", ru: "Русский", zh: "中文", tr: "Türkçe" };

const CATEGORIES = ["deals", "news", "market", "announcement"];

type FormData = {
  title: Record<string, string>;
  excerpt: Record<string, string>;
  content: Record<string, string>;
  image: string;
  date: string;
  category: string;
};

export default function BlogForm({ initial }: { initial?: BlogPost }) {
  const router = useRouter();
  const [activeLang, setActiveLang] = useState<"en" | "ru" | "zh" | "tr">("en");
  const [form, setForm] = useState<FormData>({
    title: initial?.title || { en: "", ru: "", zh: "", tr: "" },
    excerpt: initial?.excerpt || { en: "", ru: "", zh: "", tr: "" },
    content: initial?.content || { en: "", ru: "", zh: "", tr: "" },
    image: initial?.image || "",
    date: initial?.date || new Date().toISOString().split("T")[0],
    category: initial?.category || "news",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const url = initial ? `/api/blog/${initial.id}` : "/api/blog";
      const method = initial ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  const setField = (field: keyof FormData, value: string) =>
    setForm({ ...form, [field]: value });
  const setLangField = (field: "title" | "excerpt" | "content", value: string) =>
    setForm({ ...form, [field]: { ...(form[field] as Record<string, string>), [activeLang]: value } });

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <a href="/admin/blog" className="flex items-center gap-1 text-white/50 hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} />
          Blog Posts
        </a>
        <span className="text-white/20">/</span>
        <h1 className="text-xl font-bold text-white">{initial ? "Edit Post" : "New Blog Post"}</h1>
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
                  background: activeLang === lang ? "#14b8a6" : "transparent",
                  color: activeLang === lang ? "#0a1628" : "rgba(255,255,255,0.5)",
                }}
              >
                {LANG_LABELS[lang]}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Title ({LANG_LABELS[activeLang]})</label>
              <input
                className="form-input"
                value={(form.title as Record<string, string>)[activeLang] || ""}
                onChange={(e) => setLangField("title", e.target.value)}
                placeholder={`Post title in ${LANG_LABELS[activeLang]}`}
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Excerpt ({LANG_LABELS[activeLang]})</label>
              <textarea
                className="form-input resize-none"
                rows={2}
                value={(form.excerpt as Record<string, string>)[activeLang] || ""}
                onChange={(e) => setLangField("excerpt", e.target.value)}
                placeholder="Short summary..."
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Content ({LANG_LABELS[activeLang]})</label>
              <textarea
                className="form-input resize-none"
                rows={10}
                value={(form.content as Record<string, string>)[activeLang] || ""}
                onChange={(e) => setLangField("content", e.target.value)}
                placeholder="Full article content..."
              />
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: "#0d1f35", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h3 className="text-white font-semibold text-sm">Post Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Category</label>
              <select
                className="form-input"
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} style={{ background: "#0d1f35" }}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Date</label>
              <input
                type="date"
                className="form-input"
                value={form.date}
                onChange={(e) => setField("date", e.target.value)}
              />
            </div>
          </div>
          <ImageUpload
            value={form.image}
            onChange={(url) => setField("image", url)}
            label="Cover Image"
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #14b8a6, #2dd4bf)", color: "#0a1628" }}
          >
            <Save size={15} />
            {saving ? "Saving..." : "Save Post"}
          </button>
          <a
            href="/admin/blog"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
}
