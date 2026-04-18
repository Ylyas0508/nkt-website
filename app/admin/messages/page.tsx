import { getContactMessages } from "@/lib/data";
import { Mail, Phone, Calendar, CheckCircle2 } from "lucide-react";
import DeleteButton from "@/components/admin/DeleteButton";
import MarkReadButton from "@/components/admin/MarkReadButton";

export default async function MessagesPage() {
  const messages = await getContactMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Сообщения</h1>
        <p className="text-white/50 text-sm mt-1">
          {messages.length} всего · <span style={{ color: "#cd9e66" }}>{unread} непрочитанных</span>
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="py-16 text-center text-white/30 rounded-xl" style={{ background: "#142848", border: "1px solid rgba(255,255,255,0.07)" }}>
          <Mail size={32} className="mx-auto mb-3 opacity-30" />
          <p>Сообщений пока нет.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.slice().reverse().map((msg) => (
            <div
              key={msg.id}
              className="rounded-xl p-5"
              style={{
                background: msg.read ? "#0f2040" : "#142848",
                border: `1px solid ${msg.read ? "rgba(255,255,255,0.05)" : "rgba(205,158,102,0.25)"}`,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#cd9e66" }} />
                    )}
                    <p className="text-white font-semibold text-sm">{msg.name}</p>
                    <span className="text-white/30 text-xs">·</span>
                    <a href={`mailto:${msg.email}`} className="text-xs hover:text-white transition-colors" style={{ color: "#cd9e66" }}>
                      {msg.email}
                    </a>
                  </div>
                  {msg.phone && (
                    <div className="flex items-center gap-1 text-white/40 text-xs mb-2">
                      <Phone size={10} />
                      {msg.phone}
                    </div>
                  )}
                  {msg.subject && (
                    <p className="text-white/70 text-sm font-medium mb-1">{msg.subject}</p>
                  )}
                  <p className="text-white/50 text-sm leading-relaxed">{msg.message}</p>
                  <div className="flex items-center gap-1 text-white/30 text-xs mt-3">
                    <Calendar size={10} />
                    {new Date(msg.createdAt).toLocaleString("en-GB")}
                    {msg.read && (
                      <span className="ml-2 flex items-center gap-1 text-white/20">
                        <CheckCircle2 size={10} /> Прочитано
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!msg.read && <MarkReadButton id={msg.id} />}
                  <DeleteButton id={msg.id} type="messages" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
