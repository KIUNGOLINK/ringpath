// Web Audio based bell for the round timer.
// <audio>.play() outside a user gesture is blocked on iOS, which silently breaks
// the bell mid-session. An AudioContext resumed inside the Start tap, with the
// sounds decoded once up front, keeps ringing for the whole session.

type SoundName = "bell" | "warning";

let ctx: AudioContext | null = null;
const buffers: Partial<Record<SoundName, AudioBuffer>> = {};
let loading: Promise<void> | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  return ctx;
}

async function load(name: SoundName) {
  const context = getContext();
  if (!context || buffers[name]) return;
  const response = await fetch(`/sounds/${name}.wav`);
  const data = await response.arrayBuffer();
  buffers[name] = await context.decodeAudioData(data);
}

/** Call from inside a click/tap handler. */
export function unlockAudio(): Promise<void> {
  const context = getContext();
  if (!context) return Promise.resolve();
  if (context.state === "suspended") void context.resume();
  if (!loading) {
    loading = Promise.all([load("bell"), load("warning")]).then(() => undefined).catch(() => {
      loading = null;
    });
  }
  return loading;
}

export function playSound(name: SoundName, volume = 1) {
  const context = getContext();
  const buffer = buffers[name];
  if (!context || !buffer) return;
  if (context.state === "suspended") void context.resume();
  const source = context.createBufferSource();
  const gain = context.createGain();
  gain.gain.value = volume;
  source.buffer = buffer;
  source.connect(gain).connect(context.destination);
  source.start();
}
