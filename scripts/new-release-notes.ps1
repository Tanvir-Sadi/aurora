param(
  [Parameter(Mandatory = $true)]
  [string]$Version,
  [string]$Tag,
  [string]$ReleaseDate,
  [string]$ReleaseOwner = 'Tanvir Sadi',
  [string]$ReleaseCommit = 'TBD',
  [string]$OutputDir = 'releases'
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$templatePath = Join-Path $repoRoot 'RELEASE_NOTES_TEMPLATE.md'

if (-not (Test-Path $templatePath)) {
  throw "Template not found: $templatePath"
}

if (-not $Tag) {
  $Tag = "v$Version"
}

if (-not $ReleaseDate) {
  $ReleaseDate = Get-Date -Format 'yyyy-MM-dd'
}

$outputFolder = Join-Path $repoRoot $OutputDir
if (-not (Test-Path $outputFolder)) {
  New-Item -ItemType Directory -Path $outputFolder | Out-Null
}

$targetFile = Join-Path $outputFolder ("RELEASE_NOTES_{0}.md" -f $Tag)

$template = Get-Content $templatePath -Raw
$template = $template.Replace('{{VERSION}}', $Version)
$template = $template.Replace('{{TAG}}', $Tag)
$template = $template.Replace('{{RELEASE_DATE}}', $ReleaseDate)
$template = $template.Replace('{{RELEASE_OWNER}}', $ReleaseOwner)
$template = $template.Replace('{{RELEASE_COMMIT}}', $ReleaseCommit)
$template = $template.Replace('{{SUMMARY}}', 'Fill in release summary.')
$template = $template.Replace('{{HIGHLIGHT_1}}', 'Fill in highlight.')
$template = $template.Replace('{{HIGHLIGHT_2}}', 'Fill in highlight.')
$template = $template.Replace('{{HIGHLIGHT_3}}', 'Fill in highlight.')
$template = $template.Replace('{{ADDED_1}}', 'Fill in added item.')
$template = $template.Replace('{{ADDED_2}}', 'Fill in added item.')
$template = $template.Replace('{{CHANGED_1}}', 'Fill in changed item.')
$template = $template.Replace('{{CHANGED_2}}', 'Fill in changed item.')
$template = $template.Replace('{{FIXED_1}}', 'Fill in fixed item.')
$template = $template.Replace('{{FIXED_2}}', 'Fill in fixed item.')
$template = $template.Replace('{{TEST_COVERAGE}}', 'Link to executed test evidence.')
$template = $template.Replace('{{ACCESSIBILITY_RESULT}}', 'Fill in accessibility result.')
$template = $template.Replace('{{PERFORMANCE_RESULT}}', 'Fill in performance result.')
$template = $template.Replace('{{RUNTIME_RESULT}}', 'Fill in runtime error result.')
$template = $template.Replace('{{LIMITATION_1}}', 'List known limitation.')
$template = $template.Replace('{{LIMITATION_2}}', 'List known limitation.')
$template = $template.Replace('{{ROLLBACK_TAG}}', 'v1.1.0')
$template = $template.Replace('{{ROLLBACK_PROCEDURE}}', 'Repoint deployment to previous stable tag and publish rollback note.')

Set-Content -Path $targetFile -Value $template -Encoding UTF8
Write-Host "Release notes generated: $targetFile"
