# 🚀 CAT 2026 — Master Execution & Deep Research Application
## Complete Single Master Prompt for Claude

Copy and paste this prompt into Claude to instantly give it complete knowledge of the project's background, ZIP file evolution, tech stack, feature architecture, database schema, and operational workflow.

---

### 1. Project Background & ZIP Evolution

This project evolved from two zip archives provided by the user:
1. **`CAT2026_STAGE4.zip`**: The core React 18 + TypeScript 5 + Vite production web codebase for the CAT 2026 Execution System.
2. **`CAT2026_STAGE11.zip`**: Stage 4 + Stage 5 Capacitor Android packaging, native bridge integrations, and high-resolution Play Store assets.

Both ZIP files were extracted and merged directly into the active Android Studio workspace (`MyApplication`).
An updated web bundle archive is maintained at **`C:\Users\mmac7\Downloads\CAT2026_App_Web.zip`**.

---

### 2. Technology Stack & Architecture

- **Frontend**: React 18, TypeScript 5, Vite 5, CSS Variables (`src/styles/globals.css`).
- **Storage**: Browser IndexedDB (`src/db/index.ts`) managing 6 tables: `tasks`, `errors`, `masteryTopics`, `mocks`, `dailyScores`, `settings`.
- **Native Android**: Kotlin, Jetpack Compose, Android `ComponentActivity`, `WebViewAssetLoader` serving local web assets from `app/src/main/assets/public/` via origin `https://appassets.androidplatform.net/assets/public/index.html`.
- **Native Bridge**: Capacitor 6 plugins (`@capacitor/core`, `@capacitor/app`, `@capacitor/status-bar`, `@capacitor/splash-screen`) in `src/services/native.ts`.
- **Live Local Servers**: Web access on `http://localhost:5173` and mobile Wi-Fi access on `http://10.40.5.135:5173`.
- **Version Control**: Git repository initialized with clean working tree on `main` branch.

---

### 3. Complete List of All Implemented Features

#### A. Header & Navigation Control (`Header.tsx`, `AuthModal.tsx`, `useAuth.ts`)
- **Target Exam Switcher**: Toggle active target exam between **CAT 2026**, **NMAT**, **SNAP**, **XAT**, **MAT**, and **CMAT**.
- **Phase Badge**: P1 REBUILD, P2 APPLICATION, P3 MOCK, P4 CONSOLIDATION, P5 TAPER.
- **Live Countdown**: Real-time CAT 2026 countdown (Days, Hours, Minutes, Seconds).
- **User Authentication**: Google One-Tap & Email/Password Sign-In modal saving user profile, target percentile goal (e.g. 99.8%ile), and target IIM preferences.

#### B. 5 Primary Bottom Tabs (`BottomNav.tsx`, `App.tsx`)
1. **Today**: Daily study blocks, live floating Study Timer FAB (`StudyTimer.tsx`), and block completion toggles.
2. **Week**: Weekly execution template and daily performance score logger (Study hours, screen time, accuracy %).
3. **Mastery**: Topic-level mastery bars (Levels 0–5) across VARC, DILR, and QA topics.
4. **Phases**: Phase 1 to Phase 5 strategic roadmap with gate criteria.
5. **More Hub**: Central launchpad for all 14 EdTech tools and live IndexedDB stats.

#### C. Advanced EdTech Tools & Sub-Pages (`src/features/`)
1. 🧠 **AI Adaptive Weakness Heatmap (`AdaptiveLearningPage.tsx`)**:
   - Topic proficiency heatmap (Green ≥80%, Yellow 60–80%, Red <60%) across 30+ topics.
   - AI Priority Plan recommending top 3 daily study priorities based on lowest mastery.

2. 📰 **Daily Execution Briefs & Practice Sprints (`DailyCapsulePage.tsx`)**:
   - Daily RC passages, DILR logic sets, Quant speed briefs, and downloadable PDF study guides.

3. 🏆 **CAT 2026 Full Exam Simulator (`CatMockExamPage.tsx`)**:
   - 40-minute sectional countdown timers (VARC -> DILR -> QA).
   - MCQ (+3/-1) and TITA (+3/0) question types.
   - Live Question Palette (🟢 Answered, 🟡 Marked for Review, 🟣 Answered & Marked, ⚪ Unanswered).
   - Instant scorecard, estimated percentile, and one-tap C1–C5 error logging.

