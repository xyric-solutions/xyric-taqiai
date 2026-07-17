# Ready-To-Paste First Prompt

```text
Use $multiagent-orchestrator.

Objective:
Audit a small slice of this project to prove the workflow works.

Scope:
Only inspect AGENTS.md, CLAUDE.md, runbooks/multiagent-orchestrator.md, scripts/glm-worker.ps1, scripts/deepseek-worker.ps1, and plans/next-session-handoff.md if those files exist.

Denied actions:
No production access. No database writes. No file edits unless I approve first. Do not print API keys.

Available workers:
GLM is available on glm-5.1 if the ping test passes. DeepSeek is optional.

Output:
Create the intake, context map, routing plan, and one worker packet. Then tell me whether the setup is ready.
```
