# AGENTS.md

## Project Context
- Project: Aurora Interactive Website
- Primary goal: Build an animated website where a user clicks a button to switch into a night-sky background and play a northern-lights animation.
- Secondary goal: Maintain complete SDLC documentation in LaTeX.

## Current Status
- Requirements locked: `FR-01..FR-06`, `NFR-01..NFR-04`.
- Baseline release published: `v1.1.0` (2026-02-18).
- Baseline test evidence:
  - `TC-01` to `TC-10`: Pass (`v1.1.0`).
- v1.2 realism/interaction update (current implementation state):
  - Video-first aurora playback implemented with canvas fallback.
  - Interaction layer implemented (pointer parallax, cursor glow, button tilt/ripple).
  - Backlog items `B-01`, `B-02`, `B-03`, and `B-05` implemented; validation pending.

## Source of Truth
- SDLC documents: `latex/sdlc/`
- Frontend code:
  - `index.html`
  - `styles.css`
  - `app.js`
  - `aurora.js`
  - `assets/aurora-loop.webm`
  - `assets/aurora-loop.mp4`
  - `scripts/generate-aurora-video.py`
- Task tracking:
  - `TASK_TRACKER.md` (auto-generated)
  - `scripts/update-task-tracker.ps1`
  - `.githooks/pre-commit`

## SDLC Document Order
1. `latex/sdlc/01_project_charter.tex`
2. `latex/sdlc/02_project_plan.tex`
3. `latex/sdlc/03_prd.tex`
4. `latex/sdlc/04_srs.tex`
5. `latex/sdlc/05_sds.tex`
6. `latex/sdlc/06_test_plan.tex`
7. `latex/sdlc/07_test_cases.tex`
8. `latex/sdlc/08_rtm.tex`
9. `latex/sdlc/09_release_deployment_plan.tex`
10. `latex/sdlc/10_operations_maintenance_plan.tex`
11. `latex/sdlc/11_post_implementation_review.tex`
12. `latex/sdlc/12_v1_2_backlog.tex`

## Project Constraints
- Build as a frontend-first website (no required backend for MVP).
- Keep implementation simple and maintainable.
- Prefer minimal dependencies unless a library is clearly justified.
- Support modern browsers: Chrome, Edge, Firefox.

## Functional Baseline
- Provide a visible primary action button.
- On click, transition page background to a night-sky scene.
- Trigger aurora experience in active mode (video-first with canvas fallback).
- Provide lightweight interactive feedback (pointer parallax + button micro-animations) when motion preferences allow.
- Keep behavior responsive on desktop and mobile.

## Non-Functional Baseline
- Accessibility:
  - Button must be keyboard accessible.
  - Maintain visible focus states.
  - Support reduced-motion behavior.
- Performance:
  - Start transition quickly after click.
  - Keep runtime lightweight (prefer media/canvas over heavy runtime libraries).
- Quality:
  - Keep code modular and readable.
  - Add concise comments only when logic is non-obvious.

## Working Rules for Codex
- Before major implementation changes, align updates with SDLC docs.
- If requirements or behavior change, update affected docs in `latex/sdlc/` in the same task.
- Do not delete/rename SDLC files unless explicitly requested.
- Keep generated build artifacts out of versioned source, except intentional runtime assets.
- Do not edit `TASK_TRACKER.md` manually.
- After meaningful activity, refresh task tracker:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/update-task-tracker.ps1`
- Commit workflow:
  - After each significant adjustment, prepare a commit checkpoint.
  - Show changed files and a proposed commit message.
  - Wait for explicit user confirmation before running `git commit`.

## Definition of Done (MVP)
- Night mode and aurora animation are implemented and trigger correctly.
- Works on desktop and mobile layouts.
- Basic accessibility checks pass.
- Required test evidence recorded in `07_test_cases.tex` and `08_rtm.tex`.
- SDLC artifacts are synchronized with implementation.
