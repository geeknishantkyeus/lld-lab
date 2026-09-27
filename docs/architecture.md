# Architecture Specification Document

# LLD Lab — System Architecture & Technical Design

| Metadata Attribute | Specification Value |
| :--- | :--- |
| **Title** | LLD Lab System Architecture Document |
| **Version** | 1.0.0 |
| **Status** | Approved |
| **Type** | Technical Architecture Document (TAD) |
| **Author** | CipherSchools Core Platform Engineering |
| **Target Runtime** | Node.js 22 LTS / PostgreSQL 16 / Redis 7 |
| **Last Updated** | September 2026 |

---

## Table of Contents
1. [System Overview (3-Tier Architecture)](#1-system-overview-3-tier-architecture)
2. [Complete Architecture Diagram](#2-complete-architecture-diagram)
3. [Application Flow (User Flow + Data Flow)](#3-application-flow-user-flow--data-flow)
   - [3.1 End-to-End User Flow](#31-end-to-end-user-flow)
   - [3.2 Hybrid Evaluation Data Flow](#32-hybrid-evaluation-data-flow)
4. [Technology Stack (Exact Versions)](#4-technology-stack-exact-versions)
5. [Database Schema (PostgreSQL & Drizzle ORM)](#5-database-schema-postgresql--drizzle-orm)
   - [5.1 Entity Relationship Overview](#51-entity-relationship-overview)
   - [5.2 Table Definitions & Drizzle Schema Code](#52-table-definitions--drizzle-schema-code)
6. [API Endpoints](#6-api-endpoints)
7. [Security Architecture](#7-security-architecture)
8. [Project / Folder Structure](#8-project--folder-structure)
9. [Deployment View](#9-deployment-view)

---

## 1. System Overview (3-Tier Architecture)

LLD Lab is architected using a decoupled **3-Tier Architecture** that enforces strict separation between client presentation, application business logic orchestration, and persistent storage / external evaluation engines.

```
+-----------------------------------------------------------------------------------+
|                        TIER 1: PRESENTATION LAYER (Client)                        |
|   React 19 + Vite 6 + Tailwind CSS 4 + Monaco Multi-File Editor + Zustand State   |
+-----------------------------------------------------------------------------------+
                                         |
                                         | HTTPS / WSS / JSON APIs
                                         v
+-----------------------------------------------------------------------------------+
|                      TIER 2: APPLICATION LAYER (Backend API)                      |
| Node.js 22 LTS + Express 5 + TypeScript 5.7                                      |
|   - Authentication & CipherSchools SSO Gateway                                    |
|   - Problem & Scaffolding Catalog Services                                        |
|   - Submission Orchestrator & In-Memory Task Queue (p-queue 8.0.1)                |
|   - Deterministic Sandbox Driver & Google Gemini 2.0 Architectural Engine         |
|   - Longitudinal Memory Aggregator & Analytics Engine                             |
+-----------------------------------------------------------------------------------+
                                         |
                       +-----------------+-----------------+
                       |                                   |
                       v                                   v
+---------------------------------------+ +-----------------------------------------+
|     TIER 3A: PERSISTENCE & CACHE      | |       TIER 3B: EVALUATION ENGINES       |
| - PostgreSQL 16 (via Drizzle ORM)     | | - Sandbox Runner (Isolated MicroVM)     |
| - Redis 7 (Tokens, Rate-limits, Cache)| | - Google Gemini API (Architectural LLM) |
+---------------------------------------+ +-----------------------------------------+
```

### 1.1 Presentation Layer (Tier 1)
- **Role:** Single Page Application (SPA) delivering an IDE-grade user interface with zero browser latency for keystrokes.
- **Key Responsibilities:**
  - Multi-tab file management and real-time state synchronization with Zustand.
  - Interactive Monaco Editor integration with language syntax support, code autocomplete, and custom keybindings.
  - Live client-side UML rendering via Mermaid.js parser.
  - Socratic hint accordion and longitudinal feedback visualizations.

### 1.2 Application Layer (Tier 2)
- **Role:** Centralized business logic and evaluation orchestrator exposed via RESTful endpoints and Server-Sent Events (SSE).
- **Key Responsibilities:**
  - Validates authentication tokens issued directly or delegated by CipherSchools SSO.
  - Manages evaluation job queuing using an in-memory priority queue (`p-queue`) to throttle CPU-intensive operations.
  - Coordinates concurrent calls between the deterministic code execution sandbox and the Google Gemini API.
  - Synthesizes composite scores and tracks cross-problem design mistakes.

### 1.3 Data & Persistence Layer (Tier 3)
- **Role:** ACID-compliant relational data store and ephemeral in-memory cache.
- **Key Responsibilities:**
  - **PostgreSQL 16:** Stores normalized user profiles, problem statements, starter templates, submission snapshots, evaluation rubrics, and longitudinal metrics.
  - **Redis 7:** Caches user sessions, rate-limiting counters, active problem metadata, and short-term evaluation progress tokens.

---

## 2. Complete Architecture Diagram

```
+---------------------------------------------------------------------------------------------------+
|                                        CLIENT BROWSER (TIER 1)                                    |
|                                                                                                   |
|  +------------------------+  +--------------------------------+  +-----------------------------+  |
|  |   Problem Statement    |  |       Monaco Multi-Editor      |  |    Live Evaluation Panel    |  |
|  |   - Requirements Docs  |  |   - Multi-Tab Navigation       |  |   - Deterministic Results   |  |
|  |   - Dynamic UML View   |  |   - AST Auto-Linting           |  |   - SOLID Radar Breakdown   |  |
|  |   - Tiered Hints       |  |   - Starter File Tree          |  |   - Anti-Pattern Warnings   |  |
|  +------------------------+  +--------------------------------+  +-----------------------------+  |
|                                              |                                                    |
|                               +--------------+---------------+                                    |
|                               |  Axios Client / SSE Listener |                                    |
+-------------------------------+------------------------------+------------------------------------+
                                               |
                                     HTTPS REST / SSE Stream
                                               |
+----------------------------------------------v----------------------------------------------------+
|                                    BACKEND SERVICE (TIER 2)                                       |
|                                Node.js 22 LTS + Express 5                                         |
|                                                                                                   |
|   +-------------------------------------------------------------------------------------------+   |
|   |                          API Gateway & Security Middleware Stack                          |   |
|   |   - Helmet 8.0 (Headers)    - CORS 2.8 (Domain Allowlist)   - Express Rate Limit 7.5      |   |
|   |   - JWT / CipherSchools SSO Verifier Middleware             - Zod Request Validator       |   |
|   +-------------------------------------------------------------------------------------------+   |
|                                              |                                                    |
|              +-------------------------------+-------------------------------+                    |
|              |                                                               |                    |
|   +----------v-----------+                                      +------------v------------+       |
|   |  Standard CRUD APIs  |                                      |   Submission Controller |       |
|   |  - Problem Catalog   |                                      |   - Payload Packaging   |       |
|   |  - User Profiles     |                                      |   - Attempt Snapshots   |       |
|   |  - Course Sync API   |                                      +------------+------------+       |
|   +----------+-----------+                                                   |                    |
|              |                                            Enqueues Execution Job                  |
|              |                                                               v                    |
|              |                                          +-------------------------------------+   |
|              |                                          |    In-Memory Queue (p-queue 8.0)    |   |
|              |                                          |    - Concurrency Limit: 8           |   |
|              |                                          |    - Priority: Interactive Tests    |   |
|              |                                          +------------------+------------------+   |
|              |                                                             |                      |
|              |                                      Worker Dequeues Job    |                      |
|              |                                                             v                      |
|              |                                          +-------------------------------------+   |
|              |                                          |     Hybrid Evaluation Pipeline      |   |
|              |                                          +------------------+------------------+   |
|              |                                                             |                      |
|              |                                   +-------------------------+--------------------+ |
|              |                                   |                                              | |
|              |                                   v                                              v |
|              |                      +--------------------------+                  +---------------------+
|              |                      | Deterministic Test Driver|                  |  Gemini AI Driver   |
|              |                      | - Isolated Sandbox Run   |                  | - AST Structural    |
|              |                      | - JUnit / PyTest Engine  |                  | - SOLID Audit       |
|              |                      | - Concurrency Assertions |                  | - GoF Pattern Check |
|              |                      +------------+-------------+                  +----------+----------+
|              |                                   |                                           |    |
|              |                                   +--------------------+----------------------+    |
|              |                                                        |                           |
|              |                                                        v                           |
|              |                                          +---------------------------+             |
|              |                                          | Result Synthesis Engine   |             |
|              |                                          | - Composite Score Compute |             |
|              |                                          | - Longitudinal Aggregator |             |
|              |                                          +-------------+-------------+             |
|              |                                                        |                           |
|              +--------------------------+-----------------------------+                           |
|                                         |                                                         |
+-----------------------------------------+---------------------------------------------------------+
                                          |
                        +-----------------+-----------------+
                        |                                   |
                        v                                   v
+---------------------------------------+   +---------------------------------------+
|        PostgreSQL 16 (Tier 3A)        |   |           Redis 7 (Tier 3A)           |
|                                       |   |                                       |
|  - Users & Credentials                |   |  - Active User Session Store          |
|  - Problems & File Scaffolding        |   |  - Rate-Limiting Counters             |
|  - Submissions & File Snapshots       |   |  - Evaluation Result Cache (TTL 1hr)  |
|  - Evaluation Reports & SOLID Scores  |   |  - CipherSchools SSO State Nonces     |
|  - Longitudinal Mastery Matrix        |   +---------------------------------------+
|  - Course Progress Sync Logs          |
+---------------------------------------+
```

---

## 3. Application Flow (User Flow + Data Flow)

### 3.1 End-to-End User Flow

```
[User on CipherSchools LMS]
           |
           | 1. Clicks "Launch LLD Lab" inside Course Module (e.g. Parking Lot)
           v
[CipherSchools SSO Auth Redirect]
           |
           | 2. Exchanges SSO Token for LLD Lab JWT Session
           v
[LLD Lab Workspace View]
           |
           | 3. Problem Statement & Scaffolding Files Loaded into Monaco Editor
           v
[User Codes Solution] <---------------+
           |                          |
           | 4. Requests Hint         | 5. Modifies Code
           v                          |
[Socratic Hint Displayed] ------------+
           |
           | 6. Clicks "Run Functional Tests" (Deterministic Sandbox Only)
           v
[Fast Functional Test Feedback (Pass/Fail Logs)]
           |
           | 7. Clicks "Submit for Architectural Evaluation"
           v
[Hybrid Evaluation Queued via p-queue]
           |
           | 8. SSE pushes real-time status: QUEUED -> TESTING -> ANALYZING -> COMPLETE
           v
[Evaluation Results Dashboard]
           |-- Functional Tests Score (40 pts)
           |-- SOLID Compliance Score (60 pts)
           |-- Pattern Detected Badge (e.g., "Strategy Pattern Verified")
           |-- Anti-Pattern Alert (e.g., "Switch-Case in FeeCalculator violates OCP")
           |-- Longitudinal Memory Card ("3rd time violating OCP across problems")
           v
[CipherSchools LMS Webhook]
           |
           | 9. Updates Student Gradebook & Course Completion Milestone
           v
[Completion Confirmed]
```

### 3.2 Hybrid Evaluation Data Flow

```
+---------------+           +---------------+           +---------------+           +-----------------+
| Monaco Client |           | Express API   |           |    p-queue    |           | Sandbox & LLM   |
+-------+-------+           +-------+-------+           +-------+-------+           +--------+--------+
        |                           |                           |                            |
        | POST /api/submissions     |                           |                            |
        | {problemId, files:[...]}  |                           |                            |
        +-------------------------->|                           |                            |
        |                           | Validate Zod Payload      |                            |
        |                           | Save Submission (PENDING) |                            |
        |                           +-------------------------->|                            |
        |                           | Enqueue Job               |                            |
        |                           |                           |                            |
        | 202 Accepted {jobId}      |                           |                            |
        |<--------------------------+                           |                            |
        |                                                       | Worker Picks Next Task     |
        |                                                       +--------------------------->|
        | SSE: /api/submissions/:id/stream                      |                            |
        +----------------------------------------------------------------------------------->|
        |                                                       |                            |
        |                                                       |  Execute Tests in Sandbox  |
        |                                                       |--------------------------->|
        |                                                       |  <Return JUnit XML / JSON> |
        |                                                       |<---------------------------|
        |                                                       |                            |
        |                                                       |  Prompt Gemini 2.0 API     |
        |                                                       |--------------------------->|
        |                                                       |  <Return SOLID AST JSON>   |
        |                                                       |<---------------------------|
        |                                                       |                            |
        |                                                       | Synthesize Composite Score |
        |                                                       | Save to DB & Redis         |
        |                                                       +--------------+-------------+
        |                                                                      |
        | SSE Event: { status: "COMPLETED", report: {...} }                    |
        |<---------------------------------------------------------------------+
        |                                                                      |
```

---

## 4. Technology Stack (Exact Versions)

| Tier / Component | Technology | Exact Version | Justification / Role |
| :--- | :--- | :--- | :--- |
| **Client Framework** | React | `19.0.0` | React Server Actions compatibility, fine-grained DOM updates, modern hooks. |
| **Client Bundler** | Vite | `6.0.7` | Sub-second HMR, optimized ES modules compilation. |
| **Styling Engine** | Tailwind CSS | `4.0.0` | High-performance CSS engine, minimal bundle footprint, design tokens. |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) | `4.7.0` | VS Code-grade code editor for multi-file syntax highlighting and editing. |
| **Client State** | Zustand | `5.0.3` | Lightweight, un-opinionated state management for file trees and active tabs. |
| **Data Fetching** | TanStack React Query | `5.64.0` | Server-state synchronization, optimistic UI updates, polling/caching. |
| **Runtime Environment** | Node.js (LTS) | `22.12.0` | Native fetch, modern V8 performance, stable asynchronous primitives. |
| **Server Framework** | Express | `5.0.1` | Native Promise support in route handlers, improved router robustness. |
| **Language / Typing** | TypeScript | `5.7.3` | Strict type safety across client, server, and shared data schemas. |
| **Database ORM** | Drizzle ORM | `0.38.3` | Zero-overhead type-safe SQL query builder and schema migration tool. |
| **Database Migration CLI**| Drizzle Kit | `0.30.2` | Automated schema diffing and declarative SQL migration generation. |
| **Relational Database** | PostgreSQL | `16.4` | Enterprise-grade ACID compliance, JSONB support for evaluation reports. |
| **Database Driver** | postgres (porsager/postgres)| `3.4.5` | Fast native PostgreSQL connection pooling for Node.js. |
| **In-Memory Cache** | Redis | `7.4.1` | High-throughput session storage, rate limiting, and temporary job tokens. |
| **Redis Client** | ioredis | `5.4.2` | Production Redis client with Cluster and Sentinel support. |
| **In-Memory Task Queue** | p-queue | `8.0.1` | Promise-based concurrency-limiting queue for evaluation task isolation. |
| **AI Model SDK** | Google Gen AI SDK (`@google/genai`)| `0.1.2` | Official SDK for Gemini 2.0 Flash / Pro models for structural evaluation. |
| **Schema Validation** | Zod | `3.24.1` | Runtime schema validation for API inputs, outputs, and LLM structured responses.|
| **Security Headers** | Helmet | `8.0.0` | Sets secure HTTP headers (CSP, HSTS, X-Content-Type-Options). |
| **CORS Middleware** | cors | `2.8.5` | Strict origin and header whitelisting for web applications. |
| **Authentication** | jsonwebtoken | `9.0.2` | Cryptographic JWT signing and verification for session tokens. |
| **Password Hashing** | bcrypt | `5.1.1` | Adaptive blowfish hashing for standalone authentication accounts. |

---

## 5. Database Schema (PostgreSQL & Drizzle ORM)

### 5.1 Entity Relationship Overview

```
+----------------+          +-------------------+          +----------------------+
|     users      | 1      * |    submissions    | 1      * |   submission_files   |
+----------------+----------+-------------------+----------+----------------------+
| id (PK)        |          | id (PK)           |          | id (PK)              |
| email          |          | user_id (FK)      |          | submission_id (FK)   |
| cipherschools_id          | problem_id (FK)   |          | file_path            |
+-------+--------+          | status            |          | content              |
        |                   | composite_score   |          +----------------------+
        | 1                 +---------+---------+
        |                             | 1
        |                             |
        | *                           v 1
+-------v--------------+    +-----------------------+      +----------------------+
| longitudinal_metrics |    |  evaluation_reports   |      |       problems       |
+----------------------+    +-----------------------+      +----------------------+
| id (PK)              |    | id (PK)               |      | id (PK)              |
| user_id (FK)         |    | submission_id (FK)    |  * 1 | slug                 |
| solid_radar (JSONB)  |    | deterministic_report  |------+ title                |
| anti_patterns (JSONB)|    | architectural_report  |      | difficulty           |
+----------------------+    | feedback_summary      |      | scaffold_files(JSONB)|
                            +-----------------------+      +----------------------+
```

### 5.2 Table Definitions & Drizzle Schema Code

```typescript
// server/src/db/schema.ts
import { pgTable, text, timestamp, integer, uuid, jsonb, boolean, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Users Table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash'),
  cipherSchoolsUserId: varchar('cipherschools_user_id', { length: 128 }).unique(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 32 }).default('STUDENT').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 2. Problems Table
export const problems = pgTable('problems', {
  id: varchar('id', { length: 32 }).primaryKey(), // e.g. LLD-001
  slug: varchar('slug', { length: 128 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  difficulty: varchar('difficulty', { length: 32 }).notNull(), // EASY, MEDIUM, HARD
  descriptionMarkdown: text('description_markdown').notNull(),
  cipherSchoolsModuleId: varchar('cipherschools_module_id', { length: 128 }),
  timeLimitMinutes: integer('time_limit_minutes').default(90).notNull(),
  supportedLanguages: jsonb('supported_languages').$type<string[]>().notNull(),
  scaffoldFiles: jsonb('scaffold_files').$type<Array<{ path: string; content: string; readOnly?: boolean }>>().notNull(),
  testHarnessConfig: jsonb('test_harness_config').$type<{
    runner: string;
    timeoutMs: number;
    memoryLimitMb: number;
  }>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 3. Submissions Table
export const submissions = pgTable('submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  problemId: varchar('problem_id', { length: 32 }).references(() => problems.id).notNull(),
  language: varchar('language', { length: 32 }).notNull(),
  status: varchar('status', { length: 32 }).default('QUEUED').notNull(), // QUEUED, EVALUATING, COMPLETED, FAILED
  compositeScore: integer('composite_score'),
  verdict: varchar('verdict', { length: 32 }), // ACCEPTED, NEEDS_REVISION, REJECTED
  attemptNumber: integer('attempt_number').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 4. Submission Files Table (Snapshots)
export const submissionFiles = pgTable('submission_files', {
  id: uuid('id').defaultRandom().primaryKey(),
  submissionId: uuid('submission_id').references(() => submissions.id, { onDelete: 'cascade' }).notNull(),
  filePath: text('file_path').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 5. Evaluation Reports Table
export const evaluationReports = pgTable('evaluation_reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  submissionId: uuid('submission_id').references(() => submissions.id, { onDelete: 'cascade' }).notNull().unique(),
  deterministicScore: integer('deterministic_score').notNull(),
  deterministicMaxScore: integer('deterministic_max_score').notNull(),
  deterministicDetails: jsonb('deterministic_details').$type<{
    testsPassed: number;
    testsTotal: number;
    executionTimeMs: number;
    concurrencyPassed: boolean;
    failureLogs?: string[];
  }>().notNull(),
  architecturalScore: integer('architectural_score').notNull(),
  architecturalMaxScore: integer('architectural_max_score').notNull(),
  solidBreakdown: jsonb('solid_breakdown').$type<{
    srp: { score: number; feedback: string };
    ocp: { score: number; feedback: string };
    lsp: { score: number; feedback: string };
    isp: { score: number; feedback: string };
    dip: { score: number; feedback: string };
  }>().notNull(),
  detectedPatterns: jsonb('detected_patterns').$type<Array<{
    pattern: string;
    targetClass: string;
    assessment: string;
  }>>().notNull(),
  antiPatternsIdentified: jsonb('anti_patterns_identified').$type<Array<{
    title: string;
    filePath: string;
    lineNumber?: number;
    explanation: string;
    remediation: string;
  }>>().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 6. Longitudinal Metrics Table
export const longitudinalMetrics = pgTable('longitudinal_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  overallMasteryScore: integer('overall_mastery_score').default(0).notNull(),
  solidRadarStats: jsonb('solid_radar_stats').$type<{
    srpAvg: number;
    ocpAvg: number;
    lspAvg: number;
    ispAvg: number;
    dipAvg: number;
  }>().notNull(),
  historicalAntiPatterns: jsonb('historical_anti_patterns').$type<Array<{
    patternKey: string;
    occurrencesCount: number;
    lastSeenSubmissionId: string;
    lastSeenAt: string;
  }>>().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 7. Hint Usage Table
export const hintUsages = pgTable('hint_usages', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  problemId: varchar('problem_id', { length: 32 }).references(() => problems.id).notNull(),
  tier: integer('tier').notNull(), // 1, 2, or 3
  scorePenaltyPercent: integer('score_penalty_percent').notNull(),
  requestedAt: timestamp('requested_at', { withTimezone: true }).defaultNow().notNull(),
});

// 8. CipherSchools Sync Logs Table
export const cipherSchoolsSyncLogs = pgTable('cipherschools_sync_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  submissionId: uuid('submission_id').references(() => submissions.id, { onDelete: 'cascade' }).notNull(),
  payloadSent: jsonb('payload_sent').notNull(),
  responseStatus: integer('response_status').notNull(),
  syncedAt: timestamp('synced_at', { withTimezone: true }).defaultNow().notNull(),
});

// Drizzle Relations Declarations
export const usersRelations = relations(users, ({ many, one }) => ({
  submissions: many(submissions),
  longitudinalMetric: one(longitudinalMetrics, {
    fields: [users.id],
    references: [longitudinalMetrics.userId],
  }),
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  user: one(users, { fields: [submissions.userId], references: [users.id] }),
  problem: one(problems, { fields: [submissions.problemId], references: [problems.id] }),
  files: many(submissionFiles),
  report: one(evaluationReports, {
    fields: [submissions.id],
    references: [evaluationReports.submissionId],
  }),
}));
```

---

## 6. API Endpoints

All APIs adhere to standard RESTful conventions, returning JSON responses with unified envelope structures `{ success: boolean, data?: T, error?: { code: string, message: string } }`.

| Method | Endpoint | Auth | Description | Request Payload | Response Schema |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/auth/sso/cipherschools` | Public | Exchanges CipherSchools token for LLD Lab JWT. | `{ "ssoToken": "jwt_string" }` | `{ "token": "jwt", "user": { "id", "name", "role" } }` |
| **GET** | `/api/v1/problems` | Optional | Returns catalog of LLD problems with filter tags. | Query params: `?difficulty=MEDIUM` | `Array<ProblemSummary>` |
| **GET** | `/api/v1/problems/:id` | Bearer | Fetches problem requirements and default scaffolding. | None | `ProblemDetail & { files: [...] }` |
| **POST** | `/api/v1/problems/:id/hints` | Bearer | Unlocks a progressive hint tier. | `{ "tier": 1 \| 2 \| 3 }` | `{ "tier": number, "content": string, "penalty": number }` |
| **POST** | `/api/v1/submissions` | Bearer | Submits multi-file solution for hybrid evaluation. | `{ "problemId": "LLD-001", "language": "java", "files": [{ "path", "content" }] }` | `{ "submissionId": "uuid", "status": "QUEUED" }` |
| **GET** | `/api/v1/submissions/:id` | Bearer | Fetches final submission status and full evaluation report.| None | `SubmissionWithReport` |
| **GET** | `/api/v1/submissions/:id/stream` | Bearer | Server-Sent Events (SSE) stream for live job progress. | None | SSE Stream: `data: { step, progress, status }` |
| **GET** | `/api/v1/users/me/metrics` | Bearer | Retrieves student's longitudinal memory & SOLID radar. | None | `LongitudinalProfile` |
| **GET** | `/api/v1/problems/:id/history` | Bearer | Fetches past user attempts for current problem. | None | `Array<SubmissionSummary>` |
| **POST** | `/api/v1/webhooks/cipherschools/retry`| Admin | Retries failed webhook dispatch to CipherSchools LMS. | `{ "submissionId": "uuid" }` | `{ "synced": true }` |

---

## 7. Security Architecture

```
                                  [HTTPS Ingress Request]
                                             |
                                             v
                      +---------------------------------------------+
                      |               Network Security              |
                      |   - TLS 1.3 Termination (Cloudflare/Nginx)  |
                      |   - DDoS & Bot Protection Rate Limiting     |
                      +----------------------+----------------------+
                                             |
                                             v
                      +---------------------------------------------+
                      |         Application Perimeter Security      |
                      |   - Helmet 8.0: Strict CSP, HSTS, XSS guard |
                      |   - CORS 2.8: Whitelist cipher-schools apps |
                      |   - express-rate-limit: 100 req/min/IP      |
                      +----------------------+----------------------+
                                             |
                                             v
                      +---------------------------------------------+
                      |         Authentication & Authorization      |
                      |   - Stateless JWT Verification (HS256/RS256)|
                      |   - CipherSchools Public Key SSO Signature  |
                      |   - Role-Based Access Control (RBAC)        |
                      +----------------------+----------------------+
                                             |
                                             v
                      +---------------------------------------------+
                      |            Input Defense & Isolation        |
                      |   - Zod Payload Sanitization & Schema Check |
                      |   - Deterministic Sandbox: Non-root User,   |
                      |     gVisor/Firecracker, No Outbound Network |
                      |   - AI Prompt Injection Defenses & Filters  |
                      +---------------------------------------------+
```

### 7.1 Sandbox Isolation & Remote Code Execution (RCE) Defense
- **User Code Execution:** Executed inside lightweight ephemeral microVMs/containers with:
  - Network isolation: `--net=none` (all outbound sockets blocked).
  - Filesystem: Read-only root filesystem with a transient `tmpfs` volume restricted to 64MB.
  - Resource limits: Hard capped at 1 vCPU and 512MB RAM using Linux cgroups.
  - Process limits: Maximum 32 threads/processes to prevent fork bombs.
  - Execution timeout: Hard kill signal (`SIGKILL`) dispatched after 3,000ms.

### 7.2 AI Prompt Injection Mitigation
- Evaluation prompts submitted to the Google Gemini API format user code as raw literal data strings wrapped inside demarcated delimiter tokens (e.g., `<<<USER_SOURCE_CODE>>>`).
- Prompts use system instructions commanding the model to treat all source code exclusively as static Abstract Syntax Tree (AST) inputs for analysis, completely ignoring any instruction embedded inside comments or string literals.

---

## 8. Project / Folder Structure

The project is structured as a clean, modular repository with explicit boundaries:

```
lld-lab/
├── apps/
│   ├── web/                           # Client Application (React 19 + Vite 6 + Tailwind 4)
│   │   ├── public/
│   │   │   └── favicon.svg
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   │   ├── common/            # Buttons, Badges, Modals, Tabs
│   │   │   │   ├── editor/            # Monaco Editor, FileTree, TabBar, LanguageSelector
│   │   │   │   ├── evaluation/        # SolidRadarChart, TestResults, AntiPatternCard
│   │   │   │   ├── layout/            # Navbar, AppHeader, ThreeColumnSplitPane
│   │   │   │   ├── problem/           # ProblemDescription, DynamicUmlViewer, HintAccordion
│   │   │   │   └── history/           # AttemptTimeline, DiffViewer
│   │   │   ├── hooks/                 # useEditorState, useEvaluationStream, useHints
│   │   │   ├── stores/                # Zustand stores (editorStore, submissionStore)
│   │   │   ├── services/              # API Client instances (api.ts, sse.ts)
│   │   │   ├── types/                 # Frontend TypeScript interfaces
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── index.css              # Tailwind CSS styles and theme variables
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   └── api/                           # Backend Application (Node.js 22 + Express 5)
│       ├── src/
│       │   ├── config/                # Environment variables, constants
│       │   ├── controllers/           # HTTP Request Controllers
│       │   │   ├── auth.controller.ts
│       │   │   ├── problems.controller.ts
│       │   │   ├── submissions.controller.ts
│       │   │   └── metrics.controller.ts
│       │   ├── db/                    # Drizzle ORM Setup
│       │   │   ├── connection.ts
│       │   │   ├── schema.ts          # Relational table schemas
│       │   │   └── migrations/        # SQL migration files
│       │   ├── middleware/            # Auth, Validation, Error Handling, Rate Limiting
│       │   │   ├── auth.middleware.ts
│       │   │   ├── validate.middleware.ts
│       │   │   └── error.middleware.ts
│       │   ├── services/              # Core Business Logic
│       │   │   ├── evaluation/
│       │   │   │   ├── orchestrator.service.ts
│       │   │   │   ├── deterministic.service.ts
│       │   │   │   ├── gemini-evaluator.service.ts
│       │   │   │   └── synthesizer.service.ts
│       │   │   ├── queue/             # p-queue Job Worker
│       │   │   │   └── task-queue.service.ts
│       │   │   ├── longitudinal/
│       │   │   │   └── memory.service.ts
│       │   │   └── cipherschools/
│       │   │       └── lms-webhook.service.ts
│       │   ├── routes/                # Express Route Bindings
│       │   │   └── v1/
│       │   │       ├── auth.routes.ts
│       │   │       ├── problems.routes.ts
│       │   │       ├── submissions.routes.ts
│       │   │       └── metrics.routes.ts
│       │   ├── types/                 # Shared backend types
│       │   └── server.ts              # Express Server entrypoint
│       ├── package.json
│       ├── tsconfig.json
│       └── drizzle.config.ts
│
├── docs/                              # Project Documentation
│   ├── prd.md                         # Product Requirements Document
│   └── architecture.md                # System Architecture Document
│
├── docker/
│   ├── docker-compose.yml             # Local dev stack (PostgreSQL, Redis, API, Web)
│   ├── Dockerfile.web
│   ├── Dockerfile.api
│   └── Dockerfile.sandbox             # Isolated runner container image
│
├── package.json                       # Monorepo / Root workspace package.json
└── README.md
```

---

## 9. Deployment View

```
                                    +-----------------------+
                                    |     Cloudflare DNS    |
                                    |   - SSL/TLS Ingress   |
                                    |   - WAF & Edge Cache  |
                                    +-----------+-----------+
                                                |
                                                v
                                    +-----------------------+
                                    |  Reverse Proxy Nginx  |
                                    +-----------+-----------+
                                                |
                       +------------------------+------------------------+
                       |                                                 |
                       | / (Static Assets)                               | /api/* (API Traffic)
                       v                                                 v
         +----------------------------+                    +----------------------------+
         |  Frontend Container        |                    |  Backend Express 5 API     |
         |  - Nginx serving Vite build|                    |  - 2 x Node.js 22 Tasks    |
         |  - Port 80                 |                    |  - Port 4000               |
         +----------------------------+                    +--------------+-------------+
                                                                          |
                                       +----------------------------------+-----------------------+
                                       |                                  |                       |
                                       v                                  v                       v
                         +--------------------------+       +------------------------+ +---------------------+
                         | PostgreSQL 16 Instance   |       | Redis 7 Instance       | | Sandbox Docker Host |
                         | (Managed Cloud DB)       |       | (Managed ElastiCache)  | | - gVisor Isolated   |
                         +--------------------------+       +------------------------+ +---------------------+
```

### 9.1 Environment Variable Configuration Matrix
```env
# Server Runtime
NODE_ENV=production
PORT=4000
API_BASE_URL=https://lldlab.cipherschools.com/api/v1

# Database Configuration
DATABASE_URL=postgresql://lld_user:SecurePassword123@postgres.internal:5432/lld_lab_db
REDIS_URL=redis://redis.internal:6379

# Google Gemini API
GEMINI_API_KEY=AIzaSyD-ExampleKeyForGemini2-0ArchitecturalEval
GEMINI_MODEL=gemini-2.0-flash

# CipherSchools LMS Integration
CIPHERSCHOOLS_SSO_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...\n-----END PUBLIC KEY-----
CIPHERSCHOOLS_LMS_WEBHOOK_URL=https://api.cipherschools.com/internal/v1/gradebook/sync
CIPHERSCHOOLS_WEBHOOK_SECRET=whsec_9938a0f912c4b8

# Security & Tokens
JWT_SECRET=super_secret_jwt_hmac_sha256_key_lld_lab
JWT_EXPIRATION_HOURS=24
```
