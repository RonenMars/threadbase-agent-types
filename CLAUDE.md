# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@threadbase-sh/agent-types` — the **wire contract** (shared TypeScript types) between two Threadbase Temporal services: the orchestrator (tb-multi-agent) and the WebSocket streamer (tb-streamer). It is types-only with **zero runtime dependencies**; the only runtime value exported is the frozen `STAGES` const in `src/stage.ts`.

Both consumers vendor this repo as a **git submodule** pinned to a SHA. A breaking change here is a breaking change to both services — coordinate the submodule SHA bump in the consuming repos when changing exported shapes.

## Commands

- `npm run build` — `tsc` to `dist/` (CommonJS + `.d.ts`)
- `npm run typecheck` — type-check without emit
- `npm test` — vitest run (one-shot, not watch)

Package manager is **npm** (`package-lock.json` is committed; CI uses `npm ci` on Node 24).

## Releases — conventional commits drive everything

semantic-release publishes to npm from `main` by parsing commit titles. Titles **must** be conventional: `<type>(<scope>)?: <description>`.

- `feat:` → minor, `fix:`/`perf:` → patch, `feat!:` or `BREAKING CHANGE:` → major.
- `chore`, `docs`, `test`, `build`, `ci` titles do **not** trigger a release (see `.releaserc.json`).

So a type change shipped under `chore:` won't publish — use `feat:`/`fix:` when consumers need it.

## Issue status updates

Any change traceable to an existing issue ends with a status update on that issue — code, docs, tests, config, a revert, or a deletion all count. The issue is the record; a commit message, a PR body, or a chat reply is not a substitute.

- **Completed** — close the issue, with a comment naming what landed and where (PR or commit).
- **Partly completed** — leave it open and comment with what is done, what remains, and anything the remainder now depends on.
- **Not done** — leave it open and comment with why: blocked, superseded, out of scope, or a precondition that has to change first.

Never close an issue that was not actually finished, and never leave finished work with the issue still open. If one change resolves several issues, update each of them.
