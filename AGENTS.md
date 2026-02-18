# AGENTS.md

## Project Context
- Project: Aurora Interactive Website
- Primary goal: Build an animated website where a user clicks a button to switch into a night-sky background and play a northern-lights animation.
- Secondary goal: Maintain complete SDLC documentation in LaTeX.

## Current Status
- Requirements locked: `FR-01..FR-06`, `NFR-01..NFR-04`.
- Sprint 1 implementation started.
- Current test evidence:
  - `TC-01`: Pass
  - `TC-02`: Pass
  - Remaining test cases: Pending
- First release tag published: `v1.0.0`.

## Source of Truth
- SDLC documents: `latex/sdlc/`
- Frontend code:
  - `index.html`
  - `styles.css`
  - `app.js`
  - `aurora.js`
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

## Project Constraints
- Build as a frontend-first website (no required backend for MVP).
- Keep implementation simple and maintainable.
- Prefer minimal dependencies unless a library is clearly justified.
- Support modern browsers: Chrome, Edge, Firefox.

## Functional Baseline
- Provide a visible primary action button.
- On click, transition page background to a night-sky scene.
- Trigger and render aurora animation.
- Keep behavior responsive on desktop and mobile.

## Non-Functional Baseline
- Accessibility:
  - Button must be keyboard accessible.
  - Maintain visible focus states.
  - Support reduced-motion behavior.
- Performance:
  - Start transition quickly after click.
  - Avoid heavy effects that degrade low-end devices.
- Quality:
  - Keep code modular and readable.
  - Add concise comments only when logic is non-obvious.

## Working Rules for Codex
- Before major implementation changes, align updates with SDLC docs.
- If requirements or behavior change, update affected docs in `latex/sdlc/` in the same task.
- Do not delete/rename SDLC files unless explicitly requested.
- Keep generated build artifacts out of versioned source.
- Do not edit `TASK_TRACKER.md` manually.
- After meaningful activity, refresh task tracker:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/update-task-tracker.ps1`

## Definition of Done (MVP)
- Night mode and aurora animation are implemented and trigger correctly.
- Works on desktop and mobile layouts.
- Basic accessibility checks pass.
- Required test evidence recorded in `07_test_cases.tex` and `08_rtm.tex`.
- SDLC artifacts are synchronized with implementation.
