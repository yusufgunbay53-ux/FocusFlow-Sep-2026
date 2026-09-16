import { AppState } from "./types";

export interface CoachMessage {
  tone: "cheer" | "nudge" | "focus" | "rest";
  text: string;
}

/** Mock koç. Gerçek LLM için getCoachMessage içini API çağrısıyla değiştir. */
export function getCoachMessage(state: AppState, timerRunning: boolean, mode: "focus" | "break"): CoachMessage {
  const { stats, tasks } = state;
  const openHigh = tasks.filter((t) => t.column !== "done" && t.priority === "high").length;
  const done = stats.tasksCompletedToday;
  const pomos = stats.pomodorosToday;

  if (mode === "break") {
    return { tone: "rest", text: "Mola zamanı. 5 dakika uzaklaş, su iç, gözlerini dinlendir." };
  }
  if (timerRunning && pomos >= 3) {
    return { tone: "cheer", text: "Bugün harika gidiyorsun! Ritmini koru, bir seferde tek göreve odaklan." };
  }
  if (!timerRunning && done === 0 && pomos === 0) {
    return { tone: "nudge", text: "Güne küçük bir zaferle başla. Yüksek öncelikli bir görevi Yapılıyor'a al ve sayacı başlat." };
  }
  if (openHigh >= 2 && done < 2) {
    return { tone: "focus", text: "Birden fazla yüksek öncelikli iş açık. En önemlisini seç, diğerlerini beklet." };
  }
  if (pomos >= 1 && done === 0) {
    return { tone: "nudge", text: "Odak seansın oldu ama henüz görev kapanmadı. Kartı Tamamlandı'ya çekmek ister misin?" };
  }
  if (done >= 3) {
    return { tone: "cheer", text: `Bugün ${done} görev tamamladın. Momentumun güçlü — kısa bir mola sonrası devam.` };
  }
  return { tone: "focus", text: "Derin iş zamanı. Bildirimleri kapat, Lo-Fi veya yağmur sesini aç, 25 dakikayı bölme." };
}
