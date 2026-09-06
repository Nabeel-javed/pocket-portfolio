# Flip-phone validation

Updated 2026-09-06. This record supersedes the exploded-object design's QA record.

## Passed

- Production build (`npm run build`).
- 48 regression checks (`npm test`): thirty-three phone interaction, gallery, and personalization checks, two secret-code checks, six audio lifecycle checks, and seven Snake rule checks.
- All nine apps can be opened and returned from.
- Keyboard selection works after a physical keypad button had focus.
- All eleven project details open and lead to Contact; Back restores the project list.
- Folding marks concealed phone controls inert; reopening restores them.
- Theme persistence and Settings selection state.
- CV, GitHub, and LinkedIn destinations match the approved values.
- Incoming-call contact screen, approved Email/LinkedIn actions, green/red handset navigation, and distinct keypad/lid sound dispatch.
- Sound styles and volume stay consistent when reopening Settings; native sound inputs retain keyboard control.
- Sound defaults to on in both the engine and controls, without playback on page load. Settings can mute it and the hash key can re-enable it.
- Four wallpaper choices persist across page instances, remain independent of the phone finish, and support D-pad preview / OK selection.
- Startup first-visit detection, skip/replay, automatic completion, reduced-motion bypass, and cancellation when navigating, folding, or opening Quick view.
- Snake best-score persistence tested through real game ticks, leaving mid-round, reopening, and a new page instance. Lower scores do not overwrite records; invalid saved values and blocked storage remain usable.
- Easter egg: keyboard and physical keypad discovery, clue without a visible code, hidden/available theme controls, saved unlock and theme restoration, four-finish star cycling, wrong/interrupted/expired codes, Snake exclusion, and operation with blocked storage.
- Gallery: eleven albums, image metadata and visible concept-illustration labels, directional grid selection, project wraparound, larger-view content synchronization, modal keyboard isolation, Escape handling, return selection, focus restoration, and retained contact links.
- Audio opt-in, twelve distinct paired keypad tones, finite ringtone scheduling, cancellation on mute/new interaction/backgrounding, silent zero volume, quieter Soft style, node cleanup, and unavailable/blocked Web Audio handling.
- Quick view state, page scroll restoration, and focus restoration in the DOM harness.
- Snake: stationary paused/ready states, turn reversal prevention, eating/growth, food placement, wall/body collision, moving into a vacating tail, and a full-board win.
- Production asset availability and public PDF privacy checks.
- Native Brave accessibility output exposed the home screen's app and hardware controls.

## Limits

The DOM harness mocks browser drawing and modal methods, and the audio tests use a mock Web Audio context. The 3D revision was also visually reviewed and exercised in headless Chrome at desktop and mobile viewport sizes, including touch emulation. This does not establish Safari/Firefox compatibility, physical-device performance, or audible sound quality on real speakers. The in-app browser connector remains unavailable, so standalone Playwright with installed Chrome was used for this review.

The public CV was previously visually reviewed after redaction. This revision preserves that file. Its original source is stored outside the project.

Production deployed to Vercel on 2026-09-05: https://pocket-portfolio-sigma.vercel.app.

## Gallery content

The five project visuals are original concept illustrations based on the existing descriptions. No actual project screenshots were available in the repository or supplied for this revision. Their SVG structure and preview delivery were checked; browser visual review remains pending under the limits above.

## Open-source project additions

Six existing open-source projects are featured as community spotlights alongside the five existing portfolio projects. DOM checks cover open-source labels, creator attribution and links, license notes in the larger viewer, and wraparound across all eleven entries. All eleven SVG files parse successfully and match their production build copies. The production build and all 45 tests pass. Browser visual review remains pending. These additions are included in the Vercel production deployment.

## Analytics and performance monitoring

Vercel Web Analytics and Speed Insights are initialized by `src/telemetry.js` in production builds. The 45 existing tests and production build pass. An isolated DOM smoke check of the compiled telemetry entry confirms that both deferred Vercel scripts are injected. This verifies integration wiring; dashboard ingestion requires actual browser traffic and is not established by the DOM check.

## 3D phone — 2026-09-06

- Solid shell depth built from rounded CSS cross-sections, separate rear panels, perspective, and a folding hinge. The screen remains live HTML with existing controls.
- Desktop screenshots reviewed in default, rear, side, and folded poses. Mobile screenshot reviewed at 390px width with no horizontal overflow.
- Real browser interactions passed: opening Projects, gallery details and modal, Escape, rotation presets, keyboard orbit/reset without app navigation, mouse drag and release, folding, Snake, and returning home.
- Mobile emulation passed: reduced-motion default, Contact, view presets, touch drag and release, and no horizontal overflow.
- All 48 regression tests and the production build pass. No JavaScript page errors during the desktop browser interaction check.

## Paper Archive — 2026-09-06

The selected local concept is now the production layout, with static editorial content, a numbered index, a cream default shell, and a gentle 12-degree starting view. The preview switcher and the other three concepts are excluded from this checkout. Phone finishes remain independently selectable on the paper background.

All 48 regression tests and the production build pass. Headless Chrome checks passed for all four index links, reopening a folded phone through the index, direct screen clicks, finishes, project modal, Quick view, and 820/390/320px layouts without horizontal overflow. Desktop and mobile screenshots were visually reviewed. No JavaScript page errors were captured during those checks.
