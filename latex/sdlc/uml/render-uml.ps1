param(
  [string]$UmlDir = (Join-Path $PSScriptRoot '.')
)

$ErrorActionPreference = 'Stop'
$pumlFiles = Get-ChildItem -Path $UmlDir -Filter '*.puml' -File

if (-not $pumlFiles) {
  Write-Host 'No .puml files found.'
  exit 0
}

foreach ($file in $pumlFiles) {
  $src = Get-Content $file.FullName -Raw
  $out = [System.IO.Path]::ChangeExtension($file.FullName, '.png')
  Invoke-WebRequest -Uri 'https://kroki.io/plantuml/png' -Method Post -ContentType 'text/plain' -Body $src -OutFile $out
  Write-Host "Rendered $($file.Name) -> $([System.IO.Path]::GetFileName($out))"
}
