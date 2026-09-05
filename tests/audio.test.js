import { test } from "node:test";
import assert from "node:assert/strict";
import { createPhoneAudio } from "../src/audio.js";

function harness({ state = "running", rejectResume = false } = {}) {
  const sources = [],
    gains = [];
  let created = 0;
  function param() {
    return {
      events: [],
      setValueAtTime(value, time) {
        this.events.push({ value, time });
      },
      linearRampToValueAtTime(value, time) {
        this.events.push({ value, time });
      },
      exponentialRampToValueAtTime(value, time) {
        this.events.push({ value, time });
      },
    };
  }
  function node() {
    return {
      connected: false,
      connect() {
        this.connected = true;
      },
      disconnect() {
        this.connected = false;
      },
    };
  }
  function source(oscillator = false) {
    const result = {
      ...node(),
      stops: [],
      start(time) {
        this.started = time;
      },
      stop(time) {
        this.stops.push(time);
      },
    };
    if (oscillator) result.frequency = param();
    sources.push(result);
    return result;
  }
  const context = {
    state,
    currentTime: 10,
    sampleRate: 48000,
    destination: {},
    resume: () =>
      rejectResume
        ? Promise.reject(new Error("Audio blocked"))
        : Promise.resolve(),
    createOscillator: () => source(true),
    createBufferSource: () => source(),
    createBuffer: (_channels, length) => ({
      getChannelData: () => new Float32Array(length),
    }),
    createBiquadFilter: () => ({ ...node(), frequency: {} }),
    createGain: () => {
      const gain = { ...node(), gain: param() };
      gains.push(gain);
      return gain;
    },
  };
  const audio = createPhoneAudio({
    createContext: () => {
      created++;
      return context;
    },
  });
  return { audio, sources, gains, created: () => created };
}

test("audio is lazy and silent until enabled; mute cancels a pending ringtone", () => {
  const h = harness();
  h.audio.play("ring");
  assert.equal(h.created(), 0);
  h.audio.setEnabled(true);
  h.audio.play("ring");
  assert.ok(h.sources.length > 0);
  h.audio.setEnabled(false);
  assert.ok(
    h.sources.every((s) => s.stops.at(-1) === undefined && !s.connected),
  );
  const count = h.sources.length;
  h.audio.play("key", "1");
  assert.equal(h.sources.length, count);
});

test("all twelve keypad keys produce unique dual tones and a mechanical click", () => {
  const signatures = new Set();
  for (const key of "123456789*0#") {
    const h = harness();
    h.audio.setEnabled(true);
    h.audio.play("key", key);
    const tones = h.sources.filter((s) => s.frequency);
    assert.equal(tones.length, 2);
    assert.equal(h.sources.filter((s) => s.buffer).length, 1);
    signatures.add(tones.map((s) => s.frequency.events[0].value).join("/"));
    assert.ok(h.sources.every((s) => s.stops[0] - s.started < 0.12));
  }
  assert.equal(signatures.size, 12);
});

test("ringtone ends within 1.2 seconds; subsequent interaction cancels scheduled notes", () => {
  const h = harness();
  h.audio.setEnabled(true);
  h.audio.play("ring");
  const ring = [...h.sources];
  assert.ok(
    ring.every((s) => Number.isFinite(s.stops[0]) && s.stops[0] < 11.2),
  );
  h.audio.play("close");
  assert.ok(ring.every((s) => s.stops.at(-1) === undefined && !s.connected));
  assert.equal(h.created(), 1);
  h.audio.stop();
  assert.ok(h.sources.every((s) => !s.connected));
});

test("volume zero stays silent and soft profile lowers the peaks", () => {
  const h = harness();
  h.audio.setEnabled(true);
  h.audio.setVolume(0);
  h.audio.play("key", "5");
  assert.equal(h.created(), 0);
  h.audio.setVolume(0.5);
  h.audio.play("key", "5");
  const classic = h.gains.map((g) => g.gain.events[1].value);
  h.audio.setStyle("soft");
  h.audio.play("key", "5");
  h.gains
    .slice(3)
    .forEach((g, i) => assert.ok(g.gain.events[1].value < classic[i]));
});

test("ended sounds disconnect their nodes", () => {
  const h = harness();
  h.audio.setEnabled(true);
  h.audio.play("key", "1");
  h.sources.forEach((s) => s.onended());
  assert.ok(h.sources.every((s) => !s.connected));
  assert.ok(h.gains.every((g) => !g.connected));
});

test("missing or blocked Web Audio fails silently without queued playback", async () => {
  const unavailable = createPhoneAudio({
    createContext: () => {
      throw new Error("Unavailable");
    },
  });
  unavailable.setEnabled(true);
  assert.doesNotThrow(() => unavailable.play("open"));
  const h = harness({ state: "suspended", rejectResume: true });
  h.audio.setEnabled(true);
  h.audio.play("ring");
  await Promise.resolve();
  assert.ok(h.sources.every((s) => !s.connected));
});
