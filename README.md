# TypeScript + GraphQL Exercise

## Overview

You are joining a codebase that exposes a small GraphQL API over a REST datasource. The project uses modular GraphQL SDL, resolver composition, a typed context datasource, Zod DTO parsing, and focused tests.

## What You Are Building

You are implementing a small GraphQL service backed by the public [SpaceX API](https://github.com/r-spacex/SpaceX-API).

Use this REST API base URL when wiring the datasource:

```text
https://api.spacexdata.com/v4
```

The schema exposes:

- `launch(id: ID!): LaunchLookupResult!`
- `launchesByOutcome(outcome: LaunchOutcome!, limit: Int = 5): [Launch!]!`

The public `Launch` type stays intentionally small: `id`, `name`, `detail`, `tags`, and `summary`.

## Your Task

Make the supplied tests pass by completing:

- `src/context.ts`
- `src/modules/launch/launch.mapper.ts`
- `src/modules/launch/launch.resolver.ts`

Functional requirements:

- validate and normalize `id` for `launch`
- return `INVALID_INPUT`, `NOT_FOUND`, and `UPSTREAM_ERROR` in the lookup result when appropriate
- map REST DTOs into the GraphQL model with null/default/sorted-array handling
- sort `launchesByOutcome` results by `name`, then apply `limit`
- treat negative limits as `0`
- compute a deterministic `Launch.summary`

## How To Run

```bash
pnpm install
pnpm test
pnpm run typecheck
```
