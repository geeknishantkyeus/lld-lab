# Implementation Phases & Execution Roadmap

# LLD Lab — Layer-Wise Engineering Roadmap & Execution Plan

| Metadata Attribute | Specification Value |
| :--- | :--- |
| **Title** | LLD Lab Implementation Phases & Execution Roadmap |
| **Version** | 1.0.0 |
| **Status** | Approved |
| **Total Duration** | 16–18 Engineering Hours (7 Iterative Phases) |
| **Methodology** | Layer-Wise Incremental Build (Backend-First -> Frontend -> AI -> Cache -> Polish) |
| **Target Runtime** | Node.js 22 LTS / Express 5 / React 19 / PostgreSQL 16 / Redis 7 |
| **Last Updated** | September 2026 |

---

## Table of Contents
1. [Development Approach (Layer-Wise)](#1-development-approach-layer-wise)
2. [Phase 1: Backend (Node + Express + PostgreSQL)](#2-phase-1-backend-node--express--postgresql)
3. [Phase 2: Frontend (React + Vite + Tailwind)](#3-phase-2-frontend-react--vite--tailwind)
4. [Phase 3: AI Integration (Gemini API)](#4-phase-3-ai-integration-gemini-api)
5. [Phase 4: Redis Caching](#5-phase-4-redis-caching)
6. [Phase 5: Longitudinal Memory + Course Integration](#6-phase-5-longitudinal-memory--course-integration)
7. [Phase 6: Testing](#7-phase-6-testing)
8. [Phase 7: Deployment & Documentation](#8-phase-7-deployment--documentation)
9. [Timeline Summary](#9-timeline-summary)
10. [Key Milestones](#10-key-milestones)
11. [Risks & Mitigation](#11-risks--mitigation)

---

## 1. Development Approach (Layer-Wise)

LLD Lab adopts a strict **Layer-Wise Development Methodology**. Rather than implementing horizontal vertical slices where components remain partially broken across layers, we establish stable, independently verified foundational layers:

```
+-----------------------------------------------------------------------------------+
|  Phase 1: Robust Data Models, Express 5 APIs & Deterministic Queue (Port 5000)    |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|  Phase 2: React 19 UI, Monaco Dark Editor & API Client Connections (Port 5173)    |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|  Phase 3: Google Gemini API Integration for Deep Architectural / SOLID Rubrics    |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|  Phase 4: Redis Hash-Based Sub-Second Result Caching (SHA-256 Tokens)            |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|  Phase 5: Longitudinal Memory, Cross-Problem Mistakes & CipherSchools Deep-Links  |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|  Phase 6: Comprehensive Automated Test Suite (Jest + Supertest API Assertions)   |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|  Phase 7: Cloud Production Deployment (Render + Vercel + Neon + Upstash)          |
+-----------------------------------------------------------------------------------+
```

---

## 2. Phase 1: Backend (Node + Express + PostgreSQL)

- **Goal:** Build a robust, type-safe backend API with database persistence, relational schema models, deterministic validation, and background evaluation queue.
- **Estimated Duration:** 4.0 – 5.0 Hours
- **Dependencies:** None (Foundational Layer)

### Tasks
- [ ] Initialize Node.js 22 LTS workspace with TypeScript 5.7 and Express 5.0.1.
- [ ] Configure PostgreSQL database connection with Drizzle ORM 0.38 and postgres driver.
- [ ] Define relational database schema in `src/db/schema.ts` (`problems`, `users`, `attempts`, `feedback`).
- [ ] Execute initial database migrations using `drizzle-kit push`.
- [ ] Seed database with benchmark LLD problems (`Parking Lot`, `Elevator System`, `Vending Machine`).
- [ ] Configure in-memory priority queue (`p-queue 8.0.1`) for asynchronous evaluation task dispatch.
- [ ] Implement deterministic evaluation service:
  - [ ] Java/Python syntax compilation/parse checking.
  - [ ] Class name existence verification (e.g., `ParkingLot`, `Vehicle`, `ParkingSpot`).
  - [ ] Method signature verification (e.g., `park()`, `unpark()`, `calculateFee()`).
  - [ ] Basic execution assertion test harness.
- [ ] Implement status state machine: `PENDING` -> `EVALUATING` -> `COMPLETED` / `FAILED`.
- [ ] Implement RESTful route controllers:
  - [ ] `GET /api/v1/problems` & `GET /api/v1/problems/:id`
  - [ ] `POST /api/v1/attempts` (enqueue evaluation)
  - [ ] `GET /api/v1/attempts/:id` (fetch attempt status & result)
  - [ ] `GET /api/v1/users/me`
- [ ] Configure CORS, Helmet 8.0, and centralized Zod request validation middleware.

### Deliverables
| Deliverable | Location | Format |
| :--- | :--- | :--- |
| **API Server Core** | `apps/api/src/server.ts` | TypeScript Entry Point |
| **Database Schema** | `apps/api/src/db/schema.ts` | Drizzle ORM Schema |
| **Deterministic Evaluator** | `apps/api/src/services/deterministic.service.ts` | Node.js Service Module |
| **Task Queue Service** | `apps/api/src/services/queue.service.ts` | `p-queue` Orchestrator |
| **Problem Seed Script** | `apps/api/src/db/seed.ts` | TypeScript Migration Runner |

### Testing Criteria
| Verification Check | Verification Procedure | Expected Outcome |
| :--- | :--- | :--- |
| **Server Health** | `GET http://localhost:5000/api/v1/health` | Returns `{ "status": "ok", "uptime": ... }` with HTTP 200. |
| **Problem Catalog** | `GET http://localhost:5000/api/v1/problems` | Returns array of 3 seeded problems with starter files. |
| **Attempt Lifecycle** | `POST http://localhost:5000/api/v1/attempts` | Returns HTTP 202 `{ id, status: "PENDING" }`; moves to `COMPLETED` in $<2\text{s}$. |
| **Deterministic Rule Check** | Submit code missing `calculateFee()` | Returns `deterministicScore: 0` with exact missing method feedback. |

---

## 3. Phase 2: Frontend (React + Vite + Tailwind)

- **Goal:** Create a responsive, IDE-grade web application in React 19 featuring Monaco Code Editor, real-time submission tracking, and CipherSchools light theme aesthetics.
- **Estimated Duration:** 4.0 – 5.0 Hours
- **Dependencies:** Phase 1 (Working Backend API on localhost:5000)

### Tasks
- [ ] Initialize React 19 + Vite 6 + Tailwind CSS 4 application (`apps/web`).
- [ ] Configure Tailwind CSS design tokens (Primary Blue `#2563EB`, Secondary Orange `#F97316`, Canvas Gray `#F9FAFB`).
- [ ] Set up client routing with `react-router-dom`:
  - [ ] `Home` (`/`)
  - [ ] `Problem List` (`/problems`)
  - [ ] `Problem Detail & Workspace` (`/problems/:id`)
  - [ ] `Attempt Summary` (`/attempts/:id`)
  - [ ] `Feedback View` (`/attempts/:id/feedback`)
  - [ ] `User History` (`/history`)
- [ ] Implement core shared components:
  - [ ] `Navbar` (CipherSchools branding, breadcrumb navigation, status badges)
  - [ ] `ProblemCard` (difficulty pills, pattern tags, completion indicators)
  - [ ] `StatusBadge` (`PENDING`, `EVALUATING`, `COMPLETED`, `FAILED`)
  - [ ] `SolutionEditor` (Monaco Editor integration with dark theme `#1E1E1E`, multi-tab selector)
  - [ ] `FeedbackPanel` (split view tab with test console output and rubric cards)
- [ ] Set up Zustand store for workspace state (active file, solution code buffer, submission status).
- [ ] Connect Axios API client with polling/SSE listener to track attempt evaluation progress.

### Deliverables
| Deliverable | Location | Format |
| :--- | :--- | :--- |
| **Vite App Shell** | `apps/web/src/App.tsx` | React 19 TSX |
| **Monaco Code Editor** | `apps/web/src/components/SolutionEditor.tsx` | Monaco React Component |
| **Problem Workspace View** | `apps/web/src/pages/ProblemDetailPage.tsx` | 3-Column Split Pane Page |
| **API Client Service** | `apps/web/src/services/api.ts` | Axios Client Instance |
| **State Store** | `apps/web/src/stores/workspaceStore.ts` | Zustand Store |

### Testing Criteria
| Verification Check | Verification Procedure | Expected Outcome |
| :--- | :--- | :--- |
| **Page Navigation** | Click problem card on `/problems` | Seamlessly transitions to `/problems/:id` with loaded requirements. |
| **Monaco Editor Editing** | Type code in editor and switch tabs | Buffer state preserved across tabs; syntax highlighting operational. |
| **Interactive Submission** | Click "Submit for Evaluation" button | Button shows loading spinner; status badge transitions from `PENDING` -> `COMPLETED`. |
| **Visual Aesthetics** | Inspect DOM colors in Chrome DevTools | Canvas is `#F9FAFB`; Primary CTA is `#2563EB`; Monaco container is `#1E1E1E`. |

---

## 4. Phase 3: AI Integration (Gemini API)

- **Goal:** Integrate Google Gemini API (`@google/genai`) to critique object-oriented architecture across 7 core software engineering dimensions.
- **Estimated Duration:** 2.0 Hours
- **Dependencies:** Phase 1 (Backend API) & Phase 2 (Frontend Feedback View)

### Tasks
- [ ] Set up Google Gemini API access using `@google/genai 0.1.2` with `gemini-2.0-flash`.
- [ ] Design structured evaluation prompt enforcing strict JSON output:
  - [ ] Responsibility Clarity (Single Responsibility Principle - SRP)
  - [ ] SOLID Principles Compliance (OCP, LSP, ISP, DIP)
  - [ ] Coupling & Cohesion Analysis
  - [ ] Encapsulation & Data Hiding
  - [ ] Design Pattern Appropriateness (Factory, Strategy, State, Observer)
  - [ ] Extensibility Under Requirement Changes
  - [ ] Design Trade-offs & Anti-Pattern Detection
- [ ] Implement backend `gemini.service.ts` with retry policies and timeout guardrails.
- [ ] Merge deterministic score (40 pts) and Gemini architectural score (60 pts) into composite score.
- [ ] Update frontend `FeedbackPanel.tsx` to render:
  - [ ] Score breakdown progress bars.
  - [ ] Concrete refactoring suggestions with file and line references.
  - [ ] Detected design pattern badges.

```
+-----------------------------------------------------------------------------------+
|                        AI Prompt Generation & Evaluation Flow                     |
+-----------------------------------------------------------------------------------+
  User Source Code + Problem Requirements JSON
         |
         v
  Structured System Prompt (Demarcated <<<CODE>>> blocks)
         |
         v
  Google Gemini API (Model: gemini-2.0-flash, Temp: 0.1)
         |
         v
  Zod Schema Validation & JSON Parsing
         |
         v
  Combined Feedback Entity Persisted to PostgreSQL
```

### Deliverables
| Deliverable | Location | Format |
| :--- | :--- | :--- |
| **Gemini Evaluator Service** | `apps/api/src/services/gemini.service.ts` | Backend LLM Driver |
| **Evaluation Prompt Template**| `apps/api/src/prompts/lld-evaluation.ts` | Structured Prompt Definition |
| **Feedback UI Component** | `apps/web/src/components/FeedbackPanel.tsx` | React Feedback Component |

### Testing Criteria
| Verification Check | Verification Procedure | Expected Outcome |
| :--- | :--- | :--- |
| **AI Evaluation Trigger** | Submit complete Parking Lot code | Backend logs Gemini token usage and generates 7-dimension score in $<8\text{s}$. |
| **Structured Output Guard** | Verify raw response format | Output strictly parses through Zod schema without throwing `ZodError`. |
| **UI Score Rendering** | View `/attempts/:id/feedback` | Displays SOLID scorecard, specific anti-pattern alert, and detected pattern badge. |

---

## 5. Phase 4: Redis Caching

- **Goal:** Implement SHA-256 hash-based Redis caching to return instant sub-second evaluation feedback for identical code submissions.
- **Estimated Duration:** 1.0 Hour
- **Dependencies:** Phase 3 (Working AI & Deterministic Evaluation)

### Tasks
- [ ] Configure Redis client via `ioredis 5.4.2` supporting local instance or cloud (Upstash Redis).
- [ ] Implement cryptographic cache key generator:
  $$\text{CacheKey} = \text{"eval:"} + \text{SHA256}(\text{problemId} + \text{normalizeCode}(\text{code}) + \text{promptVersion})$$
- [ ] Implement cache hit / miss orchestrator:
  - [ ] **Cache Hit:** Read cached JSON report from Redis and return immediately with `cacheHit: true` in $<50\text{ms}$.
  - [ ] **Cache Miss:** Run deterministic sandbox + Gemini AI evaluation, store result in Redis with 7-day TTL (`EX 604800`).
- [ ] Display subtle "⚡ Cached Result" indicator on frontend feedback view for instant responses.

### Deliverables
| Deliverable | Location | Format |
| :--- | :--- | :--- |
| **Redis Client Instance** | `apps/api/src/lib/redis.ts` | ioredis Client Wrapper |
| **Evaluation Cache Service**| `apps/api/src/services/cache.service.ts` | SHA-256 Cache Manager |

### Testing Criteria
| Verification Check | Verification Procedure | Expected Outcome |
| :--- | :--- | :--- |
| **Cache Miss Handling** | Submit new solution for Parking Lot | Evaluation completes via standard pipeline in 4–7s; saved in Redis. |
| **Cache Hit Verification**| Submit identical solution immediately | Request returns in $<100\text{ms}$ with `cacheHit: true` and identical score. |
| **Whitespace Invariance** | Submit identical solution with extra spaces | Code normalizer resolves to same SHA-256 hash; triggers cache hit. |

---

## 6. Phase 5: Longitudinal Memory + Course Integration

- **Goal:** Track recurring architectural anti-patterns across a student's history, provide side-by-side diff comparisons, and deep-link directly into CipherSchools curriculum modules.
- **Estimated Duration:** 1.5 Hours
- **Dependencies:** Phase 2 (Frontend) & Phase 3 (AI Feedback)

### Tasks
- [ ] Implement Attempt Comparison View:
  - [ ] Side-by-side text diff of Attempt $N$ vs Attempt $N-1$.
  - [ ] Score delta indicator ($+12$ pts improvement in OCP).
- [ ] Implement Longitudinal Memory Tracker:
  - [ ] Track recurring mistakes (e.g., "Violated OCP 3 times across Parking Lot & Vending Machine").
  - [ ] Generate Weak-Spot Dashboard aggregating student design pitfalls.
- [ ] Build CipherSchools Course Integration:
  - [ ] Map each problem to official CipherSchools course modules (e.g., *Full Stack Development with AI*).
  - [ ] Add prominent "Practice This Problem" CTA button inside problem header.
  - [ ] Add "Watch Related Lecture" link pointing students to specific pattern lessons.

### Deliverables
| Deliverable | Location | Format |
| :--- | :--- | :--- |
| **Attempt Diff Viewer** | `apps/web/src/pages/AttemptComparePage.tsx` | React Diff Component |
| **Longitudinal Service**| `apps/api/src/services/longitudinal.service.ts`| Cross-Attempt Analytics |
| **Course Link Banner** | `apps/web/src/components/CourseIntegrationBanner.tsx` | CipherSchools CTA Bar |

### Testing Criteria
| Verification Check | Verification Procedure | Expected Outcome |
| :--- | :--- | :--- |
| **Multiple Submissions** | Submit 2 distinct attempts on Parking Lot | History page displays both attempts with chronological timestamps and scores. |
| **Diff Highlighting** | Open Attempt Comparison view | Code additions highlighted in green, deletions in red; score diff calculated. |
| **Course Deep Link** | Click "Watch Related Lecture" | Opens correct CipherSchools video URL in new browser tab. |

---

## 7. Phase 6: Testing

- **Goal:** Establish a rock-solid automated test suite using Jest and Supertest covering API routes, deterministic evaluation assertions, error boundaries, and Redis caching.
- **Estimated Duration:** 2.0 Hours
- **Dependencies:** Phases 1 through 5 Complete

### Tasks
- [ ] Set up Jest, `ts-jest`, and `supertest` in `apps/api`.
- [ ] Write integration test suites for core API endpoints:
  - [ ] `problems.test.ts`: List problems, fetch by slug, handle non-existent ID (404).
  - [ ] `attempts.test.ts`: Queue attempt, poll status, verify state machine transitions.
  - [ ] `deterministic.test.ts`: Test parsing of valid vs invalid class structures.
- [ ] Write edge-case test suites:
  - [ ] Empty code submission (reject with 400 Bad Request).
  - [ ] Gemini API timeout or simulated rate-limit failure (fallback to deterministic score).
  - [ ] Database disconnection handling.
- [ ] Write Redis cache integration test (confirm second request does not invoke AI evaluator).

### Deliverables
| Deliverable | Location | Format |
| :--- | :--- | :--- |
| **Jest Configuration** | `apps/api/jest.config.ts` | Test Harness Config |
| **API Test Suite** | `apps/api/tests/api.test.ts` | Supertest Integration Tests |
| **Evaluator Test Suite** | `apps/api/tests/evaluator.test.ts` | Unit & Deterministic Tests |

### Testing Criteria
| Verification Check | Verification Procedure | Expected Outcome |
| :--- | :--- | :--- |
| **Full Test Run** | Run `npm test` inside `apps/api` | 100% of test suites pass ($>15$ assertions) with green output. |
| **Fallback on AI Error**| Mock Gemini API network failure | Submission completes with `verdict: "PARTIAL"` using deterministic score only. |

---

## 8. Phase 7: Deployment & Documentation

- **Goal:** Deploy production frontend and backend services to the cloud and compile comprehensive developer documentation.
- **Estimated Duration:** 1.5 Hours
- **Dependencies:** Phase 6 (All Tests Green)

### Tasks
- [ ] Provision Managed Database on **Neon** (PostgreSQL 16).
- [ ] Provision Managed Redis on **Upstash**.
- [ ] Deploy Express 5 Backend API to **Render** with production environment variables.
- [ ] Deploy React 19 Frontend SPA to **Vercel** with Vite production build optimizations.
- [ ] Verify production CORS allowlists, HTTPS SSL handshakes, and database connection pooling.
- [ ] Write `README.md`:
  - [ ] System architecture summary.
  - [ ] Local setup instructions (`npm install`, `npm run dev`).
  - [ ] Environment variable documentation.
  - [ ] Key architectural trade-offs and current limitations.
- [ ] Write `AI_USAGE.md`:
  - [ ] Document 3–5 specific AI-assisted architectural decisions.
  - [ ] Explain prompt engineering iterations and rubric design.

### Deliverables
| Deliverable | Location | Format |
| :--- | :--- | :--- |
| **Live Frontend URL** | Vercel Platform (`https://lldlab.vercel.app`) | Deployed Web Application |
| **Live Backend URL** | Render Platform (`https://lldlab-api.onrender.com`) | Deployed REST API |
| **Project README** | `README.md` (root) | Markdown Documentation |
| **AI Usage Disclosure**| `AI_USAGE.md` (root) | Markdown Technical Memo |

### Testing Criteria
| Verification Check | Verification Procedure | Expected Outcome |
| :--- | :--- | :--- |
| **Live End-to-End Run** | Open live Vercel URL -> Submit Parking Lot solution | Full round-trip evaluation completes on live cloud infrastructure in $<8\text{s}$. |
| **Database Persistence**| Refresh browser on live site | Submitted attempt and score are persisted and retrieved from Neon PostgreSQL. |

---

## 9. Timeline Summary

| Phase | Core Objective | Estimated Hours | Cumulative |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Backend (Node + Express + PostgreSQL + Queue) | 4.5 Hours | 4.5 Hours |
| **Phase 2** | Frontend (React 19 + Vite + Tailwind + Monaco) | 4.5 Hours | 9.0 Hours |
| **Phase 3** | AI Integration (Gemini 2.0 Architectural Rubric) | 2.0 Hours | 11.0 Hours |
| **Phase 4** | Redis Caching (SHA-256 Sub-Second Result Cache) | 1.0 Hour | 12.0 Hours |
| **Phase 5** | Longitudinal Memory + CipherSchools Course Links | 1.5 Hours | 13.5 Hours |
| **Phase 6** | Automated Testing (Jest + Supertest API Coverage) | 2.0 Hours | 15.5 Hours |
| **Phase 7** | Cloud Deployment (Vercel + Render) & Documentation | 1.5 Hours | **17.0 Hours** |

---

## 10. Key Milestones

```
[M1: Backend Ready] ====> [M2: Frontend Ready] ====> [M3: AI Evaluator Active]
        |                         |                           |
        v                         v                           v
  API & Deterministic       Interactive Monaco          Composite 100-pt Score
  Queue on localhost:5000   Workspace on :5173          Generated via Gemini

======> [M4: Cache Active] ====> [M5: Memory & Course] ====> [M6: Tests Green] ====> [M7: Production Live]
               |                         |                           |                         |
               v                         v                           v                         v
        Sub-second hits           Attempt Diffs &             Zero test failures        Vercel + Render
        via Redis SHA-256         CipherSchools CTA           across endpoints          URLs Operational
```

- **M1: Backend API Ready** — Database migrated, seed problems loaded, deterministic queue functioning on port 5000.
- **M2: Frontend Workspace Ready** — Monaco editor operating with dark theme, responsive split layout active on port 5173.
- **M3: AI Feedback Working** — Google Gemini 2.0 evaluates code against 7-dimension SOLID rubric.
- **M4: Redis Caching Working** — Repeated submissions return cached result in $<100\text{ms}$.
- **M5: Comparison & Course Links Ready** — Side-by-side diff viewer and CipherSchools course integration banners live.
- **M6: All Tests Passing** — Complete Jest/Supertest suite passes with 100% green status.
- **M7: Deployed & Documented** — Production URLs active, `README.md` and `AI_USAGE.md` published.

---

## 11. Risks & Mitigation

| # | Identified Risk | Impact Level | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **R1** | **Gemini API Rate Limiting (HTTP 429)** | High | Medium | **Fallback to Deterministic Mode:** If Gemini returns a rate-limit error or times out ($>8\text{s}$), the system immediately returns the deterministic score (scaled to 100%) with a badge: *"Architectural review temporarily queued — deterministic pass confirmed."* |
| **R2** | **Redis Connection Outage** | Medium | Low | **Graceful In-Memory Fallback:** Wrap Redis client in a circuit breaker. If Redis is unreachable, fallback to an in-memory LRU cache (`lru-cache`) without blocking evaluation flow. |
| **R3** | **Cloud Deployment Configuration Issues** | High | Low | **Local Demonstration Backup:** Maintain fully functional Docker Compose (`docker-compose.yml`) stack locally that spins up PostgreSQL, Redis, API, and Web in a single command. |
| **R4** | **Time Shortage / Scope Creep** | Medium | Medium | **Strict MVP Boundary:** Defer secondary features (e.g., custom UML live rendering or complex voice notes) to prioritize the core: Edit -> Queue -> Evaluate -> Feedback. |
