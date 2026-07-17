param(
  [int]$From = 1950,
  [int]$To = 1960,
  [int]$Port = 8781,
  [int]$Workers = 5,
  [int]$Batch = 2,
  [int]$StaleMinutes = 2,
  [string]$Worklist = $null,
  [string]$Out = $null,
  [string]$State = $null,
  [string]$Failures = $null,
  [string]$Log = $null,
  [string]$OutLog = $null,
  [string]$ErrLog = $null,
  [int]$PollSeconds = 30,
  [int]$FetchRetries = 5,
  [int]$FetchTimeoutMs = 60000,
  [int]$DelayMs = 80,
  [int]$MaxEmptyAttempts = 2,
  [int]$MaxTransientAttempts = 0,
  [int]$SessionPauseSeconds = 120,
  [int]$SessionPauseThreshold = 3,
  [int]$TransientPauseSeconds = 60,
  [int]$TransientPauseThreshold = 20,
  [int]$EmptyPauseSeconds = 120,
  [int]$EmptyPauseThreshold = 25,
  [int]$EmptyPauseWindowSeconds = 60,
  [switch]$FetchHeadnotes,
  [switch]$KeepDisplayAwake,
  [switch]$SkipPostgresCompletedCheck
)

$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$DataRoot = Join-Path $RepoRoot "..\data"
if (-not (Test-Path $DataRoot)) {
  [void](New-Item -ItemType Directory -Path $DataRoot -Force)
}
$DataRoot = (Resolve-Path $DataRoot).Path
$RangeLabel = if ($From -eq $To) { "$From" } else { "${From}_${To}" }
if (-not $Worklist) { $Worklist = Join-Path $DataRoot "pls_all_courts_${RangeLabel}_worklist.json" }
if (-not $Out) { $Out = Join-Path $DataRoot "pls_${RangeLabel}_fast_capture.jsonl" }
if (-not $State) { $State = Join-Path $DataRoot "pls_${RangeLabel}_fast_capture.state.json" }
if (-not $Failures) { $Failures = Join-Path $DataRoot "pls_${RangeLabel}_fast_failures.jsonl" }
if (-not $Log) { $Log = Join-Path $DataRoot "pls_${RangeLabel}_fast_capture.log" }
if (-not $OutLog) { $OutLog = Join-Path $DataRoot "pls_${RangeLabel}_fast_capture.server.out.log" }
if (-not $ErrLog) { $ErrLog = Join-Path $DataRoot "pls_${RangeLabel}_fast_capture.server.err.log" }

Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public static class PLSKeepAwake {
  [DllImport("kernel32.dll", SetLastError = true)]
  public static extern UInt32 SetThreadExecutionState(UInt32 esFlags);
}
"@

$ES_CONTINUOUS = [UInt32]"0x80000000"
$ES_SYSTEM_REQUIRED = [UInt32]"0x00000001"
$ES_DISPLAY_REQUIRED = [UInt32]"0x00000002"
$ES_AWAYMODE_REQUIRED = [UInt32]"0x00000040"

function Enable-KeepAwake {
  $flags = $ES_CONTINUOUS -bor $ES_SYSTEM_REQUIRED -bor $ES_AWAYMODE_REQUIRED
  if ($KeepDisplayAwake) {
    $flags = $flags -bor $ES_DISPLAY_REQUIRED
  }
  [void][PLSKeepAwake]::SetThreadExecutionState($flags)
}

function Disable-KeepAwake {
  [void][PLSKeepAwake]::SetThreadExecutionState($ES_CONTINUOUS)
}

function Get-Status {
  try {
    return Invoke-RestMethod "http://127.0.0.1:$Port/status" -TimeoutSec 10
  } catch {
    return $null
  }
}

