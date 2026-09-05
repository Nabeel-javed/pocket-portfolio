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

The generated `dist/` directory is suitable for static hosting at a domain root. Local servers bind to `127.0.0.1`. Production: https://pocket-portfolio-sigma.vercel.app. Vercel is connected to `Nabeel-javed/pocket-portfolio`; pushes to `main` deploy automatically.

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
- Settings → Wallpaper offers Original, Munich, Alpine, and Midnight scenes. Tap to apply, or preview with the D-pad and press OK. The choice saves locally and is independent of the phone finish.
- A 1.8-second signature startup appears on the first visit. Skip it with the on-screen button or use the phone controls immediately. Settings → Replay startup brings it back with a short melody. Reduced-motion preferences bypass the animation.
- Snake shows SCORE and BEST, saves a new personal best during play, and retains it between rounds and visits on the same browser. Clearing site data clears the record and wallpaper choice.
- A homepage clue leads to a hidden Aurora finish. Discovery works with the physical keypad or keyboard outside Snake, unlocks a short celebration, and saves access locally. Aurora then appears in the finish picker and star-key cycle.
- Projects opens a photo-style gallery of five selected projects and six open-source community spotlights. Select a tile, browse with left/right, and press OK or tap the image for a larger view. The larger gallery supports arrow keys, previous/next buttons, and Escape; closing it restores phone focus and selection.

## Open-source projects

The gallery includes six existing open-source projects: Graphiti, LiveKit Agents, Open Notebook, DeerFlow, Hatchet, and Sim. Each is presented as a community spotlight with its existing capabilities, creator attribution, and original GitHub repository. These entries describe the upstream projects and do not claim personal authorship or completed custom extensions.

Sim's enterprise directory has separate licensing restrictions from its Apache-2.0 core.

## Project images

The current gallery uses original **concept illustrations**, visibly labelled as such. These depict ideas from the existing project descriptions; they are not product screenshots or evidence of a particular interface.

Project text and image metadata live in `src/projects.js`. To add a supplied screenshot, put the public-safe image in `public/projects/`, then update that project's `image`, `imageAlt`, and `imageLabel`. The phone tiles, project detail screen, and larger viewer all use the same record. Actual screenshots have not been supplied yet.

## Files

- `index.html`: phone hardware, surrounding layout, contact links, and Quick view content.
- `src/telemetry.js`: production-only Vercel Web Analytics and Speed Insights initialization.
- `src/audio.js`: original Web Audio synthesis, volume, sound styles, and playback cleanup. No downloaded audio assets.
- `src/personalization.js`: wallpaper choices and resilient local preference / high-score storage.
- `src/easter-egg.js`: bounded secret-code recognition with interruption and inactivity resets.
- `src/projects.js`: project descriptions and gallery image metadata.
- `public/projects/`: original project concept illustrations, ready to be supplemented or replaced with supplied screenshots.
- `public/wallpapers/`: original SVG pixel scenes, with no external image requests.
- `src/style.css`: the standard and unlocked color finishes, responsive layout, hardware illustration, folding, gallery, and app styles.
- `src/main.js`: portfolio content, navigation, app screens, keyboard controls, audio feedback, themes, clock, and dialog behavior.
- `src/snake.js`: standalone game rules and canvas renderer.
- `tests/phone.test.js`: DOM-based phone interaction regression tests.
- `tests/snake.test.js`: game rule regression tests.
- `public/Nabeel-Javed-CV.pdf`: public CV with the phone number removed by actual PDF redaction.

Fonts are self-hosted; their SIL Open Font Licenses are in `public/licenses/`. Vercel Web Analytics collects page views and Speed Insights collects performance metrics in production builds. Local development does not load either integration. There is no remote font service. Contact buttons use mailto links rather than a server-side form.

The original supplied CV is preserved outside this project. The previous exploded-object implementation is backed up at `../nabeel-portfolio-history/exploded-object-2026-09-05.tar.gz`.

## Custom domain

To connect `nabeeljaved.xyz`, open the Vercel project’s Settings → Domains, add the domain, and apply the DNS records Vercel displays at your registrar. Domain DNS has not been configured as part of the initial deployment.
