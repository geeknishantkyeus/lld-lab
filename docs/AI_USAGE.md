# AI Usage Documentation

## Overview

LLD Lab uses Google Gemini API for LLM-based architectural feedback on LLD solutions. This document explains 5 meaningful AI-assisted decisions made during development.

## Decision 1: Gemini API vs Self-hosted LLM

**AI Suggested:** Use Gemini API for LLM evaluation.

**What I Did:** Accepted.

**Why:** Gemini provides:
- Free tier (15 req/min, 1M tokens/day) — perfect for a 2-day MVP
- Fast response (1-2 seconds)
- Structured JSON output — easy parsing
- No infrastructure management
- Matches CipherSchools' existing stack

Self-hosted LLM would require GPU, model hosting, and complex setup — not feasible in 2 days.

## Decision 2: 7-Dimensional Rubric vs Simple Feedback

**AI Suggested:** Use a simple 4-dimensional rubric (SRP, SOLID, Coupling, Extensibility).

**What I Did:** Extended to 7 dimensions — added Encapsulation, Pattern Appropriateness, Design Trade-offs.

**Why:** LLD evaluation requires multi-dimensional feedback. The assignment emphasizes "structured design feedback." 7 dimensions provide:
- More actionable feedback
- Better alignment with SOLID principles
- Coverage of pattern appropriateness (avoiding over-engineering)
- Trade-off justification assessment

## Decision 3: Timeout + Retry vs Simple Call

**AI Suggested:** Simple LLM call without timeout.

**What I Did:** Added 30s timeout + 2 retries with exponential backoff.

**Why:** Gemini API can be slow or hit rate limits. Without timeout, the backend could hang indefinitely. Retry with backoff handles transient failures gracefully.

## Decision 4: Fallback to Deterministic vs Hard Failure

**AI Suggested:** Throw error if LLM fails.

**What I Did:** Fallback to deterministic results with a notice.

**Why:** If LLM fails, learners should still receive deterministic feedback (class names, methods detected). This provides partial value rather than a complete failure. The frontend shows "AI evaluation failed. Showing deterministic results only."

## Decision 5: Token Tracking vs No Tracking

**AI Suggested:** Skip token tracking for MVP.

**What I Did:** Added token tracking + cost estimation.

**Why:** In production, monitoring AI costs is critical. Token tracking provides visibility into:
- Total API calls
- Success/failure rate
- Average response time
- Estimated cost

This helps with capacity planning and cost optimization.

## Summary

AI was used for:
- LLM evaluation prompt design
- 7-dimensional rubric scoring
- Error handling patterns (timeout, retry)
- Fallback strategy

AI was NOT used for:
- Core architecture decisions (monolith, in-memory queue)
- Domain modeling (Problem, Attempt, Feedback, User)
- Database schema design
- Frontend component structure

All AI suggestions were evaluated with engineering judgment, not blindly accepted.
