# 🎬 TutoCast

> **Crée tes tutos comme un pro !** — A kids-friendly, browser-based multi-camera
> screen recorder. Designed for teachers explaining code with a micro:bit and
> a robot. Zero install, zero account, zero cloud.

TutoCast is a single-page web app that lets you record tutorial videos with up
to **3 cameras + 1 screen + 1 microphone simultaneously**, compose them into
live-switchable scenes, annotate with on-screen text, freeze the screen mid-
explanation, draw on it, and even **read your micro:bit sensors live via Web
Bluetooth** — all from the browser, without installing anything. The final
tutorial downloads as a `.webm` (or `.mp4`) with a `.vtt` chapter file and
an optional `.csv` sensor timeline. Trilingual FR / EN / AR, 8 visual themes,
huge red REC button, confetti at the end.

---

## 👩‍🏫 For teachers (the actual pitch)

TutoCast is built for **one specific person**: a teacher explaining code with
a robot. If that's you, here's what you get that nobody else offers:

- **No install, no account, no cloud.** Open `index.html` in a Chromebook.
  Everything stays on your computer. Legal / parental / GDPR friendly.
- **One tool for everything.** Screen + face cam + robot cam + mic + live
  scene switching + whiteboard + laser + markers + chapters + trim +
  silence removal — without leaving the browser.
- **The micro:bit IS your remote.** Button A zooms in, button B drops a
  chapter marker, tilting the robot drives the laser pointer. Hands-free
  recording while you hold the robot.
- **Guided templates.** Pick `📚 Full lesson`, `🤖 Robot demo`, or
  `🔧 Fix-it` on first launch and TutoCast walks you through a 5-step
  sequence. Zero decision fatigue.
- **Smart silence trimmer.** One click after Stop removes all the "umm..."
  pauses. No external editor.
- **Kid-friendly.** 10 colorful text stickers, confetti on finish, big
  red REC button, achievement badges, 8 visual themes.
- **Runs on a Chromebook.** No dependencies, no install, no RAM hog.

**The first 5 minutes:** grant cam/mic permissions → pick the `🤖 Démo robot`
template → connect your micro:bit via the `📡 Connecter micro:bit` button →
hit the big red REC → the template guides you through Intro / Code / Robot /
Sensors / Recap. Press `M` for a marker, `Q` for a quick quiz card. When
you Stop, the trim tool offers to remove silences and the badge card
generates a shareable PNG of your tutorial's stats.

---

## 🎯 Built for teaching code with robots

The original use case: a teacher explaining code running on a **BBC micro:bit**,
with the **robot moving on a table** and an **IHM/sensor** visible on a separate
camera, while **talking to the class**. TutoCast composes all these angles into
one video with scene presets for every stage of the tutorial:

| # | Scene | Layout |
|---|---|---|
| 1 | 💻 **Code** | Screen full + face cam PIP |
| 2 | 🤖 **Robot** | Robot cam full + face cam PIP |
| 3 | 🎛 **Capteurs** | Sensor cam full + face cam PIP |
| 4 | 💻🤖 **Code + Robot** | Screen left 60% / robot right 40% + face cam PIP |
| 5 | 🎬 **Studio** | 2×2 grid: screen + all cams |
| 6 | 👋 **Toi** | Face cam full (intro/outro) |

Switch between them in real time during the recording using number keys **1-6**.

---

## ✨ Features

### 🎬 Guided templates
- **3 kid-friendly presets**: 📚 Full lesson, 🤖 Robot demo, 🔧 Fix-it
- Each template sets an initial scene, drops a welcome text, and lays out a
  **5-step sequence** (chips under the studio) that you click through
- Clicking a step switches the scene AND adds a chapter marker in real time
- Cams added after picking a template **inherit the layout** automatically
- Opens automatically on first launch, reopenable via the "Pick a template" pill

### 📹 Capture & composition
- Screen / window / tab capture via `getDisplayMedia`
- Up to **3 simultaneous cameras** (USB webcams + internal + Continuity Camera)
- Mic input with live VU-meter
- 1920×1080 canvas composition @ 30 fps
- Mirror webcam toggle, per-source shape (rectangle or circle)
- 6 ready-made scenes, instantly switchable

