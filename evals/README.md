# Behavioral evaluation

These synthetic cases exercise agent behavior. They are not reproductions of the two private projects reported by the author. They do not establish audience usability or conversion.

## Run a comparison

1. Freeze a baseline package and a candidate package before each comparison round.
2. Run `python3 evals/prepare.py --package PATH --case CASE --destination NEW_DIRECTORY` for each fresh run. The destination must not exist. It receives only a copy of the skills, the selected project materials, and the ordinary task.
3. Start a fresh agent conversation with the generated TASK.md. Keep this evaluation directory, rubric, diagnosis, version labels, and other results outside its supplied context. Do not give execution agents the expected fix.
4. Hold the model, host instructions, tools, source materials, and resource limits constant where possible. Record differences. Use independent conversations for repeats.
5. Collect the delivered artifacts, actual checks, sources read, and concise decision rationales. Record observable tool traces when the host exposes them. Private chain-of-thought is unnecessary.
6. Judge each applicable assertion as pass, fail, or unverified with an artifact or observation. Use the evaluator-only rubric after the task is complete.

For implementation cases, `node model.test.js` verifies domain operations where provided. It does not verify DOM wiring, visual rendering, keyboard behavior, or mobile layout. Opening a file in a text tool does not establish any of those properties.

Tool-limited variants may disable live research or supply only source and screenshots. Record the capability condition explicitly. Never count a tool limitation as a passed behavior check.

## Scope of the fixtures

The applications are small static prototypes with synthetic data. Role selection in the service prototype demonstrates existing model rules; it is not production authentication. There are no production accounts, payments, user data, or external deployments.

The commercial fixture's minimal saved views exist for the session. The reading-list fixture uses browser local storage. Preserve these actual starting capabilities when evaluating regressions; do not infer a backend that is not present.

The source fixtures and evaluator guidance stay outside the installable skill archive. Package validation and installer tests remain separate from behavioral results. See [the evaluation report](../docs/evaluation-report.md) for the exact runs and limitations of the candidate.
