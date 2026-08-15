let bellAudio: HTMLAudioElement | null = null;
let warningAudio: HTMLAudioElement | null = null;

export function playBell() {
  if (typeof window === "undefined") return;
  if (!bellAudio) bellAudio = new Audio("/sounds/bell.wav");
  bellAudio.currentTime = 0;
  bellAudio.play().catch(() => {});
}

export function playWarning() {
  if (typeof window === "undefined") return;
  if (!warningAudio) warningAudio = new Audio("/sounds/warning.wav");
  warningAudio.currentTime = 0;
  warningAudio.play().catch(() => {});
}
