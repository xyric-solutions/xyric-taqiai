# Multiagent Task Prompt Template

Use this when you want one large prompt to become a model-routed ForgeFlow run.

```text
Use $multiagent-orchestrator.

Objective:
- [Describe what should be achieved.]

Scope:
- [List the roots, folders, products, docs, or systems in scope.]

Non-goals:
- [List what should not be touched.]

Allowed roots:
- D:\Work\YourProject
- [Add another root only if this task really needs it.]

Denied actions:
- No production writes.
- No local database writes.
- No ingestion, compute, ETL, migrations, DELETE, INSERT, UPDATE, backtests, or
  rate-limited API jobs unless I explicitly approve them.
- Do not print secrets.

Preferred orchestrator:
- Codex | Claude default | Claude Opus when available | decide from context

Available worker runtimes:
- Claude Haiku/Sonnet/Opus: yes/no/unknown
- GLM: yes/no/unknown
- DeepSeek: yes/no/unknown
- local Qwen/Ollama/OpenCode: yes/no/unknown

Verification target:
- [Command, read-only check, report format, or manual evidence expectation.]

Output I want:
- routing plan
- worker packets
- findings report
- patch plan
- implementation
- other: [describe]
```

If you do not know the available worker runtimes, leave them as `unknown`. The
orchestrator should create packets and mark runtime-dependent work as pending or
mock-worker evidence instead of pretending a model is available.
