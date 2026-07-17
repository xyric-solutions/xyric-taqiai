# Forgeflow Runbook: Saved Claude Workflows

## Purpose

Create reusable Claude workflow or Ultracode templates only after a bounded,
reviewed first run proves the workflow is useful. Saved workflows are execution
helpers, not hidden source hierarchy. They must point back to Forgeflow
runbooks, batch files, verification commands, and evidence paths.

Last reviewed against primary Claude Code workflow docs: 2026-06-29.

## Current Recommendation

Do not make `/effort ultracode` or broad automatic workflow orchestration the
default Forgeflow path. Use saved workflows and `ultracode:` only for bounded
audits, migrations, research sweeps, repeated code operations, or reviewer
fan-out where a small first run has already succeeded.

## Required Inputs

- Active batch or capability build request.
- Source hierarchy and tie-breaker source.
- Scope cap and exact file or item list.
- Small first run definition.
- Verify command and evidence path.
- Token, usage, or time guard.
- Stop condition.
- Closeout writes.
- Template: `framework/templates/capabilities/claude-saved-workflow.md`.

## Workflow Creation Steps

1. Start from an existing Forgeflow runbook. If no runbook exists, write or
   adapt one first.
2. Define a small first run:
   - one folder, one component family, one doc set, or one narrow audit class;
   - max agent count or max repeated passes;
   - max time, turns, or usage signal;
   - exact verify command.
3. Review sources before execution. The workflow prompt must name the source
   hierarchy, active root, and tie-breaker source.
4. Run the small first run and write raw evidence to the batch evidence path.
5. Review quality and cost/usage. Save the workflow only if the evidence shows:
   - better consistency or coverage than a normal prompt;
   - no hidden scope expansion;
   - no unverified final decisions;
   - a clean closeout path.
6. Save the workflow template under the project capability area, not as machine
   local invisible policy. It must include a link back to the owning runbook.
7. Add the saved workflow to the capability index only after review.

## Required Template Fields

Every saved workflow template must include:

- owning Forgeflow runbook;
- intended use and explicit non-use cases;
- small first run;
- source review checklist;
- scope cap;
- allowed files and denied actions;
- verify command;
- evidence path;
- token, usage, or time guard;
- stop condition;
- output format;
- closeout writes;
- reviewer checklist;
- removal criteria if it proves noisy or risky.

## Ultracode Policy

Use `ultracode:` as an explicit batch primitive only when the work is bounded and
repeatable. Do not use it for open-ended implementation, architecture, product
strategy, security/privacy final calls, destructive migrations, or production
changes. The orchestrator must inspect the generated workflow plan or script
before trusting it as reusable project policy.

## Stop Conditions

- Stop if the workflow lacks source review, scope cap, verify command, evidence
  path, usage guard, or closeout writes.
- Stop if the first small run expands scope or produces unreviewable output.
- Stop if the workflow requires hidden machine-local state.
- Stop if a stronger final-review model or human reviewer is needed but not
  available.
- Stop if output cannot be mapped back to batch artifacts.

## Sources

- Claude Code workflows docs: https://code.claude.com/docs/en/workflows
- Claude Code model configuration: https://code.claude.com/docs/en/model-config
- Claude Code best practices: https://code.claude.com/docs/en/best-practices
