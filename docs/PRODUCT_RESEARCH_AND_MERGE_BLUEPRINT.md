# Chrono Vyu — Product Research & Merge Blueprint

**Status:** Working product blueprint  
**Last reviewed:** 10 October 2026  
**Purpose:** Make one coherent product from the accessible CAT 2026 / Chrono Vyu codebase and the founder's available Best Version / FAST / 7 Cs research. This document is a decision guide, not a claim that inaccessible source code has already been merged.

## 1. The product in one sentence

Chrono Vyu helps a person turn a meaningful goal into the next clear action, protect time to act, capture honest evidence, learn from results, repair mistakes, and restart without shame.

The founder's CAT 2026 plan is a personal mission mode, not the limit of the product's market. The product should eventually support several goal modes through a shared execution engine.

## 2. Inputs currently accessible

- Main application repository: `mmac70707-del/cat2026-app`.
- Current product code already includes Today / Week / Mastery / Phases navigation, a focus dashboard, learning and error-repair features, BRM, Body360, a Vision / seven-year roadmap page, IndexedDB repositories, portable backup, PWA support, and Android notification workers.
- Founder-provided visual references: the F.A.S.T. Method (Focus, Action, System, Tracking) and the 7 Cs (Confidence, Clarity, Concentration, Consistency, Character, Commitment, Capacity for Joy).
- Available Best Version UX research-board concept: Discover → Assess → Goal → Plan → Act → Track → Reflect → Adapt → Grow; India-first and language-aware; progress versus one's own past rather than social comparison.
- Available technical requirements notes emphasize offline core planning, Asia/Kolkata date keys, safe data migration/backups, Android notification permission handling, restart/resume recovery, accessibility, and no silent failure.

**Blocked inputs:** `https://github.com/mmac70707-del/q` currently returns 404 from the connected GitHub access, and the phone-local URI `content://media/external/downloads/1000682880` is not available as a readable attachment in this session. Do not claim their code or contents are merged. When the repository/file becomes accessible, follow Section 8.

## 3. Research synthesis (evidence, not hype)

### Finding A — Goals, self-monitoring and prompts are common evidence-based techniques

A 2024 systematic review examined 41 digital behavior-change studies. The most frequent techniques included feedback/monitoring, prompts/cues, goal-setting and planning. The review describes design patterns used in interventions; it does **not** prove that any particular app will produce outcomes.

Product implication:
- Let users choose a goal that matters to them.
- Convert it into a small observable action.
- Show progress from logged evidence, not invented scores.
- Offer context-aware prompts that users control.
- Make weekly reflection and plan repair part of the product loop.

Source: https://www.jmir.org/2024/1/e54375/

### Finding B — A dashboard alone is not a learning strategy

A systematic review of learning-analytics dashboards found limitations in grounding dashboards in learning theory, supporting metacognition, suggesting effective learning tactics, and evaluating impact. More recent evidence still suggests the effect of dashboards is not a reason to promise dramatic results from charts alone: a 2026 meta-analysis reported a small student-facing effect and noted uncertainty.

Product implication:
- Every metric must answer a decision question: “What should I do next?”
- Pair the number with a useful action, method, or repair suggestion.
- Let users inspect why a recommendation appeared.
- Evaluate real completion, usefulness, and repeat use; do not optimize vanity metrics.

Sources:
- https://doi.org/10.1109/TLT.2019.2916802
- https://www.sciencedirect.com/science/article/pii/S1096751626000461

### Finding C — Reliable reminders require the right platform primitive and honest expectations

Android recommends WorkManager for persistent deferrable work that should survive app exits and device restarts. It can be delayed by OS scheduling and power-management rules; it is not an exact-alarm clock. Android 13 and later also require runtime notification permission in applicable cases.

Product implication:
- Keep the current Android WorkManager approach for routine study reminders unless a verified requirement justifies a different primitive.
- Respect notification permission; don't repeatedly prompt after denial.
- Provide a native “send test reminder” path and show permission state clearly.
- Make missed reminders recover gracefully; never imply that a web timer can reliably alert while the browser is fully closed.
- Avoid alert spam. Two useful reminders are better than a notification for every card.

Sources:
- https://developer.android.com/develop/background-work/background-tasks/persistent
- https://developer.android.com/about/versions/13/behavior-changes-all
- Google Play target API requirements (check before every release): https://developer.android.com/google/play/requirements/target-sdk

## 4. The unified experience

Use one shared engine with selectable goal modes—not separate apps and not one cluttered dashboard for everyone.

### Shared execution engine

1. **Discover** — Ask what the user wants to improve and what blocks them.
2. **Assess** — Capture time, deadline, current level, constraints and preferred language.
3. **Goal** — Define a measurable outcome and a realistic milestone.
4. **Plan** — Create a schedule with buffer time and a clear first action.
5. **Act** — Start one focused session with minimal distractions.
6. **Track** — Record completion and evidence; distinguish planned, attempted, completed and mastered.
7. **Reflect** — Ask what worked, what blocked progress and what was learned.
8. **Adapt / Repair** — Adjust the next action, repair errors and schedule a retest where relevant.
9. **Grow / Restart** — Carry forward evidence and offer a calm restart after missed days.

### Goal modes

- **Exam mode:** syllabus, spaced revision, question practice, mocks, analysis, error log, repair and retest.
- **Project / career mode:** project milestones, skill practice, deep-work sessions, deliverables and review.
- **Personal growth mode:** user-selected dimensions such as body, learning, finance, relationships, habits and purpose.

