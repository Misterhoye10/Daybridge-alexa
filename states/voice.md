# States — Voice (STT + TTS)

Principle **#3**, **#11**, **#18**. Spec: DESIGN §2 / §8 Composer + PipelineTrace; API `message.spoken`; ROADMAP TTS.

Hide unsupported controls. Text path always works. No Alexa ring / waveform chrome — PipelineTrace + quiet status copy only.

## Surface: Voice in (mic → composer)

| State | UI | Copy / a11y | Behavior |
|---|---|---|---|
| Unsupported | Mic **hidden** | — | Text only (DESIGN a11y). Firefox typical; Safari usually has WebKit STT |
| Safari / WebKit | Mic if ctor exists | Same errors | `webkitSpeechRecognition`; stop on final result; start only from click |
| Idle | Mic ghost | aria-label “Voice input” | Start recognition |
| Listening | Composer `is-listening`, Pipeline **Heard** | “Listening…” | Interim → composer |
| Recognized | Listening off, text in composer | Focus composer | User sends (no auto-send) |
| Permission denied | Listening off + alert | “Microphone blocked. Allow access in the browser, or type instead.” | Retry = open mic again after grant |
| No speech | Alert | “Didn't catch that. Try again, or type it.” | |
| Voice network error | Alert | Network / type fallback | |
| Aborted / stop | Quiet | — | User stopped or onend |
| Sending | Composer disabled | Shared with type path | |

## Surface: Voice out (TTS)

| State | UI | Behavior |
|---|---|---|
| Unsupported | Toggle **hidden** | |
| Off | “Voice off” control | Persist `daybridge_voice_out=0` |
| On / idle | “Voice on” | Persist `=1` |
| Speaking | Status “Speaking…” · optional stop | `speechSynthesis.speak(spoken)` ≤20 words |
| Cancelled | Idle | `cancel()` on toggle off / new speak / unmount |
| Empty spoken | Skip | Never invent audio from long `text` |

## Pipeline (Alexa+-style cue)

| Stage | When |
|---|---|
| Heard | Mic listening |
| Understood | Request accepted / early load |
| Planning | Chat in flight (`create_plan` chip when inventing) |
| Ready | Response applied; collapse after beat |
| Failed (red) | Chat / voice hard fail |

Playback after response: ≥350 ms per stage if replaying `trace` (API_CONTRACT §5).

## Interactive: Mic button

| State | Notes |
|---|---|
| Default / hover / focus / active | 40–44px target |
| Pressed (listening) | `aria-pressed=true` |
| Disabled | While sending — “Voice unavailable while structuring plan” title |

## Interactive: Voice out toggle

| State | Notes |
|---|---|
| On / Off | Header control, not emoji |
| Speaking | Same control stops speech |
