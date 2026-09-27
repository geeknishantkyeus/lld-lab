# Implementation Phases

I broke the project into 7 sequential phases so each layer could be tested before building on top of it.

## Phase 1: Backend Foundation
- Set up Node.js, Express, and PostgreSQL with Drizzle ORM.
- Schema: `users`, `problems`, `attempts`, `feedbacks`.
- Seed 3 benchmark LLD problems (Parking Lot, Elevator System, Vending Machine).
- Deterministic evaluator checks syntax, required classes, and methods.
- In-memory job queue (`p-queue`) to evaluate submissions asynchronously.
- Endpoints: `GET /api/problems`, `POST /api/attempts`, `GET /api/attempts/:id`.

## Phase 2: Frontend Workspace
- React + Vite + Tailwind CSS.
- Monaco Code Editor integration with dark theme.
- Problem viewer, code submission panel, and polling for evaluation status.
- Pages: Home, Problem List, Problem Workspace, History.

## Phase 3: AI Evaluation (Gemini)
- Integrated Google Gemini via `@google/genai` using model `gemini-2.5-flash`.
- Evaluates submissions across 7 dimensions (SOLID, Coupling, Extensibility, etc.).
- Robust JSON extraction with fallback if the model response has markdown or formatting noise.
- Timeout protection (15s) with deterministic score fallback.

## Phase 4: Redis Caching
- Added Redis caching with `ioredis`.
- Hash key: SHA-256 of `problemId + normalizedCode + promptVersion`.
- 24-hour TTL (`86400` seconds).
- Instant response on repeated submissions with identical logic.

## Phase 5: History & Progress
- Attempt comparison endpoint (`/api/attempts/compare/:id1/:id2`).
- Track repeated mistakes across attempts.
- Weak area detection aggregating dimension scores.
- Score trend and progress analytics.

## Phase 6: Testing
- Jest + Supertest test suite.
- 7 test suites covering 73 test cases:
  - API routes (`tests/api.test.ts`)
  - Edge cases and input validation (`tests/edge.test.ts`)
  - Redis cache hits and errors (`tests/cache.test.ts`)
  - User analytics and progress (`tests/users.test.ts`)
  - LLM response parsing and prompts (`tests/llm.test.ts`)
  - AI token usage tracking (`tests/aiUsage.test.ts`)
  - Redis connection handling (`tests/redis.test.ts`)

## Phase 7: Deployment & Documentation
- Deploy backend and PostgreSQL to Render.
- Deploy frontend to Render / Static Host.
- Add comprehensive documentation, README, and AI usage disclosures.
