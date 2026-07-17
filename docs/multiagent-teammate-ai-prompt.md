# Ready-To-Paste AI Prompt For Teammates

Paste this into Codex after the files are copied and GLM is tested.

```text
Use $multiagent-orchestrator.

I am setting up the Xyric multiagent workflow on my laptop for the first time.

Please do a safe setup check.

Scope:
- Check that the multiagent setup files exist.
- Check the docs explain how to use GLM and DeepSeek workers.
- Check that the workflow will create an intake, context map, routing plan, and worker packets before deep work.

Denied actions:
- Do not print API keys.
- Do not read or display the contents of C:\Users\<MY_WINDOWS_USER>\.xyric\framework.env.
- Do not run database writes.
- Do not use production access.
- Do not edit files unless I approve first.

Known worker status:
- GLM should use glm-5.1.
- DeepSeek is optional.

Output:
- Tell me whether the setup looks ready.
- If something is missing, tell me exactly which file is missing.
- Give me the next command to run.
```

For a real audit after the setup check passes, paste this:

```text
Use $multiagent-orchestrator.

Objective:
Audit this project for stale docs, bugs, missing tests, unsafe data behavior, and production-readiness risks.

Scope:
D:\Work\YourProject

Denied actions:
No database writes. No migrations. No ingestion. No ETL. No backtests. No production writes. No rate-limited API jobs unless I explicitly approve first. Do not print secrets.

Available workers:
GLM is available on glm-5.1.
DeepSeek is optional.
Use Codex or Claude as the final judge.

Output:
First create the intake, context map, routing plan, and worker packets. Then start with a small safe audit batch.
```
