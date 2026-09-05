# Flip-phone validation

2026-09-05. This record supersedes the exploded-object design's QA record.

## Passed

- Production build (`npm run build`).
- 16 regression checks (`npm test`): nine phone interaction checks and seven Snake rule checks.
- All nine apps can be opened and returned from.
- Keyboard selection works after a physical keypad button had focus.
- All five project details open and lead to Contact; Back restores the project list.
- Folding marks concealed phone controls inert; reopening restores them.
- Theme persistence and Settings selection state.
- CV, GitHub, and LinkedIn destinations match the approved values.
- Quick view state, page scroll restoration, and focus restoration in the DOM harness.
- Snake: stationary paused/ready states, turn reversal prevention, eating/growth, food placement, wall/body collision, moving into a vacating tail, and a full-board win.
- Production asset availability and public PDF privacy checks.
- Native Brave accessibility output exposed the home screen's app and hardware controls.

## Limits

The DOM harness mocks browser drawing and modal methods; it does not establish visual layout, audio output, native focus trapping, or real-device behavior. Browser UI automation was interrupted during attempts to inspect screenshots. The final desktop/mobile visual review remains pending; no cross-browser certification is claimed.

The public CV was previously visually reviewed after redaction. This revision preserves that file. Its original source is stored outside the project.

No public deployment was performed.
