# Development Rules & Engineering Standards

# LLD Lab — Engineering Protocols & Code Quality Standards

| Metadata Attribute | Specification Value |
| :--- | :--- |
| **Title** | LLD Lab Engineering Rules & Guidelines |
| **Version** | 1.0.0 |
| **Status** | Active / Strictly Enforced |
| **Applies To** | All Engineers, AI Coding Assistants, and Pull Requests |
| **Owner** | CipherSchools Core Platform Engineering |
| **Last Updated** | September 2026 |

---

## Table of Contents
1. [Project-Wide Rules](#1-project-wide-rules)
2. [What TO DO (Per-Layer Rules)](#2-what-to-do-per-layer-rules)
3. [What TO AVOID (Common Mistakes & Anti-Patterns)](#3-what-to-avoid-common-mistakes--anti-patterns)
4. [Libraries & Tools (Exact Versions)](#4-libraries--tools-exact-versions)
5. [AI Boundaries & Scope Guardrails](#5-ai-boundaries--scope-guardrails)
6. [Environment Variables](#6-environment-variables)
7. [Error Handling Standards](#7-error-handling-standards)
8. [Commit Message Format](#8-commit-message-format)
9. [Code Review Checklist](#9-code-review-checklist)
10. [Documentation Rules](#10-documentation-rules)
11. [AI Development Guidelines & Code Density](#11-ai-development-guidelines--code-density)
12. [Core Development Principles](#12-core-development-principles)

---

## 1. Project-Wide Rules

### 1.1 Minimal Code Philosophy
- **Write the LEAST amount of code needed** to solve the problem completely and correctly.
- **No extra comments:** Never comment *WHAT* code does (the code itself is the specification); comment only *WHY* non-obvious business or algorithmic trade-offs were made.
- **No extra blank lines:** Keep code compact and cohesive. Group related statements together; avoid double/triple blank lines.
- **No speculative helper functions:** Do not extract logic into a shared helper function unless that exact logic is reused across at least **3 distinct call sites**.
- **No extra files:** Colocate related types, functions, and state in the same file. Do not create a new file if the code logically belongs to an existing module.
- **No extra abstractions:** Respect KISS (Keep It Simple, Stupid). Avoid premature generic classes, unnecessary interfaces, and wrapper layers that add no immediate runtime value.
- **No redundant dependencies:** Never install a package if standard Node.js/Web APIs or existing workspace libraries already solve the requirement.
- **No lingering debug logs:** Never commit `console.log`, `debugger`, or print statements. Use structured application logs or remove temporary trace lines prior to committing.

### 1.2 Anti-AI-Written Feel
- **Ban AI Boilerplate:** Do not write verbose, robotic boilerplate that merely restates the obvious.
- **No Trivial JSDoc/TSDoc:** Never add `@param` and `@returns` docstrings to simple, well-typed TypeScript functions where type signatures already convey everything.
- **Ban Echo Comments:** Strictly forbid comments like `// Fetch user from DB` above `await getUserById(id)`.
- **Descriptive & Concrete Names:** Never use generic tokens (`data`, `result`, `temp`, `obj`, `item`, `res2`). Use concrete domain terminology (`submissionSnapshot`, `solidScore`, `codeFile`).
- **Human Pragmatism:** Write direct, idiomatic code like an experienced senior staff engineer—not an overly polite, generic textbook generator.

### 1.3 File Organization (Minimal)
- **Prefer fewer, denser files:** Do not fragment codebases into microscopic single-function files.
- **300-Line Threshold:** Keep related logic within the same file. Only split into separate sub-modules when a file naturally exceeds **300 lines of active code**.
- **No Barrel File Pollution:** Avoid empty `index.ts` re-export files unless an entire package is distributed as an external library. Import directly from module files.
- **Colocate Types:** Keep interfaces and types inline alongside the functions/components that consume them. Only move them to a shared `types.ts` if consumed across 3+ separate modules.

### 1.4 Code Density & Syntax Conciseness
- **1 readable line > 3 padded lines:** Leverage idiomatic JavaScript/TypeScript constructs.
- **Ternaries for assignment:** Use clear ternary operators rather than 5-line `if/else` ladders for single assignments.
- **Arrow functions & concise expressions:** Use concise arrow syntax for mapping, filtering, and short utility handlers.
- **Destructuring:** Destructure function arguments and object payloads directly in signatures to eliminate redundant local variable declarations.

```typescript
// ❌ BAD: Bloated, verbose, AI-style formatting
function calculateScore(results) {
  let finalScore;
  if (results.isPassed === true) {
    finalScore = results.baseScore + 10;
  } else {
    finalScore = results.baseScore;
  }
  return finalScore;
}

// ✅ GOOD: Dense, direct, senior-human style
const calculateScore = ({ isPassed, baseScore }: TestResult) =>
  baseScore + (isPassed ? 10 : 0);
```

### 1.5 Comment Rules
- Comments must answer **"WHY did we make this non-standard choice?"**
- **Zero dead code:** Never leave commented-out code blocks in pull requests. Delete dead code; Git preserves history.
- **No TODOs without tracking:** Every `TODO:` comment must link to an active issue (e.g., `// TODO(#142): Add fallback if Redis connection drops`).
- **No decorative dividers:** Strictly ban comment dividers like `// ================= CONTROLLER =================`.

---

## 2. What TO DO (Per-Layer Rules)

### 2.1 Presentation Layer (React 19 + Tailwind CSS 4)
- **Functional Components Only:** Use concise functional components with TypeScript props.
- **Zustand Store Colocation:** Maintain flat state in Zustand stores (`editorStore.ts`, `submissionStore.ts`) without unnecessary action wrappers.
- **Tailwind Utility Classes:** Style components directly using Tailwind CSS utility tokens. Do not write custom CSS classes unless building complex multi-keyframe animations.
- **Monaco Editor Performance:** Mount Monaco editor instances once; update models in-memory rather than triggering full component remounts on file switches.
- **Native Web APIs:** Use native browser capabilities (e.g., `crypto.randomUUID()`, `navigator.clipboard`) instead of introducing utility packages.

### 2.2 Application Layer (Node.js 22 LTS + Express 5)
- **Leverage Express 5 Native Async Handlers:** Express 5 handles Promise rejections automatically; avoid wrapping every controller body with manual `try/catch` blocks unless adding specific error context.
- **Perimeter Validation with Zod:** Validate all external client inputs (`req.body`, `req.params`, `req.query`) immediately at the route perimeter using Zod schemas.
- **Direct Service Execution:** Write lean controllers that extract validated inputs, invoke domain services, and return standard JSON envelopes.
- **Throttled Concurrency via `p-queue`:** Enqueue all resource-intensive evaluation tasks into `p-queue` with hard concurrency limits (max 8 concurrent jobs).

### 2.3 Persistence & Cache Layer (Drizzle ORM + PostgreSQL 16 + Redis 7)
- **Direct Type-Safe Queries:** Use Drizzle ORM directly without creating redundant repository abstractions.
- **Single Source of Truth:** Declare database tables in `schema.ts`; infer TypeScript types directly via `typeof table.$inferSelect`.
- **JSONB for Unstructured Data:** Store multi-file snapshots, AST analysis trees, and evaluation logs in PostgreSQL `JSONB` columns.
- **Atomic Operations:** Wrap multi-table operations (e.g., saving submission + snapshot files + queue job token) in `db.transaction()`.
- **Redis TTL Discipline:** Always specify an explicit Time-To-Live (TTL) on Redis keys (`SET key val EX 3600`) to prevent memory leaks.

### 2.4 AI Integration Layer (Google Gemini API via `@google/genai`)
- **Strict Delimiters:** Wrap untrusted user code inside unambiguous delimiters (e.g., `<<<USER_SUBMISSION_CODE>>>`).
- **Enforce Structured JSON Outputs:** Request output in strict JSON format conforming to the `EvaluationReport` schema.
- **Temperature Control:** Use deterministic sampling (`temperature: 0.1`) for reproducible architectural scores.

---

## 3. What TO AVOID (Common Mistakes & Anti-Patterns)

| Category | Anti-Pattern | Why to Avoid | Pragmatic Remedy |
| :--- | :--- | :--- | :--- |
| **Architecture** | **Repository Pattern over Drizzle** | Drizzle ORM already provides a typed SQL abstraction. Extra repos create duplicate methods with zero added value. | Query `db.select().from(table)` directly in domain services. |
| **Architecture** | **Barrel File Overuse (`index.ts`)** | Slows TypeScript compiler resolution, bloats bundles, and causes circular dependency bugs. | Import directly from target files (`import { users } from './db/schema'`). |
| **Code Style** | **Over-wrapping in Try/Catch** | Clutters call stacks and swallows actionable error traces when mismanaged. | Let unhandled operational errors bubble up to Express 5 global error middleware. |
| **Performance** | **N+1 SQL Queries** | Looping database calls over items destroys response latency. | Use SQL `IN (...)` batch queries or Drizzle relations queries. |
| **Code Density** | **Type Files for 1-2 Interfaces** | Creates file proliferation and navigation friction. | Declare types directly in the file that uses them; export if needed elsewhere. |
| **State** | **Redundant Local State** | Storing derived state in `useState` leads to synchronization bugs. | Compute derived values dynamically during render (`const isReady = tests.every(t => t.passed)`). |
| **Security** | **Unsanitized Prompts to AI** | Leaves evaluation vulnerable to prompt injection or jailbreak attempts. | Strip control characters and instruct model to treat code strictly as AST data. |

---

## 4. Libraries & Tools (Exact Versions)

All code and dependencies must adhere strictly to these locked production versions:

### Frontend Workspace (`apps/web`)
```json
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "@monaco-editor/react": "4.7.0",
    "zustand": "5.0.3",
    "@tanstack/react-query": "5.64.0",
    "axios": "1.7.9",
    "lucide-react": "0.474.0"
  },
  "devDependencies": {
    "vite": "6.0.7",
    "tailwindcss": "4.0.0",
    "typescript": "5.7.3"
  }
}
```

### Backend Workspace (`apps/api`)
```json
{
  "dependencies": {
    "express": "5.0.1",
    "drizzle-orm": "0.38.3",
    "postgres": "3.4.5",
    "ioredis": "5.4.2",
    "@google/genai": "0.1.2",
    "p-queue": "8.0.1",
    "zod": "3.24.1",
    "jsonwebtoken": "9.0.2",
    "bcrypt": "5.1.1",
    "helmet": "8.0.0",
    "cors": "2.8.5"
  },
  "devDependencies": {
    "drizzle-kit": "0.30.2",
    "typescript": "5.7.3",
    "@types/express": "5.0.0",
    "@types/node": "22.12.0"
  }
}
```

---

## 5. AI Boundaries & Scope Guardrails

When AI coding assistants generate or refactor code for LLD Lab, they must adhere to strict boundary rules:

1. **Only Generate What Was Explicitly Requested:** Never add unprompted helper functions, speculative edge-case handlers, or extra files.
2. **Never Mock Production APIs:** Never inject fake or simulated mock data inside production controllers or services. Connect to live Drizzle schemas and real endpoints.
3. **Never Strip Existing Features:** When refactoring, retain all existing functionality and interfaces unless explicitly asked to deprecate them.
4. **No Premature Optimization:** Implement the simplest working solution first. Do not add distributed caching, multi-worker clustering, or complex algorithms unless specified in requirements.
5. **Prompt Delimiter Sanctity:** Never modify AI evaluation prompt schemas without updating the corresponding Zod validation schema.

---

## 6. Environment Variables

All environment variables must be defined in `.env.example`, loaded via typed configuration modules, and validated using Zod at server startup.

```typescript
// apps/api/src/config.ts
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  GEMINI_API_KEY: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  CIPHERSCHOOLS_SSO_PUBLIC_KEY: z.string().min(1),
  CIPHERSCHOOLS_LMS_WEBHOOK_URL: z.string().url(),
  CIPHERSCHOOLS_WEBHOOK_SECRET: z.string().min(16),
});

export const env = envSchema.parse(process.env);
```

### Rules for Environment Variables
- Never access `process.env` directly inside business logic or controllers. Always import `env` from `config.ts`.
- Never commit `.env` or any file containing live credentials.
- All secret keys must have a minimum entropy check (e.g., $\ge 32$ characters for JWT secrets).

---

## 7. Error Handling Standards

### 7.1 Unified AppError Class
```typescript
// apps/api/src/errors.ts
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }

  static badRequest = (msg: string, code = 'BAD_REQUEST') => new AppError(400, code, msg);
  static unauthorized = (msg = 'Unauthorized', code = 'UNAUTHORIZED') => new AppError(401, code, msg);
  static notFound = (msg = 'Resource not found', code = 'NOT_FOUND') => new AppError(404, code, msg);
}
```

### 7.2 Standard Response Envelope
All API responses must match this structure:

```typescript
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": { "code": "VALIDATION_FAILED", "message": "Invalid submission payload" } }
```

### 7.3 Global Express Error Handler
```typescript
// apps/api/src/middleware/error.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, error: { code: err.code, message: err.message } });
    return;
  }
  console.error('[UNHANDLED_ERROR]', err);
  res.status(500).json({ success: false, error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } });
};
```

---

## 8. Commit Message Format

Commit messages must follow the **Conventional Commits** specification:

```
<type>(<scope>): <short imperative summary>

[optional body explaining WHY]
```

### Allowed Types
- `feat`: A new user-facing feature or API capability.
- `fix`: A bug fix in existing behavior.
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `perf`: Performance improvement (e.g., query optimization).
- `test`: Adding or updating test suites.
- `docs`: Documentation updates.
- `chore`: Dependency updates, build configurations, or script maintenance.

### Examples
- `feat(evaluator): integrate Gemini 2.0 structured AST rubric scoring`
- `fix(workspace): prevent Monaco editor model memory leak on tab switch`
- `refactor(db): streamline submissions schema and add JSONB indexes`

---

## 9. Code Review Checklist

Before any Pull Request is approved and merged, reviewers verify:

- [ ] **Minimal Code:** Does this PR solve the task with the least lines possible without over-engineering?
- [ ] **No Echo Comments:** Are redundant comments removed? Are non-obvious algorithms explained with *why*?
- [ ] **Density Check:** Are there unnecessary blank lines, single-use helper functions, or useless barrel files?
- [ ] **No Dead Code:** Are all commented-out code blocks deleted?
- [ ] **Version Alignment:** Are dependencies locked to exact versions specified in Section 4?
- [ ] **Security:** Are inputs validated via Zod? Are microVM sandbox boundaries maintained?
- [ ] **Zero Debug Code:** Are all `console.log` statements deleted?
- [ ] **TypeScript Strictness:** Does the code compile with zero `any` types and strict null checks?
- [ ] **Error Handling:** Are errors surfaced using `AppError` and the unified envelope?
- [ ] **UI Alignment:** Does client styling follow the light theme with `#2563EB` primary and `#F97316` secondary?

---

## 10. Documentation Rules

- **Living Documents:** When modifying database schemas, API endpoints, or UI layouts, immediately update `docs/prd.md`, `docs/architecture.md`, and `docs/design.md`.
- **Markdown Purity:** Use GitHub Flavored Markdown with clean tables, explicit language tags on fenced blocks, and ASCII flowcharts.
- **No Documentation Drift:** Never document hypothetical or abandoned features; document only active production functionality.

---

## 11. AI Development Guidelines & Code Density

### 11.1 The Anti-AI Manifesto
AI code generation tends to be verbose, overly defensive, and polluted with obvious comments. **In LLD Lab, write like an experienced senior human developer.**

### 11.2 Concrete Code Comparisons

#### Example 1: Database Fetching

❌ **BAD (AI-Written Feel):**
```javascript
/**
 * This function fetches the user data from the database
 * @param {string} userId - The user ID
 * @returns {Promise<User>} The user object
 */
async function getUserData(userId) {
  // Check if userId is valid
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  // Fetch user from database
  const user = await User.findById(userId);
  
  // Check if user exists
  if (!user) {
    throw new Error('User not found');
  }
  
  // Return the user
  return user;
}
```

✅ **GOOD (Human Senior Developer):**
```typescript
async function getUser(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!user) throw AppError.notFound('User not found');
  return user;
}
```

#### Example 2: API Route Handler

❌ **BAD (AI-Written Feel):**
```typescript
// Route handler for getting submissions
router.get('/api/submissions/:id', async (req, res) => {
  try {
    // Get the ID from params
    const id = req.params.id;
    
    // Call the service to get submission
    const result = await submissionService.getSubmissionById(id);
    
    // Send success response
    return res.status(200).json({
      success: true,
      message: 'Submission retrieved successfully',
      data: result
    });
  } catch (error) {
    // Log the error
    console.error('Error getting submission:', error);
    // Return error response
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
```

✅ **GOOD (Human Senior Developer):**
```typescript
router.get('/submissions/:id', async (req, res) => {
  const submission = await getSubmission(req.params.id);
  res.json({ success: true, data: submission });
});
```

#### Example 3: React State Management

❌ **BAD (AI-Written Feel):**
```tsx
// Component for showing score
const ScoreDisplay = (props) => {
  // Store the score in state
  const [score, setScore] = useState(0);

  // Use effect to update score
  useEffect(() => {
    if (props.score !== null && props.score !== undefined) {
      setScore(props.score);
    }
  }, [props.score]);

  // Handle render
  return (
    <div className="score-container">
      <p className="score-text">Current Score: {score}</p>
    </div>
  );
};
```

✅ **GOOD (Human Senior Developer):**
```tsx
export const ScoreDisplay = ({ score = 0 }: { score?: number }) => (
  <div className="text-sm font-semibold text-gray-800">
    Current Score: <span className="font-mono text-blue-600">{score}</span>
  </div>
);
```

---

## 12. Core Development Principles

1. **KISS (Keep It Simple, Stupid):** The best code is the code you didn't have to write. Avoid premature architectural layering.
2. **YAGNI (You Aren't Gonna Need It):** Implement features only when required by current requirements, not in anticipation of hypothetical future needs.
3. **Pragmatic DRY:** Duplicating 3 lines of simple code is far cheaper than introducing the wrong abstraction. Only abstract when a pattern repeats 3+ times.
4. **Single Source of Truth:** Never maintain parallel schemas or duplicate state. Database schemas drive TypeScript types; Zod schemas validate API contracts.
5. **Fail Fast, Fail Visibly:** Throw descriptive errors immediately at system boundaries rather than allowing invalid state to corrupt downstream evaluation pipelines.
