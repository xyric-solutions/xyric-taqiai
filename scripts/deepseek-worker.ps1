param(
  [switch]$Ping,
  [string]$Model,
  [int]$MaxTokens = 4096
)

$ErrorActionPreference = "Stop"

function Read-XyricEnv {
  param([string]$Path)

  $values = @{}
  if (Test-Path -LiteralPath $Path) {
    Get-Content -LiteralPath $Path | ForEach-Object {
      $line = $_.Trim()
      if ($line.Length -eq 0 -or $line.StartsWith("#")) { return }
      $idx = $line.IndexOf("=")
      if ($idx -lt 1) { return }
      $key = $line.Substring(0, $idx).Trim()
      $value = $line.Substring($idx + 1).Trim().Trim('"').Trim("'")
      $values[$key] = $value
    }
  }

  return $values
}

$envFile = if ($env:XYRIC_ENV_FILE) { $env:XYRIC_ENV_FILE } else { Join-Path $HOME ".xyric\framework.env" }
$values = Read-XyricEnv -Path $envFile

$apiKey = if ($env:DEEPSEEK_API_KEY) {
  $env:DEEPSEEK_API_KEY
} elseif ($values.ContainsKey("DEEPSEEK_API_KEY")) {
  $values["DEEPSEEK_API_KEY"]
} else {
  $null
}

if ([string]::IsNullOrWhiteSpace($apiKey)) {
  throw "DEEPSEEK_API_KEY not set in $envFile. Copy scripts\framework.env.example there once, then fill in real keys."
}

if ([string]::IsNullOrWhiteSpace($Model)) {
  if ($env:DEEPSEEK_MODEL) {
    $Model = $env:DEEPSEEK_MODEL
  } elseif ($values.ContainsKey("DEEPSEEK_MODEL") -and -not [string]::IsNullOrWhiteSpace($values["DEEPSEEK_MODEL"])) {
    $Model = $values["DEEPSEEK_MODEL"]
  } else {
    $Model = "deepseek-v4-pro"
  }
}

if ($Ping) {
  $prompt = "Reply with exactly one word and no punctuation: pong"
} else {
  $prompt = ($input | Out-String)
}

$body = @{
  model = $Model
  max_tokens = $MaxTokens
  messages = @(
    @{
      role = "user"
      content = $prompt
    }
  )
} | ConvertTo-Json -Depth 8

$headers = @{
  "x-api-key" = $apiKey
  "anthropic-version" = "2023-06-01"
  "content-type" = "application/json"
}

try {
  $response = Invoke-RestMethod -Method Post -Uri "https://api.deepseek.com/anthropic/v1/messages" -Headers $headers -Body $body
} catch {
  throw "DeepSeek request failed: $($_.Exception.Message)"
}

$reply = ""
if ($response.content) {
  foreach ($part in $response.content) {
    if ($part.text) {
      $reply += $part.text
    }
  }
}

if ($Ping) {
  if ([string]::IsNullOrWhiteSpace($reply)) {
    throw "Unexpected empty DeepSeek response."
  }
  $compact = $reply -replace "\s", ""
  Write-Output "OK model=$Model reply=$compact"
} else {
  [Console]::Out.Write($reply)
}
