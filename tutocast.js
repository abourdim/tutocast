/* ═══════════════════════════════════════════════════════════════════
   TutoCast v0.1.2 — kids-friendly multi-cam screen recorder
   Single-file app logic. Zero dependencies. Chrome/Edge desktop.

   Architecture:
     1. i18n  (LANG + applyI18n)
     2. Shell (splash, panels, log, toast, themes)
     3. Engine (sources manager, canvas renderer, scenes manager)
     4. Recorder (MediaRecorder + chapters VTT)
     5. Live tools (laser, freeze, whiteboard, teleprompter, snapshot)
     6. micro:bit sensors (Web Bluetooth)
     7. Kid polish (sfx, debug HUD, badges, confetti, ticker)
     8. Onboarding + wiring
   ═══════════════════════════════════════════════════════════════════ */

const APP_VERSION = '0.1.2';
const $ = (id) => document.getElementById(id);

/* ─────────── 1. i18n ─────────── */

const LANG = {
  fr: {
    title: 'TutoCast', slogan: '🎬 Crée tes tutos comme un pro !',
    statusIdle: 'Prêt', statusRec: 'Enregistrement', statusPaused: 'Pause',
    sources: 'Sources', sourceScreen: 'Écran', sourceCam: 'Caméra', sourceMic: 'Micro',
    selectCam: '— choisis —', selectMic: '— choisis —', add: '+ Ajouter',
    activeSources: 'Sources actives', sensors: 'Capteurs', btConnect: 'Connecter micro:bit',
    scenes: 'Scènes', texts: 'Textes', addText: 'Texte libre',
    tools: 'Outils', laser: 'Laser', freeze: 'Geler', whiteboard: 'Dessiner',
    teleprompter: 'Teleprompter', snapshot: 'Capture photo',
    recStart: 'ENREGISTRER', recStop: 'STOP', pause: 'Pause', mark: 'Marker', stop: 'Stop',
    download: 'Télécharger', downloadChapters: 'Chapitres (.vtt)', newTake: 'Nouveau tuto',
    badgesTitle: 'Tes badges',
    onbTitle: 'Salut ! Prêt à faire ton premier tuto ?',
    onb1: 'Choisis tes caméras et ton écran (panneau de gauche)',
    onb2: "Choisis une scène prête, ou crée la tienne",
    onb3: "Appuie sur le gros bouton rouge 🔴 et c'est parti !",
    onb4: 'Ton tuto est téléchargé automatiquement à la fin',
    onbGo: "C'est parti !",
    stageHint: '👆 Ajoute une source pour commencer',
    mainSection: 'Studio', mainDesc: 'Compose ta scène et enregistre',
    mirrorCam: '🪞 Miroir webcam', countdownOn: '⏱ Compte à rebours 3-2-1',
    scene_code: 'Code', scene_robot: 'Robot', scene_sensors: 'Capteurs',
    scene_coderobot: 'Code + Robot', scene_studio: 'Studio', scene_you: 'Toi',
    txt_bravo: '⭐ Bravo !', txt_step1: '🎯 Étape 1', txt_step2: '🎯 Étape 2', txt_step3: '🎯 Étape 3',
    txt_watch: '👀 Regarde', txt_tip: '💡 Astuce !', txt_careful: '⚠️ Attention', txt_oops: '🙈 Oups !',
    txt_yourturn: '💪 À toi !', txt_done: '🎉 Fini !',
    tip_1: '💡 Appuie sur 1-9 pour changer de scène instantanément',
    tip_2: '✏️ Clique droit sur le canvas pour ajouter un texte',
    tip_3: '🎨 8 thèmes dispos dans les Paramètres ⚙️',
    tip_4: '🎥 Jusqu\'à 3 caméras + écran + micro',
    tip_5: '⭐ Parle fort, souris, amuse-toi !',
    tip_6: '🎯 Un tuto = préparer, enregistrer, partager',
    tip_7: '💾 Tes vidéos restent sur ton ordi, rien n\'est envoyé en ligne',
    tip_8: '🤖 Tuto micro:bit ? Essaie la scène "Code + Robot"',
    tip_9: '🧠 Commence par la scène "Toi" pour ton intro',
    tip_10: '🎬 Appuie sur R pour démarrer/arrêter l\'enregistrement',
    news: 'Nouveautés',
    activityLog: '📜 Journal', eventsMsg: 'Événements et messages',
    clear: 'Effacer', copy: 'Copier', theme: 'Thème',
    settings: '⚙️ Paramètres', language: 'Langue',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    soundEffects: '🔊 Effets sonores',
    splashHint: 'appuyer pour passer',
    export: 'Exporter', filterAll: 'Tout',
    copied: 'Copié !', copyFail: 'Échec',
    logCleared: 'Journal effacé',
    ready: '🚀 TutoCast prêt !',
    needSources: '⚠️ Ajoute au moins une source avant d\'enregistrer',
    recStarted: '🔴 Enregistrement démarré',
    recStopped: '⏹ Enregistrement terminé',
    recPaused: '⏸ Pause',
    recResumed: '▶ Reprise',
    markerAdded: '🏷 Marker ajouté',
    snapshotSaved: '📸 Photo téléchargée',
    sceneChanged: '🎭 Scène',
    textAdded: '✏️ Texte ajouté',
    laserOn: '🔴 Laser activé', laserOff: '⚪ Laser désactivé',
    freezeOn: '❄️ Écran gelé',
    freezeOff: '▶ Écran repris',
    drawOn: '✏️ Mode dessin',
    drawOff: '✏️ Mode dessin désactivé',
    teleOn: '📜 Teleprompter visible',
    teleOff: '📜 Teleprompter caché',
    promptTelePlaceholder: 'Colle ton script ici…', promptFreeText: 'Texte à afficher :',
    btConnected: '📡 micro:bit connecté !',
    btError: '❌ Connexion micro:bit échouée',
    permissionDenied: '🔒 Permission refusée. Autorise la caméra dans les réglages du navigateur.',
    needCamSelected: '⚠️ Choisis une caméra dans la liste d\'abord',
    badge_first: 'Premier tuto',
    badge_long: 'Plus de 5 min',
    badge_multi: 'Multi-caméras',
    badge_all_scenes: 'Toutes les scènes',
    badge_marker_king: 'Roi des markers',
    badge_micro: 'micro:bit branché',
    faq_q1: "Qu'est-ce que TutoCast ?",
    faq_a1: "TutoCast est un outil web pour enregistrer des tutos vidéo avec plusieurs caméras (écran + webcams + micro) directement depuis ton navigateur. Zéro install, zéro compte, tout reste chez toi.",
    faq_q2: "Comment ajouter plusieurs caméras ?",
    faq_a2: "Dans le panneau de gauche, choisis une caméra dans la liste et clique sur « + ». Tu peux répéter pour ajouter jusqu'à 3 caméras (ex. une pour ton robot, une pour toi, une pour l'écran du micro:bit).",
    faq_q3: "Je peux lire les capteurs de mon micro:bit ?",
    faq_a3: "Oui ! Clique sur « 📡 Connecter micro:bit » dans le panneau de gauche. Ton navigateur va demander l'autorisation de se connecter en Bluetooth. Une fois connecté, les valeurs des capteurs (accéléromètre, luminosité, boutons) s'affichent en overlay sur ta vidéo. ⚠️ Chrome/Edge uniquement.",
    faq_q4: "Quels sont les raccourcis clavier ?",
    faq_a4: "R = Rec/Stop · P = Pause · M = Marker · 1-6 = Changer de scène · L = Laser (on/off) · F = Geler l'écran · D = Dessiner · S = Capture photo · Échap = Fermer les panneaux",
    faq_q5: "Mes vidéos sont privées ?",
    faq_a5: "100%. Rien ne quitte ton ordi. L'enregistrement reste dans la mémoire du navigateur et se télécharge directement sur ton disque. Aucun compte, aucune analytique, aucun serveur.",
    faq_q6: "Quel format de sortie ?",
    faq_a6: "WebM (VP9 + Opus). Lisible dans VLC, Chrome, Firefox, YouTube, et Davinci Resolve. Pour convertir en MP4, utilise ffmpeg ou un outil en ligne comme cloudconvert.com.",
    faq_q7: "Le teleprompter est visible dans ma vidéo ?",
    faq_a7: "Non, jamais. Le teleprompter s'affiche par-dessus l'aperçu uniquement pour toi. Il n'est pas dessiné sur le canvas qui compose la vidéo, donc il n'apparaît pas dans l'enregistrement final.",
    faq_q8: "Navigateur recommandé ?",
    faq_a8: "Chrome ou Edge desktop. Firefox marche pour l'enregistrement mais pas pour Web Bluetooth (micro:bit). Safari ne supporte ni les capteurs ni certaines options audio. iOS n'est pas supporté car Safari Mobile bloque la capture d'écran.",
    howto_1: "Branche tes caméras USB (si besoin) et autorise l'accès quand le navigateur te le demande.",
    howto_2: "Dans le panneau Sources à gauche, ajoute ton écran, tes caméras et choisis ton micro.",
    howto_3: "Clique sur une des scènes pré-réglées à droite (Code, Robot, Studio…) — la composition change instantanément.",
    howto_4: "Ajoute un texte depuis la bibliothèque (⭐ Bravo, 🎯 Étape 1…) — il apparaît en overlay.",
    howto_5: "Clique sur le gros bouton 🔴 ENREGISTRER. Compte à rebours 3-2-1, puis ça tourne.",
    howto_6: "Utilise les touches 1-9 pour changer de scène en live. L pour laser pointer, F pour geler l'écran, D pour dessiner.",
    howto_7: "Clique ⏹ Stop. Ton tuto est téléchargé en .webm, avec les chapitres en .vtt.",
    wiki_multicam_title: "🎥 Multi-caméras",
    wiki_multicam: "TutoCast peut afficher simultanément jusqu'à 3 caméras + 1 écran + le micro. Chaque source est une boîte déplaçable dans la scène. Tu peux définir sa forme (rectangle ou cercle), sa taille et sa position.",
    wiki_scenes_title: "🎭 Scènes",
    wiki_scenes: "Une scène est un layout : position/taille/visibilité de chaque source + textes actifs. Tu peux switcher entre les scènes pendant l'enregistrement avec les touches 1-9 ou en cliquant. Cut sec, pas de latence.",
    wiki_sensor_title: "🤖 Capteurs micro:bit",
    wiki_sensor: "Via Web Bluetooth, TutoCast se connecte directement au micro:bit et lit en temps réel ses capteurs (accéléromètre, luminosité, température, boutons). Les valeurs s'affichent en overlay sur la vidéo, parfait pour expliquer un capteur à des élèves.",
    wiki_privacy_title: "🔒 Privacy",
    wiki_privacy: "Tout reste local. Les flux vidéo sont traités par le navigateur, compositionnés sur un canvas, et enregistrés en mémoire via MediaRecorder. Le fichier final est téléchargé sur ton disque. Aucun serveur, aucune télémétrie.",
    news_010: "Première version de TutoCast 🎉",
    news_010_1: "Multi-caméras (écran + jusqu'à 3 cams + micro)",
    news_010_2: "6 scènes prêtes à l'emploi (Code, Robot, Capteurs, Code+Robot, Studio, Toi)",
    news_010_3: "Textes overlay avec bibliothèque de presets kid-friendly",
    news_010_4: "Outils live : laser pointer, gel d'écran, whiteboard, teleprompter",
    news_010_5: "Capteurs micro:bit via Web Bluetooth (Chrome/Edge)",
    news_010_6: "Chapitres automatiques exportés en .vtt",
    news_010_7: "Markers live (touche M) + captures photo (touche S)",
    news_010_8: "Badges de progression + confetti à la fin",
    news_010_9: "Trilingue FR/EN/AR, 8 thèmes visuels",
    news_011: "Premier test complet en runtime : 2 bugs corrigés 🧪",
    news_011_1: "Double emoji corrigé dans les boutons de scène",
    news_011_2: "41 clés i18n manquantes ajoutées (FAQ, wiki, how-to, changelog)",
    news_012: "Audit complet et correctifs majeurs 🔧",
    news_012_1: "Fix critique : les traits du tableau blanc étaient effacés en continu par le laser",
    news_012_2: "Effets sonores activables dans les paramètres (démarrage, stop, pause, marker)",
    news_012_3: "HUD de debug (FPS + mémoire) via Ctrl+Shift+D",
    news_012_4: "i18n complet du placeholder teleprompter et du prompt texte libre",
    news_012_5: "Les libellés des caméras/micros se rafraîchissent après autorisation",
    news_012_6: "Nettoyage automatique des flux et blobs à la fermeture de l'onglet",
    news_012_7: "Reset des outils (laser/gel/dessin/textes) entre les prises",
    news_012_8: "Thèmes traduits, raccourcis FAQ alignés sur le code réel",
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus',
    t_riad: 'Riad', t_medina: 'Médina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
  },
  en: {
    title: 'TutoCast', slogan: '🎬 Make your tutorials like a pro!',
    statusIdle: 'Ready', statusRec: 'Recording', statusPaused: 'Paused',
    sources: 'Sources', sourceScreen: 'Screen', sourceCam: 'Camera', sourceMic: 'Mic',
    selectCam: '— choose —', selectMic: '— choose —', add: '+ Add',
    activeSources: 'Active sources', sensors: 'Sensors', btConnect: 'Connect micro:bit',
    scenes: 'Scenes', texts: 'Texts', addText: 'Free text',
    tools: 'Tools', laser: 'Laser', freeze: 'Freeze', whiteboard: 'Draw',
    teleprompter: 'Teleprompter', snapshot: 'Photo snapshot',
    recStart: 'REC', recStop: 'STOP', pause: 'Pause', mark: 'Marker', stop: 'Stop',
    download: 'Download', downloadChapters: 'Chapters (.vtt)', newTake: 'New tutorial',
    badgesTitle: 'Your badges',
    onbTitle: 'Hi! Ready for your first tutorial?',
    onb1: 'Pick your cameras and screen (left panel)',
    onb2: 'Choose a ready-made scene, or create your own',
    onb3: 'Hit the big red button 🔴 and go!',
    onb4: 'Your tutorial downloads automatically at the end',
    onbGo: "Let's go!",
    stageHint: '👆 Add a source to get started',
    mainSection: 'Studio', mainDesc: 'Compose your scene and record',
    mirrorCam: '🪞 Mirror webcam', countdownOn: '⏱ 3-2-1 countdown',
    scene_code: 'Code', scene_robot: 'Robot', scene_sensors: 'Sensors',
    scene_coderobot: 'Code + Robot', scene_studio: 'Studio', scene_you: 'You',
    txt_bravo: '⭐ Well done!', txt_step1: '🎯 Step 1', txt_step2: '🎯 Step 2', txt_step3: '🎯 Step 3',
    txt_watch: '👀 Watch', txt_tip: '💡 Tip!', txt_careful: '⚠️ Careful', txt_oops: '🙈 Oops!',
    txt_yourturn: '💪 Your turn!', txt_done: '🎉 Done!',
    tip_1: '💡 Press 1-9 to switch scenes instantly',
    tip_2: '✏️ Right-click the canvas to add a text',
    tip_3: '🎨 8 themes in Settings ⚙️',
    tip_4: '🎥 Up to 3 cameras + screen + mic',
    tip_5: '⭐ Speak loud, smile, have fun!',
    tip_6: '🎯 A tutorial = prepare, record, share',
    tip_7: '💾 Your videos stay on your computer',
    tip_8: '🤖 micro:bit tutorial? Try the "Code + Robot" scene!',
    tip_9: '🧠 Start with the "You" scene for your intro',
    tip_10: '🎬 Press R to start/stop recording',
    news: 'News',
    activityLog: '📜 Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', theme: 'Theme',
    settings: '⚙️ Settings', language: 'Language',
    help: '❓ Help', faq: 'FAQ', howto: 'How-to', wiki: 'Wiki',
    soundEffects: '🔊 Sound effects',
    splashHint: 'tap to skip',
    export: 'Export', filterAll: 'All',
    copied: 'Copied!', copyFail: 'Copy failed',
    logCleared: 'Log cleared',
    ready: '🚀 TutoCast ready!',
    needSources: '⚠️ Add at least one source before recording',
    recStarted: '🔴 Recording started',
    recStopped: '⏹ Recording stopped',
    recPaused: '⏸ Paused',
    recResumed: '▶ Resumed',
    markerAdded: '🏷 Marker added',
    snapshotSaved: '📸 Photo saved',
    sceneChanged: '🎭 Scene',
    textAdded: '✏️ Text added',
    laserOn: '🔴 Laser on', laserOff: '⚪ Laser off',
    freezeOn: '❄️ Screen frozen',
    freezeOff: '▶ Screen live',
    drawOn: '✏️ Draw mode',
    drawOff: '✏️ Draw mode off',
    teleOn: '📜 Teleprompter on',
    teleOff: '📜 Teleprompter off',
    promptTelePlaceholder: 'Paste your script here…', promptFreeText: 'Text to display:',
    btConnected: '📡 micro:bit connected!',
    btError: '❌ micro:bit connection failed',
    permissionDenied: '🔒 Permission denied. Allow camera in browser settings.',
    needCamSelected: '⚠️ Pick a camera from the list first',
    badge_first: 'First tutorial',
    badge_long: 'Over 5 minutes',
    badge_multi: 'Multi-camera',
    badge_all_scenes: 'All scenes used',
    badge_marker_king: 'Marker king',
    badge_micro: 'micro:bit plugged',
    faq_q1: "What is TutoCast?",
    faq_a1: "TutoCast is a web tool to record tutorial videos with multiple cameras (screen + webcams + mic) directly from your browser. Zero install, zero account, everything stays on your computer.",
    faq_q2: "How do I add multiple cameras?",
    faq_a2: "In the left panel, pick a camera from the dropdown and click +. Repeat to add up to 3 cameras (e.g. one on your robot, one on you, one on the micro:bit screen).",
    faq_q3: "Can I read my micro:bit sensors?",
    faq_a3: "Yes! Click 📡 Connect micro:bit in the left panel. Your browser will ask for Bluetooth permission. Once connected, sensor values (accelerometer, light, buttons) appear as overlay on your video. ⚠️ Chrome/Edge only.",
    faq_q4: "What are the keyboard shortcuts?",
    faq_a4: "R = Rec/Stop · P = Pause · M = Marker · 1-6 = Switch scene · L = Laser (toggle) · F = Freeze screen · D = Draw · S = Photo snapshot · Esc = Close panels",
    faq_q5: "Are my videos private?",
    faq_a5: "100%. Nothing leaves your computer. The recording stays in the browser memory and downloads directly to your disk. No account, no analytics, no server.",
    faq_q6: "What output format?",
    faq_a6: "WebM (VP9 + Opus). Plays in VLC, Chrome, Firefox, YouTube, and Davinci Resolve. To convert to MP4, use ffmpeg or an online tool like cloudconvert.com.",
    faq_q7: "Is the teleprompter visible in my video?",
    faq_a7: "No, never. The teleprompter shows over the preview for you only. It is not drawn on the composing canvas, so it does not appear in the final recording.",
    faq_q8: "Recommended browser?",
    faq_a8: "Chrome or Edge desktop. Firefox works for recording but not for Web Bluetooth (micro:bit). Safari supports neither the sensors nor some audio options. iOS is unsupported because Safari Mobile blocks screen capture.",
    howto_1: "Plug in your USB cameras (if needed) and allow access when the browser asks.",
    howto_2: "In the Sources panel on the left, add your screen, your cameras, and pick your microphone.",
    howto_3: "Click one of the preset scenes on the right (Code, Robot, Studio…) — the composition changes instantly.",
    howto_4: "Add a text from the library (⭐ Bravo, 🎯 Step 1…) — it appears as an overlay.",
    howto_5: "Click the big 🔴 RECORD button. 3-2-1 countdown, then it rolls.",
    howto_6: "Use keys 1-9 to switch scenes live. L for laser pointer, F to freeze the screen, D to draw.",
    howto_7: "Click ⏹ Stop. Your tutorial downloads as .webm with chapters in .vtt.",
    wiki_multicam_title: "🎥 Multi-camera",
    wiki_multicam: "TutoCast can display up to 3 cameras + 1 screen + the mic simultaneously. Each source is a draggable box in the scene. You can set its shape (rectangle or circle), size and position.",
    wiki_scenes_title: "🎭 Scenes",
    wiki_scenes: "A scene is a layout: position/size/visibility of each source + active texts. You can switch between scenes during the recording with keys 1-9 or by clicking. Hard cut, no latency.",
    wiki_sensor_title: "🤖 micro:bit sensors",
    wiki_sensor: "Via Web Bluetooth, TutoCast connects directly to the micro:bit and reads its sensors in real time (accelerometer, light, temperature, buttons). Values show as overlay on the video, perfect for explaining a sensor to students.",
    wiki_privacy_title: "🔒 Privacy",
    wiki_privacy: "Everything stays local. Video streams are processed by the browser, composed on a canvas, and recorded in memory via MediaRecorder. The final file is downloaded to your disk. No server, no telemetry.",
    news_010: "First release of TutoCast 🎉",
    news_010_1: "Multi-camera (screen + up to 3 cams + mic)",
    news_010_2: "6 ready-made scenes (Code, Robot, Sensors, Code+Robot, Studio, You)",
    news_010_3: "Text overlays with kid-friendly preset library",
    news_010_4: "Live tools: laser pointer, screen freeze, whiteboard, teleprompter",
    news_010_5: "micro:bit sensors via Web Bluetooth (Chrome/Edge)",
    news_010_6: "Automatic chapters exported as .vtt",
    news_010_7: "Live markers (M key) + photo snapshots (S key)",
    news_010_8: "Progress badges + confetti at the end",
    news_010_9: "Trilingual FR/EN/AR, 8 visual themes",
    news_011: "First full runtime test pass: 2 bugs fixed 🧪",
    news_011_1: "Double emoji in scene buttons fixed",
    news_011_2: "41 missing i18n keys added (FAQ, wiki, how-to, changelog)",
    news_012: "Full audit pass + major fixes 🔧",
    news_012_1: "Critical fix: whiteboard strokes were being wiped by the laser every frame",
    news_012_2: "Sound effects toggle in settings (start, stop, pause, marker)",
    news_012_3: "Debug HUD (FPS + memory) via Ctrl+Shift+D",
    news_012_4: "Teleprompter placeholder and free-text prompt fully i18n",
    news_012_5: "Camera/mic labels refresh automatically after permission grant",
    news_012_6: "Clean shutdown of streams and blobs on tab close",
    news_012_7: "Tools (laser/freeze/draw/texts) reset between takes",
    news_012_8: "Themes translated, FAQ hotkeys aligned with actual code",
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus',
    t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
  },
  ar: {
    title: 'TutoCast', slogan: '🎬 اصنع دروسك كالمحترفين!',
    statusIdle: 'جاهز', statusRec: 'يسجّل', statusPaused: 'إيقاف مؤقت',
    sources: 'المصادر', sourceScreen: 'الشاشة', sourceCam: 'الكاميرا', sourceMic: 'الميكروفون',
    selectCam: '— اختر —', selectMic: '— اختر —', add: '+ إضافة',
    activeSources: 'المصادر النشطة', sensors: 'المستشعرات', btConnect: 'اتصال micro:bit',
    scenes: 'المشاهد', texts: 'النصوص', addText: 'نص حر',
    tools: 'الأدوات', laser: 'ليزر', freeze: 'تجميد', whiteboard: 'رسم',
    teleprompter: 'تيليبرومبتر', snapshot: 'لقطة',
    recStart: 'تسجيل', recStop: 'إيقاف', pause: 'إيقاف مؤقت', mark: 'علامة', stop: 'إيقاف',
    download: 'تحميل', downloadChapters: 'فصول (.vtt)', newTake: 'درس جديد',
    badgesTitle: 'شاراتك',
    onbTitle: 'أهلاً! جاهز لأول درس؟',
    onb1: 'اختر كاميراتك وشاشتك', onb2: 'اختر مشهدًا جاهزًا',
    onb3: 'اضغط على الزر الأحمر 🔴', onb4: 'سيتم تحميل درسك تلقائيًا',
    onbGo: 'هيّا!',
    stageHint: '👆 أضف مصدرًا للبدء',
    mainSection: 'الاستوديو', mainDesc: 'اصنع مشهدك وسجّل',
    mirrorCam: '🪞 مرآة', countdownOn: '⏱ عدّ تنازلي 3-2-1',
    scene_code: 'كود', scene_robot: 'روبوت', scene_sensors: 'مستشعرات',
    scene_coderobot: 'كود + روبوت', scene_studio: 'استوديو', scene_you: 'أنت',
    txt_bravo: '⭐ أحسنت!', txt_step1: '🎯 الخطوة 1', txt_step2: '🎯 الخطوة 2', txt_step3: '🎯 الخطوة 3',
    txt_watch: '👀 انظر', txt_tip: '💡 نصيحة!', txt_careful: '⚠️ انتبه', txt_oops: '🙈 أخطأت!',
    txt_yourturn: '💪 دورك!', txt_done: '🎉 انتهى!',
    tip_1: '💡 اضغط 1-9 لتبديل المشاهد',
    tip_2: '✏️ انقر بالزر الأيمن لإضافة نص',
    tip_3: '🎨 8 مظاهر في الإعدادات',
    tip_4: '🎥 حتى 3 كاميرات + شاشة + ميكروفون',
    tip_5: '⭐ تكلّم بصوت عالٍ!',
    tip_6: '🎯 تحضير، تسجيل، مشاركة',
    tip_7: '💾 فيديوهاتك تبقى على حاسوبك',
    tip_8: '🤖 جرّب مشهد "كود + روبوت"',
    tip_9: '🧠 ابدأ بمشهد "أنت"',
    tip_10: '🎬 اضغط R للتسجيل',
    news: 'جديد',
    activityLog: '📜 سجل النشاط', eventsMsg: 'الأحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', theme: 'المظهر',
    settings: '⚙️ الإعدادات', language: 'اللغة',
    help: '❓ مساعدة', faq: 'أسئلة', howto: 'كيف', wiki: 'ويكي',
    soundEffects: '🔊 مؤثرات صوتية',
    splashHint: 'انقر للتخطي',
    export: 'تصدير', filterAll: 'الكل',
    copied: 'تم النسخ!', copyFail: 'فشل',
    logCleared: 'تم المسح',
    ready: '🚀 TutoCast جاهز!',
    needSources: '⚠️ أضف مصدرًا أولاً',
    recStarted: '🔴 بدأ التسجيل',
    recStopped: '⏹ انتهى التسجيل',
    recPaused: '⏸ إيقاف مؤقت', recResumed: '▶ استئناف',
    markerAdded: '🏷 علامة',
    snapshotSaved: '📸 حفظ اللقطة',
    sceneChanged: '🎭 المشهد',
    textAdded: '✏️ نص مُضاف',
    laserOn: '🔴 الليزر', laserOff: '⚪ إيقاف الليزر', freezeOn: '❄️ مُجمَّد', freezeOff: '▶ مباشر',
    drawOn: '✏️ وضع الرسم', drawOff: '✏️ إيقاف الرسم',
    teleOn: '📜 تيليبرومبتر', teleOff: '📜 مخفي',
    promptTelePlaceholder: 'الصق النص هنا…', promptFreeText: 'النص المراد عرضه:',
    btConnected: '📡 micro:bit متصل!', btError: '❌ فشل الاتصال',
    permissionDenied: '🔒 تم رفض الإذن.',
    needCamSelected: '⚠️ اختر كاميرا من القائمة أولاً',
    badge_first: 'أول درس', badge_long: 'أكثر من 5 دقائق', badge_multi: 'كاميرات متعددة',
    badge_all_scenes: 'جميع المشاهد', badge_marker_king: 'ملك العلامات', badge_micro: 'micro:bit موصول',
    faq_q1: "ما هو TutoCast؟",
    faq_a1: "TutoCast أداة ويب لتسجيل دروس فيديو بعدة كاميرات (شاشة + كاميرات + ميكروفون) مباشرة من متصفحك. بدون تثبيت، بدون حساب، كل شيء يبقى على حاسوبك.",
    faq_q2: "كيف أضيف عدة كاميرات؟",
    faq_a2: "في اللوحة اليسرى، اختر كاميرا من القائمة واضغط على +. يمكنك تكرار ذلك لإضافة حتى 3 كاميرات (مثلاً واحدة للروبوت، واحدة لك، وواحدة لشاشة micro:bit).",
    faq_q3: "هل يمكنني قراءة مستشعرات micro:bit؟",
    faq_a3: "نعم! اضغط على « 📡 اتصال micro:bit » في اللوحة اليسرى. سيطلب متصفحك إذن الاتصال عبر Bluetooth. بعد الاتصال، تظهر قيم المستشعرات (مقياس التسارع، الضوء، الأزرار) كطبقة فوق الفيديو. ⚠️ Chrome/Edge فقط.",
    faq_q4: "ما هي اختصارات لوحة المفاتيح؟",
    faq_a4: "R = تسجيل/إيقاف · P = إيقاف مؤقت · M = علامة · 1-6 = تبديل المشهد · L = ليزر (تبديل) · F = تجميد الشاشة · D = رسم · S = لقطة · Esc = إغلاق اللوحات",
    faq_q5: "هل فيديوهاتي خاصة؟",
    faq_a5: "100%. لا شيء يغادر حاسوبك. يبقى التسجيل في ذاكرة المتصفح ويُحمَّل مباشرة إلى قرصك. بدون حساب، بدون تحليلات، بدون خادم.",
    faq_q6: "ما هي صيغة الإخراج؟",
    faq_a6: "WebM (VP9 + Opus). قابل للتشغيل في VLC وChrome وFirefox وYouTube وDavinci Resolve. للتحويل إلى MP4 استخدم ffmpeg أو أداة عبر الإنترنت مثل cloudconvert.com.",
    faq_q7: "هل التيليبرومبتر ظاهر في فيديوي؟",
    faq_a7: "لا، أبداً. يظهر التيليبرومبتر فوق المعاينة لك فقط. لا يُرسَم على اللوحة التي تُركِّب الفيديو، لذا لا يظهر في التسجيل النهائي.",
    faq_q8: "المتصفح الموصى به؟",
    faq_a8: "Chrome أو Edge على سطح المكتب. Firefox يعمل للتسجيل لكن ليس لـ Web Bluetooth (micro:bit). Safari لا يدعم المستشعرات ولا بعض خيارات الصوت. iOS غير مدعوم لأن Safari Mobile يحجب التقاط الشاشة.",
    howto_1: "وصّل كاميرات USB (إن لزم) واسمح بالوصول عندما يطلب منك المتصفح.",
    howto_2: "في لوحة المصادر على اليسار، أضف شاشتك وكاميراتك واختر الميكروفون.",
    howto_3: "انقر على أحد المشاهد الجاهزة على اليمين (كود، روبوت، استوديو…) — يتغير التركيب فوراً.",
    howto_4: "أضف نصًا من المكتبة (⭐ أحسنت، 🎯 الخطوة 1…) — سيظهر كطبقة.",
    howto_5: "انقر على الزر الكبير 🔴 تسجيل. عدّ تنازلي 3-2-1 ثم ينطلق التسجيل.",
    howto_6: "استخدم الأرقام 1-9 لتبديل المشاهد مباشرة. L للّيزر، F لتجميد الشاشة، D للرسم.",
    howto_7: "انقر ⏹ إيقاف. سيتم تحميل درسك بصيغة .webm مع الفصول بصيغة .vtt.",
    wiki_multicam_title: "🎥 كاميرات متعددة",
    wiki_multicam: "يعرض TutoCast حتى 3 كاميرات + شاشة + ميكروفون في آن واحد. كل مصدر عبارة عن صندوق قابل للسحب في المشهد. يمكنك تحديد شكله (مستطيل أو دائرة) وحجمه وموقعه.",
    wiki_scenes_title: "🎭 المشاهد",
    wiki_scenes: "المشهد هو تخطيط: موضع/حجم/رؤية كل مصدر + النصوص النشطة. يمكنك التبديل بين المشاهد أثناء التسجيل بالأرقام 1-9 أو بالنقر. قطع فوري بدون تأخير.",
    wiki_sensor_title: "🤖 مستشعرات micro:bit",
    wiki_sensor: "عبر Web Bluetooth يتصل TutoCast مباشرة بـ micro:bit ويقرأ مستشعراته في الوقت الحقيقي (مقياس التسارع، الضوء، الحرارة، الأزرار). تظهر القيم كطبقة فوق الفيديو، مثالية لشرح مستشعر للطلاب.",
    wiki_privacy_title: "🔒 الخصوصية",
    wiki_privacy: "كل شيء يبقى محليًا. يعالج المتصفح تدفقات الفيديو ويركّبها على لوحة ويسجلها في الذاكرة عبر MediaRecorder. يُحمَّل الملف النهائي إلى قرصك. بدون خادم، بدون تتبع.",
    news_010: "الإصدار الأول من TutoCast 🎉",
    news_010_1: "كاميرات متعددة (شاشة + حتى 3 كاميرات + ميكروفون)",
    news_010_2: "6 مشاهد جاهزة (كود، روبوت، مستشعرات، كود+روبوت، استوديو، أنت)",
    news_010_3: "نصوص تراكبية مع مكتبة ملائمة للأطفال",
    news_010_4: "أدوات مباشرة: ليزر، تجميد الشاشة، لوح رسم، تيليبرومبتر",
    news_010_5: "مستشعرات micro:bit عبر Web Bluetooth (Chrome/Edge)",
    news_010_6: "فصول تلقائية مُصدَّرة بصيغة .vtt",
    news_010_7: "علامات مباشرة (مفتاح M) + لقطات فوتوغرافية (مفتاح S)",
    news_010_8: "شارات تقدّم + كونفيتي في النهاية",
    news_010_9: "ثلاثي اللغات FR/EN/AR، 8 مظاهر بصرية",
    news_011: "أول اختبار تشغيل كامل: إصلاح خطأين 🧪",
    news_011_1: "تصحيح الإيموجي المكرر في أزرار المشاهد",
    news_011_2: "إضافة 41 مفتاح ترجمة مفقود (FAQ، wiki، الدليل، السجل)",
    news_012: "تدقيق كامل وإصلاحات كبرى 🔧",
    news_012_1: "إصلاح حرج: كانت خطوط لوح الرسم تُمحى باستمرار بسبب الليزر",
    news_012_2: "تفعيل المؤثرات الصوتية في الإعدادات (بدء، إيقاف، توقف، علامة)",
    news_012_3: "لوحة تصحيح (FPS + الذاكرة) عبر Ctrl+Shift+D",
    news_012_4: "ترجمة كاملة لتلميحات التيليبرومبتر ونص الإدخال الحر",
    news_012_5: "تحديث تلقائي لأسماء الكاميرات والميكروفونات بعد الإذن",
    news_012_6: "تنظيف تلقائي للتدفقات والبيانات عند إغلاق التبويب",
    news_012_7: "إعادة تعيين الأدوات (ليزر/تجميد/رسم/نصوص) بين التسجيلات",
    news_012_8: "ترجمة المظاهر ومواءمة اختصارات FAQ مع الشيفرة الفعلية",
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس',
    t_riad: 'رياض', t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
  }
};

