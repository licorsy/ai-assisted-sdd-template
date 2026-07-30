---
title: "Agent Design Guide"
doc_type: manual
description: "Decision-oriented guide for choosing between a deterministic workflow and an autonomous agent, a design checklist for building agents (single responsibility, minimal context, few tools, retries, loop guards), and the three testing dimensions - accuracy, execution cost, reliability - that tell whether an agent actually works. Consulted when designing or adopting an agent or automation; adds no phase activity or gate."
status: active
version: "1.3"
created: 2026-07-17
updated: 2026-07-28
language: en
id: agent-design-guide
tags: [agent-design, workflows-vs-agents, agent-testing, llm-as-a-judge, automation]
owner: Alexandre Clemente
related: [operation-manual, prompt-engineering-guide, tool-library-catalog, 056-prompt-local-note-tips-distillation]
---

# Agent Design Guide

Changelog of this document:

- v1.3: doc-consistency-reviewer batch fix: Section 3's worked-example list corrected - `template-init` is a slash command, not a subagent, and `orchestrator` (the largest file in `agents/`) was missing entirely (prompt-087).
- v1.2: New Section 2.1 documents the `*.opt-in.md` declarative-extension convention as a tier lighter than "workflow" - reference material only, no extension file built (prompt-081).
- v1.1: Section 3's worked-example subagent list gains `doc-consistency-reviewer`, the fourth standard subagent - finding from a project generated from this template (prompt-058).
- Older entries: see `git log --follow` on this file (retention per `documentation-metadata-standard.md` Section 2.1, prompt-033).

---

## 1. Purpose and scope

This guide answers three questions that come up whenever this repository - or a project generated from it - considers building or adopting an LLM-powered automation:

1. Should this be a **workflow** (a fixed, deterministic sequence) or an **agent** (a model deciding its own next step)?
2. If an agent: what design rules keep it reliable?
3. How do you test that it works?

It is reference material, consulted at need; it adds no roadmap activity and no gate. Neighboring concerns stay where they are: *which model tier* runs a task is [operation-manual.md](operation-manual.md) Step 16; *when to delegate to subagents and parallelize* is Step 16a; *how to write the individual prompt* is [prompt-engineering-guide.md](prompt-engineering-guide.md); *whether a vetted tool already exists* is the tool-hunter flow ([tool-library-catalog.md](tool-library-catalog.md)).

## 2. Workflow or agent - the decision

Default to the simplest thing that works: a plain script beats a workflow, a workflow beats an agent. Escalate to an agent only when the task genuinely needs runtime judgment.

| Choose a **workflow** when you need | Choose an **agent** when you need |
| --- | --- |
| Predictability in execution | Open-ended scenarios with no fixed procedure |
| A controlled, ordered sequence of steps | Flexibility in decision-making at run time |
| Consistent, reproducible results | Adaptability to situations not defined in advance |
| Deterministic output at each step | Dynamic behavior driven by intermediate results |
| Predictable data flows between steps | Open flow between the user and the agent (interactive back-and-forth) |
| Reliable, pre-plannable error management | Open flow between two or more agents |
| Rule-based automation ("if X then Y") | Autonomous action toward a goal, not a script |
| Complex but *fixed* orchestration of multiple agents | - |

Two clarifications the table compresses:

- **Multi-agent is not automatically "agentic."** A pipeline that always runs researcher → writer → reviewer in that order is a workflow whose steps happen to be agents - and it inherits a workflow's testability. Reserve open agent-to-agent flow for problems where the routing itself must be decided at run time.
- **Hybrids are the common case.** This repository is one: the roadmap's phase gates, checkers, and Spec Kit pipeline are the workflow spine; judgment-heavy activities inside a phase (research, review, design) run as agents. Put determinism at the boundaries and autonomy inside them.

### 2.1 An even lighter tier: declarative opt-in extensions

Below "workflow" sits a tier lighter still: a declarative `*.opt-in.md` file naming a behavior to turn on (for example `security-baseline.opt-in.md`, `property-based-testing.opt-in.md`) with no executable logic of its own - the consuming agent or workflow reads the file's presence as a flag, not as instructions to interpret at runtime. Reach for this instead of a workflow or agent when the "automation" is really just a toggle a simpler project wants available without writing either. This repository does not currently ship any `*.opt-in.md` extension; the convention is documented here as an available pattern for when one is needed, not built speculatively ahead of a real use case.

## 3. Agent design checklist

When an agent is warranted, these rules keep it debuggable and cheap. The repository's own subagents (`agents/`, `.claude/agents/` - orchestrator-reviewer, adversarial-reviewer, tool-hunter, doc-consistency-reviewer - plus the orchestrator and template-init procedures in `agents/`) are worked examples of the first three rules.

1. **Single responsibility (micro-agents).** One agent, one job, stated in one sentence. An agent that reviews *and* fixes *and* deploys is three agents wearing a trenchcoat - split it. Small agents compose into workflows; large ones only accumulate failure modes.
2. **Minimal context.** Give the agent only the context its job needs. Extra context is not free: it costs tokens, dilutes attention, and widens the blast radius of a misreading.
3. **Few tools, distributed among specialists.** There is no golden number, but the recommendation is to keep the count low; when the list grows, split the toolset across specialist agents instead of widening one generalist. Tool choice is the agent's main failure surface - every added tool multiplies the ways a step can go wrong.
4. **Retries on error.** Wrap fallible calls (APIs, tools, parsing) in bounded retries with backoff - implemented in the harness via callbacks/hooks around the call, not by asking the model to "please try again" in the prompt.
5. **Guard against task loops.** An agent retrying the same failing action, or two agents handing the same item back and forth, burns budget without progress. Bound iterations, detect repeated states, and define what happens at the bound: escalate to a human or fail explicitly - never loop silently.
6. **Reserve reasoning capacity for complex agents.** Extended reasoning / reasoning-tier models earn their cost on judgment-heavy agents (review, design, diagnosis) and waste it on mechanical ones - this is Step 16's tiering logic applied to agents, and the same escalate-only-when-hard rule applies.

## 4. Testing an agent

An agent that "seems to work" has been demoed, not tested. Exercise it on a fixed scenario set - happy paths, edge cases, and failure injections (a tool erroring, an API refusing) - and check three dimensions:

| Dimension | Question | How to check |
| --- | --- | --- |
| **Accuracy** | Does the agent produce the expected response? | Compare against expected outputs; for open-ended outputs, use an LLM-as-a-judge with an explicit rubric (the checklist technique of [operation-manual.md](operation-manual.md) Step 17) - and spot-check the judge itself against human judgment before trusting it |
| **Execution** | What does a run cost? | Measure time, tokens, and memory per scenario; watch the trend across versions - cost regressions are regressions |
| **Reliability** | Does the agent behave correctly along the way? | Assert on the trace, not just the result: were the expected tools called (and unexpected ones not)? Are injected errors handled per checklist rule 4? Are API rate limits respected? |

Reliability is the dimension teams skip and the one that bites in production: a right answer reached by calling the wrong tool, swallowing an error, or hammering an API is a failure that accuracy testing cannot see.

For this repository's own subagents, the independent-review and adversarial gates ([operation-manual.md](operation-manual.md) Step 14) already provide the accuracy check at the artifact level; this section matters most when a generated project ships agents of its own.
