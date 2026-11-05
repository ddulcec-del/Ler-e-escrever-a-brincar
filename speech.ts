export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function stopSpeaking(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
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

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-PT';
  utterance.rate = options?.rate ?? 0.92;
  utterance.pitch = 1.02;

  const voices = window.speechSynthesis.getVoices();
  const ptPtVoice =
    voices.find((v) => v.lang.toLowerCase() === 'pt-pt') ||
    voices.find((v) => v.lang.toLowerCase().startsWith('pt'));
  if (ptPtVoice) {
    utterance.voice = ptPtVoice;
  }

  utterance.onstart = () => {
    options?.onStart?.();
  };
  utterance.onend = () => {
    options?.onEnd?.();
  };
  utterance.onerror = () => {
    options?.onEnd?.();
  };
  if (options?.onBoundary) {
    utterance.onboundary = (event) => {
      options.onBoundary?.(event.charIndex);
    };
  }

  window.speechSynthesis.speak(utterance);
}