let currentLang = 'fr';

function t(key) { return (LANG[currentLang] && LANG[currentLang][key]) || LANG.en[key] || key; }

function applyI18n() {
  const s = LANG[currentLang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (s[k] == null) return;
    // Don't clobber the teleprompter content if the user has typed their own
    if (el.id === 'tcTeleInner' && typeof Teleprompter !== 'undefined' && Teleprompter.hasUserText()) return;
    el.textContent = s[k];
  });
  document.title = `${s.title} — ${s.slogan}`;
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
}

function setLanguage(lang) {
  if (!LANG[lang]) return;
  currentLang = lang;
  applyI18n();
  try { localStorage.setItem('tc-lang', lang); } catch {}
  renderTicker();
  renderScenes();
  renderTextPresets();
  renderBadges();
  log(`🌐 ${lang.toUpperCase()}`, 'info');
}

/* ─────────── 2. Shell: splash, panels, log, toast, themes ─────────── */

function dismissSplash() {
  const el = $('splash'); if (!el) return;
  el.classList.add('hidden');
  setTimeout(() => el.remove(), 600);
}
window.dismissSplash = dismissSplash;

function setTheme(name) {
  document.documentElement.dataset.theme = name;
  try { localStorage.setItem('tc-theme', name); } catch {}
}

