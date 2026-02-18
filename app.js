import { AuroraAnimator } from "./aurora.js";

const body = document.body;
const button = document.getElementById("activate-btn");
const statusText = document.getElementById("status-text");
const canvas = document.getElementById("aurora-canvas");

const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
const animator = new AuroraAnimator(canvas, { reducedMotion: reducedMotionMedia.matches });

const state = {
  nightModeActive: false
};

const setStatus = (message) => {
  statusText.textContent = message;
};

const isEditableTarget = (target) => {
  if (!(target instanceof Element)) {
    return false;
  }

  return target.closest("input, textarea, select, [contenteditable=''], [contenteditable='true']") !== null;
};

const activateNightMode = (source = "pointer") => {
  if (state.nightModeActive) {
    return;
  }

  state.nightModeActive = true;
  body.classList.add("night-active");
  button.setAttribute("aria-pressed", "true");
  button.textContent = "Night Sky Active";

  if (source === "keyboard") {
    setStatus("Mode: Night active - Aurora running (keyboard)");
  } else {
    setStatus("Mode: Night active - Aurora running");
  }

  animator.start();
};

button.addEventListener("click", () => activateNightMode("pointer"));

document.addEventListener("keydown", (event) => {
  if (state.nightModeActive || event.repeat) {
    return;
  }

  const isActivationKey = event.key === "Enter" || event.key === " " || event.key === "Spacebar";
  if (!isActivationKey) {
    return;
  }

  if (isEditableTarget(event.target)) {
    return;
  }

  const focusedOnButton = document.activeElement === button;
  const focusedOnPage = document.activeElement === document.body || document.activeElement === document.documentElement;

  if (!focusedOnButton && !focusedOnPage) {
    return;
  }

  event.preventDefault();
  activateNightMode("keyboard");
});

const motionChangeHandler = (event) => {
  animator.setReducedMotion(event.matches);
  if (event.matches && state.nightModeActive) {
    setStatus("Mode: Night active - Reduced motion aurora");
  }
};

if (typeof reducedMotionMedia.addEventListener === "function") {
  reducedMotionMedia.addEventListener("change", motionChangeHandler);
} else {
  reducedMotionMedia.addListener(motionChangeHandler);
}

setStatus("Mode: Default");
