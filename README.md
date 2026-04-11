# 🎬 TutoCast

> **Crée tes tutos comme un pro !** — A kids-friendly, browser-based multi-camera
> screen recorder. Designed for teachers explaining code with a micro:bit and
> a robot. Zero install, zero account, zero cloud.

TutoCast is a single-page web app that lets you record tutorial videos with up
to **3 cameras + 1 screen + 1 microphone simultaneously**, compose them into
live-switchable scenes, annotate with on-screen text, freeze the screen mid-
explanation, draw on it, and even **read your micro:bit sensors live via Web
Bluetooth** — all from the browser, without installing anything. The final
tutorial downloads as a `.webm` with a `.vtt` chapter file. Trilingual FR /
EN / AR, 8 visual themes, huge red REC button, confetti at the end.

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

### 🖐 Drag & drop layout (v0.4.0)
- **Click-drag any source** on the stage to reposition it
- **Auto-pins** the source so scene switches won't move it back
- **Snaps to 7 anchors** (corners + edge centers + center) within 60 px
- **📌 / 🔓 toggle** per source to pin / unpin manually
- **Reset layout** button to release every source back to scene control

### ✨ Effects (v0.4.0)
- **Background blur** (🌫 per source) — sharp center, blurred edge ring, no ML model
- **Theme-accent glow** around every visible source (follows the 8 themes)
- **Marker pulse** — sources briefly scale on every `M` keypress

### ✂️ Post-recording trim (v0.3.0)
- Open the recorded take in the built-in trim modal
- Drag two handles to pick the final start/end points
- Preview each handle with a one-click seek
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
