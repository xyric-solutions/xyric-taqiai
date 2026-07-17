## Multiagent Policy

Use multi-agent work only when the user asks for delegation, subagents, worker packets, model routing, or parallel agent work. Before delegating, create or reference a bounded worker packet with `forgeflow-worker-task-packet` or `runbooks/worker-task-packets.md`. Worker output is evidence until the orchestrator verifies it.

Worker packets must name allowed files, denied files, exact task, stop conditions, verification command, evidence path, and whether the worker can edit or only inspect.

For large "one big prompt" tasks, use `multiagent-orchestrator` and `runbooks/multiagent-orchestrator.md` first. The orchestrator should create a context map and routing plan before deep reading or delegation.
