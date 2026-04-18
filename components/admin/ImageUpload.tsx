"use client";

import { useRef, useState } from "react";
import { Upload, Link as LinkIcon, X, Loader2 } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ImageUpload({ value, onChange, label = "Изображение", placeholder = "https://..." }: Props) {
  const [mode, setMode] = useState<"upload" | "url">(value && value.startsWith("http") ? "url" : "upload");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Only images allowed");
      }
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File too large (max 10MB)");
      }

      // Try client-upload protocol first (bypasses 4.5MB serverless limit).
      try {
        const { upload: blobUpload } = await import("@vercel/blob/client");
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const blob = await blobUpload(`${Date.now()}-${safe}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        onChange(blob.url);
        return;
      } catch (clientErr) {
        // If Blob isn't configured on server, fall back to FormData upload.
        const msg = clientErr instanceof Error ? clientErr.message : "";
        if (!/not configured|BLOB_READ_WRITE_TOKEN/i.test(msg)) {
          // Re-throw real errors (auth, size, type, etc.)
          if (msg) throw clientErr;
        }
      }

      // Fallback: FormData (local dev or small files)
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const text = await res.text();
      let data: { url?: string; error?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          res.status === 413
            ? "File too large for direct upload. Enable Vercel Blob storage."
            : `Upload failed (HTTP ${res.status})`
        );
      }
      if (!res.ok) throw new Error(data.error || `Upload failed (HTTP ${res.status})`);
      if (!data.url) throw new Error("Upload returned no URL");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
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
          <button
            type="button"
            onClick={() => setMode("upload")}
            className="px-2 py-0.5 rounded flex items-center gap-1 transition-all"
            style={{
              background: mode === "upload" ? "#cd9e66" : "transparent",
              color: mode === "upload" ? "#0a1628" : "rgba(255,255,255,0.5)",
            }}
          >
            <Upload size={10} /> Загрузить
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className="px-2 py-0.5 rounded flex items-center gap-1 transition-all"
            style={{
              background: mode === "url" ? "#cd9e66" : "transparent",
              color: mode === "url" ? "#0a1628" : "rgba(255,255,255,0.5)",
            }}
          >
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
          <input ref={inputRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
          {uploading ? (
            <Loader2 size={20} className="animate-spin mb-2" style={{ color: "#cd9e66" }} />
          ) : (
            <Upload size={20} className="mb-2" style={{ color: "#cd9e66" }} />
          )}
          <p className="text-sm text-white/70">{uploading ? "Загрузка..." : "Нажмите или перетащите фото сюда"}</p>
          <p className="text-xs text-white/30 mt-1">PNG, JPG, WebP · Макс. 10 МБ</p>
        </div>
      ) : (
        <input
          className="form-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}

      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}

      {value && (
        <div className="mt-3 flex items-start gap-2">
          <img
            src={value}
            alt="Preview"
            className="w-20 h-20 rounded-lg object-cover shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3"; }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/40 truncate">{value}</p>
            <button
              type="button"
              onClick={() => onChange("")}
              className="mt-1 inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
            >
              <X size={11} /> Удалить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
