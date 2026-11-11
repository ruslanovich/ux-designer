# Review: service-plan comparison

## Verdict

**The described implementation does not solve the original task.** A customer must compare three service plans on monthly total, minimum commitment, included service visits, and cancellation cost before purchase. The chosen flow provides no comparison view or retained comparison context, and returning to the catalog clears the selected plan and its terms. The central issue is the chosen interaction design. The supplied description reports that implementation follows it exactly. [1]

This is a document-based expert review. It establishes a conflict between the original requirement and the described solution. It does not independently establish production behavior or customer outcomes.

## Scope and evidence

**Check question:** Can a customer use the described flow to compare the four required facts across all three options, choose a plan, and revisit the options before committing?

The supplied task remains unchanged. The platform is unspecified; no native-platform or browser-specific requirements have been assumed. The project initially contained only `BRIEF.md`, with no source code, screenshots, prototype, executable application, or backend evidence.

| ID | Evidence and its status | Use in this review |
| --- | --- | --- |
| E1 | Original task in `BRIEF.md`: inspected document (`observed`); adopted requirement (`decision`) | Defines three options and the four facts required for each. |
| E2 | Chosen plan in `BRIEF.md`: inspected design text (`observed`); adopted design (`decision`) | Defines popular-plan entry, disclosure after Continue, separate catalog access, and reset on return. |
| E3 | Implemented behavior in `BRIEF.md`: another party's account (`reported`) | Describes correspondence with E2. No runtime observation was supplied or performed. |
| E4 | Local project file inventory (`observed`) | Establishes the available review material and the limits of independent verification. |

Catalog availability is reported in E1. Actual plan values, wording, and data correctness remain unknown.

## Material findings

### F1 — Required comparison is missing

**Priority:** blocks the stated task. **Status:** `mismatch` in the described concept and behavior. **Basis:** E1–E3; R41 and R32. [1][2]

**Expectation:** Before committing, a customer can compare the monthly total, minimum commitment, included service visits, and cancellation cost for each of the three options.

**Method and conditions:** Walked through the states explicitly described in the brief: popular-plan entry → Continue → that plan's facts → purchase, with a return to the separate catalog to reach alternatives.

**Observation:** The initial state presents one option. Continue reveals facts for that option. Alternatives are on another screen, and the brief explicitly states that no view or retained selection presents the options together. The required comparative decision is absent from the designed path.

**Consequence:** The interface does not supply a usable comparison context. A customer would need to carry facts between screens through memory or external notes if they wanted to complete the comparison. The effort or error rate this causes for actual customers has not been measured.

**Proposed correction:** Revise the plan to expose all three options and the same four clearly labeled facts in a comparison-capable flow before purchase. A compact comparison table is a suitable starting point. A constrained layout can use stacked or sequential presentation with persistent comparison context. “Most popular” can remain a recommendation cue alongside access to every option.

### F2 — Returning to alternatives discards the decision context

**Priority:** materially obstructs comparison and reconsideration. **Status:** `mismatch` in the described concept and behavior. **Basis:** E1–E3; R32 and R41. [1][2]

**Expectation:** Revisiting alternatives supports the ongoing comparison and lets the customer continue from a meaningful selection. This is a task-derived design judgment; the original brief does not prescribe a particular state-storage mechanism.

**Method and conditions:** Inspected the described return transition from plan facts to catalog.

**Observation:** Both the chosen plan and its terms are cleared. No retained comparison state is provided.

**Consequence:** The return path removes the very context needed to evaluate an alternative against the current candidate. This reinforces F1 and makes a local presentation adjustment insufficient.

**Proposed correction:** Preserve the candidate plan and relevant comparison context while opening details, returning to the catalog, and switching between options. Define when selection changes or resets. A candidate should remain recoverable until the customer deliberately changes it or ends the selection task. Fresh commercial terms must still be confirmed at purchase; persistence should not imply that old prices are guaranteed.

## What is supported and what remains unverified

| Check | Method and conditions | Observation | Status |
| --- | --- | --- | --- |
| The concept represents the original comparison task | Requirement-to-flow review of E1 and E2 | Required cross-plan comparison is absent | `mismatch` |
| The described return path preserves useful comparison context | Transition review of E2 and E3 | Selection and terms are explicitly cleared | `mismatch` |
| Selected-plan disclosure occurs before purchase in the described sequence | Read E2 and E3 | Continue precedes disclosure; purchase follows disclosure | `supported_in_conditions` — documentary sequence only |
| The implementation independently matches the plan | No source or executable interface supplied | — | `unverified` — E3 reports correspondence |
| Actual values cover all four fields accurately for all three plans | No catalog records or rendered details supplied | — | `unverified` |
| Rendering, responsive layout, keyboard operation, accessibility, and production purchase/return behavior | No runtime or rendered artifact available | — | `unverified` |

The brief does not establish that Continue itself commits the customer. Revealing the selected plan's facts after Continue therefore does not, by itself, demonstrate commitment before disclosure. The supported failure concerns the complete comparison task.

## Next steps and ownership

| Owner | Question or action | Reason and dependencies |
| --- | --- | --- |
| `plan-interface` | Replace the single-plan path with a complete compare → select → review → purchase flow, including detail and return states | F1 and F2 originate in the accepted plan. Retain E1's required information and keep the popularity cue if useful. |
| `build-interface` | Implement the revised comparison and state behavior after the revised design is concrete | No implementation divergence is evidenced. The requested correction depends on the revised plan. |
| `inspect-interface` | Obtain the revised prototype or implementation and real catalog values for a focused recheck | Resolves the specific execution and data gaps above. |

A feasible follow-up is one focused walkthrough: compare all three plans on all four facts; select a candidate; inspect another option; return; change the candidate; verify the final purchase review shows the chosen plan's current total and terms. This is a proposed check, with no outcome recorded. Broader customer comprehension or conversion claims would need appropriate audience evidence.

## Checks performed and delivery

Read the complete brief and the local `check-interface` skill with both reference files. Inventoried the project. Traced the original requirement through the documented entry, disclosure, purchase, and return states. Reviewed concept quality separately from reported implementation correspondence. No browser, backend, source-code execution, automated accessibility scan, or user study was performed.

Created this review as `RESULT.md`. No implementation changes were made.

## Sources

1. [BRIEF.md](BRIEF.md), “Original task,” “Chosen plan,” and “Implemented behavior” — primary product evidence.
2. [Local conditional checks](https://github.com/ruslanovich/ux-designer/blob/2082e87858cb0ab67d56978d3da428332f31c748/skills/check-interface/references/checks.md), R32, R41, and R31/R33 — review process and correspondence checks.
3. [Local evidence and routing guidance](https://github.com/ruslanovich/ux-designer/blob/2082e87858cb0ab67d56978d3da428332f31c748/skills/check-interface/references/evidence-and-routing.md), R35 and R36 — evidence scope, statuses, and corrective ownership.
