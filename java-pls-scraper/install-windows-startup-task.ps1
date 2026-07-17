param(
  [string]$TaskName = "PLS Java Scraper 1981-1990",
  [string]$ProjectDir = $PSScriptRoot,
  [string]$Launcher = "run-pls-1981-1990.bat"
)

$ErrorActionPreference = "Stop"
$bat = Join-Path $ProjectDir $Launcher
if (-not (Test-Path $bat)) {
  throw "Launcher not found: $bat"
}

$action = New-ScheduledTaskAction -Execute $bat -WorkingDirectory $ProjectDir
$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -StartWhenAvailable `
  -RestartCount 999 `
  -RestartInterval (New-TimeSpan -Minutes 5)

Register-ScheduledTask `
  -TaskName $TaskName `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Description "Runs the production Java PakistanLawSite scraper and resumes from PostgreSQL checkpoints." `
  -Force

Write-Output "Installed scheduled task: $TaskName"
