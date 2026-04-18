"use client";

import { useRef, useState } from "react";
import { Upload, Link as LinkIcon, X, Loader2, FileText, FileCheck } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

const ACCEPTED = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

function getFileLabel(url: string): string {
  if (!url) return "";
  try {
    const parts = new URL(url).pathname.split("/");
    return decodeURIComponent(parts[parts.length - 1]);
  } catch {
    return url.split("/").pop() || url;
  }
}

function FileExtBadge({ url }: { url: string }) {
  const name = getFileLabel(url).toLowerCase();
  const ext = name.split(".").pop() || "";
  const colors: Record<string, string> = {
    pdf: "#ef4444",
    doc: "#3b82f6",
    docx: "#3b82f6",
    jpg: "#10b981",
    jpeg: "#10b981",
    png: "#10b981",
  };
  const color = colors[ext] || "#cd9e66";
  return (
    <span className="px-1.5 py-0.5 rounded text-xs font-bold uppercase"
      style={{ background: `${color}20`, color }}>
      {ext || "file"}
    </span>
  );
}

export default function DocumentUpload({ value, onChange, label = "Файл документа" }: Props) {
  const [mode, setMode] = useState<"upload" | "url">(value && !value.startsWith("/uploads") ? "url" : "upload");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        throw new Error("Поддерживаются только PDF, DOC, DOCX, JPG, PNG");
      }
      if (file.size > 20 * 1024 * 1024) {
        throw new Error("Файл слишком большой (макс. 20 МБ)");
      }

      // Try Vercel Blob client-upload first
      try {
        const { upload: blobUpload } = await import("@vercel/blob/client");
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const blob = await blobUpload(`docs/${Date.now()}-${safe}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        onChange(blob.url);
        return;
      } catch (clientErr) {
        const msg = clientErr instanceof Error ? clientErr.message : "";
        if (!/not configured|BLOB_READ_WRITE_TOKEN/i.test(msg)) {
          if (msg) throw clientErr;
        }
      }

      // FormData fallback
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const text = await res.text();
      let data: { url?: string; error?: string } = {};
      try { data = text ? JSON.parse(text) : {}; } catch {
        throw new Error(res.status === 413
          ? "Файл слишком большой. Включите Vercel Blob."
          : `Ошибка загрузки (HTTP ${res.status})`);
      }
      if (!res.ok) throw new Error(data.error || `Ошибка (HTTP ${res.status})`);
      if (!data.url) throw new Error("Сервер не вернул URL");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs text-white/50">{label}</label>
        <div className="flex gap-1 p-0.5 rounded-md text-xs" style={{ background: "#0a1628" }}>
          <button type="button" onClick={() => setMode("upload")}
            className="px-2 py-0.5 rounded flex items-center gap-1 transition-all"
            style={{ background: mode === "upload" ? "#cd9e66" : "transparent", color: mode === "upload" ? "#0a1628" : "rgba(255,255,255,0.5)" }}>
            <Upload size={10} /> Загрузить
          </button>
          <button type="button" onClick={() => setMode("url")}
            className="px-2 py-0.5 rounded flex items-center gap-1 transition-all"
            style={{ background: mode === "url" ? "#cd9e66" : "transparent", color: mode === "url" ? "#0a1628" : "rgba(255,255,255,0.5)" }}>
            <LinkIcon size={10} /> Ссылка
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className="rounded-lg cursor-pointer transition-colors flex flex-col items-center justify-center py-6 px-4 text-center"
          style={{
            border: `1.5px dashed ${dragOver ? "#cd9e66" : "rgba(255,255,255,0.15)"}`,
            background: dragOver ? "rgba(205,158,102,0.05)" : "rgba(255,255,255,0.02)",
          }}
        >
          <input ref={inputRef} type="file" accept={ACCEPTED} onChange={onFileChange} className="hidden" />
          {uploading ? (
            <Loader2 size={20} className="animate-spin mb-2" style={{ color: "#cd9e66" }} />
          ) : (
            <FileText size={20} className="mb-2" style={{ color: "#cd9e66" }} />
          )}
          <p className="text-sm text-white/70">
            {uploading ? "Загрузка..." : "Нажмите или перетащите файл сюда"}
          </p>
          <p className="text-xs text-white/30 mt-1">PDF, DOC, DOCX, JPG, PNG · Макс. 20 МБ</p>
        </div>
      ) : (
        <input
          className="form-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/document.pdf"
        />
      )}

      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}

      {value && (
        <div className="mt-3 flex items-center gap-3 px-3 py-2.5 rounded-lg"
          style={{ background: "rgba(205,158,102,0.06)", border: "1px solid rgba(205,158,102,0.15)" }}>
          <FileCheck size={16} style={{ color: "#cd9e66" }} className="shrink-0" />
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <FileExtBadge url={value} />
            <p className="text-xs text-white/50 truncate">{getFileLabel(value)}</p>
          </div>
          <button type="button" onClick={() => onChange("")}
            className="shrink-0 text-red-400 hover:text-red-300 transition-colors">
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
