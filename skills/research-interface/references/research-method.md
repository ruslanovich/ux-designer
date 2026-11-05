# Research for an interface decision

Read when choosing sources, assessing a recommendation, or deciding whether more research can change the design. R40 defines this system's research workflow. Its triggers, handoffs, and stopping rules are operational requirements, not a validated universal method.

## R40 — Link research to the current task

State the question before collecting sources. For orientation, ask what commonly breaks in this kind of work and which considerations the current diagnosis may miss. For a decision, identify the meaningful alternatives and the condition that could favor each.

Examples include preserving selection across a filtered bulk operation, balancing dense information with reading order, choosing how to expose an object's lifecycle, or adapting a long form to a native platform. Keep the question at the level of the user's work; a search for generic design inspiration may not answer it.

Use existing project research when it applies and access is authorized. Keep reported feedback, observed behavior, and inferred requirements separate. Public research can suggest a hypothesis about the product; it cannot supply an unknown business constraint or establish this audience's behavior.

## Select and read sources

Prefer the original professional author or team and the material that explains the recommendation, context, and tradeoffs. Use professional design practice as the main corpus; government-service guidance is not the default foundation for this project. Avoid treating search rank, a familiar logo, or professional authorship as sufficient proof.

Use the relevant part of a source in its context. Check whether an article presents research, an experienced opinion, a retrospective case, a platform rule, or an example for inspiration. When it cites a consequential claim without explaining its basis, inspect the original evidence if accessible or retain the uncertainty.

| Source type | Useful contribution | Limit to preserve |
| --- | --- | --- |
| Empirical study | Findings with methods, participants, tasks, and conditions | Transfer to different audiences or tasks may need validation |
| Practitioner guidance | A reasoned heuristic, diagnostic technique, or design tradeoff | Expertise does not make the recommendation universal |
| Product design case | The team's problem, alternatives, constraints, and reported outcome | A successful choice in that product may not fit this one |
| Platform guidance or standard | Applicable component behavior, conventions, or exact requirements | Distinguish normative criteria from informative guidance and scope them to the target |
| Visual reference | A visible treatment worth examining for a specific purpose | Appearance alone does not reveal behavior, usability, or hidden states |

Check currency when a decision depends on a current platform, component version, or product behavior. Stable principles need relevant reasoning and context; recency alone does not make a source stronger. Read substantive content rather than relying on a title, preview image, or search excerpt.

## Assess applicability and conflicts

Compare the source's audience, task, data scale, usage conditions, platform, and constraints with the brief. Ask which finding survives that comparison and which assumption still needs evidence. Inspect the reference fragment the user actually selected; do not import an unrelated product's entire structure.

When recommendations conflict, first check whether they concern the same circumstances. Then compare the evidence, exceptions, and consequences for the required task and capabilities. Choose a reasoned direction or name the specific fact that would decide it. Avoid resolving a conflict by counting agreeing articles.

Represent the conclusion compactly in existing notes. Retain the question, source location, evidence type, relevant finding, fit and limitation, and effect on the current choice. Add a suitable check when a material hypothesis remains. These are useful contents, not mandatory fields or questions for the user.

For example, research about partial bulk-operation failures may justify showing affected records and a recoverable selection. The product's permitted operations, rollback support, and error semantics still come from its own requirements and implementation.

## Bound the work

For a broad redesign, an orientation pass should help choose what to inspect or compare more deeply. For a narrow question, stop once the decision has a defensible basis and its limits are understood. Repeated advice, an unchanged decision, or a question that now requires product-specific evidence signals a useful stopping point.

Record sources actually read. If a useful page cannot be accessed, find an appropriate accessible primary source or identify the remaining gap. Do not label an inaccessible article as reviewed or keep searching merely to reach a quota. If tools are unavailable, use the provided materials and existing corpus and qualify the affected decision.

## Basis

[Mayya Azarova, Secondary Research in UX, NN/g (2022)](https://www.nngroup.com/articles/secondary-research-in-ux/) describes defining a problem, examining internal and external material, assessing limitations, and refining unanswered questions. It also cautions that findings from a different audience may supply hypotheses for further investigation. Our module routing and decision record adapt this guidance to agent work.
