# AGENTS.md

## Project Context
- Project: Aurora Interactive Website
- Primary goal: Build an animated website where a user clicks a button to switch into a night-sky background and play a northern-lights animation.
- Secondary goal: Maintain complete SDLC documentation in LaTeX.

## Current Source of Truth
- SDLC documents live in `latex/sdlc/`.
- Chronological order:
1. `01_project_charter.tex`
2. `02_project_plan.tex`
3. `03_prd.tex`
4. `04_srs.tex`
5. `05_sds.tex`
6. `06_test_plan.tex`
7. `07_test_cases.tex`
8. `08_rtm.tex`
9. `09_release_deployment_plan.tex`
10. `10_operations_maintenance_plan.tex`
11. `11_post_implementation_review.tex`

## Project Constraints
- Build as a frontend-first website (no required backend for MVP).
- Keep implementation simple and maintainable.
- Prefer minimal dependencies unless a library is clearly justified.
- Support modern browsers: Chrome, Edge, Firefox.

## Functional Baseline
- Provide a visible primary action button.
- On click, transition page background to a night-sky scene.
- Trigger and render aurora animation with smooth motion.
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
  - Add concise comments only where logic is non-obvious.

## Working Rules for Codex
- Before major implementation changes, align updates with SDLC docs.
- If requirements change, update affected docs in `latex/sdlc/` first or in the same task.
- Avoid deleting or renaming SDLC files unless explicitly requested.
- Keep generated build artifacts out of versioned source when possible.

## Definition of Done (MVP)
- Night mode and aurora animation are implemented and trigger correctly.
- Works on desktop and mobile layouts.
- Basic accessibility checks pass.
- Relevant SDLC docs reflect implemented behavior.
