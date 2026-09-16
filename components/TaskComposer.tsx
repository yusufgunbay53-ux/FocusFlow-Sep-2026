"use client";

import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import { Priority } from "@/lib/types";

export function TaskComposer({
  onAdd,
}: {
  onAdd: (title: string, priority: Priority, notes?: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  function submit(e: FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    onAdd(t, priority, notes.trim() || undefined);
    setTitle("");
    setNotes("");
    setPriority("medium");
  }

  return (
    <form onSubmit={submit} className="glass glow-border rounded-2xl p-4 transition">
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Yeni görev ekle…"
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none placeholder:text-cyan-100/30 focus:border-neon/50"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-neon/50"
        >
          <option value="low">Düşük</option>
          <option value="medium">Orta</option>
          <option value="high">Yüksek</option>
        </select>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-neon px-4 py-2.5 text-sm font-semibold text-night transition hover:brightness-110"
        >
          <Plus size={16} /> Ekle
        </button>
      </div>
      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Not (isteğe bağlı)"
        className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-cyan-100/30 focus:border-neon/50"
      />
    </form>
  );
}
