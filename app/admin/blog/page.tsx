import { getBlogPosts } from "@/lib/data";
import { Plus, Pencil, Calendar } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function BlogAdminPage() {
  const posts = await getBlogPosts();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-white/50 text-sm mt-1">{posts.length} posts published</p>
        </div>
        <a
          href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "linear-gradient(135deg, #14b8a6, #2dd4bf)", color: "#0a1628" }}
        >
          <Plus size={16} />
          New Post
        </a>
      </div>

      <div className="space-y-3">
        {posts.map((post, i) => (
          <div
            key={post.id}
            className="flex items-center gap-4 p-4 rounded-xl"
            style={{ background: i % 2 === 0 ? "#0a1628" : "#0c1b30", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <img src={post.image} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm line-clamp-1">{post.title.en}</p>
              <p className="text-white/40 text-xs line-clamp-1 mt-0.5">{post.excerpt.en}</p>
              <div className="flex items-center gap-1 mt-1 text-white/30 text-xs">
                <Calendar size={10} />
                {post.date}
                <span className="ml-2 px-1.5 py-0.5 rounded" style={{ background: "rgba(20,184,166,0.15)", color: "#14b8a6" }}>
                  {post.category}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`/admin/blog/${post.id}`}
                className="p-2 rounded-lg transition-colors hover:bg-white/10"
                style={{ color: "#14b8a6" }}
              >
                <Pencil size={14} />
              </a>
              <DeleteButton id={post.id} type="blog" />
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="py-16 text-center text-white/30">
            <p>No posts yet. <a href="/admin/blog/new" style={{ color: "#14b8a6" }}>Write one →</a></p>
          </div>
        )}
      </div>
    </div>
  );
}
