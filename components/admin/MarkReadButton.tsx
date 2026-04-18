"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();

  const handle = async () => {
    await fetch(`/api/contact/${id}`, { method: "PATCH" });
    router.refresh();
  };

  return (
    <button
      onClick={handle}
      className="p-1.5 rounded-lg transition-colors hover:bg-white/10 text-white/40 hover:text-white"
      title="Отметить как прочитанное"
    >
      <CheckCircle2 size={14} />
    </button>
  );
}
