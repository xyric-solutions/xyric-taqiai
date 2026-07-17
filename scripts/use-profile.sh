#!/usr/bin/env bash
# use-profile.sh -- switch ANTHROPIC_* env vars for a Forgeflow runtime profile.
# Must be SOURCED, not executed: `source scripts/use-profile.sh glm`
#
# Reads real keys from a global, per-machine env file (default
# ~/.xyric/framework.env, override with XYRIC_ENV_FILE) so keys are set up
# once and reused across every project this framework is copied into.

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  echo "error: use-profile.sh must be sourced, not executed." >&2
  echo "  usage: source scripts/use-profile.sh native|glm|deepseek" >&2
  exit 1
fi

_xyric_env_file="${XYRIC_ENV_FILE:-$HOME/.xyric/framework.env}"

if [[ ! -f "$_xyric_env_file" ]]; then
  echo "error: no env file at $_xyric_env_file" >&2
  echo "  copy scripts/framework.env.example there once, then fill in real keys:" >&2
  echo "    mkdir -p \"\$(dirname \"$_xyric_env_file\")\" && cp scripts/framework.env.example \"$_xyric_env_file\"" >&2
  unset _xyric_env_file
  return 1
fi

# shellcheck disable=SC1090
source "$_xyric_env_file"

case "${1:-}" in
  native)
    unset ANTHROPIC_BASE_URL ANTHROPIC_AUTH_TOKEN ANTHROPIC_API_KEY
    echo "profile: native (Claude, no provider override)"
    ;;
  glm)
    if [[ -z "${ZAI_API_KEY:-}" ]]; then
      echo "error: ZAI_API_KEY not set in $_xyric_env_file" >&2
      unset _xyric_env_file
      return 1
    fi
    export ANTHROPIC_BASE_URL="https://api.z.ai/api/anthropic"
    export ANTHROPIC_AUTH_TOKEN="$ZAI_API_KEY"
    echo "profile: glm-coding-backend (Z.ai)"
    ;;
  deepseek)
    if [[ -z "${DEEPSEEK_API_KEY:-}" ]]; then
      echo "error: DEEPSEEK_API_KEY not set in $_xyric_env_file" >&2
      unset _xyric_env_file
      return 1
    fi
    export ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
    export ANTHROPIC_AUTH_TOKEN="$DEEPSEEK_API_KEY"
    export ANTHROPIC_MODEL="${DEEPSEEK_MODEL:-deepseek-v4-pro[1m]}"
    export ANTHROPIC_DEFAULT_OPUS_MODEL="${DEEPSEEK_MODEL:-deepseek-v4-pro[1m]}"
    export ANTHROPIC_DEFAULT_SONNET_MODEL="${DEEPSEEK_MODEL:-deepseek-v4-pro[1m]}"
    export ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"
    export CLAUDE_CODE_SUBAGENT_MODEL="deepseek-v4-flash"
    export CLAUDE_CODE_EFFORT_LEVEL="max"
    echo "profile: deepseek-coding-backend (DeepSeek direct API)"
    ;;
  *)
    echo "usage: source scripts/use-profile.sh native|glm|deepseek" >&2
    echo "  env file: $_xyric_env_file" >&2
    unset _xyric_env_file
    return 1
    ;;
esac

unset _xyric_env_file
echo "next: run 'claude' then '/status' to confirm."
