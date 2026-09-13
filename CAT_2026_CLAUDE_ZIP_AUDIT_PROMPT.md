# 📁 CAT 2026 — Complete Code Audit Prompt for Claude
## (Upload `CAT2026_ALL_IN_ONE_FULL_PROJECT.zip` alongside this prompt)

Dear Claude,

Here is the complete, actual, un-truncated codebase for the **CAT 2026 Master Execution & Deep Research Application** attached as **`CAT2026_ALL_IN_ONE_FULL_PROJECT.zip`**.

Please unzip and inspect the files directly to verify the complete project implementation yourself.

---

### 🔍 Instructions for Claude Audit:

Please open and inspect these files directly from the attached ZIP archive:

1. **Root Application Shell (`src/app/App.tsx`)**:
   - Verify main bottom tab navigation (`TodayPage`, `WeekPage`, `MasteryPage`, `PhasesPage`, `MorePage`).
   - Verify all 14 EdTech sub-page routes:
     - `CatMockExamPage` (Full CAT/MAT Mock Exam Simulator)
     - `AdaptiveLearningPage` (AI Weakness Heatmap & Daily Priorities)
     - `DailyCapsulePage` (Daily Execution Briefs & Practice Sprints)
     - `FormulaDeckPage` (Spaced Repetition Formula Flashcards)
     - `AchievementsPage` (Streak Flame 🔥 & Execution Badges)
     - `DeepResearchPage` (Deep Research Concept Engine)
     - `LiveSessionsPage` (Live Masterclasses, Recordings, Class Notes)
     - `QuestionBankPage` (Adaptive Question Vault)
     - `SpeedDrillsPage` (Mental Math & Fraction Drills)
     - `ErrorsPage`, `RepairPage`, `RetestPage` (C1–C5 Error Log & Spaced Repetition)
     - `SchedulePage`, `VisionPage`, `SyllabusPage`, `SettingsPage`

2. **Header Bar & User Auth (`src/components/Header.tsx`, `src/components/AuthModal.tsx`, `src/hooks/useAuth.ts`)**:
   - Inspect the Target Exam Switcher bar (**CAT 2026**, **NMAT**, **SNAP**, **XAT**, **MAT**, **CMAT**).
   - Inspect the **Google One-Tap** & **Email Sign-In** authentication system and profile state (`cat2026_user_profile`).

3. **Native Android Host (`app/src/main/java/com/cat2026/app/MainActivity.kt`)**:
   - Inspect the Kotlin Jetpack Compose activity configuring `WebViewAssetLoader` for local secure origin `https://appassets.androidplatform.net/assets/public/index.html`.
   - Inspect Android resources in `app/src/main/res/values/` (`strings.xml`, `colors.xml`, `themes.xml`) and `app/build.gradle.kts` (`com.cat2026.app`).

4. **Database & Repositories (`src/db/index.ts`, `src/repositories/`)**:
   - Inspect IndexedDB schema for `tasks`, `errors`, `masteryTopics`, `mocks`, `dailyScores`, and `settings`.

---

### 📋 Expected Output from Claude:
After inspecting the attached ZIP files, please provide:
1. An honest, file-by-file verification confirming the actual presence of all features.
2. An audit summary confirming that all 14 EdTech tools, native Android WebView host, and user authentication features are 100% real and present in the source code!
