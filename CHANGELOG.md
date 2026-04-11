# Changelog

All notable changes to **TutoCast** are documented here. This project follows
[Keep a Changelog](https://keepachangelog.com/) and [Semantic Versioning](https://semver.org/).

## v0.7.18 — 2026-04-11 (Redesign + critical toolbar mousedown fix)

### Fixed — critical bug in floating toolbars
User: *"options do not work"* (with a screenshot of a selected text
overlay and a non-responsive color toolbar). Root cause: the
SourceToolbar / TextToolbar buttons were stopping `click` propagation,
but `Drag._onDown` listens to **`mousedown`** which fires first and
bubbles past click-stopPropagation. The mousedown reached `.tc-stage`,
`_stageToCanvas` mapped the toolbar's screen coords (now docked below
the stage) to coordinates outside the canvas, `_hitTest` returned null,
and the deselect branch ran — clearing the selection on every toolbar
interaction. The next render hid the toolbar, making every button look
broken.

Fix: added a single `mousedown` listener on each toolbar root element
that calls `e.stopPropagation()`. One line per toolbar; both fixed.

### Changed — redesign
User: *"redesign. better look and feel. reorganize better"*.
- **New floating horizontal tools bar** above the studio grid. Canva-style
  icon pill with Laser, Freeze, Draw, Zoom (separator), Teleprompter,
  Snapshot, Fullscreen. Each button: emoji icon + bold uppercase label
  + small kbd shortcut. Hover lifts (-1 px), active state glows in the
  theme accent. Auto-hides labels under 920 px viewport (icon-only).
- **Right sidebar trimmed** — removed the 7-stacked-tools section
  (`tcLaserBtn` … `tcSnapBtn`). Saved ~280 px of vertical space, the
  sidebar now contains only Scenes + Reset Layout + Texts + Free text +
  Default font picker.
- New `.tc-tools-bar`, `.tc-tool-btn`, `.tc-tool-icon`, `.tc-tool-label`,
  `.tc-tools-sep` styles. Subtle accent gradient background, inset
  highlight, soft shadow.

### Verified (Preview MCP harness)
- `survivedMousedown` test: select a text overlay, dispatch mousedown
  on yellow swatch → `selectedId` unchanged ✓
- `colorAfterClick` test: dispatch click on yellow swatch → text color
  becomes `#fbbf24` ✓
- `toolsBarBtnCount` = 7, `sidebarToolsRemoved` = true.
- Visual: bismillah centered, tools bar above stage, scenes 2×3, text
  presets compact, text toolbar docked below stage with selected "Hi".

## v0.7.19 — 2026-04-11 (Maintenance tools + badge docs)

User feedback: *"add this info to help, faq.. add reste badgeds. Add
fully clear cache. Add last updated date and time. very useful"*.

### Added
- **FAQ q9 / q10** covering the 6-badge system and how to reset your
  local data. Full FR/EN/AR translations. `index.html` help panel
  gets the two new `<details>` entries.
- **⚙ Settings → Général → ♻ Maintenance** section with three new
  pieces of chrome:
  - **🗑 Reset badges** — clears `Badges.unlocked` + `Badges.scenesUsed`
    + `localStorage['tc-badges']`, re-renders the badges strip, fires
    a `🗑 Badges réinitialisés` toast. Keeps everything else intact.
  - **💥 Clear all local data** — `confirm()` gate, then wipes every
    `tc-*` key in localStorage (badges, logo, theme, language,
    onboarding flag, ticker messages, default text font, brand slogan,
    silhouette tint, format preference, sources custom layouts — all
    of it), toast, `location.reload()` after 900 ms. Dangerous button
    styled in red via new `.tc-btn-danger`.
  - **Build meta chip** — Orbitron monospace pill showing
    `Compilé : v0.7.19 · 2026-04-11 15:40`. Driven by a new
    `BUILD_DATE` constant bumped by hand each release. User can
    quickly confirm which build they're running without scrolling
    the news panel.

### Verified (Preview MCP harness)
- `APP_VERSION === '0.7.19'`, `BUILD_DATE === '2026-04-11 15:40'`.
- Build meta chip text: `Compilé : v0.7.19 · 2026-04-11 15:40` ✓.
- FAQ `q9` resolves to `🏆 C'est quoi les badges ?` ✓.
- FAQ `q10` resolves to `♻ Comment remettre à zéro mes données ?` ✓.
- Reset badges regression: unlock `'first'`, click reset button,
  assert `unlocked` Set is empty — ✓.
- No console errors on load.

## v0.7.18 — 2026-04-11 (Redesign + critical toolbar mousedown bug fix)

### Fixed — critical floating toolbar bug
User: *"options do not work"* (screenshot of a selected text overlay
and a non-responsive color toolbar). Root cause: `SourceToolbar` /
`TextToolbar` button handlers called `stopPropagation` on **click**,
but `Drag._onDown` listens to **mousedown** which fires first. The
mousedown reached `.tc-stage`, `_stageToCanvas` mapped the toolbar's
(now docked below the stage) viewport coords to canvas coords outside
the 1920×1080 canvas area, `_hitTest` returned null, and the deselect
branch ran — clearing the selection on every interaction. The next
render cycle hid the toolbar. Every button looked broken.

Fix: one-line `mousedown` stopPropagation listener on each toolbar
root (`.tc-text-toolbar` + `.tc-source-toolbar`). Verified with a
regression test in the Preview MCP harness.

### Changed — redesign
User: *"redesign. better look and feel. reorganize better"*.

- **Floating horizontal tools bar** above the studio grid. Canva-style
  icon pill: Laser / Freeze / Draw / Zoom | Tele / Snap / Fullscreen.
  Each button = emoji icon + bold uppercase label + small `<kbd>` chip.
  Hover `translateY(-1px)` + border highlight, active state glows in
  theme accent. Under 920 px viewport the labels auto-hide (icon+kbd
  only). Zero JS wiring change — same IDs as before.
- **Right sidebar slimmed.** Removed the 7-button vertical tool stack
  (`🛠 Outils`, lines 237-244 of index.html). Saves ~280 px vertical,
  so Scenes + Texts breathe.
- **Duplicate `00:00` timer removed** from the card header. Moved the
  single rec-indicator next to the big ENREGISTRER button in the REC
  bar, at 1.15 rem Orbitron — visually prominent where the eye
  actually goes during recording. `Recorder.updateUI()` now
  null-guards `tcRecIndicator`.
- **New CSS block** for `.tc-tools-bar`, `.tc-tool-btn`, `.tc-tool-icon`,
  `.tc-tool-label`, `.tc-tools-sep` with accent gradient background,
  inset highlight, soft shadow, responsive label hide.

### Verified (Preview MCP harness)
- `APP_VERSION === '0.7.18'`, `toolsBar` exists, `toolBtnCount === 7`,
  `sidebarToolsGone === true`, `headerHasNoRecInd === true`,
  `recBarHasTimer === true`.
- **Toolbar bug regression test** — select a text overlay, dispatch
  `mousedown` on a swatch, assert `selectedId` is unchanged; dispatch
  `click`, assert the text color became `#fbbf24`. Both pass.
- 1600×900 visual snapshot: tools bar above stage, prominent
  `● 00:00` next to ENREGISTRER, no header duplicate.

## v0.7.17 — 2026-04-11 (Free resize via Shift + single-pass ticker)

### Added
- **Non-proportional source resize via Shift+corner**. User feedback:
  *"allow not proportional video and window resigning"*. Default
  behaviour stays kid-safe (locked aspect ratio when you drag a corner
  handle); holding **Shift** breaks the lock so you can stretch the
  source freely. Reading `e.shiftKey` live in `Drag._onMove` means you
  can press/release Shift mid-drag. A toast `↔ Étire libre` fires when
  the user starts a Shift-drag so the modifier is discoverable.

