/* ═══════════════════════════════════════════════════════════════════
   TutoCast v0.7.0 — kids-friendly multi-cam screen recorder
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

const APP_VERSION = '0.7.0';
const $ = (id) => document.getElementById(id);

/* ─────────── 1. i18n ─────────── */

const LANG = {
  fr: {
    title: 'TutoCast', slogan: '🎬 Lumière, caméra, ROBOT !',
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
    recorderError: '✗ Erreur d\'enregistrement (voir le journal)',
    recEmpty: '⚠️ Fichier vide — l\'encodeur n\'a rien produit. Ouvre le journal 📜 pour le détail.',
    recNoStream: '✗ Pas de flux vidéo — relance la page',
    zoom: 'Zoom', zoomOn: '🔍 Zoom activé', zoomOff: '🔍 Zoom désactivé',
    outputFormat: '🎞 Format de sortie',
    formatAuto: 'Auto (MP4 si possible)', formatMp4: 'MP4 (H.264/AAC)', formatWebm: 'WebM (VP9/Opus)',
    trim: 'Couper', trimTitle: 'Couper le tuto',
    trimIn: 'Début', trimOut: 'Fin', trimDuration: 'Durée finale :',
    trimPreviewIn: '▶ début', trimPreviewOut: '▶ fin',
    trimEncoding: 'Encodage en cours…',
    trimExport: 'Exporter le tuto coupé', trimExported: 'Tuto coupé exporté',
    trimNoTake: '⚠️ Aucun tuto enregistré à couper',
    trimTooShort: '⚠️ Sélection trop courte (minimum 0.2 s)',
    cancel: 'Annuler',
    pinSource: '📌 Épingler (garder la position entre les scènes)',
    unpinSource: '🔓 Détacher (la scène reprend le contrôle)',
    toggleBlur: '🌫 Flou arrière-plan',
    removeSource: '✕ Retirer',
    resetLayout: '🔓 Réinitialiser la disposition',
    layoutReset: '🔓 Disposition réinitialisée',
    downloadCsv: 'Capteurs (.csv)',
    removeSilence: 'Retirer les silences',
    silenceEncoding: '🔇 Encodage sans silences…',
    silenceExported: 'Silences retirés',
    silenceChip: 'Tu es silencieux…',
    quizPromptLabel: 'Quelle question veux-tu poser à tes élèves ?',
    sensorOverlayLabel: '🤖 Overlay auto si le robot bouge fort',
    jingleLabel: '🎵 Jingle d\'intro (1.5s)',
    badgeBtn: 'Carte badge',
    badgeHeadline: 'Tuto enregistré !',
    badgeStatDuration: 'Durée',
    badgeStatSources: 'Sources',
    badgeStatChapters: 'Chapitres',
    badgeStatMicrobit: 'micro:bit',
    badgeNoTake: '⚠️ Aucun tuto à exporter',
    badgeExported: 'Badge exporté',
    badgeError: '✗ Impossible de générer le badge',
    firstTimeTitle: 'Première fois ? Commence ici',
    firstTimeBody: 'Les 7 étapes ci-dessous t\'emmènent de zéro à ton premier tuto téléchargé en moins de 5 minutes. TutoCast fonctionne aussi bien sur un Chromebook que sur un ordinateur classique, sans compte, sans installation.',
    firstTimeTeacher: '👩‍🏫 Pour les profs : TutoCast est conçu pour expliquer du code avec un robot (micro:bit, Arduino, LEGO). Utilise le template « 🤖 Démo robot » pour une séquence guidée en 5 étapes. Tes vidéos restent 100% sur ton ordi.',
    brandSection: '🏷 Marque (logo + slogan)',
    brandUploadLogo: 'Charger un logo (PNG/SVG)',
    brandClearLogo: 'Retirer le logo',
    brandLogoLoaded: '🏷 Logo chargé',
    brandLogoCleared: '🏷 Logo retiré',
    brandEffect: 'Effet fun',
    sourceTitlePh: 'Titre (ex: 💻 Mon code)',
    sourceShape: 'Forme',
    filter_none: '— Filtre —',
    filter_bw: 'N&B',
    filter_sepia: 'Sépia',
    filter_bright: 'Lumineux',
    filter_contrast: 'Contraste',
    filter_vintage: 'Vintage',
    filter_cool: 'Froid',
    filter_warm: 'Chaud',
    overlayDuplicated: '📋 Overlay dupliqué',
    maximize: '⛶ Plein écran',
    restore: '⛶ Restaurer',
    zoomHint: '🔍 Z = activer/désactiver · ⛶ = plein écran · Esc = sortir',
    laserHint: '🔴 L = activer/désactiver · incline le micro:bit pour viser',
    freezeHint: '❄ F = geler/dégeler · parle encore pendant que l\'écran est gelé',
    drawHint: '✏ D = activer/désactiver · clique-glisse sur l\'aperçu pour dessiner',
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
    news_020: "Templates de tutos guidés 🎬",
    news_020_1: "3 templates kid-friendly : Cours complet, Démo robot, Correction",
    news_020_2: "Chaque template pose une séquence de 5 étapes visibles en permanence",
    news_020_3: "Clic sur une étape = changement de scène + marker chapitre",
    news_020_4: "Les caméras ajoutées après sélection d'un template héritent du layout",
    news_020_5: "Ouverture automatique au premier lancement (remplace l'ancienne onboarding)",
    news_021: "Hotfix critique : fichiers 0 octet corrigés 🚨",
    news_021_1: "canvas.captureStream mis en cache (évite une race connue Chrome/Firefox)",
    news_021_2: "Gestionnaire d'erreur MediaRecorder + logs détaillés dans le journal",
    news_021_3: "Détection des enregistrements vides — plus de téléchargement fantôme",
    news_021_4: "Timeslice ramené de 1000 à 250 ms pour les prises courtes",
    news_021_5: "AudioContext repris au début de l'enregistrement",
    news_022: "VRAI fix des fichiers 0 octet 🎯",
    news_022_1: "Cause réelle : la piste audio de audioDest n'émettait aucun échantillon sans source connectée",
    news_022_2: "Correctif : ConstantSourceNode silencieux connecté en permanence",
    news_022_3: "Vérifié par test runtime headless complet (tous les boutons, toutes les scènes, tous les outils)",
    news_022_4: "Bouton 'Vierge' efface désormais le template actif",
    news_023: "Splash rafraîchi + nouveau slogan 🎬",
    news_023_1: "Bug du logo qui chevauchait le titre corrigé (container 120×65 → 140×140)",
    news_023_2: "Nouveau slogan : « Lumière, caméra, ROBOT ! »",
    news_023_3: "Badge workshop-diy.org dans le splash et le footer",
    news_024: "Zone de travail élargie (vraiment) 📺",
    news_024_1: "Largeur de l'app : 1240 → fluide jusqu'à 1760 px",
    news_024_2: "Grille studio : sidebars 240 px + minmax(0,1fr) pour le canvas",
    news_024_3: "Canvas plafonné par la hauteur du viewport — 16:9 parfait à 1920/1600/1366",
    news_024_4: "Sidebars scrollables en interne pour garder le bouton REC au-dessus de la ligne de flottaison",
    news_030: "Trim + Zoom + MP4 ✂️🔍📼",
    news_030_1: "Outil de trim non destructif : deux curseurs, un bouton d'export, nouveau fichier avec chapitres ajustés",
    news_030_2: "Zoom manuel fluide sur Z (ou bouton A du micro:bit) pour les moments de focus",
    news_030_3: "Export MP4 natif quand le navigateur le supporte (Chrome 126+, Safari, Edge)",
    news_030_4: "Préférence de format dans les Paramètres : Auto / MP4 / WebM",
    news_030_5: "Trim réencode via offscreen canvas + MediaRecorder — zéro dépendance, zéro cloud",
    news_040: "Drag-drop + effets 🖐✨",
    news_040_1: "Drag-drop : déplace n'importe quelle source directement sur le canvas, elle est épinglée automatiquement",
    news_040_2: "Aimantation à 7 ancres (coins, centres d'arêtes, centre) dans un rayon de 60 px",
    news_040_3: "Bouton 📌 / 🔓 dans chaque source pour épingler manuellement, et « Réinitialiser la disposition » pour tout relâcher",
    news_040_4: "Flou arrière-plan par source (🌫) — net au centre, flou dégradé aux bords",
    news_040_5: "Halo de couleur thème toujours actif autour des sources visibles",
    news_040_6: "Pulse visuelle sur chaque marker (M) — retour visible que la marque est enregistrée",
    news_050: "micro:bit superpouvoirs + trim intelligent 🤖🔇",
    news_050_1: "Bouton A du micro:bit = zoom · Bouton B = marker · Inclinaison = position du laser",
    news_050_2: "Export CSV des capteurs aligné sur la timeline du tuto (Unique à TutoCast)",
    news_050_3: "Trim automatique des silences > 2s — un clic après l'enregistrement, zéro éditeur externe",
    news_050_4: "Chip d'alerte silence en temps réel (>1.8s de micro muet, visible toi seul)",
    news_050_5: "Touche Q = carte question overlay (kid-friendly quiz)",
    news_050_6: "Overlay 🤖 auto si le robot s'agite fort (opt-in dans les Paramètres)",
    news_060: "Polish adoption 🎵🏆👩‍🏫",
    news_060_1: "Jingle d'intro Web Audio (1.5s) en option — opt-in dans les Paramètres",
    news_060_2: "Carte badge PNG partageable générée après chaque enregistrement",
    news_060_3: "Callout « Première fois ? Commence ici » + pitch prof dans l'aide",
    news_060_4: "README enrichi d'une section « Pour les profs »",
    news_070: "Max flexibilité : drag+resize pour tout 🖐📐",
    news_070_1: "Texts déplaçables ET redimensionnables (poignées aux 4 coins, Ctrl+D = dupliquer, Suppr = supprimer)",
    news_070_2: "Sources redimensionnables aux 4 coins (aspect ratio conservé)",
    news_070_3: "Logo + slogan personnalisables (upload PNG/SVG) avec 6 effets fun : spin, pulse, bounce, wiggle, halo, arc-en-ciel",
    news_070_4: "Filtres visuels par source : N&B, sépia, lumineux, contraste, vintage, froid, chaud",
    news_070_5: "Titre/caption par source (style lower-third) — tape directement dans le panneau sources",
    news_070_6: "Bouton plein écran ⛶ — l'aperçu prend tout l'écran, Esc pour sortir",
    news_070_7: "Hints clavier affichés quand tu actives Zoom / Laser / Gel / Dessin",
    tplTitle: "Choisis comment tu commences",
    tplSubtitle: "Chaque template te guide étape par étape",
    tplChoose: "Choisir un template",
    tplStarted: "Template démarré",
    tplDismiss: "Fermer",
    tplBlank: "🎨 Vierge",
    tplBlankDesc: "Je compose ma propre scène",
    tpl_lesson: "Cours complet",
    tpl_lesson_d: "Intro → Théorie → Démo → Exercice → Conclusion",
    tpl_lesson_intro: "🎓 Aujourd'hui on apprend…",
    tpl_lesson_s1: "Intro",
    tpl_lesson_s2: "Théorie",
    tpl_lesson_s3: "Démo",
    tpl_lesson_s4: "Exercice",
    tpl_lesson_s5: "Conclusion",
    tpl_robot: "Démo robot",
    tpl_robot_d: "Présentation → Code → Robot → Capteurs → Bilan",
    tpl_robot_intro: "🤖 Regarde mon robot !",
    tpl_robot_s1: "Présentation",
    tpl_robot_s2: "Le code",
    tpl_robot_s3: "Le robot",
    tpl_robot_s4: "Les capteurs",
    tpl_robot_s5: "Bilan",
    tpl_fix: "Correction",
    tpl_fix_d: "Bug → Analyse → Fix → Test → OK",
    tpl_fix_intro: "🐛 On corrige ce bug ensemble",
    tpl_fix_s1: "Le bug",
    tpl_fix_s2: "On analyse",
    tpl_fix_s3: "On corrige",
    tpl_fix_s4: "On teste",
    tpl_fix_s5: "Ça marche !",
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus',
    t_riad: 'Riad', t_medina: 'Médina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
  },
  en: {
    title: 'TutoCast', slogan: '🎬 Lights, camera, ROBOT!',
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
    recorderError: '✗ Recording error (see the log)',
    recEmpty: '⚠️ Empty file — the encoder produced nothing. Open the log 📜 for details.',
    recNoStream: '✗ No video stream — reload the page',
    zoom: 'Zoom', zoomOn: '🔍 Zoom on', zoomOff: '🔍 Zoom off',
    outputFormat: '🎞 Output format',
    formatAuto: 'Auto (MP4 if possible)', formatMp4: 'MP4 (H.264/AAC)', formatWebm: 'WebM (VP9/Opus)',
    trim: 'Trim', trimTitle: 'Trim the tutorial',
    trimIn: 'Start', trimOut: 'End', trimDuration: 'Final duration:',
    trimPreviewIn: '▶ start', trimPreviewOut: '▶ end',
    trimEncoding: 'Encoding…',
    trimExport: 'Export trimmed tutorial', trimExported: 'Trimmed tutorial exported',
    trimNoTake: '⚠️ No tutorial recorded to trim',
    trimTooShort: '⚠️ Selection too short (minimum 0.2 s)',
    cancel: 'Cancel',
    pinSource: '📌 Pin (keep position across scenes)',
    unpinSource: '🔓 Unpin (scene controls position again)',
    toggleBlur: '🌫 Background blur',
    removeSource: '✕ Remove',
    resetLayout: '🔓 Reset layout',
    layoutReset: '🔓 Layout reset',
    downloadCsv: 'Sensors (.csv)',
    removeSilence: 'Remove silences',
    silenceEncoding: '🔇 Encoding without silences…',
    silenceExported: 'Silences removed',
    silenceChip: 'You\'re silent…',
    quizPromptLabel: 'What question do you want to ask your students?',
    sensorOverlayLabel: '🤖 Auto-overlay when the robot jolts',
    jingleLabel: '🎵 Intro jingle (1.5s)',
    badgeBtn: 'Badge card',
    badgeHeadline: 'Tutorial recorded!',
    badgeStatDuration: 'Duration',
    badgeStatSources: 'Sources',
    badgeStatChapters: 'Chapters',
    badgeStatMicrobit: 'micro:bit',
    badgeNoTake: '⚠️ No tutorial to export',
    badgeExported: 'Badge exported',
    badgeError: '✗ Could not generate the badge',
    firstTimeTitle: 'First time? Start here',
    firstTimeBody: 'The 7 steps below take you from zero to your first downloaded tutorial in under 5 minutes. TutoCast runs on a Chromebook or any desktop browser, no account, no install.',
    firstTimeTeacher: '👩‍🏫 For teachers: TutoCast is built to explain code with a robot (micro:bit, Arduino, LEGO). Use the "🤖 Robot demo" template for a guided 5-step sequence. Your videos stay 100% on your computer.',
    brandSection: '🏷 Brand (logo + slogan)',
    brandUploadLogo: 'Upload a logo (PNG/SVG)',
    brandClearLogo: 'Remove logo',
    brandLogoLoaded: '🏷 Logo loaded',
    brandLogoCleared: '🏷 Logo cleared',
    brandEffect: 'Fun effect',
    sourceTitlePh: 'Title (e.g. 💻 My code)',
    sourceShape: 'Shape',
    filter_none: '— Filter —',
    filter_bw: 'B&W',
    filter_sepia: 'Sepia',
    filter_bright: 'Bright',
    filter_contrast: 'Contrast',
    filter_vintage: 'Vintage',
    filter_cool: 'Cool',
    filter_warm: 'Warm',
    overlayDuplicated: '📋 Overlay duplicated',
    maximize: '⛶ Fullscreen',
    restore: '⛶ Restore',
    zoomHint: '🔍 Z = toggle · ⛶ = fullscreen · Esc = exit',
    laserHint: '🔴 L = toggle · tilt the micro:bit to aim',
    freezeHint: '❄ F = freeze/unfreeze · keep talking while the screen is frozen',
    drawHint: '✏ D = toggle · click-drag on the preview to draw',
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
    news_020: "Guided tutorial templates 🎬",
    news_020_1: "3 kid-friendly templates: Full lesson, Robot demo, Fix-it",
    news_020_2: "Each template lays out a 5-step sequence visible throughout",
    news_020_3: "Clicking a step switches scene + adds a chapter marker",
    news_020_4: "Cams added after picking a template inherit the layout",
    news_020_5: "Opens automatically on first launch (replaces old onboarding)",
    news_021: "Critical hotfix: zero-byte webm files fixed 🚨",
    news_021_1: "canvas.captureStream is now cached (avoids a known Chrome/Firefox race)",
    news_021_2: "MediaRecorder error handler + detailed logging in the activity panel",
    news_021_3: "Empty recordings are detected — no more phantom downloads",
    news_021_4: "Timeslice reduced from 1000 ms to 250 ms for short takes",
    news_021_5: "AudioContext is resumed on recording start",
    news_022: "Real fix for 0-byte files 🎯",
    news_022_1: "Actual root cause: audioDest's audio track emitted no samples without a source",
    news_022_2: "Fix: permanent silent ConstantSourceNode keeps the audio track alive",
    news_022_3: "Verified by full headless runtime test (every button, scene, tool)",
    news_022_4: "Blank template button now clears any active template",
    news_023: "Splash refresh + new slogan 🎬",
    news_023_1: "Fixed logo-overlaps-title bug (container 120×65 → 140×140)",
    news_023_2: "New slogan: \"Lights, camera, ROBOT!\"",
    news_023_3: "workshop-diy.org badge on splash and footer",
    news_024: "Working area actually widened 📺",
    news_024_1: "App width: 1240 → fluid up to 1760 px",
    news_024_2: "Studio grid: 240 px sidebars + minmax(0,1fr) canvas column",
    news_024_3: "Canvas capped by viewport height — perfect 16:9 at 1920/1600/1366",
    news_024_4: "Sidebars scroll internally so the REC button stays above the fold",
    news_030: "Trim + Zoom + MP4 ✂️🔍📼",
    news_030_1: "Non-destructive trim tool: two handles, export button, new file with adjusted chapters",
    news_030_2: "Smooth manual zoom on Z (or micro:bit button A) for code focus moments",
    news_030_3: "Native MP4 export where the browser supports it (Chrome 126+, Safari, Edge)",
    news_030_4: "Output format preference in Settings: Auto / MP4 / WebM",
    news_030_5: "Trim re-encodes via offscreen canvas + MediaRecorder — zero deps, zero cloud",
    news_040: "Drag-drop + effects 🖐✨",
    news_040_1: "Drag-drop: move any source directly on the canvas, it's auto-pinned",
    news_040_2: "Snaps to 7 anchors (corners, edge centers, dead center) within a 60-px radius",
    news_040_3: "Per-source 📌 / 🔓 button to pin manually, and \"Reset layout\" to release them all",
    news_040_4: "Per-source background blur (🌫) — sharp center, blurred edge ring",
    news_040_5: "Theme-accent glow halo around every visible source (always on)",
    news_040_6: "Visible pulse on every marker (M) — the teacher gets instant confirmation",
    news_050: "micro:bit superpowers + smart trim 🤖🔇",
    news_050_1: "micro:bit button A = zoom · button B = marker · tilt = laser position",
    news_050_2: "Sensor CSV export aligned with the tutorial timeline (unique to TutoCast)",
    news_050_3: "Auto-trim silences > 2s — one click post-record, no external editor",
    news_050_4: "Live silence warning chip (>1.8s quiet mic, visible to you only)",
    news_050_5: "Q key = quiz card overlay (kid-friendly mid-recording question)",
    news_050_6: "Auto 🤖 overlay when the robot jolts hard (opt-in in Settings)",
    news_060: "Adoption polish 🎵🏆👩‍🏫",
    news_060_1: "Optional 1.5s Web Audio intro jingle — opt-in in Settings",
    news_060_2: "Shareable PNG badge card generated after every recording",
    news_060_3: "\"First time? Start here\" callout + teacher pitch in the help panel",
    news_060_4: "README now has a proper \"For teachers\" section",
    news_070: "Max flexibility: drag+resize everything 🖐📐",
    news_070_1: "Texts draggable AND resizable (4 corner handles, Ctrl+D duplicate, Delete to remove)",
    news_070_2: "Sources resize from 4 corners (aspect ratio preserved)",
    news_070_3: "Custom logo + slogan (PNG/SVG upload) with 6 fun effects: spin, pulse, bounce, wiggle, glow, rainbow",
    news_070_4: "Per-source visual filters: B&W, sepia, bright, contrast, vintage, cool, warm",
    news_070_5: "Per-source title/caption (lower-third style) — type it directly in the sources panel",
    news_070_6: "⛶ Fullscreen button — the preview fills the screen, Esc to exit",
    news_070_7: "Keyboard hints pop up when you toggle Zoom / Laser / Freeze / Draw",
    tplTitle: "Pick how you start",
    tplSubtitle: "Each template guides you step by step",
    tplChoose: "Pick a template",
    tplStarted: "Template started",
    tplDismiss: "Dismiss",
    tplBlank: "🎨 Blank",
    tplBlankDesc: "I'll build my own scene",
    tpl_lesson: "Full lesson",
    tpl_lesson_d: "Intro → Theory → Demo → Exercise → Wrap-up",
    tpl_lesson_intro: "🎓 Today we're learning…",
    tpl_lesson_s1: "Intro",
    tpl_lesson_s2: "Theory",
    tpl_lesson_s3: "Demo",
    tpl_lesson_s4: "Exercise",
    tpl_lesson_s5: "Wrap-up",
    tpl_robot: "Robot demo",
    tpl_robot_d: "Intro → Code → Robot → Sensors → Recap",
    tpl_robot_intro: "🤖 Watch my robot!",
    tpl_robot_s1: "Intro",
    tpl_robot_s2: "The code",
    tpl_robot_s3: "The robot",
    tpl_robot_s4: "The sensors",
    tpl_robot_s5: "Recap",
    tpl_fix: "Fix-it",
    tpl_fix_d: "Bug → Analyze → Fix → Test → OK",
    tpl_fix_intro: "🐛 Let's fix this bug together",
    tpl_fix_s1: "The bug",
    tpl_fix_s2: "Analyze",
    tpl_fix_s3: "Fix",
    tpl_fix_s4: "Test",
    tpl_fix_s5: "It works!",
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus',
    t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
  },
  ar: {
    title: 'TutoCast', slogan: '🎬 أضواء، كاميرا، روبوت!',
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
    recorderError: '✗ خطأ في التسجيل (راجع السجل)',
    recEmpty: '⚠️ ملف فارغ — لم ينتج المُرمِّز شيئًا. افتح السجل 📜 للتفاصيل.',
    recNoStream: '✗ لا يوجد تدفق فيديو — أعد تحميل الصفحة',
    zoom: 'تكبير', zoomOn: '🔍 تم التكبير', zoomOff: '🔍 تم الإلغاء',
    outputFormat: '🎞 تنسيق الإخراج',
    formatAuto: 'تلقائي (MP4 إن أمكن)', formatMp4: 'MP4 (H.264/AAC)', formatWebm: 'WebM (VP9/Opus)',
    trim: 'قص', trimTitle: 'قص الدرس',
    trimIn: 'البداية', trimOut: 'النهاية', trimDuration: 'المدة النهائية:',
    trimPreviewIn: '▶ البداية', trimPreviewOut: '▶ النهاية',
    trimEncoding: 'جارٍ الترميز…',
    trimExport: 'تصدير الدرس المقصوص', trimExported: 'تم تصدير الدرس المقصوص',
    trimNoTake: '⚠️ لا يوجد درس مسجّل للقص',
    trimTooShort: '⚠️ التحديد قصير جدًا (الحد الأدنى 0.2 ث)',
    cancel: 'إلغاء',
    pinSource: '📌 تثبيت (الاحتفاظ بالموضع بين المشاهد)',
    unpinSource: '🔓 فك التثبيت (المشهد يتحكم في الموضع)',
    toggleBlur: '🌫 تمويه الخلفية',
    removeSource: '✕ إزالة',
    resetLayout: '🔓 إعادة ضبط التخطيط',
    layoutReset: '🔓 تمت إعادة ضبط التخطيط',
    downloadCsv: 'المستشعرات (.csv)',
    removeSilence: 'إزالة فترات الصمت',
    silenceEncoding: '🔇 جارٍ الترميز بدون صمت…',
    silenceExported: 'تمت إزالة الصمت',
    silenceChip: 'أنت صامت…',
    quizPromptLabel: 'ما السؤال الذي تريد طرحه على طلابك؟',
    sensorOverlayLabel: '🤖 طبقة تلقائية عند اهتزاز الروبوت',
    jingleLabel: '🎵 جينغل المقدمة (1.5ث)',
    badgeBtn: 'بطاقة شارة',
    badgeHeadline: 'تم تسجيل الدرس!',
    badgeStatDuration: 'المدة',
    badgeStatSources: 'المصادر',
    badgeStatChapters: 'الفصول',
    badgeStatMicrobit: 'micro:bit',
    badgeNoTake: '⚠️ لا يوجد درس للتصدير',
    badgeExported: 'تم تصدير الشارة',
    badgeError: '✗ تعذّر إنشاء الشارة',
    firstTimeTitle: 'أول مرة؟ ابدأ من هنا',
    firstTimeBody: 'الخطوات السبع أدناه تأخذك من الصفر إلى أول درس محمّل في أقل من 5 دقائق. يعمل TutoCast على Chromebook أو أي متصفح سطح مكتب، بدون حساب، بدون تثبيت.',
    firstTimeTeacher: '👩‍🏫 للمعلّمين: TutoCast مصمّم لشرح الكود مع روبوت (micro:bit، Arduino، LEGO). استخدم قالب «🤖 عرض روبوت» لتسلسل موجّه من 5 خطوات. فيديوهاتك تبقى 100% على حاسوبك.',
    brandSection: '🏷 العلامة (شعار + شعار نصي)',
    brandUploadLogo: 'رفع شعار (PNG/SVG)',
    brandClearLogo: 'إزالة الشعار',
    brandLogoLoaded: '🏷 تم تحميل الشعار',
    brandLogoCleared: '🏷 تمت إزالة الشعار',
    brandEffect: 'تأثير ممتع',
    sourceTitlePh: 'عنوان (مثلاً 💻 كودي)',
    sourceShape: 'الشكل',
    filter_none: '— فلتر —',
    filter_bw: 'أبيض وأسود',
    filter_sepia: 'سيبيا',
    filter_bright: 'ساطع',
    filter_contrast: 'تباين',
    filter_vintage: 'كلاسيكي',
    filter_cool: 'بارد',
    filter_warm: 'دافئ',
    overlayDuplicated: '📋 تم تكرار الطبقة',
    maximize: '⛶ ملء الشاشة',
    restore: '⛶ استعادة',
    zoomHint: '🔍 Z = تفعيل/إلغاء · ⛶ = ملء الشاشة · Esc = خروج',
    laserHint: '🔴 L = تفعيل/إلغاء · أمِل micro:bit للتصويب',
    freezeHint: '❄ F = تجميد/إلغاء · استمر في الكلام بينما الشاشة مجمّدة',
    drawHint: '✏ D = تفعيل/إلغاء · اسحب على المعاينة للرسم',
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
    news_020: "قوالب دروس موجّهة 🎬",
    news_020_1: "3 قوالب ملائمة للأطفال: درس كامل، عرض روبوت، تصحيح",
    news_020_2: "كل قالب يضع تسلسل 5 خطوات مرئي دائمًا",
    news_020_3: "النقر على خطوة = تغيير المشهد + إضافة علامة فصل",
    news_020_4: "الكاميرات المضافة بعد اختيار قالب ترث التخطيط",
    news_020_5: "يفتح تلقائيًا عند أول تشغيل (يستبدل الإرشاد القديم)",
    news_021: "إصلاح حرج: ملفات webm بحجم صفر 🚨",
    news_021_1: "تخزين canvas.captureStream مسبقًا (يتجنب مشكلة معروفة في Chrome/Firefox)",
    news_021_2: "معالج أخطاء MediaRecorder + سجلات تفصيلية في لوحة النشاط",
    news_021_3: "اكتشاف التسجيلات الفارغة — لا مزيد من التنزيلات الوهمية",
    news_021_4: "تقليل الشريحة الزمنية من 1000 إلى 250 مللي ثانية للتسجيلات القصيرة",
    news_021_5: "استئناف AudioContext عند بدء التسجيل",
    news_022: "الإصلاح الحقيقي لملفات 0 بايت 🎯",
    news_022_1: "السبب الفعلي: مسار الصوت في audioDest لم يُصدر أي عينات بدون مصدر متصل",
    news_022_2: "الإصلاح: ConstantSourceNode صامت متصل بشكل دائم",
    news_022_3: "تم التحقق عبر اختبار تشغيل كامل بدون واجهة (كل الأزرار والمشاهد والأدوات)",
    news_022_4: "زر 'فارغ' يمسح الآن أي قالب نشط",
    news_023: "تحديث شاشة البداية + شعار جديد 🎬",
    news_023_1: "إصلاح تداخل الشعار مع العنوان (الحاوية 120×65 → 140×140)",
    news_023_2: "شعار جديد: «أضواء، كاميرا، روبوت!»",
    news_023_3: "شارة workshop-diy.org على شاشة البداية والتذييل",
    news_024: "توسيع منطقة العمل فعليًا 📺",
    news_024_1: "عرض التطبيق: 1240 → مرن حتى 1760 بكسل",
    news_024_2: "شبكة الاستوديو: أشرطة جانبية 240 بكسل + minmax(0,1fr) لمنطقة الكانفاس",
    news_024_3: "الكانفاس محدود بارتفاع منفذ العرض — 16:9 مثالي عند 1920/1600/1366",
    news_024_4: "الأشرطة الجانبية قابلة للتمرير داخليًا لإبقاء زر التسجيل مرئيًا",
    news_030: "قص + تكبير + MP4 ✂️🔍📼",
    news_030_1: "أداة قص غير مدمرة: مقبضان، زر تصدير، ملف جديد مع فصول معدّلة",
    news_030_2: "تكبير يدوي سلس بمفتاح Z (أو زر A في micro:bit) للحظات التركيز",
    news_030_3: "تصدير MP4 أصلي عند دعم المتصفح (Chrome 126+، Safari، Edge)",
    news_030_4: "تفضيل تنسيق الإخراج في الإعدادات: تلقائي / MP4 / WebM",
    news_030_5: "القص يعيد الترميز عبر canvas بدون شاشة + MediaRecorder — بلا تبعيات، بلا سحابة",
    news_040: "السحب والإفلات + تأثيرات 🖐✨",
    news_040_1: "السحب والإفلات: حرّك أي مصدر مباشرة على الكانفاس، يُثبّت تلقائيًا",
    news_040_2: "انجذاب إلى 7 نقاط (زوايا، مراكز الحواف، المركز) ضمن نصف قطر 60 بكسل",
    news_040_3: "زر 📌 / 🔓 في كل مصدر للتثبيت يدويًا، و«إعادة ضبط التخطيط» لتحرير الكل",
    news_040_4: "تمويه خلفية لكل مصدر (🌫) — واضح في الوسط، مموّه عند الحواف",
    news_040_5: "هالة بلون المظهر حول كل مصدر مرئي (دائمًا مفعّلة)",
    news_040_6: "نبضة بصرية عند كل علامة (M) — تأكيد فوري للمعلّم",
    news_050: "قوى micro:bit الخارقة + قص ذكي 🤖🔇",
    news_050_1: "زر A = تكبير · زر B = علامة · الإمالة = موضع الليزر",
    news_050_2: "تصدير CSV للمستشعرات متزامن مع الجدول الزمني للدرس (حصري)",
    news_050_3: "قص تلقائي لفترات الصمت > 2ث — نقرة واحدة بعد التسجيل، بدون محرر خارجي",
    news_050_4: "إشعار صمت مباشر (> 1.8ث ميكروفون صامت، مرئي لك فقط)",
    news_050_5: "مفتاح Q = بطاقة سؤال (quiz) ملائمة للأطفال",
    news_050_6: "طبقة 🤖 تلقائية عند اهتزاز الروبوت بقوة (اختياري في الإعدادات)",
    news_060: "تلميع التبنّي 🎵🏆👩‍🏫",
    news_060_1: "جينغل مقدمة Web Audio اختياري (1.5ث) — تفعيل في الإعدادات",
    news_060_2: "بطاقة شارة PNG قابلة للمشاركة تُنشأ بعد كل تسجيل",
    news_060_3: "نداء «أول مرة؟ ابدأ من هنا» + طرح للمعلّمين في لوحة المساعدة",
    news_060_4: "إضافة قسم «للمعلّمين» في README",
    news_070: "أقصى مرونة: السحب وتغيير الحجم لكل شيء 🖐📐",
    news_070_1: "النصوص قابلة للسحب وتغيير الحجم (4 مقابض، Ctrl+D للتكرار، Delete للحذف)",
    news_070_2: "المصادر قابلة لتغيير الحجم من 4 زوايا (مع الحفاظ على النسبة)",
    news_070_3: "شعار وعبارة مخصّصان (PNG/SVG) مع 6 تأثيرات ممتعة: دوران، نبض، ارتداد، اهتزاز، هالة، قوس قزح",
    news_070_4: "فلاتر بصرية لكل مصدر: أبيض وأسود، سيبيا، ساطع، تباين، كلاسيكي، بارد، دافئ",
    news_070_5: "عنوان/تسمية لكل مصدر (أسلوب lower-third) — اكتبه مباشرة في لوحة المصادر",
    news_070_6: "زر ملء الشاشة ⛶ — المعاينة تملأ الشاشة، Esc للخروج",
    news_070_7: "تلميحات لوحة مفاتيح تظهر عند تفعيل التكبير / الليزر / التجميد / الرسم",
    tplTitle: "اختر كيف تبدأ",
    tplSubtitle: "كل قالب يرشدك خطوة بخطوة",
    tplChoose: "اختر قالبًا",
    tplStarted: "بدأ القالب",
    tplDismiss: "إغلاق",
    tplBlank: "🎨 فارغ",
    tplBlankDesc: "سأنشئ مشهدي الخاص",
    tpl_lesson: "درس كامل",
    tpl_lesson_d: "مقدمة → نظرية → عرض → تمرين → خاتمة",
    tpl_lesson_intro: "🎓 اليوم نتعلّم…",
    tpl_lesson_s1: "مقدمة",
    tpl_lesson_s2: "النظرية",
    tpl_lesson_s3: "العرض",
    tpl_lesson_s4: "التمرين",
    tpl_lesson_s5: "الخاتمة",
    tpl_robot: "عرض روبوت",
    tpl_robot_d: "مقدمة → كود → روبوت → مستشعرات → ملخّص",
    tpl_robot_intro: "🤖 انظر إلى روبوتي!",
    tpl_robot_s1: "مقدمة",
    tpl_robot_s2: "الكود",
    tpl_robot_s3: "الروبوت",
    tpl_robot_s4: "المستشعرات",
    tpl_robot_s5: "ملخّص",
    tpl_fix: "تصحيح",
    tpl_fix_d: "خطأ → تحليل → إصلاح → اختبار → تم",
    tpl_fix_intro: "🐛 لنصلح هذا الخطأ معًا",
    tpl_fix_s1: "الخطأ",
    tpl_fix_s2: "التحليل",
    tpl_fix_s3: "الإصلاح",
    tpl_fix_s4: "الاختبار",
    tpl_fix_s5: "يعمل!",
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
  // Give the browser one tick to apply the new :root vars, then re-cache.
  if (typeof Engine !== 'undefined' && Engine.canvas) {
    setTimeout(() => Engine.refreshAccent(), 20);
  }
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
  _canvasStream: null,   // cached captureStream (v0.2.1: fix multiple-capture races)
  _accentColor: '#a3e635', // cached from CSS var, refreshed on theme change
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

    /* v0.2.2 CRITICAL FIX: plug a ConstantSourceNode at gain 0 into audioDest.
       Without ANY source node feeding the audio destination, its MediaStreamTrack
       produces zero samples — and MediaRecorder responds to that by encoding
       exactly one 0-byte chunk and stalling the entire recording. Every .webm
       shipped before v0.2.2 was 0 bytes for this reason. Keeping a permanent
       silent source ensures the audio track always carries data, recording
       works before a mic is picked, and adding/removing a mic mid-session
       never leaves the track silent enough to stall the encoder. */
    const silentSrc = this.audioCtx.createConstantSource();
    const silentGain = this.audioCtx.createGain();
    silentGain.gain.value = 0;
    silentSrc.connect(silentGain).connect(this.audioDest);
    silentSrc.start();
    this._silentKeepalive = silentSrc;

    this.refreshAccent();
    this._fpsLast = performance.now();
    this.loop();
    // Draw one forced frame synchronously so captureStream() has something
    // to grab on its first activation.
    this.render();
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

    // Apply the zoom transform around its focus point for sources + overlays.
    // Text overlays and sensor HUD remain at 1x so they stay readable.
    Zoom.tick();
    const z = Zoom.current;
    const zoomed = z > 1.001;
    if (zoomed) {
      ctx.save();
      ctx.translate(Zoom.cx, Zoom.cy);
      ctx.scale(z, z);
      ctx.translate(-Zoom.cx, -Zoom.cy);
    }

    if (Recorder.frozen && this.frozenFrame) {
      ctx.putImageData(this.frozenFrame, 0, 0);
    } else {
      // draw visible sources (filter non-video)
      const visible = this.sources.filter(s => s.type !== 'mic' && s.visible !== false && s.video && s.video.readyState >= 2);
      visible.forEach(src => this.drawSource(src));
    }

    if (zoomed) ctx.restore();

    // draw text overlays (unscaled so they stay readable)
    TextOverlays.drawAll(ctx);

    // draw sensor overlay if active (unscaled)
    Sensors.drawOverlay(ctx);

    // Whiteboard strokes (persist across frames)
    ctx.drawImage(this.overlayCanvas, 0, 0);

    // Brand watermark (logo + slogan + fun effect) — always on top of overlays
    Brand.draw(ctx);

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
    const { video, shape, mirrored } = src;
    let { x, y, w, h } = src;

    // --- Marker pulse: briefly scale all sources up 5% on Chapters.addMarker ---
    const pulseT = Recorder._pulseUntil ? Math.max(0, Recorder._pulseUntil - Date.now()) : 0;
    if (pulseT > 0) {
      const phase = pulseT / Recorder._pulseDur;           // 1 → 0
      const amp = Math.sin(phase * Math.PI) * 0.05;         // ease bell
      const scale = 1 + amp;
      const cx = x + w / 2, cy = y + h / 2;
      const newW = w * scale, newH = h * scale;
      x = cx - newW / 2; y = cy - newH / 2;
      w = newW; h = newH;
    }

    const cx = x + w / 2, cy = y + h / 2;
    const r = Math.min(w, h) / 2;

    // --- Glow border (always on, uses current theme accent) ---
    const accent = this._accentColor || '#a3e635';
    ctx.save();
    ctx.shadowColor = accent;
    ctx.shadowBlur = 30;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 5;
    this._pathForShape(ctx, shape, x, y, w, h, cx, cy, r);
    ctx.stroke();
    ctx.stroke();  // double-stroke for a stronger halo
    ctx.restore();

    // --- Per-source visual filter (v0.7.0) ---
    // Applied via ctx.filter for the duration of the draw pass, reset after.
    const filter = src.filter && src.filter !== 'none' ? this._filterString(src.filter) : 'none';

    // --- Main fill with optional background blur ---
    if (src.blur) {
      // Pass 1: blurred outer layer, clipped to the source shape.
      // Over-draws by 12px all around to hide the blur-filter edge artifacts.
      ctx.save();
      this._pathForShape(ctx, shape, x, y, w, h, cx, cy, r);
      ctx.clip();
      ctx.filter = 'blur(24px) ' + (filter !== 'none' ? filter : '');
      this._drawVideoRespectingMirror(video, x - 12, y - 12, w + 24, h + 24, mirrored);
      ctx.filter = 'none';
      ctx.restore();

      // Pass 2: sharp inner region (72% of the outer shape) — centered.
      // For a face-cam, this keeps the face crisp while the edges stay blurred.
      ctx.save();
      const sharpRatio = 0.72;
      if (shape === 'circle') {
        ctx.beginPath();
        ctx.arc(cx, cy, r * sharpRatio, 0, Math.PI * 2);
        ctx.clip();
      } else {
        const mx = (w * (1 - sharpRatio)) / 2;
        const my = (h * (1 - sharpRatio)) / 2;
        ctx.beginPath();
        ctx.rect(x + mx, y + my, w - mx * 2, h - my * 2);
        ctx.clip();
      }
      ctx.filter = filter;
      this._drawVideoRespectingMirror(video, x, y, w, h, mirrored);
      ctx.filter = 'none';
      ctx.restore();
    } else {
      // Default path: single pass with shape clip + optional filter
      ctx.save();
      this._pathForShape(ctx, shape, x, y, w, h, cx, cy, r);
      ctx.clip();
      ctx.filter = filter;
      this._drawVideoRespectingMirror(video, x, y, w, h, mirrored);
      ctx.filter = 'none';
      ctx.restore();
    }

    // --- Per-source title chip (v0.7.0, lower-third style) ---
    if (src.title && src.title.trim()) {
      ctx.save();
      const titleSize = Math.max(18, Math.min(42, h * 0.08));
      ctx.font = `700 ${titleSize}px Righteous, Bangers, sans-serif`;
      const padX = 14, padY = 8;
      const m = ctx.measureText(src.title);
      const tw = m.width + padX * 2;
      const th = titleSize * 1.2 + padY * 2;
      // Anchor under the source's bottom center, pushed 12px down
      const tx = x + (w - tw) / 2;
      const ty = y + h + 12;
      // Rounded chip background
      const rr = 10;
      ctx.fillStyle = 'rgba(0,0,0,.72)';
      ctx.beginPath();
      ctx.moveTo(tx + rr, ty);
      ctx.lineTo(tx + tw - rr, ty); ctx.quadraticCurveTo(tx + tw, ty, tx + tw, ty + rr);
      ctx.lineTo(tx + tw, ty + th - rr); ctx.quadraticCurveTo(tx + tw, ty + th, tx + tw - rr, ty + th);
      ctx.lineTo(tx + rr, ty + th); ctx.quadraticCurveTo(tx, ty + th, tx, ty + th - rr);
      ctx.lineTo(tx, ty + rr); ctx.quadraticCurveTo(tx, ty, tx + rr, ty);
      ctx.fill();
      // Accent left bar
      ctx.fillStyle = Engine._accentColor || '#a3e635';
      ctx.fillRect(tx, ty, 4, th);
      // Label text
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(src.title, tx + tw / 2, ty + th / 2);
      ctx.restore();
    }
  },

  /* Build a canvas path for the given shape. Centralized so glow + clip
     + background-blur all use the exact same geometry. */
  _pathForShape(ctx, shape, x, y, w, h, cx, cy, r) {
    ctx.beginPath();
    if (shape === 'circle') {
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.closePath();
      return;
    }
    if (shape === 'rounded') {
      const rr = Math.min(40, Math.min(w, h) * 0.12);
      ctx.moveTo(x + rr, y);
      ctx.lineTo(x + w - rr, y); ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
      ctx.lineTo(x + w, y + h - rr); ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
      ctx.lineTo(x + rr, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
      ctx.lineTo(x, y + rr); ctx.quadraticCurveTo(x, y, x + rr, y);
      ctx.closePath();
      return;
    }
    // default: rect
    ctx.rect(x, y, w, h);
  },

  /* Per-source visual filter presets. ctx.filter accepts comma/space-separated
     CSS filter values — these are standard Canvas2D. No deps. */
  _filterString(name) {
    switch (name) {
      case 'bw':       return 'grayscale(100%)';
      case 'sepia':    return 'sepia(80%)';
      case 'bright':   return 'brightness(1.2) contrast(1.1)';
      case 'contrast': return 'contrast(1.5) saturate(1.2)';
      case 'vintage':  return 'sepia(40%) contrast(1.1) brightness(0.95)';
      case 'cool':     return 'hue-rotate(-20deg) saturate(1.2)';
      case 'warm':     return 'hue-rotate(20deg) saturate(1.2)';
      default:         return 'none';
    }
  },

  /* Draw a video frame honouring the mirrored flag. Extracted because the
     blur path needs two draws and duplicating the transform is ugly. */
  _drawVideoRespectingMirror(video, x, y, w, h, mirrored) {
    const ctx = this.ctx;
    if (mirrored) {
      ctx.save();
      ctx.translate(x + w, y);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, w, h);
      ctx.restore();
    } else {
      ctx.drawImage(video, x, y, w, h);
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
      // Re-apply the active scene so the new source is laid out correctly
      if (Scenes.active) Scenes.reapply();
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
      if (Scenes.active) Scenes.reapply();
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

  /* Re-read the current theme's --accent CSS variable and cache it for the
     glow border. Called at init and after every setTheme. */
  refreshAccent() {
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      if (v) this._accentColor = v;
    } catch {}
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
        li.className = 'tc-src-row';

        // Top row: icon + editable title + action icons
        const topRow = document.createElement('div');
        topRow.className = 'tc-src-row-top';
        const icon = s.type === 'screen' ? '🖥' : s.type === 'cam' ? '🎥' : '🎤';
        const iconEl = document.createElement('span'); iconEl.textContent = icon;
        const nameEl = document.createElement('span'); nameEl.className = 'tc-src-name'; nameEl.textContent = s.label;
        topRow.append(iconEl, nameEl);

        if (s.type !== 'mic') {
          const pin = document.createElement('button');
          pin.className = 'tc-src-icon-btn' + (s.custom ? ' active' : '');
          pin.textContent = s.custom ? '📌' : '🔓';
          pin.title = s.custom ? t('unpinSource') : t('pinSource');
          pin.addEventListener('click', (e) => { e.stopPropagation(); Drag.togglePin(s.id); });
          topRow.appendChild(pin);

          const blur = document.createElement('button');
          blur.className = 'tc-src-icon-btn' + (s.blur ? ' active' : '');
          blur.textContent = '🌫';
          blur.title = t('toggleBlur');
          blur.addEventListener('click', (e) => {
            e.stopPropagation();
            s.blur = !s.blur;
            this.onSourcesChanged();
          });
          topRow.appendChild(blur);
        }

        const rm = document.createElement('button');
        rm.className = 'tc-src-icon-btn';
        rm.title = t('removeSource');
        rm.textContent = '✕';
        rm.addEventListener('click', (e) => { e.stopPropagation(); this.removeSource(s.id); });
        topRow.appendChild(rm);
        li.appendChild(topRow);

        // Bottom row (video sources only): title input + filter select
        if (s.type !== 'mic') {
          const bot = document.createElement('div');
          bot.className = 'tc-src-row-bot';

          const titleInput = document.createElement('input');
          titleInput.type = 'text';
          titleInput.className = 'tc-src-title-input';
          titleInput.placeholder = t('sourceTitlePh');
          titleInput.value = s.title || '';
          titleInput.addEventListener('input', (e) => { s.title = e.target.value; });
          bot.appendChild(titleInput);

          const filterSel = document.createElement('select');
          filterSel.className = 'tc-src-filter-select';
          [
            ['none',     t('filter_none')],
            ['bw',       t('filter_bw')],
            ['sepia',    t('filter_sepia')],
            ['bright',   t('filter_bright')],
            ['contrast', t('filter_contrast')],
            ['vintage',  t('filter_vintage')],
            ['cool',     t('filter_cool')],
            ['warm',     t('filter_warm')],
          ].forEach(([v, l]) => {
            const opt = document.createElement('option');
            opt.value = v; opt.textContent = l;
            if ((s.filter || 'none') === v) opt.selected = true;
            filterSel.appendChild(opt);
          });
          filterSel.addEventListener('change', (e) => { s.filter = e.target.value; });
          bot.appendChild(filterSel);

          // Shape selector (v0.7.0)
          const shapeSel = document.createElement('select');
          shapeSel.className = 'tc-src-shape-select';
          [
            ['rect',    '▭'],
            ['rounded', '▢'],
            ['circle',  '⬤'],
          ].forEach(([v, l]) => {
            const opt = document.createElement('option');
            opt.value = v; opt.textContent = l;
            if ((s.shape || 'rect') === v) opt.selected = true;
            shapeSel.appendChild(opt);
          });
          shapeSel.title = t('sourceShape');
          shapeSel.addEventListener('change', (e) => { s.shape = e.target.value; });
          bot.appendChild(shapeSel);

          li.appendChild(bot);
        }

        list.appendChild(li);
      });
    }
    const stage = $('tcStage');
    if (stage) stage.classList.toggle('has-sources', this.sources.some(s => s.type !== 'mic'));
  },

  /* v0.2.1 FIX: captureStream() must be called once and the resulting video
     track reused for every recording. Both Chrome and Firefox have races where
     fresh-per-start captureStream() calls on the same canvas can hand back a
     track that never delivers frames to MediaRecorder, producing zero-byte
     webms. We now cache the stream on first use and re-use the same video
     track forever. */
  getMasterStream() {
    if (!this._canvasStream) {
      this._canvasStream = this.canvas.captureStream(30);
      log(`🎥 canvas stream: ${this._canvasStream.getVideoTracks().length}v ${this._canvasStream.getAudioTracks().length}a`, 'info');
    }
    const videoTrack = this._canvasStream.getVideoTracks()[0];
    const audioTrack = this.audioDest.stream.getAudioTracks()[0];
    if (!videoTrack) {
      log('✗ captureStream returned no video track — recording will fail', 'error');
    } else if (videoTrack.readyState !== 'live') {
      log(`✗ video track state is ${videoTrack.readyState}`, 'error');
    }
    const tracks = [];
    if (videoTrack) tracks.push(videoTrack);
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

  /* Re-apply the active scene layout without logging / chapter side-effects.
     Used after adding a source so it inherits the template / current layout. */
  reapply() {
    const s = this.presets.find(p => p.key === this.active);
    if (s) s.apply(Engine);
  },

  render() { renderScenes(); }
};

