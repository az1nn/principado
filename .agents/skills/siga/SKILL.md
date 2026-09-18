---
name: siga
description: Reconcile the real persistent state of this application and continue from the correct boundary. Trigger whenever the user says "Siga" as a standalone instruction, or explicitly invokes the SIGA continuation protocol. Never interpret SIGA as a generic request to merely do the next thing.
---

# SIGA — Portable Continuation Protocol

## Core meaning

"SIGA" means:

> Descubra onde realmente estamos e continue corretamente dali.

Never treat it as:

> Apenas execute alguma próxima coisa.

Operate in **VERIFY-FIRST** mode.

Trust sources in this order:

**REAL STATE > HANDOFF > REPOSITORY ARTIFACTS > CHAT**

The current verifiable application state is canonical. A handoff is only the last known hypothesis.

## Repository-only ownership

This application's repository-owned skill is the **only procedural source of truth for SIGA for this application**.

- The SIGA skill MUST live only inside this application's repository under `.agents/skills/siga/`.
- Do not create, store, mirror, summarize, cache, or maintain the SIGA specification in ChatGPT Memory, saved memories, Project knowledge, Library, app-level custom state, another repository, a local registry, or any parallel knowledge store.
- Chat history may contain past discussion, but it is never a valid source for reconstructing the SIGA protocol.
- On every invocation, read the repository-owned SIGA skill before applying SIGA semantics.
- If repository access is unavailable, do not reconstruct the protocol from memory. State that the canonical skill could not be verified and use only ordinary explicit instructions from the user.
- Evolve SIGA only by editing this repository-owned skill through the repository workflow.
- Per-workstream handoffs are allowed because they record application state/delta; they do not redefine the SIGA protocol.

## 1. RECONCILE

Before doing new work, reconstruct the current state from every relevant persistent source that is actually available.

Depending on the environment, inspect the equivalents of:

- application/project/workspace state;
- branch, workspace, environment, deployment, or active version;
- current HEAD/revision/version;
- open tasks, issues, PRs/MRs, cards, jobs, runs, agents, or workers;
- CI/CD, tests, lint, typecheck, builds, deploys, previews, health checks;
- reviews, comments, approvals, human gates, pending decisions;
- blockers, failures, logs, artifacts, specs, ADRs, checklists, handoffs;
- remote state versus local state.

Do not assume the last chat message is still true.

If canonical state cannot be reached, use the strongest persistent repository/application source available, state the limitation, and do not invent current status.

## 2. CLASSIFY

After reconciliation, choose **exactly one** mode.

### MODE A — RESUME

Use when work was started but is not yet complete and there is actionable unfinished work.

Examples:

- incomplete implementation;
- unresolved bug;
- unfinished task/spec;
- local or branch changes not finalized;
- failure already produced by a completed validation;
- work interrupted between implementation and verification.

Action:

Continue from the last safe boundary. Do not create a redundant new workstream.

### MODE B — WATCH

Use when the main work has already been dispatched and there is still a genuinely active process or pending validation/gate.

Examples:

- CI still running;
- agent/worker still running;
- deploy in progress;
- review or explicit human gate pending;
- async validation still executing.

Action:

Do not duplicate work. Inspect current status, consume completed results, and correct completed failures when possible.

If an active process finishes and exposes actionable corrective work, reclassify on the next cycle before acting.

Never open a parallel branch, PR, task, session, or job merely because the existing one has not finished.

### MODE C — ADVANCE

Use only when the previous work is verifiably complete and there is no active execution or pending gate that still belongs to it.

Action:

Derive the next logical unit from the roadmap, spec, tasks, issues, handoff, dependencies, and explicitly stated priorities.

Only in this mode may a new branch, PR, task, spec, or workstream be started.

## 3. EXECUTE

After selecting the mode:

**implement → verify → classify → persist**

Verification depth must match the environment and use the strongest evidence available.

Examples:

- tests;
- lint;
- typecheck;
- build;
- CI;
- Engineering Graph;
- preview;
- screenshots;
- API checks;
- queries;
- logs;
- deploy health;
- human validation;
- contract validation.

Context compression must never reduce verification rigor.

## Invariants

During SIGA execution:

- Never mask FAIL.
- Never declare success without evidence.
- Never duplicate work already in progress.
- Never create a new workstream before reconciling the existing one.
- Never trust chat history over canonical application state.
- Never reconstruct SIGA semantics from ChatGPT Memory.
- Never change behavior merely to make a gate green without resolving the underlying cause.
- Never cross an explicit human gate automatically.
- Never delete context required to reconstruct decisions.
- When sources conflict, current canonical application state wins.

## Human gates

When a decision is explicitly reserved to the user, finish every other verifiable action first and stop only at that decision boundary.

Examples:

- Design Gate;
- visual approval;
- manual merge authorization;
- architectural decision;
- production release;
- cost approval;
- destructive change.

Present exactly:

- current state;
- evidence;
- decision required;
- effect of each relevant alternative.

## Durable handoff

At a natural session boundary, persist one compact handoff in the application's repository or another explicit persistent application artifact.

Use this exact structure:

```text
CAVEMAN HANDOFF v1

APP:
WORKSTREAM:
STATE:
MODE:
CANONICAL SOURCE:

CURRENT VERSION / HEAD:
BASE:
BRANCH / ENV:
PR / MR / TASK:
SPEC / ADR:

DONE:
VERIFY:
GATES:
BLOCKERS:

INVARIANTS:
NEXT:

VERIFY-FIRST:
<minimum instructions required to reconstruct the real state on the next run>
```

The handoff records state and delta, not a narrative transcript.

It must be sufficient for another agent or session to resume without depending on prior conversation history.

## Next session behavior

On the next standalone `Siga`:

1. identify the application/repository from the active project/workspace;
2. read `.agents/skills/siga/SKILL.md` from that repository;
3. locate the latest persisted handoff available for the workstream;
4. run VERIFY-FIRST against the real system;
5. reconcile differences;
6. classify RESUME, WATCH, or ADVANCE;
7. continue from the verified boundary.

The handoff never overrides the live system.

## Portability

SIGA is not Git-specific, but its definition remains repository-owned for the application.

Map the same semantics onto the environment:

- GitHub/GitLab: branch → PR/MR → CI → review → merge;
- Canva: design → comments → approval → export;
- Trello: board → card → checklist → blockers;
- Notion: spec → tasks → decisions → status;
- SaaS: workspace → jobs → state machine → logs;
- Infra: environment → deployment → health → incidents;
- Agents: run → child agents → outputs → pending actions.

The invariant flow is always:

**RECONCILE → CLASSIFY → EXECUTE → VERIFY → HANDOFF**