### Changed
- **Ticker is now a single-pass marquee.** v0.7.13's exponential
  doubling padded short messages (`hi`) to fix the static-double
  bug, but it also turned a long custom message like
  `hello evry body` into a continuous wall of repetitions. User
  feedback: *"just one"*. Reverted to: text starts at the right
  edge (`padding-left: 100%`), scrolls all the way to the left
  (`translateX(-100%)`), then loops with a brief gap. Each message
  appears exactly once per loop.

### Verified (Preview MCP harness)
- Ticker: custom `hello evry body` → `tickerText` is exactly
  `'hello evry body'`, `(text.match(/hello/g) || []).length === 1`.
- Resize without Shift: 400×300 starting box, drag BR corner toward
  canvas (800, 700) → ends at 666.67×500 (ratio 1.3333 = original 4:3).
- Resize WITH Shift: same drag → ends at 600×500 (ratio 1.20, broken).

## v0.7.16 — 2026-04-11 (Toolbars docked outside the stage)

### Fixed
- **Source toolbar (✕ delete · 👁 hide · 📌 pin · shape) was hovering
  over the canvas.** Even though it's an HTML element and never appears
  in the recording, it still blocks part of the source visually while
  teaching, which is the same problem the canvas-drawn buttons had.
  User feedback: *"the tools x, eye shall never shown in record area.
  they interfere"*. Fixed `SourceToolbar.updatePosition` to ALWAYS dock
  the toolbar OUTSIDE the stage rectangle:
  - Default placement: 12 px below the stage's bottom edge
  - Fallback: 12 px above the stage's top edge if there's no room below
  - Horizontally still follows the source center, clamped to viewport
- **`TextToolbar` got the same docking treatment** for the same reason
  — text overlay color/font/✕ buttons used to hover over the headline
  the teacher was editing.

### Verified (Preview MCP harness)
- Fake source at center-stage → toolbar lands at viewport (655, 781),
  stage bottom 769 → `belowStage: true`, `overlapsStage: false`.
- No console errors on load.

## v0.7.15 — 2026-04-11 (Shapes as an option)

### Added
- **6 new source shapes** for video/screen layers: **pill**, **hexagon**,
  **octagon**, **diamond**, **star**, **heart**. Joined the existing
  `rect` / `rounded` / `circle`. All nine share the same centralized
  `_pathForShape` so the glow, background-blur ring, and clipping all
  use the exact same geometry.
  - Diamond / hexagon / octagon share a single regular-polygon branch
    parameterized by side count and rotation.
  - Star is a 5-point classic star with inner radius at 0.4× outer.
  - Heart is drawn with two cubic Béziers around a center notch.
  - Pill is a stadium shape (two semicircles on the short sides).
- **Shape picker dropdown** in the floating `SourceToolbar`, replacing
  the old `⬛ Shape` cycle button. `<select id="tcSrcToolbarShape">`
  with emoji-labelled options, synced to `s.shape` each frame via
  `updatePosition`, fires on `change`, stops click propagation so the
  drag layer doesn't steal the event. Styled via new `.tc-toolbar-select`.

### Verified (Preview MCP harness)
- Rasterized each shape into a 200×200 offscreen canvas at bbox 160×160
  and counted filled pixels to confirm distinct geometry:

    | shape    | filled px | notes                |
    |----------|-----------|----------------------|
    | rect     | 25600     | full bbox            |
    | rounded  | 25408     | ~1% corner rounding  |
    | circle   | 20343     | π×80² ≈ 20106        |
    | pill     | 20343     | degenerates to circle at w=h |
    | hexagon  | 16930     | ~66% of bbox         |
    | octagon  | 18294     | ~71% of bbox         |
    | diamond  | 12960     | 50% (rhombus)        |
    | star     |  7848     | ~31% (5-point)       |
    | heart    | 11163     | ~44%                 |

- Shape select is a `SELECT` element with 9 options.
- No console errors on load.

## v0.7.14 — 2026-04-11 (Settings sections + visible resize handles + text font picker)

Three live-feedback fixes pushed together.

### Added
- **Visible source resize handles** — `_drawSelectedSourceChrome` now
  draws 4 white-and-accent corner chiclets (28×28 canvas px) on the
  selected video/screen source. The hit-test radius (`Drag.CORNER_RADIUS`
  = 36 canvas px) hasn't changed — the chiclets just make it discoverable.
  Fixes user feedback "not resizable" — the handles existed under the
  hood, you just couldn't see them.
- **Text default font picker** — new `<select id="tcTextFontSelect">`
  in the right sidebar under the text presets. Bound to a new
  `TextOverlays.defaultFont` field that `add()` reads when the caller
  doesn't pass an explicit `opts.font`. Persisted in
  `localStorage['tc-text-default-font']`. Existing overlays can still
  cycle their font via the floating Aa button.

### Changed
- **Settings panel reorganized into 5 collapsible sections** using
  native `<details>` elements:
  1. 🌐 **Général** — language, theme  *(open by default)*
  2. 🎬 **Enregistrement** — sound, mirror, countdown, sensor overlay,
     jingle, output format  *(open by default)*
  3. 🏷 **Logo** — upload, bg-remove, size, opacity, filter, tint
  4. ✍️ **Slogan & effet** — slogan input, font, size, color, fun effect
  5. 📰 **Ticker** — custom messages textarea
  - New `.tc-set-section` / `.tc-set-summary` / `.tc-set-body` styles
    with rotating ▸ marker, hover background, fade-in animation.
  - Fixes user feedback *"flat, may be in sections independent."*

### Verified (Preview MCP harness)
- 5 sections present in the settings panel, summaries match labels.
- General (193 px) and Recording (251 px) open by default; Logo,
  Slogan, Ticker collapsed (41 px each).
- `TextOverlays.defaultFont` initializes to 0, picker bound to it.
- `SourceToolbar` still wired and positioning correctly.
- No console errors on load.

## v0.7.13 — 2026-04-11 (Ticker dedup + floating source toolbar)

Two live-screenshot fixes from user feedback.

### Fixed
- **Ticker doubled text** — a short custom message like `hi` rendered
  as `hi · hi` statically because the seamless-scroll technique used
  `padding-left: 100%` + `translateX(-100%)` + duplicated content in
  JS. When the doubled string was narrower than the container, both
  copies were visible simultaneously. Fix: switched to the standard
  marquee (translateX 0 → −50%, no padding-left) AND `renderTicker`
  now pads short input by exponential doubling until one-half ≥ 1.2×
  container width. Measured with real font via scrollWidth so any
  font/viewport combo works.

### Changed — floating source toolbar (Canva-style)
User feedback: *"X and Eye interfere with video. choose a better way?"*
The canvas-drawn red ✕ and 👁 buttons were positioned outside the
selected source box (at `x+w+40, y−40` and `x−40, y−40`). For a source
near any stage edge, those circles clipped off-canvas or overlapped
other sources/video content. Replaced with an HTML floating toolbar.
- New `<div class="tc-source-toolbar">` element + new `SourceToolbar`
  JS object that mirrors the existing `TextToolbar` pattern.
- Position:fixed, viewport coords, z-index 11000 → never clipped by
  the stage's `overflow:hidden`.
- Buttons: 👁 hide · 📌 pin/unpin · ⬛ shape cycle · ✕ delete.
- Follows the selected source each frame during drag/resize.
- Teacher-only (HTML, not canvas) → never visible in the recording.
- Old canvas chrome kept the dashed selection outline; removed the
  red ✕ / 👁 / hint label draws from `_drawSelectedSourceChrome`.

### Verified (Preview MCP harness)
- Custom ticker `hi` → track width 4576 px, half 2288 px > container
  1555 px × 1.15 → no static duplication visible.
- Fake source at canvas (800, 300, 480×270) → toolbar renders at
  viewport (840, 70), 214×46 px, above the source center.
- No console errors on load.

## v0.7.12 — 2026-04-11 (Layout optimization + Bismillah fix)

Two issues that both came out of live screenshots from the user.

### Fixed
- **Bismillah in header was clipping** — the single-character ligature
  `﷽` (U+FDFD) decomposes in Amiri on many systems and blew the
  container wide, making the ornaments/flourishes fall off the edges.
  Replaced with the spelled-out form `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ`
  at 15px with the same gradient background-clip:text treatment. Container
  is now 233 × 16 px and centers cleanly in the header at every viewport.