const logHistory = [];
function log(msg, type = 'info') {
  const c = $('logContainer'); if (!c) return;
  const d = document.createElement('div');
  d.className = `log-line ${type}`;
  d.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  c.appendChild(d);
  c.scrollTop = c.scrollHeight;
  logHistory.push({ msg, type, time: Date.now() });
  if (logHistory.length > 500) logHistory.shift();
}

function showToast(msg, ms = 2000) {
  const toast = $('toastIndicator'), m = $('toastMessage'); if (!toast || !m) return;
  m.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._timer);
  if (ms > 0) showToast._timer = setTimeout(() => toast.classList.remove('show'), ms);
}

function openPanel(id) {
  const p = $(id); if (!p) return;
  p.classList.add('open');
  const ov = $(id.replace('Panel', 'Overlay')); if (ov) ov.classList.add('show');
}
function closePanel(id) {
  const p = $(id); if (!p) return;
  p.classList.remove('open');
  const ov = $(id.replace('Panel', 'Overlay')); if (ov) ov.classList.remove('show');
}
function closeAllPanels() {
  ['helpPanel', 'settingsPanel', 'logPanel'].forEach(closePanel);
}

/* ─────────── 3. Engine: sources + renderer ─────────── */

const Engine = {
  canvas: null, ctx: null,
  overlayCanvas: null, overlayCtx: null,   // whiteboard strokes — persist across frames
  laserCanvas: null, laserCtx: null,       // laser dot — redrawn every frame, offscreen
  width: 1920, height: 1080,
  sources: [],        // {id, type:'screen'|'cam'|'mic', stream, video, label, x, y, w, h, shape, mirrored}
  nextId: 1,
  rafId: null,
  frozenFrame: null,  // ImageData when frozen
  audioCtx: null, audioDest: null, analyser: null,
  masterStream: null,
  fps: 0, _fpsFrames: 0, _fpsLast: 0,

  init() {
    this.canvas = $('tcCanvas');
    this.overlayCanvas = $('tcOverlayCanvas');
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.overlayCtx = this.overlayCanvas.getContext('2d');
    // Dedicated offscreen canvas for the laser so it never touches whiteboard strokes
    this.laserCanvas = document.createElement('canvas');
    this.laserCanvas.width = this.width;
    this.laserCanvas.height = this.height;
    this.laserCtx = this.laserCanvas.getContext('2d');
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.audioDest = this.audioCtx.createMediaStreamDestination();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 256;
    this._fpsLast = performance.now();
    this.loop();
  },

  loop() {
    this.render();
    this.rafId = requestAnimationFrame(() => this.loop());
  },

  render() {
    const { ctx, width, height } = this;
    // background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    if (Recorder.frozen && this.frozenFrame) {
      ctx.putImageData(this.frozenFrame, 0, 0);
    } else {
      // draw visible sources (filter non-video)
      const visible = this.sources.filter(s => s.type !== 'mic' && s.visible !== false && s.video && s.video.readyState >= 2);
      visible.forEach(src => this.drawSource(src));
    }

    // draw text overlays
    TextOverlays.drawAll(ctx);

    // draw sensor overlay if active
    Sensors.drawOverlay(ctx);

    // Whiteboard strokes (persist across frames)
    ctx.drawImage(this.overlayCanvas, 0, 0);

    // Laser dot — redraw its offscreen canvas then composite
    Laser.render();
    ctx.drawImage(this.laserCanvas, 0, 0);

    // update VU meter + FPS stats
    this.updateVU();
    this._fpsFrames++;
    const now = performance.now();
    if (now - this._fpsLast >= 1000) {
      this.fps = Math.round((this._fpsFrames * 1000) / (now - this._fpsLast));
      this._fpsFrames = 0;
      this._fpsLast = now;
      DebugHud.update();
    }
  },

  drawSource(src) {
    const { ctx } = this;
    const { video, x, y, w, h, shape, mirrored } = src;
    ctx.save();
    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
    }
    if (mirrored) {
      ctx.translate(x + w, y);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, w, h);
    } else {
      ctx.drawImage(video, x, y, w, h);
    }
    ctx.restore();
    // subtle border for visibility
    if (shape === 'circle') {
      ctx.strokeStyle = 'rgba(255,255,255,.3)'; ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
      ctx.stroke();
    }
  },

  async addScreen() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: false
      });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.muted = true;
      await video.play();
      const src = {
        id: this.nextId++, type: 'screen', stream, video,
        label: t('sourceScreen'),
        x: 0, y: 0, w: this.width, h: this.height,
        shape: 'rect', visible: true, mirrored: false,
      };
      this.sources.push(src);
      stream.getVideoTracks()[0].addEventListener('ended', () => this.removeSource(src.id));
      this.onSourcesChanged();
      log(`+ ${t('sourceScreen')}`, 'success');
    } catch (e) {
      log(`✗ screen: ${e.message}`, 'error');
      if (e.name === 'NotAllowedError') showToast(t('permissionDenied'), 3500);
    }
  },

  async addCamera(deviceId, label) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: deviceId ? { exact: deviceId } : undefined, width: 1280, height: 720 }
      });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.muted = true;
      await video.play();
      const n = this.sources.filter(s => s.type === 'cam').length;
      // stagger placements
      const positions = [
        { x: 1440, y: 760, w: 440, h: 280 },  // bottom-right
        { x: 40, y: 760, w: 440, h: 280 },    // bottom-left
        { x: 40, y: 40, w: 440, h: 280 },     // top-left
      ];
      const pos = positions[n % 3];
      const src = {
        id: this.nextId++, type: 'cam', stream, video,
        label: label || `Camera ${n + 1}`,
        x: pos.x, y: pos.y, w: pos.w, h: pos.h,
        shape: 'rect', visible: true, mirrored: $('tcMirrorCam') && $('tcMirrorCam').checked,
      };
      this.sources.push(src);
      this.onSourcesChanged();
      log(`+ ${src.label}`, 'success');
      Badges.unlockIfMultiCam();
      // After a successful permission grant, labels become available — refresh
      this.refreshDeviceList();
    } catch (e) {
      log(`✗ cam: ${e.message}`, 'error');
      if (e.name === 'NotAllowedError') showToast(t('permissionDenied'), 3500);
    }
  },

  async setMic(deviceId) {
    // remove previous mic
    this.sources = this.sources.filter(s => {
      if (s.type === 'mic') {
        try { s.stream.getTracks().forEach(tr => tr.stop()); } catch {}
        return false;
      }
      return true;
    });
    if (!deviceId) { this.onSourcesChanged(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: deviceId ? { exact: deviceId } : undefined, echoCancellation: true, noiseSuppression: true }
      });
      const src = { id: this.nextId++, type: 'mic', stream, label: 'Mic' };
      this.sources.push(src);
      // hook into audio graph
      const node = this.audioCtx.createMediaStreamSource(stream);
      node.connect(this.audioDest);
      node.connect(this.analyser);
      this.onSourcesChanged();
      log('+ Mic', 'success');
      this.refreshDeviceList();
    } catch (e) {
      log(`✗ mic: ${e.message}`, 'error');
    }
  },

  /* Refresh the camera and mic dropdowns.
     Labels are only populated after at least one getUserMedia permission
     has been granted, so we call this after addCamera / setMic succeeds. */
  async refreshDeviceList() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices.filter(d => d.kind === 'videoinput');
      const mics = devices.filter(d => d.kind === 'audioinput');
      const camSel = $('camSelect'), micSel = $('micSelect');
      if (camSel) {
        const prev = camSel.value;
        camSel.innerHTML = '';
        const opt0 = document.createElement('option');
        opt0.value = ''; opt0.textContent = t('selectCam');
        camSel.appendChild(opt0);
        cams.forEach(d => {
          const o = document.createElement('option');
          o.value = d.deviceId;
          o.textContent = d.label || `Camera ${d.deviceId.slice(0, 4) || 'default'}`;
          camSel.appendChild(o);
        });
        if (prev) camSel.value = prev;
      }
      if (micSel) {
        const prev = micSel.value;
        micSel.innerHTML = '';
        const opt0 = document.createElement('option');
        opt0.value = ''; opt0.textContent = t('selectMic');
        micSel.appendChild(opt0);
        mics.forEach(d => {
          const o = document.createElement('option');
          o.value = d.deviceId;
          o.textContent = d.label || `Mic ${d.deviceId.slice(0, 4) || 'default'}`;
          micSel.appendChild(o);
        });
        if (prev) micSel.value = prev;
      }
    } catch (e) {
      log(`enumerateDevices: ${e.message}`, 'error');
    }
  },

  removeSource(id) {
    const src = this.sources.find(s => s.id === id);
    if (!src) return;
    try { src.stream.getTracks().forEach(t => t.stop()); } catch {}
    this.sources = this.sources.filter(s => s.id !== id);
    this.onSourcesChanged();
    log(`- ${src.label}`, 'info');
  },

  onSourcesChanged() {
    const list = $('tcSrcList');
    if (list) {
      list.innerHTML = '';
      this.sources.forEach(s => {
        const li = document.createElement('li');
        const icon = s.type === 'screen' ? '🖥' : s.type === 'cam' ? '🎥' : '🎤';
        const iconEl = document.createElement('span'); iconEl.textContent = icon;
        const nameEl = document.createElement('span'); nameEl.className = 'tc-src-name'; nameEl.textContent = s.label;
        const btn = document.createElement('button'); btn.title = 'Remove'; btn.textContent = '✕';
        btn.addEventListener('click', () => this.removeSource(s.id));
        li.append(iconEl, nameEl, btn);
        list.appendChild(li);
      });
    }
    const stage = $('tcStage');
    if (stage) stage.classList.toggle('has-sources', this.sources.some(s => s.type !== 'mic'));
  },

  getMasterStream() {
    const videoTrack = this.canvas.captureStream(30).getVideoTracks()[0];
    const audioTrack = this.audioDest.stream.getAudioTracks()[0];
    const tracks = [videoTrack];
    if (audioTrack) tracks.push(audioTrack);
    return new MediaStream(tracks);
  },

  updateVU() {
    const bar = $('tcVuBar'); if (!bar || !this.analyser) return;
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const v = (data[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / data.length);
    const pct = Math.min(100, rms * 400);
    bar.style.width = pct + '%';
  },

  async enumerateDevices() {
    // Prompt for permission first (blank getUserMedia) so labels are populated
    try { await navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(s => s.getTracks().forEach(t => t.stop())); } catch {}
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cams = devices.filter(d => d.kind === 'videoinput');
    const mics = devices.filter(d => d.kind === 'audioinput');
    const camSel = $('camSelect'), micSel = $('micSelect');
    if (camSel) {
      camSel.innerHTML = `<option value="">${t('selectCam')}</option>`;
      cams.forEach(d => { const o = document.createElement('option'); o.value = d.deviceId; o.textContent = d.label || `Camera ${d.deviceId.slice(0, 4)}`; camSel.appendChild(o); });
    }
    if (micSel) {
      micSel.innerHTML = `<option value="">${t('selectMic')}</option>`;
      mics.forEach(d => { const o = document.createElement('option'); o.value = d.deviceId; o.textContent = d.label || `Mic ${d.deviceId.slice(0, 4)}`; micSel.appendChild(o); });
    }
  },
};

