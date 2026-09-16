# FocusFlow

AI destekli görev ve odaklanma asistanı.

- Dark neon UI (`#0b111e` / `#00d2ff`), glassmorphism
- Sürükle-bırak Kanban (Yapılacaklar / Yapılıyor / Tamamlandı)
- Öncelik etiketleri, düzenleme, tamamlama
- 25/5 Pomodoro, bildirim + Web Audio çanı
- Yağmur / Lo-Fi ortam sesi (sentezlenmiş)
- Mock AI performans koçu (`lib/ai-coach.ts`)
- `localStorage` kalıcılığı (`focusflow.v1`)

## Çalıştırma

```bash
npm install
npm run dev
```

Tarayıcı: http://localhost:3000

## Veri modeli

`lib/types.ts` içindeki `Task`, `PomodoroLog`, `Stats`, `AppState` yapıları Supabase / Firebase’e taşınmaya uygun düz JSON modelleridir.

## AI koçu

Şu an kural tabanlıdır. Gerçek modele geçmek için `getCoachMessage` fonksiyonunu bir API çağrısıyla değiştirin.
