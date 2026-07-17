# Xyric Multiagent Setup Guide For Teammates

This guide sets up the same multiagent workflow on any teammate laptop and any
project folder.

The goal is simple:

1. Copy the workflow files into the project.
2. Create one private key file on the teammate's laptop.
3. Paste API keys into that private file.
4. Run one small test.
5. Start using the orchestrator prompt.

No API key should ever be pasted into chat, committed to git, sent in Slack, or
shared inside a normal project `.env` file.

## What This Setup Gives You

After setup, a teammate can give one large task to Codex or Claude and ask the
orchestrator to split the work into smaller parts.

Example:

```text
Use $multiagent-orchestrator.

Audit this project for stale docs, bugs, missing tests, unsafe data behavior,
and production-readiness risks. Use GLM for cheap worker tasks. Keep Codex as
the final judge.
```

The orchestrator then creates:

- an intake file;
- a context map;
- a routing plan;
- worker packets;
- verification notes.

## What Each Model Is For

Keep this mental model:

| Model/tool | Simple job |
|------------|------------|
| Codex or Claude/Opus | Boss brain. Plans, checks risk, makes final decisions. |
| Sonnet/default | Normal reviewer. Good for everyday code and docs review. |
| Haiku/small model | Scout. Finds files and summarizes quickly. |
| GLM | Cheap worker. Good for drafts, summaries, repeated/simple work. |
| DeepSeek | Optional worker. Only works if the account has billing/credits. |
| Local model | Optional private worker. Only use if the project has a tested local runner. |

Worker models do not get final authority. Their output is only evidence until
Codex or Claude checks it.

## Step 1: Copy The Files

Copy the files listed in:

```text
docs/multiagent-team-file-manifest.md
```

Put them inside the teammate's own project folder.

Example project folders:

```text
D:\Work\LawyerAI
D:\Work\HealthAI
D:\Work\FitnessAI
D:\Work\AnyFutureProject
```

Do not copy a filled private key file from another laptop. Each teammate creates
their own private key file in Step 2.

## Step 2: Open PowerShell In The Project

Open PowerShell, then go to the teammate's project folder.

Example:

```powershell
cd D:\Work\YourProject
```

Replace `D:\Work\YourProject` with the real project folder.

## Step 3: Create The Private Key File

Run:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
.\scripts\setup-multiagent-worker-env.ps1 -OpenFile
```

This creates a private file here:

```text
C:\Users\<YOUR_WINDOWS_USER>\.xyric\framework.env
```

On each laptop, `<YOUR_WINDOWS_USER>` is that person's Windows username.

Example:

```text
C:\Users\Person\.xyric\framework.env
```

## Step 4: Paste The API Keys

The setup script opens the private key file in Notepad.

You will see lines like this:

```env
ZAI_API_KEY=
# ZAI_MODEL=glm-5.1

DEEPSEEK_API_KEY=
# DEEPSEEK_MODEL=deepseek-v4-pro
```

Paste the GLM/Z.ai key after the equals sign. The line should still look like
this before you paste:

```env
ZAI_API_KEY=
ZAI_MODEL=glm-5.1
```

If you have a DeepSeek key, paste it after this equals sign:

```env
DEEPSEEK_API_KEY=
```

If you do not have a DeepSeek key, leave it blank.

Save the file and close Notepad.

## Step 5: Test GLM

Run this from the project folder:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
.\scripts\setup-multiagent-worker-env.ps1 -Check -PingGlm
```

Good result:

```text
OK model=glm-5.1 reply=pong
```

That means GLM is ready.

If you see an error, check:

- Did you save the key file?
- Is the key pasted on the `ZAI_API_KEY` line after the equals sign?
- Did you accidentally add spaces before the key?
- Does the Z.ai account have access to the model?

## Step 6: Test DeepSeek Only If Needed

DeepSeek is optional.

Run:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
.\scripts\setup-multiagent-worker-env.ps1 -Check -PingDeepSeek
```

If it says `402 Payment Required`, the key may be valid but the DeepSeek
account needs billing or credits.

That is not a Codex problem. It means DeepSeek cannot be used as a worker yet.

## Step 7: Use It In Codex

Paste this into Codex:

```text
Use $multiagent-orchestrator.

Objective:
Audit a small slice of this project to prove the workflow works.

Scope:
Only inspect AGENTS.md, CLAUDE.md, runbooks/multiagent-orchestrator.md,
scripts/glm-worker.ps1, scripts/deepseek-worker.ps1, and
plans/next-session-handoff.md.

Denied actions:
No production access. No database writes. No file edits unless I approve first.
Do not print API keys.

Available workers:
GLM is available on glm-5.1.
DeepSeek is optional and may not be available.

Output:
Create the intake, context map, routing plan, and one worker packet. Then tell
me whether the setup is ready.
```

## Step 8: Use It In Claude

In Claude Code, run:

```text
/multiagent-orchestrator
```

Then paste the same task prompt.

If Opus is available and the task is hard, you can use:

```text
/status
/model opus
```

Then run `/multiagent-orchestrator`.

## The Most Important Rule

Never paste API keys into:

- Codex chat;
- Claude chat;
- Slack;
- email;
- git;
- a normal project `.env` file.

API keys only go in:

```text
C:\Users\<YOUR_WINDOWS_USER>\.xyric\framework.env
```

That file stays private on each teammate's own laptop.

## Optional Keys

`ANTHROPIC_API_KEY` is optional. Most teammates do not need it because normal
Claude Code use works through their Claude login/subscription.

`SUPERMEMORY_CC_API_KEY` is optional. Only add it if a future Supermemory
skill/tool is enabled.

## Quick Troubleshooting

| Problem | What it usually means |
|---------|------------------------|
| `ZAI_API_KEY not set` | The GLM key is missing from `framework.env`. |
| `OK model=glm-5.1 reply=pong` | GLM is working. |
| `402 Payment Required` from DeepSeek | DeepSeek account needs billing or credits. |
| PowerShell blocks the script | Run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force` first. |
| The AI says it cannot find the skill | Check that `.agents/skills/multiagent-orchestrator/` was copied. |
| Claude cannot find `/multiagent-orchestrator` | Check that `.claude/commands/multiagent-orchestrator.md` was copied. |
