import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { createSnake } from "../src/snake.js";
import { createPhoneAudio } from "../src/audio.js";

const pages = [];
afterEach(() => {
  for (const page of pages) {
    page.window.document.querySelector("#physical-menu").click();
    page.window.close();
  }
  pages.length = 0;
});
function setup({ audio } = {}) {
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
  window.matchMedia = () => ({ matches: true });
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
  click('[data-key="9"]');
  assert.equal(
    doc.querySelector("[data-toggle-sound]").getAttribute("aria-pressed"),
    "false",
  );
  click("[data-toggle-sound]");
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
