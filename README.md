# Aurora Interactive Website

Aurora is a frontend-only interactive website where users press one button to switch the page into a night sky and trigger a northern-lights experience.

## Current Status
- Baseline release published: `v1.1.0` (2026-02-18).
- Requirements locked: `FR-01..FR-06`, `NFR-01..NFR-04`.
- Baseline validation complete: `TC-01..TC-10` passed.
- v1.2 work in progress: realistic aurora update with video-first playback, canvas fallback, and interactive motion effects.

## Features
- One-click activation for night mode.
- Aurora experience in active mode:
  - Video-first rendering (`assets/aurora-loop.webm`/`.mp4`).
  - Automatic fallback to canvas renderer (`aurora.js`) if video is unavailable.
- Interactive animations:
  - Pointer-based scene parallax and cursor glow.
  - Button micro-interactions (tilt + ripple feedback).
- Keyboard activation support (`Enter` / `Space`).
- Reduced-motion behavior (`prefers-reduced-motion`).
- Responsive layout for desktop and mobile.

## Tech Stack
- HTML5
- CSS3
- Vanilla JavaScript (ES Modules)
- LaTeX (for SDLC documentation)
- PlantUML source + generated UML PNG assets
- Python script (`scripts/generate-aurora-video.py`) to generate loop assets

## Quick Start
### 1. Open the project
```powershell
code .
```

### 2. Run the website
Option A (direct open):
- Open `index.html` in a browser.

Option B (recommended local server):
```powershell
python -m http.server 5500
```
Then open `http://localhost:5500`.

## Generate Aurora Video Assets
If you want to regenerate the bundled aurora loops:

```powershell
python scripts/generate-aurora-video.py
```

Expected outputs:
- `assets/aurora-loop.webm`
- `assets/aurora-loop.mp4`

## Project Structure
```text
.
|-- index.html
|-- styles.css
|-- app.js
|-- aurora.js
|-- assets/
|   |-- aurora-loop.webm
|   |-- aurora-loop.mp4
|   `-- README.md
|-- scripts/
|   |-- generate-aurora-video.py
|   `-- update-task-tracker.ps1
|-- AGENTS.md
|-- SKILLS.md
|-- TASK_TRACKER.md
|-- latex/
|   `-- sdlc/
|       |-- 01_project_charter.tex
|       |-- 02_project_plan.tex
|       |-- 03_prd.tex
|       |-- 04_srs.tex
|       |-- 05_sds.tex
|       |-- 06_test_plan.tex
|       |-- 07_test_cases.tex
|       |-- 08_rtm.tex
|       |-- 09_release_deployment_plan.tex
|       |-- 10_operations_maintenance_plan.tex
|       |-- 11_post_implementation_review.tex
|       |-- 12_v1_2_backlog.tex
|       `-- uml/
|           |-- *.puml
|           |-- *.png
|           `-- render-uml.ps1
`-- .gitignore
```

## SDLC Documents
All SDLC documents are in `latex/sdlc/` and follow chronological order:
1. Project Charter
2. Project Plan
3. PRD
4. SRS
5. SDS
6. Test Plan
7. Test Cases
8. RTM
9. Release and Deployment Plan
10. Operations and Maintenance Plan
11. Post-Implementation Review
12. v1.2 Backlog and Target Definition

## UML Workflow
UML source files are maintained as `.puml` files in `latex/sdlc/uml/`.

Regenerate diagram images:
```powershell
.\latex\sdlc\uml\render-uml.ps1
```

Then rebuild LaTeX documents via VS Code LaTeX Workshop.

## Accessibility and Performance Notes
- Keyboard interaction is supported for primary activation.
- Reduced-motion mode is respected.
- Runtime prefers lightweight media playback and falls back to canvas rendering.
- Interactive visual effects are designed to degrade safely when reduced motion is enabled.

## License
No license file has been added yet.
