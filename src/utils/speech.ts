export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Keep a reference to the utterance being spoken: if it is garbage-collected
// mid-sentence, Chrome stops firing its events (and may cut the audio).
let current: SpeechSynthesisUtterance | null = null;
let pending: ReturnType<typeof setTimeout> | null = null;

export function stopSpeaking(): void {
  if (!isSpeechSupported()) return;
  if (pending) {
    clearTimeout(pending);
    pending = null;
  }
  current = null;
  window.speechSynthesis.cancel();
}

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.toLowerCase() === 'pt-pt') ||
    voices.find((v) => v.lang.toLowerCase().replace('_', '-') === 'pt-pt') ||
    voices.find((v) => v.lang.toLowerCase().startsWith('pt'))
  );
}

// Voices load asynchronously in Chrome; asking once warms the list up.
if (isSpeechSupported()) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    window.speechSynthesis.getVoices();
  });
}

export function speakPt(
  text: string,
  options?: {
    rate?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onBoundary?: (charIndex: number) => void;
  }
): void {
  if (!isSpeechSupported() || !text.trim()) {
    options?.onEnd?.();
    return;
  }
  const synth = window.speechSynthesis;
  const wasBusy = synth.speaking || synth.pending;
  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-PT';
  utterance.rate = options?.rate ?? 0.92;
  utterance.pitch = 1.02;
  const voice = pickVoice();
  if (voice) utterance.voice = voice;

  const finish = () => {
    if (current === utterance) current = null;
    options?.onEnd?.();
  };
  utterance.onstart = () => options?.onStart?.();
  utterance.onend = finish;
  utterance.onerror = finish;
  if (options?.onBoundary) {
    utterance.onboundary = (event) => options.onBoundary?.(event.charIndex);
  }

  const start = () => {
    pending = null;
    current = utterance;
    // Chrome can be left "paused" (e.g. after the tab was in the background),
    // which silently queues everything; resuming first unsticks it.
    synth.resume();
    synth.speak(utterance);
  };
  // Speaking right after cancel() is sometimes dropped by Chrome; give the
  // engine a moment when something was playing.
  if (wasBusy) pending = setTimeout(start, 80);
  else start();
}