/* ─────────── Scenes Manager ─────────── */

const Scenes = {
  // Each scene: { key, label, apply: (engine) => void }
  presets: [
    { key: 'code', icon: '💻', apply: (e) => setLayout(e, { screen: 'full', facecam: 'br' }) },
    { key: 'robot', icon: '🤖', apply: (e) => setLayout(e, { firstCam: 'full', facecam: 'br' }) },
    { key: 'sensors', icon: '🎛', apply: (e) => setLayout(e, { secondCam: 'full', facecam: 'br' }) },
    { key: 'coderobot', icon: '💻🤖', apply: (e) => setLayout(e, { screen: 'left', firstCam: 'right', facecam: 'br' }) },
    { key: 'studio', icon: '🎬', apply: (e) => setLayout(e, { grid: true }) },
    { key: 'you', icon: '👋', apply: (e) => setLayout(e, { facecam: 'full' }) },
  ],
  active: 'code',

  switch(key) {
    const s = this.presets.find(p => p.key === key);
    if (!s) return;
    s.apply(Engine);
    this.active = key;
    this.render();
    log(`${t('sceneChanged')} : ${s.icon} ${t('scene_' + key)}`, 'info');
    Chapters.add(t('scene_' + key));
    Badges.unlockScene(key);
  },

  render() { renderScenes(); }
};

