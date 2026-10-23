import { hasSpeechSynthesis } from './detect';

const STORAGE_KEY = 'daybridge_voice_out';

export function isVoiceOutPreferred(): boolean {
  if (!hasSpeechSynthesis()) return false;
  if (typeof localStorage === 'undefined') return true;
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === null) return true; // default on for multimodal demo when supported
  return v === '1';
}

export function setVoiceOutPreferred(on: boolean): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
}

/** Speak short spoken line only — never dump full message text. */
export function speakSpoken(text: string | undefined | null): void {
  if (!text?.trim() || !hasSpeechSynthesis()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utter = new SpeechSynthesisUtterance(text.trim().slice(0, 280));
  utter.rate = 1.02;
  utter.pitch = 1;
  utter.lang = 'en-US';
  synth.speak(utter);
}

export function stopSpeaking(): void {
  if (!hasSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}

export function isSpeaking(): boolean {
  if (!hasSpeechSynthesis()) return false;
  return window.speechSynthesis.speaking;
}
