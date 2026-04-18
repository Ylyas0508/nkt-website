import { getCategoryOverrides } from "@/lib/data";
import { CATEGORIES } from "@/lib/constants";
import { Plus, Pencil } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";

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

export default async function CategoriesAdminPage() {
  const overrides = await getCategoryOverrides();
  const overrideMap = new Map(overrides.map((o) => [o.id, o]));

  // Merge defaults with overrides
  const allCategories = [
    ...CATEGORIES.map((cat) => {
      const ov = overrideMap.get(cat.id);
      return ov ? { ...cat, ...ov, isCustom: false } : { ...cat, isCustom: false };
    }),
    ...overrides.filter((o) => o.isCustom),
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Категории</h1>
          <p className="text-white/50 text-sm mt-1">{allCategories.length} категорий всего</p>
        </div>
        <a
          href="/admin/categories/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)", color: "#0f2040" }}
        >
          <Plus size={16} />
          Добавить категорию
        </a>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#142848", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Категория</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40 hidden sm:table-cell">Тип</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40 hidden md:table-cell">Цвет</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Действия</th>
            </tr>
          </thead>
          <tbody>
            {allCategories.map((cat, i) => {
              const name = (cat.name && typeof cat.name === "object")
                ? (cat.name as Record<string, string>).en
                : (typeof cat.name === "string" ? cat.name : CATEGORY_LABELS[cat.id] || cat.id);
              return (
                <tr
                  key={cat.id}
                  style={{
                    background: i % 2 === 0 ? "#0f2040" : "#122444",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={cat.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div>
                        <p className="text-white text-sm font-medium">{name}</p>
                        <p className="text-white/40 text-xs line-clamp-1">{cat.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="px-2 py-1 rounded text-xs" style={{
                      background: cat.isCustom ? "rgba(20,184,166,0.15)" : "rgba(205,158,102,0.15)",
                      color: cat.isCustom ? "#14b8a6" : "#cd9e66"
                    }}>
                      {cat.isCustom ? "Своя" : "Базовая"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full shrink-0" style={{ background: cat.color }} />
                      <span className="text-white/50 text-xs font-mono">{cat.color}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/admin/categories/${cat.id}`}
                        className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                        style={{ color: "#cd9e66" }}
                      >
                        <Pencil size={14} />
                      </a>
                      {cat.isCustom && (
                        <DeleteButton id={cat.id} type="categories" />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
