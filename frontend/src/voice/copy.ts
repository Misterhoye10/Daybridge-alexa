/** Voice STT/TTS microcopy — cause + fix (#6). */

export const VOICE_COPY = {
  micBlocked: 'Microphone blocked. Allow access in the browser, or type instead.',
  noSpeech: "Didn't catch that. Try again, or type it.",
  voiceNetwork: "Voice connection failed. Type your request, or retry when you're online.",
  micBusy: "Couldn't start the microphone. Type instead, or try again.",
  listening: 'Listening…',
  speaking: 'Speaking…',
  voiceOn: 'Voice replies on',
  voiceOff: 'Voice replies off',
  stopSpeaking: 'Stop speaking',
  voiceUnavailableWhileSending: 'Voice unavailable while structuring plan'
} as const;

export function sttErrorMessage(code: string): string {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      return VOICE_COPY.micBlocked;
    case 'no-speech':
      return VOICE_COPY.noSpeech;
    case 'network':
      return VOICE_COPY.voiceNetwork;
    case 'aborted':
      return '';
    default:
      return VOICE_COPY.micBusy;
  }
}
