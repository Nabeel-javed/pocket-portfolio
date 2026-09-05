import "./style.css";
import { createSnake } from "./snake.js";
import { createPhoneAudio } from "./audio.js";

const svg = (body) =>
  `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;
const icons = {
  about: svg(
    '<rect x="5" y="3" width="22" height="26" rx="3" fill="#DDB87A" stroke="#F8DCA4"/><path d="M10 25v-6h3v-2h6v2h3v6" fill="#497485"/><path d="M12 8h8v8h-8z" fill="#F9D8A8"/><path d="M11 7h10v5h-2V9h-6v3h-2z" fill="#685342"/><path d="M15 12v2m3-2v2" stroke="#70533E"/>',
  ),
  work: svg(
    '<path d="M3 9V6h10l3 3h13v18H3z" fill="#DBAC53" stroke="#FFE0A1"/><path d="M3 12h26l-3 15H3z" fill="#E9C675"/><path d="M7 16h13M7 20h9" stroke="#9E752C" stroke-width="1.5"/><path d="M4 11h24" stroke="#FFF0B9"/>',
  ),
  journey: svg(
    '<rect x="4" y="9" width="24" height="19" rx="2" fill="#BC8362" stroke="#F1BF98"/><path d="M11 9V5h10v4M4 16h24" stroke="#EFD1A3" stroke-width="2"/><path d="M14 14h4v5h-4z" fill="#F4D7AA"/><path d="M7 23h18" stroke="#925F48"/>',
  ),
  skills: svg(
    '<rect x="7" y="7" width="18" height="18" rx="2" fill="#80AE99" stroke="#C6E4BB"/><path d="M12 2v5m8-5v5M12 25v5m8-5v5M2 12h5m-5 8h5m18-8h5m-5 8h5" stroke="#D4E5C7" stroke-width="2"/><rect x="12" y="12" width="8" height="8" rx="1" fill="#3E6E64"/><path d="m14 17 2-3 2 3" stroke="#D4E5C7"/>',
  ),
  contact: svg(
    '<path d="M4 5h24v19H13l-7 5v-5H4z" fill="#79B7C5" stroke="#C6EDF0"/><path d="M9 10h14M9 15h11M9 20h7" stroke="#326E85" stroke-width="2"/>',
  ),
  links: svg(
    '<circle cx="16" cy="16" r="12" fill="#689CB9" stroke="#B6DCE5"/><ellipse cx="16" cy="16" rx="5" ry="12" stroke="#C9E4E7"/><path d="M4 16h24M7 9h18M7 23h18" stroke="#C9E4E7"/>',
  ),
  cv: svg(
    '<path d="M7 2h13l6 6v22H7z" fill="#E8E5D9" stroke="#FFFCED"/><path d="M20 2v7h6" fill="#ACAAB6"/><path d="M11 13h10M11 17h10M11 21h6" stroke="#8993A5" stroke-width="1.5"/><path d="M19 23h10v7H19z" fill="#C77F87"/><path d="M21 26h6" stroke="#FFE8E3"/>',
  ),
  snake: svg(
    '<path d="M7 7h17v7H11v8h13v7H5V17h12v-3H7z" fill="#A8C57D" stroke="#DDE7A8"/><path d="M21 7v4m3-4v4" stroke="#395F4A" stroke-width="2"/><path d="M24 24h5" stroke="#DAB486" stroke-width="2"/>',
  ),
  settings: svg(
    '<path d="m13 2-1 5-3 1-4-2-3 5 4 3v4l-4 3 3 5 4-2 3 1 1 5h6l1-5 3-1 4 2 3-5-4-3v-4l4-3-3-5-4 2-3-1-1-5z" fill="#A9B6BE" stroke="#E1E7E8"/><circle cx="16" cy="16" r="6" fill="#526D81" stroke="#D1DCE1"/><circle cx="16" cy="16" r="2" fill="#A5BFCA"/>',
  ),
};
const apps = [
  { id: "about", name: "About" },
  { id: "work", name: "Projects" },
  { id: "journey", name: "Experience" },
  { id: "skills", name: "Skills" },
  { id: "contact", name: "Contact" },
  { id: "links", name: "Links" },
  { id: "cv", name: "My CV" },
  { id: "snake", name: "Snake" },
  { id: "settings", name: "Settings" },
];
const projects = [
  {
    title: "Multi-agent pipeline",
    subtitle: "Agents with a plan. And a fallback.",
    stack: "Python · LangGraph · Structured outputs",
    description:
      "A state-driven workflow for retrieval, planning, tool selection, static analysis, and verification.",
    points: [
      "Explicit error states and retries.",
      "Human-in-the-loop checkpoints.",
      "Structured output validation.",
    ],
  },
  {
    title: "RAG platform",
    subtitle: "Knowledge, within reach.",
    stack: "PGVector · BM25 · Cohere · Python",
    description:
      "An end-to-end retrieval platform combining vector similarity, lexical search, and reranking.",
    points: [
      "Tuned chunking and embeddings.",
      "Hybrid BM25 + embedding search.",
      "Cohere reranking and metadata routing.",
    ],
  },
  {
    title: "Fine-tuning & evals",
    subtitle: "Better models. Measured.",
    stack: "Python · OpenAI · Gemini · Evals",
    description:
      "Domain-specific classification and summarization, paired with model evaluation.",
    points: [
      "Supervised fine-tuning.",
      "Accuracy and hallucination comparisons.",
      "Cost trade-offs across models.",
    ],
  },
  {
    title: "Static analysis agent",
    subtitle: "A second set of engineering eyes.",
    stack: "LLM agents · API contracts · Static analysis",
    description:
      "An engineering review agent for performance, concurrency, and compatibility risks.",
    points: [
      "N+1 queries and caching inefficiencies.",
      "Schema drift and unsafe API contracts.",
      "Missing idempotency and concurrency risks.",
    ],
  },
  {
    title: "ML pricing engine",
    subtitle: "Real-time decisions, at scale.",
    stack: "Python · Redis · DynamoDB · Autoscaling",
    description:
      "A high-throughput pricing system processing 500,000+ requests each day.",
    points: [
      "Python-based ML inference.",
      "Redis caching and DynamoDB state.",
      "Autoscaling for changing demand.",
    ],
  },
];
const screen = document.querySelector("#screen-content");
const phoneScreen = document.querySelector("#phone-screen");
const phone = document.querySelector("#phone");
const quickDialog = document.querySelector("#quick-dialog");
let route = "home";
let selected = 0;
let selectedProject = 0;
let closed = false;
let sound = true;
const phoneAudio = createPhoneAudio();
phoneAudio.setEnabled(sound);
let soundStyle = "classic";
let soundVolume = 35;
let game;
let toastTimer;
let quickReturnFocus;

function announce(text) {
  document.querySelector("#announcement").textContent = text;
}
function tone(kind = "navigate", key) {
  phoneAudio.play(kind, key);
}
function toast(text) {
  phoneScreen.querySelector(".toast")?.remove();
  clearTimeout(toastTimer);
  const element = document.createElement("div");
  element.className = "toast";
  element.textContent = text;
  phoneScreen.append(element);
  announce(text);
  toastTimer = setTimeout(() => element.remove(), 1900);
}
function currentTheme() {
  return document.documentElement.dataset.theme;
}
function setTheme(theme) {
  if (!["porcelain", "graphite", "amber"].includes(theme)) return;
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("nj-phone-theme", theme);
  } catch {}
  document
    .querySelectorAll("[data-theme-option]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.themeOption === theme),
      ),
    );
  document.querySelector('meta[name="theme-color"]').content = {
    porcelain: "#efeee8",
    graphite: "#202624",
    amber: "#e9e2d6",
  }[theme];
}
function cycleTheme() {
  const themes = ["porcelain", "graphite", "amber"];
  setTheme(themes[(themes.indexOf(currentTheme()) + 1) % 3]);
  toast(
    {
      porcelain: "Silver edition",
      graphite: "Graphite edition",
      amber: "Champagne edition",
    }[currentTheme()],
  );
}
function setSound(value) {
  sound = value;
  phoneAudio.setEnabled(value);
  document.querySelector("#sound-toggle").innerHTML =
    `Sound ${value ? "on" : "off"} <span aria-hidden="true">♪</span>`;
  document
    .querySelector("#sound-toggle")
    .setAttribute("aria-pressed", String(value));
  document.querySelector("#sound-indicator").textContent = value ? "♪" : "♪̸";
  const settingsToggle = screen.querySelector("[data-toggle-sound]");
  if (settingsToggle) {
    settingsToggle.textContent = value ? "On ♪" : "Off";
    settingsToggle.setAttribute("aria-pressed", String(value));
  }
  if (value) tone("confirm");
}
function clock() {
  const now = new Date();
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Berlin",
  }).format(now);
  document
    .querySelectorAll(".status-time,.home-clock,.outer-time,#munich-time")
    .forEach((el) => (el.textContent = time));
  const date = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Europe/Berlin",
  }).format(now);
  document
    .querySelectorAll(".home-date")
    .forEach((el) => (el.textContent = date));
}
function appHeader(id, title, extra = "") {
  return `<div class="app-header">${icons[id]}<span>${title}</span>${extra ? `<small>${extra}</small>` : ""}</div>`;
}
function setContent(html) {
  screen.innerHTML = html;
  screen.scrollTop = 0;
  screen.classList.remove("screen-enter");
  requestAnimationFrame(() => screen.classList.add("screen-enter"));
}
function updateSoftkeys(left = "Menu", center = "Select", right = "Back") {
  document.querySelector("#screen-left").textContent = left;
  document.querySelector("#screen-center").textContent = center;
  document.querySelector("#screen-right").textContent = right;
}
function leaveGame() {
  game?.destroy();
  game = null;
}
function showHome() {
  leaveGame();
  route = "home";
  setContent(
    `<div class="home-screen"><div class="home-greeting"><div><div class="home-clock">14:00</div><p class="home-date">Sat, 5 Sept</p></div><p class="home-message"><strong>Hello, stranger.</strong>Nice to connect.</p></div><div class="app-grid" role="group" aria-label="Portfolio apps">${apps.map((app, index) => `<button class="app-icon ${selected === index ? "selected" : ""}" data-app="${app.id}" aria-label="Open ${app.name}" ${selected === index ? 'aria-current="true"' : ""}>${icons[app.id]}<span class="app-label">${app.name}</span><kbd aria-hidden="true">${index + 1}</kbd></button>`).join("")}</div></div>`,
  );
  updateSoftkeys("Menu", "Select", "Contact");
  clock();
  announce("Home. Use the apps, arrow keys, or numbers 1 to 9.");
}
function openApp(id) {
  if (closed) fold(false);
  if (!apps.some((app) => app.id === id)) return;
  selected = apps.findIndex((app) => app.id === id);
  leaveGame();
  route = id;
  updateSoftkeys("Menu", "↑ ↓", "Back");
  if (id === "about") {
    setContent(
      appHeader(id, "Hello, I’m Nabeel") +
        `<div class="app-body"><div class="avatar-block"><div class="pixel-avatar">${icons.about}</div><div><h3>Nabeel Javed</h3><p>AI ENGINEER<br>MUNICH, GERMANY</p></div></div><p>I build AI systems that hold up in production: agents, retrieval, evaluation, and reliable backends.</p><p>I care about useful software, thoughtful architecture, and getting the details right.</p><span class="small-chip">Python at heart</span><span class="small-chip">Curious by default</span><button class="screen-action" data-quick-view>Read the short version <span>↗</span></button></div>`,
    );
  } else if (id === "work") {
    setContent(
      appHeader(id, "Selected projects", "5 ITEMS") +
        `<div class="screen-list">${projects.map((project, i) => `<button class="screen-row ${i === selectedProject ? "selected" : ""}" data-project="${i}"><span class="row-icon">0${i + 1}</span><span><strong>${project.title}</strong><small>${project.stack.split(" · ").slice(0, 2).join(" / ")}</small></span><span class="row-arrow">›</span></button>`).join("")}</div>`,
    );
    updateSoftkeys("Menu", "Open", "Back");
  } else if (id === "journey") {
    setContent(
      appHeader(id, "Experience", "2020 → NOW") +
        `<div class="app-body"><article class="job-mini"><small>MAY 2023 — PRESENT</small><h3>Careem</h3><p>Lead AI + Full Stack Engineer</p><p>Agentic workflows, retrieval architecture, and dependable Python AI services.</p><div class="mini-metrics"><div><strong>60%</strong><small>CODE REVIEW AUTOMATED</small></div><div><strong>35%</strong><small>P95 LATENCY IMPROVEMENT</small></div></div></article><article class="job-mini"><small>JUN 2020 — APR 2023</small><h3>Arbisoft</h3><p>AI-Enabled Backend Developer</p><p>Backend services supporting 5M monthly EdTech users with 99.9% uptime.</p></article><a class="screen-action" href="/Nabeel-Javed-CV.pdf" download>Full experience in my CV <span>↓</span></a></div>`,
    );
  } else if (id === "skills") {
    setContent(
      appHeader(id, "Tools I work with") +
        `<div class="app-body"><div class="skill-group"><h3>01 / INTELLIGENCE</h3><p>LangChain · LangGraph · RAG · Embeddings · Reranking · Fine-tuning · Evals</p></div><div class="skill-group"><h3>02 / BACKEND</h3><p>Python · FastAPI · Flask · Node.js · PostgreSQL · Redis · Docker</p></div><div class="skill-group"><h3>03 / PRODUCTION</h3><p>AWS · GCP · Async systems · Distributed tracing · Observability</p></div><div class="skill-group"><h3>04 / MODELS</h3><p>OpenAI · Claude · Gemini</p></div></div>`,
    );
  } else if (id === "contact") {
    setContent(
      appHeader(id, "Incoming call", "SAY HELLO") +
        `<div class="incoming-call"><div class="caller-orbit" aria-hidden="true"><span></span><span></span><div class="caller-avatar">${icons.about}</div></div><p class="caller-name">Nabeel Javed · Munich</p><h3>Let’s work together.</h3><p class="caller-note">A role, an idea, or a simple hello.</p><div class="call-actions"><a class="screen-action call-email" href="mailto:nabeeljaved944@gmail.com"><span aria-hidden="true">↗</span>Email</a><a class="screen-action call-linkedin" href="https://www.linkedin.com/in/nabeel-javed/" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">in</span>LinkedIn</a></div><button class="copy-contact" data-copy-email aria-label="Copy email address">nabeeljaved944@gmail.com <span aria-hidden="true">⧉</span></button></div>`,
    );
    updateSoftkeys("Menu", "Email", "Back");
  } else if (id === "links") {
    setContent(
      appHeader(id, "Elsewhere", "2 LINKS") +
        `<div class="screen-list links-list"><a class="screen-row" href="https://github.com/Nabeel-javed" target="_blank" rel="noopener noreferrer"><span class="row-icon">&lt;/&gt;</span><span><strong>GitHub</strong><small>Nabeel-javed / Code & experiments</small></span><span class="row-arrow">↗</span></a><a class="screen-row" href="https://www.linkedin.com/in/nabeel-javed/" target="_blank" rel="noopener noreferrer"><span class="row-icon">in</span><span><strong>LinkedIn</strong><small>nabeel-javed / Professional life</small></span><span class="row-arrow">↗</span></a></div>`,
    );
  } else if (id === "cv") {
    setContent(
      appHeader(id, "My documents", "1 FILE") +
        `<div class="app-body"><div class="file-card">${icons.cv}<div><h3>Nabeel-Javed-CV.pdf</h3><small>PDF DOCUMENT · 1 PAGE</small></div></div><p>My experience, projects, and engineering toolkit, all in one place.</p><a class="screen-action primary" href="/Nabeel-Javed-CV.pdf" download>Download CV <span>↓</span></a><button class="screen-action" data-quick-view>Quick view <span>↗</span></button></div>`,
    );
  } else if (id === "settings") renderSettings();
  else if (id === "snake") {
    setContent(
      `<div class="snake-page"><div class="snake-top"><span>SNAKE / POCKET EDITION</span><span id="snake-score">SCORE 00</span></div><canvas id="snake-board" class="snake-board" width="234" height="156" role="img" aria-label="Snake game. Use the directional pad or arrow keys. Press OK to start or pause."></canvas><div class="snake-controls"><p id="snake-hint">D-PAD OR ARROW KEYS<br>2 / 4 / 6 / 8 ALSO WORK</p><button id="snake-start">Play ▶</button></div></div>`,
    );
    updateSoftkeys("Menu", "Play", "Back");
    game = createSnake(document.querySelector("#snake-board"), {
      onUpdate(state, score) {
        document.querySelector("#snake-score").textContent =
          `SCORE ${String(score).padStart(2, "0")}`;
        document.querySelector("#snake-start").textContent =
          state === "running"
            ? "Pause Ⅱ"
            : state === "paused"
              ? "Resume ▶"
              : state === "over"
                ? "Again ↺"
                : "Play ▶";
        document.querySelector("#screen-center").textContent =
          state === "running" ? "Pause" : "Play";
        if (state === "over")
          announce(`Game over. Score ${score}. Press OK to play again.`);
      },
    });
  }
  announce(`${apps[selected].name} app opened.`);
}
function renderSettings() {
  setContent(
    appHeader("settings", "Make it yours") +
      `<div class="app-body"><p>Pick your pocket edition.</p><div class="settings-themes" role="group" aria-label="Phone color">${["porcelain", "graphite", "amber"].map((theme, i) => `<button data-theme-option="${theme}" aria-label="${theme} phone color" aria-pressed="${currentTheme() === theme}"><i></i>${["Silver", "Graphite", "Champagne"][i]}</button>`).join("")}</div><div class="settings-row"><span>Phone sounds</span><button data-toggle-sound aria-pressed="${sound}">${sound ? "On ♪" : "Off"}</button></div><div class="settings-row"><label for="sound-style">Sound style</label><select id="sound-style"><option value="classic" ${soundStyle === "classic" ? "selected" : ""}>Classic</option><option value="soft" ${soundStyle === "soft" ? "selected" : ""}>Soft</option></select></div><div class="settings-row sound-volume-row"><label for="sound-volume">Volume <output id="sound-level" for="sound-volume">${soundVolume}%</output></label><input id="sound-volume" type="range" min="0" max="100" step="5" value="${soundVolume}" aria-valuetext="${soundVolume}%"></div><button class="screen-action" data-preview-sound>Preview ringtone <span>♪</span></button><div class="settings-row"><span>Phone</span><button data-fold>Close ↘</button></div><p class="settings-hint">✳ changes color · # toggles sound<br>0 takes you home · Esc goes back</p></div>`,
  );
}
function openProject(index) {
  if (!projects[index]) return;
  selectedProject = index;
  route = "project";
  const project = projects[index];
  setContent(
    appHeader("work", "Project details", `0${index + 1} / 05`) +
      `<div class="app-body project-mini"><span class="project-index">${project.title.toUpperCase()}</span><h3>${project.subtitle}</h3><p>${project.description}</p><ul>${project.points.map((point) => `<li>${point}</li>`).join("")}</ul><p class="project-stack">${project.stack}</p><button class="screen-action" data-app="contact">Talk about this project <span>↗</span></button></div>`,
  );
  updateSoftkeys("Menu", "↑ ↓", "Back");
  announce(`${project.title} details opened.`);
}
function back() {
  tone("back");
  if (route === "project") openApp("work");
  else showHome();
}
function fold(value) {
  closed = value;
  if (closed) game?.pause();
  phone.classList.toggle("is-closed", closed);
  document.querySelector(".lid-front").inert = closed;
  document.querySelector(".phone-base").inert = closed;
  document
    .querySelector("#fold-phone")
    .setAttribute("aria-expanded", String(!closed));
  document.querySelector("#fold-phone").innerHTML =
    `${closed ? "Open" : "Close"} phone <span aria-hidden="true">${closed ? "↗" : "↘"}</span>`;
  announce(
    closed ? "Phone closed. Use Open phone to continue." : "Phone open.",
  );
  tone(closed ? "close" : "open");
}
function move(direction) {
  if (closed) return;
  tone();
  if (route === "snake") {
    game?.direction(direction);
    return;
  }
  if (route === "home") {
    const row = Math.floor(selected / 3),
      column = selected % 3;
    if (direction === "left") selected = row * 3 + ((column + 2) % 3);
    if (direction === "right") selected = row * 3 + ((column + 1) % 3);
    if (direction === "up") selected = ((row + 2) % 3) * 3 + column;
    if (direction === "down") selected = ((row + 1) % 3) * 3 + column;
    screen.querySelectorAll("[data-app]").forEach((button, index) => {
      button.classList.toggle("selected", index === selected);
      if (index === selected) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
    announce(`${apps[selected].name}, ${selected + 1} of 9`);
  } else if (route === "work") {
    selectedProject =
      (selectedProject +
        (direction === "up" || direction === "left" ? -1 : 1) +
        projects.length) %
      projects.length;
    screen.querySelectorAll("[data-project]").forEach((button, index) => {
      button.classList.toggle("selected", index === selectedProject);
      if (index === selectedProject)
        button.scrollIntoView({ block: "nearest", behavior: "instant" });
    });
    announce(projects[selectedProject].title);
  } else
    screen.scrollBy({
      top: direction === "up" || direction === "left" ? -65 : 65,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
}
function select() {
  if (closed) {
    fold(false);
    return;
  }
  tone("confirm");
  if (route === "home") openApp(apps[selected].id);
  else if (route === "work") openProject(selectedProject);
  else if (route === "snake") game?.toggle();
  else screen.querySelector(".screen-action,.screen-row")?.click();
}
function numberKey(key) {
  if (closed) {
    fold(false);
    return;
  }
  if (key !== "#") tone("key", key);
  const button = document.querySelector(`[data-key="${key}"]`);
  button?.classList.add("key-pressed");
  setTimeout(() => button?.classList.remove("key-pressed"), 100);
  if (key === "0") {
    showHome();
    return;
  }
  if (key === "*") {
    cycleTheme();
    return;
  }
  if (key === "#") {
    setSound(!sound);
    toast(sound ? "Phone sounds on" : "Phone sounds off");
    return;
  }
  if (route === "snake") {
    const directions = { 2: "up", 4: "left", 6: "right", 8: "down" };
    if (directions[key]) game?.direction(directions[key]);
    else if (key === "5") game?.toggle();
    return;
  }
  const index = Number(key) - 1;
  if (apps[index]) openApp(apps[index].id);
}
function showQuickView() {
  phoneAudio.stop();
  quickReturnFocus = document.activeElement;
  game?.pause();
  quickDialog.showModal();
  document.body.style.overflow = "hidden";
  document.querySelector("#close-quick").focus();
}

document.addEventListener("click", async (event) => {
  if (event.target.closest(".incoming-call a, .copy-contact"))
    phoneAudio.stop();
  if (event.target.closest("[data-preview-sound]")) {
    if (!sound) setSound(true);
    tone("ring");
    return;
  }
  const theme = event.target.closest("[data-theme-option]");
  if (theme) {
    tone();
    setTheme(theme.dataset.themeOption);
    return;
  }
  const app = event.target.closest("[data-app]");
  if (app) {
    tone("confirm");
    openApp(app.dataset.app);
    return;
  }
  const project = event.target.closest("[data-project]");
  if (project) {
    tone("confirm");
    openProject(Number(project.dataset.project));
    return;
  }
  const key = event.target.closest("[data-key]");
  if (key) {
    numberKey(key.dataset.key);
    return;
  }
  const direction = event.target.closest("[data-direction]");
  if (direction) {
    move(direction.dataset.direction);
    return;
  }
  if (event.target.closest("[data-quick-view]")) {
    showQuickView();
    return;
  }
  if (event.target.closest("[data-toggle-sound]")) {
    setSound(!sound);
    return;
  }
  if (event.target.closest("[data-fold]")) {
    fold(true);
    return;
  }
  if (event.target.closest("[data-copy-email]")) {
    try {
      await navigator.clipboard.writeText("nabeeljaved944@gmail.com");
      toast("Email copied. Say hello!");
    } catch {
      toast("Couldn’t copy. Use the Email button above.");
    }
  }
  if (event.target.closest("#snake-start")) game?.toggle();
});
document.querySelector("#physical-menu").addEventListener("click", () => {
  tone();
  showHome();
});
document.querySelector("#physical-back").addEventListener("click", back);
document.querySelector("#select-key").addEventListener("click", select);
document.querySelector("#end-key").addEventListener("click", () => {
  tone("back");
  showHome();
});
document.querySelector("#call-key").addEventListener("click", () => {
  openApp("contact");
  tone("ring");
});
document.querySelector("#screen-left").addEventListener("click", () => {
  tone();
  showHome();
});
document.querySelector("#screen-right").addEventListener("click", () => {
  if (route === "home") {
    openApp("contact");
    tone("confirm");
  } else back();
});
document
  .querySelector("#fold-phone")
  .addEventListener("click", () => fold(!closed));
document
  .querySelector("#sound-toggle")
  .addEventListener("click", () => setSound(!sound));
document
  .querySelector("#close-quick")
  .addEventListener("click", () => quickDialog.close());
quickDialog.addEventListener("close", () => {
  document.body.style.overflow = "";
  quickReturnFocus?.focus({ preventScroll: true });
});
quickDialog.addEventListener("click", (event) => {
  if (event.target !== quickDialog) return;
  const bounds = quickDialog.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    quickDialog.close();
});
document.addEventListener("keydown", (event) => {
  if (
    quickDialog.open ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.target.matches("input,textarea,select,[contenteditable]")
  )
    return;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.preventDefault();
    move(event.key.replace("Arrow", "").toLowerCase());
    phoneScreen.focus({ preventScroll: true });
  } else if (event.key === "Enter" && !event.target.closest("button,a")) {
    event.preventDefault();
    select();
  } else if (
    event.key === "Escape" ||
    (event.key === "Backspace" && !event.target.matches("input,textarea"))
  ) {
    event.preventDefault();
    back();
  } else if (/^[0-9*#]$/.test(event.key)) {
    event.preventDefault();
    numberKey(event.key);
  } else if (
    event.key === " " &&
    route === "snake" &&
    !event.target.closest("button,a")
  ) {
    event.preventDefault();
    game?.toggle();
  }
});
function pauseActivity() {
  game?.pause();
  phoneAudio.stop();
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pauseActivity();
});
window.addEventListener("blur", pauseActivity);
window.addEventListener("pagehide", pauseActivity);
document.addEventListener("input", (event) => {
  if (event.target.id !== "sound-volume") return;
  soundVolume = Number(event.target.value);
  phoneAudio.setVolume(soundVolume / 100);
  document.querySelector("#sound-level").textContent = `${soundVolume}%`;
  event.target.setAttribute("aria-valuetext", `${soundVolume}%`);
});
document.addEventListener("change", (event) => {
  if (event.target.id === "sound-style") {
    soundStyle = event.target.value;
    phoneAudio.setStyle(soundStyle);
    tone("key", "5");
  } else if (event.target.id === "sound-volume") tone("key", "5");
});
setTheme(currentTheme());
showHome();
clock();
setInterval(clock, 30000);
document.querySelector("#year").textContent = new Date().getFullYear();
