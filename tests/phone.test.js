import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { createSnake } from "../src/snake.js";
import { createPhoneAudio } from "../src/audio.js";
import { createPersonalization, wallpapers } from "../src/personalization.js";
import { createSecretCode } from "../src/easter-egg.js";

const pages = [];
afterEach(() => {
  for (const page of pages) {
    page.window.document.querySelector("#physical-menu").click();
    page.window.close();
  }
  pages.length = 0;
});
function setup({
  audio,
  reducedMotion = true,
  stored = {},
  blockedStorage = false,
} = {}) {
  const page = new JSDOM(
    readFileSync(new URL("../index.html", import.meta.url), "utf8"),
    {
      url: "http://localhost:4173",
      runScripts: "outside-only",
      pretendToBeVisual: true,
    },
  );
  const { window } = page;
  pages.push(page);
  window.matchMedia = () => ({ matches: reducedMotion });
  for (const [key, value] of Object.entries(stored))
    window.localStorage.setItem(key, value);
  if (blockedStorage)
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Storage blocked");
      },
    });
  window.createPersonalization = () =>
    createPersonalization(() => window.localStorage);
  window.wallpapers = wallpapers;
  window.createSecretCode = createSecretCode;
  window.HTMLElement.prototype.scrollBy = function ({ top }) {
    this.scrollTop += top;
  };
  window.HTMLElement.prototype.scrollIntoView = function () {};
  window.HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  window.HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new window.Event("close"));
  };
  window.HTMLCanvasElement.prototype.getContext = () =>
    new Proxy(
      {},
      {
        get: (target, key) => target[key] ?? (() => {}),
        set: (target, key, value) => ((target[key] = value), true),
      },
    );
  window.createSnake = createSnake;
  window.createPhoneAudio = () =>
    audio ??
    createPhoneAudio({
      createContext: () => new window.AudioContext(),
    });
  const script = readFileSync(
    new URL("../src/main.js", import.meta.url),
    "utf8",
  ).replace(/^import .*;\s*$/gm, "");
  window.eval(script);
  return {
    window,
    doc: window.document,
    click: (selector) => window.document.querySelector(selector).click(),
    key: (key) =>
      window.document.activeElement.dispatchEvent(
        new window.KeyboardEvent("keydown", {
          key,
          bubbles: true,
          cancelable: true,
        }),
      ),
  };
}
test("all nine apps are reachable and return home through the physical menu", () => {
  const { doc, click } = setup();
  const names = [
    "About",
    "Projects",
    "Experience",
    "Skills",
    "Contact",
    "Links",
    "My CV",
    "Snake",
    "Settings",
  ];
  for (const name of names) {
    click(`[aria-label="Open ${name}"]`);
    assert.ok(!doc.querySelector(".app-grid"), `${name} opened`);
    assert.ok(
      doc.querySelector(".app-header,.snake-page"),
      `${name} has content`,
    );
    click("#physical-menu");
    assert.equal(doc.querySelectorAll(".app-icon").length, 9);
  }
});
test("arrow keys followed by Enter open the selected app after a physical key had focus", () => {
  const { doc, click, key } = setup();
  click('[data-key="0"]');
  doc.querySelector('[data-key="0"]').focus();
  key("ArrowRight");
  key("Enter");
  assert.equal(
    doc.querySelector(".app-header>span").textContent,
    "Selected projects",
  );
});
test("project details return to the project list, then to the home screen", () => {
  const { doc, click } = setup();
  click('[data-key="2"]');
  click('[data-project="1"]');
  assert.match(
    doc.querySelector(".project-mini").textContent,
    /Knowledge, within reach/,
  );
  click("#physical-back");
  assert.equal(doc.querySelectorAll("[data-project]").length, 5);
  click("#physical-back");
  assert.equal(doc.querySelectorAll(".app-icon").length, 9);
});
test("all five project summaries have content and an actionable contact route", () => {
  const { doc, click } = setup();
  for (let i = 0; i < 5; i++) {
    click('[data-key="2"]');
    click(`[data-project="${i}"]`);
    assert.equal(doc.querySelectorAll(".project-mini li").length, 3);
    click('.project-mini [data-app="contact"]');
    assert.ok(doc.querySelector('a[href="mailto:nabeeljaved944@gmail.com"]'));
  }
});
test("closing the lid removes the concealed screen and keypad from interaction", () => {
  const { doc, click } = setup();
  click("#fold-phone");
  assert.ok(doc.querySelector("#phone").classList.contains("is-closed"));
  assert.equal(doc.querySelector(".lid-front").inert, true);
  assert.equal(doc.querySelector(".phone-base").inert, true);
  click("#fold-phone");
  assert.equal(doc.querySelector(".lid-front").inert, false);
  assert.equal(doc.querySelector(".phone-base").inert, false);
  assert.equal(
    doc.querySelector("#fold-phone").getAttribute("aria-expanded"),
    "true",
  );
});
test("all finishes persist, and Settings reflects the selected finish", () => {
  const { window, doc, click } = setup();
  for (const theme of ["graphite", "amber", "porcelain"]) {
    click(`[data-theme-option="${theme}"]`);
    assert.equal(doc.documentElement.dataset.theme, theme);
    assert.equal(window.localStorage.getItem("nj-phone-theme"), theme);
  }
  click('[data-key="9"]');
  click('.settings-themes [data-theme-option="graphite"]');
  assert.equal(doc.documentElement.dataset.theme, "graphite");
  assert.equal(
    doc.querySelector('.settings-themes [aria-pressed="true"]').dataset
      .themeOption,
    "graphite",
  );
});
test("CV and social apps expose the approved destinations", () => {
  const { doc, click } = setup();
  click('[data-key="7"]');
  const cv = doc.querySelector("#screen-content a[download]");
  assert.equal(cv.getAttribute("href"), "/Nabeel-Javed-CV.pdf");
  click('[data-key="6"]');
  const links = [...doc.querySelectorAll("#screen-content a")].map(
    (a) => a.href,
  );
  assert.deepEqual(links, [
    "https://github.com/Nabeel-javed",
    "https://www.linkedin.com/in/nabeel-javed/",
  ]);
  click('[data-key="5"]');
  assert.equal(doc.querySelector('a[href^="tel:"]'), null);
});
test("quick view opens and restores scroll and focus when dismissed", () => {
  const { doc, click } = setup();
  const trigger = doc.querySelector(".quick-view-trigger");
  trigger.focus();
  trigger.click();
  assert.equal(doc.querySelector("#quick-dialog").open, true);
  assert.equal(doc.body.style.overflow, "hidden");
  click("#close-quick");
  assert.equal(doc.querySelector("#quick-dialog").open, false);
  assert.equal(doc.body.style.overflow, "");
  assert.equal(doc.activeElement, trigger);
});
test("keypad star cycles the finish and zero returns home", () => {
  const { doc, click } = setup();
  click('[data-key="1"]');
  click('[data-key="*"]');
  assert.equal(doc.documentElement.dataset.theme, "graphite");
  click('[data-key="0"]');
  assert.equal(doc.querySelectorAll(".app-icon").length, 9);
});

