# LLD Lab

Hey there! If you've ever prepped for low-level design or machine coding rounds at tech companies, you probably noticed the same frustrating gap I did: LeetCode is great for data structures, but there's almost nowhere to practice writing actual object-oriented architecture and get immediate, sensible feedback. Most people just draw class diagrams on a whiteboard or write code into a blank text document with nobody to critique their design choices until an interviewer rejects them.

I built LLD Lab to fix that. It's a hands-on workspace where you can pick a classic benchmark problem (like a multi-floor Parking Lot, an Elevator dispatch system, or a Vending Machine state engine), write out your architectural rationale and code in a multi-language editor, and get scored within a few seconds by a hybrid evaluation engine.

---

## How It Actually Works

When you submit a solution, I don't just dump your code into an LLM prompt and hope for the best. That approach is sloppy, unpredictable, and expensive. Instead, I split the evaluation pipeline into two distinct layers:

First, a deterministic validator runs. It checks whether your submission covers the core requirements — expected classes (like `Vehicle`, `ParkingSpot`, `Ticket`), required method signatures, interface abstractions, and basic syntactic sanity. This part is fast, objective, and accounts for 40% of your score. If you forgot a core entity or misspelled an essential method contract, you'll see it immediately.

Second, the code and design rationale get handed over to an asynchronous worker queue that calls Google's Gemini Flash model. The LLM acts like a senior engineer conducting a code review. It evaluates your solution against a strict 7-dimension rubric: Single Responsibility, Open-Closed and SOLID compliance, coupling and cohesion, encapsulation, design pattern appropriateness (and whether you over-engineered), extensibility, and trade-off justification. This gives you the remaining 60% of your score, along with concrete strengths, weaknesses, and refactoring tips.

If you submit the exact same code twice (or if multiple students submit identical starter templates), Redis intercepts the request using a SHA-256 hash of your normalized solution and returns cached feedback in under 50 milliseconds without burning another Gemini API call.

---

## Architecture Choices (and What I Rejected)

I chose a modular monolith with an Express 5 TypeScript backend and a React 19 Vite frontend. 

Some people suggested spinning up microservices with Kafka, Docker sandboxes, and separate auth services. I rejected that completely. For an MVP built to serve real learners reliably, microservices would have added massive network complexity, deployment headaches, and cold-start latency for zero practical gain. A single Node process with `p-queue` handles background evaluation jobs cleanly without needing heavy worker fleets.

For the database, I went with PostgreSQL managed on Render and schema migrations managed through Drizzle ORM. Drizzle is lightweight, gives me full type safety across queries, and doesn't get in the way like heavier ORMs often do.

For styling, the UI is built with Tailwind CSS following CipherSchools' warm visual identity — cream backgrounds (`#FDF8F3`), deep slate text, and vibrant orange accents (`#F97316`) instead of the typical generic dark mode templates you see everywhere.

---

## Getting It Running Locally

If you want to pull this down and run it on your machine, here's the quickest route:

### Prerequisites

You'll need Node.js 20+ installed, along with access to a PostgreSQL instance and a Redis instance (local or Upstash). You also need a free Gemini API key from Google AI Studio.

### 1. Clone & Set Up the Backend

```bash
git clone https://github.com/geeknishantkyeus/lld-lab.git
cd lld-lab/backend
npm install
```

Copy the example environment file and fill in your keys:

```bash
cp .env.example .env
```

Your `.env` needs:
- `DATABASE_URL`: Your PostgreSQL connection string
- `REDIS_URL`: Redis connection URL (e.g. `redis://localhost:6379` or Upstash `rediss://...`)
- `GEMINI_API_KEY`: Your Gemini API key
- `PORT`: `5000`
- `FRONTEND_URL`: `http://localhost:5173`

Run migrations and seed the 3 benchmark problems:

```bash
npm run db:push
npm run db:seed
npm run dev
```

The backend API will be live on `http://localhost:5000`.

### 2. Set Up the Frontend

In a separate terminal:

```bash
cd lld-lab/frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. You can browse problems, open the Monaco editor workspace, submit a design, and see the real-time polling evaluation in action.

---

## Running Tests

I wrote automated test suites covering API routes, edge cases, deterministic validation, Redis caching hit/miss behavior, and user progress endpoints:

```bash
cd backend
npm test
```

You should see 75+ tests passing across 8 test suites.

---

## Current Limitations & Honest Trade-offs

I want to be transparent about what this platform is and what it isn't yet:

1. **No live code execution sandbox:** Right now, the deterministic evaluator performs static structural analysis (classes, methods, relationships, syntax checks). It does not compile and run bytecode inside an isolated Docker or gVisor sandbox. That means if you write code that compiles syntactically but contains an infinite loop during runtime, the static evaluator won't catch the runtime hang. Real sandbox execution is on my roadmap for a future release.
2. **AI scoring variance:** Even with temperature set low and a strict JSON schema, LLMs can occasionally vary a few points between runs on subtle design trade-offs. The Redis cache keeps repeat identical submissions deterministic, but minor code edits might see slight variance.
3. **Single evaluator concurrency:** The background queue is configured with concurrency 2 to stay well within free-tier rate limits. In high-traffic scenarios, submissions queue up and take a few extra seconds to process.

---

## Live Links

- **Frontend:** https://lld-lab-frontend.onrender.com
- **Backend API:** https://lld-lab-backend.onrender.com/api/health
- **GitHub Repo:** https://github.com/geeknishantkyeus/lld-lab
