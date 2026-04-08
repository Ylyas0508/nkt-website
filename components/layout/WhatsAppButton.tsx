"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
      {showTooltip && (
        <div className="bg-white text-gray-800 text-sm rounded-lg px-3 py-2 shadow-xl mb-1 whitespace-nowrap font-medium"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
          💬 Chat with us on WhatsApp
          <button onClick={() => setShowTooltip(false)} className="ml-2 text-gray-400 hover:text-gray-600">
            <X size={12} />
          </button>
        </div>
      )}
      <a
        href="https://wa.me/905380390593"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="wa-pulse flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-transform hover:scale-110"
        style={{ background: "#25D366" }}
        aria-label="Chat on WhatsApp"
      >
        {/* WhatsApp SVG icon */}
        <svg width="28" height="28" viewBox="0 0 32 32" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.164 0 0 7.164 0 16c0 2.82.736 5.465 2.023 7.77L0 32l8.448-2.015A15.935 15.935 0 0016 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm0 29.333a13.28 13.28 0 01-6.771-1.848l-.485-.288-5.016 1.196 1.235-4.888-.317-.505A13.27 13.27 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.87c-.398-.2-2.356-1.163-2.72-1.295-.365-.133-.631-.2-.897.2-.265.399-1.03 1.296-1.261 1.562-.232.266-.465.3-.863.1-.398-.2-1.68-.619-3.2-1.974-1.183-1.054-1.981-2.356-2.213-2.754-.232-.399-.025-.615.174-.813.18-.178.398-.465.597-.698.2-.232.266-.399.399-.664.132-.266.066-.499-.034-.698-.1-.2-.897-2.162-1.228-2.96-.324-.776-.653-.671-.897-.683-.232-.011-.499-.013-.764-.013-.266 0-.698.1-.1064.499-.365.398-1.395 1.362-1.395 3.322 0 1.96 1.428 3.853 1.627 4.12.2.265 2.81 4.289 6.81 6.016.952.41 1.695.655 2.274.839.955.303 1.824.26 2.511.158.766-.114 2.357-.963 2.69-1.894.333-.93.333-1.727.232-1.894-.1-.166-.365-.265-.764-.465z"/>
        </svg>
      </a>
    </div>
  );
}
