# Multiagent Orchestrator Package Manifest

Copy the contents of this folder into a project when that project needs reusable model-routed orchestration for large tasks.

## Copy Into The Project Root

```text
.agents/skills/multiagent-orchestrator/
.claude/commands/multiagent-orchestrator.md
.claude/agents/project-map-scout.md
.claude/agents/project-routine-reviewer.md
.claude/agents/project-risk-adjudicator.md
.claude/agents/packet-summarizer.md
runbooks/multiagent-orchestrator.md
runbooks/runtime-profiles.md
runbooks/worker-task-packets.md
runbooks/pre-development-check.md
runbooks/gateway-router.md
runbooks/glm-workflow-worker.md
runbooks/opencode-worker.md
runbooks/saved-workflows.md
scripts/framework.env.example
scripts/setup-multiagent-worker-env.ps1
scripts/use-profile.ps1
scripts/glm-worker.ps1
scripts/deepseek-worker.ps1
scripts/use-profile.sh
scripts/glm-worker.sh
plans/multiagent/task-prompt-template.md
framework/templates/worker-task-packet.md
framework/templates/batch-template.md
framework/templates/verification-matrix.md
framework/templates/capabilities/opencode-worker.example.jsonc
```

## Add To Existing Project Guidance

Do not overwrite a teammate's existing `AGENTS.md` or `CLAUDE.md`. Paste the matching snippets from:

```text
project-guidance/AGENTS.multiagent-section.md
project-guidance/CLAUDE.multiagent-section.md
```

## Private Keys

Each teammate creates their own private file at:

```text
C:\Users\<YOUR_WINDOWS_USER>\.xyric\framework.env
```

Never commit or share a filled `framework.env` file.
