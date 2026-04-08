"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/data";
import { CATEGORIES } from "@/lib/constants";
import { Save, ArrowLeft, Image } from "lucide-react";

const LANGS = ["en", "ru", "zh", "tr"] as const;
const LANG_LABELS = { en: "English", ru: "Русский", zh: "中文", tr: "Türkçe" };

type FormData = {
  name: Record<string, string>;
  description: Record<string, string>;
  price: string;
  category: string;
  image: string;
};

interface Props {
  initial?: Product;
}

export default function ProductForm({ initial }: Props) {
  const router = useRouter();
  const [activeLang, setActiveLang] = useState<"en" | "ru" | "zh" | "tr">("en");
  const [form, setForm] = useState<FormData>({
    name: initial?.name || { en: "", ru: "", zh: "", tr: "" },
    description: initial?.description || { en: "", ru: "", zh: "", tr: "" },
    price: initial?.price || "Contact for pricing",
    category: initial?.category || "oil-petroleum",
    image: initial?.image || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const url = initial ? `/api/products/${initial.id}` : "/api/products";
      const method = initial ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <a href="/admin/products" className="flex items-center gap-1 text-white/50 hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} />
          Products
        </a>
        <span className="text-white/20">/</span>
        <h1 className="text-xl font-bold text-white">{initial ? "Edit Product" : "Add New Product"}</h1>
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
              <label className="block text-xs text-white/50 mb-1.5">Product Name ({LANG_LABELS[activeLang]})</label>
              <input
                className="form-input"
                value={form.name[activeLang] || ""}
                onChange={(e) => setForm({ ...form, name: { ...form.name, [activeLang]: e.target.value } })}
                placeholder={`Product name in ${LANG_LABELS[activeLang]}`}
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Description ({LANG_LABELS[activeLang]})</label>
              <textarea
                className="form-input resize-none"
                rows={4}
                value={form.description[activeLang] || ""}
                onChange={(e) => setForm({ ...form, description: { ...form.description, [activeLang]: e.target.value } })}
                placeholder={`Description in ${LANG_LABELS[activeLang]}`}
              />
            </div>
          </div>
        </div>

        {/* Product details */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: "#0d1f35", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h3 className="text-white font-semibold text-sm mb-2">Product Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Category</label>
              <select
                className="form-input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} style={{ background: "#0d1f35" }}>
                    {cat.id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Price / Terms</label>
              <input
                className="form-input"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="e.g. Contact for pricing"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Image URL</label>
            <div className="flex gap-2">
              <input
                className="form-input flex-1"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://images.unsplash.com/photo-...?w=800"
              />
              {form.image && (
                <img src={form.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
              )}
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)", color: "#0a1628" }}
          >
            <Save size={15} />
            {saving ? "Saving..." : "Save Product"}
          </button>
          <a
            href="/admin/products"
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
