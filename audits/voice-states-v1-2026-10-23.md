# Voice states audit — Daybridge v1 — 2026-10-23

**Verdict:** Ship for hackathon multimodal path (Chrome/Edge STT+TTS). Safari STT often absent — mic correctly hidden.

| Gap | Fix |
|---|---|
| Fake demo transcript when STT missing | Removed; hide mic |
| Mic permission / no-speech silent | Alert + Retry mic |
| TTS unused despite `spoken` | `speechSynthesis` + Voice on/off |
| Pipeline incomplete | Heard→Understood→Planning→Ready ≥350ms |
| AlexaOrb / emoji speaker | Lucide Volume2/X only |

**Deferred:** streaming STT partial UI chrome; multi-language; Alexa device skill (out of web scope).