4. 📺 **Expert Masterclasses & Video Seminars (`LiveSessionsPage.tsx`)**:
   - Filter by Status (🔴 Live Now, ⏰ Upcoming, 📼 Recorded) and Section (VARC, LRDI, QA).
   - Instructor credentials (e.g. Aniket Dhiman - 99.44%iler, IIM Mumbai), video recording player modal, and class notes PDF downloads.

5. 🎴 **Spaced Repetition Formula Deck (`FormulaDeckPage.tsx`)**:
   - Leitner box flashcards with confidence ratings (*Hard*, *Medium*, *Easy*) to auto-schedule review intervals.

6. ⚡ **Quantum Calculation Drills (`SpeedDrillsPage.tsx`)**:
   - 5-minute daily mental math flashcards (Fractions 1/7–1/16, Squares 1–35, Cubes 1–20).

7. 🔬 **Deep Research Protocol (`DeepResearchPage.tsx`)**:
   - Multi-dimensional concept breakdowns, speed shortcuts, C1–C5 trap warnings, and CAT historical weightage trends.

8. 📚 **Adaptive Question Vault (`QuestionBankPage.tsx`)**:
   - Filter questions by Exam (CAT, NMAT, SNAP, XAT, MAT, CMAT), Subject, and Difficulty (*Easy, Moderate, CAT Level, Hard*).

9. 🎖️ **Execution Streak & Badges (`AchievementsPage.tsx`)**:
   - 🔥 Daily streak counter and execution badges (*Execution Flame*, *Accuracy Champion*, *Repair Master*, *Mock Dominator*, *Speed Demon*).

10. 🔴 **Error Log, Repair Queue & Retest System (`ErrorsPage.tsx`, `RepairPage.tsx`, `RetestPage.tsx`)**:
    - Classify mistakes into C1 (Concept), C2 (Calculation), C3 (Misread), C4 (Approach), C5 (Time Pressure).
    - Spaced-repetition Repair Queue and Retest verification.

11. ⏰ **Daily Schedule (`SchedulePage.tsx`)**:
    - Structured time blocks from 05:00 Morning Reset to 22:00 Sleep.

12. 🚀 **Vision Page**, 📖 **Syllabus Page**, 🧪 **Mock Analytics**, ⚙️ **Settings Page** (JSON Backup/Import).

---

### 4. Database Schema Summary (IndexedDB)

- `tasks`: `{ id, date, blockId, subject, title, status, startedAt, completedAt, timeSpentMin, notes }`
- `errors`: `{ id, errorType, subject, topic, wrongReason, correctMethod, preventionRule, repairStatus, retestStatus, createdAt }`
- `masteryTopics`: `{ id, subject, name, tier, currentLevel, evidence, attempts, correct, lastPracticed, lastTested }`
- `mocks`: `{ id, name, date, total, att, overall, qaAcc, dlAcc, vcAcc, weak, qa, dilr, varc }`
- `dailyScores`: `{ date, studyHrs, screenHrs, accuracyPct, loggedAt }`
- `settings`: `{ key, value }`

---

### 5. Build, Sync & Operational Workflow

1. **Re-building Production Web Bundle**:
   ```cmd
   cd /d C:\Users\mmac7\AndroidStudioProjects\MyApplication
   npx vite build
   ```
2. **Syncing Assets to Native Android App**:
   ```powershell
   Copy-Item -Path 'dist\*' -Destination 'app\src\main\assets\public' -Recurse -Force
   ```
3. **Updating Web Package Zip**:
   ```powershell
   Compress-Archive -Path 'dist\*' -DestinationPath 'C:\Users\mmac7\Downloads\CAT2026_App_Web.zip' -Force
   ```
4. **Git Version Control**:
   ```cmd
   git add .
   git commit -m "<Commit message>"
   ```

---

### 6. Code Style & Design System Guidelines

- **Theme Palette**: Deep Navy Background (`#0A0F1E`), Card Surface (`#0D1B2A`), Secondary Surface (`#1E293B`), Primary Blue (`#1A56DB`), Gold Accent (`#F5A623`), Success Green (`#22C55E`), Error Red (`#EF4444`).
- **Code Rules**: Fully typed TypeScript, clean functional components, responsive CSS, no missing imports, and strict error handling.