function setLayout(engine, layout) {
  // facecam = last camera added (usually the "you" cam)
  const cams = engine.sources.filter(s => s.type === 'cam');
  const screen = engine.sources.find(s => s.type === 'screen');
  const W = engine.width, H = engine.height;

  // Hide all
  engine.sources.forEach(s => { if (s.type !== 'mic') s.visible = false; });

  const place = (src, pos) => {
    if (!src) return;
    src.visible = true;
    if (pos === 'full')      { src.x = 0; src.y = 0; src.w = W; src.h = H; src.shape = 'rect'; }
    else if (pos === 'left') { src.x = 0; src.y = 0; src.w = W * 0.6; src.h = H; src.shape = 'rect'; }
    else if (pos === 'right'){ src.x = W * 0.6; src.y = 0; src.w = W * 0.4; src.h = H; src.shape = 'rect'; }
    else if (pos === 'br')   { src.x = W - 440; src.y = H - 340; src.w = 400; src.h = 300; src.shape = 'circle'; }
  };

  if (layout.screen) place(screen, layout.screen);
  if (layout.firstCam && cams[0]) place(cams[0], layout.firstCam);
  if (layout.secondCam && cams[1]) place(cams[1], layout.secondCam);
  const faceCam = cams[cams.length - 1];
  if (layout.facecam && faceCam) place(faceCam, layout.facecam);

  if (layout.grid) {
    const items = [screen, cams[0], cams[1]].filter(Boolean);
    const cellW = W / 2, cellH = H / 2;
    items.forEach((s, i) => {
      s.visible = true; s.shape = 'rect';
      s.x = (i % 2) * cellW; s.y = Math.floor(i / 2) * cellH;
      s.w = cellW; s.h = cellH;
    });
    if (faceCam && !items.includes(faceCam)) place(faceCam, 'br');
  }
}

function renderScenes() {
  const el = $('tcScenes'); if (!el) return;
  el.innerHTML = '';
  Scenes.presets.forEach((s, i) => {
    const btn = document.createElement('button');
    btn.className = 'tc-scene-btn' + (Scenes.active === s.key ? ' active' : '');
    btn.innerHTML = `<span class="tc-scene-icon">${s.icon}</span><span>${t('scene_' + s.key)}</span><kbd style="opacity:.4;font-size:.6rem">${i + 1}</kbd>`;
    btn.addEventListener('click', () => Scenes.switch(s.key));
    el.appendChild(btn);
  });
}

/* ─────────── Text Overlays ─────────── */

