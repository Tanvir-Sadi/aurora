# SKILLS.md

This file defines practical project skills for Codex in this repository.

## Skill: sdlc-doc-maintainer
- Use when creating or updating project lifecycle documents in `latex/sdlc/`.
- Keep document order and naming intact.
- Ensure cross-document consistency:
  - Charter -> Plan -> PRD -> SRS -> SDS -> Testing -> RTM -> Release -> Operations -> PIR
- When requirements change, propagate updates to affected docs.

## Skill: aurora-ui-implementer
- Use when implementing or refining the animated website.
- Core behavior:
  - One-click activation for night mode.
  - Northern-lights animation starts on activation.
- Engineering expectations:
  - Keep responsive layout for mobile and desktop.
  - Preserve smooth transitions.
  - Prefer lightweight CSS/JS techniques.

## Skill: accessibility-and-performance-checker
- Use when validating readiness before release.
- Accessibility checks:
  - Keyboard activation and focus visibility.
  - Reduced-motion fallback.
  - Basic semantic structure.
- Performance checks:
  - Fast interaction response after click.
  - No major frame drops during animation on common devices.

## Skill: release-readiness-updater
- Use before milestone/release updates.
- Confirm these documents are updated when applicable:
  - `06_test_plan.tex`
  - `07_test_cases.tex`
  - `08_rtm.tex`
  - `09_release_deployment_plan.tex`
- Record unresolved risks and known limitations explicitly.
