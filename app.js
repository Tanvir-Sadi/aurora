import { AuroraAnimator } from "./aurora.js";

const body = document.body;
const button = document.getElementById("activate-btn");
const statusText = document.getElementById("status-text");
const canvas = document.getElementById("aurora-canvas");
const auroraVideo = document.getElementById("aurora-video");

const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
const animator = new AuroraAnimator(canvas, { reducedMotion: reducedMotionMedia.matches });

const state = {
  nightModeActive: false,
  videoMode: false,
  videoAvailable: null,
  videoSource: null
};

const setStatus = (message) => {
  statusText.textContent = message;
};

const resetInteractiveScene = () => {
  document.documentElement.style.setProperty("--parallax-x", "0px");
  document.documentElement.style.setProperty("--parallax-y", "0px");
  document.documentElement.style.setProperty("--cursor-x", "50%");
  document.documentElement.style.setProperty("--cursor-y", "35%");
  animator.setInteraction(0, 0);
};

const setCursorGlowVisibility = () => {
  if (reducedMotionMedia.matches) {
    document.documentElement.style.setProperty("--cursor-alpha", "0");
    return;
  }

  document.documentElement.style.setProperty("--cursor-alpha", state.nightModeActive ? "1" : "0.45");
};

const applyPointerParallax = (clientX, clientY) => {
  const width = Math.max(1, window.innerWidth);
  const height = Math.max(1, window.innerHeight);

  const normalizedX = (clientX / width - 0.5) * 2;
  const normalizedY = (clientY / height - 0.5) * 2;

  const parallaxX = normalizedX * 18;
  const parallaxY = normalizedY * 12;

  document.documentElement.style.setProperty("--parallax-x", `${parallaxX.toFixed(2)}px`);
  document.documentElement.style.setProperty("--parallax-y", `${parallaxY.toFixed(2)}px`);
  document.documentElement.style.setProperty("--cursor-x", `${((clientX / width) * 100).toFixed(2)}%`);
  document.documentElement.style.setProperty("--cursor-y", `${((clientY / height) * 100).toFixed(2)}%`);

  animator.setInteraction(normalizedX, normalizedY);
};

const setupPointerInteractions = () => {
  let pending = false;
  let nextX = window.innerWidth * 0.5;
  let nextY = window.innerHeight * 0.35;

  const queueApply = (clientX, clientY) => {
    if (reducedMotionMedia.matches) {
      return;
    }

    nextX = clientX;
    nextY = clientY;

    if (pending) {
      return;
    }

    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      applyPointerParallax(nextX, nextY);
    });
  };

  window.addEventListener("pointermove", (event) => {
    queueApply(event.clientX, event.clientY);
  }, { passive: true });

  window.addEventListener("resize", () => {
    if (!reducedMotionMedia.matches) {
      queueApply(window.innerWidth * 0.5, window.innerHeight * 0.35);
    }
  });

  window.addEventListener("blur", () => {
    resetInteractiveScene();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      resetInteractiveScene();
    }
  });
};

const resetButtonTilt = () => {
  button.style.removeProperty("--btn-tilt-x");
  button.style.removeProperty("--btn-tilt-y");
  button.style.removeProperty("--btn-rise");
};

const setupButtonInteractions = () => {
  button.addEventListener("pointermove", (event) => {
    if (reducedMotionMedia.matches) {
      return;
    }

    const rect = button.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return;
    }

    const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;

    button.style.setProperty("--btn-tilt-x", `${(-normalizedY * 9).toFixed(2)}deg`);
    button.style.setProperty("--btn-tilt-y", `${(normalizedX * 9).toFixed(2)}deg`);
    button.style.setProperty("--btn-rise", "-2px");
  });

  button.addEventListener("pointerleave", () => {
    resetButtonTilt();
  });

  button.addEventListener("pointerup", () => {
    if (reducedMotionMedia.matches) {
      return;
    }

    button.style.setProperty("--btn-rise", "-1px");
  });
};

