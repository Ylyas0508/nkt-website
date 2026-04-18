import { getTeamMembers } from "@/lib/data";
import { Plus, Pencil } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function TeamAdminPage() {
  const members = await getTeamMembers();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Команда</h1>
          <p className="text-white/50 text-sm mt-1">{members.length} сотрудников</p>
        </div>
        <a
          href="/admin/team/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)", color: "#0f2040" }}
        >
          <Plus size={16} />
          Добавить сотрудника
        </a>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#142848", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Фото</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Имя</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40 hidden sm:table-cell">Порядок</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Действия</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr
                key={m.id}
                style={{
                  background: i % 2 === 0 ? "#0f2040" : "#122444",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <td className="px-4 py-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center" style={{ background: "rgba(205,158,102,0.15)" }}>
                    {m.image ? (
                      <img src={m.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg">{m.emoji || "👤"}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-white text-sm font-medium">{m.name.en}</p>
                  <p className="text-white/40 text-xs">{m.role.en}</p>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-white/50 text-sm">{m.order}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/admin/team/${m.id}`}
                      className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                      style={{ color: "#cd9e66" }}
                    >
                      <Pencil size={14} />
                    </a>
                    <DeleteButton id={m.id} type="team" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && (
          <div className="py-16 text-center text-white/30">
            <p>Сотрудников пока нет. <a href="/admin/team/new" style={{ color: "#cd9e66" }}>Добавить →</a></p>
          </div>
        )}
      </div>
    </div>
  );
}