function setLayout(engine, layout) {
  // v0.4.0: sources flagged .custom (user has drag-positioned them) are
  // left alone entirely — position, size, shape, visibility, all preserved.
  // Free sources are hidden at the start and then the scene's layout rules
  // pick who to show and where.
  const freeCams   = engine.sources.filter(s => s.type === 'cam'    && !s.custom);
  const freeScreen = engine.sources.find(s => s.type === 'screen' && !s.custom);
  const W = engine.width, H = engine.height;

  // Hide all non-custom, non-mic sources; custom keep their visibility
  engine.sources.forEach(s => { if (s.type !== 'mic' && !s.custom) s.visible = false; });

  const place = (src, pos) => {
    if (!src) return;
    src.visible = true;
    if (pos === 'full')      { src.x = 0; src.y = 0; src.w = W; src.h = H; src.shape = 'rect'; }
    else if (pos === 'left') { src.x = 0; src.y = 0; src.w = W * 0.6; src.h = H; src.shape = 'rect'; }
    else if (pos === 'right'){ src.x = W * 0.6; src.y = 0; src.w = W * 0.4; src.h = H; src.shape = 'rect'; }
    else if (pos === 'br')   { src.x = W - 440; src.y = H - 340; src.w = 400; src.h = 300; src.shape = 'circle'; }
  };

  if (layout.screen) place(freeScreen, layout.screen);
  if (layout.firstCam && freeCams[0]) place(freeCams[0], layout.firstCam);
  if (layout.secondCam && freeCams[1]) place(freeCams[1], layout.secondCam);
  const faceCam = freeCams[freeCams.length - 1];
  if (layout.facecam && faceCam) place(faceCam, layout.facecam);

  if (layout.grid) {
    const items = [freeScreen, freeCams[0], freeCams[1]].filter(Boolean);
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

/* ─────────── Templates ─────────── */

const Templates = {
  presets: [
    {
      key: 'lesson', icon: '📚', i18n: 'tpl_lesson', i18n_desc: 'tpl_lesson_d',
      intro: 'tpl_lesson_intro',
      steps: [
        { scene: 'you',       label: 'tpl_lesson_s1' },
        { scene: 'code',      label: 'tpl_lesson_s2' },
        { scene: 'coderobot', label: 'tpl_lesson_s3' },
        { scene: 'coderobot', label: 'tpl_lesson_s4' },
        { scene: 'you',       label: 'tpl_lesson_s5' },
      ],
    },
    {
      key: 'robot', icon: '🤖', i18n: 'tpl_robot', i18n_desc: 'tpl_robot_d',
      intro: 'tpl_robot_intro',
      steps: [
        { scene: 'you',     label: 'tpl_robot_s1' },
        { scene: 'code',    label: 'tpl_robot_s2' },
        { scene: 'robot',   label: 'tpl_robot_s3' },
        { scene: 'sensors', label: 'tpl_robot_s4' },
        { scene: 'studio',  label: 'tpl_robot_s5' },
      ],
    },
    {
      key: 'fix', icon: '🔧', i18n: 'tpl_fix', i18n_desc: 'tpl_fix_d',
      intro: 'tpl_fix_intro',
      steps: [
        { scene: 'code',      label: 'tpl_fix_s1' },
        { scene: 'you',       label: 'tpl_fix_s2' },
        { scene: 'code',      label: 'tpl_fix_s3' },
        { scene: 'coderobot', label: 'tpl_fix_s4' },
        { scene: 'you',       label: 'tpl_fix_s5' },
      ],
    },
  ],
  active: null,
  currentStep: -1,

  apply(key) {
    const tpl = this.presets.find(p => p.key === key);
    if (!tpl) return;
    this.active = tpl;
    this.currentStep = 0;
    Scenes.switch(tpl.steps[0].scene);
    if (tpl.intro) TextOverlays.add(t(tpl.intro), { ttl: 6000 });
    this.renderStepStrip();
    log(`${t('tplStarted')}: ${tpl.icon} ${t(tpl.i18n)}`, 'success');
    showToast(`${tpl.icon} ${t(tpl.i18n)}`, 2000);
    Sfx.play('click');
    this.hidePicker();
  },

  clear() {
    this.active = null;
    this.currentStep = -1;
    this.renderStepStrip();
  },

  gotoStep(i) {
    if (!this.active) return;
    if (i < 0 || i >= this.active.steps.length) return;
    this.currentStep = i;
    const step = this.active.steps[i];
    Scenes.switch(step.scene);
    // If currently recording, add a chapter marker with the step label
    if (Recorder.state === 'recording' || Recorder.state === 'paused') {
      Chapters.items.push({ time: Recorder.elapsed() / 1000, label: t(step.label) });
    }
    this.renderStepStrip();
    Sfx.play('click');
  },

  renderStepStrip() {
    const el = $('tcTemplateStrip');
    if (!el) return;
    // Clear DOM
    while (el.firstChild) el.removeChild(el.firstChild);

    if (!this.active) {
      el.classList.remove('active');
      const pick = document.createElement('button');
      pick.className = 'tc-tpl-pick-btn';
      pick.addEventListener('click', () => this.showPicker());
      const icon = document.createElement('span'); icon.textContent = '🎬 ';
      const label = document.createElement('span'); label.textContent = t('tplChoose');
      pick.append(icon, label);
      el.appendChild(pick);
      return;
    }

    el.classList.add('active');
    const header = document.createElement('div');
    header.className = 'tc-tpl-strip-header';
    const title = document.createElement('span');
    title.className = 'tc-tpl-strip-title';
    title.textContent = `${this.active.icon} ${t(this.active.i18n)}`;
    const close = document.createElement('button');
    close.className = 'tc-tpl-strip-close';
    close.title = t('tplDismiss');
    close.textContent = '✕';
    close.addEventListener('click', () => this.clear());
    header.append(title, close);
    el.appendChild(header);

    const stepsEl = document.createElement('div');
    stepsEl.className = 'tc-tpl-steps';
    this.active.steps.forEach((step, i) => {
      const s = document.createElement('button');
      s.className = 'tc-tpl-step' + (i === this.currentStep ? ' active' : '') + (i < this.currentStep ? ' done' : '');
      const n = document.createElement('span'); n.className = 'tc-tpl-step-n'; n.textContent = i + 1;
      const l = document.createElement('span'); l.className = 'tc-tpl-step-l'; l.textContent = t(step.label);
      s.append(n, l);
      s.addEventListener('click', () => this.gotoStep(i));
      stepsEl.appendChild(s);
    });
    el.appendChild(stepsEl);
  },

  showPicker()  { const c = $('tcTemplates'); if (c) c.style.display = 'block'; },
  hidePicker()  { const c = $('tcTemplates'); if (c) c.style.display = 'none'; },
};

/* ─────────── Text Overlays ─────────── */

/* v0.7.0 rewrite: items now use top-left (x, y) coordinates and carry a
   computed bounding box (w, h) so the Drag system can hit-test and
   resize them like any other layer. Preset texts keep their 4-second
   auto-fade, but if the user drags or resizes one, the ttl timer is
   cancelled and the text stays permanent. */
const TextOverlays = {
  items: [],  // { id, text, x, y, w, h, size, color, bg, _ttlTimer?, pinned? }
  nextId: 1,
  selectedId: null,

  add(text, opts = {}) {
    const size = opts.size ?? 80;
    // Compute w/h using an offscreen canvas measureText
    const { w, h } = this._measure(text, size);
    // Default placement: centered-ish near the top, but converted to top-left
    const cx = opts.x ?? Engine.width / 2;
    const cy = opts.y ?? 160;
    const item = {
      id: this.nextId++,
      text,
      x: cx - w / 2,
      y: cy - h / 2,
      w, h, size,
      color: opts.color ?? '#ffffff',
      bg: opts.bg ?? 'rgba(0,0,0,.65)',
      pinned: opts.ttl === 0,   // free texts (from the "Free text" button) are pinned by default
    };
    this.items.push(item);
    log(`${t('textAdded')}: ${text}`, 'info');
    if (!item.pinned) {
      // auto-fade after 4s unless the user interacts (Drag cancels this)
      item._ttlTimer = setTimeout(() => this.remove(item.id), opts.ttl || 4000);
    }
    return item;
  },

  remove(id) {
    const item = this.items.find(i => i.id === id);
    if (item && item._ttlTimer) clearTimeout(item._ttlTimer);
    this.items = this.items.filter(i => i.id !== id);
    if (this.selectedId === id) this.selectedId = null;
  },

  /* Called by Drag on first interaction with an item — cancels the
     auto-fade timer and pins the text to the canvas permanently. */
  pin(id) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    if (item._ttlTimer) { clearTimeout(item._ttlTimer); item._ttlTimer = null; }
    item.pinned = true;
  },

  /* Recompute w/h when text or size changes. Uses the main canvas's
     context for measureText — measurement is cheap. */
  _measure(text, size) {
    const ctx = Engine && Engine.ctx;
    if (!ctx) return { w: 200, h: 100 };
    ctx.save();
    ctx.font = `800 ${size}px Bangers, Righteous, sans-serif`;
    const m = ctx.measureText(text);
    ctx.restore();
    const padX = 30, padY = 18;
    return {
      w: m.width + padX * 2,
      h: size * 1.2 + padY * 2,
    };
  },

  /* Drag is resizing a text overlay — scale the font size to the new w,
     then re-measure so the h (and actual w) matches. */
  resizeTo(item, newW) {
    const ratio = Math.max(30, newW) / item.w;
    item.size = Math.max(12, Math.min(400, item.size * ratio));
    const { w, h } = this._measure(item.text, item.size);
    // Anchor resize around top-left so the corner the user is dragging follows
    item.w = w;
    item.h = h;
  },

  drawAll(ctx) {
    this.items.forEach(item => {
      // Re-measure each frame in case the font just loaded or the text changed
      const { w, h } = this._measure(item.text, item.size);
      item.w = w; item.h = h;
      const cx = item.x + w / 2, cy = item.y + h / 2;

      ctx.save();
      ctx.font = `800 ${item.size}px Bangers, Righteous, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // rounded-rect background
      ctx.fillStyle = item.bg;
      ctx.beginPath();
      const r = Math.min(20, h / 3);
      ctx.moveTo(item.x + r, item.y);
      ctx.lineTo(item.x + w - r, item.y); ctx.quadraticCurveTo(item.x + w, item.y, item.x + w, item.y + r);
      ctx.lineTo(item.x + w, item.y + h - r); ctx.quadraticCurveTo(item.x + w, item.y + h, item.x + w - r, item.y + h);
      ctx.lineTo(item.x + r, item.y + h); ctx.quadraticCurveTo(item.x, item.y + h, item.x, item.y + h - r);
      ctx.lineTo(item.x, item.y + r); ctx.quadraticCurveTo(item.x, item.y, item.x + r, item.y);
      ctx.fill();

      // text with outline
      ctx.lineWidth = 6; ctx.strokeStyle = '#000';
      ctx.strokeText(item.text, cx, cy);
      ctx.fillStyle = item.color;
      ctx.fillText(item.text, cx, cy);

      // Selection + resize handles (teacher-visible, drawn on top)
      if (TextOverlays.selectedId === item.id) {
        ctx.strokeStyle = Engine._accentColor || '#a3e635';
        ctx.lineWidth = 3;
        ctx.setLineDash([12, 8]);
        ctx.strokeRect(item.x - 2, item.y - 2, w + 4, h + 4);
        ctx.setLineDash([]);
        // 4 corner handles
        const hs = 18;
        [[item.x, item.y], [item.x + w, item.y], [item.x, item.y + h], [item.x + w, item.y + h]]
          .forEach(([hx, hy]) => {
            ctx.fillStyle = Engine._accentColor || '#a3e635';
            ctx.fillRect(hx - hs / 2, hy - hs / 2, hs, hs);
          });
      }
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
  _pulseUntil: 0, _pulseDur: 800,  // marker-pulse animation state (ms)

  async start() {
    if (this.state !== 'idle' || this._starting) {
      log('✗ start() called while already starting/recording — ignored', 'error');
      return;
    }
    if (Engine.sources.filter(s => s.type !== 'mic').length === 0) {
      showToast(t('needSources'), 2500);
      return;
    }
    this._starting = true;
    try {
      // Chrome/Firefox start the AudioContext in 'suspended' state until
      // a user gesture. Resume here so the audio track actually carries
      // data (otherwise MediaRecorder can refuse to emit chunks).
      if (Engine.audioCtx && Engine.audioCtx.state === 'suspended') {
        try { await Engine.audioCtx.resume(); } catch {}
      }
      // Countdown
      if ($('tcCountdownEnabled').checked) {
        await this.countdown();
      }
      const stream = Engine.getMasterStream();
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();
      log(`🎬 master stream: ${videoTracks.length}v ${audioTracks.length}a`, 'info');
      if (videoTracks.length === 0) {
        showToast(t('recNoStream'), 4000);
        log('✗ no video track in master stream — aborting recording', 'error');
        return;
      }
      const mime = this.pickMime();
      log(`🎞 codec: ${mime || '(browser default)'}`, 'info');
      const bitrate = 4_000_000;
      try {
        this.recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: bitrate });
      } catch (e) {
        log(`⚠ MediaRecorder fallback (no mime): ${e.message}`, 'error');
        try {
          this.recorder = new MediaRecorder(stream, { videoBitsPerSecond: bitrate });
        } catch (e2) {
          log(`⚠ MediaRecorder fallback (defaults): ${e2.message}`, 'error');
          this.recorder = new MediaRecorder(stream);
        }
      }
      this.chunks = [];
      this._chunkCount = 0;
      this._totalBytes = 0;
      this.recorder.ondataavailable = e => {
        this._chunkCount++;
        const sz = e.data ? e.data.size : 0;
        this._totalBytes += sz;
        if (sz > 0) this.chunks.push(e.data);
        // Log every chunk during the first few, then occasionally
        if (this._chunkCount <= 3 || this._chunkCount % 20 === 0) {
          log(`📦 chunk #${this._chunkCount}: ${sz} B (total ${this._totalBytes} B)`, sz > 0 ? 'info' : 'error');
        }
      };
      this.recorder.onerror = (e) => {
        const err = e && e.error ? e.error : e;
        log(`✗ MediaRecorder error: ${err && err.name || ''} ${err && err.message || err}`, 'error');
        showToast(t('recorderError'), 4000);
      };
      this.recorder.onstop = () => this.finish();
      // 250 ms timeslice so even a 1-second recording buffers multiple chunks.
      // Firefox has historically been unreliable with the final flush at stop();
      // smaller slices reduce that risk.
      this.recorder.start(250);
      this.startTime = Date.now();
      this.pausedDuration = 0;
      this.state = 'recording';
      Chapters.reset();
      Chapters.add(t('scene_' + Scenes.active));
      SensorTimeline.start();
      SilenceWatch.start();
      this.updateUI();
      this.startTimer();
      log(t('recStarted'), 'success');
      showToast(t('recStarted'), 1500);
      Sfx.play('start');
      // v0.6.0: optional intro jingle, plays INTO the recording so every
      // tutorial opens with a "show's starting" cue
      Jingle.play();
    } finally {
      this._starting = false;
    }
  },

  pickMime() {
    // User preference: 'mp4', 'webm', or 'auto' (= first supported, MP4-first).
    // Stored in localStorage via the settings panel.
    let pref = 'auto';
    try { pref = localStorage.getItem('tc-format') || 'auto'; } catch {}
    const mp4 = [
      'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
      'video/mp4;codecs=avc1,mp4a.40.2',
      'video/mp4',
    ];
    const webm = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
    ];
    const order = pref === 'mp4' ? [...mp4, ...webm]
                : pref === 'webm' ? [...webm, ...mp4]
                : [...mp4, ...webm];  // auto — MP4 first when available
    for (const m of order) {
      if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) return m;
    }
    return '';
  },

  /* Derive the output filename extension from the actual mime type chosen
     by MediaRecorder. Cheaper and more accurate than trusting the preference. */
  extForMime(mime) {
    if (!mime) return 'webm';
    if (mime.startsWith('video/mp4')) return 'mp4';
    return 'webm';
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
    // Force a final ondataavailable flush before stopping. Firefox has
    // historically been unreliable with the implicit flush at stop().
    try { if (this.recorder.state !== 'inactive') this.recorder.requestData(); } catch {}
    try { this.recorder.stop(); } catch (e) { log(`✗ recorder.stop: ${e.message}`, 'error'); }
    this.state = 'idle';
    this.stopTimer();
    SensorTimeline.stop();
    SilenceWatch.stop();
  },

  finish() {
    log(`🏁 finish: ${this.chunks.length} chunks, ${this._totalBytes || 0} B total`, 'info');
    const mimeType = this.chunks[0]?.type || 'video/webm';
    const blob = new Blob(this.chunks, { type: mimeType });

    // v0.2.1: catch empty recordings loudly instead of silently downloading 0 B.
    if (blob.size === 0) {
      log('✗ 0-byte recording — pipeline produced no data', 'error');
      showToast(t('recEmpty'), 5000);
      this.updateUI();
      this.resetSceneState();
      return;
    }

    const url = URL.createObjectURL(blob);
    const video = $('tcTakeVideo');
    // revoke previous take URLs if any
    if (this._prevUrls) this._prevUrls.forEach(u => { try { URL.revokeObjectURL(u); } catch {} });
    this._prevUrls = [url];
    // Stash the raw take for the trim feature
    this._lastBlob = blob;
    this._lastMime = mimeType;
    video.src = url;
    $('tcTake').style.display = 'block';
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const fname = `tutocast-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}`;
    const ext = this.extForMime(mimeType);
    const dl = $('tcDownloadBtn');
    dl.href = url; dl.download = `${fname}.${ext}`;
    // Chapters VTT
    const vtt = Chapters.toVTT();
    const vttBlob = new Blob([vtt], { type: 'text/vtt' });
    const vttUrl = URL.createObjectURL(vttBlob);
    this._prevUrls.push(vttUrl);
    const dlVtt = $('tcDownloadVtt');
    dlVtt.href = vttUrl; dlVtt.download = `${fname}.vtt`;
    // v0.5.0: sensor CSV export — only if the micro:bit was connected and
    // actually produced samples during the recording. Goes in the same
    // download flow as the .webm and .vtt.
    const csv = SensorTimeline.toCSV();
    if (csv) {
      const csvBlob = new Blob([csv], { type: 'text/csv' });
      const csvUrl = URL.createObjectURL(csvBlob);
      this._prevUrls.push(csvUrl);
      const dlCsv = $('tcDownloadCsv');
      if (dlCsv) {
        dlCsv.href = csvUrl; dlCsv.download = `${fname}-sensors.csv`;
        dlCsv.style.display = '';
      }
      log(`📈 sensor CSV: ${SensorTimeline.samples.length} samples`, 'info');
    } else {
      const dlCsv = $('tcDownloadCsv');
      if (dlCsv) dlCsv.style.display = 'none';
    }

    // v0.5.0: if silence-trim has something to offer, expose the button
    const silenceBtn = $('tcSilenceTrimBtn');
    if (silenceBtn) silenceBtn.style.display = 'none';  // reset until analysed
    SilenceTrim.checkLastTake();

    // v0.6.0: snapshot stats for the BadgeCard generator
    BadgeCard.capture(blob, this.elapsed());

    // trigger auto-download of webm
    setTimeout(() => dl.click(), 200);
    log(`${t('recStopped')} — ${(blob.size / 1024 / 1024).toFixed(1)} MB`, 'success');
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
    // Trigger the visual pulse animation on all visible sources
    Recorder._pulseUntil = Date.now() + Recorder._pulseDur;
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
    if (this.on) showToast(t('laserHint'), 4000);
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
      showToast(t('freezeHint'), 4000);
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
    if (this.on) showToast(t('drawHint'), 4000);
  },
  clear() { Engine.overlayCtx.clearRect(0, 0, Engine.width, Engine.height); }
};

