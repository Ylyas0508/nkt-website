import { getProducts } from "@/lib/data";
import { Plus, Pencil } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function ProductsAdminPage() {
  const products = await getProducts();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Товары</h1>
          <p className="text-white/50 text-sm mt-1">{products.length} товаров в каталоге</p>
        </div>
        <a
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)", color: "#0f2040" }}
        >
          <Plus size={16} />
          Добавить товар
        </a>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#142848", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Товар</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40 hidden sm:table-cell">Категория</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40 hidden md:table-cell">Цена</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr
                key={p.id}
                style={{
                  background: i % 2 === 0 ? "#0f2040" : "#122444",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">{p.name.en}</p>
                      <p className="text-white/40 text-xs line-clamp-1">{p.description.en.slice(0, 60)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="px-2 py-1 rounded text-xs capitalize" style={{ background: "rgba(205,158,102,0.15)", color: "#cd9e66" }}>
                    {p.category.replace("-", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-white/50 text-sm">{p.price}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/admin/products/${p.id}`}
                      className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                      style={{ color: "#cd9e66" }}
                    >
                      <Pencil size={14} />
                    </a>
                    <DeleteButton id={p.id} type="products" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="py-16 text-center text-white/30">
            <p>Товаров пока нет. <a href="/admin/products/new" style={{ color: "#cd9e66" }}>Добавить →</a></p>
          </div>
        )}
      </div>
    </div>
  );
}
