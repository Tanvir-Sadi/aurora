export class AuroraAnimator {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas?.getContext("2d", { alpha: true });
    this.reducedMotion = Boolean(options.reducedMotion);
    this.running = false;
    this.rafId = null;
    this.startTime = 0;

    this.resize = this.resize.bind(this);
    this.renderFrame = this.renderFrame.bind(this);

    window.addEventListener("resize", this.resize);
    this.resize();
  }

  setReducedMotion(enabled) {
    this.reducedMotion = Boolean(enabled);
  }

  start() {
    if (!this.ctx || this.running) {
      return;
    }

    this.running = true;
    this.startTime = performance.now();
    this.rafId = requestAnimationFrame(this.renderFrame);
  }

  stop() {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  resize() {
    if (!this.canvas || !this.ctx) {
      return;
    }

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
  }

  renderBand(width, height, timeSeconds, bandIndex, count) {
    const ctx = this.ctx;
    const horizon = height * (0.26 + bandIndex * 0.1);
    const amplitude = this.reducedMotion ? 18 : 36;
    const frequency = 0.008 + bandIndex * 0.002;
    const phase = timeSeconds * (this.reducedMotion ? 0.28 : 0.75) + bandIndex * 1.35;

    const colorTop = ["rgba(82,255,209,0.35)", "rgba(86,209,255,0.28)", "rgba(148,255,199,0.24)", "rgba(72,255,160,0.22)"][bandIndex % 4];
    const colorBottom = "rgba(0,0,0,0)";

    ctx.beginPath();
    ctx.moveTo(0, horizon);

    const step = this.reducedMotion ? 26 : 16;
    for (let x = 0; x <= width + step; x += step) {
      const waveA = Math.sin(x * frequency + phase) * amplitude;
      const waveB = Math.sin(x * (frequency * 0.44) + phase * 0.75) * (amplitude * 0.55);
      const y = horizon + waveA + waveB;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, horizon - amplitude * 2, 0, height);
    gradient.addColorStop(0, colorTop);
    gradient.addColorStop(1, colorBottom);

    ctx.fillStyle = gradient;
    ctx.fill();

    if (!this.reducedMotion) {
      ctx.save();
      ctx.globalAlpha = 0.38 - bandIndex * 0.05;
      ctx.filter = "blur(22px)";
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    }
  }

  renderFrame(now) {
    if (!this.running || !this.ctx) {
      return;
    }

    const ctx = this.ctx;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const timeSeconds = (now - this.startTime) / 1000;

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    const bands = this.reducedMotion ? 2 : 4;
    for (let i = 0; i < bands; i += 1) {
      this.renderBand(width, height, timeSeconds, i, bands);
    }

    ctx.globalCompositeOperation = "source-over";
    this.rafId = requestAnimationFrame(this.renderFrame);
  }
}
