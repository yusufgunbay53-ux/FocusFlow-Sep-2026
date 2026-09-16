"use client";

import { useState } from "react";
import { ColumnId, Priority, Task } from "@/lib/types";
import { TaskCard } from "./TaskCard";

const COLUMNS: { id: ColumnId; title: string }[] = [
  { id: "todo", title: "Yapılacaklar" },
  { id: "doing", title: "Yapılıyor" },
  { id: "done", title: "Tamamlandı" },
];

export function KanbanBoard({
  tasks,
  onMove,
  onUpdate,
  onDelete,
}: {
  tasks: Task[];
  onMove: (id: string, column: ColumnId) => void;
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onDelete: (id: string) => void;
}) {
  const [over, setOver] = useState<ColumnId | null>(null);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {COLUMNS.map((col) => {
        const items = tasks.filter((t) => t.column === col.id);
        return (
          <div
            key={col.id}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(col.id);
            }}
            onDragLeave={() => setOver((v) => (v === col.id ? null : v))}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/task-id");
              if (id) onMove(id, col.id);
              setOver(null);
            }}
            className={`glass min-h-[280px] rounded-2xl p-3 transition ${
              over === col.id ? "border-neon/50 shadow-glow" : ""
            }`}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold text-cyan-50">{col.title}</h2>
              <span className="rounded-full bg-neon/10 px-2 py-0.5 text-[11px] text-neon">{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onToggleDone={() => onMove(task.id, task.column === "done" ? "todo" : "done")}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
};
