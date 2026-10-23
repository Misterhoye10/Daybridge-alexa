import { getSpeechRecognitionCtor, type SpeechRecognitionLike } from './detect';
import { sttErrorMessage, VOICE_COPY } from './copy';

export type SttHandlers = {
  onListening: () => void;
  onTranscript: (text: string, isFinal: boolean) => void;
  onError: (message: string) => void;
  onEnd: () => void;
};

/**
 * Start one-shot STT. Safari/WebKit: webkitSpeechRecognition, stop on final,
 * always from a user gesture. Returns the instance or null if unsupported.
 */
export function startSpeechRecognition(handlers: SttHandlers): SpeechRecognitionLike | null {
  const Ctor = getSpeechRecognitionCtor();
  if (!Ctor) return null;

  const recognition = new Ctor();
  // One utterance — Safari historically ignored continuous=false; we still stop on final.
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  let stoppedForFinal = false;

  recognition.onstart = () => {
    handlers.onListening();
  };

  recognition.onresult = (event) => {
    const results = Array.from(
      event.results as ArrayLike<{ 0?: { transcript: string }; isFinal?: boolean }>
    );
    const transcript = results.map((res) => res[0]?.transcript || '').join('');
    const last = results[results.length - 1];
    const isFinal = Boolean(last?.isFinal);
    handlers.onTranscript(transcript, isFinal);

    // Safari can keep emitting after continuous=false — stop on first final.
    if (isFinal && !stoppedForFinal) {
      stoppedForFinal = true;
      try {
        recognition.stop();
      } catch {
        try {
          recognition.abort();
        } catch {
          /* ignore */
        }
      }
    }
  };

  recognition.onerror = (event) => {
    const msg = sttErrorMessage(event.error || '');
    if (msg) handlers.onError(msg);
  };

  recognition.onend = () => {
    handlers.onEnd();
  };

  try {
    recognition.start();
  } catch {
    handlers.onError(VOICE_COPY.micBusy);
    return null;
  }

  return recognition;
}

export function stopSpeechRecognition(recognition: SpeechRecognitionLike | null): void {
  if (!recognition) return;
  try {
    recognition.stop();
  } catch {
    try {
      recognition.abort();
    } catch {
      /* ignore */
    }
  }
}
