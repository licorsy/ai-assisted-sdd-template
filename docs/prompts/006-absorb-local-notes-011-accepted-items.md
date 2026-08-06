---
title: "Prompt 006: absorb the accepted items from the business-tech-agency upstream batch, and close the superseded prompt 005"
doc_type: prompt
description: "Named batch (operation-manual.md Step 12 rule 9) of fourteen individually-minor changes: closes prompt 005 as superseded and resolves the vacuous blocking `facts` block it left behind, fixes two self-contradictions in roadmap.md that a downstream project re-flagged at three and seven consecutive cycle closures, adds four absent conventions the same project's session evidence justified (data-source verification before scoping, stated-reason departures, the non-retroactive data principle, the figure-carries-a-decision criterion), scopes the impossible-specimen rule so it resolves rather than ignores two live contradictions, widens P9's trigger from taste to information design, adds acceptance criteria to the orchestrator's readiness checklist, reframes ADR-0003 principle 4 as ownership, and corrects the operation manual's CI-checks table, which still listed three workflows retired in 2026-07."
status: archived
version: "1.2"
created: 2026-08-03
updated: 2026-08-06
language: en
id: 006-absorb-local-notes-011-accepted-items
tags: [prompt, batch, roadmap, conventions, docgov, prompt-lifecycle]
owner: Alexandre Clemente
related: [005-fix-commit-lint-merge-subjects, operation-manual, roadmap]
---

# Prompt 006: absorb the accepted upstream items, and close the superseded prompt 005

## ROLE

Act as the maintainer of this template repository absorbing a batch of learnings carried *up* from a project generated from it, after each item was individually verified against this repository's real state and roughly a dozen of the batch's premises turned out to be false here.

The specific discipline this scenario demands: **an item's evidence being real downstream does not make its premise true upstream.** Several items in the source batch describe extending a rule this repository does not have, renaming a token that does not exist here, or resolving a conflict that a file already resolves. Each change below is scoped to what was actually verified, and the corrections to the source batch's own claims are recorded, not silently dropped.

## CONTEXT

This repository is a GitHub template for AI-assisted, Spec-Driven Development. Its adopter tier is consultancy/agency, executed solo — `docs/adr/0002-audience-tier.md` (Accepted).

An untracked working note, `local-notes/011-ai-assisted-sdd-template-updates.md` (the directory is in `.gitignore` and is deliberately not part of the corpus), carried fifteen proposals up from a single long `business-tech-agency` session on 2026-08-03. That session ran a maintenance pass, a next-increment ruling, prior-art research, two founder-reviewed prototype rounds, a scope refocus, and a full Discovery pass — exercising the operating model hard enough to surface conventions this template does not have.

The note's own TASK required a verdict per item **before any edit**, precisely because several items were motivated by incidents specific to that project. That verification ran and confirmed the caution: twelve premises are false or incomplete here. This prompt executes only the subset that survived, and records the corrections.

Two facts about the source batch that shape this prompt:

1. **Item 4's stated premise is wrong.** It describes itself as generalizing "the template's existing never-test-against-fabricated-data discipline" from testing to scoping. That rule does not exist here. This repository's anti-fabrication discipline covers *asserted claims, dates and citations* (`agents/orchestrator.md` operating rule 4, `agents/tool-discovery.md`, `docs/manuals/documentation-metadata-standard.md`), never test data. The item is adopted as a **new** rule, recorded as such.
2. **Item 5's part 2 is contradicted by two live files.** `docs/manuals/examples/spec-prfaq-template.md` asks for an "invented but realistic" user quote, and `docs/references/telemetry-template/README.md` describes "three realistic lines". Adopting "make specimens impossible, not plausible" verbatim would put the convention in conflict with two artifacts on day one. It is adopted **scoped** instead, so the two existing files stay correct.

Separately, **prompt `005` carries unexecuted work that can no longer be executed as written.** Its TASK items 2 and 3 required a `facts` entry in `.docgov.config.js` pinning `git log --no-merges --format=%s` in the Conventional Commits step of `.github/workflows/pr-checks.yml`. Commit `9257c73` subsequently removed that step entirely, for an independent and correct reason recorded in the workflow's own comment: on a promotion pull request every commit in range is already merged, so the lint could only ever report unfixable history. What survives today is a `facts` block with `shadow: false` and `entries: []` — a blocking rule that checks nothing, under thirteen lines of comment describing a check that no longer exists.

