# Locked Founder Master Roadmap
**Last reviewed:** 2026-10-13  
**Status:** Planning baseline; execution gates are evidence-based.

This document preserves the agreed order. It does not authorize parallel app builds, alter CAT study content, reset user progress, or claim unverified product-market fit.

## Non-negotiable locks
1. **CAT 2026 is the active personal mission.** Do not promote another venture above it unless the founder explicitly changes this lock.
2. **One major build at a time.** No parallel startup/app builds during the CAT-first period.
3. **Preserve existing work and progress.** Do not reset streaks, mock records, completion state, or learning queues as part of maintenance.
4. **Evidence before claims.** Never report a commit, deployment, notification, test, or feature as successful unless its result was observed.
5. **No forced market ranking.** The venture order below is a validation queue, not proof of market size or commercial potential.
6. **Move on gates, not dates.** A phase advances only when its exit criteria are met.
7. **Keep learning sequences locked.** BRM remains sequential; Sunday is revision, not a new lesson. Product Manager → Founder learning remains sequential.
8. **Do not combine every venture into a super-app.** Shared infrastructure may be considered later, after a focused product proves value.

## Master sequence

### Phase 0 — CAT 2026: protect the mission
**Purpose:** Execute the existing CAT plan without distraction.

- Use the current CAT plan/PDF as the source of truth for schedule and exam-window rules.
- Keep the daily order: CAT Command → BRM → Best Version → LinkedIn (maximum 3 minutes) → revision/return to CAT.
- Preserve mock analysis, error log, sectionals, sleep, coaching, gym, and recovery.
- Keep date and schedule behaviour India-local and test boundary dates.
- Do not add founder work that competes with the study plan.

**Exit gate:** CAT routine is being followed and the app accurately presents the locked plan. This phase remains active until the founder changes the CAT-first lock.

### Phase 1 — Audit and stabilise the existing CAT 2026 / Chrono Vyu app
**Purpose:** Make the existing product trustworthy before adding a new command centre.

Repository: https://github.com/mmac70707-del/cat2026-app  
Live app: https://cat2026-app.vercel.app/

Checklist:
- [ ] Inspect latest main commit, workflow runs, and deployment mapping.
- [ ] Run/confirm TypeScript, web build, CAT verification, Android build and APK workflows.
- [ ] Compare schedule, Sunday mock defaults, flexible block, and final-ten-day behaviour with the current source PDF.
- [ ] Test India-local date/day, timezone rollover, and date-driven content.
- [ ] Test saved progress, streaks, completion state, and refresh/reopen persistence without resetting data.
- [ ] Test phone layout, light/dark appearance, offline/PWA behaviour where supported, and navigation.
- [ ] Verify notification permission, scheduling, delivery constraints, and failure states; do not claim reminders work from configuration alone.
- [ ] Confirm the deployed site corresponds to the intended commit and inspect the live experience on a real device.
- [ ] Fix only reproducible defects in focused changes; use a branch/PR and preserve data.
- [ ] Record what passed, failed, was not testable, and what remains unknown.

**Exit gate:** Required checks pass, the live commit is identified, core schedule/progress behaviour is manually verified, and any remaining limitations are documented.

### Phase 2 — VISION Command Center (minimal, not a separate app yet)
**Purpose:** One founder dashboard to organise the portfolio without turning each idea into an active build.

Initial scope:
- Current mission and priority lock.
- Project/venture register with status: Active, Validate, Parked, or Archive.
- One next action per active workstream.
- Evidence log, decision log, risks, costs, and review date.
- Weekly Continue / Pause / Pivot / Reject review.
- Explicit phase gates and links to the existing source of truth.
- No automatic project promotion and no fake completion indicators.

**Build rule:** First define the minimum data model and workflow inside planning/docs. Implement only after Phase 1 is complete and there is a clear, useful requirement. Do not build a second standalone app merely to track the first app.

**Exit gate:** The dashboard reduces confusion and duplicate work in a small trial, without stealing meaningful CAT study time.

### Phase 3 — Supporting capability systems
These support the mission; they are not independent startup builds.

- **BRM (Business Reading & Mindset):** one next lesson Mon–Sat; Sunday revises the prior six; next lesson unlocks only after completion; app and chat sequence should match.
- **Best Version:** daily control system for personal improvement, self-comparison rather than comparison with others, and practical routines.
- **Product Manager → Founder:** preserve module order; move from problem discovery to validation, strategy, UX, build, metrics and execution.
- **LinkedIn:** at most 3 minutes/day during CAT-first; natural student voice and supported claims; never displace CAT, sleep, exercise or recovery.
- **TMC / SCPS / other existing learning tracks:** keep their established order and source-first constraints; do not restart or replace queues without explicit instruction.

**Exit gate:** The systems stay consistent, low-friction, and subordinate to CAT 2026.

