param(
  [string]$RepoRoot
)

$ErrorActionPreference = 'Stop'

if (-not $RepoRoot) {
  $RepoRoot = Split-Path -Parent $PSScriptRoot
}

Set-Location $RepoRoot

function GitOut {
  param([string[]]$GitArgs)

  if (-not $GitArgs -or $GitArgs.Count -eq 0) {
    return @()
  }

  $result = & git @GitArgs 2>$null
  if ($LASTEXITCODE -ne 0) {
    return @()
  }

  if ($null -eq $result) {
    return @()
  }

  return @($result)
}

function SingleGit {
  param([string[]]$GitArgs, [string]$Fallback = 'N/A')
  $result = GitOut -GitArgs $GitArgs
  if (-not $result -or $result.Count -eq 0) { return $Fallback }
  return ($result -join "`n").Trim()
}

$generatedAt = Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz'
$isRepo = SingleGit -GitArgs @('rev-parse', '--is-inside-work-tree') -Fallback 'false'

$branch = 'unknown'
$lastCommit = 'N/A'
$latestTag = 'none'
$recentCommits = @()
$statusLines = @()
$tags = @()

if ($isRepo -eq 'true') {
  $branch = SingleGit -GitArgs @('rev-parse', '--abbrev-ref', 'HEAD') -Fallback 'unknown'
  $lastCommit = SingleGit -GitArgs @('rev-parse', '--short', 'HEAD') -Fallback 'N/A'
  $latestTag = SingleGit -GitArgs @('describe', '--tags', '--abbrev=0') -Fallback 'none'
  $statusLines = GitOut -GitArgs @('status', '--short')

  $recentCommitsRaw = GitOut -GitArgs @('log', '--pretty=format:%h|%ad|%s', '--date=short', '-n', '8')
  foreach ($entry in $recentCommitsRaw) {
    $parts = $entry -split '\|', 3
    if ($parts.Count -eq 3) {
      $recentCommits += [pscustomobject]@{
        Hash = $parts[0]
        Date = $parts[1]
        Message = $parts[2]
      }
    }
  }

  $tags = GitOut -GitArgs @('tag', '--sort=-creatordate')
  if ($tags.Count -gt 5) {
    $tags = $tags[0..4]
  }
}

$staged = 0
$unstaged = 0
$untracked = 0
foreach ($line in $statusLines) {
  if ($line.StartsWith('??')) {
    $untracked++
    continue
  }

  $indexFlag = $line.Substring(0, 1)
  $workFlag = $line.Substring(1, 1)
  if ($indexFlag -ne ' ') { $staged++ }
  if ($workFlag -ne ' ') { $unstaged++ }
}

$wpRows = @()
$planPath = Join-Path $RepoRoot 'latex\sdlc\02_project_plan.tex'
if (Test-Path $planPath) {
  $planLines = Get-Content $planPath
  foreach ($line in $planLines) {
    if ($line -match '^\s*(WP-\d+)\s*&\s*(.*?)\s*&\s*(.*?)\s*&\s*(.*?)\s*\\\\') {
      $wpRows += [pscustomobject]@{
        Id = $matches[1]
        Task = $matches[2]
        Owner = $matches[3]
        Status = $matches[4]
      }
    }
  }
}

$completedCount = @($wpRows | Where-Object { $_.Status -match '(?i)completed' }).Count
$inProgressCount = @($wpRows | Where-Object { $_.Status -match '(?i)progress' }).Count
$plannedCount = @($wpRows | Where-Object { $_.Status -match '(?i)planned' }).Count

$nextFocus = 'No pending work package found.'
$focusCandidate = $wpRows | Where-Object { $_.Status -match '(?i)progress|planned' } | Select-Object -First 1
if ($focusCandidate) {
  $nextFocus = "$($focusCandidate.Id) - $($focusCandidate.Task)"
}

$reqPath = Join-Path $RepoRoot 'latex\sdlc\04_srs.tex'
$frCount = 0
$nfrCount = 0
if (Test-Path $reqPath) {
  $reqLines = Get-Content $reqPath
  $frCount = @($reqLines | Where-Object { $_ -match '^FR-\d+\s*&' }).Count
  $nfrCount = @($reqLines | Where-Object { $_ -match '^NFR-\d+\s*&' }).Count
}

$lines = New-Object System.Collections.Generic.List[string]
$lines.Add('# Task Tracker')
$lines.Add('')
$lines.Add('This file is auto-generated from project activity and SDLC sources.')
$lines.Add('Do not edit manually. Run `scripts/update-task-tracker.ps1` to refresh.')
$lines.Add('')
$lines.Add('## Snapshot')
$lines.Add('')
$lines.Add("- Generated: $generatedAt")
$lines.Add("- Branch: $branch")
$lines.Add("- Last commit: $lastCommit")
$lines.Add("- Latest release tag: $latestTag")
$lines.Add("- Requirements locked count: FR=$frCount, NFR=$nfrCount")
$lines.Add('')
$lines.Add('## Work Package Summary')
$lines.Add('')
$lines.Add("- Completed: $completedCount")
$lines.Add("- In Progress: $inProgressCount")
$lines.Add("- Planned: $plannedCount")
$lines.Add("- Next Focus: $nextFocus")
$lines.Add('')
$lines.Add('| ID | Task | Owner | Status |')
$lines.Add('|---|---|---|---|')
if ($wpRows.Count -eq 0) {
  $lines.Add('| N/A | No work packages parsed | N/A | N/A |')
} else {
  foreach ($row in $wpRows) {
    $safeTask = $row.Task -replace '\|', '/'
    $safeStatus = $row.Status -replace '\|', '/'
    $lines.Add("| $($row.Id) | $safeTask | $($row.Owner) | $safeStatus |")
  }
}
$lines.Add('')
$lines.Add('## Git Working Tree')
$lines.Add('')
$lines.Add("- Staged changes: $staged")
$lines.Add("- Unstaged changes: $unstaged")
$lines.Add("- Untracked files: $untracked")
$lines.Add('')
$lines.Add('## Recent Commits')
$lines.Add('')
$lines.Add('| Commit | Date | Message |')
$lines.Add('|---|---|---|')
if ($recentCommits.Count -eq 0) {
  $lines.Add('| N/A | N/A | No commits found |')
} else {
  foreach ($commit in $recentCommits) {
    $safeMessage = $commit.Message -replace '\|', '/'
    $lines.Add("| $($commit.Hash) | $($commit.Date) | $safeMessage |")
  }
}
$lines.Add('')
$lines.Add('## Release Tags')
$lines.Add('')
if ($tags -and $tags.Count -gt 0) {
  foreach ($tag in $tags) {
    $lines.Add("- $tag")
  }
} else {
  $lines.Add('- none')
}
$lines.Add('')
$lines.Add('## Auto-Update')
$lines.Add('')
$lines.Add('- Hook path: `.githooks/pre-commit`')
$lines.Add('- Manual refresh: `powershell -ExecutionPolicy Bypass -File scripts/update-task-tracker.ps1`')

$lines | Set-Content -Path (Join-Path $RepoRoot 'TASK_TRACKER.md') -Encoding UTF8
Write-Host 'TASK_TRACKER.md updated.'
