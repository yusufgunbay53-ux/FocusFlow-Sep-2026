"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { AppState, ColumnId, Priority, Task } from "@/lib/types";
import { loadState, saveState, uid, bumpStatsOnTaskDone, appendLog } from "@/lib/storage";
import { getCoachMessage } from "@/lib/ai-coach";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TaskComposer } from "@/components/TaskComposer";
import { Pomodoro } from "@/components/Pomodoro";
import { AmbientPlayer } from "@/components/AmbientPlayer";
import { CoachPanel } from "@/components/CoachPanel";

export default function HomePage() {
  const [state, setState] = useState<AppState | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  const coach = useMemo(() => {
    if (!state) return { tone: "focus" as const, text: "Yükleniyor…" };
    return getCoachMessage(state, timerRunning, mode);
  }, [state, timerRunning, mode]);

  function addTask(title: string, priority: Priority, notes?: string) {
    if (!state) return;
    const now = new Date().toISOString();
    const task: Task = { id: uid(), title, notes, priority, column: "todo", createdAt: now, updatedAt: now };
    setState({ ...state, tasks: [task, ...state.tasks] });
  }

  function updateTask(id: string, patch: Partial<Task>) {
    if (!state) return;
    setState({
      ...state,
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t)),
    });
  }

  function deleteTask(id: string) {
    if (!state) return;
    setState({ ...state, tasks: state.tasks.filter((t) => t.id !== id) });
  }

  function moveTask(id: string, column: ColumnId) {
    if (!state) return;
    const prev = state.tasks.find((t) => t.id === id);
    if (!prev) return;
    const now = new Date().toISOString();
    const becomingDone = column === "done" && prev.column !== "done";
    setState({
      ...state,
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, column, updatedAt: now, completedAt: becomingDone ? now : t.completedAt } : t
      ),
      stats: becomingDone ? bumpStatsOnTaskDone(state.stats) : state.stats,
    });
  }

  function onPomodoroComplete(kind: "focus" | "break", durationSec: number) {
    if (!state) return;
    const log = { id: uid(), mode: kind, durationSec, completedAt: new Date().toISOString() };
    setState({
      ...state,
      logs: appendLog(state.logs, log),
      stats: {
        ...state.stats,
        pomodorosToday: state.stats.pomodorosToday + (kind === "focus" ? 1 : 0),
        focusMinutesToday: state.stats.focusMinutesToday + (kind === "focus" ? Math.round(durationSec / 60) : 0),
        lastActiveAt: new Date().toISOString(),
      },
    });
  }

  if (!state) {
    return (
      <main className="min-h-screen grid place-items-center text-neon/70">FocusFlow yükleniyor…</main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-neon/15 text-neon shadow-glow">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">FocusFlow</h1>
            <p className="text-xs text-cyan-100/50">AI destekli görev ve odaklanma asistanı</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-cyan-100/60">
          <Stat label="Pomodoro" value={state.stats.pomodorosToday} />
          <Stat label="Odak dk" value={state.stats.focusMinutesToday} />
          <Stat label="Tamamlanan" value={state.stats.tasksCompletedToday} />
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <section className="space-y-5">
          <TaskComposer onAdd={addTask} />
          <KanbanBoard tasks={state.tasks} onMove={moveTask} onUpdate={updateTask} onDelete={deleteTask} />
        </section>
        <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
          <Pomodoro onRunningChange={setTimerRunning} onModeChange={setMode} onComplete={onPomodoroComplete} />
          <AmbientPlayer />
          <CoachPanel message={coach} />
        </aside>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass rounded-xl px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-cyan-100/40">{label}</div>
      <div className="text-sm font-semibold text-neon">{value}</div>
    </div>
  );
}
