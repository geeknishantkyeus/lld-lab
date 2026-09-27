# How I Used AI in Building LLD Lab

When building a project that uses AI to evaluate someone else's code, it's easy to either over-rely on an LLM or dismiss it as a toy. From day one on LLD Lab, I treated the AI as a junior pair programmer: helpful for generating boilerplate, stress-testing edge cases, and drafting rubric schemas, but something I constantly challenged and overruled whenever it pushed bad architectural advice.

Here is an honest breakdown of the 5 biggest decisions where AI was involved, what it suggested, where I disagreed, and why I built it the way I did.

---

## 1. Model Choice: Why I Picked Gemini 2.0 Flash over Self-Hosted or Heavy Models

When I started sketching out the architectural review pipeline, the initial AI suggestion was to either spin up an open-source model like Llama 3 via Ollama on a GPU VPS or use a massive frontier model like GPT-4o.

I rejected both ideas. Hosting an open-source LLM myself would have immediately blown past reasonable infrastructure budgets for a student project — a reliable GPU instance on AWS or RunPod costs real money every hour just idling. On the other hand, heavyweight models like GPT-4o take 4 to 8 seconds per inference call, which destroys the interactive feel when someone is waiting for their attempt to evaluate.

I went with Google's `gemini-2.0-flash`. It delivers structured JSON responses in about 1.2 to 2 seconds, runs on a generous free tier (up to 15 requests per minute and 1 million tokens a day), and gave me remarkably consistent rubric analysis without any infrastructure maintenance headaches.

---

## 2. Rubric Design: Rejecting Generic Pass/Fail for a 7-Dimension Review

The default AI recommendation for evaluating code was very simplistic: give the user an overall score out of 100, a short summary paragraph, and 3 generic bullet points.

I strongly disagreed with this. In a real machine coding interview at top tier companies, interviewers don't just say "looks good, 80/100." They dissect your design: Did you separate concerns properly? Did you hardcode object creation instead of using a factory? Did you over-engineer a simple lookup with a bloated Visitor pattern?

I expanded the rubric to 7 explicit dimensions:
1. Single Responsibility Principle (SRP)
2. Open-Closed and SOLID compliance
3. Coupling and cohesion
4. Encapsulation and defensive copying
5. Design pattern appropriateness (specifically flagging over-engineering)
6. Extensibility for future requirements
7. Trade-off justification based on the user's explanation text

Forcing the model into this structured schema means learners receive targeted critiques they can actually learn from, rather than vague compliments.

---

## 3. The Queue Decision: Why I Refused Synchronous Evaluation

When I first asked an AI coding assistant to scaffold the attempt submission endpoint, it generated code that called the LLM synchronously inside `POST /api/attempts` and returned the result in the HTTP response.

I rejected that approach immediately. Synchronous LLM calls in an HTTP request are an antipattern waiting to crash your server:
- If Gemini takes 3 seconds to respond, that client connection hangs.
- If 5 users submit designs at the same time, the Node event loop and request socket pools get bogged down.
- If the browser tab disconnects or times out before the LLM finishes, the evaluation work and tokens are wasted.

I decoupled submission from evaluation using an in-memory priority queue (`p-queue`). When you hit submit, the backend saves your attempt with status `PENDING`, returns a `201 Created` immediately with an attempt ID, and enqueues the evaluation job. The frontend polls the lightweight status endpoint every 2 seconds, displaying smooth transition states (`PENDING` -> `EVALUATING` -> `COMPLETED`).

---

## 4. Caching: SHA-256 Solution Hashing with Redis

Another area where the AI gave sloppy advice was caching. The assistant initially proposed an in-memory JavaScript `Map` to cache evaluation results by problem ID.

That would have caused two big problems: first, an in-memory Map gets wiped clean every time Render restarts or deploys a new commit. Second, caching only by problem ID would mean every user gets the exact same feedback regardless of what code they wrote!

I replaced that suggestion with a Redis-backed caching layer using cryptographic SHA-256 hashing. The cache key is generated from the problem ID, a normalized version of your submitted text and code (stripping trailing whitespace and normalizing CRLF to LF), and a prompt version tag:

```
CacheKey = "eval:" + SHA256(problemId + normalizedSolution + promptVersion)
```

Now, if you re-submit identical code (or if multiple students submit the same sample solution), Redis intercepts the request and returns the full evaluation payload in under 50ms, skipping the LLM call entirely. I set the TTL to 24 hours so feedback stays fresh as models evolve.

---

## 5. Graceful Degradation: Fallback to Deterministic Scoring

APIs fail. Rate limits happen. If you rely 100% on a cloud AI service without a safety net, your app will inevitably show ugly error screens to users.

When designing error handling, the AI suggested returning an HTTP 500 error if Gemini timed out or hit a rate limit. I rejected that and built a two-stage fallback:

First, the evaluator retries transient Gemini failures once with exponential backoff and enforces a strict 15-second timeout so requests don't hang indefinitely.

Second, if the LLM is completely unreachable, the system doesn't crash the attempt into a dead end. Instead, it marks the attempt complete using the 40-point deterministic score (syntax, class checks, method signature matches), populates the feedback panel with those structural metrics, and displays a clear notice: *"AI evaluation timed out. Showing deterministic analysis only."* The user can then click a single "Retry Evaluation" button to re-trigger the AI pass when the provider recovers.

---

## Honest Reflections on Working with AI

AI accelerated this build tremendously — especially for writing test mocks, crafting regex parsers for class declarations, and tuning JSON schemas. But it also proved that AI has clear blind spots. It regularly suggests naive synchronous patterns, ignores cold-start and memory constraints on free hosting tiers, and tends to produce generic, one-size-fits-all designs unless you actively push back.

The best results came from treating the AI not as an autopilot, but as an interactive sounding board where I maintained full control over the architecture, contracts, and failure modes.