const TextOverlays = {
  items: [], // { id, text, x, y, size, color, bg }
  nextId: 1,

  add(text, opts = {}) {
    const item = {
      id: this.nextId++,
      text,
      x: opts.x ?? Engine.width / 2,
      y: opts.y ?? 120,
      size: opts.size ?? 80,
      color: opts.color ?? '#ffffff',
      bg: opts.bg ?? 'rgba(0,0,0,.65)',
    };
    this.items.push(item);
    log(`${t('textAdded')}: ${text}`, 'info');
    // auto-remove after 4s for preset texts (kids won't clutter)
    if (opts.ttl !== 0) setTimeout(() => this.remove(item.id), opts.ttl || 4000);
    return item;
  },

  remove(id) { this.items = this.items.filter(i => i.id !== id); },

  drawAll(ctx) {
    this.items.forEach(item => {
      ctx.save();
      ctx.font = `800 ${item.size}px Bangers, Righteous, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const metrics = ctx.measureText(item.text);
      const padX = 30, padY = 18;
      const w = metrics.width + padX * 2;
      const h = item.size * 1.2 + padY * 2;
      // bg
      ctx.fillStyle = item.bg;
      ctx.beginPath();
      const r = 20;
      const x = item.x - w / 2, y = item.y - h / 2;
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.fill();
      // text with outline
      ctx.lineWidth = 6; ctx.strokeStyle = '#000';
      ctx.strokeText(item.text, item.x, item.y);
      ctx.fillStyle = item.color;
      ctx.fillText(item.text, item.x, item.y);
      ctx.restore();
    });
  }
};

const TEXT_PRESETS = ['bravo', 'step1', 'step2', 'step3', 'watch', 'tip', 'careful', 'oops', 'yourturn', 'done'];

function renderTextPresets() {
  const el = $('tcTextPresets'); if (!el) return;
  el.innerHTML = '';
  TEXT_PRESETS.forEach(key => {
    const btn = document.createElement('button');
    btn.textContent = t('txt_' + key);
    btn.addEventListener('click', () => TextOverlays.add(t('txt_' + key)));
    el.appendChild(btn);
  });
}

/* ─────────── 4. Recorder ─────────── */

const Recorder = {
  recorder: null, chunks: [], startTime: 0, pausedDuration: 0, pausedAt: 0,
  timerId: null, state: 'idle', frozen: false,

  async start() {
    if (Engine.sources.filter(s => s.type !== 'mic').length === 0) {
      showToast(t('needSources'), 2500);
      return;
    }
    // countdown
    if ($('tcCountdownEnabled').checked) {
      await this.countdown();
    }
    const stream = Engine.getMasterStream();
    const mime = this.pickMime();
    const bitrate = 4_000_000;
    try {
      this.recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: bitrate });
    } catch (e) {
      // Try again without mimeType but keep the bitrate target
      try {
        this.recorder = new MediaRecorder(stream, { videoBitsPerSecond: bitrate });
      } catch (e2) {
        this.recorder = new MediaRecorder(stream);
      }
    }
    this.chunks = [];
    this.recorder.ondataavailable = e => { if (e.data && e.data.size) this.chunks.push(e.data); };
    this.recorder.onstop = () => this.finish();
    this.recorder.start(1000);
    this.startTime = Date.now();
    this.pausedDuration = 0;
    this.state = 'recording';
    Chapters.reset();
    Chapters.add(t('scene_' + Scenes.active));
    this.updateUI();
    this.startTimer();
    log(t('recStarted'), 'success');
    showToast(t('recStarted'), 1500);
    Sfx.play('start');
  },

  pickMime() {
    const candidates = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
    ];
    for (const m of candidates) {
      if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) return m;
    }
    return '';
  },

  async countdown() {
    const el = $('tcCountdown');
    for (let n = 3; n > 0; n--) {
      el.textContent = n;
      el.classList.remove('show');
      void el.offsetWidth;
      el.classList.add('show');
      await new Promise(r => setTimeout(r, 900));
    }
    el.classList.remove('show');
  },

  togglePause() {
    if (!this.recorder) return;
    if (this.state === 'recording') {
      this.recorder.pause();
      this.pausedAt = Date.now();
      this.state = 'paused';
      log(t('recPaused'), 'info');
      Sfx.play('click');
    } else if (this.state === 'paused') {
      this.recorder.resume();
      this.pausedDuration += Date.now() - this.pausedAt;
      this.state = 'recording';
      log(t('recResumed'), 'info');
      Sfx.play('click');
    }
    this.updateUI();
  },

  stop() {
    if (!this.recorder) return;
    try { this.recorder.stop(); } catch {}
    this.state = 'idle';
    this.stopTimer();
  },

  finish() {
    const blob = new Blob(this.chunks, { type: this.chunks[0]?.type || 'video/webm' });
    const url = URL.createObjectURL(blob);
    const video = $('tcTakeVideo');
    // revoke previous take URLs if any
    if (this._prevUrls) this._prevUrls.forEach(u => { try { URL.revokeObjectURL(u); } catch {} });
    this._prevUrls = [url];
    video.src = url;
    $('tcTake').style.display = 'block';
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const fname = `tutocast-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}`;
    const dl = $('tcDownloadBtn');
    dl.href = url; dl.download = `${fname}.webm`;
    // Chapters VTT
    const vtt = Chapters.toVTT();
    const vttBlob = new Blob([vtt], { type: 'text/vtt' });
    const vttUrl = URL.createObjectURL(vttBlob);
    this._prevUrls.push(vttUrl);
    const dlVtt = $('tcDownloadVtt');
    dlVtt.href = vttUrl; dlVtt.download = `${fname}.vtt`;
    // trigger auto-download of webm
    setTimeout(() => dl.click(), 200);
    log(t('recStopped'), 'success');
    showToast('🎉 ' + t('recStopped'), 2500);
    Sfx.play('stop');
    Confetti.burst();
    Badges.unlockFirst();
    Badges.unlockLong(this.elapsed());
    this.updateUI();
    // Reset transient scene state so the next take starts clean
    this.resetSceneState();
  },

  /* Reset visual state that shouldn't leak between takes */
  resetSceneState() {
    this.frozen = false;
    Engine.frozenFrame = null;
    if (Freeze) $('tcFreezeBtn')?.classList.remove('active');
    if (Whiteboard.on) Whiteboard.toggle();
    Whiteboard.clear();
    if (Laser.on) Laser.toggle();
    TextOverlays.items = [];
  },

  elapsed() {
    if (!this.startTime) return 0;
    const now = this.state === 'paused' ? this.pausedAt : Date.now();
    return Math.max(0, now - this.startTime - this.pausedDuration);
  },

  startTimer() {
    this.timerId = setInterval(() => this.updateTimer(), 500);
  },
  stopTimer() {
    clearInterval(this.timerId); this.timerId = null;
    const el = $('tcRecTime'); if (el) el.textContent = '00:00';
  },
  updateTimer() {
    const ms = this.elapsed();
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const el = $('tcRecTime');
    if (el) el.textContent = `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  },

  updateUI() {
    const rec = $('tcRecBtn'), ind = $('tcRecIndicator');
    const recording = this.state === 'recording' || this.state === 'paused';
    rec.classList.toggle('recording', recording);
    rec.querySelector('.tc-rec-label').textContent = recording ? t('recStop') : t('recStart');
    ind.classList.toggle('active', this.state === 'recording');
    ['tcPauseBtn', 'tcMarkBtn', 'tcStopBtn'].forEach(id => { $(id).disabled = !recording; });
    const pill = $('statusPill'), st = $('statusText');
    if (pill && st) {
      pill.classList.toggle('connected', recording);
      st.textContent = this.state === 'recording' ? t('statusRec')
                      : this.state === 'paused' ? t('statusPaused')
                      : t('statusIdle');
    }
  },
};

/* ─────────── Chapters (VTT) ─────────── */

const Chapters = {
  items: [], // { time, label }
  start: 0,

  reset() { this.items = []; this.start = Date.now(); },

  add(label) {
    if (Recorder.state !== 'recording') return;
    const elapsedSec = Recorder.elapsed() / 1000;
    this.items.push({ time: elapsedSec, label });
  },

  fmtTime(s) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = (s % 60).toFixed(3);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${sec.padStart(6, '0')}`;
  },

  toVTT() {
    if (this.items.length === 0) return 'WEBVTT\n\n';
    let out = 'WEBVTT\n\n';
    const end = Recorder.elapsed() / 1000;
    this.items.forEach((c, i) => {
      const next = i + 1 < this.items.length ? this.items[i + 1].time : end;
      out += `${this.fmtTime(c.time)} --> ${this.fmtTime(next)}\n${c.label}\n\n`;
    });
    return out;
  },

  addMarker() {
    if (Recorder.state !== 'recording' && Recorder.state !== 'paused') return;
    const label = `Marker ${this.items.filter(i => i.label.startsWith('Marker')).length + 1}`;
    this.items.push({ time: Recorder.elapsed() / 1000, label });
    log(`${t('markerAdded')} — ${label}`, 'info');
    Sfx.play('mark');
    Badges.unlockMarker(this.items.length);
  }
};

/* ─────────── 5. Live tools ─────────── */

/* Laser pointer — drawn on its own offscreen canvas, composited by Engine.render */
const Laser = {
  on: false, x: 0, y: 0, lastMove: 0, _lastDirty: false,
  setup() {
    const stage = $('tcStage');
    stage.addEventListener('mousemove', (e) => {
      if (!this.on) return;
      const r = stage.getBoundingClientRect();
      this.x = ((e.clientX - r.left) / r.width) * Engine.width;
      this.y = ((e.clientY - r.top) / r.height) * Engine.height;
      this.lastMove = Date.now();
    });
    // No setInterval — Engine.render calls Laser.render each frame
  },
  render() {
    const c = Engine.laserCtx;
    if (!this.on) {
      // Only clear once on transition off, not every frame
      if (this._lastDirty) {
        c.clearRect(0, 0, Engine.width, Engine.height);
        this._lastDirty = false;
      }
      return;
    }
    c.clearRect(0, 0, Engine.width, Engine.height);
    c.save();
    const grd = c.createRadialGradient(this.x, this.y, 4, this.x, this.y, 40);
    grd.addColorStop(0, 'rgba(255,60,60,1)');
    grd.addColorStop(0.3, 'rgba(255,60,60,.6)');
    grd.addColorStop(1, 'rgba(255,60,60,0)');
    c.fillStyle = grd;
    c.beginPath(); c.arc(this.x, this.y, 40, 0, Math.PI * 2); c.fill();
    c.restore();
    this._lastDirty = true;
  },
  toggle() {
    this.on = !this.on;
    log(this.on ? t('laserOn') : t('laserOff'), 'info');
    $('tcLaserBtn').classList.toggle('active', this.on);
  }
};

/* Freeze — snapshot current canvas frame, Render loop draws the frozen ImageData instead */
const Freeze = {
  toggle() {
    if (Recorder.frozen) {
      Recorder.frozen = false;
      Engine.frozenFrame = null;
      log(t('freezeOff'), 'info');
      $('tcFreezeBtn').classList.remove('active');
    } else {
      Engine.frozenFrame = Engine.ctx.getImageData(0, 0, Engine.width, Engine.height);
      Recorder.frozen = true;
      log(t('freezeOn'), 'info');
      $('tcFreezeBtn').classList.add('active');
    }
  }
};

/* Whiteboard — draws on the overlay canvas, persists across frames */
const Whiteboard = {
  on: false, drawing: false, lastX: 0, lastY: 0,
  setup() {
    const stage = $('tcStage');
    const toStageXY = (e) => {
      const r = stage.getBoundingClientRect();
      return [
        ((e.clientX - r.left) / r.width) * Engine.width,
        ((e.clientY - r.top) / r.height) * Engine.height,
      ];
    };
    stage.addEventListener('mousedown', (e) => {
      if (!this.on) return;
      this.drawing = true;
      [this.lastX, this.lastY] = toStageXY(e);
    });
    stage.addEventListener('mousemove', (e) => {
      if (!this.drawing) return;
      const [x, y] = toStageXY(e);
      const c = Engine.overlayCtx;
      c.strokeStyle = '#fbbf24';
      c.lineWidth = 8;
      c.lineCap = 'round';
      c.lineJoin = 'round';
      c.beginPath();
      c.moveTo(this.lastX, this.lastY);
      c.lineTo(x, y);
      c.stroke();
      this.lastX = x; this.lastY = y;
    });
    // Stop on mouseup anywhere (covers mouse leaving stage mid-stroke)
    window.addEventListener('mouseup', () => { this.drawing = false; });
    stage.addEventListener('mouseleave', () => { this.drawing = false; });
  },
  toggle() {
    this.on = !this.on;
    $('tcStage').classList.toggle('drawing', this.on);
    $('tcWhiteboardBtn').classList.toggle('active', this.on);
    log(this.on ? t('drawOn') : t('drawOff'), 'info');
  },
  clear() { Engine.overlayCtx.clearRect(0, 0, Engine.width, Engine.height); }
};

/* Teleprompter — overlay visible on stage only, NOT drawn to canvas */
const Teleprompter = {
  on: false, _userEdited: false,
  toggle() {
    this.on = !this.on;
    const el = $('tcTeleprompter');
    el.style.display = this.on ? 'block' : 'none';
    const inner = $('tcTeleInner');
    inner.contentEditable = 'true';
    // Track whether the user has typed their own text. applyI18n() will only
    // refresh the placeholder when the user hasn't edited yet.
    if (!this._wired) {
      inner.addEventListener('input', () => { this._userEdited = true; });
      this._wired = true;
    }
    $('tcTeleBtn').classList.toggle('active', this.on);
    log(this.on ? t('teleOn') : t('teleOff'), 'info');
  },
  hasUserText() { return this._userEdited; }
};

/* Snapshot — download current canvas as PNG */
function snapshot() {
  Engine.canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    a.href = url;
    a.download = `tutocast-snapshot-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    log(t('snapshotSaved'), 'success');
  });
}

