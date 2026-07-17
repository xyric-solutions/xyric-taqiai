#!/usr/bin/env bash
# glm-worker.sh -- call the GLM Coding Plan API directly (Anthropic Messages
# format) as a cheap generation sub-worker for Workflow scripts. This is NOT
# the Claude Code CLI -- it's a plain HTTP call, meant to be shelled out to
# from a thin wrapper agent inside a Workflow's agent() call. See
# templates/capabilities/glm-workflow-worker.md for the usage pattern.
#
# Usage:
#   ./scripts/glm-worker.sh --ping
#   echo "prompt text" | ./scripts/glm-worker.sh -m glm-5.1 -t 4096
#
# Reads ZAI_API_KEY (and optional ZAI_MODEL) from the same global env file
# scripts/use-profile.sh uses: ~/.xyric/framework.env by default, override
# with XYRIC_ENV_FILE.

set -euo pipefail

BASE_URL="https://api.z.ai/api/anthropic"
MODEL="${ZAI_MODEL:-glm-5.1}"
MAX_TOKENS=4096
PING=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --ping) PING=1; shift ;;
    -m) MODEL="$2"; shift 2 ;;
    -t) MAX_TOKENS="$2"; shift 2 ;;
    --help|-h)
      echo "usage: glm-worker.sh [--ping] [-m MODEL] [-t MAX_TOKENS]  (prompt read from stdin)" >&2
      exit 0
      ;;
    *)
      echo "error: unknown flag: $1" >&2
      exit 2
      ;;
  esac
done

_xyric_env_file="${XYRIC_ENV_FILE:-$HOME/.xyric/framework.env}"
if [[ -f "$_xyric_env_file" ]]; then
  # shellcheck disable=SC1090
  source "$_xyric_env_file"
fi

if [[ -z "${ZAI_API_KEY:-}" ]]; then
  echo "error: ZAI_API_KEY not set in $_xyric_env_file" >&2
  echo "  copy scripts/framework.env.example there once, then fill in real keys." >&2
  exit 1
fi
MODEL="${ZAI_MODEL:-$MODEL}"

if [[ "$PING" -eq 1 ]]; then
  prompt="Reply with exactly one word and no punctuation: pong"
else
  prompt="$(cat)"
fi

body="$(python3 - "$MODEL" "$MAX_TOKENS" "$prompt" <<'PY'
import json, sys
model, max_tokens, prompt = sys.argv[1], int(sys.argv[2]), sys.argv[3]
print(json.dumps({"model": model, "max_tokens": max_tokens, "messages": [{"role": "user", "content": prompt}]}))
PY
)"

raw="$(curl -sS -w '\n%{http_code}' -X POST "$BASE_URL/v1/messages" \
  -H "Authorization: Bearer $ZAI_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d "$body")"
http_code="${raw##*$'\n'}"
response="${raw%$'\n'*}"

if [[ "$http_code" != "200" ]]; then
  echo "error: GLM request failed (HTTP $http_code)" >&2
  echo "$response" >&2
  exit 1
fi

reply="$(python3 -c '
import json, sys
d = json.load(sys.stdin)
print("".join(b.get("text", "") for b in d.get("content", [])), end="")
' <<< "$response")"

if [[ "$PING" -eq 1 ]]; then
  if [[ -n "$reply" ]]; then
    echo "OK model=$MODEL reply=$(echo "$reply" | tr -d '[:space:]')"
  else
    echo "error: unexpected response body" >&2
    echo "$response" >&2
    exit 1
  fi
else
  printf '%s' "$reply"
fi