Each mode can define its own terms and metrics while reusing scheduling, focus sessions, progress evidence, reflection, accessibility and backup.

### Best Version / FAST / 7 Cs

- **FAST is an operating rule:** Focus the most valuable task → take a small Action → repeat a reliable System → Track honest evidence.
- **7 Cs are behavioral values, not seven extra dashboards:** Confidence grounded in evidence; Clarity about the next step; Concentration protected by focus; Consistency through repeatable systems; Character through honesty; Commitment with recovery; Capacity for Joy through a humane experience.
- **Me vs Me:** compare a user's current progress with their own previous progress, not a public leaderboard.
- **Friendly mentor, not a judge:** no shaming for missed days and no manipulative streak loss.
- **India-first:** mobile-first, readable on lower-sized screens, simple English/Hindi-ready copy, low-data and offline-first core workflows.

## 5. What to keep, improve, and avoid

### Keep
- The existing CAT execution workflows and saved user progress.
- The shared Focus-first direction, repair loops, BRM / Body360 sequences, and Vision page.
- Asia/Kolkata-safe date handling, local-first data, portable backup and Android WorkManager reminders.
- The existing visual identity until the accessible UX source is inspected and any change is tested.

### Improve in priority order
1. **Reliability:** build/type checks, release version consistency, notification permission/test flow, date rollover, resume/reboot recovery, backup/restore and data migration tests.
2. **Clarity:** show one recommended next action above secondary tools; group advanced features behind clear navigation rather than adding more top-level cards.
3. **First value:** let a new user choose an intended goal mode and complete a small useful action quickly, without disrupting the founder's own CAT-first home view.
4. **Learning quality:** evidence → explanation → practice → error classification → repair → retest.
5. **Progress quality:** distinguish completion from mastery; show the evidence and next step behind each metric.
6. **Accessibility and performance:** text scaling, keyboard/screen-reader labels, adequate touch targets, contrast, reduced motion, and lazy-load long histories.
7. **Research loop:** interview each segment separately, run a small pilot, measure activation and repeat usefulness, then revise the product hypothesis.

### Avoid
- Blindly copying a second app's shell, dependencies, navigation, database or brand.
- Replacing the database or changing schema without explicit migration and backup tests.
- Promising score gains, health outcomes, retention, product-market fit or scale without evidence.
- Requiring cloud AI or image generation for core planning and stored progress.
- Fake streaks, dark patterns, social pressure, spam reminders, fake testimonials or unnecessary permissions.
- Shipping a new native APK claim before the Android build actually succeeds and the artifact is available.

## 6. Product measures that matter

Instrument only data needed to improve the experience, with clear notice and user control. Prefer a small set of meaningful measures:

- **Activation:** new user selects a goal and completes a first useful action.
- **Time to first value:** time from opening to the first completed action.
- **Plan usefulness:** whether the next action felt clear and realistic.
- **Repeat value:** returning to act or review in subsequent days/weeks.
- **Repair effectiveness:** users retry a corrected skill/question and demonstrate better performance.
- **Trust / reliability:** reminder delivery diagnostics, successful backup/restore, errors and crashes.
- **Equity of access:** usability across device sizes, slower connections and language needs.

Do not optimize time spent in the app for its own sake. The intended outcome is valuable action outside the screen.

## 7. Release safety gates

Before production:
- [ ] Typecheck and production web build pass.
- [ ] Latest Vercel production deployment is READY and the production alias points to it.
- [ ] No user progress is lost after refresh, restart, date rollover or app update.
- [ ] Backup export/import is tested on a copy of existing data.
- [ ] Android notification permission states are handled; test reminder works; disabled permission does not break the app.
- [ ] Android target API is checked against the current official Play requirement.
- [ ] Phone and desktop smoke checks pass, including keyboard, focus, loading, empty/error states and long content.
- [ ] Claims in the product and store listing are supported by evidence.
- [ ] Release APK is built from the same web bundle/source revision being released.

## 8. Merge protocol for the inaccessible `q` repository

When its code can be read, merge only after this inventory:

1. Capture both repository heads, directory trees, package manifests, build commands, license and build status.
2. Compare product flows, visual tokens, routes, state model, data schema, authentication, notification implementation, accessibility and tests.
3. Map every candidate feature to one of: **reuse as-is**, **adapt**, **replace**, **defer**, or **reject**, with the reason and risk.
4. Preserve the existing database and user data. Introduce migrations only with a backup, test fixtures and rollback path.
5. Create a merge branch; integrate a small vertical slice first (one goal → one action → completion evidence → review).
6. Run build/typecheck/unit tests and manual mobile/browser smoke tests; compare screenshots where applicable.
7. Open a reviewable change set; merge only when green. Deploy only after the deployment reports READY and its production alias is confirmed.

Until then, the safe merge outcome is: use the accessible FAST / 7 Cs / Best Version principles in the existing product strategy; do not infer the contents of `q`.

## 9. Decision rule

For each proposed feature, ask:
1. Is there a real, repeated user problem?
2. Does this feature improve the next action, focus, learning, progress trust or recovery?
3. Can we ship and support it safely on real phones?
4. Is it accessible, privacy-respecting and useful offline where possible?
5. How will we verify that it helps?

If evidence is weak, test cheaply first. If it adds complexity without observable user value, defer it.
