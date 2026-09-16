let ctx: AudioContext | null = null;
let ambientNodes: { stop: () => void } | null = null;

function getCtx() {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export function playChime() {
  const ac = getCtx();
  const now = ac.currentTime;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(660, now);
  o.frequency.exponentialRampToValueAtTime(880, now + 0.18);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
  o.connect(g).connect(ac.destination);
  o.start(now);
  o.stop(now + 0.75);
}

export type AmbientKind = "off" | "rain" | "lofi";

export function setAmbient(kind: AmbientKind, volume = 0.25) {
  stopAmbient();
  if (kind === "off") return;
  const ac = getCtx();
  if (kind === "rain") ambientNodes = startRain(ac, volume);
  if (kind === "lofi") ambientNodes = startLofi(ac, volume);
}

export function stopAmbient() {
  ambientNodes?.stop();
  ambientNodes = null;
}

function startRain(ac: AudioContext, volume: number) {
  const bufferSize = 2 * ac.sampleRate;
  const noiseBuffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = noiseBuffer;
  src.loop = true;
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 900;
  filter.Q.value = 0.6;
  const gain = ac.createGain();
  gain.gain.value = volume * 0.35;
  src.connect(filter).connect(gain).connect(ac.destination);
  src.start();
  return { stop: () => src.stop() };
}

function startLofi(ac: AudioContext, volume: number) {
  const master = ac.createGain();
  master.gain.value = volume * 0.12;
  master.connect(ac.destination);
  const pad = ac.createOscillator();
  pad.type = "triangle";
  pad.frequency.value = 110;
  const padGain = ac.createGain();
  padGain.gain.value = 0.5;
  pad.connect(padGain).connect(master);
  pad.start();
  const fifth = ac.createOscillator();
  fifth.type = "sine";
  fifth.frequency.value = 165;
  const fifthGain = ac.createGain();
  fifthGain.gain.value = 0.25;
  fifth.connect(fifthGain).connect(master);
  fifth.start();
  const lfo = ac.createOscillator();
  lfo.frequency.value = 0.12;
  const lfoGain = ac.createGain();
  lfoGain.gain.value = 0.04;
  lfo.connect(lfoGain).connect(master.gain);
  lfo.start();
  return {
    stop: () => {
      pad.stop();
      fifth.stop();
      lfo.stop();
    },
  };
}