test("green handset opens the call invitation with approved contact actions; red returns home", () => {
  const events = [];
  const audio = {
    play: (...args) => events.push(args),
    stop() {},
    setEnabled() {},
  };
  const { doc, click } = setup({ audio });
  click("#call-key");
  assert.equal(
    doc.querySelector(".app-header>span").textContent,
    "Incoming call",
  );
  assert.equal(
    doc.querySelector(".incoming-call h3").textContent,
    "Let’s work together.",
  );
  assert.equal(
    doc.querySelector(".call-email").getAttribute("href"),
    "mailto:nabeeljaved944@gmail.com",
  );
  assert.equal(
    doc.querySelector(".call-linkedin").href,
    "https://www.linkedin.com/in/nabeel-javed/",
  );
  assert.equal(doc.querySelector("#screen-center").textContent, "Email");
  assert.deepEqual(events.at(-1), ["ring", undefined]);
  click("#end-key");
  assert.equal(doc.querySelectorAll(".app-icon").length, 9);
  assert.deepEqual(events.at(-1), ["back", undefined]);
});

test("sound settings update the engine and native controls keep keyboard input", () => {
  const events = [];
  const audio = {
    play: (...args) => events.push(["play", ...args]),
    stop() {},
    setEnabled: (value) => events.push(["enabled", value]),
    setVolume: (value) => events.push(["volume", value]),
    setStyle: (value) => events.push(["style", value]),
  };
  const { window, doc, click, key } = setup({ audio });
  assert.deepEqual(
    events,
    [["enabled", true]],
    "enabled without playback on load",
  );
  assert.equal(doc.querySelector("#sound-indicator").textContent, "♪");
  assert.equal(
    doc.querySelector("#sound-toggle").getAttribute("aria-pressed"),
    "true",
  );
  click('[data-key="9"]');
  assert.equal(
    doc.querySelector("[data-toggle-sound]").getAttribute("aria-pressed"),
    "true",
  );
  click("[data-toggle-sound]");
  assert.deepEqual(events.at(-1), ["enabled", false]);
  assert.equal(
    doc.querySelector("#sound-toggle").getAttribute("aria-pressed"),
    "false",
  );
  click('[data-key="#"]');
  assert.equal(
    doc.querySelector("#sound-toggle").getAttribute("aria-pressed"),
    "true",
  );
  assert.ok(events.some(([kind, value]) => kind === "enabled" && value));
  const style = doc.querySelector("#sound-style");
  style.value = "soft";
  style.dispatchEvent(new window.Event("change", { bubbles: true }));
  assert.ok(
    events.some(([kind, value]) => kind === "style" && value === "soft"),
  );
  const slider = doc.querySelector("#sound-volume");
  slider.value = "20";
  slider.dispatchEvent(new window.Event("input", { bubbles: true }));
  assert.equal(doc.querySelector("#sound-level").textContent, "20%");
  assert.deepEqual(events.at(-1), ["volume", 0.2]);
  slider.focus();
  key("ArrowRight");
  assert.equal(doc.activeElement, slider);
  click('[data-key="0"]');
  click('[data-key="9"]');
  assert.equal(doc.querySelector("#sound-volume").value, "20");
  assert.equal(doc.querySelector("#sound-style").value, "soft");
});

