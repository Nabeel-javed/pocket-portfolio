const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function createPhone3D({ document, window }) {
  const scene = document.querySelector(".phone-scene");
  const orbit = document.querySelector("#phone-orbit");
  const pad = document.querySelector("#orbit-pad");
  const readout = document.querySelector("#orbit-readout");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  let yaw = motion.matches ? 0 : 12;
  let pitch = 0;
  let drag = null;
  let frame = 0;
  let hoverX = 0;
  let hoverY = 0;

  // Rounded cross-sections give the shell real depth from every viewing angle.
  for (const shell of document.querySelectorAll("[data-shell-depth]")) {
    for (let depth = 1; depth <= 22; depth++) {
      const layer = document.createElement("i");
      layer.className = "shell-layer";
      layer.style.setProperty("--layer-z", `${-depth}px`);
      shell.append(layer);
    }
  }

  function paint() {
    frame = 0;
    orbit.style.setProperty("--orbit-x", `${pitch + hoverX}deg`);
    orbit.style.setProperty("--orbit-y", `${yaw + hoverY}deg`);
    scene.style.setProperty("--light-x", `${50 + (yaw + hoverY) / 4}%`);
    scene.style.setProperty("--shadow-shift", `${yaw / 5}px`);
    const angle = Math.round(yaw);
    readout.textContent = `${angle > 0 ? "+" : ""}${angle}°`;
  }
  function schedule() {
    if (!frame) frame = window.requestAnimationFrame(paint);
  }
  function setPose(x, y, preset) {
    pitch = clamp(x, -32, 32);
    yaw = clamp(y, -180, 180);
    hoverX = hoverY = 0;
    scene.dataset.pose = preset;
    scene.querySelectorAll("[data-phone-pose]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.phonePose === preset),
      );
    });
    paint();
  }
  const presets = { front: [0, 0], angle: [0, 12], back: [0, 180] };
  scene.querySelectorAll("[data-phone-pose]").forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.phonePose;
      setPose(...presets[name], name);
    });
  });
  pad.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || drag) return;
    drag = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      yaw,
      pitch,
    };
    pad.setPointerCapture(event.pointerId);
    pad.focus({ preventScroll: true });
    scene.classList.add("is-rotating");
  });
  pad.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    setPose(
      drag.pitch - (event.clientY - drag.y) * 0.25,
      drag.yaw + (event.clientX - drag.x) * 0.8,
      "custom",
    );
  });
  function release(event) {
    if (!drag || event.pointerId !== drag.id) return;
    const id = drag.id;
    drag = null;
    scene.classList.remove("is-rotating");
    if (pad.hasPointerCapture(id)) pad.releasePointerCapture(id);
  }
  pad.addEventListener("pointerup", release);
  pad.addEventListener("pointercancel", release);
  pad.addEventListener("lostpointercapture", release);
  pad.addEventListener("keydown", (event) => {
    const movement = {
      ArrowLeft: [0, -12],
      ArrowRight: [0, 12],
      ArrowUp: [-6, 0],
      ArrowDown: [6, 0],
    }[event.key];
    if (!movement && !["Home", "Enter", " "].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    if (movement) setPose(pitch + movement[0], yaw + movement[1], "custom");
    else setPose(0, 0, "front");
  });
  scene.addEventListener("pointermove", (event) => {
    if (
      motion.matches ||
      !finePointer.matches ||
      drag ||
      event.pointerType === "touch" ||
      scene.dataset.pose !== "angle"
    )
      return;
    const bounds = scene.getBoundingClientRect();
    hoverY =
      clamp((event.clientX - bounds.left) / bounds.width - 0.5, -0.5, 0.5) * 7;
    hoverX =
      clamp((event.clientY - bounds.top) / bounds.height - 0.5, -0.5, 0.5) * -4;
    schedule();
  });
  scene.addEventListener("pointerleave", () => {
    hoverX = hoverY = 0;
    schedule();
  });
  // Keyboard users return to a straight-on screen before entering the phone.
  orbit.addEventListener("focusin", (event) => {
    if (event.target.matches(":focus-visible")) setPose(0, 0, "front");
  });
  document.querySelector("#fold-phone").addEventListener("click", () => {
    if (Math.abs(yaw) > 80) setPose(0, 12, "angle");
  });
  motion.addEventListener?.("change", () => {
    if (motion.matches) setPose(0, 0, "front");
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  setPose(pitch, yaw, motion.matches ? "front" : "angle");
  return { setPose };
}
