"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id, type }: { id: string; type: "products" | "blog" | "categories" | "messages" | "team" | "certificates" }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Вы уверены, что хотите удалить этот элемент?")) return;
    await fetch(`/api/${type}/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      className="p-1.5 rounded-lg transition-colors hover:bg-red-900/20 text-red-400"
      title="Удалить"
    >
      <Trash2 size={14} />
    </button>
  );
}