test("keypad and lid dispatch distinct sounds, and backgrounding cancels audio", () => {
  const events = [];
  const audio = {
    play: (...args) => events.push(args),
    stop: () => events.push(["stop"]),
    setEnabled() {},
  };
  const { window, doc, click } = setup({ audio });
  click('[data-key="2"]');
  assert.deepEqual(events.at(-1), ["key", "2"]);
  click("#fold-phone");
  assert.deepEqual(events.at(-1), ["close", undefined]);
  click("#fold-phone");
  assert.deepEqual(events.at(-1), ["open", undefined]);
  window.dispatchEvent(new window.Event("blur"));
  assert.deepEqual(events.at(-1), ["stop"]);
  Object.defineProperty(doc, "hidden", { value: true, configurable: true });
  doc.dispatchEvent(new window.Event("visibilitychange"));
  assert.deepEqual(events.at(-1), ["stop"]);
});

test("wallpapers apply independently of phone finish and survive a new page visit", () => {
  const { window, doc, click } = setup();
  click('[data-key="9"]');
  click("[data-open-wallpapers]");
  for (const id of ["munich", "alpine", "midnight", "original"]) {
    click(`[data-wallpaper-option="${id}"]`);
    assert.equal(doc.documentElement.dataset.wallpaper, id);
    assert.equal(window.localStorage.getItem("nj-phone-wallpaper"), id);
    assert.equal(
      doc.querySelector('[data-wallpaper-option][aria-pressed="true"]').dataset
        .wallpaperOption,
      id,
    );
  }
  click('[data-wallpaper-option="munich"]');
  click('[data-theme-option="amber"]');
  assert.equal(doc.documentElement.dataset.wallpaper, "munich");
  click("#physical-back");
  assert.match(
    doc.querySelector("[data-open-wallpapers]").textContent,
    /Munich/,
  );
  const next = setup({
    stored: {
      "nj-phone-wallpaper": window.localStorage.getItem("nj-phone-wallpaper"),
    },
  });
  assert.equal(next.doc.documentElement.dataset.wallpaper, "munich");
});

