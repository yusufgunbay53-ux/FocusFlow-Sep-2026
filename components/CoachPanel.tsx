"use client";

import { Bot } from "lucide-react";
import { CoachMessage } from "@/lib/ai-coach";

export function CoachPanel({ message }: { message: CoachMessage }) {
  return (
    <section className="glass glow-border rounded-2xl p-4 transition">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-neon/15 text-neon">
          <Bot size={16} />
        </span>
        AI Performans Koçu
      </div>
      <p className="text-sm leading-relaxed text-cyan-50/80">{message.text}</p>
      <p className="mt-3 text-[11px] text-cyan-100/35">
        Mock kural motoru. API bağlamak için <code className="text-neon/70">lib/ai-coach.ts</code> dosyasını kullan.
      </p>
    </section>
  );
}