/* ─────────── 6. micro:bit sensors (Web Bluetooth) ─────────── */

const Sensors = {
  device: null, server: null,
  values: null, // { a: 0, b: 0, x: 0, y: 0, z: 0, light: 0 }

  async connect() {
    if (!navigator.bluetooth) {
      showToast('❌ Web Bluetooth non supporté (Chrome/Edge requis)', 3000);
      return;
    }
    try {
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: 'BBC micro:bit' }],
        optionalServices: [
          'e95d0753-251d-470a-a062-fa1922dfa9a8', // Accelerometer service
          'e95d9882-251d-470a-a062-fa1922dfa9a8', // Button service
        ],
      });
      this.server = await this.device.gatt.connect();
      // Try accelerometer
      try {
        const accelSvc = await this.server.getPrimaryService('e95d0753-251d-470a-a062-fa1922dfa9a8');
        const accelChar = await accelSvc.getCharacteristic('e95dca4b-251d-470a-a062-fa1922dfa9a8');
        await accelChar.startNotifications();
        accelChar.addEventListener('characteristicvaluechanged', (e) => {
          const v = e.target.value;
          this.values = this.values || {};
          this.values.x = v.getInt16(0, true) / 1000;
          this.values.y = v.getInt16(2, true) / 1000;
          this.values.z = v.getInt16(4, true) / 1000;
          this.updatePanel();
        });
      } catch (e) { /* accelerometer optional */ }
      // Try buttons
      try {
        const btnSvc = await this.server.getPrimaryService('e95d9882-251d-470a-a062-fa1922dfa9a8');
        const aChar = await btnSvc.getCharacteristic('e95dda90-251d-470a-a062-fa1922dfa9a8');
        await aChar.startNotifications();
        aChar.addEventListener('characteristicvaluechanged', (e) => {
          this.values = this.values || {};
          this.values.a = e.target.value.getUint8(0);
          this.updatePanel();
        });
        const bChar = await btnSvc.getCharacteristic('e95dda91-251d-470a-a062-fa1922dfa9a8');
        await bChar.startNotifications();
        bChar.addEventListener('characteristicvaluechanged', (e) => {
          this.values = this.values || {};
          this.values.b = e.target.value.getUint8(0);
          this.updatePanel();
        });
      } catch (e) { /* buttons optional */ }
      log(t('btConnected'), 'success');
      showToast(t('btConnected'), 2500);
      Badges.unlockMicrobit();
      this.values = this.values || { a: 0, b: 0, x: 0, y: 0, z: 0 };
      $('tcBtValues').style.display = 'block';
    } catch (e) {
      log(`${t('btError')}: ${e.message}`, 'error');
      showToast(t('btError'), 2500);
    }
  },

  updatePanel() {
    const el = $('tcBtValues'); if (!el || !this.values) return;
    const v = this.values;
    el.innerHTML = `🔘 A: ${v.a ?? '-'}   B: ${v.b ?? '-'}<br>📐 X: ${(v.x ?? 0).toFixed(2)}<br>   Y: ${(v.y ?? 0).toFixed(2)}<br>   Z: ${(v.z ?? 0).toFixed(2)}`;
  },

  drawOverlay(ctx) {
    if (!this.values) return;
    const v = this.values;
    ctx.save();
    ctx.font = '700 36px Orbitron, monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const pad = 16;
    const x = 40, y = 40;
    const lines = [
      `🤖 micro:bit`,
      `A:${v.a ?? '-'}  B:${v.b ?? '-'}`,
      `X:${(v.x ?? 0).toFixed(2)}`,
      `Y:${(v.y ?? 0).toFixed(2)}`,
      `Z:${(v.z ?? 0).toFixed(2)}`,
    ];
    const w = 340, h = lines.length * 44 + pad * 2;
    ctx.fillStyle = 'rgba(0,0,0,.65)';
    ctx.beginPath();
    const r = 16;
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.fill();
    ctx.fillStyle = '#a3e635';
    lines.forEach((line, i) => ctx.fillText(line, x + pad, y + pad + i * 44));
    ctx.restore();
  }
};

/* ─────────── 7. Kid polish: sfx, debug hud, badges, confetti, ticker ─────────── */

/* Tiny Web Audio SFX — respects the soundToggle checkbox */
const Sfx = {
  _ctx: null,
  enabled: true,
  ctx() {
    if (!this._ctx) this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    return this._ctx;
  },
  play(kind) {
    if (!this.enabled) return;
    try {
      const ac = this.ctx();
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.connect(g); g.connect(ac.destination);
      const map = {
        start:  { f1: 440, f2: 880, d: 0.18, type: 'sine'     },
        stop:   { f1: 660, f2: 220, d: 0.22, type: 'sine'     },
        mark:   { f1: 880, f2: 880, d: 0.08, type: 'triangle' },
        click:  { f1: 520, f2: 520, d: 0.04, type: 'square'   },
      };
      const p = map[kind] || map.click;
      o.type = p.type;
      o.frequency.setValueAtTime(p.f1, ac.currentTime);
      o.frequency.linearRampToValueAtTime(p.f2, ac.currentTime + p.d);
      g.gain.setValueAtTime(0.0001, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.12, ac.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + p.d);
      o.start();
      o.stop(ac.currentTime + p.d + 0.02);
    } catch {}
  },
  setEnabled(v) {
    this.enabled = !!v;
    try { localStorage.setItem('tc-sfx', v ? '1' : '0'); } catch {}
  },
  load() {
    try {
      const v = localStorage.getItem('tc-sfx');
      if (v !== null) this.enabled = v === '1';
    } catch {}
  }
};

/* Small debug HUD — FPS + JS heap, toggled with Ctrl+Shift+D */
const DebugHud = {
  on: false,
  toggle() {
    this.on = !this.on;
    $('debugPanel')?.classList.toggle('active', this.on);
    if (this.on) this.update();
  },
  update() {
    if (!this.on) return;
    const fps = $('debugFps'); if (fps) fps.textContent = `${Engine.fps} FPS`;
    const mem = $('debugMem');
    if (mem && performance.memory) {
      const mb = performance.memory.usedJSHeapSize / 1048576;
      mem.textContent = `${mb.toFixed(1)} MB`;
    } else if (mem) {
      mem.textContent = '— MB';
    }
  }
};

const Badges = {
  list: [
    { key: 'first', icon: '🎬', i18n: 'badge_first' },
    { key: 'long', icon: '⏱', i18n: 'badge_long' },
    { key: 'multi', icon: '🎥', i18n: 'badge_multi' },
    { key: 'all_scenes', icon: '🎭', i18n: 'badge_all_scenes' },
    { key: 'marker_king', icon: '🏷', i18n: 'badge_marker_king' },
    { key: 'micro', icon: '🤖', i18n: 'badge_micro' },
  ],
  unlocked: new Set(),
  scenesUsed: new Set(),

  load() {
    try {
      const s = JSON.parse(localStorage.getItem('tc-badges') || '[]');
      this.unlocked = new Set(s);
    } catch {}
  },
  save() { try { localStorage.setItem('tc-badges', JSON.stringify([...this.unlocked])); } catch {} },
  unlock(k) {
    if (this.unlocked.has(k)) return;
    this.unlocked.add(k);
    this.save();
    renderBadges();
    showToast(`🏆 ${t('badge_' + k)}`, 2200);
  },
  unlockFirst() { this.unlock('first'); },
  unlockLong(ms) { if (ms > 5 * 60 * 1000) this.unlock('long'); },
  unlockIfMultiCam() { if (Engine.sources.filter(s => s.type === 'cam').length >= 2) this.unlock('multi'); },
  unlockScene(k) {
    this.scenesUsed.add(k);
    if (this.scenesUsed.size >= Scenes.presets.length) this.unlock('all_scenes');
  },
  unlockMarker(n) { if (n >= 5) this.unlock('marker_king'); },
  unlockMicrobit() { this.unlock('micro'); },
};

