# AI-Assisted Architectural Decisions

When building LLD Lab, I used AI tools as a sounding board and coding companion. But blindly following LLM recommendations usually leads to over-engineered or brittle systems. Here are the 5 biggest decisions where AI was involved, what it recommended, where I rejected its advice, and what I ended up building instead.

---

## 1. Gemini API vs Self-Hosted Models

When I asked an AI model how to handle code review, its first proposal was to self-host an open-source model like Llama 3 on an AWS GPU instance using Ollama or vLLM.

I rejected that immediately. Paying for an idle GPU instance makes zero sense for a project running on free cloud tiers. It suggested heavy frontier models like GPT-4o next, but those take 5–8 seconds per review and cost significantly more. 

I picked Google's `gemini-2.5-flash` via the official `@google/generative-ai` SDK. It consistently returns structured architectural critiques in 1.5 to 2.5 seconds, has a generous free tier for developers, and eliminates all GPU infrastructure maintenance.

---

## 2. 7-Dimension Rubric vs Generic Pass/Fail

The AI assistant originally suggested a generic scoring prompt: give the solution a score out of 100 and write a couple of paragraphs of general feedback.

I rejected that because general feedback is useless when preparing for actual machine coding interviews. An interviewer doesn't just say "looks nice." They evaluate whether you respected Single Responsibility, whether your classes are tightly coupled, and whether you chose an appropriate design pattern without over-engineering.

I designed a structured 7-dimension rubric that forces the LLM to score:
1. Responsibility Clarity (SRP)
2. SOLID Principles Compliance
3. Coupling and Cohesion
4. Encapsulation & Data Hiding
5. Design Pattern Appropriateness
6. Extensibility
7. Design Trade-offs

Each dimension receives a score (0–10), and the prompt requires strict JSON output with concrete refactoring suggestions.

---

## 3. 15-Second Timeout + Single Retry

Initial code suggestions from AI wrapped LLM requests in standard `await` calls with no timeouts, or suggested 60-second timeouts with 3 to 5 aggressive retries.

I rejected both extremes:
- No timeout means an upstream Google API hiccup leaves user HTTP connections hanging indefinitely.
- 5 retries on a 60-second timeout means a stuck attempt could lock up a queue slot for 5 minutes and burn through API rate limits.

Instead, I implemented `withTimeout(promise, 15000)` using `Promise.race` and capped retries at exactly 1 attempt with a 200ms delay. If Gemini doesn't answer within 15 seconds, we fail fast rather than keeping the user staring at a loading spinner.

---

## 4. Graceful Fallback to Deterministic Scoring

When planning error handling, the AI suggested returning an HTTP 500 error and marking the attempt as `FAILED` whenever Gemini timed out or hit a rate limit.

I rejected that approach. If a user spends 20 minutes writing a clean Parking Lot implementation, crashing the attempt just because an external AI provider glitched is a terrible user experience.

I split the evaluation into deterministic (40 pts) and LLM (60 pts). If the LLM call times out or fails after its single retry, the system catches the error, marks the evaluation as partial, and falls back to the deterministic score (validating classes, methods, and syntax). The user still gets immediate feedback on their structural code, and can click "Retry" whenever the AI service stabilizes.

---

## 5. Token Usage Tracking

When I asked about tracking API costs, the AI suggested installing external SaaS observability tools like Langfuse or Helicone, which required setting up another cloud account and injecting proxy middleware.

I rejected that extra dependency. For this stage, an external observability proxy introduces an unnecessary third-party point of failure.

I built a lightweight in-memory telemetry tracker (`aiUsage.ts`). After every Gemini call, it records the timestamp, problem title, model used, execution duration in milliseconds, success boolean, and tokens extracted directly from `result.response.usageMetadata.totalTokenCount`. An internal endpoint exposes the aggregate metrics (total calls, success rate, total tokens consumed) without adding any third-party latency.
