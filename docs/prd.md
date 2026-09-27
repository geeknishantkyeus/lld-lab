# Product Requirements Document: LLD Lab

## 1. Overview

LLD Lab is a practice and evaluation platform for Low-Level Design (LLD). It provides a sandbox where developers submit object-oriented architectures against common system design problems (Parking Lot, Elevator System, Vending Machine) and receive automated feedback combining deterministic checks with LLM critique.

---

## 2. Core Functional Requirements

### 2.1 Problem Repository
The platform maintains benchmark LLD problems with structured requirements:
- **Parking Lot System:** Multi-level spots, vehicle hierarchy (Compact, Large, EV, Motorcycle), pricing strategy, ticket lifecycle.
- **Elevator System:** Multiple cars, dispatch scheduling algorithm, directional queuing, door controls.
- **Vending Machine:** State transitions (Idle, HasMoney, Dispensing, SoldOut), coin inventory, refund and inventory handling.

Each problem defines:
- Functional constraints and class contracts.
- Deterministic evaluation expectations (class names, methods, interfaces).
- Related course module links.

### 2.2 Submission & Code Workspace
- Users submit solutions containing text explanations and object-oriented code.
- Submissions are queued asynchronously to avoid blocking the HTTP request thread.
- Attempt status transitions: `PENDING` -> `EVALUATING` -> `COMPLETED` | `FAILED`.

### 2.3 Hybrid Evaluation Engine
Evaluation combines two complementary layers:

1. **Deterministic Verification (40%):**
   - Syntax and compilation check.
   - Required class, method, and interface presence validation.
   - Objective score calculation (0-100).

2. **LLM Architectural Critique (60%):**
   - Evaluates solution across 7 core software engineering dimensions:
     1. Responsibility Clarity (Single Responsibility Principle)
     2. SOLID Compliance
     3. Coupling & Cohesion
     4. Encapsulation
     5. Pattern Appropriateness
     6. Extensibility
     7. Design Trade-offs
   - Generates actionable suggestions and overall feedback.

### 2.4 Caching Layer
- Evaluated submissions are cached in Redis using a SHA-256 hash of `(problemId, normalizedSubmission, promptVersion)`.
- Cache TTL is 24 hours (86,400 seconds).
- Repeated identical submissions return sub-second cached evaluations.

### 2.5 History & Longitudinal Progress
- Tracks all user attempts with timestamps, scores, and status.
- Side-by-side attempt comparison endpoint (`/api/attempts/compare/:id1/:id2`).
- Weak area analysis aggregating dimension scores across attempts to surface recurring gaps.
- Progress metrics: total attempts, completion rate, average score, score trend over time.

---

## 3. Data Models

- **Users:** `id`, `name`, `email`, `createdAt`
- **Problems:** `id`, `title`, `description`, `requirements` (JSONB), `difficulty`, `courseLink`, `relatedModule`, `createdAt`
- **Attempts:** `id`, `userId`, `problemId`, `submission`, `status`, `createdAt`
- **Feedbacks:** `id`, `attemptId`, `deterministicResults` (JSONB), `aiResults` (JSONB), `cached` (boolean), `createdAt`

---

## 4. Non-Functional Requirements

- **Latency:** Deterministic checks execute under 100ms; LLM review completes within 10-15s timeout with fallback.
- **Reliability:** Background evaluation queue with concurrency control and automatic retries. If the LLM provider fails, deterministic results are returned with fallback status.
- **Portability:** Container-ready Node.js/PostgreSQL/Redis stack deployable to standard cloud environments (e.g., Render).
