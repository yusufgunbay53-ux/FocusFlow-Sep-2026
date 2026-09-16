"use client";

import { useEffect, useState } from "react";
import { CloudRain, Music2, Volume2, VolumeX } from "lucide-react";
import { AmbientKind, setAmbient } from "@/lib/audio";

export function AmbientPlayer() {
  const [kind, setKind] = useState<AmbientKind>("off");
  const [vol, setVol] = useState(0.3);

  useEffect(() => {
    setAmbient(kind, vol);
    return () => setAmbient("off");
  }, [kind, vol]);

  return (
    <section className="glass glow-border rounded-2xl p-4 transition">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Ortam sesi</h2>
        {kind === "off" ? <VolumeX size={16} className="text-cyan-100/40" /> : <Volume2 size={16} className="text-neon" />}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <ModeBtn active={kind === "off"} onClick={() => setKind("off")} label="Kapalı" />
        <ModeBtn active={kind === "rain"} onClick={() => setKind("rain")} label="Yağmur" icon={<CloudRain size={14} />} />
        <ModeBtn active={kind === "lofi"} onClick={() => setKind("lofi")} label="Lo-Fi" icon={<Music2 size={14} />} />
      </div>
      <input type="range" min={0} max={1} step={0.01} value={vol} onChange={(e) => setVol(Number(e.target.value))} className="mt-3 w-full accent-[#00d2ff]" />
    </section>
  );
}

function ModeBtn({
  active, onClick, label, icon,
}: { active: boolean; onClick: () => void; label: string; icon?: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`flex items-center justify-center gap-1 rounded-xl border px-2 py-2 text-xs transition ${
      active ? "border-neon/50 bg-neon/15 text-neon" : "border-white/10 text-cyan-100/60 hover:border-neon/30"
    }`}>
      {icon}{label}
    </button>
  );
}