- **Responsive breakpoints** — 720 px down sizes the bismillah text to
  13 px; 480 px and below hides the ornaments/flourishes entirely so the
  text alone survives.

### Changed — layout optimization
User screenshot showed the app overflowing the viewport and the REC
button barely above the fold. Three targeted tweaks to give the stage
more room without cramping the sidebars.
- **Sidebars 240 → 220 px** and grid gap 16 → 12 px and padding 14/18
  → 10/14 px (`.tc-studio-grid`). Gains ~60 px of horizontal space for
  the canvas.
- **Stage max-height subtrahend 360 → 300 px** (`.tc-stage` and
  `.tc-sidebar`). Stage grows ~60 px taller on 1080 p screens.
- **Template strip tightened** — padding 8/14 → 5/12 px, margin 10/4
  → 6/2 px, min-height 38 → 30 px.
- **Studio card header tightened** — added explicit `padding: 8px 14px`
  override, and `.tc-studio` `padding-bottom` 12 → 8 px.

### Verified (Preview MCP harness)
- 1920×1080 — stage 1230×692 (was 960×540), REC button visible at
  y=1047.
- 1600×900 — stage 1033×581, REC button visible at y=867.
- Bismillah container 233×16 px, centered, `﴾﷽﴿` → spelled-out
  form renders correctly.

## v0.7.1 — 2026-04-11 (Canva polish)

The three Canva-inspired features I didn't fit into v0.7.0, shipped
as a quick follow-up.

### Added
- **Rotation** on every layer (source, text, brand). Rendered via
  `ctx.rotate` around the layer's center. Hotkeys for selected text
  overlays: `,` = −5°, `.` = +5°, `/` = reset to 0°. Brand rotates
  together with its "fun effect".
- **Layer ordering hotkeys** for the selected text overlay:
  - `[` / `]` move one step back/forward
  - `Shift+[` / `Shift+]` send to back / bring to front
- **Floating text color toolbar** (Canva-style), appears above the
  currently-selected text overlay:
  - 6 color swatches (white / yellow / orange / red / lime / cyan)
  - ↺ / ↻ rotate buttons
  - 📋 duplicate button
  - ✕ delete button
  - Position follows the selected layer each frame (Engine.render
    calls `TextToolbar.updatePosition()`)
  - HTML element, not drawn to canvas → teacher-only, invisible in
    the recording

### Verified (Preview MCP harness)
- Rotation hotkeys: 0 → 0.0873 → 0.1745 rad, reset → 0 ✓
- Layer ordering: `A,B,C` → `]` → `B,A,C` → `Shift+]` → `B,C,A` →
  `Shift+[` → `A,B,C` ✓
- Color swatch click: `item.color === '#fb923c'` ✓
- Toolbar rotate button updates rotation ✓
- Toolbar positions correctly above selected text ✓
- Toolbar hides on deselect ✓

## v0.7.0 — 2026-04-11

