## Multiagent Command

Claude command: `/multiagent-orchestrator` reads `runbooks/multiagent-orchestrator.md` and turns a large project prompt into a routing plan, worker packets, evidence paths, and verification gates.

Claude subagents live in `.claude/agents/`: `project-map-scout` uses Haiku for cheap read-only discovery, `project-routine-reviewer` uses Sonnet/default for bounded review, `project-risk-adjudicator` uses Opus for high-risk adjudication when available, and `packet-summarizer` compresses worker evidence.

Use multi-agent workers only through bounded worker packets and orchestrator verification. For one-prompt large tasks, create the context map and routing plan before deep reading or delegation.
