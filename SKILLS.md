# SKILLS.md

This file defines practical project skills for Codex in this repository.

## Skill: sdlc-doc-maintainer
- Use when creating or updating project lifecycle documents in `latex/sdlc/`.
- Keep document order and naming intact.
- Ensure cross-document consistency:
  - Charter -> Plan -> PRD -> SRS -> SDS -> Testing -> RTM -> Release -> Operations -> PIR -> vNext Backlog
- When requirements or implementation behavior change, update impacted docs in the same task.

## Skill: aurora-ui-implementer
- Use when implementing or refining the animated website.
- Core behavior:
  - One-click activation for night mode.
  - Northern-lights experience starts on activation.
  - Prefer video-first realism mode with resilient canvas fallback.
- Engineering expectations:
  - Keep responsive layout for mobile and desktop.
  - Preserve smooth transitions.
  - Keep runtime lightweight and dependency-minimal.

## Skill: qa-evidence-updater
- Use when test results are reported (pass/fail) and SDLC evidence must be synchronized.
- Update at minimum:
  - `latex/sdlc/06_test_plan.tex`
  - `latex/sdlc/07_test_cases.tex`
  - `latex/sdlc/08_rtm.tex`
  - `latex/sdlc/02_project_plan.tex` (WP status if needed)
- Keep requirement/test IDs aligned (`FR-*`, `NFR-*`, `TC-*`).

## Skill: task-tracker-maintainer
- Use when project activity changes and tracker should reflect current state.
- Never edit `TASK_TRACKER.md` manually.
- Run:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/update-task-tracker.ps1`
- Ensure pre-commit hook remains configured:
  - `git config --get core.hooksPath` should return `.githooks`.

## Skill: commit-checkpoint-manager
- Use after any significant adjustment.
- Create a checkpoint workflow:
  - Summarize changed files and key diffs.
  - Propose a concise commit message.
  - Wait for explicit user confirmation before running `git commit`.
- Keep commits small and logically grouped.

## Skill: release-readiness-updater
- Use before milestone/release updates.
- Confirm these documents are updated when applicable:
  - `latex/sdlc/06_test_plan.tex`
  - `latex/sdlc/07_test_cases.tex`
  - `latex/sdlc/08_rtm.tex`
  - `latex/sdlc/09_release_deployment_plan.tex`
  - `latex/sdlc/10_operations_maintenance_plan.tex`
  - `latex/sdlc/11_post_implementation_review.tex`
  - `latex/sdlc/12_v1_2_backlog.tex`
- Record unresolved risks and known limitations explicitly.
