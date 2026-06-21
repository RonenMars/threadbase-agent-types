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