## TASK

Fourteen items. Each is individually minor; none is structural. Items 1-2 close the prompt-005 thread; items 3-4 fix contradictions; items 5-13 add or adjust conventions; item 14 fixes drift found during the verification and not requested by the source batch.

### Closing prompt 005

1. **Record the supersession in prompt `005`'s own body**, then flip it to `status: deprecated` and update `docs/prompts/PROMPT-INDEX.md`. `docs/manuals/operation-manual.md` Step 11 rule 4 is the governing line: flip to `deprecated` when a prompt is superseded, and record the reason **in the prompt's own body**, not only in the index. State which commit superseded it and why that removal was correct — the prompt must not read as abandoned.

2. **Resolve the vacuous `facts` block** in `.docgov.config.js`. Replace the stale comment, which describes pinning a workflow step that no longer exists, and give the block a real entry: pin the `promotion-source` job's base-ref guard in `.github/workflows/pr-checks.yml`, which does exist and is load-bearing — a promotion pull request into `staging` must come from `develop`, and into `main` from `staging`. This preserves prompt 005's actual intent, a blocking rule that pins something real, rather than leaving a decorative block. Keep `shadow: false`; leave `dead_citations` untouched at shadow, per prompt 004's still-standing reasoning.

### Fixing contradictions in the roadmap

