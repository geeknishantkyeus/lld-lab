# LLD Lab

A focused Low-Level Design (LLD) and machine coding practice platform with hybrid automated and AI feedback.

## Features

- **Benchmark LLD Problems:** Parking Lot System, Elevator System, Vending Machine.
- **Hybrid Evaluation:**
  - **Deterministic Evaluator (40%):** Validates syntax, class contracts, methods, interfaces, and functional test assertions.
  - **AI Architectural Evaluator (60%):** Powered by Google Gemini 2.0 evaluating SRP, SOLID principles, coupling, cohesion, design pattern appropriateness, and extensibility across 7 rubric dimensions.
- **Longitudinal Memory & Progress Tracking:** Score trends, attempt history comparison, weak areas analysis, and recurring mistakes dashboard.
- **Course Integration:** Direct links between design problems and CipherSchools curriculum lectures.
- **High-Performance Caching:** Redis SHA-256 solution hashing with 24-hour TTL for instant re-evaluations.
- **CipherSchools Design System:** Warm aesthetic (#F97316 orange, #000000 black, #FDF8F3 cream) with Monaco code editor.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, Monaco Editor, React Query, Lucide Icons
- **Backend:** Node.js 22 LTS, Express 5, TypeScript, Drizzle ORM, Zod perimeter validation, `p-queue`
- **Database:** PostgreSQL 16
- **Cache:** Redis 7 / Upstash
- **AI Engine:** Google Gemini API (`gemini-2.0-flash`)
- **Testing:** Jest, Supertest (75+ tests across 8 suites)
- **Deployment:** Render (Web Service + Static Site + Managed PostgreSQL + Key Value Redis)

## Getting Started

### Prerequisites

- Node.js >= 20.x
- PostgreSQL database
- Redis instance
- Google Gemini API Key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in DATABASE_URL, GEMINI_API_KEY, REDIS_URL, FRONTEND_URL in .env
npm run db:push
npm run db:seed
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and backend on `http://localhost:5000`.

## Testing

```bash
cd backend
npm test
```

## License

MIT
