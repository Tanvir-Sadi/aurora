import math
from pathlib import Path

import imageio.v2 as imageio
import numpy as np


def build_frame(width: int, height: int, t: float) -> np.ndarray:
    x = np.linspace(0.0, 1.0, width, dtype=np.float32)
    y = np.linspace(0.0, 1.0, height, dtype=np.float32)[:, None]

    frame = np.zeros((height, width, 3), dtype=np.float32)

    # Near-black sky base with slight cyan tilt.
    bg_top = np.array([0.005, 0.013, 0.02], dtype=np.float32)
    bg_bottom = np.array([0.0, 0.003, 0.007], dtype=np.float32)
    frame += (bg_top * (1.0 - y) + bg_bottom * y)[:, None, :]

    # Atmospheric haze for depth.
    hx = 0.5 + 0.26 * math.sin(t * 0.07)
    hy = 0.18 + 0.04 * math.cos(t * 0.09)
    xx = np.repeat(x[None, :], height, axis=0)
    yy = np.repeat(y, width, axis=1)
    r2 = ((xx - hx) / 0.95) ** 2 + ((yy - hy) / 0.62) ** 2
    haze = np.exp(-r2 * 4.0).astype(np.float32)
    frame += haze[..., None] * np.array([0.0, 0.07, 0.08], dtype=np.float32)

    # Layer palette tuned for realistic aurora (green/cyan dominant).
    layers = [
        {
            "base": 0.15,
            "amp": 0.06,
            "freq": 8.8,
            "freq2": 17.0,
            "speed": 0.34,
            "shear": 0.22,
            "thick": 0.022,
            "tail": 0.17,
            "alpha": 0.65,
            "color": np.array([0.10, 0.94, 0.67], dtype=np.float32),
        },
        {
            "base": 0.23,
            "amp": 0.08,
            "freq": 7.2,
            "freq2": 14.4,
            "speed": 0.27,
            "shear": 0.18,
            "thick": 0.03,
            "tail": 0.2,
            "alpha": 0.5,
            "color": np.array([0.08, 0.78, 0.82], dtype=np.float32),
        },
        {
            "base": 0.11,
            "amp": 0.05,
            "freq": 10.1,
            "freq2": 21.4,
            "speed": 0.39,
            "shear": 0.28,
            "thick": 0.018,
            "tail": 0.14,
            "alpha": 0.42,
            "color": np.array([0.2, 0.88, 0.72], dtype=np.float32),
        },
    ]

    for i, layer in enumerate(layers):
        phase = 1.7 * i + t * layer["speed"]
        center = (
            layer["base"]
            + layer["amp"] * np.sin(x * layer["freq"] * math.pi + phase)
            + layer["amp"] * 0.55 * np.sin(x * layer["freq2"] * math.pi - phase * 0.72)
            + (x - 0.5) * layer["shear"]
        )

        thickness = layer["thick"] * (
            0.72
            + 0.45 * (np.sin(x * (11.0 + i * 2.1) * math.pi + phase * 1.2) * 0.5 + 0.5)
            + 0.24 * (np.sin(x * (31.0 + i * 3.0) * math.pi - phase * 1.8) * 0.5 + 0.5)
        )

        dy = y - center[None, :]

        crest = np.exp(-((dy / (thickness[None, :] + 1e-6)) ** 2) * 0.85)
        tail = np.exp(-np.maximum(dy, 0.0) / (layer["tail"] + thickness[None, :] * 3.2)) * (dy > 0)

        wisp = 0.58 + 0.42 * np.sin(
            x[None, :] * (42.0 + i * 6.0)
            + t * (0.9 + i * 0.2)
            + np.sin(x[None, :] * (9.0 + i * 1.5) - t * 0.4)
        )
        wisp = np.clip(wisp, 0.1, 1.0)

        curtain = np.maximum(crest * 1.08, tail * 0.9) * wisp
        curtain *= layer["alpha"]

        highlight = np.exp(-((dy / (thickness[None, :] * 0.6 + 1e-6)) ** 2) * 1.5) * (0.32 + 0.12 * np.sin(t * 0.5 + i))

        frame += curtain[..., None] * layer["color"][None, None, :]
        frame += highlight[..., None] * np.array([0.05, 0.16, 0.12], dtype=np.float32)[None, None, :]

    # Gentle vignette and tone map for cinematic feel.
    vignette = 1.0 - np.clip(((xx - 0.5) ** 2 + (yy - 0.46) ** 2) * 1.7, 0.0, 0.35)
    frame *= vignette[..., None]

    frame = 1.0 - np.exp(-frame * 1.95)
    frame = np.clip(frame, 0.0, 1.0) ** 0.92

    return (frame * 255.0).astype(np.uint8)


def main() -> None:
    out_dir = Path("assets")
    out_dir.mkdir(parents=True, exist_ok=True)

    width, height = 1280, 720
    fps = 24
    seconds = 14
    total_frames = fps * seconds

    mp4_path = out_dir / "aurora-loop.mp4"
    webm_path = out_dir / "aurora-loop.webm"

    mp4_writer = imageio.get_writer(
        str(mp4_path),
        fps=fps,
        codec="libx264",
        quality=8,
        pixelformat="yuv420p",
        ffmpeg_log_level="error",
    )

    # VP9 is lightweight for web delivery and loops well.
    webm_writer = imageio.get_writer(
        str(webm_path),
        fps=fps,
        codec="libvpx-vp9",
        quality=8,
        ffmpeg_log_level="error",
    )

    try:
        for frame_index in range(total_frames):
            t = frame_index / fps
            frame = build_frame(width, height, t)
            mp4_writer.append_data(frame)
            webm_writer.append_data(frame)

            if frame_index % 24 == 0:
                print(f"Rendered {frame_index}/{total_frames}")
    finally:
        mp4_writer.close()
        webm_writer.close()

    print(f"Generated: {mp4_path}")
    print(f"Generated: {webm_path}")


if __name__ == "__main__":
    main()
