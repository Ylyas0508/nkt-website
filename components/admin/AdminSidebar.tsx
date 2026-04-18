"use client";

import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Package, Newspaper, LogOut, ExternalLink, Layers, Settings, Inbox, Users } from "lucide-react";

const links = [
  { href: "/admin", label: "Главная", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Товары", icon: Package },
  { href: "/admin/blog", label: "Блог", icon: Newspaper },
  { href: "/admin/categories", label: "Категории", icon: Layers },
  { href: "/admin/team", label: "Команда", icon: Users },
  { href: "/admin/messages", label: "Сообщения", icon: Inbox },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-64 min-h-screen flex flex-col" style={{ background: "#0f2039", borderRight: "1px solid rgba(205,158,102,0.15)" }}>
      {/* Header */}
      <div className="p-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)", color: "#0a1628" }}>
            NKT
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Панель управления</p>
            <p className="text-xs" style={{ color: "#cd9e66" }}>Nanning Kazan</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <a
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: active ? "rgba(205,158,102,0.15)" : "transparent",
                color: active ? "#cd9e66" : "rgba(255,255,255,0.6)",
                border: active ? "1px solid rgba(205,158,102,0.25)" : "1px solid transparent",
              }}
            >
              <Icon size={16} />
              {label}
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white transition-colors"
        >
          <ExternalLink size={14} />
          Перейти на сайт
        </a>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={14} />
          Выйти
        </button>
      </div>
    </aside>
  );
}
