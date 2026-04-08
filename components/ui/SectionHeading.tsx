"use client";

interface Props {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeading({ badge, title, subtitle, centered = false, light = false }: Props) {
  return (
    <div className={centered ? "text-center" : ""}>
      {badge && (
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4"
          style={{ background: "rgba(205,158,102,0.15)", color: "#cd9e66", border: "1px solid rgba(205,158,102,0.3)" }}>
          {badge}
        </span>
      )}
      <h2
        className={`text-3xl md:text-4xl font-bold mb-3 ${light ? "text-white" : "text-white"} ${centered ? "gold-underline-center" : "gold-underline"}`}
        style={{ fontFamily: "var(--font-display, serif)" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`text-base md:text-lg mt-6 max-w-2xl ${centered ? "mx-auto" : ""} ${light ? "text-white/70" : "text-white/60"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
