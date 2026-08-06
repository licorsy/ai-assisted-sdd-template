---
title: "Tool Hunter Prompt"
doc_type: instruction
description: "Two-mode prior-art search before building from scratch: Mode A finds Claude Code tools (Agents, Skills, Hooks, MCP servers, Commands) for the catalog, Mode B finds product frameworks/libraries/services for roadmap Phase 1 Activity 11a's build-vs-buy record. Records any tool meeting a concrete need with a signed security level, rather than filtering candidates on a freshness/rating gate."
status: active
version: "1.9"
created: 2024-07-06
updated: 2026-08-06
language: en
id: tool-discovery
tags: [tool-hunter, subagent, tools, discovery, agent, catalog, build-vs-buy]
owner: Alexandre Clemente
related: [tool-library-catalog, operation-manual, documentation-metadata-standard, roadmap]
---

# Tool Hunter Prompt

Changelog of this document:

- v1.8: doc-consistency-reviewer batch fix: `## Tasks` step 1 now carries the "ask before proceeding if the mode is unclear" rule, previously only in the `.claude/agents/tool-hunter.md` adapter (a third recurrence of the same adapter-vs-canonical class `prompt-095`/`prompt-096` (archived private-repo sequence, not a citable path in this repository) already fixed twice); Mode B's first bullet no longer paraphrases the "7-day freshness bar" contrast the Mode B heading was already rewritten to retire at v1.7 (prompt-096 verified only the exact retired phrase, missing this paraphrase); Context section no longer instructs a reader to invoke the Claude-Code-only adapter (prompt-097).
- v1.7: doc-consistency-reviewer batch fix: retires the "7-day freshness bar" contrast from the Mode B heading (Mode A's own recency check was already redefined as supporting evidence, not a gate); the Mode A re-research caching rule, previously only in the `.claude/agents/tool-hunter.md` adapter, now also lives in this canonical file's Rules, Constraints, and Considerations section; `## Tasks` step 2's "passes vetting" wording corrected to match this file's own "not pass/fail gates" Mode A model (prompt-096).
- v1.6: doc-consistency-reviewer batch fix: `## Tasks` step 2 now instructs bumping `docs/manuals/tool-library-catalog.md`'s frontmatter `lastreviewed` field to today's date for Mode A - previously no instruction anywhere set this field after its initial creation (prompt-095).
- Older entries: see `git log --follow` on this file (retention per `docs/manuals/documentation-metadata-standard.md` Section 2.1, prompt-033).

---

## Context

Each phase of the software development workflow (`docs/strategy/roadmap.md`) has inputs, activities, generated artifacts, and acceptance/completion criteria. Rather than rebuilding capability from scratch, or re-researching product frameworks and libraries from scratch on every project, this prompt drives one reusable search across two distinct modes; in Claude Code, the `tool-hunter` subagent (`.claude/agents/tool-hunter.md`) runs it:

- **Mode A — Claude tool discovery**: finds Claude Agents, Skills, Hooks, MCP servers, or Commands that already perform a capability needed to produce a roadmap artifact or automate an activity, in any phase. Findings go in the template-level, cross-project `docs/manuals/tool-library-catalog.md`.
- **Mode B — product solution research**: finds frameworks, libraries, or services for the software product actually being built, specifically for roadmap Phase 1, Activity 11a — and explicitly flags when a candidate is a *complete, adoptable solution* rather than just a library or component, since that finding feeds Activity 10's build-vs-adopt checkpoint, not only the framework/library angle. Findings go in that project's own `/docs/references/build-vs-buy.md`, not the catalog — Activity 11c already names that file as the destination.

Both modes share the same discipline — search live, verify every claim against the tool's real source, never fabricate — but use different vetting bars, because a fast-moving Claude Skill and a mature, stable software framework are not judged the same way.

## Rules, Constraints, and Considerations

Remember to follow the project and metadata standard.

Keep both destinations lean and needs-driven: only research and record a tool or library when there is a concrete, current need named by a roadmap activity, artifact, or an explicit request. Never build a broad, speculative, or exhaustive catalog "just in case" — a small number of tools actually needed for actual activities, not a huge and complex library.

Do not invoke tool-hunter, in either mode, to search for a capability already covered by a mechanism already installed in this operating model — for example, Spec Kit's own `/speckit.constitution`, `/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, and `/speckit.implement` already cover constitution, spec, plan, task, and implementation generation. Searching for a third-party alternative to a command that ships with the installed toolchain is out of scope for tool-hunter.

Do not re-research a Mode A catalog entry already checked within the last 7 days and already marked `adopted` or `rejected` for the same need, unless explicitly asked to re-verify it — a recency check on an already-decided entry, not a vetting gate on a new candidate (Mode A records recency as supporting evidence, never as a pass/fail gate; see the Mode A criteria below).

### Mode A vetting criteria (Claude tools -> `docs/manuals/tool-library-catalog.md`)

Record any tool that meets a concrete, current need; do not discard a candidate for being new or fast-moving. For each recorded tool, sign a security level — trusted / caution / unvetted — with a short justification, and record the following as supporting evidence, not as pass/fail gates:

- Tested;
- Validated or used;
- Rating;
- Last updated.

See `docs/manuals/tool-library-catalog.md` for the full criteria detail, security-level definitions, and entry schema.

### Mode B vetting criteria (product frameworks/libraries -> `/docs/references/build-vs-buy.md`)

Mature, stable software isn't judged on recency the way a fast-moving Claude Skill is. Instead:

- Actively maintained (regular releases, issues get triaged — judged on sustained maintenance, not on how recent the last commit is);
- Security-patched (no known unpatched critical CVEs at time of check);
- License-compatible with the project;
- Real adoption evidence (stars, production usage, community size), cited, not assumed.

After completing a search, reconcile the project: update the relevant catalog or build-vs-buy entry, and record the tooling decision in an ADR when Activity 11d applies.

## Tasks

1. Determine which mode applies — Mode A for a Claude Agent/Skill/Hook/MCP server/Command, Mode B for a product framework/library/service. If the mode is not clear from the request, ask the human before proceeding rather than guessing. In Claude Code this runs as the `tool-hunter` subagent (`.claude/agents/tool-hunter.md`).
2. Record every candidate that meets a concrete, current need in the correct destination for its mode, with its signed security level (Mode A) (`docs/manuals/tool-library-catalog.md` for Mode A, the project's `/docs/references/build-vs-buy.md` for Mode B), each with a description of what it does and how to use it. For Mode A, also bump `docs/manuals/tool-library-catalog.md`'s frontmatter `lastreviewed` field to today's date — it tracks the catalog's most recent review activity as a whole, not any single entry (see `docs/manuals/documentation-metadata-standard.md` Section 3).
3. During the software development process, the human decides whether to adopt a found tool or solution, or let the AI proceed via the normal roadmap process — the agent proposes, it does not decide.