**Direct response to real user feedback** — finally got the smoke-test
screenshot I've been asking for. The user flagged five concrete gaps
(can't resize/move texts, can't resize videos, wanted filters, wanted
a logo/slogan system, wanted fullscreen) + four follow-ups ("Canva
ideas", keyboard hints, video shapes, source titles). All addressed.

### Added — 🖐 Unified drag + resize

- Drag system rewritten to handle three layer kinds in one hit-test:
  `source`, `text`, `brand`. Reverse z-order hit-test.
- 4 corner resize handles on every interactive layer (click within
  36 canvas-px of a corner = resize, anywhere else = move).
- Sources keep aspect ratio on resize; text overlays scale the font
  size; brand watermark resizes proportionally.

### Added — 📝 Text overlays, reborn

Pre-v0.7.0 text overlays were fixed at `(960, 120)` with auto-fade.
Now first-class draggable objects.

- Top-left `(x, y)` coords with auto-computed `w, h`
- Selection via click (dashed outline + 4 handles, accent color)
- Pin on first drag — preset texts cancel their 4s auto-fade
- `Delete` / `Backspace` removes the selected overlay
- `Ctrl/Cmd + D` duplicates the selection (Canva-style)

### Added — 🏷 Brand watermark

Custom logo + slogan + fun effects.

- PNG/SVG upload via FileReader → dataURL → localStorage
- Slogan text drawn under the logo with outlined fill
- 6 fun effects via canvas transform: `spin`, `pulse`, `bounce`,
  `wiggle`, `glow`, `rainbow`
- Draggable + resizable

### Added — 🎨 Per-source visual filters

8 presets via `ctx.filter`: `none`, `bw`, `sepia`, `bright`,
`contrast`, `vintage`, `cool`, `warm`. Zero deps.

### Added — 🔵 Per-source shape selector

Each source can be `rect`, `circle`, or `rounded` — switchable from
the Active Sources row. Drawn via shape clip in `drawSource()`.

### Added — 🏷 Per-source title chip

Broadcaster lower-third: type a title in the Active Sources row,
it renders as a rounded chip under the source with an accent bar.

### Added — ⛶ Maximize / fullscreen mode

New `⛶` button in the studio header hides all chrome and stretches
the stage to fill the viewport. Tries browser-level `requestFullscreen`
too. `Esc` exits.

### Added — 💡 Keyboard shortcut hints

Toasts pop up on tool activation (Zoom / Laser / Freeze / Draw) with
the relevant keyboard shortcuts — discoverable without opening help.

### Active Sources panel redesign

2-line rows: top = icon/name/pin/blur/remove, bottom = title input +
filter select + shape select.

### i18n
- 30 new keys × 3 languages.

### Verified (Preview MCP harness)
- `Drag._nearCorner`: TL click → 0, middle → -1
- TextOverlays: 208×132 bbox, pinned true, resize 208→282
- Source hit-test, row UI, filter strings, brand persistence
- Maximize toggle, Ctrl+D duplicate

## v0.6.0 — 2026-04-11

Polish / adoption round. Two Tier-2 polish features plus two
documentation improvements. All verified via the Preview MCP harness.

The honest caveat: I still recommend a real 45-minute smoke test
before considering any of these done. Every release since v0.2.2 has
been verified headlessly; none have been verified by a human with a
real camera + real micro:bit + real classroom. See the v0.2.2
CHANGELOG entry for why that matters.

### Added — 🎵 Intro jingle

Optional "show's starting" cue captured IN the recording.

- Four-note triangle-wave arpeggio: C5 → E5 → G5 → C6, total duration
  ~1.5 s
- Routes through `Engine.audioDest` so it's encoded into the video's
  audio track — not just a monitor sound
- Also connected to `audioCtx.destination` so the teacher hears it too
- Soft exponential gain envelope (no click artifacts)
- **Opt-in** via `🎵 Jingle d'intro` checkbox in Settings, default OFF
- Persisted via `tc-jingle` localStorage
- Fires from `Recorder.start()` after `recorder.start(250)` so the
  audio is definitely captured

Verified: object exists, 4 notes defined, enable/disable persists,
play() is a clean no-op when disabled, doesn't throw when enabled.

### Added — 🏆 Shareable badge card

Post-recording 1200×630 PNG (OpenGraph / social-card dimensions) with
the tutorial's stats, rendered via pure Canvas2D.

- **Captured at `Recorder.finish()`**: duration, cam count, screen
  count, micro:bit connected, chapter count, template used, current
  theme accent, timestamp
- **`BadgeCard.exportPng()`**: renders the card with a theme-accent
  gradient background, outer frame, TutoCast logo + version, headline,
  a 2×2 stat grid, template badge in the bottom-right corner if one
  was active, slogan + date footer
- Triggered from a new `🏆 Badge` button in the Take panel
- Download filename: `{basename}-badge.png`
- **Zero dependencies** — no deps, no cloud, no AI

Verified: capture stores correct stats (247 s, 2 cams, 1 screen,
1 micro:bit, 4 chapters, lesson template, accent #a3e635),
`exportPng()` produces a **709,819-byte PNG**.

### Added — "First time? Start here" callout (Help → How-to)

First-run teachers open the Help panel's How-to tab and see a new
highlighted orange callout above the 7 steps:

- **Title**: "⭐ Première fois ? Commence ici"
- **Body**: explains the <5-minute onboarding loop and the no-install
  promise
- **Teacher sub-callout** (green-bordered): explains the TutoCast
  mission for teachers specifically — teach code with a robot, use
  the "🤖 Démo robot" template, 100% local

All three text fields are i18n'd (FR/EN/AR).

### Added — README "For teachers" section

New top-level pitch section immediately after the headline, explaining:
- The zero-install / zero-account / zero-cloud promise
- The micro:bit-as-remote superpower (A=zoom, B=marker, tilt=laser)
- Template-guided workflow
- Silence trimmer
- Runs on a Chromebook
- "The first 5 minutes" walkthrough

### i18n
- 13 new keys × 3 languages (jingle label, badge card labels and
  strings, first-time callout title/body/teacher note, news_060
  entries).

### Verified (Preview MCP harness)
- Jingle: object present, 4 notes, disabled default, persistence,
  no-op when off, plays when on
- BadgeCard: capture records correct stats, exportPng produces
  710 KB PNG with correct filename
- DOM: tcJingleToggle, tcBadgeBtn, help-firsttime, help-firsttime-teacher
  all present
- i18n: 306 keys × 3 langs balanced, all HTML data-i18n resolves
- JS syntax: `node --check` OK

## v0.5.0 — 2026-04-11

Six features in one release. Four Tier-1 "this is what makes TutoCast
unique" items and two Tier-2 polish items. All verified end-to-end via
the Preview MCP harness.

Deliberately SKIPPED from the competitor-feature idea list: AI auto-
script (BYOK = mission pivot), gaze-aware PIP (MediaPipe = 3 MB dep),
click tracer (can't track cursor outside sandbox), retry-last-30s
(MediaRecorder can't rewind), dual output mode (niche), heatmap (no
cursor tracking), QR code (complexity). Documented reasons on request.

### Added — 🤖 micro:bit Superpowers

TutoCast's unique angle: because Web Bluetooth reads the accelerometer
and buttons, we can use the physical robot as a recording remote. No
other screen recorder on the planet can do this.

- **Button A = toggle zoom** (shipped in v0.3.0)
- **Button B = add chapter marker** (v0.5.0, edge-triggered on press)
- **Accelerometer tilt → laser position** (v0.5.0) while `Laser.on`.
  x/y accelerometer axes map to canvas x/y with easing (`0.3` per
  frame) so gentle tilts drive a smooth laser pointer. Clamped to
  [-1, 1] g's then scaled to ±45% of the canvas from center.
- Combined: the teacher holds the micro:bit in one hand, points at
  the robot with the other, and drives the whole recording without
  touching the keyboard.

### Added — 📈 Sensor timeline → CSV export

During any recording, if the micro:bit is connected, accelerometer
samples are throttled to ~20 Hz and logged to an in-memory buffer
via `SensorTimeline.sample()`. On `Recorder.finish()`, if any samples
exist, a third download link appears in the Take panel alongside the
`.webm` and `.vtt`:

- `{filename}-sensors.csv` with columns
  `t_seconds,accel_x,accel_y,accel_z,button_a,button_b`
- Timestamps are aligned to `Recorder.elapsed() / 1000` so the CSV
  maps directly onto the video timeline
- Hidden by default; only shown when samples exist
- Unique to TutoCast because of the Web Bluetooth integration —
  researchers and physics teachers can finally correlate robot
  motion with tutorial timestamps in a spreadsheet

### Added — 🔇 Silence trimmer

Biggest editor-parity feature after v0.3.0 Trim. Closes the dead-air
bounce reason. **Requires no AI and no dependencies.**

- After `Recorder.finish()`, `SilenceTrim.checkLastTake()` decodes the
  audio via `AudioContext.decodeAudioData`, computes RMS in 100 ms
  windows, finds runs below `0.015` threshold lasting ≥ 2 seconds,
  and inverts them into keep-ranges.
- If saved duration ≥ 0 s, the button
  `🔇 Remove silences (−N.Ns)` appears in the Take panel
- On click, `SilenceTrim.exportCleaned()` re-encodes via the same
  offscreen-canvas + MediaRecorder pipeline as the v0.3.0 Trim tool,
  walking each keep-range sequentially with seek + play + frame pump.
  Audio is routed through `createMediaElementSource` + silent
  `ConstantSourceNode` keepalive (same v0.2.2 fix pattern)
- Downloads as `{filename}-nosilence.{ext}` using the current format
  preference (MP4 or WebM)

Verified: a 3.3 s pure-silence test take was correctly identified
and offered for trimming with "−3.3s" in the button label.

### Added — 🎙 Live silence warning chip

Cheap-and-honest alternative to "uh/um detection" that every competitor
wants. We can't run Whisper (40 MB wasm = mission violation), but we
already have `Engine.analyser` feeding the VU meter.

- `SilenceWatch.start()` runs a RAF loop during active recording,
  reads the analyser every frame, computes RMS
- If RMS < 0.018 for more than 1800 ms, shows a `⚠ Tu es silencieux…`
  chip in the stage's top-left corner
- **Not drawn to the canvas** — the chip is an HTML element on top of
  the preview, invisible in the recorded file, visible to the teacher
  as a coaching hint only
- Animates a pulse via CSS keyframes so it's noticeable without being
  obnoxious

### Added — 📋 Quiz card overlay

Press `Q` mid-recording. Browser `prompt()` asks "What question do
you want to ask your students?". The answer becomes a big orange-
backgrounded text overlay (via the existing `TextOverlays` system),
visible in the recording, auto-fading after 6 seconds. Also drops
a `Quiz: {question}` chapter marker if recording is live.

Not interactive during playback — VTT doesn't really do that without
a custom player — but it forces students to pause and think, which
is the actual pedagogical win.

### Added — 🔊 Sensor-triggered 🤖 overlay

Opt-in toggle in the Settings panel (`🤖 Auto-overlay when the robot
jolts`). When enabled, the accelerometer callback computes
`|acceleration|` and, if it exceeds `1.6 g`, drops a big `🤖` text
overlay for 1.8 seconds. 3-second cooldown so continuous motion
doesn't spam the canvas. Fun, on-brand, unique to TutoCast.

### Changed — Sensors accelerometer callback

Previously just updated `this.values` and the HUD. Now also:
- Drives the laser position when `Laser.on` is true
- Feeds `SensorTimeline.sample()` during recording
- Detects jolts and drops the 🤖 overlay (opt-in)

Button B handler now edge-triggers `Chapters.addMarker()` on press.

### i18n
- 13 new keys × 3 languages (silence chip, silence-trim button, CSV
  label, quiz prompt, sensor overlay toggle, news_050 entries).

### Verified (Preview MCP harness)
- SensorTimeline: CSV header correct, 10+ samples written to rows
- Quiz: prompt → overlay `❓ Pourquoi le robot tourne à gauche?` + chapter
- Sensor overlay: magnitude 1.732 > 1.6 → 🤖 dropped
- Silence chip: `show` class added after 2.5 s simulated silence
- E2E recording: 172 KB MP4 + CSV download visible with correct filename
- Silence-trim scan: `−3.3s` detected on a pure-silent test take
- JS `node --check` passes, all objects present

## v0.4.0 — 2026-04-11

Drag-drop + three effects landed in one session. All verified end-to-end
via the Preview MCP harness.

### Added — 🖐 Drag-drop source repositioning

Every competitor has it. TutoCast now does too, with a twist that fits
the scene-based workflow.

- **Click-drag any visible source** (screen or cam) on the stage to
  reposition it. Hit-test iterates visible sources in reverse z-order
  (topmost first) with a proper circle/rect containment test.
- **Snaps to 7 anchors** (4 corners at 40 px margin, top-center,
  bottom-center, dead-center) within a 60 px radius. Keeps kid layouts
  clean without pixel-hunting.
- **Auto-pin on drag**: the moment you drag a source, it gets a
  `custom: true` flag. `setLayout` then explicitly skips it on every
  subsequent scene switch — so your carefully-placed facecam stays
  put when you press `1`, `2`, `3`, `4`, `5`, `6`.
- **Per-source 📌 / 🔓 toggle** in the Active Sources list to pin or
  unpin manually. Unpinning re-applies the current scene so the
  source snaps back to its template position.
- **"🔓 Reset layout" button** in the scenes sidebar clears every
  `custom` flag at once and re-runs the active scene, for when the
  user wants to start the layout over.
- **Constrained to canvas bounds** — sources can't be dragged off the
  1920×1080 frame.
- **Does not conflict with the whiteboard** — drag is silently
  suppressed while `Whiteboard.on` is true.

### Added — 📷 Background blur (per source)

Zoom-style virtual background, adapted for a web sandbox where we can't
ship a segmentation model.

- **Technique**: render the source twice when `src.blur` is true:
  1. Pass 1: blurred outer ring, clipped to the source shape,
     over-drawn by 12 px to hide `ctx.filter = 'blur(24px)'` edge
     artifacts.
  2. Pass 2: sharp inner 72% of the shape.
  For circular face-cams this fakes the "sharp face, blurred edges"
  look that webcam bokeh is supposed to produce. Not scientifically
  segmented — but for a centered face in a circle PIP it's a
  noticeable improvement against a busy background.
- **Per-source 🌫 toggle** in the Active Sources list.
- **No dependencies.** Uses only the standard Canvas2D `ctx.filter`
  property (Firefox 53+, Chrome 52+, Safari 9.1+).

### Added — ✨ Theme-accent glow (always on)

Replaces the old `rgba(255,255,255,.3)` 4-px stroke that was barely
visible. Now every source gets:

- A cached `--accent` color value from the active theme
- `ctx.shadowColor + shadowBlur: 30` around a double-stroked outline
- Refreshed automatically on theme change (`setTheme` triggers
  `Engine.refreshAccent()` after one tick so `:root` vars are applied)

Works for both circular and rectangular sources. Matches the 8 theme
palettes (jungle green, mosque gold, zellige, andalus, riad, medina,
space, robot).

### Added — 💓 Marker pulse

When the teacher hits `M` (or the Marker button) during recording, the
visible sources briefly scale up 5% and ease back over 800 ms. Sine
bell shape. Gives instant visual confirmation that the marker was
registered, reinforces the existing audio `Sfx.play('mark')` beep.

- `Recorder._pulseUntil` + `_pulseDur` state; `Chapters.addMarker()`
  sets the deadline.
- `Engine.drawSource()` computes `sin(phase * π) * 0.05` and applies
  it per-source.

### Changed — `Engine.drawSource` rewritten

The old version was 25 lines. The new one handles:

- Marker pulse scale
- Theme accent glow
- Optional background blur (two-pass with shape clipping)
- Mirror flag (extracted into `_drawVideoRespectingMirror` helper)
- Shape clip (rect or circle)

Still ~80 lines including the helper. No dependencies added.

### Changed — `setLayout` respects custom sources

Filters out `custom` sources at the top (`freeCams`, `freeScreen`)
instead of iterating all sources. Custom sources keep their visibility,
position, size, and shape across scene switches.

### Verified (Preview MCP harness, 1600×900)
- **Drag**: cam placed at (1480, 740) → dragged to (299, 300), `custom: true`
- **Snap**: target (50, 45) → snapped to (40, 40) TL corner ✓
- **Scene persistence**: scene switched to `robot`, dragged source stayed at (299, 300) ✓
- **Pin toggle**: flips `custom` flag ✓
- **Reset all**: clears `custom` on every source ✓
- **Blur toggle**: flips `src.blur` on/off ✓
- **Glow**: accent cached as `#a3e635` (jungle theme) ✓
- **Pulse**: `addMarker()` during recording sets `_pulseUntil` in the future ✓
- **Source list**: 3 icon buttons per row (pin, blur, remove) ✓
- **Reset layout button**: present in the scenes sidebar ✓

### i18n
- 6 new keys × 3 languages (pin/unpin/blur/remove/reset labels) + 7 news_040 keys × 3 langs.

## v0.3.0 — 2026-04-11

Three competitor-parity features, deliberately scoped tight. Built after
an honest audit of what Descript / ScreenStudio / Loom / Camtasia have
that TutoCast didn't — and what makes sense to build given the
"100% local, zero dependencies, kids + robots + Chromebook" mission.

### Added — ✂️ Trim (biggest feature)

Non-destructive post-recording trim. Closes the "wait, let me start over"
bounce reason that every screen recorder faces.

- **Trim button** in the Take panel (shows after every recording).
- **Modal UI**: the take's video, two draggable range sliders (green
  for start, orange for end), live duration readout, preview buttons
  that seek the player to each handle.
- **Export**: re-encodes via an offscreen canvas fed by a `<video>`
  element. Audio is routed through a dedicated `AudioContext` via
  `createMediaElementSource` → `MediaStreamDestination` + a permanent
  silent `ConstantSourceNode` (same keepalive pattern as v0.2.2 to
  avoid the MediaRecorder samples-empty stall). One re-encode pass.
  Slight quality loss, full codec control.
- **VTT chapter adjustment**: existing scene/marker chapters are
  shifted by `-inTime` and filtered to the new window. A new
  `{filename}-trim.vtt` drops out alongside the trimmed video.
- **Progress bar** during encoding (most visible on longer takes).
- **Zero dependencies.** No ffmpeg.wasm, no WebCodecs, no cloud.

Verified end-to-end via the Preview MCP harness:
- Source: 395 KB MP4 `video/mp4;codecs=avc1.420028,mp4a.40.2`, 3.16 s
- Trimmed: 112 KB MP4 `video/mp4`, 2.36 s (75% of original duration)
- Blob non-zero ✓, valid video type ✓, smaller than source ✓

### Added — 🔍 Manual zoom

ScreenStudio's killer feature, adapted to a web sandbox where we can't
capture clicks happening inside the shared screen window.

- **`Z` hotkey** — toggles zoom on/off.
- **Tools sidebar button** 🔍 Zoom.
- **micro:bit button A** — pressing the physical A button on a
  connected micro:bit toggles zoom (edge-triggered). Great for
  "teacher holds the robot, taps A to zoom in on the code demo."
- **Smooth ease**: the zoom level eases toward its target at ~18% per
  frame. ~200 ms to settle. No jarring pops.
- **Pivots around the cursor**: the zoom center is the last known
  mouse position over the stage, so it focuses wherever you were
  looking.
- **Text overlays and sensor HUD stay at 1x** so they remain readable
  while the sources are zoomed in.
- **Max scale: 1.8x** — enough to make code readable on 1920×1080.

Implemented as a canvas transform inside `Engine.render()`, applied
around the source drawing pass only.

### Added — 📼 Native MP4 export

Probe test confirmed all 4 MP4 mime variants supported on the preview's
Chromium. Safari has supported MP4 via MediaRecorder since 14.1.

- **`Recorder.pickMime()`** now has a priority list: MP4 variants
  before WebM when auto/user-picked, WebM-first when user prefers it.
- **Settings panel** has a new "Output format" dropdown:
  - Auto (MP4 if possible) — default
  - MP4 (H.264/AAC)
  - WebM (VP9/Opus)
  Persisted in `tc-format` localStorage key.
- **Filename extension** is derived from the actual chunk mime type
  (`Recorder.extForMime`), not the preference — cheaper and more
  accurate.

### Dropped from roadmap
- **AI transcript / speech chapters** — every local ASR option
  (Web Speech sends to Google, Whisper.cpp is 40+ MB, Transformers.js
  same) violates either the privacy-first or the zero-install mission.
  Existing VTT chapters (scene + marker + template-step) are already
  semantically richer for the kid+code+robot use case.
- **RNNoise mic upgrade** — baseline noise suppression already enabled
  via `getUserMedia({ audio: { noiseSuppression: true } })`. Not worth
  the complexity unless a real user complains.

### i18n
- 14 new keys × 3 languages (zoom, trim, format labels).

### Verified (Preview MCP, 1600×900)
- MP4 probe: `pickMime(auto)` → `video/mp4;codecs=avc1.42E01E,mp4a.40.2`
- Zoom: toggle on → ease to 1.800, toggle off → ease to 1.000
- Trim: 395 KB source → 112 KB trimmed MP4, real blob download triggered
- JS syntax: `node --check` OK
- i18n balance: unchanged across FR/EN/AR

## v0.2.4 — 2026-04-11

Reported: the working area is too small. Correct.

### Root cause

Three bottlenecks conspiring to squish the canvas preview:

1. **`.app { max-width: 1240px }`** — the TutoCast override of the base
   workshop-diy `820px` cap was still far too narrow. On a 1920px
   viewport you lost ~680px to margins; on 1600px you lost ~360px.
2. **`.tc-studio-grid { grid-template-columns: 220px 1fr 220px }`** —
   fixed sidebars plus a `1fr` center column. With a 1240px app and
   padding/gaps, the stage got ~748px wide → 420px tall at 16:9. Tiny.
3. **Sidebars had no height cap.** The scenes sidebar packs 6 scene
   buttons + 10 text presets + 5 tool buttons into ~839px of content.
   The grid's height equals the tallest child, so the sidebar forced
   the whole row to 839px tall, pushing the REC button 290px below
   the fold on a 900px viewport.

### Fixed
- **`.app` is now fluid**: `max-width: min(1760px, calc(100vw - 24px))`.
  Fills the viewport up to 1760px, then stops so sidebars don't stretch
  miles from the canvas on ultra-wide monitors.
- **`.tc-studio-grid`**: columns are `240px minmax(0, 1fr) 240px` with
  `gap: 16px`. The `minmax(0, 1fr)` is critical — without it, the grid
  cell refuses to shrink below the canvas's intrinsic size and layout
  blows out on narrow viewports. Sidebars get 20px more breathing
  room than before (220 → 240).
- **`.tc-stage` is capped by viewport height**: `max-height: calc(100vh
  - 360px)` plus a matching `max-width: calc((100vh - 360px) * 16/9)`
  so the 16:9 aspect ratio is preserved when the height cap kicks in
  (otherwise the width stays at the grid cell's 1fr and the shape
  distorts to ~1.81:1).
- **`.tc-sidebar` has `max-height: calc(100vh - 360px)` + `overflow-y:
  auto`** with a scoped scrollbar style. Grid height now equals stage
  height instead of tallest-sidebar, so REC stays above the fold.
- **`.tc-stage-wrap` gets `min-width: 0`** so it's allowed to shrink
  below the canvas's content size (needed for `minmax(0, 1fr)` to
  actually do its job).

### Verified at three breakpoints

| Viewport  | App width | Stage      | REC bottom | Aspect  |
|-----------|-----------|------------|------------|---------|
| 1920×1080 | 1760 cap  | 1174 × 660 | 1071 ≤ 1080 ✓ | 1.778 ✓ |
| 1600×900  | 1563 fluid| 960 × 540  | 891 ≤ 900 ✓   | 1.778 ✓ |
| 1366×768  | 1329 fluid| 725 × 408  | 759 ≤ 768 ✓   | 1.778 ✓ |

All three show perfect 16:9 canvas, REC button above the fold, and
sidebars scrolling internally when content overflows.

## v0.2.3 — 2026-04-11

Cosmetic pass on the splash. Three user-reported issues from the GitHub
Pages deployment.

### Fixed
- **Splash logo overlapping the title.** `.splash-logo` container was
  sized `120×65px` but its `<img>` child was intrinsically `128×128`, so
  the image overflowed 63px below the container and sat on top of the
  `.splash-title` text beneath it. The CSS at line 724 targeted
  `.splash-logo svg` (a selector that never matched since the child is
  an `<img>` element), so the `width:100%;height:100%` rule never
  applied. Fixed by sizing the container as a proper `140×140` square,
  setting `display:flex;align-items:center;justify-content:center` on
  it, and adding a `.splash-logo img, .splash-logo svg` rule that
  applies `width:100%;height:100%;object-fit:contain` to either child
  element type.
- **Splash-inner layout.** Converted to `display:flex;flex-direction:column;align-items:center`
  with explicit `padding` so every child element has clean vertical
  spacing instead of relying on legacy margins that didn't account for
  the squashed logo.

### Added
- **workshop-diy.org badge** (inline SVG link-chain icon) in two places:
  - A pill in the splash screen (`.splash-credit`) linking to
    workshop-diy.org, with a subtle pulse background.
  - Upgraded the footer link from plain text to text+icon using the same
    inline SVG.
  Both use `stopPropagation` on the splash so clicking the badge opens
  the workshop-diy site without dismissing the splash.
- **New slogan:** `🎬 Lumière, caméra, ROBOT !` (FR) / `🎬 Lights,
  camera, ROBOT!` (EN) / `🎬 أضواء، كاميرا، روبوت!` (AR).
  The old slogan was `Crée tes tutos comme un pro !` which read like a
  corporate SaaS pitch — wrong register for a kids' app about teaching
  code with robots. The new one is on-brand (the product IS for
  teaching with robots) and catchier. Applied to: splash, header
  subtitle, `<title>`, OpenGraph tag, FR/EN/AR i18n keys.

### Visual verification
- Measured via iframe probe after a cache-busted reload:
  - logo container: 140×140 ✓
  - image box: 140×140 ✓ (perfectly fits container, no overflow)
  - stack order: logo → title → sub → credit → hint ✓
  - no element's bottom edge falls below the next element's top
- All three passes green.

## v0.2.2 — 2026-04-11 (real hotfix, validated)

**v0.2.1 didn't actually fix the 0-byte recording bug.** I guessed five
plausible causes (captureStream caching, timeslice, bitrate fallback,
`onerror` handler, AudioContext resume) — none of them were the real
root cause. A full headless runtime test harness was built for this
version, exercising every button and pipeline stage autonomously, and
it pinpointed the actual bug in about ten minutes.

### Root cause

`Engine.audioDest = audioCtx.createMediaStreamDestination()` produces a
`MediaStream` with one audio track that is **structurally valid but
samples-empty** until a source node is connected to it. The user
hadn't picked a microphone yet, so nothing was ever connected. Firefox
and Chrome's `MediaRecorder` both responded to this idle audio track by:

1. Starting normally (`state === 'recording'`, no `onerror`)
2. Firing exactly **one** `ondataavailable` event with `size: 0`
3. Accepting `stop()` cleanly (`onstop` fires)
4. Never emitting any further data events

The video track was fine — when tested in isolation, `canvas.captureStream`
produced normal VP9 output. But **combining it with the silent audio track
caused MediaRecorder to output nothing at all**. This is the kind of
failure mode that only shows up when you actually inspect `chunk.size`,
which the code had never done.

### Fixed
- **Plug a permanent silent `ConstantSourceNode` into `audioDest`.**
  `Engine.init()` now creates a `ConstantSource → Gain(0) → audioDest`
  chain and starts the source immediately. The audio track is now
  actively carrying zero-amplitude samples at all times, which is
  enough for MediaRecorder to encode. Whether or not the user picks
  a mic, the recording works. Picking a mic later just adds another
  node to the destination — the keepalive stays running.
- **Blank template button UX.** Clicking 🎨 Vierge when a template
  was already active used to just hide the picker, leaving the
  old template running. Now it calls `Templates.clear()` first
  so the user genuinely starts fresh.

### Test harness
- Full headless runtime test pass via the Preview MCP tool, exercising:
  - DOM sanity (all wired IDs exist, init state correct)
  - Recorder pipeline isolated (canvas.captureStream → MediaRecorder)
  - Recorder pipeline full (Recorder.start → stop → finish → blob)
  - All 4 template cards + step jumping + close + reopen pill
  - All 6 scene buttons + layout math + active class
  - All 5 tools (laser/freeze/whiteboard/teleprompter/snapshot)
  - All 10 text presets + free-text prompt + canvas rendering
  - All hotkeys (1-6, R, P, M, S, L, F, D, Esc, Ctrl+Shift+D)
  - Hotkey ignored when an input is focused
  - i18n FR/EN/AR switching + RTL dir + theme labels
  - All 8 themes applied
  - All 3 panels (help/settings/log) + tabs + sound toggle + debug HUD
  - Log controls (clear/copy/export)
  - Badges unlocking + persistence + DOM rendering
  - Confetti burst + particle count
- **All 12 passes green on v0.2.2.**

### Notes
- Past v0.1.x / v0.2.0 / v0.2.1 recordings are still 0 bytes — the bug
  shipped for four releases. Apologies for the wild goose chase.
- The harness is now in `.claude/launch.json` and can be re-run via
  the Preview MCP `preview_start` tool any time regressions are
  suspected.

## v0.2.1 — 2026-04-11 (hotfix)

**Critical hotfix: the recording pipeline has been producing 0-byte webms
since v0.1.0.** Every "successful" recording since the initial release
silently wrote an empty file to disk. The preview canvas always worked,
the snapshot tool always worked, the REC button lit up, the timer ticked,
the chapter markers got created, the success toast and confetti fired —
but the downloaded `.webm` was 0 bytes every time. Surfaced the moment
a human actually tried to record something end-to-end instead of trusting
the UI state.

### Fixed
- **`Engine.getMasterStream()` called `canvas.captureStream(30)` fresh on
  every `Recorder.start()`**, which is a well-documented anti-pattern in
  both Chrome and Firefox: successive `captureStream()` invocations on
  the same canvas can hand back a video track that never delivers frames
  to `MediaRecorder`. Now cached in `Engine._canvasStream` on first use
  and the same video track is reused forever.
- **`MediaRecorder` had no `onerror` handler.** Any encoder failure
  (codec mismatch, stream issue, browser bug) was silently swallowed.
  Now logged to the activity panel and surfaced as a toast.
- **`ondataavailable` discarded zero-size chunks without logging them**,
  making it impossible to tell whether the encoder was never starting
  or starting-and-failing. Now every chunk is counted and the first
  three plus every 20th are logged with their size.
- **`Recorder.finish()` never checked `blob.size`.** A 0-byte blob was
  happily written to disk and announced as a success. Now detects it,
  shows `recEmpty` toast directing the user to the activity log, and
  aborts the download.
- **`Recorder.stop()` didn't force a final data flush.** Firefox has a
  history of unreliable implicit flushes at stop. Now calls
  `recorder.requestData()` right before `recorder.stop()`.
- **`recorder.start(1000)` timeslice was too large.** Recordings shorter
  than 1s would buffer nothing and the implicit flush at stop() — if it
  even happened — was the only chance to capture data. Reduced to 250 ms
  so even a 500 ms take produces multiple chunks.
- **`AudioContext` was never resumed.** Chrome and Firefox start the
  audio context in `suspended` state until the user triggers it. The
  audio destination in `Engine.audioDest` therefore produced a silent
  but structurally-valid audio track, which is a known trigger for
  MediaRecorder to delay or skip the first keyframe. `Recorder.start()`
  now calls `Engine.audioCtx.resume()` before anything else.
- **Double-`start()` race during the 3-2-1 countdown.** The hotkey
  handler's `state === 'idle' ? start : stop` branch could trigger two
  parallel `start()` calls if the user pressed `R` twice during countdown
  (state was still `'idle'` during the countdown `await`). Now guarded
  by a `_starting` latch and an explicit state check.

### Added
- **Startup diagnostic logging**: canvas stream track counts, mime type
  chosen, video track ready-state, per-chunk byte counts, total bytes
  at finish, and final file size in MB on success. All visible in the
  📜 Activity Log panel. If this still produces an empty file on someone's
  machine, the log will tell us exactly which stage is failing.
- **`recorderError`, `recEmpty`, `recNoStream` i18n keys** in FR/EN/AR.
- **`Engine.init()` now calls `this.render()` once synchronously** after
  setting up canvases, so the first frame is committed to the canvas
  before `captureStream()` is first invoked by the recorder. Also
  protects against a theoretical race where the recorder starts before
  the RAF loop has produced its first frame.

### How to verify the fix
1. Open the app, grant camera/screen permissions.
2. Pick any template or add a screen + cam manually.
3. Hit the big REC button, wait 5 seconds, press STOP.
4. Expected: the download is a non-zero `.webm` file, the activity log
   shows chunk events like `📦 chunk #1: 14523 B (total 14523 B)`, and
   the finish line says `⏹ ... — X.Y MB`.
5. If it's still 0 bytes: open 📜 Activity Log, copy the lines, and hand
   them over. The diagnostic output will pinpoint the broken stage.

## v0.2.0 — 2026-04-11

First real product lever: **guided templates**. The biggest drop-off point
was the blank canvas on first launch. Templates replace "figure out which
scene goes where" with a 10-second checklist.

### Added
- **3 guided templates** with a 5-step sequence each:
  - 📚 **Cours complet** — Intro → Théorie → Démo → Exercice → Conclusion
  - 🤖 **Démo robot** — Présentation → Code → Robot → Capteurs → Bilan
  - 🔧 **Correction** — Bug → Analyse → Fix → Test → OK
- **Template picker card** that opens on first launch (replaces the old
  generic 4-step onboarding). Also reopenable via the "Pick a template"
  pill below the studio.
- **Persistent step strip** below the studio grid. Shows the 5 steps as
  clickable chips, highlights the current step, marks previous steps as
  done. Clicking a step:
  - switches to that step's suggested scene
  - adds a chapter marker with the step's label if recording is live
- **`Scenes.reapply()`** — re-applies the active scene layout to newly
  added sources. So you can pick a template *before* plugging a cam and
  the cam still lands in the template's slot when added.
- **30 new i18n keys × 3 languages** for all template labels, step names,
  intro texts, and the picker UI.

### Changed
- **Legacy onboarding card removed** from the HTML. The `tc-onboarded`
  localStorage key is reused by the template picker to track first launch.
  The legacy `onb*` i18n keys are kept (harmless) for now.
- **Source addition now auto-positions** by re-applying the current scene.
  Previously, adding a cam after picking a scene left it at its default
  stagger position regardless of the scene's layout.

## v0.1.2 — 2026-04-11

Full code audit pass. One critical runtime bug, several i18n/UX gaps, and
a pile of dead code closed.

### Fixed
- **Critical — whiteboard strokes were being erased ~30×/s by the laser.**
  `Laser.setup` installed a `setInterval(33ms)` that unconditionally called
  `clearRect` on the shared `overlayCanvas` — the same canvas `Whiteboard`
  drew into. Strokes survived 16-33 ms and then vanished, in-preview *and*
  in the recording. Laser now owns a dedicated offscreen canvas; `Engine.render`
  composites it per-frame and the interval is gone.
- **Version tag was `v0.1.0` everywhere** in the shipped v0.1.1 build
  (`APP_VERSION`, 4 footer badges, studio subtitle, News panel). All bumped
  to v0.1.2.
- **Free-text prompt was hard-coded French** (`prompt('Texte à afficher :')`).
  New i18n key `promptFreeText` across FR/EN/AR.
- **Teleprompter placeholder was hard-coded French** in HTML and the toggle
  only translated it when the initial French literal matched. Added
  `data-i18n="promptTelePlaceholder"` and a `hasUserText` guard in
  `applyI18n` so language switches never clobber user text.
- **FAQ lied about hotkeys** — claimed `T = quick text` and `Space = show/hide
  webcam` (unimplemented), and `L = hold`. Aligned all three language FAQs
  and the HTML fallback with the actual hotkey handler.
- **Freeze / Whiteboard / Laser / TextOverlays state leaked across takes.**
  `Recorder.finish()` now calls `resetSceneState()` which clears freeze,
  drawings, laser, and floating texts.
- **Device labels stayed blank** after permission grant. `Engine.addCamera`
  and `setMic` now call a new `refreshDeviceList()`. Dead `Engine.enumerateDevices`
  removed, init path unified.
- **Whiteboard mousemove was bound to `window`** → lines continued to be
  computed against the stage bounding box when the cursor left it. Now
  scoped to `stage`, with `mouseleave` ending the stroke.
- **Object URLs were never revoked.** `finish()` now tracks the previous
  take's URLs and revokes them on the next `finish()` or New Take click.
- **`srcCamBtn` crashed on empty dropdown** (`sel.options[-1].textContent`).
  Now guarded with a `needCamSelected` toast.
- **MediaRecorder fallback dropped the 4 Mbps bitrate target.** Fallback
  chain is now `{mime+bitrate} → {bitrate only} → {defaults}`.
- **Hotkey handler ignored all `Ctrl`/`Meta` combos**, making it impossible
  to add modifier shortcuts. Now allows the new `Ctrl+Shift+D` debug HUD.

### Added
- **Sound effects system** (`Sfx`, Web Audio). Plays a short beep on rec
  start/stop/pause/resume/marker. Wired to the previously-dead
  `soundToggle` checkbox, persisted in `localStorage` as `tc-sfx`.
- **Debug HUD** (FPS + JS heap). Toggled with `Ctrl+Shift+D`. Previously
  declared in HTML but never updated — now fully wired via `DebugHud`
  and `Engine.fps` tracking.
- **Translated theme picker.** The `t_*` i18n keys were present but the
  `<option>` elements hard-coded English. Added `data-i18n` attributes.
- **News panel entries for v0.1.1 and v0.1.2**, with 13 new i18n keys
  (`news_011*`, `news_012*`) added in all three languages.
- **`beforeunload` cleanup** — stops all media tracks, ends the recorder
  mid-take if needed, and revokes any dangling blob URLs. The browser's
  red mic/cam indicator turns off promptly on tab close.
- **`laserOff` i18n key** — the old code logged a hard-coded `'⚪ Laser off'`
  string.

### Removed
- `Pet` stub (no-op `setMood` placeholder that never animated anything).
- Dead i18n keys `disconnected`, `connected`, `working`, `readyToRecord`
  (defined in all three languages, never referenced).

### Notes
- Line counts: `tutocast.js` ~1680 L, `index.html` 452 L. Zero dependencies.
- All 169+ i18n keys remain balanced across FR / EN / AR.

## v0.1.1 — 2026-04-10

Bug fixes after the first full runtime test pass (UI buttons, i18n, scenes,
tools, panels, hotkeys, ticker — all exercised in a real Chrome instance via
Bash-background ruby HTTP server + Chrome-in-Chrome automation).

### Fixed
- **Double emoji in scene buttons** (`"💻💻 Code"` instead of `"💻 Code"`):
  the emoji was rendered twice — once as the standalone `.tc-scene-icon` span,
  once inside the `scene_*` i18n label itself. Stripped the emoji from the
  6 `scene_*` keys across EN / FR / AR so the icon slot is the single source
  of truth.
- **41 i18n keys referenced by `data-i18n` but missing from `LANG`**: all
  FAQ questions/answers (`faq_q1..q8` + `faq_a1..a8`), how-to steps
  (`howto_1..howto_7`), wiki entries (`wiki_multicam*`, `wiki_scenes*`,
  `wiki_sensor*`, `wiki_privacy*`), and the v0.1.0 changelog entries
  (`news_010` + `news_010_1..9`) were only present as HTML fallback text in
  French. Switching to English or Arabic left them untranslated. Added all
  41 keys × 3 languages = 123 new translation entries. The three `LANG`
  blocks are now perfectly balanced at **169 keys each**.

### Notes
- Zero runtime errors or console warnings during the full test pass.
- All 6 scenes, 10 text presets, 4 tools, 3 panels, 4 help tabs, 8 themes,
  3 languages, ticker, and every hotkey (1-6, L, F, D, Esc) verified working.
- Remaining untested paths require real device permissions (screen capture,
  getUserMedia camera/mic) and live recording — documented in README.

## v0.1.0 — 2026-04-10

First release. Kids-friendly browser-based multi-camera tutorial recorder.

### Added
- **Multi-source capture**: screen/window/tab via `getDisplayMedia`, up to 3
  simultaneous cameras via `getUserMedia`, 1 mic with live VU-meter.
- **1920×1080 canvas composition engine** running at 30 fps via
  `requestAnimationFrame`, with per-source position/size/shape (rect or
  circle) and optional mirror.
- **6 scene presets** with hotkeys 1–6:
  - 💻 Code (screen full + face PIP)
  - 🤖 Robot (first cam full + face PIP)
  - 🎛 Capteurs (second cam full + face PIP)
  - 💻🤖 Code + Robot (screen 60% + robot 40% + face PIP)
  - 🎬 Studio (2×2 grid)
  - 👋 Toi (face cam full)
- **Live recording** via `MediaRecorder` (WebM VP9 + Opus), 4 Mbps video.
- **3-2-1 countdown** overlay before recording (toggleable in settings).
- **Pause/Resume/Stop** with live timer and pulsing REC indicator.
- **Automatic chapters** — every scene switch creates a chapter, exported
  as a sidecar `.vtt` file alongside the `.webm`.
- **Live markers** with `M` key, counted as chapters.

### Live tools
- **🔴 Laser pointer** (`L`) — cursor becomes a glowing red dot, visible in recording
- **❄️ Screen freeze** (`F`) — freeze canvas via `getImageData`, mic keeps recording
- **✏️ Whiteboard** (`D`) — draw directly on the overlay canvas, persists across frames
- **📜 Teleprompter** — floating script over the preview, **NOT drawn on the canvas** (visible to teacher only, excluded from the recording)
- **📸 Snapshot** (`S`) — download current canvas frame as PNG

### Text overlays
- 10 preset kid-friendly texts (⭐ Bravo, 🎯 Étape 1–3, 👀 Regarde, 💡 Astuce, ⚠️ Attention, 🙈 Oups, 💪 À toi, 🎉 Fini).
- Preset texts auto-fade after 4 seconds, free texts stay until removed.
- Rounded badge style with outline for readability.

### micro:bit sensors (Chrome/Edge only)
- One-click pairing via **Web Bluetooth API** (accelerometer + button services).
- Live X/Y/Z accelerometer readings + button A/B states.
- Values displayed as an overlay on the recording canvas in real time.
- UUIDs: `e95d0753-...` (accel service), `e95d9882-...` (button service).

### Kids UX polish
- **Animated SVG logo**: clapperboard that "claps" every 3 seconds.
- **News ticker** at the bottom with 10 rotating trilingual tips, pausable.
- **Onboarding card** on first launch with 4 friendly steps.
- **Achievement badges** (6 total): first tutorial, over 5 min, multi-cam, all scenes, marker king, micro:bit plugged. Persisted in `localStorage`.
- **Confetti explosion** when a recording completes.
- Default theme **Jungle** (vivid green/orange).
- **Trilingual UI**: 🇫🇷 FR (default) · 🇬🇧 EN · 🇩🇿 AR with full RTL.

### Privacy & architecture
- 100% local, zero backend, zero telemetry, zero third-party calls at runtime (except Google Fonts CSS in `<head>`, removable).
- Single-file app: `index.html` + `tutocast.js` + `style.css`, no build step.
- Workshop-DIY template shell kept for themes + splash + panels.

### Known limits
- Requires Chrome or Edge desktop for full feature set (Web Bluetooth).
- Firefox works for recording but not for micro:bit sensors.
- iOS / Safari Mobile not supported (no screen capture API).
- Audio is mic only — system audio capture requires BlackHole on macOS.
- Output is WebM only; MP4 requires post-conversion with ffmpeg or similar.