### Phase 4 — Validate one venture at a time
Before building a new venture, record:
1. Specific target user.
2. Repeated painful problem and current workaround.
3. Evidence from real conversations or observed behaviour.
4. Smallest test that can falsify the idea.
5. Willingness-to-pay or credible sustainable-value hypothesis.
6. Delivery, privacy, safety, legal, operational and support risks.
7. Cost/time budget and an explicit stop condition.

No idea passes merely because it sounds exciting or uses AI. The next venture is selected by evidence, founder fit, feasibility, and capacity—not by a speculative billion-dollar label.

### Phase 5 — Build and scale only after validation
- Prototype one narrow use case.
- Test first value, usability, accessibility and repeat use.
- Measure behaviour and qualitative feedback honestly.
- Improve retention and trust before distribution or ecosystem expansion.
- Scale only when the current stage has evidence.

## Venture portfolio — provisional validation queue
This is an inventory and a suggested order for *investigation*, not a final commercial ranking.

1. **Best Version / Personal Betterment OS** — first validation candidate because it connects to existing work. This is a sequencing convenience, not proof it is the best market.
2. **Evolutions** — EdTech direction; define target learner and outcome.
3. **EVARya** — Agri-tech; identify a specific farmer/agribusiness workflow and measurable pain.
4. **Evrion** — clean energy; clarify customer, asset, economics and regulatory constraints.
5. **STHALAKSH / Stralakshya** — construction direction; reconcile the intended name and exact problem before promotion.
6. **UAVon** — UAV/drone direction; define lawful use case, buyer, operating constraints and economics.
7. **LYN-COSA** — social connection; identify a clear user problem beyond generic social networking.
8. **ANVORA** — fashion/lifestyle; research audience, differentiation and supply economics.
9. **Yuva On** — youth platform; define how it differs from the other youth/personal-betterment concepts.
10. **Ooshas** — keep in the idea vault until its intended customer, problem and product are clearly defined.
11. **CHRONO VYU** — existing goal-execution/focus product and current app foundation; stabilise V1 before expansion.
12. **STHALAKSH / other names and concepts** — keep aliases and naming decisions documented; do not silently discard previous concepts.

Names may overlap or represent earlier naming versions. Reconcile identity before creating duplicate repositories or products.

## Chrono Vyu product-version map
Product versions and universal-learning phases are separate axes. Do not equate U-numbering with V-numbering.

### V1 — Core product / first success
- Existing goal, learning, focus and next-action experience.
- Core production/security/infrastructure.
- Universal Learning foundations only where they directly support first success.
- Validate that a user can choose a goal, take a useful action, and understand progress.
- No unnecessary social network, marketplace, or giant community.

### V2 — Personalisation and monetisation
- Advanced/adaptive personalisation.
- Paid plans and entitlements only after users demonstrate value.
- AI efficiency and resource organisation.
- Teacher/coach foundations only when validated.

### V3 — Retention, evidence and collaboration
- Learning history and deeper progress.
- Evidence/portfolio, recordings, projects and feedback loops.
- Structured mentor–learner communication and study groups where user evidence supports them.

### V4 — Universal learning ecosystem
- Cross-skill learning OS, providers, local learning ecosystem, integrations, partnerships and wider expansion.
- Promote capabilities only after their own validation gates.

**Universal layer:** U1 → U2 → U3 → … → U11 (and later candidates) remains its own ordered capability track. A capability may land in whichever product version genuinely needs it; numbering does not dictate placement. Engineering/release phases are also separate from product versions.

## Research discipline for the broader India opportunity
The supplied startup research note highlights trusted data, verified services, data sharing and digital trust as possible cross-industry gaps, and suggests expanding in stages rather than launching a super-app. Treat these as research hypotheses, not verified market conclusions.

Research sequence:
1. Study the problems solved by Indian unicorns and the customer segments they serve.
2. Find persistent complaints and existing workarounds in specific user groups.
3. Map competitors, substitutes, regulations, trust requirements and unit economics.
4. Interview users and test the riskiest assumptions.
5. Select one narrow entry point; only consider adjacent categories after repeated value is demonstrated.

A potential acquisition by a large company is not a validation criterion. Customer value, defensibility, trust, and sustainable economics come first.

## Weekly founder review
Answer briefly:
- What was the one primary mission?
- What real evidence was added?
- What changed in user behaviour or product quality?
- What is blocked, and what proof is missing?
- Continue, pause, pivot, or reject which item—and why?
- What is the single next action?
- Did this work interfere with CAT, sleep, health or recovery? If yes, reduce scope.

## Current verified engineering snapshot (2026-10-13)
- Latest observed main commit: `a88e462f8399436b09207dfce5b2884113a01563`.
- Recent GitHub Actions runs for Web Build, Android Build, Android APK, and CAT 2026 Build Verification show success for that commit.
- This confirms those workflow runs, not full live-device correctness or notification delivery.
- The live app, persistence, mobile interaction, schedule edge cases, offline behaviour and notifications still require explicit runtime/manual verification.
- No claim of market validation or product-market fit is made by this roadmap.

## Decision log
Add a dated entry whenever the priority, lock, target segment, or stage gate changes. Include the evidence and reason. Do not silently change this roadmap.
