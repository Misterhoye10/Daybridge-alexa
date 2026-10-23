/** Web Speech feature detection — never assume support. */

export type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((ev: Event) => void) | null;
  onend: ((ev: Event) => void) | null;
  onerror: ((ev: { error: string }) => void) | null;
  onresult: ((ev: {
    results: ArrayLike<{ 0?: { transcript: string }; isFinal?: boolean }>;
  }) => void) | null;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

export function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function hasSpeechRecognition(): boolean {
  return getSpeechRecognitionCtor() !== null;
}

export function hasSpeechSynthesis(): boolean {
  return typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined';
}