function renderBadges() {
  const el = $('tcBadges'); if (!el) return;
  el.innerHTML = '';
  Badges.list.forEach(b => {
    const d = document.createElement('div');
    d.className = 'tc-badge' + (Badges.unlocked.has(b.key) ? ' unlocked' : '');
    d.innerHTML = `<div class="tc-badge-icon">${b.icon}</div><div>${t(b.i18n)}</div>`;
    el.appendChild(d);
  });
}

const Confetti = {
  canvas: null, ctx: null, particles: [], rafId: null,
  burst() {
    if (!this.canvas) {
      this.canvas = $('tcConfetti');
      this.ctx = this.canvas.getContext('2d');
    }
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.classList.add('active');
    this.particles = [];
    const colors = ['#fb923c', '#a3e635', '#facc15', '#ef4444', '#2563eb', '#ffffff'];
    for (let i = 0; i < 140; i++) {
      this.particles.push({
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18 - 6,
        size: 6 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        life: 1,
      });
    }
    const start = Date.now();
    const tick = () => {
      const age = Date.now() - start;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.4;
        p.rot += p.vr;
        p.life = Math.max(0, 1 - age / 3500);
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rot);
        this.ctx.globalAlpha = p.life;
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        this.ctx.restore();
      });
      if (age < 3500) this.rafId = requestAnimationFrame(tick);
      else { this.canvas.classList.remove('active'); this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); }
    };
    tick();
  }
};

function renderTicker() {
  const el = $('tcTickerTrack'); if (!el) return;
  const items = [];
  for (let i = 1; i <= 10; i++) items.push(t('tip_' + i));
  // duplicate to keep the scroll feeling continuous
  el.textContent = items.join('    •    ') + '    •    ' + items.join('    •    ');
}

/* ─────────── 8. Onboarding + wiring ─────────── */

function setupOnboarding() {
  const seen = localStorage.getItem('tc-onboarded');
  if (!seen) $('tcOnboarding').style.display = 'block';
  $('tcOnboardingClose').addEventListener('click', () => {
    $('tcOnboarding').style.display = 'none';
    try { localStorage.setItem('tc-onboarded', '1'); } catch {}
  });
  $('tcOnboardingGo').addEventListener('click', () => {
    $('tcOnboarding').style.display = 'none';
    try { localStorage.setItem('tc-onboarded', '1'); } catch {}
  });
}

function setupHelpTabs() {
  document.querySelectorAll('.help-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.help-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active'));
      const id = 'help' + btn.dataset.tab.charAt(0).toUpperCase() + btn.dataset.tab.slice(1);
      const el = $(id); if (el) el.classList.add('active');
    });
  });
}

function setupHotkeys() {
  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
    const k = e.key.toLowerCase();
    // Ctrl/Cmd + Shift + D toggles the debug HUD
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && k === 'd') {
      DebugHud.toggle(); e.preventDefault(); return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (k >= '1' && k <= '9') {
      const idx = parseInt(k) - 1;
      if (Scenes.presets[idx]) { Scenes.switch(Scenes.presets[idx].key); e.preventDefault(); }
    } else if (k === 'r') { Recorder.state === 'idle' ? Recorder.start() : Recorder.stop(); e.preventDefault(); }
    else if (k === 'p') { Recorder.togglePause(); e.preventDefault(); }
    else if (k === 'm') { Chapters.addMarker(); e.preventDefault(); }
    else if (k === 's') { snapshot(); e.preventDefault(); }
    else if (k === 'l') { Laser.toggle(); e.preventDefault(); }
    else if (k === 'f') { Freeze.toggle(); e.preventDefault(); }
    else if (k === 'd') { Whiteboard.toggle(); e.preventDefault(); }
    else if (k === 'escape') { closeAllPanels(); }
  });
}

function wireEvents() {
  // Splash dismiss
  const sp = $('splash');
  if (sp) setTimeout(() => { sp.classList.add('hidden'); setTimeout(() => sp.remove(), 600); }, 2200);

  // Panels
  $('helpBtn').addEventListener('click', () => openPanel('helpPanel'));
  $('settingsBtn').addEventListener('click', () => openPanel('settingsPanel'));
  $('logBtn').addEventListener('click', () => openPanel('logPanel'));
  $('helpCloseBtn').addEventListener('click', () => closePanel('helpPanel'));
  $('settingsCloseBtn').addEventListener('click', () => closePanel('settingsPanel'));
  $('logCloseBtn').addEventListener('click', () => closePanel('logPanel'));
  ['helpOverlay', 'settingsOverlay'].forEach(id => { const e = $(id); if (e) e.addEventListener('click', closeAllPanels); });

  // Log controls
  $('clearLogBtn').addEventListener('click', () => { $('logContainer').innerHTML = ''; log(t('logCleared'), 'info'); });
  $('copyLogBtn').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(logHistory.map(l => `[${new Date(l.time).toLocaleTimeString()}] ${l.msg}`).join('\n')); showToast(t('copied'), 1500); }
    catch { showToast(t('copyFail'), 1500); }
  });
  $('exportLogBtn').addEventListener('click', () => {
    const txt = logHistory.map(l => `[${new Date(l.time).toLocaleTimeString()}] [${l.type}] ${l.msg}`).join('\n');
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'tutocast-log.txt'; a.click();
  });

  // Lang & theme
  $('langSelect').addEventListener('change', (e) => setLanguage(e.target.value));
  $('themeSelect').addEventListener('change', (e) => setTheme(e.target.value));

  // Sound effects toggle
  const sndEl = $('soundToggle');
  if (sndEl) {
    sndEl.checked = Sfx.enabled;
    sndEl.addEventListener('change', (e) => Sfx.setEnabled(e.target.checked));
  }

  // Sources
  $('srcScreenBtn').addEventListener('click', () => Engine.addScreen());
  $('srcCamBtn').addEventListener('click', () => {
    const sel = $('camSelect');
    if (!sel || sel.selectedIndex < 0) { showToast(t('needCamSelected'), 2200); return; }
    const deviceId = sel.value;
    if (!deviceId) { showToast(t('needCamSelected'), 2200); return; }
    const label = sel.options[sel.selectedIndex].textContent;
    Engine.addCamera(deviceId, label);
  });
  $('micSelect').addEventListener('change', (e) => Engine.setMic(e.target.value));
  $('btConnectBtn').addEventListener('click', () => Sensors.connect());

  // Text free
  $('tcAddTextBtn').addEventListener('click', () => {
    const text = prompt(t('promptFreeText'), '');
    if (text) TextOverlays.add(text, { ttl: 0 });
  });

  // Tools
  $('tcLaserBtn').addEventListener('click', () => Laser.toggle());
  $('tcFreezeBtn').addEventListener('click', () => Freeze.toggle());
  $('tcWhiteboardBtn').addEventListener('click', () => Whiteboard.toggle());
  $('tcTeleBtn').addEventListener('click', () => Teleprompter.toggle());
  $('tcSnapBtn').addEventListener('click', () => snapshot());

  // Rec bar
  $('tcRecBtn').addEventListener('click', () => {
    if (Recorder.state === 'idle') Recorder.start();
    else Recorder.stop();
  });
  $('tcPauseBtn').addEventListener('click', () => Recorder.togglePause());
  $('tcMarkBtn').addEventListener('click', () => Chapters.addMarker());
  $('tcStopBtn').addEventListener('click', () => Recorder.stop());
  $('tcNewTakeBtn').addEventListener('click', () => {
    $('tcTake').style.display = 'none';
    $('tcTakeVideo').src = '';
    if (Recorder._prevUrls) {
      Recorder._prevUrls.forEach(u => { try { URL.revokeObjectURL(u); } catch {} });
      Recorder._prevUrls = null;
    }
  });

  // Ticker pause
  $('tcTickerPause').addEventListener('click', () => {
    const ticker = $('tcTicker'); ticker.classList.toggle('paused');
    $('tcTickerPause').textContent = ticker.classList.contains('paused') ? '▶' : '⏸';
  });

  // Mirror toggle re-applies to cams
  $('tcMirrorCam').addEventListener('change', (e) => {
    Engine.sources.filter(s => s.type === 'cam').forEach(s => s.mirrored = e.target.checked);
  });
}

async function init() {
  // Restore prefs
  try {
    const lang = localStorage.getItem('tc-lang'); if (lang) currentLang = lang;
    const theme = localStorage.getItem('tc-theme'); if (theme) setTheme(theme);
  } catch {}
  $('langSelect').value = currentLang;

  Sfx.load();
  Badges.load();

  applyI18n();  // after Sfx/Badges so Teleprompter.hasUserText() is safe

  Engine.init();
  Laser.setup();
  Whiteboard.setup();

  renderScenes();
  renderTextPresets();
  renderBadges();
  renderTicker();

  setupOnboarding();
  setupHelpTabs();
  setupHotkeys();
  wireEvents();

  // Set default scene
  Scenes.active = 'code';
  Recorder.updateUI();

  // First-pass device list — labels are blank until the user grants permission,
  // then refreshDeviceList() is called automatically after addCamera/setMic.
  await Engine.refreshDeviceList();

  log(t('ready'), 'success');
}

/* Stop all active streams / recording when the tab is closed so the camera
   and mic lights turn off promptly instead of at GC time. */
window.addEventListener('beforeunload', () => {
  try {
    if (Recorder && Recorder.recorder && Recorder.state !== 'idle') {
      try { Recorder.recorder.stop(); } catch {}
    }
    if (Engine && Engine.sources) {
      Engine.sources.forEach(s => {
        try { s.stream && s.stream.getTracks().forEach(tr => tr.stop()); } catch {}
      });
    }
    if (Recorder && Recorder._prevUrls) {
      Recorder._prevUrls.forEach(u => { try { URL.revokeObjectURL(u); } catch {} });
    }
  } catch {}
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
