import { getProducts } from "@/lib/data";
import { getBlogPosts } from "@/lib/data";
import { Package, Newspaper, TrendingUp, Globe } from "lucide-react";

export default async function AdminDashboard() {
  const products = await getProducts();
  const posts = await getBlogPosts();

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, color: "#cd9e66", href: "/admin/products" },
    { label: "Blog Posts", value: posts.length, icon: Newspaper, color: "#14b8a6", href: "/admin/blog" },
    { label: "Product Categories", value: 9, icon: TrendingUp, color: "#60a5fa", href: "/admin/products" },
    { label: "Languages", value: 4, icon: Globe, color: "#a78bfa", href: "#" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/50 text-sm mt-1">Welcome to Nanning Kazan Trading admin panel.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <a
            key={label}
            href={href}
            className="rounded-xl p-5 transition-all hover:-translate-y-1"
            style={{ background: "#142848", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-white/50">{label}</p>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{value}</p>
          </a>
        ))}
      </div>

      {/* Recent products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-6" style={{ background: "#142848", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Recent Products</h2>
            <a href="/admin/products" className="text-xs" style={{ color: "#cd9e66" }}>View all →</a>
          </div>
          <div className="space-y-3">
            {products.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center gap-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{p.name.en}</p>
                  <p className="text-white/40 text-xs capitalize">{p.category.replace("-", " ")}</p>
                </div>
                <a href={`/admin/products/${p.id}`} className="text-xs px-2 py-1 rounded" style={{ color: "#cd9e66", background: "rgba(205,158,102,0.1)" }}>
                  Edit
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-6" style={{ background: "#142848", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Recent Blog Posts</h2>
            <a href="/admin/blog" className="text-xs" style={{ color: "#14b8a6" }}>View all →</a>
          </div>
          <div className="space-y-3">
            {posts.slice(0, 4).map((post) => (
              <div key={post.id} className="flex items-center gap-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <img src={post.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{post.title.en}</p>
                  <p className="text-white/40 text-xs">{post.date}</p>
                </div>
                <a href={`/admin/blog/${post.id}`} className="text-xs px-2 py-1 rounded" style={{ color: "#14b8a6", background: "rgba(20,184,166,0.1)" }}>
                  Edit
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
