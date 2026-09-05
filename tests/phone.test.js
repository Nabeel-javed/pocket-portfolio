import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { createSnake } from "../src/snake.js";

const pages = [];
afterEach(() => {
  for (const page of pages) {
    page.window.document.querySelector("#physical-menu").click();
    page.window.close();
  }
  pages.length = 0;
});
function setup() {
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
