export const wallpapers = [
  { id: "original", name: "Original", caption: "A familiar little horizon." },
  {
    id: "munich",
    name: "Munich",
    caption: "A pocket-sized postcard from home.",
  },
  { id: "alpine", name: "Alpine", caption: "A little room to breathe." },
  { id: "midnight", name: "Midnight", caption: "For the after-hours ideas." },
];

// Storage may be disabled or full; the phone still works for this visit.
export function createPersonalization(storage = () => localStorage) {
  function readPreference(key, fallback = "") {
    try {
      return storage().getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  }
  function savePreference(key, value) {
    try {
      storage().setItem(key, String(value));
    } catch {}
  }
  function readHighScore() {
    const score = Number(readPreference("nj-snake-best", "0"));
    return Number.isInteger(score) && score >= 0 && score <= 213 ? score : 0;
  }
  return { readPreference, savePreference, readHighScore };
}