/* Drag — click-drag a source on the stage to reposition it. Marks the
   source as .custom so that subsequent scene switches don't override its
   position (setLayout explicitly skips custom sources). A "📌 Pin" toggle
   in the Active Sources list flips this manually, and a "Reset layout"
   button in the scenes sidebar clears all custom flags at once. */
/* v0.7.0 rewrite: the Drag system now owns hit-testing, dragging, AND
   resizing across THREE kinds of layers:
     • video sources ('source')
     • text overlays ('text')
     • brand watermark ('brand')
   Corner handles (within 30 canvas-px of any corner of a hit layer)
   start a resize instead of a drag. Sources keep aspect ratio on resize;
   text overlays scale their font size instead. */
const Drag = {
  state: null,  // { kind, ref, mode: 'move'|'resize', corner, offsetX, offsetY, startW, startH, startX, startY, aspect }
  SNAP_RADIUS: 60,
  CORNER_RADIUS: 36,
  stage: null,

  setup() {
    this.stage = $('tcStage');
    if (!this.stage) return;
    this.stage.addEventListener('mousedown', (e) => this._onDown(e));
    window.addEventListener('mousemove', (e) => this._onMove(e));
    window.addEventListener('mouseup', (e) => this._onUp(e));
    // Escape clears selection, Delete removes the selected overlay
    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return;
      const k = e.key.toLowerCase();
      if ((k === 'delete' || k === 'backspace') && TextOverlays.selectedId != null) {
        TextOverlays.remove(TextOverlays.selectedId);
        e.preventDefault();
      }
    });
  },

  _stageToCanvas(e) {
    const r = this.stage.getBoundingClientRect();
    return [
      ((e.clientX - r.left) / r.width) * Engine.width,
      ((e.clientY - r.top)  / r.height) * Engine.height,
    ];
  },

  /* Returns the nearest corner index (0=TL, 1=TR, 2=BL, 3=BR) if (mx,my)
     is within CORNER_RADIUS canvas-pixels of one of obj's corners, else -1. */
  _nearCorner(obj, mx, my) {
    const corners = [
      [obj.x,            obj.y],
      [obj.x + obj.w,    obj.y],
      [obj.x,            obj.y + obj.h],
      [obj.x + obj.w,    obj.y + obj.h],
    ];
    const r2 = this.CORNER_RADIUS * this.CORNER_RADIUS;
    for (let i = 0; i < 4; i++) {
      const dx = mx - corners[i][0], dy = my - corners[i][1];
      if (dx * dx + dy * dy < r2) return i;
    }
    return -1;
  },

  _insideRect(obj, mx, my) {
    return mx >= obj.x && mx <= obj.x + obj.w && my >= obj.y && my <= obj.y + obj.h;
  },

  _insideCircle(obj, mx, my) {
    const cx = obj.x + obj.w / 2, cy = obj.y + obj.h / 2;
    const r = Math.min(obj.w, obj.h) / 2;
    return (mx - cx) ** 2 + (my - cy) ** 2 <= r * r;
  },

  /* Topmost-first hit test over all interactive layers. Draw order, from
     bottom to top, is: sources → text overlays → brand. Hit-test in reverse. */
  _hitTest(mx, my) {
    // 1. Brand watermark (topmost if present)
    if (Brand.visible()) {
      if (this._insideRect(Brand, mx, my)) return { kind: 'brand', ref: Brand };
    }
    // 2. Text overlays (reverse)
    for (let i = TextOverlays.items.length - 1; i >= 0; i--) {
      const it = TextOverlays.items[i];
      if (this._insideRect(it, mx, my)) return { kind: 'text', ref: it };
    }
    // 3. Sources (reverse, respecting shape)
    const srcs = Engine.sources;
    for (let i = srcs.length - 1; i >= 0; i--) {
      const s = srcs[i];
      if (s.type === 'mic' || !s.visible || !s.video) continue;
      const inside = s.shape === 'circle' ? this._insideCircle(s, mx, my) : this._insideRect(s, mx, my);
      if (inside) return { kind: 'source', ref: s };
    }
    return null;
  },

  _onDown(e) {
    if (e.button !== 0) return;
    if (Whiteboard.on) return;
    const [mx, my] = this._stageToCanvas(e);
    const hit = this._hitTest(mx, my);
    if (!hit) {
      // Clicking empty canvas deselects any selected text overlay
      if (TextOverlays.selectedId != null) TextOverlays.selectedId = null;
      return;
    }
    const { kind, ref } = hit;
    // Mark text selection for the visible selection rectangle
    if (kind === 'text') TextOverlays.selectedId = ref.id;
    else TextOverlays.selectedId = null;

    // Corner-near → resize, otherwise move
    const corner = this._nearCorner(ref, mx, my);
    if (corner >= 0) {
      this.state = {
        kind, ref, mode: 'resize', corner,
        startX: ref.x, startY: ref.y, startW: ref.w, startH: ref.h,
        aspect: ref.w / ref.h,
      };
    } else {
      this.state = {
        kind, ref, mode: 'move', corner: -1,
        offsetX: mx - ref.x, offsetY: my - ref.y,
      };
      // Pin text overlays on first interaction so they don't auto-fade
      if (kind === 'text') TextOverlays.pin(ref.id);
    }
    this.stage.classList.add('dragging');
    e.preventDefault();
  },

  _onMove(e) {
    if (!this.state) return;
    const [mx, my] = this._stageToCanvas(e);
    const s = this.state;
    const ref = s.ref;

    if (s.mode === 'move') {
      let nx = mx - s.offsetX;
      let ny = my - s.offsetY;
      // Snap for sources only (keeps kid layouts clean)
      if (s.kind === 'source') {
        const W = Engine.width, H = Engine.height, M = 40;
        const anchors = [
          [M, M], [W - ref.w - M, M], [M, H - ref.h - M], [W - ref.w - M, H - ref.h - M],
          [(W - ref.w) / 2, M], [(W - ref.w) / 2, H - ref.h - M], [(W - ref.w) / 2, (H - ref.h) / 2],
        ];
        const r2 = this.SNAP_RADIUS * this.SNAP_RADIUS;
        for (const [ax, ay] of anchors) {
          if ((nx - ax) ** 2 + (ny - ay) ** 2 < r2) { nx = ax; ny = ay; break; }
        }
      }
      // Keep inside canvas
      nx = Math.max(0, Math.min(Engine.width  - ref.w, nx));
      ny = Math.max(0, Math.min(Engine.height - ref.h, ny));
      ref.x = nx; ref.y = ny;
      if (s.kind === 'source') { ref.custom = true; Engine.onSourcesChanged(); }
    } else {
      // resize
      // corner: 0=TL, 1=TR, 2=BL, 3=BR
      const right  = s.corner === 1 || s.corner === 3;
      const bottom = s.corner === 2 || s.corner === 3;
      const oppX = right ? s.startX : s.startX + s.startW;
      const oppY = bottom ? s.startY : s.startY + s.startH;
      let newW = Math.abs(mx - oppX);
      let newH = Math.abs(my - oppY);
      // Minimum sizes
      newW = Math.max(80, newW);
      newH = Math.max(60, newH);
      // Sources keep aspect ratio; text overlays resize proportionally via their own method
      if (s.kind === 'source') {
        const keepByWidth = newW / s.aspect > newH;
        if (keepByWidth) newH = newW / s.aspect; else newW = newH * s.aspect;
      }
      // New top-left depends on which corner we're dragging
      const newX = right ? s.startX : Math.min(mx, oppX);
      const newY = bottom ? s.startY : Math.min(my, oppY);

      if (s.kind === 'text') {
        TextOverlays.resizeTo(ref, newW);
        ref.x = newX;
        ref.y = newY;
      } else if (s.kind === 'source') {
        ref.x = newX; ref.y = newY;
        ref.w = newW; ref.h = newH;
        ref.custom = true;
        Engine.onSourcesChanged();
      } else if (s.kind === 'brand') {
        Brand.resizeTo(newW);
        ref.x = newX; ref.y = newY;
      }
    }
  },

  _onUp() {
    if (this.state) {
      this.state = null;
      if (this.stage) this.stage.classList.remove('dragging');
    }
  },

  /* Pin/unpin + reset (source-only controls, unchanged from v0.4.0) */
  togglePin(id) {
    const src = Engine.sources.find(s => s.id === id);
    if (!src) return;
    src.custom = !src.custom;
    Engine.onSourcesChanged();
    if (!src.custom) Scenes.reapply();
    log(src.custom ? `📌 pinned: ${src.label}` : `🔓 unpinned: ${src.label}`, 'info');
  },

  resetAll() {
    Engine.sources.forEach(s => { s.custom = false; });
    Scenes.reapply();
    Engine.onSourcesChanged();
    log('🔓 layout reset', 'info');
    showToast(t('layoutReset'), 1800);
  },
};

