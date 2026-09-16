"use client";

import { useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { Priority, Task } from "@/lib/types";
import { PRIORITY_LABEL } from "./KanbanBoard";

const PRIORITY_STYLE: Record<Priority, string> = {
  low: "bg-emerald-400/15 text-emerald-300",
  medium: "bg-amber-400/15 text-amber-300",
  high: "bg-rose-400/15 text-rose-300",
};

export function TaskCard({
  task,
  onUpdate,
  onDelete,
  onToggleDone,
}: {
  task: Task;
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onToggleDone: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes ?? "");
  const [priority, setPriority] = useState<Priority>(task.priority);

  function save() {
    const t = title.trim();
    if (!t) return;
    onUpdate(task.id, { title: t, notes: notes.trim() || undefined, priority });
    setEditing(false);
  }

  return (
    <article
      draggable={!editing}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/task-id", task.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className="cursor-grab rounded-xl border border-white/10 bg-white/[0.04] p-3 transition hover:border-neon/35 hover:bg-white/[0.07] active:cursor-grabbing"
    >
      {editing ? (
        <div className="space-y-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-white/10 bg-night/60 px-2 py-1.5 text-sm outline-none" />
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full rounded-lg border border-white/10 bg-night/60 px-2 py-1.5 text-sm outline-none" />
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="w-full rounded-lg border border-white/10 bg-night/60 px-2 py-1.5 text-sm">
            <option value="low">Düşük</option>
            <option value="medium">Orta</option>
            <option value="high">Yüksek</option>
          </select>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(false)} className="rounded-lg p-1.5 hover:bg-white/10"><X size={14} /></button>
            <button type="button" onClick={save} className="rounded-lg bg-neon/20 p-1.5 text-neon"><Check size={14} /></button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-2">
            <h3 className={`text-sm font-medium ${task.column === "done" ? "text-cyan-100/40 line-through" : ""}`}>{task.title}</h3>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${PRIORITY_STYLE[task.priority]}`}>{PRIORITY_LABEL[task.priority]}</span>
          </div>
          {task.notes && <p className="mt-1 text-xs text-cyan-100/45">{task.notes}</p>}
          <div className="mt-2 flex items-center justify-end gap-1">
            <button type="button" title="Tamamla" onClick={onToggleDone} className="rounded-lg p-1.5 text-cyan-100/60 transition hover:bg-neon/15 hover:text-neon"><Check size={14} /></button>
            <button type="button" title="Düzenle" onClick={() => setEditing(true)} className="rounded-lg p-1.5 text-cyan-100/60 transition hover:bg-white/10"><Pencil size={14} /></button>
            <button type="button" title="Sil" onClick={() => onDelete(task.id)} className="rounded-lg p-1.5 text-cyan-100/60 transition hover:bg-rose-500/20 hover:text-rose-300"><Trash2 size={14} /></button>
          </div>
        </>
      )}
    </article>
  );
}
