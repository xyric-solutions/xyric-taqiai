---
description: Split a large project task into model-routed worker packets, evidence paths, and verification gates
---

Read `runbooks/multiagent-orchestrator.md` and execute it exactly. Treat Claude
as the active orchestrator unless the user explicitly says another harness owns
the run. Use the user's prompt as the intake; if arguments are available, treat
them as the task prompt:

`$ARGUMENTS`

Before delegating, create the routing plan and any worker packets required by
`runbooks/worker-task-packets.md`. Worker output is evidence only until
orchestrator review.