test("D-pad previews wallpapers and OK applies the highlighted scene", () => {
  const { doc, click, key } = setup();
  click('[data-key="9"]');
  click("[data-open-wallpapers]");
  key("ArrowRight");
  assert.equal(
    doc.querySelector(".wallpaper-preview").dataset.wallpaper,
    "munich",
  );
  assert.equal(doc.documentElement.dataset.wallpaper, "original");
  key("Enter");
  assert.equal(doc.documentElement.dataset.wallpaper, "munich");
  key("ArrowDown");
  key("Enter");
  assert.equal(doc.documentElement.dataset.wallpaper, "midnight");
});

test("first-visit startup is skippable, repeat visits bypass it, and Settings replays it", () => {
  const { window, doc, click } = setup({ reducedMotion: false });
  assert.ok(doc.querySelector(".startup-screen"));
  assert.equal(window.localStorage.getItem("nj-phone-startup-seen"), "1");
  click("[data-skip-startup]");
  assert.ok(doc.querySelector(".app-grid"));
  assert.equal(doc.activeElement, doc.querySelector("#phone-screen"));
  click('[data-key="9"]');
  click("[data-replay-startup]");
  assert.ok(doc.querySelector(".startup-screen"));
  click("#select-key");
  assert.ok(doc.querySelector(".app-grid"));
  const returning = setup({
    reducedMotion: false,
    stored: { "nj-phone-startup-seen": "1" },
  });
  assert.equal(returning.doc.querySelector(".startup-screen"), null);
});

test("startup finishes automatically without overriding navigation, a closed lid, or Quick view", async () => {
  const auto = setup({ reducedMotion: false });
  auto.doc.querySelector("[data-skip-startup]").focus();
  const navigated = setup({ reducedMotion: false });
  navigated.click('[data-key="2"]');
  const folded = setup({ reducedMotion: false });
  folded.click("#fold-phone");
  const quick = setup({ reducedMotion: false });
  quick.click(".quick-view-trigger");
  await new Promise((resolve) => setTimeout(resolve, 1900));
  assert.ok(auto.doc.querySelector(".app-grid"));
  assert.equal(auto.doc.activeElement, auto.doc.querySelector("#phone-screen"));
  assert.equal(
    navigated.doc.querySelector(".app-header > span").textContent,
    "Selected projects",
  );
  assert.ok(folded.doc.querySelector("#phone").classList.contains("is-closed"));
  assert.equal(quick.doc.querySelector("#quick-dialog").open, true);
  assert.equal(
    quick.doc.activeElement,
    quick.doc.querySelector("#close-quick"),
  );
});

test("reduced motion bypasses the startup animation, including replay", () => {
  const { doc, click } = setup();
  assert.equal(doc.querySelector(".startup-screen"), null);
  click('[data-key="9"]');
  click("[data-replay-startup]");
  assert.ok(doc.querySelector(".app-grid"));
});

test("Snake saves a best score during actual play and retains it after leaving and reloading", (t) => {
  t.mock.timers.enable({ apis: ["setInterval"] });
  const { window, doc, click } = setup();
  click('[data-key="8"]');
  click("#snake-start");
  t.mock.timers.tick(950);
  assert.equal(doc.querySelector("#snake-score").textContent, "SCORE 01");
  assert.equal(doc.querySelector("#snake-best").textContent, "BEST 01");
  assert.equal(window.localStorage.getItem("nj-snake-best"), "1");
  click("#physical-menu");
  click('[data-key="8"]');
  assert.equal(doc.querySelector("#snake-score").textContent, "SCORE 00");
  assert.equal(doc.querySelector("#snake-best").textContent, "BEST 01");
  const next = setup({
    stored: { "nj-snake-best": window.localStorage.getItem("nj-snake-best") },
  });
  next.click('[data-key="8"]');
  assert.equal(next.doc.querySelector("#snake-best").textContent, "BEST 01");
});

test("a lower Snake score cannot overwrite an existing record", (t) => {
  t.mock.timers.enable({ apis: ["setInterval"] });
  const { window, doc, click } = setup({ stored: { "nj-snake-best": "12" } });
  click('[data-key="8"]');
  click("#snake-start");
  t.mock.timers.tick(2090);
  assert.equal(doc.querySelector("#snake-best").textContent, "BEST 12");
  assert.equal(window.localStorage.getItem("nj-snake-best"), "12");
  assert.equal(
    doc.querySelector("#snake-best").classList.contains("new-record"),
    false,
  );
});

