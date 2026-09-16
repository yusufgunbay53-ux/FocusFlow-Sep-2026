"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { playChime } from "@/lib/audio";

const FOCUS = 25 * 60;
const BREAK = 5 * 60;

export function Pomodoro({
  onRunningChange,
  onModeChange,
  onComplete,
}: {
  onRunningChange: (v: boolean) => void;
  onModeChange: (m: "focus" | "break") => void;
  onComplete: (kind: "focus" | "break", durationSec: number) => void;
}) {
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [left, setLeft] = useState(FOCUS);
  const [running, setRunning] = useState(false);
  const tick = useRef<number | null>(null);

  useEffect(() => { onRunningChange(running); }, [running, onRunningChange]);
  useEffect(() => { onModeChange(mode); }, [mode, onModeChange]);

  useEffect(() => {
    if (!running) return;
    tick.current = window.setInterval(() => setLeft((s) => s - 1), 1000);
    return () => { if (tick.current) window.clearInterval(tick.current); };
  }, [running]);

  useEffect(() => {
    if (left > 0) return;
    const finished = mode;
    const duration = finished === "focus" ? FOCUS : BREAK;
    setRunning(false);
    playChime();
    notify(finished === "focus" ? "Odak seansı bitti" : "Mola bitti", "FocusFlow");
    onComplete(finished, duration);
    const next = finished === "focus" ? "break" : "focus";
    setMode(next);
    setLeft(next === "focus" ? FOCUS : BREAK);
  }, [left, mode, onComplete]);

  function requestNotify() {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }

  const total = mode === "focus" ? FOCUS : BREAK;
  const pct = Math.max(0, Math.min(100, ((total - left) / total) * 100));
  const mm = String(Math.floor(Math.max(left, 0) / 60)).padStart(2, "0");
  const ss = String(Math.max(left, 0) % 60).padStart(2, "0");

  return (
    <section className="glass glow-border rounded-2xl p-5 transition">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Pomodoro</h2>
        <span className="rounded-full bg-neon/10 px-2 py-0.5 text-[11px] text-neon">
          {mode === "focus" ? "Odak 25 dk" : "Mola 5 dk"}
        </span>
      </div>
      <div className="relative mx-auto mb-5 grid h-44 w-44 place-items-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#00d2ff" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 44}`} strokeDashoffset={`${2 * Math.PI * 44 * (1 - pct / 100)}`} className="transition-[stroke-dashoffset] duration-1000" />
        </svg>
        <div className="text-center">
          <div className="font-mono text-4xl font-semibold tracking-tight">{mm}:{ss}</div>
          <div className="text-[11px] text-cyan-100/40">{Math.round(pct)}%</div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <button type="button" onClick={() => { requestNotify(); setRunning((v) => !v); }} className="inline-flex items-center gap-2 rounded-xl bg-neon px-4 py-2 text-sm font-semibold text-night transition hover:brightness-110">
          {running ? <Pause size={16} /> : <Play size={16} />}
          {running ? "Duraklat" : "Başlat"}
        </button>
        <button type="button" onClick={() => { setRunning(false); setLeft(mode === "focus" ? FOCUS : BREAK); }} className="rounded-xl border border-white/10 p-2 text-cyan-100/70 transition hover:border-neon/40 hover:text-neon">
          <RotateCcw size={16} />
        </button>
      </div>
    </section>
  );
}

function notify(title: string, body: string) {
  if (typeof Notification === "undefined") return;
  if (Notification.permission === "granted") new Notification(title, { body });
}
