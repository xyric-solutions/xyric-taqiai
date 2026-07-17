param(
  [switch]$OpenFile,
  [switch]$Check,
  [switch]$PingGlm,
  [switch]$PingDeepSeek
)

$ErrorActionPreference = "Stop"

$envDir = Join-Path $HOME ".xyric"
$envFile = Join-Path $envDir "framework.env"
$template = Join-Path (Get-Location) "scripts\framework.env.example"

function Read-KeyStatus {
  param([string]$Path)

  $values = @{}
  if (Test-Path -LiteralPath $Path) {
    Get-Content -LiteralPath $Path | ForEach-Object {
      $line = $_.Trim()
      if ($line.Length -eq 0 -or $line.StartsWith("#")) { return }
      $idx = $line.IndexOf("=")
      if ($idx -lt 1) { return }
      $key = $line.Substring(0, $idx).Trim()
      $value = $line.Substring($idx + 1).Trim()
      $values[$key] = $value
    }
  }

  foreach ($name in @("ZAI_API_KEY", "ZAI_MODEL", "DEEPSEEK_API_KEY", "DEEPSEEK_MODEL", "ANTHROPIC_API_KEY", "SUPERMEMORY_CC_API_KEY")) {
    $status = if ($values.ContainsKey($name) -and -not [string]::IsNullOrWhiteSpace($values[$name])) {
      "set"
    } else {
      "not set"
    }
    Write-Output "$name=$status"
  }
}

if (-not (Test-Path -LiteralPath $envDir)) {
  New-Item -ItemType Directory -Force -Path $envDir | Out-Null
}

if (-not (Test-Path -LiteralPath $envFile)) {
  if (-not (Test-Path -LiteralPath $template)) {
    throw "Could not find template: $template. Run this from the project root."
  }
  Copy-Item -LiteralPath $template -Destination $envFile
  Write-Output "Created private key file:"
  Write-Output $envFile
} else {
  Write-Output "Private key file already exists:"
  Write-Output $envFile
}

Write-Output ""
Write-Output "Put your API keys in this private file only. Do not paste keys into chat."
Write-Output ""

if ($Check) {
  Write-Output "Key status without showing values:"
  Read-KeyStatus -Path $envFile
  Write-Output ""
}

if ($OpenFile) {
  Write-Output "Opening the private key file in Notepad."
  Start-Process notepad.exe -ArgumentList $envFile
}

if ($PingGlm) {
  Write-Output "Testing GLM with one tiny prompt..."
  & (Join-Path (Get-Location) "scripts\glm-worker.ps1") -Ping
}

if ($PingDeepSeek) {
  Write-Output "Testing DeepSeek with one tiny prompt..."
  & (Join-Path (Get-Location) "scripts\deepseek-worker.ps1") -Ping
}

if (-not $OpenFile -and -not $Check -and -not $PingGlm -and -not $PingDeepSeek) {
  Write-Output "Next step:"
  Write-Output "1. Run this again with -OpenFile."
  Write-Output "2. Paste keys after the equals signs."
  Write-Output "3. Save the file."
  Write-Output "4. Run this with -Check -PingGlm."
}
