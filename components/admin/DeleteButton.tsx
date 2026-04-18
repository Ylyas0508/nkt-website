"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id, type }: { id: string; type: "products" | "blog" | "categories" | "messages" | "team" }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    await fetch(`/api/${type}/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="p-1.5 rounded-lg transition-colors hover:bg-red-900/20 text-red-400"
      title="Delete"
    >
      <Trash2 size={14} />
    </button>
  );
}
