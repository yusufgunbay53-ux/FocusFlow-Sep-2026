export type Priority = "low" | "medium" | "high";
export type ColumnId = "todo" | "doing" | "done";

export interface Task {
  id: string;
  title: string;
  notes?: string;
  priority: Priority;
  column: ColumnId;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface PomodoroLog {
  id: string;
  mode: "focus" | "break";
  durationSec: number;
  completedAt: string;
}

export interface Stats {
  pomodorosToday: number;
  focusMinutesToday: number;
  tasksCompletedToday: number;
  lastActiveAt: string;
}

export interface AppState {
  tasks: Task[];
  logs: PomodoroLog[];
  stats: Stats;
}

export const STORAGE_KEY = "focusflow.v1";

export function emptyStats(): Stats {
  return {
    pomodorosToday: 0,
    focusMinutesToday: 0,
    tasksCompletedToday: 0,
    lastActiveAt: new Date().toISOString(),
  };
}
