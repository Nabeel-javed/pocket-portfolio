// Original, locally synthesized sounds. Audio is created on interaction only.
const keypad = ["123", "456", "789", "*0#"];
const rows = [697, 770, 852, 941];
const columns = [1209, 1336, 1477];

export function createPhoneAudio({
  createContext = () =>
    new (window.AudioContext || window.webkitAudioContext)(),
} = {}) {
  let context;
  let enabled = false;
  let volume = 0.35;
  let style = "classic";
  const active = new Set();

  function stop() {
    for (const { source, nodes } of active) {
      try {
        source.stop();
      } catch {}
      for (const node of nodes) node.disconnect();
    }
    active.clear();
  }

  function voice(source, time, duration, level, filter) {
    const envelope = context.createGain();
    const nodes = [source, envelope];
    if (filter) {
      source.connect(filter);
      filter.connect(envelope);
      nodes.push(filter);
    } else source.connect(envelope);
    envelope.connect(context.destination);
    // Rounded attacks prevent hard clicks; all notes decay to silence.
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(level * volume, time + 0.004);
    envelope.gain.exponentialRampToValueAtTime(0.00001, time + duration);
    const entry = { source, nodes };
    active.add(entry);
    source.onended = () => {
      nodes.forEach((node) => node.disconnect());
      active.delete(entry);
    };
    source.start(time);
    source.stop(time + duration + 0.005);
  }

  function note(frequency, time, duration, level = 0.12, end = frequency) {
    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, time);
    oscillator.frequency.exponentialRampToValueAtTime(end, time + duration);
    voice(oscillator, time, duration, level * (style === "soft" ? 0.65 : 1));
  }

  function click(time, duration = 0.023, level = 0.18, cutoff = 2400) {
    const buffer = context.createBuffer(
      1,
      Math.ceil(context.sampleRate * duration),
      context.sampleRate,
    );
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const source = context.createBufferSource();
    source.buffer = buffer;
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = style === "soft" ? cutoff * 0.55 : cutoff;
    voice(source, time, duration, level * (style === "soft" ? 0.6 : 1), filter);
  }

  function play(kind = "navigate", key) {
    if (!enabled || volume === 0) return;
    // A new interaction replaces the previous sound, including a ringtone.
    stop();
    try {
      context ||= createContext();
      if (context.state === "suspended") {
        // Schedule only for this gesture; never replay a stale sound on resume.
        context.resume().catch(() => stop());
      }
      const now = context.currentTime;
      if (kind === "key") {
        const row = keypad.findIndex((keys) => keys.includes(key));
        if (row < 0) return;
        click(now);
        note(rows[row], now + 0.006, 0.105, 0.1);
        note(columns[keypad[row].indexOf(key)], now + 0.006, 0.105, 0.075);
      } else if (kind === "close") {
        click(now, 0.055, 0.4, 1800);
        note(320, now, 0.075, 0.22, 125);
        click(now + 0.035, 0.022, 0.2, 3200);
      } else if (kind === "open") {
        click(now, 0.022, 0.18, 3000);
        click(now + 0.065, 0.04, 0.25, 2000);
        note(420, now + 0.06, 0.06, 0.11, 220);
      } else if (kind === "ring") {
        // A short, original invitation; deliberately finite, never looping.
        [659.25, 880, 987.77, 880, 659.25, 880].forEach((pitch, i) => {
          const time = now + i * 0.16 + (i > 2 ? 0.13 : 0);
          note(pitch, time, 0.14, 0.12);
          note(pitch * 2, time, 0.09, 0.025);
        });
      } else if (kind === "unlock") {
        [523.25, 659.25, 783.99, 1046.5].forEach((pitch, i) => {
          note(pitch, now + i * 0.09, 0.22, 0.1);
          note(pitch * 1.5, now + i * 0.09, 0.14, 0.025);
        });
      } else if (kind === "startup") {
        [523.25, 659.25, 880].forEach((pitch, i) => {
          note(pitch, now + i * 0.1, 0.2, 0.1);
          note(pitch * 2, now + i * 0.1, 0.12, 0.018);
        });
      } else if (kind === "confirm") {
        click(now, 0.018, 0.1);
        note(660, now, 0.065, 0.08);
        note(880, now + 0.045, 0.08, 0.07);
      } else if (kind === "back") {
        click(now, 0.028, 0.15, 1500);
        note(380, now, 0.06, 0.07, 280);
      } else click(now);
    } catch {
      stop();
      // Navigation and contact actions still work without Web Audio.
    }
  }

  return {
    play,
    stop,
    setEnabled(value) {
      enabled = Boolean(value);
      if (!enabled) stop();
    },
    setVolume(value) {
      if (!Number.isFinite(value)) return;
      volume = Math.max(0, Math.min(1, value));
      stop();
    },
    setStyle(value) {
      if (value === "classic" || value === "soft") {
        style = value;
        stop();
      }
    },
  };
}
