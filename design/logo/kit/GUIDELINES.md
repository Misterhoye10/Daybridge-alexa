# Daybridge — Brand & Logo Guidelines

> **Brand Identity**: Calm, Capable, Honest, Warm  
> **Master Concept**: Concept A — *The Arch & Arrival*  
> **Single Source of Truth**: `design/DESIGN.md`

---

## 1. The Mark & Rationalization

The Daybridge mark unites two essential geometric primitives:
- **The Arch**: A semicircular bridge rooted on an invisible baseline, evoking transition, stability, and structure without excess ornament.
- **The Arrival Dot**: A circular destination anchored precisely beneath the arch apex, rendered in brand Harbor. It embodies conversational intention turning into real, confirmed backend state.

### Core Truths
- **The mark is static**: Never animate the logo, rotate the arch, or pulse the dot to show loading. Loading and execution states belong exclusively to the `PipelineTrace` component.
- **No category clichés**: No Amazon rings, cyan sweeps, gradients, drop shadows, or AI sparkle/magic stars.

---

## 2. Master Lockups & File Manifest

All assets are located in `design/logo/kit/` and its subdirectories.

| Asset Type | File Path | Default Dimensions | Recommended Usage |
|:---|:---|:---|:---|
| **Master Symbol** | `design/logo/kit/daybridge-symbol.svg` | `256 × 256` | Display, responsive headers, splash screens |
| **Micro-Optimized Symbol** | `design/logo/kit/daybridge-symbol-small.svg` | `32 × 32` | Favicons, 16–32 px system indicators, tab icons |
| **Horizontal Lockup** | `design/logo/kit/daybridge-lockup.svg` | `320 × 64` | Primary web navbar, documentation headers |
| **Stacked Lockup** | `design/logo/kit/daybridge-stacked.svg` | `160 × 128` | Social profile headers, square cards, packaging |
| **App Icon on Tile** | `design/logo/kit/daybridge-symbol-on-tile.svg` | `512 × 512` | iOS/macOS app tile, PWA launcher icon |
| **Dark Master Symbol** | `design/logo/kit/daybridge-symbol-on-dark.svg` | `256 × 256` | Dark mode standalone icon |
| **Dark Horizontal Lockup** | `design/logo/kit/daybridge-lockup-on-dark.svg` | `320 × 64` | Dark mode navbar and headers |

### Web & App Asset Suite (`design/logo/kit/variants/`)
- **Favicons**: `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `favicon-48.png`
- **PWA / Apple Touch**: `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `maskable-512.png`
- **Manifest & Embed**: `site.webmanifest`, `head-snippet.html`
- **Master Bitmaps**: High-res renders at 32, 128, 512, and 1024 px.

---

## 3. Clear Space & Proportions

A mandatory clear space zone protects the integrity of the mark across all applications.

```
       ┌─────────────────────────────────────┐
       │                 1 D                 │
       │         ┌─────────────────┐         │
       │         │    ╭───────╮    │         │
   1 D │     1 D │   │    ●    │   │ 1 D     │ 1 D
       │         │   │         │   │         │
       │         └─────────────────┘         │
       │                 1 D                 │
       └─────────────────────────────────────┘
```

- **Clear Space Unit ($D$)**: Equal to the diameter of the arrival dot ($40\text{ px}$ on the 256-grid; $5\text{ px}$ on the 32-grid).
- Keep a minimum margin of **$1 \times D$** on all four sides of the symbol or lockup.
- **Wordmark Spacing**: The gap between the symbol bounding box and the wordmark `Daybridge` is exactly $1 \times D$ ($40\text{ px}$ on the master grid).

---

## 4. Minimum Sizes

To maintain legibility and optical density:

| Configuration | Digital Minimum | Print Minimum | Notes |
|:---|:---|:---|:---|
| **Symbol** | `16 × 16 px` | `5 mm` | Below 32 px, use `daybridge-symbol-small.svg` or `favicon-16.png` |
| **Horizontal Lockup** | `96 px wide` | `24 mm wide` | Stroke weight remains crisp; wordmark stays legible |
| **Stacked Lockup** | `64 px wide` | `18 mm wide` | Ensure vertical balance on square formats |

---

## 5. Color Palette & Specifications

Daybridge uses a cool neutral scale with exactly one action accent: **Harbor**. State colors (Amber, Green, Red) belong to execution cards and badges only, never to brand marks.

| Color Token | HEX | RGB | CMYK | Role in Identity |
|:---|:---|:---|:---|:---|
| **Harbor 600** | `#0F6F6B` | `15, 111, 107` | `86, 0, 4, 56` | Primary action accent; Arrival dot on light backgrounds |
| **Harbor 400** | `#4FC2BB` | `79, 194, 187` | `59, 0, 4, 24` | Dark mode arrival dot; high contrast against Gray 900 |
| **Gray 900** | `#12161B` | `18, 22, 27` | `33, 19, 0, 89` | Arch and wordmark on light backgrounds; Dark background |
| **Gray 50** | `#F7F8F9` | `247, 248, 249` | `1, 0, 0, 2` | Light app background; Arch and wordmark on dark |
| **Pure White** | `#FFFFFF` | `255, 255, 255` | `0, 0, 0, 0` | Tile arch; monochrome reversed mark |

### Approved Colorways

1. **Light Mode Primary** (Background: `#FFFFFF` or `#F7F8F9`):
   - Arch & Wordmark: `Gray 900` (`#12161B`)
   - Arrival Dot: `Harbor 600` (`#0F6F6B`)
2. **Dark Mode Primary** (Background: `#12161B` or `#0A0D10`):
   - Arch & Wordmark: `Gray 50` (`#F7F8F9`)
   - Arrival Dot: `Harbor 400` (`#4FC2BB`)
3. **App Icon Tile**:
   - Background: `Harbor 600` (`#0F6F6B`) squircle ($22\%$ corner radius)
   - Arch: `Pure White` (`#FFFFFF`)
   - Arrival Dot: `Harbor 300` (`#72D6D0`)
4. **Monochrome Black**:
   - Entire mark in `#12161B` (for receipts, single-color packaging, laser engraving)
5. **Monochrome White**:
   - Entire mark in `#FFFFFF` (for dark photographic overlays or dark solid fills)

---

## 6. Typography & Wordmark

- **Font Family**: Geist
- **Wordmark Weight**: SemiBold (600)
- **Tracking**: `-0.025em` (tight, crisp, architectural feel)
- **Casing**: Title Case (`Daybridge`)
- **Companion UI Fonts**: Geist 400/500 (body and interfaces), Geist Mono 500 (data, parameters, timestamps).

---

## 7. Strict Misuse Rules ("Don'ts")

- 🚫 **Do not animate the logo mark**: Daybridge is calm and truthful. Loading states belong exclusively to `PipelineTrace`.
- 🚫 **Do not introduce cyan or Alexa blue**: Daybridge borrows the interaction model, never Amazon's visual branding.
- 🚫 **Do not add AI sparkles or magic icons**: No stars, wand flairs, or glowing halos.
- 🚫 **Do not add drop shadows, outer glows, or 3D extrusions**: The geometry is planar and architectural.
- 🚫 **Do not distort, stretch, or shear**: Maintain a 1:1 aspect ratio on the symbol at all times.
- 🚫 **Do not reposition or scale the arrival dot independently**: The dot's diameter is fixed at $40\text{ px}$ on the 256-grid ($1/8$ arch span).
- 🚫 **Do not recolor outside the approved palette**: The dot is never red, amber, or yellow in brand marks.
- 🚫 **Do not place on noisy imagery without a high-contrast container**: Use the tile or a solid neutral card.
