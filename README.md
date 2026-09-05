# Nabeel Javed — Pocket Portfolio

A personal portfolio inside an interactive retro flip phone. The phone is built with CSS, SVG, and JavaScript; it does not require WebGL, a model download, a backend, or API credentials.

## Run

Requires Node.js 22.12+ or a compatible newer release.

```sh
npm ci
npm run dev
```

## Build, preview, and test

```sh
npm run build
npm run preview
npm test
```

The generated `dist/` directory is suitable for static hosting at a domain root. Local servers bind to `127.0.0.1`. No public deployment has been performed.

## Phone controls

- Tap an app, or press 1–9 to open About, Projects, Experience, Skills, Contact, Links, CV, Snake, or Settings.
- Use the D-pad or arrow keys to select apps and projects. Press OK or Enter to open them.
- Up/down scroll the content of an open app.
- Menu and 0 return home; Back and Escape go back.
- The green handset opens an incoming-call invitation with Email, LinkedIn, and copy-email actions. It plays a brief original ringtone when sound is on. The red handset returns home.
- Star cycles Silver, Graphite, and Champagne finishes. Hash toggles sound, which defaults to on. Audio begins with a phone interaction; nothing autoplays on page load.
- Settings offers Classic / Soft sound styles, a volume slider, and a ringtone preview. Keypad keys have paired telephone tones with a physical click; the lid has separate opening and closing sounds. Sounds stop on mute, tab/window exit, or the next interaction. Audio preferences last for the current page session.
- Close/open the phone with the button below it. Closed controls become inert.
- Snake uses the D-pad, arrow keys, or 2/4/6/8. OK, Space, or 5 starts/pauses it. Switching apps, closing the phone, opening Quick view, hiding the tab, or leaving the window pauses/stops the game.
- Quick view provides a larger reading view of the portfolio, independent of the small phone screen.

## Files

- `index.html`: phone hardware, surrounding layout, contact links, and Quick view content.
- `src/audio.js`: original Web Audio synthesis, volume, sound styles, and playback cleanup. No downloaded audio assets.
- `src/style.css`: the three color finishes, responsive layout, hardware illustration, folding, and app styles.
- `src/main.js`: portfolio content, navigation, app screens, keyboard controls, audio feedback, themes, clock, and dialog behavior.
- `src/snake.js`: standalone game rules and canvas renderer.
- `tests/phone.test.js`: DOM-based phone interaction regression tests.
- `tests/snake.test.js`: game rule regression tests.
- `public/Nabeel-Javed-CV.pdf`: public CV with the phone number removed by actual PDF redaction.

Fonts are self-hosted; their SIL Open Font Licenses are in `public/licenses/`. There is no analytics or remote font service. Contact buttons use mailto links rather than a server-side form.

The original supplied CV is preserved outside this project. The previous exploded-object implementation is backed up at `../nabeel-portfolio-history/exploded-object-2026-09-05.tar.gz`.
