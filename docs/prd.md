# Product Requirements Document (PRD)

# LLD Lab — Interactive Low-Level Design Learning & Evaluation Platform

| Metadata Attribute | Specification Value |
| :--- | :--- |
| **Title** | LLD Lab Platform Specification |
| **Version** | 1.0.0 |
| **Status** | Approved |
| **Type** | Product Requirements Document (PRD) |
| **Product Owner** | CipherSchools Curriculum & Engineering Team |
| **Last Updated** | September 2026 |
| **Target Release** | Q4 2026 |

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Target Users & Personas](#3-target-users--personas)
4. [Core Features](#4-core-features)
   - [4.1 Curated LLD Problem Repository](#41-curated-lld-problem-repository)
   - [4.2 Multi-File Interactive Code Workspace](#42-multi-file-interactive-code-workspace)
   - [4.3 Hybrid Evaluation Engine (Deterministic + LLM)](#43-hybrid-evaluation-engine-deterministic--llm)
   - [4.4 Attempt History & Longitudinal Memory](#44-attempt-history--longitudinal-memory)
   - [4.5 CipherSchools Course Integration](#45-cipherschools-course-integration)
   - [4.6 Socratic Hint Engine](#46-socratic-hint-engine)
5. [Data Models & Technical Specifications](#5-data-models--technical-specifications)
6. [Out of Scope](#6-out-of-scope)
7. [Success Criteria & Key Metrics](#7-success-criteria--key-metrics)
8. [Appendix: Visual Design & UI Specifications](#8-appendix-visual-design--ui-specifications)

---

## 1. Project Overview

**LLD Lab** is a specialized, web-based Low-Level Design (LLD) practice and assessment platform integrated into the **CipherSchools** learning ecosystem. While competitive programming and Data Structures & Algorithms (DSA) have standardized platforms (such as LeetCode, Codeforces, and HackerRank), Low-Level Design (Object-Oriented Analysis and Design) practice lacks automated, objective, and pedagogically rich environments.

LLD Lab bridges this gap by providing an end-to-end sandbox where software engineers design and implement robust, object-oriented software architectures against real-world problem statements (e.g., Parking Lot, Elevator System, Vending Machine). The platform employs a **Hybrid Evaluation Engine** pairing deterministic unit and stress testing with automated Large Language Model (LLM) architectural critique to verify functional correctness, SOLID principles compliance, design pattern implementation, clean code practices, and extensibility.

---

## 2. Problem Statement

Modern software engineering interviews at top tier technology companies and product firms heavily weigh Low-Level Design (LLD) / Machine Coding rounds. However, learners face substantial bottlenecks:

1. **Subjective Feedback Void:** Unlike DSA where test cases pass or fail deterministically, LLD evaluation is subjective. Learners submit designs on GitHub or forums without knowing if they adhered to SOLID principles or introduced severe anti-patterns.
2. **Lack of Standardized Machine Coding Sandboxes:** Candidates struggle to write multi-file object-oriented code from scratch within 60–90 minute windows without boilerplate management, class contract validation, or dynamic simulation.
3. **Absence of Longitudinal Progress Tracking:** Learners repeat the same design mistakes across different problems (e.g., violating the Single Responsibility Principle or hardcoding factory instantiations) because existing tools do not track architectural design habits across time.
4. **Disconnected Learning Loops:** Students watching recorded lectures on design patterns (e.g., Strategy, Factory, Observer, State) in CipherSchools courses cannot immediately apply the pattern in an evaluation-ready environment mapped directly to course modules.

---

## 3. Target Users & Personas

| Persona | Role / Profile | Primary Goal | Pain Points |
| :--- | :--- | :--- | :--- |
| **Persona A: Interview Aspirant (Aarav)** | Pre-final / Final year CS student or Junior SDE (0–2 years) | Crack Machine Coding rounds at Tier-1 tech companies. | Doesn't know if his class structure is extensible; struggles with multi-file code structuring under timed pressure. |
| **Persona B: Upskilling Professional (Neha)** | Mid-level Backend Engineer (3–5 years) enrolled in CipherSchools System Design Masterclass | Transition from procedural scripts to clean, maintainable enterprise OO architectures. | Needs automated critique on SOLID adherence, design pattern trade-offs, and concurrency bottlenecks. |
| **Persona C: CipherSchools Instructor / Mentor** | Lead Faculty & Course Creator | Monitor cohort progress, identify common class design mistakes, and assign hands-on homework. | Manual code reviews of 500+ student submissions per cohort is unscalable and time-prohibitive. |

---

## 4. Core Features

### 4.1 Curated LLD Problem Repository

The platform provides standard, production-modeled Low-Level Design challenges with explicit requirements, class expectations, and extensibility requirements.

#### Benchmark Problems Matrix

| Problem Identifier | Name | Complexity | Primary Design Patterns | Real-World Nuance / Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `LLD-001` | **Parking Lot System** | Medium | Factory, Strategy, Observer, Singleton | Multi-level spots, vehicle type hierarchy (Compact, Large, EV, Motorcycle), dynamic dynamic pricing strategy (Hourly, Peak, Flat), EV charging spot allocation, ticket generation and automated checkout. |
| `LLD-002` | **Elevator Dispatch System** | Hard | State, Strategy, Command, Dispatcher | Multiple elevator cars, LOOK/SCAN dispatch scheduling algorithm, weight limits, directional queuing (Idle, Moving Up, Moving Down), emergency override, door sensor management. |
| `LLD-003` | **Vending Machine** | Medium | State, Chain of Responsibility | Finite state machine (Idle, HasMoney, Dispensing, SoldOut), coin and note denominations inventory, change calculation algorithm, item stock management, cancellation and refund handling. |

#### Detailed Problem Specification Structure
Each problem includes:
- **Functional Requirements:** Exact behaviors the system must exhibit.
- **Non-Functional Requirements:** Thread-safety, latency bounds, memory constraints.
- **Class Model Contracts:** Pre-defined interfaces or base classes (when pedagogical scaffolding is required) or pure greenfield prompts.
- **Future Extensibility Requirement:** Hidden or revealed requirement changes (e.g., "Add support for Valet Parking" or "Support VIP priority override in Elevator") to test design adaptability.

---

### 4.2 Multi-File Interactive Code Workspace

A browser-based IDE tuned for multi-file Object-Oriented programming with the following capabilities:

- **Multi-File Navigation:** Tabbed editor supporting file creation, package organization (e.g., `models/`, `strategies/`, `services/`, `enums/`).
- **Supported Languages:** Java (primary), C++, Python 3, TypeScript.
- **Live Class Diagram Generation:** Automatically parses user code to render live UML class diagrams (Mermaid.js / PlantUML view) displaying relationships (`implements`, `extends`, `has-a`).
- **Language Server Protocol (LSP):** Autocomplete, syntax error linting, method signature suggestions, and import management.
- **Custom Execution Entry Point:** `Main` execution driver allowing users to test manual CLI inputs before triggering formal evaluation.

---

### 4.3 Hybrid Evaluation Engine (Deterministic + LLM)

Evaluation in LLD Lab is split into two complementary phases to balance objective correctness with structural quality.

```
+-----------------------------------------------------------------------------------+
|                            User Submission (Multi-file Code)                     |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                                 Orchestrator                                      |
+-----------------------------------------------------------------------------------+
                    |                                             |
                    v                                             v
+---------------------------------------+     +------------------------------------+
|    Deterministic Evaluation Engine    |     |      LLM Architectural Engine      |
+---------------------------------------+     +------------------------------------+
| - Test Runner (JUnit / PyTest / GTest)|     | - AST & Code Parsing               |
| - Concurrency & Thread-Safety Tests   |     | - SOLID Principles Rubric Analysis |
| - Edge Case & Boundary Verification   |     | - Design Pattern Detection         |
| - Performance & Memory Profiler       |     | - Anti-Pattern & Smell Detection   |
+---------------------------------------+     +------------------------------------+
                    |                                             |
                    +---------------------+-----------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                             Scoring & Synthesis Engine                            |
|       - Composite Score (100-pt Scale: 40% Deterministic + 60% Architectural)     |
|       - Actionable Review Cards & Refactoring Code Diffs                          |
+-----------------------------------------------------------------------------------+
```

#### 4.3.1 Deterministic Evaluation (40% Weightage)
- **Functional Test Suite:** Executes hidden unit test suites against public API contracts.
- **Concurrency Test Suite:** Spawns concurrent threads simulating simultaneous parking requests, race-condition payments, or concurrent elevator calls.
- **Edge-Case Suite:** Boundary checks (e.g., full parking lot, exact change unavailable, overweight elevator car).
- **Execution Sandbox:** Containerized gVisor / Firecracker microVM isolated runtime with strict limits (512MB RAM, 2s CPU timeout per test suite).

#### 4.3.2 LLM Architectural Evaluation (60% Weightage)
- Evaluates code against a rigorous rubric:
  1. **Single Responsibility Principle (SRP):** Classes have one reason to change (e.g., `ParkingFeeCalculator` is distinct from `ParkingSpot`).
  2. **Open-Closed Principle (OCP):** New vehicle types or pricing strategies require adding classes, not editing existing switch/case blocks.
  3. **Liskov Substitution Principle (LSP):** Subclasses extend base contracts without breaking behavior or throwing `NotSupportedException`.
  4. **Interface Segregation Principle (ISP):** Lean, client-specific interfaces rather than monolithic contracts.
  5. **Dependency Inversion Principle (DIP):** High-level modules depend on abstractions (interfaces) rather than concrete implementations.
  6. **Design Pattern Accuracy:** Identifies appropriate use of GoF patterns vs. pattern misuse / over-engineering.
  7. **Code Cleanliness:** Naming conventions, encapsulation, immutability, error handling.

#### 4.3.3 Evaluation Output Payload Schema
```json
{
  "submissionId": "sub_8f29d10a",
  "problemId": "LLD-001",
  "timestamp": "2026-09-27T10:14:00Z",
  "verdict": "ACCEPTED",
  "compositeScore": 88,
  "deterministicReport": {
    "score": 40,
    "maxScore": 40,
    "testsPassed": 24,
    "testsTotal": 24,
    "executionTimeMs": 842,
    "concurrencyStressPassed": true
  },
  "architecturalReport": {
    "score": 48,
    "maxScore": 60,
    "solidRubric": {
      "srp": { "score": 10, "max": 12, "feedback": "ParkingLotManager handles spot allocation and logging." },
      "ocp": { "score": 12, "max": 12, "feedback": "Strategy pattern utilized effectively for pricing models." },
      "lsp": { "score": 10, "max": 12, "feedback": "Clean subtype substitutions." },
      "isp": { "score": 8, "max": 12, "feedback": "IPaymentProcessor contains unused refund methods for Cash payment." },
      "dip": { "score": 8, "max": 12, "feedback": "Concrete SpotAllocationStrategy instantiated inside constructor." }
    },
    "patternsDetected": [
      { "pattern": "Strategy", "class": "HourlyFeeStrategy", "correctness": "OPTIMAL" },
      { "pattern": "Singleton", "class": "ParkingLotRegistry", "correctness": "ACCEPTABLE_THREADSAFE" }
    ],
    "antiPatterns": [
      {
        "name": "Tight Coupling via New Operator",
        "file": "ParkingLot.java",
        "line": 42,
        "suggestion": "Inject AllocationStrategy via dependency injection or factory."
      }
    ]
  }
}
```

---

### 4.4 Attempt History & Longitudinal Memory

LLD Lab tracks a learner's architectural journey across all submissions to provide compound learning insights.

- **Submission Timeline & Diff Visualizer:**
  - View every submitted iteration of a design problem.
  - Side-by-side AST and text diffs highlighting structural evolutions (e.g., refactoring a `switch-case` block into a polymorphic Strategy pattern).
- **Longitudinal Memory Engine (Personalized Anti-Pattern Tracker):**
  - Synthesizes recurring mistakes across different problems.
  - *Example insight:* "In both Parking Lot (Attempt 2) and Vending Machine (Attempt 1), you coupled your state management logic directly inside the main controller class instead of decoupling state transitions."
- **Skill Mastery Matrix:**
  - Dynamic radar chart mapping mastery in: Creational Patterns, Structural Patterns, Behavioral Patterns, Concurrency Management, SOLID Compliance, Extensibility.
- **Targeted Practice Recommendations:**
  - If a user consistently struggles with OCP, the system surfaces the Elevator Dispatcher problem with an emphasis on adding dynamic floor dispatchers without modifying core car classes.

---

### 4.5 CipherSchools Course Integration

Seamless integration with the existing CipherSchools ecosystem to serve as the official lab environment for the **Master Low-Level & System Design** course.

- **Unified Single Sign-On (SSO):** Shared authentication session using CipherSchools JWT / OAuth2 tokens.
- **In-Video Practice Anchors:** Embedded prompts in CipherSchools lecture videos ("Try Coding the Vending Machine State Pattern now") deep-linking directly to a pre-configured LLD Lab workspace.
- **Curriculum Milestone Sync:**
  - Automatically updates course completion percentage when associated LLD problems are completed with a composite score $\ge 75\%$.
  - Real-time webhook dispatches to CipherSchools LMS on evaluation completion.
- **Cohort Leaderboards & Instructor Insights:**
  - Course mentors can view cohort-wide heatmap of common design failures.
  - Downloadable cohort performance reports for live class discussion.

```
CipherSchools Course Player (Frontend)
          |
          |  (Deep-Link with auth token & courseContextId)
          v
LLD Lab Sandbox Workspace
          |
          |  (Submission Event)
          v
LLD Lab Hybrid Evaluator
          |
          |  (LMS Webhook: /api/v1/courses/progress-sync)
          v
CipherSchools Core LMS (Gradebook & Student Progress Updated)
```

---

### 4.6 Socratic Hint Engine

To preserve interview simulation authenticity, LLD Lab avoids revealing immediate solutions. It offers 3 progressive tiers of hints:

| Hint Tier | Description | Cost / Consequence |
| :--- | :--- | :--- |
| **Tier 1: Architectural Clue** | Socratic questions highlighting design flaws (e.g., *"What happens if a new payment method is introduced tomorrow?"*). | Free, no score penalty. |
| **Tier 2: Pattern Blueprint** | Suggests candidate GoF patterns and lists expected interfaces without implementing them. | -5% on final attempt score. |
| **Tier 3: Skeleton Refactor** | Provides structural interface/class skeleton code demonstrating pattern composition. | -15% on final attempt score. |

---

## 5. Data Models & Technical Specifications

### 5.1 Problem Entity Schema
```json
{
  "id": "LLD-001",
  "slug": "parking-lot-system",
  "title": "Design a Parking Lot System",
  "difficulty": "MEDIUM",
  "cipherSchoolsModuleId": "mod_cs_lld_04",
  "timeLimitMinutes": 90,
  "scaffoldingTemplates": {
    "java": {
      "files": [
        { "name": "ParkingSpot.java", "starterCode": "public abstract class ParkingSpot { ... }" },
        { "name": "ParkingLot.java", "starterCode": "public class ParkingLot { ... }" }
      ]
    },
    "python": {
      "files": [
        { "name": "parking_spot.py", "starterCode": "class ParkingSpot: ..." }
      ]
    }
  },
  "requiredPatterns": ["Strategy", "Factory"],
  "testHarnessConfig": {
    "testRunner": "junit-5",
    "timeoutMs": 3000,
    "memoryLimitMb": 512
  }
}
```

### 5.2 User Longitudinal Profile Schema
```json
{
  "userId": "usr_cipher_9812",
  "masteryScore": 76.5,
  "totalSubmissions": 18,
  "problemsResolved": 7,
  "solidComplianceRadar": {
    "srp": 84,
    "ocp": 62,
    "lsp": 90,
    "isp": 72,
    "dip": 58
  },
  "frequentAntiPatterns": [
    {
      "patternKey": "SWITCH_BASED_DISPATCHING",
      "occurrences": 4,
      "lastObservedIn": "LLD-003",
      "remediationLessonUrl": "https://cipherschools.com/lesson/strategy-pattern-refactoring"
    }
  ]
}
```

---

## 6. Out of Scope

To ensure a targeted and high-quality v1 release, the following capabilities are explicitly deferred:

| Feature / Capability | Reason for Deferral | Scheduled Future Phase |
| :--- | :--- | :--- |
| **High-Level System Design (HLD) Canvas** | Requires different distributed architecture simulation (load balancers, message brokers, caching nodes). | Phase 2 (HLD Lab) |
| **Peer-to-Peer Mock Interviews / Live Audio** | Live collaborative interview rooms require WebRTC infrastructure; v1 prioritizes automated self-serve learning. | Phase 2 |
| **Arbitrary Language Support (Go, Rust, C#)** | Keeping the initial language matrix focused on Java, Python, and C++ maximizes prompt fine-tuning and test runner reliability. | Phase 1.5 |
| **Custom User Problem Creation** | User-generated content requires complex test case sandbox isolation and validation tooling. | Phase 3 |

---

## 7. Success Criteria & Key Metrics

### 7.1 Learning & Engagement Metrics
- **Problem Completion Rate:** $\ge 65\%$ of users who start an LLD challenge complete it with a passing score ($\ge 70\%$).
- **Longitudinal Improvement:** $\ge 40\%$ reduction in recurring anti-patterns between a user's 1st and 5th problem submission.
- **CipherSchools Course Completion Boost:** $25\%$ increase in students completing the Machine Coding module of the flagship design course.

### 7.2 Technical Performance Metrics
- **Deterministic Test Execution Time:** $\le 3.5\text{ seconds}$ p95 execution latency in microVM sandbox.
- **LLM Architectural Evaluation Turnaround:** $\le 8\text{ seconds}$ p95 generation time for complete structured review report.
- **Evaluation Accuracy / Agreement Rate:** $\ge 90\%$ correlation between automated LLM rubric scores and manual expert mentor audit reviews on a sampled validation set.

### 7.3 System Reliability & SLA
- Platform availability: **99.9% uptime**.
- Zero remote code execution (RCE) vulnerabilities via sandbox isolation verification.

---

## 8. Appendix: Visual Design & UI Specifications

In alignment with **CipherSchools Brand Identity**, the platform uses a modern, light-theme interface optimized for long coding sessions:

- **Color Palette:**
  - **Background / Surface:** Clean White (`#FFFFFF`) and Soft Canvas Gray (`#F8FAFC`).
  - **Primary Accent / Brand:** CipherSchools Orange (`#FF5722` / `#F4511E`).
  - **Secondary Brand / Dark Contrast:** Deep Navy Slate (`#0F172A` / `#1E293B`).
  - **Success / Passed:** Emerald Green (`#10B981`).
  - **Warning / Anti-Pattern Alert:** Amber Orange (`#F59E0B`).
  - **Error / Broken Constraint:** Coral Red (`#EF4444`).
- **Typography:**
  - Primary UI: `Inter`, sans-serif.
  - Code Editor & Diff Viewer: `JetBrains Mono` or `Fira Code`.
- **Layout Architecture:**
  - 3-Column Split View:
    1. **Left Panel (30%):** Problem statement, functional constraints, live dynamic UML diagram viewer, hint trigger.
    2. **Center Panel (45%):** Multi-tab file explorer and Monaco code editor.
    3. **Right Panel (25%):** Hybrid evaluation console, test execution logs, real-time SOLID breakdown cards, and longitudinal history panel.
