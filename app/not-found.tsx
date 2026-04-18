import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0f2040" }}>
      <div className="text-center max-w-md">
        <p
          className="text-8xl font-bold mb-2"
          style={{
            fontFamily: "var(--font-playfair, serif)",
            background: "linear-gradient(135deg, #cd9e66, #d4af7a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </p>
        <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
        <p className="text-white/50 text-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #cd9e66, #d4af7a)", color: "#0f2040" }}
          >
            <Home size={15} /> Back to Home
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-white/5"
            style={{ borderColor: "rgba(205,158,102,0.4)", color: "#cd9e66" }}
          >
            <ArrowLeft size={15} /> Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
