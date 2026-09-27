# LLD Lab

I built LLD Lab because preparing for Low-Level Design (LLD) and machine coding rounds is usually a frustrating experience. While LeetCode handles DSA, there's almost nowhere to write real object-oriented code, submit an architectural design, and get instant, honest feedback before stepping into an interview. LLD Lab gives you benchmark design problems (Parking Lot, Elevator System, Vending Machine), an in-browser code editor, and an automated evaluation pipeline that checks both deterministic code structure and architectural principles.

## Live URLs

- **Frontend App**: [https://lld-lab-frontend.onrender.com](https://lld-lab-frontend.onrender.com)
- **Backend API**: [https://lld-lab-backend.onrender.com](https://lld-lab-backend.onrender.com)
- **API Health**: [https://lld-lab-backend.onrender.com/api/health](https://lld-lab-backend.onrender.com/api/health)

## Tech Stack

I kept the stack lean and pragmatic:
- **Backend**: Node.js 22 LTS, Express 5, TypeScript
- **Database & Cache**: PostgreSQL (with Drizzle ORM) and Redis (`ioredis`)
- **Evaluation**: Static syntax and signature verification (40%) + Google Gemini 2.5 Flash (60%)
- **Queue**: In-memory job queue via `p-queue` for async evaluations
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS
- **Editor**: Monaco Editor (`@monaco-editor/react`) with dark theme
- **Testing**: Jest and Supertest (73 test cases across 7 suites)

## Running Locally

You'll need Node.js 20+, a running PostgreSQL instance, and a Redis instance (local or Upstash).

### 1. Clone the repo

```bash
git clone https://github.com/geeknishantkyeus/lld-lab.git
cd lld-lab
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Configure your `backend/.env` with:
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/lld_lab
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
```

Push schema migrations and seed the benchmark problems:
```bash
npm run db:push
npm run db:seed
npm run dev
```
The API starts on `http://localhost:5000`.

### 3. Frontend Setup

In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` to start practicing.

## Available Scripts

### Backend (`/backend`)
- `npm run dev`: Starts the dev server with hot reload via `tsx`
- `npm run build`: Compiles TypeScript to `dist/`
- `npm start`: Runs the compiled server (`dist/server.js`)
- `npm test`: Runs the full Jest test suite (all 73 tests)
- `npm run db:push`: Applies Drizzle schema changes to Postgres
- `npm run db:seed`: Seeds initial problems and test user data
- `npm run db:studio`: Opens Drizzle Studio to inspect database rows

### Frontend (`/frontend`)
- `npm run dev`: Starts Vite dev server on port 5173
- `npm run build`: Runs TypeScript check and Vite production bundle
- `npm run preview`: Locally previews production build

## Deployment Info

The app is deployed entirely on **Render** (Singapore region):
- **Database**: Managed PostgreSQL instance (`lld-lab-db`)
- **Cache**: Managed Key-Value Redis instance (`lld-lab-redis`)
- **Backend**: Express Web Service deployed with Node 22 (`lld-lab-backend`)
- **Frontend**: Static Site built with Vite (`lld-lab-frontend`)

Build commands and environment variable mappings are configured via `render.yaml` at root.

## Documentation

All project documentation and architectural decisions live in the `docs/` folder:
- [Roadmap & Phases](docs/phases.md) — Step-by-step breakdown of how the 7 layers were built.
- [Product Requirements](docs/prd.md) — Core functional requirements and evaluation rubrics.
- [Design Tokens](docs/design.md) — Color palette, Tailwind conventions, and UI tokens.
- [AI Usage Decisions](AI_USAGE.md) — 5 specific AI-assisted architectural decisions and trade-offs.
- [AI Detection & Humanization Report](docs/ai_detection_report.md) — Scan report and code humanization breakdown.
- [Render Deployment Guide](docs/render_deployment_guide.md) — Instructions for setting up services on Render.
