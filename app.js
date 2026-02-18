import { AuroraAnimator } from "./aurora.js";

const body = document.body;
const button = document.getElementById("activate-btn");
const statusText = document.getElementById("status-text");
const canvas = document.getElementById("aurora-canvas");

const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
const animator = new AuroraAnimator(canvas, { reducedMotion: reducedMotionMedia.matches });

const setStatus = (message) => {
  statusText.textContent = message;
};

const activateNightMode = () => {
  body.classList.add("night-active");
  button.setAttribute("aria-pressed", "true");
  button.textContent = "Night Sky Active";
  setStatus("Mode: Night active - Aurora running");
  animator.start();
};

button.addEventListener("click", activateNightMode);
button.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    activateNightMode();
  }
});

const motionChangeHandler = (event) => {
  animator.setReducedMotion(event.matches);
  if (event.matches) {
    setStatus("Mode: Night active - Reduced motion aurora");
  }
};

if (typeof reducedMotionMedia.addEventListener === "function") {
  reducedMotionMedia.addEventListener("change", motionChangeHandler);
} else {
  reducedMotionMedia.addListener(motionChangeHandler);
}

setStatus("Mode: Default");