3. **Phase 3 no longer claims to produce tasks.** `docs/strategy/roadmap.md`'s Phase 3 "Acceptance criteria / Done" contains `- SPEC becomes tasks.`, while Activity 12 of the *same phase* runs `/speckit.plan` explicitly "without breaking it into tasks yet", and Phase 4's goal is "Turn the SPEC into small, clear, traceable tasks". Every other document places task generation in Phase 4 (`docs/manuals/operation-manual.md`'s phase-command table and Step 5 command order, `docs/visuals/template-visual-overview.md`). Rewrite the Phase 3 criterion so it states the condition Phase 3 actually reaches — a SPEC ready for decomposition — instead of the act Phase 4 performs. Downstream this was re-flagged at three separate cycles, each accepting the same deferral because the file is sync-managed upstream.

4. **`test-report.md`'s phase is stated, not implied.** The artifact is listed under both Phase 5 and Phase 6 "Generated artifacts", and `docs/manuals/documentation-metadata-standard.md` already resolves it as `Phase 5 / 6`. The roadmap does not say so, so seven consecutive downstream cycles re-caught it at exit review. Make the roadmap say what the standard already says. **Do not move the bullet** — `CHANGELOG.md` records that the previous fix deliberately chose to add it to Phase 6 rather than move it from Phase 5.

### Adding the absent conventions

5. **Verify the data source before scoping a data-dependent feature.** New Phase 1 activity, adjacent to the build-vs-buy verdict: before a cycle commits to a feature that depends on a data source, confirm the source exists, holds real data rather than fixtures, and will still hold real data when the feature ships. Downstream this check scoped out an entire business-metrics layer on one verified fact — the commercial ledger was three rows, each prefixed `TEST FIXTURE`, including its only client invoice. Record it as a new rule; do not describe it as extending an anti-fabrication rule that covers claims, not data. Add it as a lettered sub-activity (`10a`), not a new number: the list is cited elsewhere as "Activities 9-14", and renumbering is the enumeration-drift class `ADR-0003` principle 4 exists to prevent.

6. **A departure from an earlier artifact carries its reason, in the artifact.** When a later artifact in the same cycle reaches a conclusion that contradicts an earlier one, the departure is written down with its reason and its deciding evidence, in the later artifact. Detection is already covered three times over (`agents/phase-reviewer.md` step 5, `agents/adversarial.md` item 7, `agents/doc-consistency.md` category 1) and ADR supersession is covered by `docs/manuals/role-operating-guide.md`. The missing half is the **authoring-time** obligation for the non-ADR, same-cycle case. Add only that half, and point at the existing detection rather than restating it.

7. **Name the non-retroactive data principle.** Some facts can only be recorded at the moment they occur; a discipline that assumes everything can be mined later is wrong for that class, and the correct response is to identify those fields *before* the generating event. This is the honest counterweight to this repository's own derive-don't-duplicate principle, which is stated four times (`docs/adr/0003-document-architecture.md` principles 2-4, `docs/manuals/operation-manual.md` Step 13, `README.md`) while the tension is stated nowhere. The event-time half exists today only as one optional artifact's rationale in `docs/references/telemetry-template/README.md`. Add it as a principle in `ADR-0003`, adjacent to the principle it counterweights.

8. **Reframe ADR-0003 principle 4 as ownership.** It currently reads as a rule about *duplication between two places*. Extend it to state the ownership form directly: a cumulative or open-ended fact — a review-pass count, a cited file's version — is owned by exactly one document and referenced everywhere else. Substantively overlapping with what is there; the addition is saying why cumulative facts are the class that needs it.

9. **Acceptance criteria enter the readiness checklist.** `agents/orchestrator.md` Step 3 lists seven items and does not mention acceptance criteria at all; the nearest is "The phase goal was achieved." Add them, with a three-state record per criterion — met directly, met via a local analog, or not applicable with the reason — rather than a bare determination. Reuse the formulation already written twice in `agents/adversarial.md` and `agents/doc-consistency.md`: *"not applicable" must be stated, not skipped*. Do not restate the criteria list itself; ADR-0003 principle 4 explicitly names the role guide's checklist versus the roadmap's acceptance criteria as a pointer-over-copy pair.

10. **A figure with no attached decision is decoration.** An artifact that reports numbers to a human earns each figure only if it carries an owner, a target or expectation, a trend, and an expected action; otherwise the figure is removed. Downstream this condemned a bare "21 open risks" tile — decomposed by probability × impact, the same 21 isolate exactly one in the high/high corner, which is actionable where the total was not. Anchor it in `docs/manuals/role-operating-guide.md`, adjacent to the existing five-things rule for status updates, which is the same criterion applied to prose. Record its sourcing honestly: it arrived via a vendor-blog-sourced analysis, adopted because it was validated in place, not because the source is authoritative.

11. **Specimen data: scoped, so it resolves the two contradictions instead of ignoring them.** The rule is that a specimen value a reader could mistake for the product's own output must be *impossible* — not plausible. It does not reach illustrative prose quotes or format examples, which are meant to read as realistic. This keeps `docs/manuals/examples/spec-prfaq-template.md`'s "invented but realistic" quote and `docs/references/telemetry-template/README.md`'s "three realistic lines" correct rather than putting the new convention in conflict with them on day one. The reason the reinforcement is needed at all is that a correct label demonstrably is not enough: downstream, a founder misread a cost figure whose label was the answer's own first line. Part 1 of the source item — that location decides legitimacy — is **already covered** in six or more places and is not restated.

12. **Stale task checkboxes at closure: written guidance only.** At the Phase 7 closure, every task in the cycle's task artifact is checked, or each unchecked one is disclosed in the closure record. Downstream, a cycle reached production with 39 of 42 tasks checked, and one of the three unchecked is recorded elsewhere in the same repository as having been executed. Add the guidance, and record explicitly why the **mechanical** half is not adopted here: this template has no `tasks.md` in its vocabulary (the artifact is `docs/task.md` or `.specify/tasks/sprint-backlog.json`), `docs/references/gate-verification-template/verify-gate.js` states that it never reads "Acceptance criteria / Done" bullets, and `.docgov.config.js`'s own header rules that a check which does not exist goes to the engine, not to the config.

13. **P9's trigger widens from taste to information design.** `docs/manuals/prompt-engineering-guide.md`'s P9 already prescribes disposable prototypes during Phase 1, before requirements — the source batch's item 1 is **already covered**, including its Section 12 trigger row and its binding at roadmap Phase 1 Activity 4. Two real gaps: P9 fires on a *taste* question, but the downstream evidence was information-design defects (an in-flight cycle invisible to the product, two currencies rendered adjacent with no declared rate, a bare count that decides nothing) on surfaces whose taste was already settled; and P9 has no constraint on the numbers inside the prototype. Widen the trigger, update the matching Section 12 row **and** the two other copies of the same claim (`docs/strategy/roadmap.md` Activity 4, `docs/visuals/template-visual-overview.md`'s runtime-trigger flowchart node) so they do not drift — this exact pair desynced once before, recorded in the guide's own v1.6 entry. Add the constraint from item 11 as a pitfall: every number in a prototype either comes from the real system or is visibly a placeholder.

