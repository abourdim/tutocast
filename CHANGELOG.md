# Changelog

All notable changes to **TutoCast** are documented here. This project follows
[Keep a Changelog](https://keepachangelog.com/) and [Semantic Versioning](https://semver.org/).

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
