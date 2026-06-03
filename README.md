# @threadbase/agent-types

Shared wire types for the Threadbase multi-agent pipeline.

These types live on the boundary between two processes:

- **tb-multi-agent** — the Temporal worker that runs the orchestrator + turn workflows and the AI-agent activities.
- **tb-streamer** — the Temporal client that owns the WebSocket connection to the mobile frontend and writes JSONL.

Both processes consume this package so the wire shapes (progress events, signal payloads, session addendum, final-answer flags) stay in sync. There is no runtime code beyond a single frozen `STAGES` array; everything else is type-only.

## How consumers depend on this

Both consumers add this repo as a **git submodule** at a pinned commit, then point their `package.json` at the submodule path via a `file:` dep:

```jsonc
// tb-multi-agent/packages/agent-types/  ← submodule path
// tb-streamer/vendor/agent-types/       ← submodule path

"@threadbase/agent-types": "file:packages/agent-types"  // tb-multi-agent
"@threadbase/agent-types": "file:vendor/agent-types"    // tb-streamer
```

Bumping the wire contract is a deliberate three-step act:

1. Edit + commit + push here.
2. In the consuming repo, `git submodule update --remote vendor/agent-types` (or `packages/agent-types`).
3. Commit the submodule SHA bump in the consuming repo.

This pattern mirrors how `tb-streamer` consumes `@threadbase/scanner` today.

## Why `private: true` in package.json

The package is **source-public** (this repo is public on GitHub) but **not published to npm**. The `private: true` flag prevents accidental `npm publish` runs. The roadmap for going registry-public lives alongside the tb-streamer distribution refactor — both packages move to npm together (Stage 3 in `tb-multi-agent/docs/ROADMAP.md`).

## Stages of distribution maturity

- ~~**Stage 1:** local `file:` dep, sibling-checkout requirement.~~ Retired 2026-06-04.
- **Stage 2 (current):** standalone GitHub repo, consumed via git submodule. Both consumers pin a SHA.
- **Stage 3 (planned):** published npm package. See `tb-multi-agent/docs/ROADMAP.md` and the tb-streamer distribution-refactor spec for the broader unification.

## Local development

```bash
npm install
npm test       # vitest, 23 tests
npm run build  # tsc → dist/
npm run typecheck
```

The package is self-contained: no runtime deps, only `typescript` + `vitest` as devDeps.