### Drift found during verification

14. **The operation manual's CI-checks table is corrected.** `docs/manuals/operation-manual.md` Step 15 still lists `docs-frontmatter-lint.yml`, `broken-link-check.yml` and `changelog-retention-check.yml` as live; all three were retired and none exists in `.github/workflows/`. The table also omits `pr-checks.yml` and `scorecard.yml`. `ADR-0003` principle 5's own checker list carries the identical stale trio and is corrected in the same edit, since it is the same enumeration. Not requested by the source batch — found while inventorying this repository's mechanical checks for item 12. ADR-0003 principle 4 names "a CI-checks list" as a pointer-over-copy case, which is why this drifted.

## REQUIREMENTS, CONSTRAINTS AND RULES

- **[CRITICAL]** Verify the new `facts` entry by breaking it. Remove the pinned pattern from the workflow, confirm `docgov check` exits non-zero and names the fact, then restore. A pin accepted on the strength of a passing run proves nothing — this is prompt 005's own constraint, and it is the part of 005 that remains valid. Restore from a copy taken **before** the edit, not with `git checkout <file>`, which restores from the index and silently discards uncommitted work.
- **[CRITICAL]** Do not restate any rule this repository already has. Items 1, 5 part 1, and the detection half of item 6 were verified as already covered; the deltas above are what is missing, and only the deltas get written. Where the source batch claimed a gap that does not exist, the correction goes in this prompt, not into the corpus.
- **[HIGH]** Every touched document gets a `version` bump, an `updated` date, and a body-changelog entry where it carries one — retention is three entries, older ones live in `git log --follow`.
- **[HIGH]** `dead_citations` stays shadow. Do not attempt to reduce its backlog here, and do not restate that backlog's size anywhere - it is a cumulative fact whose only owner is the tool's own output; that recreates the whack-a-mole loop the rule exists to end.
- **[MEDIUM]** Item 7's principle is an amendment to an Accepted ADR, so it carries an amendment line in `ADR-0003`'s own Status, matching how principle 4's own extension was recorded. Adding a sixth principle also makes `ADR-0004`'s "all five of ADR-0003's principles" statement read as a stale count; time-scope that sentence in the same batch rather than leaving the next audit to find it.
- Do not rename `docs/business/`, do not touch `docs/strategy/go-to-market.md`, and do not act on the market-vocabulary item — all three are handled elsewhere or deliberately out of scope.
- `local-notes/` is untracked and excluded from every governance rule. Do not cite it as a path in any corpus document; its content is summarized here instead, which is what makes this prompt the durable record.

## FORMAT AND OUTPUT

Executed as edits on the branch `chore/absorb-local-notes-011-and-close-active-prompts`, against: `docs/prompts/005-fix-commit-lint-merge-subjects.md`, `docs/prompts/PROMPT-INDEX.md`, `.docgov.config.js`, `docs/strategy/roadmap.md`, `docs/adr/0003-document-architecture.md`, `docs/adr/0004-docs-category-directories.md`, `agents/orchestrator.md`, `docs/manuals/role-operating-guide.md`, `docs/manuals/prompt-engineering-guide.md`, `docs/manuals/operation-manual.md`, `docs/visuals/template-visual-overview.md`, plus `CHANGELOG.md` and a regenerated `docs/STATE.md`.

Verification: the five repo-local governance scripts pass, `node --test .github/scripts/*.test.js` passes, `docgov check` exits 0 with the `facts` rule green and verified-by-breaking, and `docs/STATE.md` is not stale.
