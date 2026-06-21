---
name: release-check
description: Verify a change to @threadbase-sh/agent-types is release-ready — runs typecheck + tests and checks whether the pending commits will trigger a semantic-release publish.
---

Use when the user is about to commit/push a change and wants to confirm it's release-ready, or asks "will this release?".

Run these and report results:

1. `npm run typecheck` — must pass.
2. `npm test` — all vitest tests must pass.
3. Inspect the commit title(s) that will land on `main` (`git log origin/main..HEAD --oneline`, or the proposed title if not yet committed).

Then tell the user whether a release will fire, per `.releaserc.json`:

- **Will release:** title starts with `feat:` (minor), `fix:`/`perf:` (patch), or carries `feat!:` / `BREAKING CHANGE:` (major).
- **Will NOT release:** `chore`, `docs`, `test`, `build`, `ci`.

If the change alters an exported type/shape and consumers need it but the title is non-releasing, flag that the submodule SHA bump alone won't get them a published version — suggest a `feat:`/`fix:` title.

Report concisely: typecheck ✓/✗, tests ✓/✗, release verdict (which bump or none), and any flagged mismatch.
