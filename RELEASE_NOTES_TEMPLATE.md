# Release Notes Template

Use this template for each new release. Prefer generating a new file with:

`powershell -NoProfile -ExecutionPolicy Bypass -File scripts/new-release-notes.ps1 -Version 1.2.0`

---

# Aurora Release Notes - {{TAG}}

## Release Metadata
- Version: {{VERSION}}
- Tag: {{TAG}}
- Release Date: {{RELEASE_DATE}}
- Release Owner: {{RELEASE_OWNER}}
- Release Commit: {{RELEASE_COMMIT}}

## Summary
{{SUMMARY}}

## Highlights
- {{HIGHLIGHT_1}}
- {{HIGHLIGHT_2}}
- {{HIGHLIGHT_3}}

## Added
- {{ADDED_1}}
- {{ADDED_2}}

## Changed
- {{CHANGED_1}}
- {{CHANGED_2}}

## Fixed
- {{FIXED_1}}
- {{FIXED_2}}

## Quality and Validation
- Test Coverage: {{TEST_COVERAGE}}
- Accessibility Check: {{ACCESSIBILITY_RESULT}}
- Performance Check: {{PERFORMANCE_RESULT}}
- Runtime Error Check: {{RUNTIME_RESULT}}

## Known Limitations
- {{LIMITATION_1}}
- {{LIMITATION_2}}

## Rollback
- Previous Stable Tag: {{ROLLBACK_TAG}}
- Rollback Procedure: {{ROLLBACK_PROCEDURE}}

## References
- RTM: `latex/sdlc/08_rtm.tex`
- Test Cases: `latex/sdlc/07_test_cases.tex`
- Release Plan: `latex/sdlc/09_release_deployment_plan.tex`
