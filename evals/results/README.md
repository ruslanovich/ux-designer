# Recorded evaluation artifacts

The dated directories contain the project files delivered by independent execution agents. Each agent received one ordinary task, one frozen skill package, and one isolated synthetic project. The evaluator-only rubric and other runs were outside its supplied context.

These are **generated outputs**, preserved for review rather than examples to copy into the runtime skills. They may contain incomplete or unverified behavior. Read the conditions in each artifact and the [evaluation report](../../docs/evaluation-report.md) before interpreting a result. A report's claim that a source was read is not an independently exported browsing trace.

The adjacent dated JSON summary records the package identifiers, input and output hashes, outcome reviews, source provenance, and checks independently repeated by the coordinating agent. The original input for each case is under [fixtures](../fixtures); the ordinary task is in [cases.json](../cases.json). All examples use synthetic data.

When a delivered report links outside its project to the supplied local skill package, the archived copy replaces that relative link with an immutable GitHub link to the corresponding package commit. Two-space Markdown hard breaks may be normalized to equivalent backslash hard breaks for repository whitespace checks. Substantive output is unchanged. Such transformations and the archived file's hash are recorded separately; `artifacts` retains hashes of the original delivered files.

No hosted-agent conversation transcript, private reasoning, production project, or user account data is included. The generated projects are not part of the installable archive.
