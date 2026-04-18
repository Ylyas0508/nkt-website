"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-24 right-6 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all z-40 hover:brightness-110"
      style={{
        background: "linear-gradient(135deg, #cd9e66, #d4af7a)",
        color: "#0f2040",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <ArrowUp size={18} strokeWidth={2.5} />
    </button>
  );
}
