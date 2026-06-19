# Spotlight Portfolio — Roadmap

> Living document. Update when phases ship, when priorities change, or when a
> session adds/removes work. Items marked `?` are guesses for you to confirm.

**Last updated:** 2026-06-11

---

## Phase status

| Phase | Title                                                          | Status                | Notes                                                                                  |
| ----- | -------------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------- |
| 0     | Backend hardening (security, performance, observability)       | ✅ Done               | See [`Spotlight-backend/docs/PHASE-0.md`](../../Spotlight-backend/docs/PHASE-0.md)     |
| 1.0   | Storage foundation — Supabase Storage for avatars/covers/CVs   | ✅ Done               | `avatars` + `covers` public, `cvs` private with signed URLs                            |
| 1.1   | Shareable public URLs                                          | ✅ Done (pivoted)     | Username slugs → Base62 short codes (`/p/<code>`) + Upstash Redis cache                |
| 1.2   | CV upload + AI auto-fill                                       | ✅ Done               | Groq primary (`llama-3.3-70b-versatile`), Gemini fallback; one-shot self-heal on schema fails |
| 1.3   | Portfolio chat (visitors ask questions about the portfolio)    | 📋 Planned (next up)  | Streaming Groq chat with portfolio JSON as system context                              |
| 2.x   | Polish + monetisation                                          | 💡 Ideas only         | See "Ideas" below                                                                      |

---

## Open TODO

Tags: **[F]** frontend · **[B]** backend · **[FB]** both

### High priority (next 1-2 sessions)

- [ ] **[F]** Profile UI polish — you flagged wanting design improvements (modern spacing, hierarchy, consistent shadows). Deferred while we shipped 1.2; pick back up before 1.3.
- [ ] **[FB] Phase 1.3 — Portfolio chat MVP**
  - **[B]** Streaming endpoint at `POST /v1/p/:code/chat` (anonymous, IP-rate-limited)
  - **[B]** System prompt assembled from the portfolio JSON (skills/experience/projects)
  - **[B]** Reuse `generateStructured`-style abstraction? Probably need a new `streamChat` in `lib/llm.ts`
  - **[F]** Floating chat widget on `/p/<code>` (collapsible, mobile-friendly)
  - **[F]** Token-streaming with SSE / ReadableStream
  - **[?]** Decide: per-conversation memory (Redis) or stateless?

### Medium

- [ ] **[B]** Server-side Zod post-validation of CV-parse output — today we trust Groq's schema enforcement; one bad schema drift means corrupt data. ~2-3 hours.
- [ ] **[F]** "Download CV" button on the public portfolio page — CVs upload to private storage but never surface publicly. Needs a backend endpoint to mint a signed URL on demand for anonymous visitors (with rate limiting).
- [ ] **[B]** Groq dashboard usage alerts — set email alert at 80% of daily quota (manual one-time setup at [console.groq.com](https://console.groq.com), no code).
- [ ] **[F]** Frontend `socialLinks` expansion? — your CV had `leetcode` and `portfolio` keys; schema currently allows only `linkedin/github/twitter/website/dribbble/behance`. Consider adding `leetcode` and dropping `dribbble/behance` if unused. **[?]** confirm intent.
- [ ] **[F]** Cover photo crop UI — currently freeform aspect ratio; some templates expect 3:1 or 16:9.

### Low / deferred (decisions logged)

- [ ] **[B]** Hybrid CV parser (regex + LLM) — ~40% token savings; deferred until token budget actually constrains us. ~3 days work when needed.
- [ ] **[B]** Affinda fallback for CV parsing — 200/month free, zero LLM tokens; deferred for the same reason. ~1 day when needed.
- [ ] **[B]** Pure rule-based CV parser (Option A from the discussion) — too much engineering for the description-quality trade-off. Not planned.

### Ideas (Phase 2+ candidates, unscheduled)

- [ ] AI bio enhancement (generative — needs LLM)
- [ ] AI project description polishing (opt-in only — preserves the verbatim default)
- [ ] Template recommendation engine (rule-based, no LLM)
- [ ] Cover letter generator from portfolio + JD
- [ ] Custom subdomains for short links (`<code>.spotlight.app`)
- [ ] Analytics on `/p/<code>` views (per-portfolio counter)
- [ ] Email notifications on portfolio view? (would need email provider; Resend was discussed and deferred)
- [ ] Multiple active templates? (today: one `active_template_id` per user)

---

## Recently shipped (last 30 days)

| Date    | Repo     | Commit    | Summary                                                                                  |
| ------- | -------- | --------- | ---------------------------------------------------------------------------------------- |
| 2026-06-08 | backend  | `7e1fb57` | `cv-parse: preserve original bullets verbatim in descriptions`                          |
| 2026-06-05 | backend  | `2d2fce9` | `llm: fix Groq error categorisation + add self-heal retry`                              |
| 2026-06-05 | backend  | `991447e` | `llm: add Groq provider with Gemini auto-fallback`                                       |
| 2026-06-05 | backend  | `8c8b133` | `me.cv.parse: bump to 20/hr and clarify 429 ownership`                                   |
| 2026-06-05 | frontend | `5a59bf5` | `CVManager: surface backend 429 message verbatim`                                         |
| 2026-06-05 | backend  | earlier   | Phase 1.2 — CV upload + AI auto-fill (Gemini, before Groq pivot)                         |
| earlier    | both     | various   | Phase 1.1 — pivot from username slugs to Base62 short codes + Upstash Redis cache       |
| earlier    | both     | various   | Phase 1.0 — Supabase Storage for avatars and covers; cover photo upload                 |
| earlier    | backend  | various   | Phase 0 — RLS, body-size limits, rate limiting, structured logging, region pinning      |

For full git log: `git log --oneline -n 30` in either repo.

---

## How to maintain this doc

- When you start a phase, add it to the table with status `🚧 In progress`.
- When you ship, flip status to `✅ Done` and add a "Recently shipped" row.
- When you decide NOT to do something, move it to "Low / deferred" with a one-line reason — future you will thank present you.
- Keep this file under ~150 lines. If it grows, split phase-specific notes into `docs/PHASE-<n>.md` siblings.
