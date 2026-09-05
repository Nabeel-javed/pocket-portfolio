# Flip-phone validation

2026-09-05. This record supersedes the exploded-object design's QA record.

## Passed

- Production build (`npm run build`).
- 25 regression checks (`npm test`): twelve phone interaction checks, six audio lifecycle checks, and seven Snake rule checks.
- All nine apps can be opened and returned from.
- Keyboard selection works after a physical keypad button had focus.
- All five project details open and lead to Contact; Back restores the project list.
- Folding marks concealed phone controls inert; reopening restores them.
- Theme persistence and Settings selection state.
- CV, GitHub, and LinkedIn destinations match the approved values.
- Incoming-call contact screen, approved Email/LinkedIn actions, green/red handset navigation, and distinct keypad/lid sound dispatch.
- Sound styles and volume stay consistent when reopening Settings; native sound inputs retain keyboard control.
- Sound defaults to on in both the engine and controls, without playback on page load. Settings can mute it and the hash key can re-enable it.
- Audio opt-in, twelve distinct paired keypad tones, finite ringtone scheduling, cancellation on mute/new interaction/backgrounding, silent zero volume, quieter Soft style, node cleanup, and unavailable/blocked Web Audio handling.
- Quick view state, page scroll restoration, and focus restoration in the DOM harness.
- Snake: stationary paused/ready states, turn reversal prevention, eating/growth, food placement, wall/body collision, moving into a vacating tail, and a full-board win.
- Production asset availability and public PDF privacy checks.
- Native Brave accessibility output exposed the home screen's app and hardware controls.

## Limits

The DOM harness mocks browser drawing and modal methods, and the audio tests use a mock Web Audio context. These checks do not establish visual layout, audible sound quality, native focus trapping, or real-device behavior. During this revision, the in-app browser connector failed to load a dependency; native Chrome showed a blank viewport on reload despite the preview serving the HTML and JavaScript successfully. Desktop/mobile visual review and listening on real speakers remain pending; no cross-browser certification is claimed.

The public CV was previously visually reviewed after redaction. This revision preserves that file. Its original source is stored outside the project.

No public deployment was performed.
