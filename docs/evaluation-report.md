# Evaluation report for the 0.2.0 candidate

Status: implementation and diagnostic evaluation completed. The unreleased candidate is available in [PR #1](https://github.com/ruslanovich/ux-designer/pull/1).

All 22 hosted-agent runs across 11 synthetic cases finished. The candidate demonstrated the intended scope, research, planning, and review behaviors in the inspected outputs. The baseline also completed the redesigns and performed professional-source research. These observations do not establish improved audience usability, general superiority over 0.1.0, or reproduction of the author's two private project failures.

## Changes under evaluation

| Reported problem | Implemented response |
| --- | --- |
| An existing application receives a few suggestions instead of a completed redesign | The coordinator separates the requested endpoint from the necessary change scope. A redesign of available code normally continues through planning, implementation, and verification. R37 defines local, connected-flow, and product-structure changes while preserving capabilities and explicit boundaries. |
| Attention concentrates on a few structural topics | R38 introduces a conditional coverage scan across tasks, content, architecture, interaction, visual organization, consistency, and use conditions. R39 makes composition, hierarchy, typography, density, and component treatment part of a concrete design. |
| The agent does not independently investigate professional guidance | The new research-interface module and R40 add a bounded orientation pass and decision research, substantive source reading, applicability checks, and explicit consequences for the design. |
| A completed implementation could faithfully reproduce a weak plan | R41 reviews the concept against the original task before checking implementation fidelity and routes conceptual corrections back to planning. |

These are instruction changes. Their presence in a file is separate from evidence that an agent follows them consistently.

## Comparison method

- Baseline: published 0.1.0 commit `65114f479a66e3e9806457bb59018d85f10162f2`.
- Candidate implementation: commit `2082e87858cb0ab67d56978d3da428332f31c748`. The subsequent CI portability correction changed a test and workflow, not the skill instructions.
- Baseline skill-tree SHA-256: `c709ce6e84740fea8f12274b848f8c7028f2bff7e09633ee6b16ff87e99b3dcd`.
- Candidate skill-tree SHA-256: `e5604346390797a4bc41629e864c605832e7d971d376d5c56465650c2f350916`.

Each run used a fresh hosted-agent conversation, an isolated copy of the selected project, the same ordinary task for the pair, and one frozen package. Execution agents received no diagnosis, change specification, evaluator rubric, version label, or previous result. They were told the actual capability condition: Node.js, Python, and online source research were available; a usable browser was not. The package and application files were not shared between execution runs.

The local execution environment was Linux x86_64 with Python 3.12.14 and Node.js v24.22.1. The cross-platform installer checks ran separately on GitHub-hosted runners.

The agents inherited the same parent model configuration. An exact hosted model-build identifier was not recorded. Synthetic task prompts and delivered outputs were in English; multilingual behavior was not separately evaluated. The host's standing autonomy, research, and verification instructions also influenced both variants and can differ from a user's Codex or Claude Code session. These comparisons do not isolate the skill text as the sole cause of behavior.

The coordinating agent reviewed outputs against the separate rubric, compared preserved source files, and independently reran the listed application checks where applicable. That reviewer also implemented part of the candidate and knew the variant labels. This was not a blinded independent usability study. One run per variant per case is a diagnostic sample, not an estimate of reliability.

A separate read-only agent reviewed instruction consistency, publication claims, hashes, links, versions, and archive contents. It found that the prominent remote installation instructions still selected the published release; the README and installation guide now point explicitly to candidate instructions. This final consistency review did not replay behavioral cases or establish runtime compatibility.

The first ten cases follow the change specification. An eleventh, `natural-redesign`, was added after both versions completed the implementation-directed rough-redesign case. It removes the explicit instruction to implement, probing whether that wording masked the reported hesitation. This additional case is a post-hoc diagnostic. The concept-review fixture uses comparison of service plans, avoiding the partial-failure example already present in candidate instructions.

The user's two original projects, exact prompts, and execution traces were not available. All fixtures use synthetic content. The service-operations prototype is a small model of a commercial workflow, not a reproduction of a commercial product.

## Behavioral observations

One baseline and one candidate run were completed for each case. No aggregate success percentage is calculated: implementation behavior, research provenance, and rendered quality have different evidence requirements.

| Case | Baseline observation | Candidate observation | Evidence boundary |
| --- | --- | --- | --- |
| [Rough reading-list redesign](../evals/results/2026-11-05/rough-redesign/) | Delivered a coherent implemented redesign and recovery behavior. | Delivered a coherent implemented redesign, explicit scope rationale, and applied professional guidance. | Original model preserved in both; model and actual-handler tests rerun successfully. Rendered quality remains unverified. |
| [Work-order triage](../evals/results/2026-11-05/commercial-flow/) | Delivered connected queue/detail/assignment behavior, saved views, partial outcomes, history, roles, and export. | Delivered a connected redesign and an authored target-experience SVG; preserved the model and required operations. | Baseline controller tests and candidate handler simulations passed. The SVG is a design artifact, not a browser screenshot. |
| [Local save-error correction](../evals/results/2026-11-05/local-fix/) | Changed only the inline save handler; retained entries and clear retry. | Changed only the inline save handler; retained entries and clear retry. | Independent source comparison and execution of both handlers in a DOM stub passed. Native browser behavior remains unverified. |
| [Audit only](../evals/results/2026-11-05/audit-only/) | Reported prioritized structural, visual, feedback, and persistence findings. | Reported connected-screen scope, saving/recovery, visual hierarchy, search scope, and action-feedback findings. | All five original application files are byte-identical in each run. Audit simulations are agent-reported unless separately recorded. |
| [Visual plan](../evals/results/2026-11-05/visual-plan/) | Specified typography, contrast, geometry, aligned actions, grouping, and mobile composition. | Specified a coherent visual system, connected states and integration dependencies, with an inspected desktop/mobile drawing. | Application bytes unchanged in both. The drawing was visually reviewed; browser rendering remains unverified. |
| [Proactive research](../evals/results/2026-11-05/proactive-research/) | Independently opened Carbon and relevant technical primary sources; applied them to selection, accepted/running states, and failure recovery. | Searched and read PatternFly, Carbon, and relevant technical guidance; connected findings and limitations to selection, durable operations, and recovery choices. | Post-task reports distinguished page reads from snippets/local citations. Available retrieval references were reopened by the coordinating agent; some reported reads had no retained identifier. |
| [Raw idea](../evals/results/2026-11-05/raw-idea/) | Produced Due/Jobs/History screens and explicit revisable defaults for storage, recurrence, and reminders. | Produced Jobs/History, representative desktop/phone composition, and explicit defaults, including a calendar-fixed recurrence option informed by limited domain evidence. | Both progressed without a required questionnaire or implementation. Briefs are unchanged; defaults are proposals, not observed preferences. |
| [Content and reference fragments](../evals/results/2026-11-05/content-references/) | Produced a coherent landing-page plan, adapted reference functions, excluded the unsupported speed claim, and kept pricing undecided. | Delivered a coherent plan and inspected desktop/mobile drawings, with professional reasoning for transferring comparison and location patterns. | Both briefs unchanged; neither claimed to visit the described reference sites. Drawings do not establish browser or visitor behavior. |
| [iOS and Android flow](../evals/results/2026-11-05/native-plan/) | Defined shared report/draft/submission rules and concrete native navigation, keyboard, photo, and recovery differences. | Defined the same required task and lifecycle, concrete screen hierarchy, and native platform decisions with primary-source attribution. | Both briefs unchanged. Native plans and walkthroughs provide no simulator, device, or runtime verification. |
| [Weak concept review](../evals/results/2026-11-05/concept-review/) | Identified the missing comparison capability despite reported plan fidelity and routed the correction to planning. | Identified missing comparison and lost return context, separated concept quality from reported implementation fidelity, and routed correction to planning. | Both remained review-only, preserved the brief, and distinguished supplied descriptions from runtime observations. |
| [Natural redesign request](../evals/results/2026-11-05/natural-redesign/) | Completed an implemented redesign without explicit implementation wording. | Completed an implemented redesign with explicit scope, visual decisions, applied sources, and concept review. | Original model preserved in both; baseline model/ten controller groups and candidate model/eleven handler groups independently passed. Browser behavior remains unverified. |

### What the completed observations support

The implementation cases, including the natural-language holdout, did not reproduce the reported hesitation: both versions completed substantial work. The baseline also addressed visual problems in its visual-plan and audit cases. Candidate outputs provided explicit redesign rationale and, in several cases, professional-source decision links. Those differences are useful observations; they do not establish that the new package always produces a better interface.

The candidate's visual-plan and landing-page runs additionally produced static visual studies, while their baseline counterparts delivered written specifications. The candidate's commercial run included an authored storyboard. These are concrete differences in reviewable deliverables. They are not rendered implementation evidence or measurements of audience preference.

Neither broad redesign caused the local-correction or audit-only runs to exceed their requested endpoint. This supports scope restraint in those particular runs. The sample is too small and too dependent on the host to claim reliable restraint across all projects.

Both concept-review runs recognized that following the accepted plan did not satisfy the original comparison task. Both idea/content/native planning pairs delivered concrete plans with explicit assumptions and verification limits. The candidate makes these obligations more explicit in its instructions; the comparison does not show that the baseline was universally unable to perform them.

The commercial fixture exposed an interpretation choice: its brief mentions technicians' assigned work, but its model has no authenticated technician identity or row-visibility policy. The baseline added a clearly labeled demo-assignee filter; the candidate retained the model's visible records with read-only mutation controls. Both preserved the original model permissions. This synthetic setup does not verify production access control or settle the product's intended visibility rule.

## Package checks

| Check | Actual observation |
| --- | --- |
| Offline package validation | Seven skills, manifests, catalogs, frontmatter, metadata, local references, module discovery, and repository hygiene passed. This does not test invocation in a client. |
| Skill format validation | All seven modules passed the skill-creator quick validator. |
| Installer lifecycle and migration | All 13 tests passed locally and in GitHub Actions on Ubuntu, macOS, and Windows. Tests use temporary user directories; they do not launch a desktop operating system or coding-client UI. |
| Migration realism | Tests run the exact published 0.1.0 installer against a synthetic six-skill payload before upgrading. They cover the seventh module, local modifications, ownership conflicts, and rollback. They are not a six-to-seven migration of a real person's configured client. |
| Reproducible package archive | Build passed: 46 files, 79,885 bytes, SHA-256 `dcfbb266e1fcb3fe93f84b46182bb1c93cea83c125bccfb2bb6bed83e91b913f`. Evaluation outputs are excluded. |
| Codex CLI catalog discovery | Codex CLI `0.167.0-alpha.4` listed the local marketplace's 0.2.0 package as available. It was not installed or enabled by that check. |
| Codex skill invocation and routing | An ephemeral `codex exec` attempt with the candidate under project-local `.agents/skills` timed out after 300 seconds (exit 124). It produced zero JSON event bytes, zero stderr bytes, an empty final-answer file, and no application changes. The cause was not determined. Invocation and routing remain unverified. |
| Claude Code execution | Not performed for 0.2.0. Claude Code was not installed in this execution environment. Earlier 0.1.0 client observations are not carried forward as current validation. |

The successful three-platform CI run is [41994649154](https://github.com/ruslanovich/ux-designer/actions/runs/41994649154), at commit `fed3284b77f780f81802c877f2e27ce5053d281f`. The first candidate run exposed an error in the new rollback test's comparison of temporary paths on macOS and Windows. Canonicalizing that comparison fixed the test; the installer behavior did not need a change. The CI matrix now reports all platform outcomes independently.

## Evidence and limitations

The [dated JSON summary](../evals/results/2026-11-05-summary.json) records package identifiers, per-case input hashes, delivered-file hashes, reported sources, and the coordinating agent's observations. [Project snapshots](../evals/results/2026-11-05) preserve the completed outputs, including application checks where the execution agent saved them. They are generated evaluation artifacts and may contain unverified behavior.

Relative links from an output to its local skill package are normalized in the archived copy to immutable GitHub links for the correct package commit. Two intentional two-space Markdown hard breaks are represented by equivalent backslash hard breaks. The summary records these link/format-only transformations and archived hashes separately from original output hashes.

Source use is described by the delivered artifacts and execution agents' reports. A complete browsing/tool transcript is not exported. A linked professional article and an explanation of its application are stronger than an unrelated reading list, but they do not by themselves provide an independently captured source-open trace. Source limits and product-specific uncertainty remain relevant.

For the proactive-research pair, both agents supplied post-task read reports without further research. The baseline used direct opens and targeted finds; the candidate searched for PatternFly/Carbon and then read pages. The coordinating agent reopened the available retrieval references and confirmed that they resolved to the reported sources. The baseline's AIP-234 read and candidate's Microsoft pattern read lacked retained reference identifiers, so those remain agent-reported. Citations encountered only in local skill files were not counted as independent external reads. This pair supports actual professional-source use by both variants under the hosted conditions; it does not show that research was absent from every baseline run.

A local Playwright launch failed because its browser executable was absent. An attempted Chromium Headless Shell download failed with an invalid archive. No usable browser was installed. Source inspection, color arithmetic, Node model/controller tests, and DOM test doubles do not establish actual layout, zoom/reflow, native focus, keyboard navigation, download delivery, or screen-reader behavior. Those properties remain unverified.

No native iOS/Android build, simulator, device test, participant session, conversion measurement, or production rollout was performed. Existing functions were checked against each fixture's actual model; a synthetic role switch is not authentication, and session-only views are not backend persistence.

## Next evidence that would reduce uncertainty

1. Replay the user's original prompts against frozen copies of the two real projects in their actual client/model configuration, preserving before/after artifacts and tool conditions.
2. Exercise implemented representative flows in a browser, including narrow layout, long content, partial failures, keyboard continuation, and relevant assistive technology.
3. Observe skill invocation and module routing in the supported coding clients. Distinguish catalog discovery, installation, invocation, and completed project behavior.
4. Repeat a small set of high-value cases when making a consistency claim. Select repeats to investigate a concrete failure or uncertainty; do not substitute run counts for evidence of better design.

The candidate remains unreleased. Its branch and reviewable changes are available through PR #1; main continues to contain the published version.

## Trying the candidate

Use the `improve-redesign-research` branch for this iteration. A fresh standalone checkout can be prepared with:

```sh
git clone --branch improve-redesign-research --single-branch https://github.com/ruslanovich/ux-designer.git ux-designer-candidate
cd ux-designer-candidate
python3 scripts/install.py --target codex --dry-run
python3 scripts/install.py --target codex
```

Then open a new client conversation and use `$design-interface`. The standalone installer supports `--target claude` for `/design-interface` as well. These commands apply to standalone installations; keep one installation method per client. [Native plugin loading notes](development.md#test-native-loading) describe testing a local checkout. Installation instructions describe the intended route and do not convert the invocation limits above into a passed client test.