### 🎬 Live recording tools
- **🔴 Laser pointer** (`L`) — your cursor becomes a glowing red dot, recorded in the video
- **❄️ Screen freeze** (`F`) — freeze the screen capture while mic keeps recording, perfect for explaining a specific state
- **✏️ Whiteboard** (`D`) — draw directly on the video with the mouse
- **🔍 Smooth zoom** (`Z`, or micro:bit button A) — ease into a 1.8× focus on the cursor, tap again to zoom out
- **📜 Teleprompter** — paste your script, it floats over the preview (**visible to you only**, NOT in the recording)
- **📸 Snapshot** (`S`) — download a PNG of the current frame
- **🏷 Markers** (`M`) — tag moments in the recording, exported as chapters

### 🤖 micro:bit as a recording remote (v0.5.0)
- **Button A** — toggle zoom
- **Button B** — add a chapter marker
- **Tilt the robot** (accelerometer) — drives the laser pointer position while `L` is on
- **Sensor timeline → CSV** dropped alongside the `.webm` and `.vtt` on every take where the micro:bit was connected. Columns: `t_seconds, accel_x, accel_y, accel_z, button_a, button_b`

### 🔇 Smart silence trimming (v0.5.0)
- **Auto-detects silences > 2s** in the recorded audio after every take
- Offers a one-click `🔇 Remove silences (−N.Ns)` button in the Take panel
- Re-encodes cleanly via the same offscreen-canvas pipeline as Trim — no external editor
- **Live silence warning chip** flashes on the stage (visible to you only, not in the recording) when the mic has been quiet > 1.8 s

### 📋 Quick teaching overlays (v0.5.0)
- **`Q` key** — drop a quiz card on the canvas with a question you type
- **`🤖 overlay` on robot jolt** — opt-in Settings toggle, fires a robot sticker whenever accel magnitude > 1.6 g

### 🖐 Drag & drop layout (v0.4.0 → v0.7.17)
- **Click-drag any source** on the stage to reposition it
- **Auto-pins** the source so scene switches won't move it back
- **Snaps to 7 anchors** (corners + edge centers + center) within 60 px
- **📌 / 🔓 toggle** per source to pin / unpin manually
- **Reset layout** button to release every source back to scene control
- **Visible 4-corner resize handles** on the selected source (v0.7.14)
- **Shift+corner** = **free stretch** (aspect ratio unlocked), default = locked (v0.7.17)

### 💠 9 source shapes (v0.7.15)
Every video/screen source can be clipped to any of **9 shapes**, picked
from a dropdown in the floating source toolbar:
- **Rect** · **Rounded** · **Circle** · **Pill** · **Hexagon** ·
  **Octagon** · **Diamond** · **Star** · **Heart**
- All shapes share the same centralized canvas path so the glow ring,
  background-blur, and clip mask use identical geometry.

### 🎨 Floating toolbars (v0.7.13 → v0.7.18)
When you select a source or a text overlay, a Canva-style HTML toolbar
docks **below the stage** (never over the recording area):
- **Source toolbar**: 👁 hide · 📌 pin · shape dropdown · ✕ delete
- **Text toolbar**: 6 color swatches · Aa font cycle · 🎭 transparency ·
  ↺ ↻ rotate · 📋 duplicate · ✕ delete
- HTML elements — never appear in the recording
- **Horizontal tools bar** above the studio (v0.7.18 → v0.7.23):
  Laser · 💧 Ripples · Freeze · Draw · Zoom · 🎯 AutoZoom · Teleprompter ·
  Snapshot · Fullscreen. 9 buttons total with kbd shortcut chips.
  Responsive: labels hide under 920 px.

### 📜 Broadcast teleprompter (v0.7.20)
Press `T` or click the 📜 button to open a Canva-style script overlay
with real broadcast controls:
- **Auto-scroll** via ⏵/⏸ button + speed slider (10-120 px/s)
- **A− / A+** font size (12-72 px), **↔− / ↔+** width (30-100 %)
- **↻ Reset** scroll back to top
- **Persistent script** — every keystroke saves to localStorage and
  reloads on page open
- **HTML only** — never drawn on the output canvas, never in the recording

### 🎯 Auto-zoom on click (v0.7.21)
ScreenStudio's signature feature, baked in: toggle the 🎯 button and
click anywhere on a screen-type source. The preview smoothly zooms in
at the click point for 1.5 s then eases back out. Built on top of the
existing `Zoom` object — it detects click-vs-drag (< 5 canvas px AND
< 500 ms) and only fires over screen sources, never cameras.

### 💧 Click ripples (v0.7.23)
Every `mousedown` on the stage emits an **animated two-ring ripple**
that expands and fades over 600 ms — outer ring in theme accent, inner
ring in white. Rendered on the output canvas (unlike the teleprompter),
so the ripples ARE in the final recording. Opt-in via the 💧 button.

