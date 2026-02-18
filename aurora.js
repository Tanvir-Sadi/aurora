export class AuroraAnimator {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas?.getContext("2d", { alpha: true });
    this.reducedMotion = Boolean(options.reducedMotion);
    this.running = false;
    this.rafId = null;
    this.startTime = 0;
    this.seed = Math.random() * 1000;
    this.interaction = { x: 0, y: 0 };

    this.resize = this.resize.bind(this);
    this.renderFrame = this.renderFrame.bind(this);

    window.addEventListener("resize", this.resize);
    this.resize();
  }

  setReducedMotion(enabled) {
    this.reducedMotion = Boolean(enabled);
  }

  setInteraction(x = 0, y = 0) {
    this.interaction.x = this.clamp(Number(x) || 0, -1, 1);
    this.interaction.y = this.clamp(Number(y) || 0, -1, 1);
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

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  hash1D(value) {
    const raw = Math.sin(value * 127.1 + this.seed * 311.7) * 43758.5453123;
    return raw - Math.floor(raw);
  }

  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  valueNoise1D(x) {
    const x0 = Math.floor(x);
    const tx = x - x0;
    const v0 = this.hash1D(x0);
    const v1 = this.hash1D(x0 + 1);

    return this.lerp(v0, v1, this.smoothstep(tx));
  }

  fbm1D(x, octaves = 4) {
    let value = 0;
    let amplitude = 0.5;
    let frequency = 1;
    let normalization = 0;

    for (let i = 0; i < octaves; i += 1) {
      value += this.valueNoise1D(x * frequency) * amplitude;
      normalization += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }

    return normalization > 0 ? value / normalization : 0;
  }

  normalizeHue(hue) {
    return ((hue % 360) + 360) % 360;
  }

  drawAtmosphericHaze(width, height, timeSeconds) {
    const ctx = this.ctx;
    const driftInfluenceX = this.interaction.x * width * 0.08;
    const driftInfluenceY = this.interaction.y * height * 0.04;

    // Dark base so aurora streaks appear on near-black sky.
    ctx.fillStyle = "rgba(2, 6, 12, 0.35)";
    ctx.fillRect(0, 0, width, height);

    const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, "rgba(7, 16, 26, 0.28)");
    skyGradient.addColorStop(0.42, "rgba(5, 12, 18, 0.12)");
    skyGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height);

    const driftX = width * (0.2 + Math.sin(timeSeconds * 0.04) * 0.08) + driftInfluenceX;
    const driftY = height * (0.18 + Math.cos(timeSeconds * 0.05) * 0.04) + driftInfluenceY;
    const glowRadius = Math.max(width, height) * 0.78;

    const upperGlow = ctx.createRadialGradient(driftX, driftY, 0, driftX, driftY, glowRadius);
    upperGlow.addColorStop(0, "rgba(44, 132, 122, 0.10)");
    upperGlow.addColorStop(0.52, "rgba(20, 72, 88, 0.07)");
    upperGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = upperGlow;
    ctx.fillRect(0, 0, width, height);
  }

  drawCurtainLayer(width, height, timeSeconds, layerIndex, layerCount) {
    const ctx = this.ctx;
    const depth = layerCount <= 1 ? 0 : layerIndex / (layerCount - 1);
    const layerDistance = 1 - depth;

    const reactiveYOffset = this.interaction.y * (this.reducedMotion ? 4 : 14) * (0.8 + layerDistance * 0.45);
    const baseY = height * (0.08 + depth * 0.13) + reactiveYOffset;
    const amplitude = (this.reducedMotion ? 8 : 18) * (0.72 + layerDistance * 0.9);
    const speed = (this.reducedMotion ? 0.08 : 0.23) * (0.72 + layerDistance * 0.52);
    const step = this.reducedMotion ? 20 : 11;
    const veilBase = (this.reducedMotion ? 70 : 170) * (0.62 + layerDistance * 0.82);

    const slantBase = (layerIndex % 2 === 0 ? 0.2 : 0.13) * (0.64 + layerDistance * 0.65);
    const slantDrift = Math.sin(timeSeconds * 0.09 + layerIndex * 0.7) * 0.05 + this.interaction.x * 0.05;
    const slant = slantBase + slantDrift;

    const topPoints = [];
    const bottomPoints = [];
    let minTop = Number.POSITIVE_INFINITY;
    let maxBottom = 0;

    for (let x = -step; x <= width + step; x += step) {
      const nx = x * 0.0105 + layerIndex * 29.7;
      const drift = timeSeconds * speed;

      const nA = this.fbm1D(nx + drift, 4);
      const nB = this.fbm1D(nx * 0.48 - drift * 0.7 + 21.3, 3);
      const wave = Math.sin(x * 0.0051 + drift * 2.4 + layerIndex * 1.1);

      const yOffset = (nA - 0.5) * amplitude * 2.2 + (nB - 0.5) * amplitude * 1.1 + wave * amplitude * 0.42;
      const yTop = baseY + yOffset;

      const veilNoise = this.fbm1D(nx * 0.92 + 73.8 + drift * 0.55, 3);
      const tailNoise = this.fbm1D(nx * 0.28 + 139.1 - drift * 0.28, 2);
      const veilLength = veilBase * (0.5 + veilNoise * 0.95) + tailNoise * 24;

      const xBottom = this.clamp(
        x + veilLength * slant + (nB - 0.5) * 14 * layerDistance,
        -width * 0.2,
        width * 1.2
      );
      const yBottom = Math.min(height, yTop + veilLength + depth * 30);

      topPoints.push({ x, y: yTop });
      bottomPoints.push({ x: xBottom, y: yBottom });

      if (yTop < minTop) {
        minTop = yTop;
      }
      if (yBottom > maxBottom) {
        maxBottom = yBottom;
      }
    }

    if (!Number.isFinite(minTop) || maxBottom <= minTop) {
      return;
    }

    const baseHues = [164, 172, 184, 156, 168];
    const hueDrift = Math.sin(timeSeconds * 0.15 + layerIndex * 0.85) * 7;
    const hue = this.normalizeHue(baseHues[layerIndex % baseHues.length] + hueDrift);

    const sat = 82 - depth * 14;
    const topLight = 64 - depth * 11;
    const alphaTop = (this.reducedMotion ? 0.24 : 0.34) - depth * 0.07;

    const gradient = ctx.createLinearGradient(0, minTop - 20, 0, maxBottom + 20);
    gradient.addColorStop(0, `hsla(${hue}, ${sat}%, ${topLight}%, ${Math.max(0.08, alphaTop)})`);
    gradient.addColorStop(0.22, `hsla(${this.normalizeHue(hue + 10)}, ${sat - 6}%, ${Math.max(38, topLight - 8)}%, ${Math.max(0.06, alphaTop * 0.95)})`);
    gradient.addColorStop(0.58, `hsla(${this.normalizeHue(hue - 16)}, ${Math.max(28, sat - 22)}%, ${Math.max(26, topLight - 28)}%, ${Math.max(0.04, alphaTop * 0.55)})`);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.beginPath();
    ctx.moveTo(topPoints[0].x, topPoints[0].y);
    for (let i = 1; i < topPoints.length; i += 1) {
      ctx.lineTo(topPoints[i].x, topPoints[i].y);
    }
    for (let i = bottomPoints.length - 1; i >= 0; i -= 1) {
      ctx.lineTo(bottomPoints[i].x, bottomPoints[i].y);
    }
    ctx.closePath();

    ctx.fillStyle = gradient;
    ctx.fill();

    if (!this.reducedMotion && layerIndex < 3) {
      ctx.save();
      ctx.globalAlpha = 0.15 - depth * 0.03;
      ctx.filter = `blur(${14 + layerDistance * 10}px)`;
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();
    }

    // Vertical veil fibers inside each curtain to create realistic wispy streaking.
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    const stride = this.reducedMotion ? 5 : 3;

    for (let i = 0; i < topPoints.length; i += stride) {
      const top = topPoints[i];
      const bottom = bottomPoints[i];
      if (!top || !bottom) {
        continue;
      }

      const fiberNoise = this.fbm1D(i * 0.34 + layerIndex * 9.1 + timeSeconds * 0.25, 2);
      if (fiberNoise < (this.reducedMotion ? 0.56 : 0.44)) {
        continue;
      }

      const fiberGradient = ctx.createLinearGradient(top.x, top.y, bottom.x, bottom.y);
      const fiberAlpha = (this.reducedMotion ? 0.16 : 0.24) * (0.7 + fiberNoise * 0.6) * (0.75 + layerDistance * 0.4);
      fiberGradient.addColorStop(0, `hsla(${this.normalizeHue(hue + 20)}, 88%, 78%, ${fiberAlpha})`);
      fiberGradient.addColorStop(0.4, `hsla(${hue}, 76%, 64%, ${fiberAlpha * 0.8})`);
      fiberGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.strokeStyle = fiberGradient;
      ctx.lineWidth = this.reducedMotion ? 0.9 : 1.2 + layerDistance * 0.55;

      ctx.beginPath();
      ctx.moveTo(top.x, top.y);
      ctx.lineTo(bottom.x, bottom.y);
      ctx.stroke();
    }

    ctx.restore();

    ctx.save();
    ctx.lineWidth = this.reducedMotion ? 0.9 : 1.4 - depth * 0.35;
    ctx.strokeStyle = `hsla(${this.normalizeHue(hue + 18)}, 90%, 72%, ${this.reducedMotion ? 0.19 : 0.3 - depth * 0.06})`;
    if (!this.reducedMotion) {
      ctx.filter = `blur(${3 + layerDistance * 4}px)`;
    }

    ctx.beginPath();
    ctx.moveTo(topPoints[0].x, topPoints[0].y);
    for (let i = 1; i < topPoints.length; i += 1) {
      ctx.lineTo(topPoints[i].x, topPoints[i].y);
    }
    ctx.stroke();
    ctx.restore();
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
    this.drawAtmosphericHaze(width, height, timeSeconds);

    ctx.globalCompositeOperation = "screen";

    const layers = this.reducedMotion ? 2 : 5;
    for (let i = 0; i < layers; i += 1) {
      this.drawCurtainLayer(width, height, timeSeconds, i, layers);
    }

    ctx.globalCompositeOperation = "source-over";
    this.rafId = requestAnimationFrame(this.renderFrame);
  }
}
