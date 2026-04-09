"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2, X } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

interface Category {
  id: string;
  name?: string;
  image: string;
  color: string;
  tKey?: string;
  isCustom?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  "oil-petroleum": "Oil & Petroleum",
  chemicals: "Chemicals",
  metallurgy: "Metallurgy",
  agricultural: "Agricultural",
  textiles: "Textiles",
  automotive: "Automotive",
  machinery: "Machinery",
  sulfur: "Sulfur",
  other: "Other",
};

export default function CategoriesAdminPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Record<string, { image: string; color: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", image: "", color: "#cd9e66" });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(setCategories);
  }, []);

  const startEdit = (cat: Category) => {
    setEditing(prev => ({ ...prev, [cat.id]: { image: cat.image, color: cat.color } }));
  };

  const saveEdit = async (id: string) => {
    setSaving(id);
    await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing[id]),
    });
    setSaving(null);
    setEditing(prev => { const n = { ...prev }; delete n[id]; return n; });
    const fresh = await fetch("/api/categories").then(r => r.json());
    setCategories(fresh);
  };

  const deleteCustom = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    router.refresh();
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const addCategory = async () => {
    if (!newCat.name || !newCat.image) return;
    setAdding(true);
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newCat, isCustom: true }),
    });
    setAdding(false);
    setShowAdd(false);
    setNewCat({ name: "", image: "", color: "#cd9e66" });
    const fresh = await fetch("/api/categories").then(r => r.json());
    setCategories(fresh);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-white/50 text-sm mt-1">Edit category images and colors</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)", color: "#0f2040" }}
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Add new category form */}
      {showAdd && (
        <div className="mb-6 p-6 rounded-xl" style={{ background: "#142848", border: "1px solid rgba(205,158,102,0.3)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">New Category</h3>
            <button onClick={() => setShowAdd(false)}><X size={16} className="text-white/50" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1">Name</label>
              <input
                value={newCat.name}
                onChange={e => setNewCat(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Electronics"
                className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-yellow-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Image URL</label>
              <input
                value={newCat.image}
                onChange={e => setNewCat(p => ({ ...p, image: e.target.value }))}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-yellow-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Color</label>
              <div className="flex gap-2">
                <input type="color" value={newCat.color} onChange={e => setNewCat(p => ({ ...p, color: e.target.value }))}
                  className="w-10 h-9 rounded cursor-pointer bg-transparent border-0" />
                <input value={newCat.color} onChange={e => setNewCat(p => ({ ...p, color: e.target.value }))}
                  className="flex-1 px-3 py-2 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:outline-none" />
              </div>
            </div>
          </div>
          <button
            onClick={addCategory}
            disabled={adding}
            className="mt-4 px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)", color: "#0f2040" }}
          >
            {adding ? "Adding..." : "Add Category"}
          </button>
        </div>
      )}

      {/* Category list */}
      <div className="space-y-3">
        {categories.map((cat) => {
          const isEditing = !!editing[cat.id];
          const label = cat.name || CATEGORY_LABELS[cat.id] || cat.id;
          return (
            <div
              key={cat.id}
              className="rounded-xl p-4"
              style={{ background: "#142848", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-4">
                <img
                  src={isEditing ? editing[cat.id].image : cat.image}
                  alt={label}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1494412574643-ff11b0a5eb19?w=200&q=60"; }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: isEditing ? editing[cat.id].color : cat.color }} />
                    <p className="text-white font-medium">{label}</p>
                    {cat.isCustom && (
                      <span className="px-1.5 py-0.5 text-xs rounded" style={{ background: "rgba(205,158,102,0.15)", color: "#cd9e66" }}>Custom</span>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="flex gap-3 flex-wrap">
                      <div className="flex-1 min-w-48">
                        <label className="block text-xs text-white/40 mb-1">Image URL</label>
                        <input
                          value={editing[cat.id].image}
                          onChange={e => setEditing(p => ({ ...p, [cat.id]: { ...p[cat.id], image: e.target.value } }))}
                          className="w-full px-3 py-1.5 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:border-yellow-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/40 mb-1">Color</label>
                        <div className="flex gap-2">
                          <input type="color" value={editing[cat.id].color}
                            onChange={e => setEditing(p => ({ ...p, [cat.id]: { ...p[cat.id], color: e.target.value } }))}
                            className="w-9 h-8 rounded cursor-pointer bg-transparent border-0" />
                          <input value={editing[cat.id].color}
                            onChange={e => setEditing(p => ({ ...p, [cat.id]: { ...p[cat.id], color: e.target.value } }))}
                            className="w-24 px-2 py-1.5 rounded-lg text-sm text-white bg-white/5 border border-white/10 focus:outline-none" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-white/40 text-xs truncate">{cat.image}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(cat.id)}
                        disabled={saving === cat.id}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:brightness-110 disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)", color: "#0f2040" }}
                      >
                        <Save size={12} /> {saving === cat.id ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setEditing(p => { const n = { ...p }; delete n[cat.id]; return n; })}
                        className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(cat)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-white/10"
                      style={{ color: "#cd9e66" }}
                    >
                      Edit
                    </button>
                  )}
                  {cat.isCustom && (
                    <button
                      onClick={() => deleteCustom(cat.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