### ⌨ Keyboard cheat sheet (v0.7.24)
Press `?` (or `Shift+/`) to see **all 22 keyboard shortcuts** grouped
into 5 categories (Recording / Tools / Scenes / Text / Misc) in a
full-screen overlay. Styled `<kbd>` chips, accent-green card,
backdrop-click to dismiss.

### 🎬 Cinematic intro/outro cards (v0.7.25)
Opt-in toggle adds a **2.5 s intro card** (brand title + scene name
+ "Action !") at the start of every recording and a **2 s outro card**
(Merci ! + badge summary) at the end. Both baked into the output
canvas via radial-gradient backdrop + accent glow + big typography.

### ⏸ Auto-pause on tab switch (v0.7.26)
Opt-in setting: when you tab away from TutoCast mid-recording,
`visibilitychange` triggers `Recorder.autoPause()`. Come back → auto-resume.
Never capture accidental tab switches again. A user who manually paused
before tabbing away stays paused (no surprise resume).

### 📈 micro:bit sensor mini-chart (v0.7.27)
When a recording with micro:bit samples finishes, a compact canvas
chart appears above the download buttons showing the accelerometer
X/Y/Z lines over the take duration, plus button A/B presses as
vertical ticks at the bottom. Auto-scales to observed range.
Unique to TutoCast — no other tutorial tool surfaces sensor data
this way.

### 📊 My tutorials history (v0.7.28)
New collapsible "📊 Mes tutos" panel below the Badges strip shows
your **last 10 takes** with date, duration, file size, scene count,
and badge count. Metadata only (no video blobs), persisted as
`tc-history` in localStorage. Aggregate "N · total duration" stat
in the footer, plus a 🗑 Clear history button.

### ✨ Effects (v0.4.0)
- **Background blur** (🌫 per source) — sharp center, blurred edge ring, no ML model
- **Theme-accent glow** around every visible source (follows the 8 themes)
- **Marker pulse** — sources briefly scale on every `M` keypress

### ✂️ Post-recording trim (v0.3.0 → v0.7.22)
- Open the recorded take in the built-in trim modal
- **Visual scrubber** with draggable in/out handles + live playhead
  (v0.7.22) in addition to the fallback range sliders
- **Click-to-seek** anywhere on the scrubber track
- **✂ Auto-cut silences** — one-click detection of silent regions
  (`OfflineAudioContext` RMS analysis, −45 dBFS threshold, ≥ 2 s), with
  faint bands on the scrubber and in/out auto-set to the first non-silent
  window
- **Keyboard shortcuts** inside the modal: `Space` play/pause,
  `← / →` nudge 1 s, `[ / ]` set in/out, `Enter` export, `Esc` close
- **Live duration readout**: `00:12 / 00:47 (trim 34 s)`
- **Export** → new file with a single re-encode pass (offscreen canvas + MediaRecorder)
- **VTT chapters automatically adjusted** and filtered to the new window
- 100% local, zero deps, zero cloud — same engine as the main recorder

### ✏️ Text overlays
- 10 preset kid-friendly texts: ⭐ Bravo, 🎯 Étape 1, 👀 Regarde, 💡 Astuce, 🙈 Oups, 💪 À toi, 🎉 Fini
- Preset texts auto-fade after 4s; free texts stay until you remove them
- Animated rounded badge style with outline for readability on any background

### 🤖 micro:bit sensors (Chrome/Edge only)
- One click to pair via **Web Bluetooth**
- Live readout of accelerometer (X/Y/Z) and buttons A/B
- Values displayed as an overlay on the video in real time
- Perfect for showing "watch the sensor change as I tilt the robot"
- **No other screencast tool does this.**

### 🎥 Recording
- **WebM** (VP9 + Opus) via `MediaRecorder`
- **3-2-1 countdown** before recording (toggleable)
- Pause / Resume / Stop controls + live timer
- **Automatic chapters** — every scene switch creates a chapter, exported as `.vtt`
- Auto-download the `.webm` (and `.vtt`) at the end of each take
- Preview the last take inline with replay button

### 🎨 Kid UX polish
- Default **Jungle** theme (vivid green/orange, playful)
- 8 visual themes (Jungle, Mosque, Zellige, Andalous, Riad, Médina, Space, Robot)
- **Trilingual UI**: 🇫🇷 FR (default) · 🇬🇧 EN · 🇩🇿 AR (with RTL)
- **Animated clapperboard logo** in the header + scrolling news ticker with 10 rotating tips
- **Achievement badges**: 🎬 First tutorial, ⏱ Over 5 minutes, 🎥 Multi-camera, 🎭 All scenes used, 🏷 Marker king, 🤖 micro:bit plugged
- **Confetti** explosion when a recording completes
- **Onboarding card** on first launch with 4 friendly steps

