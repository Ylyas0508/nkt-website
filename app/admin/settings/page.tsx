"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const [stats, setStats] = useState({
    years: 5,
    countries: 50,
    deals: 500,
    aboutImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(data => setStats(prev => ({ ...prev, ...data }))).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stats),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Настройки сайта</h1>
        <p className="text-white/50 text-sm mt-1">Редактирование раздела «О нас» и статистики</p>
      </div>

      <div className="max-w-lg space-y-6">
        {/* About Image */}
        <div className="rounded-xl p-6" style={{ background: "#142848", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 className="text-white font-semibold mb-5">Фото раздела «О нас»</h2>
          <div>
            <label className="block text-sm text-white/60 mb-1.5">URL фотографии склада / офиса</label>
            <input
              type="text"
              value={stats.aboutImage}
              onChange={e => setStats(p => ({ ...p, aboutImage: e.target.value }))}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 rounded-lg text-white text-sm bg-white/5 border border-white/10 focus:outline-none focus:border-yellow-500/50"
            />
            {stats.aboutImage && (
              <img
                src={stats.aboutImage}
                alt="Preview"
                className="mt-3 w-full h-36 object-cover rounded-lg opacity-80"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-xl p-6" style={{ background: "#142848", border: "1px solid rgba(255,255,255,0.07)" }}>
          <h2 className="text-white font-semibold mb-5">Статистика раздела «О нас»</h2>
          <div className="space-y-4">
            {[
              { key: "years", label: "Лет на рынке", suffix: "+" },
              { key: "countries", label: "Стран охвата", suffix: "+" },
              { key: "deals", label: "Сделок завершено", suffix: "+" },
            ].map(({ key, label, suffix }) => (
              <div key={key}>
                <label className="block text-sm text-white/60 mb-1.5">{label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={stats[key as keyof typeof stats] as number}
                    onChange={e => setStats(p => ({ ...p, [key]: Number(e.target.value) }))}
                    className="w-32 px-3 py-2 rounded-lg text-white text-sm bg-white/5 border border-white/10 focus:outline-none focus:border-yellow-500/50"
                  />
                  <span className="text-white/40 text-sm">{suffix} отображается на сайте</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)", color: "#0f2040" }}
        >
          <Save size={14} />
          {saved ? "Сохранено!" : saving ? "Сохранение..." : "Сохранить изменения"}
        </button>
      </div>
    </div>
  );
}
