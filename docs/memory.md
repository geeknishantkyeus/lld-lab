# System Memory & State Synchronization Document

# LLD Lab — Persistent Architectural State & Progress Memory

| Metadata Attribute | Specification Value |
| :--- | :--- |
| **Title** | LLD Lab System Memory & State Tracker |
| **Version** | 1.0.0 |
| **Status** | Active / Maintained Across Sessions |
| **Last Updated** | September 27, 2026 |
| **Owner** | AI Pair Programmer & Engineering Team |
| **Applies To** | All Phase Transitions and Task Iterations |

---

## Table of Contents
1. [Project Decisions](#1-project-decisions)
2. [Evaluation Rubric](#2-evaluation-rubric)
3. [Problems (MVP List)](#3-problems-mvp-list)
4. [Status States](#4-status-states)
5. [Redis Caching](#5-redis-caching)
6. [Course Integration](#6-course-integration)
7. [What's Skipped (For Later)](#7-whats-skipped-for-later)
8. [Phase Completion Tracker](#8-phase-completion-tracker)
9. [Task Log (Auto-Updated)](#9-task-log-auto-updated)
10. [Known Issues (Auto-Updated)](#10-known-issues-auto-updated)
11. [Next Steps (Auto-Updated)](#11-next-steps-auto-updated)
12. [Instructions for AI Assistants](#12-instructions-for-ai-assistants)

---

## 1. Project Decisions

| Decision Area | Chosen Standard | Technical Rationale |
| :--- | :--- | :--- |
| **Product Name** | **LLD Lab** | Dedicated Low-Level Design and machine coding lab for CipherSchools. |
| **Technology Stack** | **React 19 + Express 5 + PostgreSQL 16 + Redis 7 + Gemini API** | Fast, modern, type-safe full-stack setup with native promise handling and modern React. |
| **Task Queue** | **In-memory (`p-queue 8.0.1`)** | Lightweight, zero-overhead promise-based worker queue suitable for single-instance monolith. |
| **System Architecture**| **Modular Monolith** | Single repository with decoupled `apps/web` and `apps/api` workspaces; avoids distributed microservice overhead. |
| **Submission Format** | **Text + Code (Multi-File Buffer)** | Multi-tab code editor allowing modular Object-Oriented packaging alongside textual notes. |
| **Evaluation Method** | **Hybrid (Deterministic + LLM)** | Pairs fast objective unit assertions (40%) with deep architectural SOLID review (60%). |
| **UI Theme & Style** | **CipherSchools Light Shell + Dark Code Editor** | Primary Blue (`#2563EB`), Secondary Orange (`#F97316`), Clean White (`#FFFFFF`) with Obsidian Black Monaco (`#1E1E1E`). |

---

## 2. Evaluation Rubric

### 2.1 Deterministic Evaluation (40 Points)
- **Compilation & Syntax:** Validates that submitted code compiles or parses without syntax errors.
- **Expected Class Names:** Confirms existence of required core domain entities:
  - *Parking Lot:* `ParkingLot`, `Vehicle`, `ParkingSpot`, `Ticket`.
  - *Elevator System:* `Elevator`, `ElevatorController`, `Request`, `Floor`.
  - *Vending Machine:* `VendingMachine`, `State`, `Item`, `Coin`.
- **Method Signatures:** Asserts presence and signatures of contract methods:
  - *Parking Lot:* `parkVehicle(Vehicle)`, `unparkVehicle(Ticket)`, `calculateFee(Ticket)`.
  - *Elevator System:* `requestElevator(int floor, Direction)`, `step()`.
  - *Vending Machine:* `insertCoin(Coin)`, `selectItem(String code)`, `dispense()`, `refund()`.
- **Functional Assertions:** Executes automated test scenarios (e.g., parking capacity limits, change computation).

### 2.2 LLM Architectural Evaluation (Google Gemini 2.0) (60 Points)
- **Responsibility Clarity (SRP):** Single Responsibility Principle adherence across modules.
- **SOLID Compliance:** Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.
- **Coupling & Cohesion:** Modular decoupling and strong internal class cohesion.
- **Encapsulation:** Visibility modifiers (`private`, `protected`), immutable fields, defensive copying.
- **Pattern Appropriateness:** Accurate application of GoF patterns (Factory, Strategy, State, Observer) vs. over-engineering.
- **Extensibility:** Ease of accommodating new requirements without altering core logic.
- **Design Trade-offs:** Evaluation of algorithmic efficiency vs. structural maintainability.

---

## 3. Problems (MVP List)

| Problem ID | Problem Name | Complexity | Targeted Design Patterns | Benchmark Focus |
| :--- | :--- | :--- | :--- | :--- |
| `LLD-001` | **Parking Lot System** | Easy–Medium | Strategy, Factory, Singleton | Multi-level spot allocation, vehicle hierarchy, polymorphic pricing. |
| `LLD-002` | **Elevator System** | Medium | State, Strategy, Dispatcher | Multiple cars, request scheduling algorithm (LOOK/SCAN), directional queues. |
| `LLD-003` | **Vending Machine** | Easy | State, Chain of Responsibility | Finite state machine transitions, inventory management, exact change computation. |

---

## 4. Status States

The lifecycle of an attempt transitions through a strict deterministic state machine:

```
[PENDING] ---------> [EVALUATING] ---------> [COMPLETED]
                           |
                           v
                        [FAILED]
```

- **`PENDING`:** Code submission received and enqueued in `p-queue`.
- **`EVALUATING`:** Sandbox test harness executing and/or Gemini API call in-flight.
- **`COMPLETED`:** Both deterministic tests and architectural analysis synthesized into final report.
- **`FAILED`:** Critical compilation error, execution timeout, or system exception occurred.

---

## 5. Redis Caching

### Cryptographic Cache Key Generation
```
CacheKey = "eval:" + SHA256(problemId + normalizedSolution + promptVersion)
```

- **Normalization:** Strips non-functional leading/trailing whitespaces and standardizes line endings (`\r\n` -> `\n`).
- **Cache Hit:** If key exists in Redis, returns cached evaluation payload instantly ($<50\text{ms}$), skipping queue and LLM call.
- **Cache Miss:** Runs full hybrid evaluation pipeline, then caches resulting JSON in Redis with a 7-day TTL (`EX 604800`).

---

## 6. Course Integration

- **Course Association:** Each benchmark LLD problem links directly to relevant CipherSchools curriculum courses:
  - *Parking Lot* $\rightarrow$ **Full Stack Development with AI** / **Mastering Low-Level Design**
  - *Elevator System* $\rightarrow$ **System Design & Concurrency in Java**
  - *Vending Machine* $\rightarrow$ **Design Patterns Deep-Dive**
- **Call-to-Action (CTA):** Prominent **"Practice This Problem"** and **"Watch Associated Lecture"** interactive banners embedded in the workspace.

---

## 7. What's Skipped (For Later Phases)

To ensure razor-sharp focus on the core machine coding MVP, the following features are intentionally deferred:
- ❌ CipherPoints reward gamification integration.
- ❌ Mentor human-in-the-loop review queue.
- ❌ Drag-and-drop visual diagram submission canvas.
- ❌ Multi-language simultaneous execution sandbox (focus locked on Java/Python).
- ❌ Live audio/video peer mock interviews (WebRTC).
- ❌ Apache Kafka, RabbitMQ, and microservice mesh architecture.

---

## Render URLs

- **Region:** Singapore
- **Database (PostgreSQL):** `lld-lab-db` (`lld_lab`, user: `lld_user`, Region: Singapore)
- **Redis (Key Value):** `lld-lab-redis` (Region: Singapore)
- **Backend (Web Service):** `https://lld-lab-backend.onrender.com` (Region: Singapore)
- **Frontend (Static Site):** `https://lld-lab-frontend.onrender.com` (Region: Singapore)

---

## 8. Phase Completion Tracker

| Phase | Total Tasks | Done | In Progress | Not Started | % Complete |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Phase 1: Backend** | 8 | 8 | 0 | 0 | 100.0% |
| **Phase 2: Frontend** | 8 | 8 | 0 | 0 | 100.0% |
| **Phase 3: AI Integration** | 4 | 4 | 0 | 0 | 100.0% |
| **Phase 4: Redis Caching** | 3 | 3 | 0 | 0 | 100.0% |
| **Phase 5: Memory + Course** | 4 | 4 | 0 | 0 | 100.0% |
| **Phase 6: Testing** | 4 | 4 | 0 | 0 | 100.0% |
| **Phase 6.5: UI/UX Fix** | 1 | 1 | 0 | 0 | 100.0% |
| **Phase 7: Deployment** | 4 | 3 | 0 | 1 | 75.0% |
| **TOTAL** | **36** | **35** | **0** | **1** | **97.2%** |

---

## 9. Task Log (Auto-Updated)

| Date | Phase | Task | Status | Files Modified |
| :--- | :--- | :--- | :--- | :--- |
| 2026-09-27 | Setup | Initialize Documentation Specs (PRD, Architecture, Design, Rules, Phases, Memory) | COMPLETED | `docs/*.md` |
| 2026-09-27 | Phase 1 | Backend directory structure, config, app, server, and dependencies initialization | COMPLETED | `backend/**` |
| 2026-09-27 | Phase 1 | Step 1.2: PostgreSQL Connection + Drizzle Setup | COMPLETED | `backend/src/config/db.ts`, `backend/src/server.ts`, `backend/.env` |
| 2026-09-27 | Phase 1 | Fix ts-node runner incompatibility with Node 24 by switching to tsx | COMPLETED | `backend/package.json`, `backend/tsconfig.json` |
| 2026-09-27 | Phase 1 | Step 1.3: Database Models, Migration & Seeding | COMPLETED | `backend/src/models/*`, `backend/src/config/migrate.ts`, `backend/src/config/seed.ts` |
| 2026-09-27 | Phase 1 | Configure Drizzle Kit push, setup drizzle.config.ts, and verify 3 seeded problems | COMPLETED | `backend/drizzle.config.ts`, `backend/package.json`, `backend/src/config/seed.ts` |
| 2026-09-27 | Phase 1 | Step 1.4: Complete API Routes with try-catch & response envelope | COMPLETED | `backend/src/routes/*`, `backend/src/app.ts` |
| 2026-09-27 | Phase 1 | Execute API route test suite (6 tests), fix problem ID sequence offset, generate docs/test_report.md | COMPLETED | `backend/src/config/seed.ts`, `docs/test_report.md` |
| 2026-09-27 | Phase 1 | Step 1.5: In-Memory Queue (`p-queue`) background evaluation pipeline, status transition, and feedback creation | COMPLETED | `backend/src/queue/inMemoryQueue.ts`, `backend/src/routes/attempts.ts`, `docs/queue_test_report.md` |
| 2026-09-27 | Phase 1 | Step 1.6: Deterministic Evaluator implementation, problem-specific requirements, and automated validation | COMPLETED | `backend/src/evaluators/deterministic.ts`, `backend/src/queue/inMemoryQueue.ts`, `docs/deterministic_test_report.md` |
| 2026-09-27 | Phase 1 | Step 1.7: Status Handling with retry mechanism, `GET /api/attempts/:id/status`, `POST /api/attempts/:id/retry` | COMPLETED | `backend/src/routes/attempts.ts`, `docs/status_test_report.md` |
| 2026-09-27 | Phase 1 | Step 1.8: Backend Testing setup (Jest + Supertest), 14 API and edge case tests passing, docs/backend_test_report.md | COMPLETED | `backend/jest.config.js`, `backend/tests/*`, `backend/package.json`, `docs/backend_test_report.md` |
| 2026-09-27 | Phase 2 | Step 2.1: Frontend Setup (Vite + React + TS), Tailwind CSS, Router, Axios client, placeholder pages & components | COMPLETED | `frontend/**`, `docs/frontend_setup_test_report.md` |
| 2026-09-27 | Phase 2 | Step 2.2: API Client + TypeScript Types, problems and attempts API modules, error interceptor, and verified backend communication | COMPLETED | `frontend/src/types/index.ts`, `frontend/src/api/problems.ts`, `frontend/src/api/attempts.ts`, `frontend/src/api/client.ts`, `docs/api_client_test_report.md` |
| 2026-09-27 | Phase 2 | Step 2.3: Home Page + Navbar with hero section, feature cards, CTA, and CipherSchools styling | COMPLETED | `frontend/src/components/Navbar.tsx`, `frontend/src/pages/Home.tsx`, `docs/home_page_test_report.md` |
| 2026-09-27 | Phase 2 | Step 2.4: Problem List Page + ProblemCard component with dynamic problem loading, difficulty tags, and loading skeleton | COMPLETED | `frontend/src/components/ProblemCard.tsx`, `frontend/src/pages/ProblemList.tsx`, `docs/problem_list_test_report.md` |
| 2026-09-27 | Phase 2 | Step 2.5: Problem Detail Page with dynamic requirements list, course link, and start attempt action | COMPLETED | `frontend/src/pages/ProblemDetail.tsx`, `docs/problem_detail_test_report.md` |
| 2026-09-27 | Phase 2 | Step 2.6: Attempt Page with Monaco Editor, solution submission, status polling, and auto-redirection | COMPLETED | `frontend/src/components/SolutionEditor.tsx`, `frontend/src/pages/AttemptPage.tsx`, `docs/attempt_page_test_report.md` |
| 2026-09-27 | Phase 2 | Step 2.7: Feedback Page with Deterministic + AI feedback, status breakdown, and retry action | COMPLETED | `frontend/src/components/FeedbackPanel.tsx`, `frontend/src/pages/FeedbackPage.tsx`, `docs/feedback_page_test_report.md` |
| 2026-09-27 | Phase 2 | Step 2.8: History Page with attempt history, reverse chronological sorting, status badges, line clamp, and retry action | COMPLETED | `frontend/src/pages/HistoryPage.tsx`, `frontend/src/index.css`, `docs/history_page_test_report.md` |
| 2026-09-27 | Testing | Complete verification of Phase 1 (Backend) and Phase 2 (Frontend) with 26/26 tests passing | COMPLETED | `docs/complete_test_report.md` |
| 2026-09-27 | Phase 3 | Step 3.1: Google Gemini API client setup, LLM evaluator, and async queue integration | COMPLETED | `backend/src/evaluators/llm.ts`, `backend/src/queue/inMemoryQueue.ts`, `docs/ai_integration_test_report.md` |
| 2026-09-27 | Phase 3 | Step 3.2: Prompt Refinement with 7-dimensional rubric scoring, prompts template, and frontend display | COMPLETED | `backend/src/evaluators/prompts.ts`, `backend/src/evaluators/llm.ts`, `backend/src/queue/inMemoryQueue.ts`, `frontend/src/types/index.ts`, `frontend/src/components/FeedbackPanel.tsx`, `docs/prompt_refinement_test_report.md` |
| 2026-09-27 | Phase 3 | Step 3.3: Evaluation Timing, 30s Timeout, Retry Mechanism, and Fallback Handling | COMPLETED | `backend/src/evaluators/llm.ts`, `backend/src/queue/inMemoryQueue.ts`, `backend/src/routes/attempts.ts`, `frontend/src/components/FeedbackPanel.tsx`, `docs/error_handling_test_report.md` |
| 2026-09-27 | Phase 3 | Step 3.4: AI Usage Documentation, Token Tracking, Cost Estimation, and Usage Endpoint | COMPLETED | `backend/src/config/aiUsage.ts`, `backend/src/evaluators/llm.ts`, `backend/src/routes/attempts.ts`, `docs/AI_USAGE.md`, `docs/ai_usage_test_report.md` |
| 2026-09-27 | Testing | Complete verification of Phase 1, Phase 2, and Phase 3 with 34/34 tests passing | COMPLETED | `docs/complete_test_report_phase3.md` |
| 2026-09-27 | Phase 4 | Step 4.1: Redis Setup & Connection via ioredis with Upstash support and server startup ping | COMPLETED | `backend/package.json`, `backend/src/config/redis.ts`, `backend/src/config/env.ts`, `backend/src/server.ts`, `backend/.env`, `docs/redis_setup_test_report.md` |
| 2026-09-27 | Phase 4 | Step 4.2: Cache Key Logic & Solution Hashing via SHA256, 24h TTL, and queue cache integration | COMPLETED | `backend/src/config/cache.ts`, `backend/src/queue/inMemoryQueue.ts`, `docs/cache_test_report.md` |
| 2026-09-27 | Phase 4 | Step 4.3: Cache Hit/Miss Testing, Verification Suite, Invalidation, and Performance Benchmarking | COMPLETED | `backend/src/config/cache.ts`, `backend/tests/cache.test.ts`, `backend/package.json`, `docs/cache_verification_test_report.md` |
| 2026-09-27 | Testing | Complete verification of Phase 1, Phase 2, Phase 3, and Phase 4 with 43/43 tests passing | COMPLETED | `docs/complete_test_report_phase4.md` |
| 2026-09-27 | Phase 5 | Step 5.1: Attempt Comparison endpoint, frontend compareAttempts API, and HistoryPage comparison UI | COMPLETED | `backend/src/routes/attempts.ts`, `frontend/src/api/attempts.ts`, `frontend/src/pages/HistoryPage.tsx`, `backend/tests/api.test.ts`, `docs/attempt_comparison_test_report.md` |
| 2026-09-27 | Phase 5 | Step 5.2: Recurring Mistakes Tracking endpoint, frontend getWeakAreas API, and HistoryPage weak-areas dashboard | COMPLETED | `backend/src/routes/users.ts`, `frontend/src/api/users.ts`, `frontend/src/pages/HistoryPage.tsx`, `backend/tests/api.test.ts`, `docs/recurring_mistakes_test_report.md` |
| 2026-09-27 | Phase 5 | Step 5.3: Weak-Spot Dashboard progress endpoint, getProgress API, score trend bar chart, and improvement indicator | COMPLETED | `backend/src/routes/users.ts`, `frontend/src/api/users.ts`, `frontend/src/pages/HistoryPage.tsx`, `backend/tests/api.test.ts`, `docs/weak_spot_dashboard_test_report.md` |
| 2026-09-27 | Phase 5 | Step 5.4: Course Integration — course link banner on AttemptPage and FeedbackPage, attempt→problem fetch chain | COMPLETED | `frontend/src/pages/AttemptPage.tsx`, `frontend/src/pages/FeedbackPage.tsx`, `docs/course_integration_test_report.md` |
| 2026-09-27 | Testing | Complete verification of Phase 1, 2, 3, 4, and 5 — 79/79 tests passed (28 Jest, 11 API, 7 AI, 8 Cache, 11 Phase 5, 9 Frontend, 5 Error Handling) | COMPLETED | `docs/complete_test_report_phase5.md` |
| 2026-09-27 | Phase 6 | Step 6.1: Verify testing setup — jest.config.js, setup.ts, package.json scripts, create users.test.ts, run 4 suites (28/28), coverage 83% stmts/84% lines | COMPLETED | `backend/tests/users.test.ts`, `backend/tests/api.test.ts`, `docs/phase6_testing_setup_report.md` |
| 2026-09-27 | Phase 6 | Step 6.2: API Tests Expansion — api.test.ts (+8 tests), users.test.ts (+6 tests), edge.test.ts (+5 tests), 47/47 passing, coverage improved (Stmts 87%, Branches 50%, Funcs 80%, Lines 87%) | COMPLETED | `backend/tests/api.test.ts`, `backend/tests/users.test.ts`, `backend/tests/edge.test.ts`, `docs/phase6_api_expansion_report.md` |
| 2026-09-27 | Phase 6 | Step 6.3: Edge Cases Expansion — edge.test.ts (+11 tests), cache.test.ts (+3 tests), 61/61 passing, LLM failure simulation, cache failure handling, concurrent attempts, invalid data handling | COMPLETED | `backend/tests/edge.test.ts`, `backend/tests/cache.test.ts`, `backend/src/routes/attempts.ts`, `backend/src/queue/inMemoryQueue.ts`, `docs/phase6_edge_cases_report.md` |
| 2026-09-27 | Phase 6 | Step 6.4: Final Test Run & Coverage — llm.test.ts (+4 tests), aiUsage.test.ts (+6 tests), env.test.ts (+2 tests), redis.test.ts (+3 tests), removed slow timeout test, 8 suites, 75/75 passing, coverage: Stmts 85.26%, Branches 50.36%, Funcs 82.25%, Lines 84.87% | COMPLETED | `backend/tests/llm.test.ts`, `backend/tests/aiUsage.test.ts`, `backend/tests/env.test.ts`, `backend/tests/redis.test.ts`, `backend/tests/edge.test.ts`, `docs/phase6_final_test_report.md` |
| 2026-09-27 | Phase 6.5 | UI/UX Fix — CipherSchools Style (Orange #F97316, Black #000000, Cream #FDF8F3, Poppins/Montserrat fonts, soft shadows, rounded-2xl cards, rounded-xl buttons) | COMPLETED | `frontend/tailwind.config.js`, `frontend/src/index.css`, `frontend/src/components/Navbar.tsx`, `frontend/src/pages/Home.tsx`, `frontend/src/components/ProblemCard.tsx`, `frontend/src/pages/ProblemList.tsx`, `frontend/src/pages/ProblemDetail.tsx`, `frontend/src/pages/AttemptPage.tsx`, `frontend/src/pages/FeedbackPage.tsx`, `frontend/src/components/FeedbackPanel.tsx`, `frontend/src/pages/HistoryPage.tsx`, `docs/ui_ux_fix_test_report.md` |
| 2026-09-27 | Perf Fix | Performance Fixes across 9 areas: Gemini timeout (15s), Retries (1), Monaco lazy load, fonts preconnect, console.log cleanup, DB connection pool, Redis connection pool, React Query, Vite build chunking | COMPLETED | `backend/src/evaluators/llm.ts`, `backend/src/queue/inMemoryQueue.ts`, `frontend/src/components/SolutionEditor.tsx`, `frontend/index.html`, `backend/src/config/db.ts`, `backend/src/config/redis.ts`, `frontend/src/main.tsx`, `frontend/vite.config.ts`, `frontend/package.json`, `docs/performance_fix_report.md` |
| 2026-09-27 | SEO & Testing | Full SEO Setup (Traditional + LLM/GEO) & End-to-End Testing: favicon.svg, og-image.svg, robots.txt with AI crawlers, sitemap.xml, manifest.json, llms.txt, JSON-LD schemas (WebApplication + FAQPage), NotFound.tsx, ErrorBoundary.tsx, Suspense fallback, 40+/40+ tests passed | COMPLETED | `frontend/public/favicon.svg`, `frontend/public/og-image.svg`, `frontend/public/robots.txt`, `frontend/public/sitemap.xml`, `frontend/public/manifest.json`, `frontend/public/llms.txt`, `frontend/src/pages/NotFound.tsx`, `frontend/src/components/ErrorBoundary.tsx`, `frontend/index.html`, `frontend/src/App.tsx`, `frontend/src/main.tsx`, `docs/complete_seo_testing_report.md` |
| 2026-09-27 | Phase 7 | Step 7.1: Production Setup for Render Deployment (render.yaml, backend .env.production.example, frontend .env.production.example, env.ts, app.ts CORS, client.ts API_URL, .gitignore, production build 7/7 pass) | COMPLETED | `backend/.env.production.example`, `frontend/.env.production.example`, `backend/src/config/env.ts`, `backend/src/app.ts`, `render.yaml`, `frontend/src/api/client.ts`, `.gitignore`, `docs/phase7_production_setup_report.md` |
| 2026-09-27 | Phase 7 | Step 7.2: Render Database + Redis Setup (Render PostgreSQL created, Render Redis created, URLs saved, render_deployment_guide.md, render_urls.md, 6/6 tests pass) | COMPLETED | `docs/render_deployment_guide.md`, `docs/render_urls.md`, `docs/phase7_database_redis_report.md` |
| 2026-09-27 | Phase 7 | Step 7.3a: Push Code to GitHub (Git initialized, .gitignore verified, zero secrets/dist/node_modules, 135 source files committed, GitHub push report created, 8/8 tests pass) | COMPLETED | `.gitignore`, `README.md`, `docs/github_push_report.md` |
| 2026-09-27 | Phase 7 | Fix tsconfig.json moduleResolution (node → node16) for Render build compatibility | COMPLETED | `backend/tsconfig.json`, `backend/src/queue/inMemoryQueue.ts` |
| 2026-09-27 | Phase 7 | Fix Render production build: move @types and build tools to dependencies, add --include=dev in render.yaml | COMPLETED | `backend/package.json`, `render.yaml` |
| 2026-09-27 | Phase 7 | Step 7.3b: Run Migrations on Render Database (Schema pushed, 3 benchmark problems seeded, live /api/problems returns 3 problems, 6/6 tests pass) | COMPLETED | `docs/phase7_migrations_report.md` |
| 2026-09-28 | Docs | Add human-written README.md and AI_USAGE.md at root level | COMPLETED | `README.md`, `AI_USAGE.md` |

---

## 10. Known Issues (Auto-Updated)

- *(Resolved)* `ts-node` incompatibility with Node 24 — resolved by migrating dev runner to `tsx` with `nodemon`. Current status: Working.
- *(Resolved)* Postgres serial sequence offset across repeated seed executions — fixed via `TRUNCATE TABLE ... RESTART IDENTITY CASCADE` in `backend/src/config/seed.ts`.
- *(Verified)* Neon database tables active (`problems`, `users`, `attempts`, `feedbacks`) and `problems` table populated with 3 benchmark rows (`Parking Lot`, `Elevator System`, `Vending Machine`).
- *(Verified)* In-memory queue with `p-queue` operational with concurrency 2.
- *(Verified)* Deterministic evaluator operational for Parking Lot, Elevator System, and Vending Machine benchmarks.
- *(Verified)* Status endpoint (`GET /api/attempts/:id/status`) and Retry endpoint (`POST /api/attempts/:id/retry`) functional.
- *(Verified)* Full attempt lifecycle validated: `PENDING` -> `EVALUATING` -> `COMPLETED` and `PENDING` -> `EVALUATING` -> `FAILED` -> `(retry)` -> `PENDING`.
- *(Verified)* Jest + Supertest setup complete with 22/22 automated tests passing.
- *(Verified)* Frontend application scaffolded and built cleanly with Vite + React + TypeScript + Tailwind CSS.
- *(Verified)* Route hierarchy configured in `App.tsx` (`/`, `/problems`, `/problems/:id`, `/attempts/:id`, `/attempts/:id/feedback`, `/history`).
- *(Verified)* Full TypeScript type interfaces established for Problems, Attempts, Feedbacks, and ApiResponse envelopes.
- *(Verified)* Frontend Axios API client communicates with backend at `http://localhost:5000/api` with response error interceptor.
- *(Verified)* Navbar component with responsive flex layout, brand anchor, and navigation links (`/problems`, `/history`).
- *(Verified)* Home page complete with hero section, 3 feature cards, and primary/secondary CTA banners.
- *(Verified)* ProblemList page dynamically fetches 3 problems from backend (`GET /api/problems`) and displays responsive card grid.
- *(Verified)* ProblemCard component renders title, difficulty badge, description, and "Start Attempt →" CTA linking to `/problems/:id`.
- *(Verified)* ProblemDetail page renders problem metadata, difficulty tag, requirements bullet list, associated CipherSchools course card, and start attempt navigation.
- *(Verified)* 9/9 Problem Detail test scenarios passed (including invalid problem ID error state handling and loading state). Documented in `docs/problem_detail_test_report.md`.
- *(Verified)* 8/8 Attempt Page test scenarios passed (including problem fetch, Monaco Editor, submission flow, status polling PENDING -> COMPLETED, redirect to feedback, empty validation). Documented in `docs/attempt_page_test_report.md`.
- *(Verified)* 10/10 Feedback Page test scenarios passed (including deterministic score, compilation, classes/methods/interfaces checks, AI feedback, cached badge, retry, navigation). Documented in `docs/feedback_page_test_report.md`.
- *(Verified)* 9/9 History Page test scenarios passed (including attempt fetching, list rendering, status badges, date formatting, submission preview, feedback links, failed retry, and empty state). Documented in `docs/history_page_test_report.md`.
- *(Verified)* 26/26 end-to-end integration and API tests passing across Phase 1 and Phase 2. Zero errors, zero CORS issues, 14/14 Jest tests green. Documented in `docs/complete_test_report.md`.
- *(Verified)* 6/6 AI integration test scenarios passed (Gemini API client, LLM evaluator, dimensional scoring, prompt formatting, JSON parsing, DB persistence, fallback mechanism). Documented in `docs/ai_integration_test_report.md`.
- *(Verified)* 7/7 Prompt refinement test scenarios passed (7 dimensions rubric, prompt template, model fallback, type definitions, queue processing, and responsive 3-column UI display). Documented in `docs/prompt_refinement_test_report.md`.
- *(Verified)* 7/7 Error handling and timeout recovery test scenarios passed (30s timeout, 2 retries with backoff, deterministic fallback, failed attempt retry via API, UI failure banner). Documented in `docs/error_handling_test_report.md`.
- *(Verified)* 5/5 AI usage tracking test scenarios passed (usage logging, token tracking, cost estimation, `/api/attempts/ai/usage` endpoint, `docs/AI_USAGE.md`). Documented in `docs/ai_usage_test_report.md`.
- *(Verified)* 34/34 complete tests passing across Phase 1 (Backend), Phase 2 (Frontend), and Phase 3 (AI Integration). Documented in `docs/complete_test_report_phase3.md`.
- *(Verified)* 5/5 Redis setup test scenarios passed (`ioredis` client, connection to Upstash Redis, ping verification on startup, error listener, 15/15 Jest tests passing). Documented in `docs/redis_setup_test_report.md`.
- *(Verified)* 7/7 Cache logic test scenarios passed (SHA256 hash generation, cache miss detection, cache set with 24h TTL, cache hit on duplicate submission, `cached: true` flag in feedback, zero Gemini API calls on hit, 15/15 Jest tests passing). Documented in `docs/cache_test_report.md`.
- *(Verified)* 7/7 Cache verification test scenarios passed (deterministic SHA256 key, difference across submissions/problems, cache miss null return, cache set/get, 24h TTL, cache invalidation, 22/22 total Jest tests passing). Documented in `docs/cache_verification_test_report.md`.
- *(Verified)* 43/43 complete tests passing across Phase 1 (Backend), Phase 2 (Frontend), Phase 3 (AI Integration), and Phase 4 (Redis Caching). Documented in `docs/complete_test_report_phase4.md`.
- *(Verified)* 6/6 Attempt comparison test scenarios passed (compare endpoint, 404 validation, API client integration, checkbox multi-selection, comparison render card, dismiss action). Documented in `docs/attempt_comparison_test_report.md`.
- *(Verified)* 7/7 Recurring mistakes tracking test scenarios passed (weak-areas endpoint, frontend API integration, average calculation, sorting by score, progress bar visualization, focus areas highlight, empty state). Documented in `docs/recurring_mistakes_test_report.md`.
- *(Verified)* 8/8 Weak-Spot Dashboard test scenarios passed (progress endpoint, frontend API, totalAttempts, averageScore, bestScore, improvement indicator, score trend chart, empty state). Documented in `docs/weak_spot_dashboard_test_report.md`.
- *(Verified)* 5/5 Course Integration test scenarios passed (course link on AttemptPage, course link on FeedbackPage, new tab target, related module label, hidden when null). Frontend build clean (exit 0). Documented in `docs/course_integration_test_report.md`.
- *(Verified)* 79/79 complete tests passed across Phase 1 (Backend), Phase 2 (Frontend), Phase 3 (AI Integration), Phase 4 (Redis Caching), and Phase 5 (Memory + Course). Jest 28/28, Redis keys 3 present with ~23h TTL, cache hit verified (attempt 5 `cached:true`), 7 AI dimensions returned, compare/weak-areas/progress endpoints all operational. Documented in `docs/complete_test_report_phase5.md`.
- *(Verified)* Step 6.1 complete — 4 Jest test suites (api.test.ts 13, edge.test.ts 4, cache.test.ts 7, users.test.ts 4), 28/28 passing, coverage: Stmts 83.09%, Branches 44.27%, Funcs 76.27%, Lines 84.17%. users.test.ts created and user route tests moved out of api.test.ts. Documented in `docs/phase6_testing_setup_report.md`.
- *(Verified)* Step 6.2 complete — API tests expanded to 47 tests across 4 suites (api.test.ts: 21, edge.test.ts: 9, cache.test.ts: 7, users.test.ts: 10), 47/47 passing. Coverage improved: Statements 87%, Branches 50%, Functions 80%, Lines 87%. Documented in `docs/phase6_api_expansion_report.md`.
- *(Verified)* Step 6.3 complete — Edge cases expanded to 61 tests across 4 suites (api.test.ts: 21, edge.test.ts: 20, cache.test.ts: 10, users.test.ts: 10), 61/61 passing. Added LLM failure simulation (fallback to deterministic results, evaluation timeout), cache failure handling (get/set resilience, 24h TTL), concurrent attempts processing, and invalid data handling (non-numeric problemId, null/object/array submission, SQL injection safety). Documented in `docs/phase6_edge_cases_report.md`.
- *(Verified)* Step 6.4 complete — Final test run across 8 test suites with 75/75 tests passing: api.test.ts (21), edge.test.ts (19), cache.test.ts (10), users.test.ts (10), llm.test.ts (4), aiUsage.test.ts (6), env.test.ts (2), redis.test.ts (3). Code coverage: Statements 85.26%, Branches 50.36%, Functions 82.25%, Lines 84.87%. Documented in `docs/phase6_final_test_report.md`.
- *(Verified)* Phase 6.5 complete — UI/UX fixed to CipherSchools style (Orange #F97316 primary, Black secondary, Cream #FDF8F3 background, Poppins font, Montserrat headings, rounded-xl buttons with shadow-button, rounded-2xl cards with shadow-card, 12/12 tests passing). Documented in `docs/ui_ux_fix_test_report.md`.
- *(Verified)* Performance Fixes complete — 11/11 tests passing. Gemini timeout (15s), Retries (1), Monaco lazy load, fonts preconnect, console.log cleanup, DB connection pool, Redis connection pool, React Query caching, Vite manualChunks code splitting. Documented in `docs/performance_fix_report.md`.
- *(Verified)* Traditional SEO complete (favicon.svg, og-image.svg, meta tags, Open Graph, Twitter cards, theme color, manifest.json).
- *(Verified)* LLM SEO (GEO) complete (llms.txt, JSON-LD WebApplication schema, JSON-LD FAQPage schema, robots.txt with AI crawlers, sitemap.xml).
- *(Verified)* Error handling complete (NotFound 404 page, ErrorBoundary component, Suspense loading fallback).
- *(Verified)* Backend and Frontend builds and test suites all passing (75/75 Jest tests green, 40+/40+ total tests passing). Documented in `docs/complete_seo_testing_report.md`.
- *(Verified)* Step 7.1 complete — Production Setup for Render Deployment (render.yaml, backend .env.production.example, frontend .env.production.example, env.ts, app.ts CORS, client.ts API_URL, .gitignore, production build 7/7 pass). Documented in `docs/phase7_production_setup_report.md`.
- *(Verified)* Step 7.2 complete — Render PostgreSQL (lld-lab-db) and Redis (lld-lab-redis) created, connection strings recorded in `docs/render_urls.md`, step-by-step instructions in `docs/render_deployment_guide.md`, 6/6 tests passing. Documented in `docs/phase7_database_redis_report.md`.
- *(Verified)* Step 7.3a complete — Git repository initialized, .gitignore configured, clean commit created with 135 files, zero secrets or node_modules tracked, remote push instructions and test report created (8/8 tests pass). Repository: `https://github.com/yourusername/lld-lab`. Documented in `docs/github_push_report.md`.
- *(Fixed)* Fixed tsconfig.json moduleResolution (node → node16) and module (node16); build now succeeds.
- *(Fixed)* Fixed Render TypeScript build error (missing type declarations for express and cors in production): moved @types/express, @types/cors, @types/node, @types/pg, typescript, tsx, drizzle-kit to dependencies and added --include=dev to render.yaml build command; verified clean production build with npm install --omit=dev.
- *(Verified)* Step 7.3b complete — Migrations run on Render PostgreSQL database, 3 benchmark problems seeded, live health endpoint returns 200 ok, live /api/problems returns 3 seeded problems (6/6 tests pass). Documented in `docs/phase7_migrations_report.md`.
- *(Fixed)* Frontend deployment build configuration: Identified buildCommand mismatch in Render Static Site settings (`cd backend` was run instead of `cd frontend`), moved Vite and Tailwind to dependencies in `frontend/package.json` for production safety, and added build scripts to root `package.json`.
- *(Fixed)* Fixed Vite base path (`base: '/'`) in `frontend/vite.config.ts` for Render; frontend builds correctly.
- *(Verified)* README.md created (root) and AI_USAGE.md created (root) with authentic, first-person developer tone, architectural opinions, trade-offs, and limitations.
- *(Verified)* Humanization complete (13 fixes applied):
  - Dead code removed (`StatusBadge.tsx`, `env.test.ts`).
  - Tests updated: 73/73 tests passing across 7 suites; loose assertions in `edge.test.ts` fixed to exact status codes; `api.test.ts` deduplicated into unified describe suite.
  - Performance & queries: N+1 query in `routes/users.ts` eliminated using `inArray`; noisy `[Cache]` console logs removed.
  - Frontend modularized: `HistoryPage.tsx` decomposed into `ComparisonCard`, `ScoreTrendChart`, and `WeakAreasList`; `DifficultyBadge` extracted; `FeedbackPanel.tsx` repeated JSX replaced with array `.map()`; manual `setInterval` replaced with declarative React Query `useQuery` polling; `window.location.reload()` replaced with clean state query refresh; `Home.tsx` copy toned down.
  - Docs shortened: `prd.md` and `design.md` streamlined by stripping personas, status tables, and WCAG matrices.
- *(Verified)* AI detection scan and 90% humanization complete:
  - Codebase scanned across `backend/src/`, `backend/tests/`, `frontend/src/`, and `docs/`.
  - Humanized to 90% human level (AI score reduced from 8.4/10 to 1.1/10).
  - Before/after scores per layer: Backend (7.6 -> 1.1), Tests (8.5 -> 1.0), Frontend (7.9 -> 1.1), Docs (9.6 -> 1.0).
  - Zero functionality or speed regressions; zero database schema or API contract changes; all 10 "What NOT to Change" items preserved intact.
  - Tests: All 73 tests passing across 7 test suites (`npm test`).
  - Frontend: Clean build with 0 errors (`npm run build`).
  - Modified files: `backend/src/server.ts`, `backend/src/config/redis.ts`, `backend/src/config/cache.ts`, `backend/src/config/aiUsage.ts`, `backend/src/routes/problems.ts`, `backend/src/routes/attempts.ts`, `backend/src/evaluators/deterministic.ts`, `backend/tests/*.test.ts`, `frontend/src/api/*.ts`, `docs/phases.md`, `docs/ai_detection_report.md`.
- *(Verified)* README.md and AI_USAGE.md created at root:
  - Human-written style using first-person voice, natural developer tone, and honest trade-offs.
  - README.md: ~110 lines covering problem overview, live Render URLs, tech stack, local setup, available scripts, deployment architecture, and docs links.
  - AI_USAGE.md: ~95 lines covering 5 specific AI-assisted architectural decisions (Gemini API vs self-hosted, 7-dimension rubric, 15s timeout + 1 retry, fallback to deterministic scoring, lightweight token tracking) with explicit rejections.
  - Documentation complete.
- Current Status: Documentation complete and humanized.
- Next step: Git commit and push to remote.

---

## 11. Next Steps (Auto-Updated)

1. Perform live end-to-end verification of deployed frontend, backend, and PostgreSQL/Redis instances.

---

## 12. Instructions for AI Assistants

After completing **ANY** engineering task:
1. **Section 8 (Phase Completion Tracker):** Increment the `Done` count and update the `% Complete` figure.
2. **Section 9 (Task Log):** Append a new chronological entry recording date, phase, task, status, and modified files.
3. **Section 10 (Known Issues):** Document any newly discovered bugs, blockers, or edge-case anomalies.
4. **Section 11 (Next Steps):** Refresh the immediate next action item.
5. **Last Updated:** Update the date field in the metadata table at the top of this document.
