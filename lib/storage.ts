import { AppState, STORAGE_KEY, emptyStats, Task, PomodoroLog } from "./types";

function isSameDay(a: string, b: Date) {
  const d = new Date(a);
  return (
    d.getFullYear() === b.getFullYear() &&
    d.getMonth() === b.getMonth() &&
    d.getDate() === b.getDate()
  );
}

export function loadState(): AppState {
  if (typeof window === "undefined") {
    return { tasks: [], logs: [], stats: emptyStats() };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { tasks: seedTasks(), logs: [], stats: emptyStats() };
    const parsed = JSON.parse(raw) as AppState;
    const now = new Date();
    if (!isSameDay(parsed.stats.lastActiveAt, now)) {
      parsed.stats = emptyStats();
    }
    return parsed;
  } catch {
    return { tasks: seedTasks(), logs: [], stats: emptyStats() };
  }
}

export function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function uid() {
  return crypto.randomUUID();
}

function seedTasks(): Task[] {
  const now = new Date().toISOString();
  return [
    {
      id: uid(),
      title: "FocusFlow arayüzünü keşfet",
      notes: "Kanban kartlarını sürükle, öncelik değiştir.",
      priority: "medium",
      column: "todo",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid(),
      title: "İlk 25 dk Pomodoro'yu başlat",
      priority: "high",
      column: "doing",
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export function bumpStatsOnTaskDone(stats: AppState["stats"]): AppState["stats"] {
  return {
    ...stats,
    tasksCompletedToday: stats.tasksCompletedToday + 1,
    lastActiveAt: new Date().toISOString(),
  };
}

export function appendLog(logs: PomodoroLog[], log: PomodoroLog) {
  return [...logs, log].slice(-200);
}
