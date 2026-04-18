import { getCertificates } from "@/lib/data";
import { Plus, Pencil, FileText } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";

const CATEGORY_LABELS: Record<string, string> = {
  certificate: "Сертификат",
  license: "Лицензия",
  document: "Документ",
  standard: "Стандарт",
  other: "Прочее",
};

export default async function CertificatesAdminPage() {
  const certs = await getCertificates();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Сертификаты и документы</h1>
          <p className="text-white/50 text-sm mt-1">{certs.length} документов</p>
        </div>
        <a href="/admin/certificates/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)", color: "#0f2040" }}>
          <Plus size={16} />
          Добавить документ
        </a>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: "#142848", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Документ</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40 hidden sm:table-cell">Категория</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40 hidden md:table-cell">Порядок</th>
              <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Действия</th>
            </tr>
          </thead>
          <tbody>
            {certs.map((cert, i) => (
              <tr key={cert.id} style={{ background: i % 2 === 0 ? "#0f2040" : "#122444", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {cert.coverImage ? (
                      <img src={cert.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(205,158,102,0.15)" }}>
                        <FileText size={16} style={{ color: "#cd9e66" }} />
                      </div>
                    )}
                    <div>
                      <p className="text-white text-sm font-medium">{cert.title.ru || cert.title.en}</p>
                      {cert.fileUrl && <p className="text-white/30 text-xs truncate max-w-xs">{cert.fileUrl}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="px-2 py-1 rounded text-xs" style={{ background: "rgba(205,158,102,0.15)", color: "#cd9e66" }}>
                    {CATEGORY_LABELS[cert.category] || cert.category}
                  </span>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-white/50 text-sm">{cert.order}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a href={`/admin/certificates/${cert.id}`}
                      className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                      style={{ color: "#cd9e66" }}>
                      <Pencil size={14} />
                    </a>
                    <DeleteButton id={cert.id} type="certificates" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {certs.length === 0 && (
          <div className="py-16 text-center text-white/30">
            <FileText size={32} className="mx-auto mb-3 opacity-30" />
            <p>Документов пока нет. <a href="/admin/certificates/new" style={{ color: "#cd9e66" }}>Добавить →</a></p>
          </div>
        )}
      </div>
    </div>
  );
}