test("invalid saved values and disabled storage do not break personalization", () => {
  for (const value of ["-1", "999", "NaN", "2.5"]) {
    const { doc, click } = setup({
      stored: { "nj-snake-best": value, "nj-phone-wallpaper": "missing" },
    });
    click('[data-key="8"]');
    assert.equal(doc.querySelector("#snake-best").textContent, "BEST 00");
    assert.equal(doc.documentElement.dataset.wallpaper, "original");
  }
  const { doc, click } = setup({ blockedStorage: true });
  click('[data-key="9"]');
  click("[data-open-wallpapers]");
  click('[data-wallpaper-option="alpine"]');
  assert.equal(doc.documentElement.dataset.wallpaper, "alpine");
  click('[data-key="8"]');
  assert.equal(doc.querySelector("#snake-best").textContent, "BEST 00");
});

test("homepage invites discovery without displaying the secret code", () => {
  const { doc, click } = setup();
  assert.match(doc.querySelector("#easter-teaser").textContent, /Easter egg/);
  assert.doesNotMatch(doc.querySelector("#easter-clue").textContent, /622335/);
  assert.equal(
    doc.querySelector('.theme-picker [data-theme-option="aurora"]').hidden,
    true,
  );
  click('[data-key="9"]');
  assert.equal(doc.querySelectorAll(".settings-themes button").length, 3);
});

test("typing the name code unlocks Aurora while individual keys still open apps", () => {
  const { window, doc, key, click } = setup();
  key("6");
  assert.equal(
    doc.querySelector(".app-header > span").textContent,
    "Elsewhere",
  );
  for (const digit of "22335") key(digit);
  assert.equal(doc.documentElement.dataset.theme, "aurora");
  assert.ok(doc.querySelector(".secret-page"));
  assert.equal(window.localStorage.getItem("nj-phone-secret"), "1");
  assert.equal(window.localStorage.getItem("nj-phone-theme"), "aurora");
  assert.equal(
    doc.querySelector('.theme-picker [data-theme-option="aurora"]').hidden,
    false,
  );
  assert.match(doc.querySelector("#easter-teaser").textContent, /unlocked/);
  click("[data-secret-home]");
  assert.ok(doc.querySelector(".app-grid"));
  click('[data-key="9"]');
  assert.equal(doc.querySelectorAll(".settings-themes button").length, 4);
  click('.settings-themes [data-theme-option="porcelain"]');
  click('.settings-themes [data-theme-option="aurora"]');
  assert.equal(doc.documentElement.dataset.theme, "aurora");
  click('[data-key="*"]');
  assert.equal(doc.documentElement.dataset.theme, "porcelain");
});

test("physical keypad unlocks the theme and returning visitors retain access", () => {
  const { doc, click } = setup();
  for (const digit of "622335") click(`[data-key="${digit}"]`);
  assert.ok(doc.querySelector(".secret-page"));
  const next = setup({
    stored: { "nj-phone-secret": "1", "nj-phone-theme": "aurora" },
  });
  assert.equal(next.doc.documentElement.dataset.theme, "aurora");
  assert.equal(
    next.doc.querySelector('.theme-picker [data-theme-option="aurora"]').hidden,
    false,
  );
  const locked = setup({ stored: { "nj-phone-theme": "aurora" } });
  assert.equal(locked.doc.documentElement.dataset.theme, "porcelain");
});

test("interrupted codes and Snake controls never trigger the hidden edition", () => {
  const { doc, key, click } = setup();
  for (const digit of "622") key(digit);
  click("#physical-menu");
  for (const digit of "335") key(digit);
  assert.equal(doc.documentElement.dataset.theme, "porcelain");
  click('[data-key="8"]');
  for (const digit of "622335") key(digit);
  assert.ok(doc.querySelector(".snake-page"));
  assert.equal(doc.documentElement.dataset.theme, "porcelain");
});

test("the hidden theme also works when local storage is disabled", () => {
  const { doc, key, click } = setup({ blockedStorage: true });
  for (const digit of "622335") key(digit);
  assert.equal(doc.documentElement.dataset.theme, "aurora");
  click('[data-key="9"]');
  assert.equal(doc.querySelectorAll(".settings-themes button").length, 4);
});