### 🔒 Privacy
- **100% local**. Nothing leaves your computer.
- Video streams are processed in-browser, composed on a canvas, recorded in memory via MediaRecorder, downloaded to disk.
- No accounts, no analytics, no telemetry, no third-party calls.
- The remote code for anyone who gets access to your computer is nothing, because there's nothing stored except UI preferences in `localStorage`.

---

## ⚠️ Browser compatibility

| Feature | Chrome / Edge desktop | Firefox | Safari | Mobile |
|---|---|---|---|---|
| Screen capture | ✅ | ✅ | ✅ | ❌ (iOS blocks it) |
| Multi-camera | ✅ | ✅ | ✅ | ❌ |
| Recording (WebM) | ✅ VP9 | ✅ VP8 | ❌ (Safari records MP4 only) | ❌ |
| **Web Bluetooth (micro:bit)** | ✅ | ❌ | ❌ | ❌ |
| File System Access | ✅ | ❌ | ❌ | ❌ |

**Recommended: Chrome or Edge on desktop.** The core recording works on Firefox
too, but you lose the micro:bit sensor integration.

---

## 🚀 Quick start

### Option 1 — local file (simplest)
```bash
git clone https://github.com/abourdim/tutocast.git
cd tutocast
open index.html    # macOS
```

### Option 2 — local HTTP server (cleaner, required for PWA install)
```bash
cd tutocast
python3 -m http.server 8000
# open http://localhost:8000/
```

### First use
1. Allow camera + microphone permissions when prompted
2. In the **Sources** panel (left): click "+ Ajouter" next to **Écran**, pick a screen/window
3. Pick a camera from the dropdown, click **+** (repeat to add more)
4. Pick your microphone
5. Click a scene preset on the right (💻 Code, 🤖 Robot, etc.)
6. Hit the big 🔴 **ENREGISTRER** button
7. Use keys **1-6** to switch scenes, **L** for laser, **F** to freeze, **D** to draw
8. Click **⏹ Stop** — your tutorial downloads automatically

---

## ⌨️ Keyboard shortcuts

| Key | Action |
|---|---|
| `R` | Start / Stop recording |
| `P` | Pause / Resume |
| `M` | Add a marker (creates a chapter) |
| `1` – `6` | Switch to scene N |
| `L` | Toggle laser pointer |
| `F` | Freeze / unfreeze screen |
| `D` | Toggle whiteboard drawing mode |
| `Z` | Toggle smooth zoom (cursor-centered, 1.8×) |
| `S` | Take a photo snapshot |
| `Esc` | Close all panels |
| `Q` | Quiz card — drop a question overlay mid-recording (v0.5.0) |
| `Ctrl+Shift+D` | Toggle debug HUD (FPS + memory) |
| `micro:bit A` | Same as `Z` — toggle zoom from the physical robot button |
| `micro:bit B` | Same as `M` — add a chapter marker (v0.5.0) |
| `micro:bit tilt` | Drive the laser pointer position (v0.5.0, requires laser on) |

---

## 📁 Project structure

| File | Lines | Purpose |
|---|---|---|
| `index.html` | ~440 | UI shell: header, studio grid, sidebars, rec bar, panels, ticker |
| `tutocast.js` | ~900 | All app logic: i18n, engine, sources, scenes, recorder, tools, Web BT, badges, confetti, ticker |
| `style.css` | ~1500 | 8 themes + responsive layout (inherited from workshop-diy) + TutoCast studio styles |
| `manifest.json` | ~12 | PWA manifest |
| `icon.svg` | ~25 | PWA icon (static clapperboard + play + LED) |
| `logo.svg` | ~30 | Animated header logo (clap that claps every 3s) |

No build step, no dependencies, no `node_modules`. Just open `index.html` or run `python3 -m http.server`.

---

## 🙏 Credits

TutoCast is built on top of the **[Workshop-DIY web app template](https://github.com/abourdim)**
by abourdim — themes, splash, panels, and the i18n / log shell are inherited
from that template. The recording engine, scene system, sensor overlay, and
all TutoCast-specific logic live in `tutocast.js`.

---

## 📄 License

MIT — see [LICENSE](./LICENSE).
