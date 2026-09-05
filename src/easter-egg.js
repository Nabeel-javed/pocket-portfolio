// One telephone-keypad digit per letter of NABEEL.
const SECRET = "622335";

export function createSecretCode(now = () => Date.now()) {
  let digits = "";
  let lastKeyAt = 0;
  function reset() {
    digits = "";
    lastKeyAt = 0;
  }
  return {
    reset,
    feed(key) {
      if (!/^[1-9]$/.test(key)) {
        reset();
        return false;
      }
      const time = now();
      if (time - lastKeyAt > 8000) digits = "";
      lastKeyAt = time;
      digits = (digits + key).slice(-SECRET.length);
      if (digits !== SECRET) return false;
      reset();
      return true;
    },
  };
}