/* ─────────── Brand — logo + slogan watermark on the canvas (v0.7.0) ─────

   Draggable, resizable, filterable. The teacher uploads their logo via
   Settings (FileReader → dataURL → <img>), types a slogan, and picks a
   fun effect (spin/pulse/bounce/wiggle/glow/rainbow). Drawn in
   Engine.render() after the text overlays so it's always on top. */
const Brand = {
  img: null,              // HTMLImageElement, loaded from dataURL
  logoDataUrl: null,      // persisted in localStorage
  slogan: '',             // e.g. "code + robot + ☕"
  x: 40, y: 40, w: 180, h: 180,   // bounding box (top-left + size)
  effect: 'none',          // 'none'|'spin'|'pulse'|'bounce'|'wiggle'|'glow'|'rainbow'

  load() {
    try {
      this.logoDataUrl = localStorage.getItem('tc-brand-logo') || null;
      this.slogan      = localStorage.getItem('tc-brand-slogan') || '';
      this.effect      = localStorage.getItem('tc-brand-effect') || 'none';
      const pos        = localStorage.getItem('tc-brand-pos');
      if (pos) { try { const p = JSON.parse(pos); Object.assign(this, p); } catch {} }
    } catch {}
    if (this.logoDataUrl) this._loadImg();
  },

  save() {
    try {
      if (this.logoDataUrl) localStorage.setItem('tc-brand-logo', this.logoDataUrl);
      localStorage.setItem('tc-brand-slogan', this.slogan || '');
      localStorage.setItem('tc-brand-effect', this.effect);
      localStorage.setItem('tc-brand-pos', JSON.stringify({ x: this.x, y: this.y, w: this.w, h: this.h }));
    } catch {}
  },

  _loadImg() {
    if (!this.logoDataUrl) { this.img = null; return; }
    const img = new Image();
    img.onload = () => { this.img = img; };
    img.onerror = () => { this.img = null; log('✗ brand logo failed to load', 'error'); };
    img.src = this.logoDataUrl;
  },

  setLogoFromFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.logoDataUrl = e.target.result;
      this._loadImg();
      this.save();
      showToast(t('brandLogoLoaded'), 2000);
    };
    reader.readAsDataURL(file);
  },

  clearLogo() {
    this.logoDataUrl = null;
    this.img = null;
    try { localStorage.removeItem('tc-brand-logo'); } catch {}
  },

  setSlogan(s) { this.slogan = s || ''; this.save(); },
  setEffect(e) { this.effect = e || 'none'; this.save(); },

  resizeTo(newW) {
    const ratio = Math.max(60, newW) / this.w;
    this.w = Math.max(60, newW);
    this.h = this.h * ratio;
    this.save();
  },

  /* Is there anything to draw? (logo OR slogan must be set) */
  visible() { return !!(this.img || (this.slogan && this.slogan.trim())); },

  /* Apply one of the "fun effects" as a canvas transform around (cx, cy).
     Called with ctx already saved; we set up the transform and return. */
  _applyEffect(ctx, cx, cy) {
    if (this.effect === 'none') return;
    const now = Date.now() / 1000;
    switch (this.effect) {
      case 'spin': {
        ctx.translate(cx, cy);
        ctx.rotate(now * 1.2);          // ~11 rpm
        ctx.translate(-cx, -cy);
        break;
      }
      case 'pulse': {
        const s = 1 + Math.sin(now * 3) * 0.08;
        ctx.translate(cx, cy);
        ctx.scale(s, s);
        ctx.translate(-cx, -cy);
        break;
      }
      case 'bounce': {
        const dy = Math.abs(Math.sin(now * 4)) * -20;
        ctx.translate(0, dy);
        break;
      }
      case 'wiggle': {
        ctx.translate(cx, cy);
        ctx.rotate(Math.sin(now * 5) * 0.1);  // ±5.7° oscillation
        ctx.translate(-cx, -cy);
        break;
      }
      case 'glow': {
        const pulse = 20 + Math.sin(now * 3) * 15;
        ctx.shadowColor = Engine._accentColor || '#a3e635';
        ctx.shadowBlur = pulse;
        break;
      }
      case 'rainbow': {
        const hue = (now * 60) % 360;
        ctx.filter = `hue-rotate(${hue.toFixed(0)}deg) saturate(1.4)`;
        break;
      }
    }
  },

  draw(ctx) {
    if (!this.visible()) return;
    ctx.save();
    const cx = this.x + this.w / 2, cy = this.y + this.h / 2;
    this._applyEffect(ctx, cx, cy);

    // Logo
    if (this.img) {
      ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }

    // Reset filter for the text (we want sharp text) but keep the transform
    ctx.filter = 'none';

    // Slogan text below the logo
    if (this.slogan && this.slogan.trim()) {
      const textSize = Math.max(20, this.w * 0.18);
      ctx.font = `800 ${textSize}px Bangers, Righteous, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const textY = this.img ? this.y + this.h + 8 : this.y;
      // Outline + fill for readability
      ctx.lineWidth = 6; ctx.strokeStyle = '#000';
      ctx.strokeText(this.slogan, cx, textY);
      ctx.fillStyle = '#fff';
      ctx.fillText(this.slogan, cx, textY);
    }
    ctx.restore();
  },
};

/* Zoom — smooth canvas transform for code-tutorial "focus moments".
   Triggered by the Z hotkey or by micro:bit button A. Current zoom level
   eases toward the target each frame via Engine.render calling Zoom.tick. */
const Zoom = {
  on: false,
  current: 1,          // live scale, eased
  target: 1,           // destination scale
  maxScale: 1.8,       // how far in we zoom
  cx: 960, cy: 540,    // focus center (canvas coords, default = middle)
  setup() {
    const stage = $('tcStage');
    if (!stage) return;
    // Track the cursor so the next zoom-in pivots around where the teacher is looking
    stage.addEventListener('mousemove', (e) => {
      const r = stage.getBoundingClientRect();
      this.cx = ((e.clientX - r.left) / r.width) * Engine.width;
      this.cy = ((e.clientY - r.top) / r.height) * Engine.height;
    });
  },
  tick() {
    // Exponential ease toward target; ~98% there after ~200ms at 60fps
    this.current += (this.target - this.current) * 0.18;
    if (Math.abs(this.current - this.target) < 0.002) this.current = this.target;
  },
  toggle() {
    this.on = !this.on;
    this.target = this.on ? this.maxScale : 1;
    $('tcZoomBtn')?.classList.toggle('active', this.on);
    log(this.on ? t('zoomOn') : t('zoomOff'), 'info');
    if (this.on) showToast(t('zoomHint'), 4000);
    Sfx.play('click');
  },
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

/* ─────────── Trim — non-destructive take shortening ───────────

   The user opens the Take panel, clicks Trim, drags two handles
   over the preview scrubber to pick inTime/outTime, then clicks
   Export. We re-encode by playing the source video to an offscreen
   canvas and piping that canvas (+ a re-routed audio graph from the
   same <video>) through a fresh MediaRecorder. One re-encode pass,
   slight quality loss, full control over codec and output format.

   No dependencies, no ffmpeg.wasm, no cloud. */
const Trim = {
  inTime: 0, outTime: 0, duration: 0,
  encoding: false,
  srcBlob: null, srcMime: null,

  open() {
    if (!Recorder._lastBlob) { showToast(t('trimNoTake'), 2500); return; }
    this.srcBlob = Recorder._lastBlob;
    this.srcMime = Recorder._lastMime || 'video/webm';
    const video = $('tcTrimVideo');
    video.src = URL.createObjectURL(this.srcBlob);
    video.onloadedmetadata = () => {
      // Some browsers report Infinity for blob duration until a seek nudge
      if (!isFinite(video.duration)) {
        video.currentTime = 1e9;
        video.ontimeupdate = () => { video.ontimeupdate = null; video.currentTime = 0; this._setRange(video.duration); };
      } else {
        this._setRange(video.duration);
      }
    };
    $('tcTrimModal').style.display = 'flex';
  },

  close() {
    $('tcTrimModal').style.display = 'none';
    const v = $('tcTrimVideo');
    if (v.src) { try { URL.revokeObjectURL(v.src); } catch {} v.src = ''; }
    this.encoding = false;
    $('tcTrimProgress').style.display = 'none';
  },

  _setRange(dur) {
    this.duration = dur || 0;
    this.inTime = 0;
    this.outTime = this.duration;
    const inSlider = $('tcTrimIn'), outSlider = $('tcTrimOut');
    inSlider.min = outSlider.min = 0;
    inSlider.max = outSlider.max = this.duration;
    inSlider.step = outSlider.step = 0.1;
    inSlider.value = 0;
    outSlider.value = this.duration;
    this._updateLabels();
  },

  _updateLabels() {
    const fmt = s => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
    $('tcTrimInLabel').textContent = fmt(this.inTime);
    $('tcTrimOutLabel').textContent = fmt(this.outTime);
    $('tcTrimDurationLabel').textContent = fmt(Math.max(0, this.outTime - this.inTime));
  },

  onInChange(v) {
    this.inTime = Math.min(parseFloat(v), this.outTime - 0.5);
    $('tcTrimIn').value = this.inTime;
    $('tcTrimVideo').currentTime = this.inTime;
    this._updateLabels();
  },

  onOutChange(v) {
    this.outTime = Math.max(parseFloat(v), this.inTime + 0.5);
    $('tcTrimOut').value = this.outTime;
    $('tcTrimVideo').currentTime = this.outTime;
    this._updateLabels();
  },

  previewIn()  { const v = $('tcTrimVideo'); v.currentTime = this.inTime; v.pause(); },
  previewOut() { const v = $('tcTrimVideo'); v.currentTime = this.outTime; v.pause(); },

  async exportTrimmed() {
    if (this.encoding) return;
    if (this.outTime - this.inTime < 0.2) { showToast(t('trimTooShort'), 2500); return; }
    this.encoding = true;
    const prog = $('tcTrimProgress');
    const progBar = $('tcTrimProgressBar');
    prog.style.display = 'block';
    progBar.style.width = '0%';

    const srcVideo = document.createElement('video');
    srcVideo.src = URL.createObjectURL(this.srcBlob);
    srcVideo.muted = true;   // routed via Web Audio, we don't want a speaker dupe
    srcVideo.playsInline = true;
    await new Promise(r => srcVideo.addEventListener('loadedmetadata', r, { once: true }));
    // Nudge duration for blob URLs that report Infinity
    if (!isFinite(srcVideo.duration)) {
      srcVideo.currentTime = 1e9;
      await new Promise(r => srcVideo.addEventListener('timeupdate', r, { once: true }));
    }
    const W = srcVideo.videoWidth || Engine.width;
    const H = srcVideo.videoHeight || Engine.height;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d', { alpha: false });

    // Audio graph: re-route the source <video> through a dedicated AudioContext
    // so the trimmed recording gets the source's audio. We can't touch
    // Engine.audioCtx (it's already bound to the live pipeline).
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    const src = ac.createMediaElementSource(srcVideo);
    const dest = ac.createMediaStreamDestination();
    // Also keep a permanent silent ConstantSource in case the take is silent
    // (same bug class as v0.2.2 — MediaRecorder stalls on samples-empty audio)
    const silent = ac.createConstantSource();
    const gain = ac.createGain();
    gain.gain.value = 0;
    silent.connect(gain).connect(dest);
    silent.start();
    src.connect(dest);

    const videoStream = canvas.captureStream(30);
    const stream = new MediaStream([
      videoStream.getVideoTracks()[0],
      dest.stream.getAudioTracks()[0],
    ]);
    const mime = Recorder.pickMime();  // honour current format preference
    let rec;
    try {
      rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4_000_000 });
    } catch {
      rec = new MediaRecorder(stream, { videoBitsPerSecond: 4_000_000 });
    }
    const chunks = [];
    rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    const finished = new Promise(r => rec.onstop = r);
    rec.onerror = (e) => log(`✗ trim recorder error: ${e.error || e}`, 'error');

    srcVideo.currentTime = this.inTime;
    await new Promise(r => srcVideo.addEventListener('seeked', r, { once: true }));
    rec.start(250);
    await srcVideo.play();

    const inT = this.inTime, outT = this.outTime;
    const duration = outT - inT;
    let rafId;
    const loop = () => {
      ctx.drawImage(srcVideo, 0, 0, W, H);
      const progress = Math.min(1, (srcVideo.currentTime - inT) / duration);
      progBar.style.width = (progress * 100).toFixed(1) + '%';
      if (srcVideo.currentTime >= outT || srcVideo.ended) {
        cancelAnimationFrame(rafId);
        srcVideo.pause();
        try { rec.requestData(); } catch {}
        rec.stop();
        return;
      }
      rafId = requestAnimationFrame(loop);
    };
    loop();

    await finished;
    const outBlob = new Blob(chunks, { type: chunks[0]?.type || mime || 'video/webm' });

    // Cleanup audio graph
    try { silent.stop(); } catch {}
    try { ac.close(); } catch {}
    try { URL.revokeObjectURL(srcVideo.src); } catch {}

    if (outBlob.size === 0) {
      showToast(t('recEmpty'), 5000);
      log('✗ trim produced 0-byte blob', 'error');
      prog.style.display = 'none';
      this.encoding = false;
      return;
    }

    // Trigger download + updated VTT
    const url = URL.createObjectURL(outBlob);
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const fname = `tutocast-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}-trim`;
    const ext = Recorder.extForMime(outBlob.type);
    const a = document.createElement('a');
    a.href = url; a.download = `${fname}.${ext}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);

    // Adjust chapters: shift by -inTime, drop anything outside the new window
    const adjusted = Chapters.items
      .map(c => ({ time: c.time - inT, label: c.label }))
      .filter(c => c.time >= 0 && c.time <= duration);
    const vttItems = Chapters.items.slice();
    Chapters.items = adjusted;
    const vtt = Chapters.toVTT.call({ items: adjusted, fmtTime: Chapters.fmtTime });
    Chapters.items = vttItems;  // restore
    if (adjusted.length) {
      const vttBlob = new Blob([vtt], { type: 'text/vtt' });
      const vttUrl = URL.createObjectURL(vttBlob);
      const va = document.createElement('a');
      va.href = vttUrl; va.download = `${fname}.vtt`;
      va.click();
      setTimeout(() => URL.revokeObjectURL(vttUrl), 60_000);
    }

    log(`✂️ trim exported: ${(outBlob.size / 1024 / 1024).toFixed(1)} MB (${duration.toFixed(1)}s)`, 'success');
    showToast(`✂️ ${t('trimExported')} — ${(outBlob.size / 1024 / 1024).toFixed(1)} MB`, 3000);
    Sfx.play('stop');
    progBar.style.width = '100%';
    this.encoding = false;
    setTimeout(() => this.close(), 800);
  },
};