const emitButtonRipple = (event) => {
  if (reducedMotionMedia.matches) {
    return;
  }

  const rect = button.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "btn-ripple";

  const size = Math.max(rect.width, rect.height) * 1.2;
  const fallbackX = rect.width * 0.5;
  const fallbackY = rect.height * 0.5;

  const x = typeof event.clientX === "number" ? event.clientX - rect.left : fallbackX;
  const y = typeof event.clientY === "number" ? event.clientY - rect.top : fallbackY;

  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${x - size * 0.5}px`;
  ripple.style.top = `${y - size * 0.5}px`;

  button.appendChild(ripple);
  ripple.addEventListener("animationend", () => {
    ripple.remove();
  }, { once: true });
};

const isEditableTarget = (target) => {
  if (!(target instanceof Element)) {
    return false;
  }

  return target.closest("input, textarea, select, [contenteditable=''], [contenteditable='true']") !== null;
};

const getVideoSourceCandidates = () => {
  if (!(auroraVideo instanceof HTMLVideoElement)) {
    return [];
  }

  return Array.from(auroraVideo.querySelectorAll("source"))
    .map((node) => node.getAttribute("src")?.trim())
    .filter((src) => Boolean(src));
};

const testVideoSource = (src) => {
  return new Promise((resolve) => {
    const probe = document.createElement("video");
    let settled = false;

    const finish = (ok) => {
      if (settled) {
        return;
      }
      settled = true;
      probe.removeAttribute("src");
      probe.load();
      resolve(ok);
    };

    const timer = window.setTimeout(() => finish(false), 4500);

    probe.preload = "auto";
    probe.muted = true;
    probe.playsInline = true;

    probe.addEventListener("loadeddata", () => {
      clearTimeout(timer);
      finish(true);
    }, { once: true });

    probe.addEventListener("canplay", () => {
      clearTimeout(timer);
      finish(true);
    }, { once: true });

    probe.addEventListener("error", () => {
      clearTimeout(timer);
      finish(false);
    }, { once: true });

    probe.src = src;
    probe.load();
  });
};

const prepareVideoSource = async () => {
  if (state.videoAvailable !== null) {
    return state.videoAvailable;
  }

  if (!(auroraVideo instanceof HTMLVideoElement)) {
    state.videoAvailable = false;
    return false;
  }

  const candidates = getVideoSourceCandidates();
  if (candidates.length === 0) {
    state.videoAvailable = false;
    return false;
  }

  for (const src of candidates) {
    // Validate that a real media file is reachable and decodable.
    // eslint-disable-next-line no-await-in-loop
    const ok = await testVideoSource(src);
    if (!ok) {
      continue;
    }

    auroraVideo.src = src;
    auroraVideo.load();
    state.videoSource = src;
    state.videoAvailable = true;
    return true;
  }

  state.videoAvailable = false;
  return false;
};

const setVideoMode = (enabled) => {
  state.videoMode = enabled;
  body.classList.toggle("aurora-video-active", enabled);
};

const startCanvasMode = (message) => {
  setVideoMode(false);
  animator.start();
  if (message) {
    setStatus(message);
  }
};

const startVideoMode = async () => {
  if (reducedMotionMedia.matches) {
    return false;
  }

  const videoReady = await prepareVideoSource();
  if (!videoReady || !(auroraVideo instanceof HTMLVideoElement)) {
    return false;
  }

  try {
    auroraVideo.muted = true;
    auroraVideo.loop = true;
    auroraVideo.playsInline = true;

    const playPromise = auroraVideo.play();
    if (playPromise && typeof playPromise.then === "function") {
      await playPromise;
    }

    setVideoMode(true);
    animator.stop();
    return true;
  } catch {
    setVideoMode(false);
    return false;
  }
};

const activateNightMode = async (source = "pointer") => {
  if (state.nightModeActive) {
    return;
  }

  state.nightModeActive = true;
  body.classList.add("night-active");
  button.setAttribute("aria-pressed", "true");
  button.textContent = "Night Sky Active";
  setCursorGlowVisibility();

  if (reducedMotionMedia.matches) {
    startCanvasMode("Mode: Night active - Reduced motion aurora");
    return;
  }

  const videoStarted = await startVideoMode();
  if (videoStarted) {
    if (source === "keyboard") {
      setStatus("Mode: Night active - Aurora video (keyboard)");
    } else {
      setStatus("Mode: Night active - Aurora video");
    }
    return;
  }

  if (state.videoAvailable === false) {
    if (source === "keyboard") {
      startCanvasMode("Mode: Night active - Canvas aurora (video file missing)");
    } else {
      startCanvasMode("Mode: Night active - Canvas aurora (video file missing)");
    }
    return;
  }

  if (source === "keyboard") {
    startCanvasMode("Mode: Night active - Aurora running (keyboard)");
  } else {
    startCanvasMode("Mode: Night active - Aurora running");
  }
};

button.addEventListener("click", (event) => {
  emitButtonRipple(event);
  void activateNightMode("pointer");
});

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
  emitButtonRipple({ clientX: button.getBoundingClientRect().left + button.getBoundingClientRect().width * 0.5, clientY: button.getBoundingClientRect().top + button.getBoundingClientRect().height * 0.5 });
  void activateNightMode("keyboard");
});

if (auroraVideo instanceof HTMLVideoElement) {
  auroraVideo.addEventListener("error", () => {
    state.videoAvailable = false;
    if (state.nightModeActive && !reducedMotionMedia.matches) {
      startCanvasMode("Mode: Night active - Canvas aurora (video failed)");
    }
  });
}

const motionChangeHandler = async (event) => {
  animator.setReducedMotion(event.matches);

  if (event.matches) {
    setCursorGlowVisibility();
    resetInteractiveScene();
    resetButtonTilt();
  } else {
    setCursorGlowVisibility();
  }

  if (!state.nightModeActive) {
    return;
  }

  if (event.matches) {
    if (state.videoMode && auroraVideo instanceof HTMLVideoElement) {
      auroraVideo.pause();
    }

    startCanvasMode("Mode: Night active - Reduced motion aurora");
    return;
  }

  const videoStarted = await startVideoMode();
  if (videoStarted) {
    setStatus("Mode: Night active - Aurora video");
  } else if (state.videoAvailable === false) {
    startCanvasMode("Mode: Night active - Canvas aurora (video file missing)");
  } else {
    startCanvasMode("Mode: Night active - Aurora running");
  }
};

setupPointerInteractions();
setupButtonInteractions();
setCursorGlowVisibility();
resetInteractiveScene();

if (typeof reducedMotionMedia.addEventListener === "function") {
  reducedMotionMedia.addEventListener("change", motionChangeHandler);
} else {
  reducedMotionMedia.addListener((event) => {
    void motionChangeHandler(event);
  });
}

void prepareVideoSource();
setStatus("Mode: Default");
