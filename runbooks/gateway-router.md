# Forgeflow Runbook: Gateway Router Policy

## Purpose

Define how Forgeflow evaluates gateway and model-router options without
activating automatic routing as the default. This is policy documentation for
future worker infrastructure. It is not permission to route batches through a
gateway today.

Last reviewed against primary gateway/router docs: 2026-06-29.

## Current Recommendation

Do not implement gateway automation yet. The best fit for Forgeflow right now is
manual, evidence-based runtime selection:

- native orchestration by default: `codex-native` in Codex or `claude-native`
  in Claude Code;
- explicit worker profiles only when selected by the orchestrator;
- worker task packets for bounded delegation;
- model and provider evidence recorded in batch artifacts;
- no hidden automatic routing.

Prepare interfaces and evidence requirements first. Revisit automation only
after at least a few shakedown batches prove the packet format, verification
path, logging needs, and failure modes.

## Evaluation Criteria

Any router or gateway candidate must satisfy these criteria before becoming a
runtime profile default:

| Criterion | Required evidence |
|-----------|-------------------|
| Source authority | Current primary docs reviewed and linked in the batch or policy note. |
| Governance | Owner, approval path, and policy for which tasks may route. |
| Budget/usage controls | Per-request usage, budget caps, timeout policy, and pause conditions. |
| Logging | Safe logs that record provider, model, request purpose, output path, and failure state without storing secrets or private prompts unnecessarily. |
| Fallback | Behavior when a model, provider, gateway, local runtime, or network path is unavailable. |
| Verification | Deterministic verify command plus orchestrator review before output becomes truth. |
| Security/privacy | Credential storage, data boundary, retention policy, and production-access policy. |
| Portability | No committed user config, private endpoints, or personal machine paths. |
| Closeout | Batch artifacts name the model/provider that produced each material output. |

## Candidate Comparison

| Candidate | Fit | Strengths | Risks | Forgeflow stance |
|-----------|-----|-----------|-------|------------------|
| LiteLLM Router | API gateway/router for provider diversity, retries, fallbacks, timeouts, load balancing, and budget-aware routing. | Strong router feature set and policy surface for multi-provider API work. | Adds service operations, config ownership, credential handling, and logging policy. | Evaluate later after worker packets and evidence logs are proven. |
| Portkey AI Gateway | Gateway layer for routing, fallbacks, retries, analytics, caching, guardrails, and observability. | Good gateway candidate when teams need centralized AI gateway controls. | Hosted vs self-hosted choice, data policy, enterprise controls, and operational burden need review. | Evaluate later, not default for copy-folder Forgeflow. |
| OpenCode server | Local or controlled worker harness API for sessions, messages, diffs, files, tools, commands, agents, and events. | Useful for experiments and scripted worker runs without making OpenCode the orchestrator. | Long-running server, auth, permissions, and local state can become hidden infrastructure. | Optional worker-harness evaluation only; do not route Claude Pro/Max through it. |
| Custom router | Project-specific policy layer over selected providers or workers. | Can match Forgeflow artifacts exactly. | Easy to create unreviewed policy, weak logging, or brittle model choices. | Defer until the evidence schema and failure policy are stable. |
| Local-only routing | Local model runtime such as Ollama for offline or low-risk worker packets. | Keeps some work local, supports mockable shakedowns, and can run without provider APIs. | Quality, hardware, model availability, and data handling must be measured. | Pilot through `local-qwen-mlx`, another explicitly selected local model, or mock-worker packets, with orchestrator verification. |

## Gateway Interface To Prepare

Before automation, add only durable fields to Forgeflow artifacts:

- runtime profile;
- worker backend;
- provider;
- model;
- endpoint class: `native`, `provider-api`, `gateway`, `local`, or `mock`;
- packet path;
- output/evidence path;
- verify command and result;
- usage guard;
- fallback used, if any;
- orchestrator review decision.

These fields should work for manual workers, local workers, OpenCode, and future
gateways without requiring an active router.

## Stop Conditions

- Stop if the router would become the default before shakedown evidence exists.
- Stop if budget, logging, fallback, credential, or data-boundary policy is
  missing.
- Stop if the gateway obscures which model produced a material output.
- Stop if routing policy is hidden in personal config or machine-local state.
- Stop if worker output cannot be traced back to a task packet and verify gate.

## Sources

- LiteLLM Router docs: https://docs.litellm.ai/docs/routing
- Portkey AI Gateway repository: https://github.com/Portkey-AI/gateway
- OpenCode server docs: https://opencode.ai/docs/server/
- OpenCode config docs: https://opencode.ai/docs/config/
- OpenCode provider docs: https://opencode.ai/docs/providers/