function Quote-ProcessArgument {
  param([AllowNull()][string]$Value)
  if ($null -eq $Value) {
    return '""'
  }
  if ($Value.Length -eq 0) {
    return '""'
  }
  if ($Value -notmatch '[\s"]') {
    return $Value
  }

  $result = '"'
  $slashes = 0
  foreach ($ch in $Value.ToCharArray()) {
    if ($ch -eq '\') {
      $slashes += 1
    } elseif ($ch -eq '"') {
      $result += ('\' * (($slashes * 2) + 1))
      $result += '"'
      $slashes = 0
    } else {
      if ($slashes -gt 0) {
        $result += ('\' * $slashes)
        $slashes = 0
      }
      $result += $ch
    }
  }
  if ($slashes -gt 0) {
    $result += ('\' * ($slashes * 2))
  }
  $result += '"'
  return $result
}

function Start-CaptureServer {
  $node = (Get-Command node).Source
  $argv = @(
    "scripts\pls-fast-capture.mjs",
    "--serve",
    "--from", "$From",
    "--to", "$To",
    "--worklist", $Worklist,
    "--out", $Out,
    "--state", $State,
    "--failures", $Failures,
    "--log", $Log,
    "--port", "$Port",
    "--workers", "$Workers",
    "--batch", "$Batch",
    "--stale-minutes", "$StaleMinutes",
    "--fetch-retries", "$FetchRetries",
    "--fetch-timeout-ms", "$FetchTimeoutMs",
    "--delay-ms", "$DelayMs",
    "--max-empty-attempts", "$MaxEmptyAttempts",
    "--max-transient-attempts", "$MaxTransientAttempts",
    "--session-pause-seconds", "$SessionPauseSeconds",
    "--session-pause-threshold", "$SessionPauseThreshold",
    "--transient-pause-seconds", "$TransientPauseSeconds",
    "--transient-pause-threshold", "$TransientPauseThreshold",
    "--empty-pause-seconds", "$EmptyPauseSeconds",
    "--empty-pause-threshold", "$EmptyPauseThreshold",
    "--empty-pause-window-seconds", "$EmptyPauseWindowSeconds"
  )
  if (-not $SkipPostgresCompletedCheck) {
    $argv += "--postgres-completed"
  }
  if ($FetchHeadnotes) {
    $argv += "--fetch-headnotes"
  }
  $argumentLine = ($argv | ForEach-Object { Quote-ProcessArgument $_ }) -join " "
  Start-Process -FilePath $node -ArgumentList $argumentLine -WorkingDirectory $RepoRoot -RedirectStandardOutput $OutLog -RedirectStandardError $ErrLog -WindowStyle Hidden -PassThru
}

$server = $null
Enable-KeepAwake
Write-Output "PLS fast-capture supervisor active. Windows sleep is suppressed while this process is running."
Write-Output "Output JSONL: $Out"
Write-Output "Paste this in the logged-in Pakistan Law Site tab console after the server starts:"
Write-Output "const s = document.createElement('script'); s.src = 'http://127.0.0.1:$Port/pls_runner.js?workers=$Workers&batch=$Batch&delay=$DelayMs&force=1'; document.body.appendChild(s);"
if (-not $SkipPostgresCompletedCheck) {
  Write-Output "Postgres completed-job check is enabled; already completed DB records will not be leased again."
}

try {
  while ($true) {
    Enable-KeepAwake
    $status = Get-Status
    if ($status -eq $null) {
      if ($server -eq $null -or $server.HasExited) {
        $server = Start-CaptureServer
        Write-Output "$(Get-Date -Format s) capture server started pid=$($server.Id)"
      }
    } else {
      if ($server -eq $null) {
        try {
          $server = Get-Process -Id $status.process.pid -ErrorAction Stop
        } catch {
          $server = $null
        }
      }
      $pauseText = ""
      if ($status.paused) {
        $pauseText = " pausedUntil=$($status.pausedUntil) reason=$($status.pauseReason)"
      }
      Write-Output "$(Get-Date -Format s) total=$($status.total) completed=$($status.completed) remaining=$($status.remaining) manualReview=$($status.manualReview) avgPerMinute=$($status.avgPerMinute)$pauseText"
      if ([int]$status.remaining -le 0) {
        Write-Output "PLS capture complete."
        break
      }
    }
    Start-Sleep -Seconds $PollSeconds
  }
} finally {
  Disable-KeepAwake
}
