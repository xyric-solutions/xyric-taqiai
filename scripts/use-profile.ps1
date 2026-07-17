param(
  [Parameter(Mandatory = $true, Position = 0)]
  [ValidateSet("native", "glm", "deepseek")]
  [string]$Profile
)

$ErrorActionPreference = "Stop"

function Read-XyricEnv {
  param([string]$Path)

  $values = @{}
  if (-not (Test-Path -LiteralPath $Path)) {
    throw "No env file at $Path. Copy scripts\framework.env.example there once, then fill in real keys."
  }

  Get-Content -LiteralPath $Path | ForEach-Object {
    $line = $_.Trim()
    if ($line.Length -eq 0 -or $line.StartsWith("#")) { return }
    $idx = $line.IndexOf("=")
    if ($idx -lt 1) { return }
    $key = $line.Substring(0, $idx).Trim()
    $value = $line.Substring($idx + 1).Trim().Trim('"').Trim("'")
    $values[$key] = $value
  }

  return $values
}

$envFile = if ($env:XYRIC_ENV_FILE) { $env:XYRIC_ENV_FILE } else { Join-Path $HOME ".xyric\framework.env" }

switch ($Profile) {
  "native" {
    Remove-Item Env:ANTHROPIC_BASE_URL -ErrorAction SilentlyContinue
    Remove-Item Env:ANTHROPIC_AUTH_TOKEN -ErrorAction SilentlyContinue
    Remove-Item Env:ANTHROPIC_API_KEY -ErrorAction SilentlyContinue
    Remove-Item Env:ANTHROPIC_MODEL -ErrorAction SilentlyContinue
    Remove-Item Env:ANTHROPIC_DEFAULT_OPUS_MODEL -ErrorAction SilentlyContinue
    Remove-Item Env:ANTHROPIC_DEFAULT_SONNET_MODEL -ErrorAction SilentlyContinue
    Remove-Item Env:ANTHROPIC_DEFAULT_HAIKU_MODEL -ErrorAction SilentlyContinue
    Remove-Item Env:CLAUDE_CODE_SUBAGENT_MODEL -ErrorAction SilentlyContinue
    Remove-Item Env:CLAUDE_CODE_EFFORT_LEVEL -ErrorAction SilentlyContinue
    Write-Output "profile: native (Claude, no provider override)"
  }
  "glm" {
    $values = Read-XyricEnv -Path $envFile
    if (-not $values.ContainsKey("ZAI_API_KEY") -or [string]::IsNullOrWhiteSpace($values["ZAI_API_KEY"])) {
      throw "ZAI_API_KEY not set in $envFile"
    }
    $env:ANTHROPIC_BASE_URL = "https://api.z.ai/api/anthropic"
    $env:ANTHROPIC_AUTH_TOKEN = $values["ZAI_API_KEY"]
    Write-Output "profile: glm-coding-backend (Z.ai)"
  }
  "deepseek" {
    $values = Read-XyricEnv -Path $envFile
    if (-not $values.ContainsKey("DEEPSEEK_API_KEY") -or [string]::IsNullOrWhiteSpace($values["DEEPSEEK_API_KEY"])) {
      throw "DEEPSEEK_API_KEY not set in $envFile"
    }
    $model = if ($values.ContainsKey("DEEPSEEK_MODEL") -and -not [string]::IsNullOrWhiteSpace($values["DEEPSEEK_MODEL"])) {
      $values["DEEPSEEK_MODEL"]
    } else {
      "deepseek-v4-pro[1m]"
    }
    $env:ANTHROPIC_BASE_URL = "https://api.deepseek.com/anthropic"
    $env:ANTHROPIC_AUTH_TOKEN = $values["DEEPSEEK_API_KEY"]
    $env:ANTHROPIC_MODEL = $model
    $env:ANTHROPIC_DEFAULT_OPUS_MODEL = $model
    $env:ANTHROPIC_DEFAULT_SONNET_MODEL = $model
    $env:ANTHROPIC_DEFAULT_HAIKU_MODEL = "deepseek-v4-flash"
    $env:CLAUDE_CODE_SUBAGENT_MODEL = "deepseek-v4-flash"
    $env:CLAUDE_CODE_EFFORT_LEVEL = "max"
    Write-Output "profile: deepseek-coding-backend (DeepSeek direct API)"
  }
}

Write-Output "next: run 'claude' then '/status' to confirm."
