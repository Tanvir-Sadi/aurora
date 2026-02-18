# Aurora Interactive Website

Aurora is a frontend-only interactive website where users press one button to switch the page into a night sky and trigger a northern-lights animation.

## Current Status
- SDLC documentation baseline completed.
- Requirements locked: `FR-01..FR-06`, `NFR-01..NFR-04`.
- Sprint 1 implementation started with vanilla HTML/CSS/JavaScript.

## Features (MVP Scope)
- One-click activation for night mode.
- Aurora animation rendered with `requestAnimationFrame`.
- Keyboard activation support (`Enter` / `Space`).
- Reduced-motion behavior (`prefers-reduced-motion`).
- Responsive layout for desktop and mobile.

## Tech Stack
- HTML5
- CSS3
- Vanilla JavaScript (ES Modules)
- LaTeX (for SDLC documentation)
- PlantUML source + generated UML PNG assets

## Quick Start
### 1. Open the project
Open the folder in VS Code:

```powershell
code .
```

### 2. Run the website
You can open `index.html` directly in a browser, or run a local static server.

Option A (direct open):
- Open `index.html` in your browser.

Option B (recommended local server):

```powershell
# Python
python -m http.server 5500
```

Then open `http://localhost:5500`.

## Project Structure
```text
.
|-- index.html
|-- styles.css
|-- app.js
|-- aurora.js
|-- AGENTS.md
|-- SKILLS.md
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
9. Release & Deployment Plan
10. Operations & Maintenance Plan
11. Post-Implementation Review

## UML Workflow
UML source files are maintained as `.puml` files in `latex/sdlc/uml/`.

Regenerate diagram images:

```powershell
.\latex\sdlc\uml\render-uml.ps1
```

After that, rebuild LaTeX documents in VS Code (LaTeX Workshop).

## Accessibility and Performance Notes
- Keyboard interaction is supported for primary activation.
- Reduced-motion mode is respected.
- Animation complexity can be tuned in `aurora.js` for performance on lower-end devices.

## Next Milestone Tasks
- Complete Sprint 1 verification (`FR-01` to `FR-03` execution evidence).
- Update `06_test_plan.tex`, `07_test_cases.tex`, `08_rtm.tex` with test results.
- Continue Sprint 2 polish and release preparation.

## License
No license file has been added yet.