/* ─────────── SilenceTrim — auto-remove long silences from the last take ──────

   Scans the recorded audio for runs of sub-threshold RMS longer than
   MIN_SILENCE_SEC, produces a list of "keep ranges" (the loud parts),
   then re-encodes via the same offscreen-canvas pipeline as the Trim
   tool — only seeking through the keep ranges instead of one window.

   Fully local: uses AudioContext.decodeAudioData to get the samples.
   No deps, no cloud, no AI. Just RMS thresholding. */
const SilenceTrim = {
  MIN_SILENCE_SEC: 2.0,
  PAD_SEC: 0.15,        // leave a little breathing room either side of each cut
  THRESHOLD: 0.015,     // RMS below this is "silent"
  WINDOW_MS: 100,

  keepRanges: null,    // [[startSec, endSec], ...] after analysis
  savedSeconds: 0,
  encoding: false,

  /* Called after Recorder.finish() — decodes the audio of the last take,
     computes keep ranges, and if the total silence saved is >= 2s,
     shows the "Remove silences?" button in the Take panel. */
  async checkLastTake() {
    if (!Recorder._lastBlob) return;
    const btn = $('tcSilenceTrimBtn');
    if (!btn) return;
    btn.style.display = 'none';
    this.keepRanges = null;
    this.savedSeconds = 0;

    try {
      const ab = await Recorder._lastBlob.arrayBuffer();
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      let audioBuf;
      try {
        audioBuf = await ac.decodeAudioData(ab.slice(0));
      } catch (e) {
        log(`silence-scan decode failed: ${e.message}`, 'info');
        try { ac.close(); } catch {}
        return;
      }
      const samples = audioBuf.getChannelData(0);
      const sr = audioBuf.sampleRate;
      const duration = audioBuf.duration;
      const windowSamples = Math.max(1, Math.floor((this.WINDOW_MS / 1000) * sr));

      // Step 1: compute silent/loud mask per window
      const windows = [];
      for (let i = 0; i < samples.length; i += windowSamples) {
        let sum = 0;
        const end = Math.min(i + windowSamples, samples.length);
        for (let j = i; j < end; j++) sum += samples[j] * samples[j];
        const rms = Math.sqrt(sum / (end - i));
        windows.push({ t: i / sr, silent: rms < this.THRESHOLD });
      }

      // Step 2: find silent runs ≥ MIN_SILENCE_SEC
      const cuts = [];   // [[cutStart, cutEnd], ...]
      let runStart = null;
      for (let i = 0; i < windows.length; i++) {
        if (windows[i].silent) {
          if (runStart == null) runStart = windows[i].t;
        } else if (runStart != null) {
          const runEnd = windows[i].t;
          if (runEnd - runStart >= this.MIN_SILENCE_SEC) {
            // pad inward so we don't clip speech
            cuts.push([runStart + this.PAD_SEC, runEnd - this.PAD_SEC]);
          }
          runStart = null;
        }
      }
      if (runStart != null && duration - runStart >= this.MIN_SILENCE_SEC) {
        cuts.push([runStart + this.PAD_SEC, duration]);
      }

      try { ac.close(); } catch {}

      if (cuts.length === 0) {
        log('🔊 silence-scan: no long silences found', 'info');
        return;
      }

      // Step 3: invert cuts into keep ranges
      const keep = [];
      let cursor = 0;
      for (const [cs, ce] of cuts) {
        if (cs > cursor) keep.push([cursor, cs]);
        cursor = ce;
      }
      if (cursor < duration) keep.push([cursor, duration]);

      this.keepRanges = keep;
      this.savedSeconds = cuts.reduce((a, [s, e]) => a + (e - s), 0);
      log(`🔊 silence-scan: ${cuts.length} silent runs, ${this.savedSeconds.toFixed(1)}s saved`, 'info');
      // Show the offer button with the saved-seconds count in the label
      btn.style.display = '';
      btn.textContent = `🔇 ${t('removeSilence')} (−${this.savedSeconds.toFixed(1)}s)`;
    } catch (e) {
      log(`silence-scan error: ${e.message}`, 'error');
    }
  },

  async exportCleaned() {
    if (this.encoding) return;
    if (!this.keepRanges || !Recorder._lastBlob) return;
    this.encoding = true;
    const btn = $('tcSilenceTrimBtn');
    if (btn) btn.disabled = true;
    showToast(t('silenceEncoding'), 2500);

    const srcVideo = document.createElement('video');
    srcVideo.src = URL.createObjectURL(Recorder._lastBlob);
    srcVideo.muted = true;
    srcVideo.playsInline = true;
    await new Promise(r => srcVideo.addEventListener('loadedmetadata', r, { once: true }));
    if (!isFinite(srcVideo.duration)) {
      srcVideo.currentTime = 1e9;
      await new Promise(r => srcVideo.addEventListener('timeupdate', r, { once: true }));
    }

    const W = srcVideo.videoWidth || Engine.width;
    const H = srcVideo.videoHeight || Engine.height;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d', { alpha: false });

    const ac = new (window.AudioContext || window.webkitAudioContext)();
    const src = ac.createMediaElementSource(srcVideo);
    const dest = ac.createMediaStreamDestination();
    const silent = ac.createConstantSource();
    const gain = ac.createGain(); gain.gain.value = 0;
    silent.connect(gain).connect(dest);
    silent.start();
    src.connect(dest);

    const videoStream = canvas.captureStream(30);
    const stream = new MediaStream([
      videoStream.getVideoTracks()[0],
      dest.stream.getAudioTracks()[0],
    ]);
    const mime = Recorder.pickMime();
    let rec;
    try {
      rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4_000_000 });
    } catch {
      rec = new MediaRecorder(stream, { videoBitsPerSecond: 4_000_000 });
    }
    const chunks = [];
    rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    const finished = new Promise(r => rec.onstop = r);

    rec.start(250);

    // Walk each keep range sequentially. For each: seek to start, play, and
    // push canvas frames until we hit the end. Then seek to the next range's
    // start and continue. A brief pause is needed around the seek to let the
    // <video> stall/flush cleanly so audio doesn't blip.
    let rangeIdx = 0;
    let rafId;
    const pumpRange = async (ri) => {
      const [rs, re] = this.keepRanges[ri];
      srcVideo.currentTime = rs;
      await new Promise(r => srcVideo.addEventListener('seeked', r, { once: true }));
      srcVideo.play();
      await new Promise((resolve) => {
        const step = () => {
          ctx.drawImage(srcVideo, 0, 0, W, H);
          if (srcVideo.currentTime >= re || srcVideo.ended) {
            srcVideo.pause();
            cancelAnimationFrame(rafId);
            resolve();
            return;
          }
          rafId = requestAnimationFrame(step);
        };
        step();
      });
    };

    for (rangeIdx = 0; rangeIdx < this.keepRanges.length; rangeIdx++) {
      await pumpRange(rangeIdx);
    }
    try { rec.requestData(); } catch {}
    rec.stop();
    await finished;
    try { silent.stop(); } catch {}
    try { ac.close(); } catch {}
    try { URL.revokeObjectURL(srcVideo.src); } catch {}

    const outBlob = new Blob(chunks, { type: chunks[0]?.type || mime || 'video/webm' });
    if (outBlob.size === 0) {
      showToast(t('recEmpty'), 5000);
      log('✗ silence-trim produced 0-byte blob', 'error');
      this.encoding = false;
      if (btn) btn.disabled = false;
      return;
    }

    const url = URL.createObjectURL(outBlob);
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const fname = `tutocast-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}-nosilence`;
    const ext = Recorder.extForMime(outBlob.type);
    const a = document.createElement('a');
    a.href = url; a.download = `${fname}.${ext}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);

    log(`🔇 silence-trim exported: ${(outBlob.size / 1024 / 1024).toFixed(1)} MB (saved ${this.savedSeconds.toFixed(1)}s)`, 'success');
    showToast(`🔇 ${t('silenceExported')} (−${this.savedSeconds.toFixed(1)}s)`, 3000);
    Sfx.play('stop');
    this.encoding = false;
    if (btn) { btn.disabled = false; btn.style.display = 'none'; }
  },
};

/* BadgeCard — generates a 1200×630 PNG achievement card after a recording.
   Social-share-ready dimensions (OpenGraph / Twitter card). Pure canvas
   drawing, zero deps. Renders TutoCast branding + duration + camera count
   + chapter count + micro:bit status + template used (if any). */
const BadgeCard = {
  W: 1200, H: 630,

  _lastStats: null,

  /* Called from Recorder.finish(). Snapshots the stats that we need to
     render into the card so subsequent recordings don't overwrite them. */
  capture(blob, durationMs) {
    const mbCount = Sensors.values ? 1 : 0;
    const camCount = Engine.sources.filter(s => s.type === 'cam').length;
    const scrCount = Engine.sources.filter(s => s.type === 'screen').length;
    const chapters = Chapters.items ? Chapters.items.length : 0;
    const markers = Chapters.items ? Chapters.items.filter(i => i.label && i.label.startsWith('Marker')).length : 0;
    this._lastStats = {
      duration: durationMs / 1000,
      bytes: blob.size,
      camCount, scrCount, mbCount, chapters, markers,
      template: Templates.active ? Templates.active.key : null,
      templateIcon: Templates.active ? Templates.active.icon : null,
      templateLabel: Templates.active ? Templates.active.i18n : null,
      themeAccent: Engine._accentColor || '#a3e635',
      date: new Date(),
    };
  },

  /* Render the stashed stats into a fresh canvas and trigger a PNG download. */
  exportPng() {
    const s = this._lastStats;
    if (!s) { showToast(t('badgeNoTake'), 2500); return; }

    const canvas = document.createElement('canvas');
    canvas.width = this.W;
    canvas.height = this.H;
    const ctx = canvas.getContext('2d');

    // Background gradient using the current theme accent
    const bg = ctx.createLinearGradient(0, 0, this.W, this.H);
    bg.addColorStop(0, '#0a1a04');
    bg.addColorStop(1, '#000000');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, this.W, this.H);

    // Accent-color glow in top-right
    const glow = ctx.createRadialGradient(this.W * 0.85, this.H * 0.2, 20, this.W * 0.85, this.H * 0.2, 500);
    glow.addColorStop(0, this._hexToRgba(s.themeAccent, 0.35));
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, this.W, this.H);

    // Outer frame
    ctx.strokeStyle = s.themeAccent;
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, this.W - 40, this.H - 40);

    // Big trophy emoji + "TutoCast" logo in top-left
    ctx.font = '700 110px "Righteous", Arial, sans-serif';
    ctx.fillStyle = s.themeAccent;
    ctx.textBaseline = 'top';
    ctx.fillText('🎬', 60, 56);
    ctx.fillStyle = '#fff';
    ctx.fillText('TutoCast', 200, 56);

    // Version tag
    ctx.font = '500 28px "Orbitron", monospace';
    ctx.fillStyle = 'rgba(255,255,255,.45)';
    ctx.fillText('v' + APP_VERSION, 205, 180);

    // Headline
    ctx.font = '800 64px "Bangers", "Righteous", sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(t('badgeHeadline'), 60, 240);

    // Stat rows — four cells, two per row
    const stats = [
      [this._fmtDuration(s.duration), t('badgeStatDuration')],
      [`${s.camCount}🎥 + ${s.scrCount}🖥`,            t('badgeStatSources')],
      [`${s.chapters}🏷`,                               t('badgeStatChapters')],
      [s.mbCount ? '🤖 ' + t('connected') : '—',        t('badgeStatMicrobit')],
    ];
    const gridX = 60, gridY = 340;
    const cellW = (this.W - 120) / 2, cellH = 90;
    stats.forEach((row, i) => {
      const cx = gridX + (i % 2) * cellW;
      const cy = gridY + Math.floor(i / 2) * cellH;
      // Value — big, accent color
      ctx.font = '800 48px "Orbitron", monospace';
      ctx.fillStyle = s.themeAccent;
      ctx.fillText(row[0], cx, cy);
      // Label — small, muted
      ctx.font = '500 20px "Righteous", Arial, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,.55)';
      ctx.fillText(row[1], cx, cy + 52);
    });

    // Template badge in bottom-right if one was active
    if (s.templateIcon) {
      const tplText = `${s.templateIcon} ${t(s.templateLabel)}`;
      ctx.font = '600 28px "Righteous", Arial, sans-serif';
      const textW = ctx.measureText(tplText).width;
      const padX = 18, padY = 10;
      const tx = this.W - 60 - textW - padX * 2;
      const ty = this.H - 60 - 44;
      ctx.fillStyle = this._hexToRgba(s.themeAccent, 0.18);
      ctx.strokeStyle = s.themeAccent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      this._roundRect(ctx, tx, ty, textW + padX * 2, 44, 10);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.fillText(tplText, tx + padX, ty + padY);
    }

    // Footer slogan
    ctx.font = '500 22px "Righteous", Arial, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,.45)';
    const pad2 = n => String(n).padStart(2, '0');
    const dt = `${s.date.getFullYear()}-${pad2(s.date.getMonth() + 1)}-${pad2(s.date.getDate())}`;
    ctx.fillText(`${t('slogan')}    ·    ${dt}`, 60, this.H - 60);

    // Export
    canvas.toBlob((blob) => {
      if (!blob) { showToast(t('badgeError'), 3000); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const now = s.date;
      const fname = `tutocast-${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}-${pad2(now.getHours())}-${pad2(now.getMinutes())}-badge.png`;
      a.href = url; a.download = fname;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      log(`🏆 badge card exported: ${fname}`, 'success');
      showToast(`🏆 ${t('badgeExported')}`, 2500);
      Sfx.play('click');
    }, 'image/png');
  },

  _fmtDuration(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  },

  _hexToRgba(hex, a) {
    const h = hex.trim().replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  },

  _roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  },
};

/* Maximize mode (v0.7.0): hide sidebars/header/ticker and stretch the
   stage to the full viewport. Toggle with the ⛶ button. Also toggles
   browser-level fullscreen via the Fullscreen API for extra impact. */
function toggleMaximize() {
  const app = document.querySelector('.app');
  if (!app) return;
  const on = !app.classList.contains('maximized');
  app.classList.toggle('maximized', on);
  const btn = $('tcMaxBtn');
  if (btn) btn.textContent = on ? '⛶' : '⛶';
  // Also try real browser fullscreen; fall back silently if blocked
  try {
    if (on) {
      if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
    }
  } catch {}
  log(on ? '⛶ maximized' : '⛶ restored', 'info');
}

/* QuizCard — press Q mid-recording, enter a question, it appears as a big
   text overlay. Reuses TextOverlays so it's drawn on the canvas and goes
   into the recording. Auto-removes after 6 seconds. Not interactive —
   a student pauses playback to answer mentally. Cheap implementation of
   the "quiz injection" pattern without a custom video player. */
const QuizCard = {
  prompt() {
    const text = window.prompt(t('quizPromptLabel'), '');
    if (!text || !text.trim()) return;
    TextOverlays.add('❓ ' + text.trim(), {
      ttl: 6000,
      size: 70,
      color: '#fffbeb',
      bg: 'rgba(251,146,60,.85)',
      y: Engine.height / 2,
    });
    if (Recorder.state === 'recording' || Recorder.state === 'paused') {
      Chapters.items.push({ time: Recorder.elapsed() / 1000, label: 'Quiz: ' + text.trim().slice(0, 40) });
    }
    Sfx.play('click');
    log(`❓ quiz: ${text.trim().slice(0, 40)}`, 'info');
  },
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

/* ─────────── SilenceWatch — flash a ⚠ chip when the mic has been quiet too long

   The cheap-and-honest alternative to "uh/um detection". We can't run
   Whisper in the browser (40 MB wasm, violates zero-install), but we
   already have Engine.analyser wired to the VU meter. A 1.8-second run
   of below-threshold audio usually means a hesitation the teacher
   would want to self-correct. A small chip appears in the stage
   corner — NOT drawn to the canvas, so it's invisible to students
   watching the recording, only visible to the teacher as a coaching hint. */
const SilenceWatch = {
  running: false,
  lastSoundAt: 0,
  threshold: 0.018,   // RMS threshold — below this counts as "silent"
  warnAfterMs: 1800,
  _rafId: null,

  start() {
    this.running = true;
    this.lastSoundAt = Date.now();
    this._tick();
  },

  stop() {
    this.running = false;
    if (this._rafId) cancelAnimationFrame(this._rafId);
    const chip = $('tcSilenceChip');
    if (chip) chip.classList.remove('show');
  },

  _tick() {
    if (!this.running) return;
    const a = Engine.analyser;
    if (a && Recorder.state === 'recording') {
      const data = new Uint8Array(a.frequencyBinCount);
      a.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);
      if (rms > this.threshold) {
        this.lastSoundAt = Date.now();
        const chip = $('tcSilenceChip');
        if (chip) chip.classList.remove('show');
      } else if (Date.now() - this.lastSoundAt > this.warnAfterMs) {
        const chip = $('tcSilenceChip');
        if (chip && !chip.classList.contains('show')) {
          chip.classList.add('show');
        }
      }
    }
    this._rafId = requestAnimationFrame(() => this._tick());
  },
};

/* ─────────── SensorTimeline — record micro:bit samples to CSV ───────────

   Unique to TutoCast: because we read the micro:bit's accelerometer and
   buttons over Web Bluetooth, we can capture a timestamp-aligned sensor
   log alongside the video. Researchers and physics teachers can load
   the CSV in a spreadsheet and correlate robot motion with tutorial
   timestamps. Every other screen recorder on earth ignores this. */
const SensorTimeline = {
  samples: [],   // { t, x, y, z, a, b }
  recording: false,
  lastSampleAt: 0,

  start() {
    this.samples = [];
    this.recording = true;
    this.lastSampleAt = 0;
  },

  stop() {
    this.recording = false;
  },

  sample(v) {
    if (!this.recording) return;
    const t = Recorder.elapsed() / 1000;
    // Throttle to ~20 Hz — accelerometer fires much faster than that,
    // and 20 samples/sec is plenty for tutorial correlation while
    // keeping the CSV file small.
    if (t - this.lastSampleAt < 0.05) return;
    this.lastSampleAt = t;
    this.samples.push({
      t: t.toFixed(3),
      x: (v.x ?? 0).toFixed(3),
      y: (v.y ?? 0).toFixed(3),
      z: (v.z ?? 0).toFixed(3),
      a: v.a ?? 0,
      b: v.b ?? 0,
    });
  },

  toCSV() {
    if (!this.samples.length) return null;
    const header = 't_seconds,accel_x,accel_y,accel_z,button_a,button_b\n';
    const rows = this.samples.map(s => `${s.t},${s.x},${s.y},${s.z},${s.a},${s.b}`).join('\n');
    return header + rows + '\n';
  },
};

/* ─────────── 6. micro:bit sensors (Web Bluetooth) ─────────── */

const Sensors = {
  device: null, server: null,
  values: null, // { a: 0, b: 0, x: 0, y: 0, z: 0, light: 0 }
  autoOverlayEnabled: false,  // v0.5.0 — opt-in in Settings
  _lastAutoOverlayAt: 0,

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
          // v0.5.0: if the laser is ON, tilt drives the laser position
          // so the teacher can aim with the physical robot in their hand.
          // Accelerometer range ≈ [-1, 1] in g's for tilt angles.
          // Map x → laserX, y → laserY (inverted — nose-down = top of screen).
          if (Laser.on) {
            const nx = Math.max(-1, Math.min(1, this.values.x));
            const ny = Math.max(-1, Math.min(1, this.values.y));
            const targetX = Engine.width * 0.5 + nx * Engine.width * 0.45;
            const targetY = Engine.height * 0.5 + ny * Engine.height * 0.45;
            // Smooth ease so jitter doesn't jerk the dot around
            Laser.x = Laser.x + (targetX - Laser.x) * 0.3;
            Laser.y = Laser.y + (targetY - Laser.y) * 0.3;
            Laser.lastMove = Date.now();
          }
          // v0.5.0: accumulate a sensor sample into the recording timeline
          if (SensorTimeline.recording) SensorTimeline.sample(this.values);
          // v0.5.0: if opted in, drop a 🤖 overlay when the robot jerks hard.
          // Cooldown 3s so we don't spam the canvas during continuous motion.
          if (this.autoOverlayEnabled) {
            const mag = Math.sqrt(this.values.x * this.values.x + this.values.y * this.values.y + this.values.z * this.values.z);
            if (mag > 1.6 && Date.now() - this._lastAutoOverlayAt > 3000) {
              this._lastAutoOverlayAt = Date.now();
              TextOverlays.add('🤖', { size: 120, ttl: 1800, y: Engine.height / 2 });
            }
          }
        });
      } catch (e) { /* accelerometer optional */ }
      // Try buttons
      try {
        const btnSvc = await this.server.getPrimaryService('e95d9882-251d-470a-a062-fa1922dfa9a8');
        const aChar = await btnSvc.getCharacteristic('e95dda90-251d-470a-a062-fa1922dfa9a8');
        await aChar.startNotifications();
        aChar.addEventListener('characteristicvaluechanged', (e) => {
          this.values = this.values || {};
          const prev = this.values.a || 0;
          this.values.a = e.target.value.getUint8(0);
          this.updatePanel();
          // Edge-trigger: button A pressed (transition from 0 → non-zero) → toggle zoom.
          // Lets teachers hit the real physical button on the micro:bit to zoom in/out.
          if (prev === 0 && this.values.a !== 0) Zoom.toggle();
        });
        const bChar = await btnSvc.getCharacteristic('e95dda91-251d-470a-a062-fa1922dfa9a8');
        await bChar.startNotifications();
        bChar.addEventListener('characteristicvaluechanged', (e) => {
          this.values = this.values || {};
          const prevB = this.values.b || 0;
          this.values.b = e.target.value.getUint8(0);
          this.updatePanel();
          // v0.5.0: edge-trigger on B button → add a chapter marker.
          // Combined with A → zoom, the micro:bit is a full remote now.
          if (prevB === 0 && this.values.b !== 0) Chapters.addMarker();
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

/* Jingle — a short "show's starting" arpeggio played INTO the recording.
   Routes through Engine.audioDest so it's captured by MediaRecorder.
   Opt-in in Settings (default off). Plays right after MediaRecorder has
   been started, not during the 3-2-1 countdown. */
const Jingle = {
  enabled: false,
  NOTES: [
    // [frequencyHz, startSec, durSec]
    [523.25, 0.00, 0.18],  // C5
    [659.25, 0.15, 0.18],  // E5
    [783.99, 0.30, 0.18],  // G5
    [1046.5, 0.45, 0.55],  // C6 sustained
  ],

  load() {
    try { this.enabled = localStorage.getItem('tc-jingle') === '1'; } catch {}
  },
  setEnabled(v) {
    this.enabled = !!v;
    try { localStorage.setItem('tc-jingle', v ? '1' : '0'); } catch {}
  },

  play() {
    if (!this.enabled) return;
    const ac = Engine.audioCtx;
    if (!ac) return;
    const now = ac.currentTime;
    this.NOTES.forEach(([f, t0, dur]) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(f, now + t0);
      // Soft envelope so it doesn't click
      g.gain.setValueAtTime(0.0001, now + t0);
      g.gain.exponentialRampToValueAtTime(0.18, now + t0 + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, now + t0 + dur);
      // Route through audioDest (captured by MediaRecorder) AND audioCtx.destination
      // so the teacher hears it too
      o.connect(g);
      g.connect(Engine.audioDest);
      g.connect(ac.destination);
      o.start(now + t0);
      o.stop(now + t0 + dur + 0.02);
    });
  },
};

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
  // First launch: show the template picker instead of the legacy steps card
  if (!seen) Templates.showPicker();
  const close = $('tcTemplatesClose');
  if (close) close.addEventListener('click', () => {
    Templates.hidePicker();
    try { localStorage.setItem('tc-onboarded', '1'); } catch {}
  });
  // Wire each template card button
  document.querySelectorAll('[data-tpl]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.tpl;
      try { localStorage.setItem('tc-onboarded', '1'); } catch {}
      if (key) {
        Templates.apply(key);
      } else {
        // Blank: clear any active template so user starts fresh
        Templates.clear();
        Templates.hidePicker();
      }
    });
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
    // Ctrl/Cmd + D duplicates the selected text overlay (Canva-style)
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && k === 'd') {
      if (TextOverlays.selectedId != null) {
        const orig = TextOverlays.items.find(i => i.id === TextOverlays.selectedId);
        if (orig) {
          const copy = TextOverlays.add(orig.text, { ttl: 0, size: orig.size, color: orig.color, bg: orig.bg });
          copy.x = orig.x + 30;
          copy.y = orig.y + 30;
          TextOverlays.selectedId = copy.id;
          showToast(t('overlayDuplicated'), 1500);
        }
        e.preventDefault();
      }
      return;
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
    else if (k === 'z') { Zoom.toggle(); e.preventDefault(); }
    else if (k === 'q') { QuizCard.prompt(); e.preventDefault(); }
    else if (k === 'f' && !e.ctrlKey && !e.metaKey) {
      // F alone = freeze screen; handled above. But if shift is held, we
      // reinterpret as maximize toggle. (Kept F for freeze to not break
      // existing muscle memory.)
    }
    else if (k === 'escape') {
      // Exit maximize first if active
      const app = document.querySelector('.app');
      if (app && app.classList.contains('maximized')) { toggleMaximize(); return; }
      closeAllPanels();
    }
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

  // Output format preference (mp4 / webm / auto)
  const fmtEl = $('tcFormatSelect');
  if (fmtEl) {
    try { fmtEl.value = localStorage.getItem('tc-format') || 'auto'; } catch {}
    fmtEl.addEventListener('change', (e) => {
      try { localStorage.setItem('tc-format', e.target.value); } catch {}
      log(`🎞 format preference: ${e.target.value}`, 'info');
    });
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
  $('tcZoomBtn').addEventListener('click', () => Zoom.toggle());
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

  // Reset Layout — clears all .custom flags and re-runs the active scene
  const resetBtn = $('tcResetLayoutBtn');
  if (resetBtn) resetBtn.addEventListener('click', () => Drag.resetAll());

  // Silence-trim wiring (v0.5.0) — appears after recording if the scan found > 2s of silence
  const silBtn = $('tcSilenceTrimBtn');
  if (silBtn) silBtn.addEventListener('click', () => SilenceTrim.exportCleaned());

  // Badge card wiring (v0.6.0)
  const badgeBtn = $('tcBadgeBtn');
  if (badgeBtn) badgeBtn.addEventListener('click', () => BadgeCard.exportPng());

  // Brand watermark (v0.7.0): logo upload, slogan input, fun effect select
  const brandLogoInput = $('tcBrandLogoInput');
  if (brandLogoInput) {
    brandLogoInput.addEventListener('change', (e) => {
      const f = e.target.files && e.target.files[0];
      if (f) Brand.setLogoFromFile(f);
      e.target.value = '';  // allow re-selecting the same file
    });
  }
  const brandClear = $('tcBrandClearBtn');
  if (brandClear) brandClear.addEventListener('click', () => { Brand.clearLogo(); showToast(t('brandLogoCleared'), 1500); });
  const sloganInput = $('tcBrandSloganInput');
  if (sloganInput) {
    sloganInput.value = Brand.slogan || '';
    sloganInput.addEventListener('input', (e) => Brand.setSlogan(e.target.value));
  }
  const effectSel = $('tcBrandEffectSelect');
  if (effectSel) {
    effectSel.value = Brand.effect || 'none';
    effectSel.addEventListener('change', (e) => Brand.setEffect(e.target.value));
  }

  // Maximize mode (v0.7.0): press the ⛶ button or the F hotkey
  const maxBtn = $('tcMaxBtn');
  if (maxBtn) maxBtn.addEventListener('click', () => toggleMaximize());

  // Jingle toggle (v0.6.0) — opt-in in Settings
  const jingleEl = $('tcJingleToggle');
  if (jingleEl) {
    jingleEl.checked = Jingle.enabled;
    jingleEl.addEventListener('change', (e) => Jingle.setEnabled(e.target.checked));
  }

  // Sensor-triggered overlay toggle (v0.5.0) — opt-in in Settings
  const sensorOverlayEl = $('tcSensorOverlayToggle');
  if (sensorOverlayEl) {
    try { sensorOverlayEl.checked = localStorage.getItem('tc-sensor-overlay') === '1'; } catch {}
    Sensors.autoOverlayEnabled = sensorOverlayEl.checked;
    sensorOverlayEl.addEventListener('change', (e) => {
      Sensors.autoOverlayEnabled = e.target.checked;
      try { localStorage.setItem('tc-sensor-overlay', e.target.checked ? '1' : '0'); } catch {}
    });
  }

  // Trim wiring
  $('tcTrimBtn').addEventListener('click', () => Trim.open());
  $('tcTrimClose').addEventListener('click', () => Trim.close());
  $('tcTrimCancelBtn').addEventListener('click', () => Trim.close());
  $('tcTrimExportBtn').addEventListener('click', () => Trim.exportTrimmed());
  $('tcTrimIn').addEventListener('input', (e) => Trim.onInChange(e.target.value));
  $('tcTrimOut').addEventListener('input', (e) => Trim.onOutChange(e.target.value));
  $('tcTrimPreviewInBtn').addEventListener('click', () => Trim.previewIn());
  $('tcTrimPreviewOutBtn').addEventListener('click', () => Trim.previewOut());

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
  Jingle.load();
  Brand.load();
  Badges.load();

  applyI18n();  // after Sfx/Badges so Teleprompter.hasUserText() is safe

  Engine.init();
  Laser.setup();
  Whiteboard.setup();
  Zoom.setup();
  Drag.setup();

  renderScenes();
  renderTextPresets();
  renderBadges();
  renderTicker();
  Templates.renderStepStrip();

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
