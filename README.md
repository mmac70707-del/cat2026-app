# CAT 2026 — Master Execution App (Stage 4)

React + TypeScript + Vite production build.  
Migrated from Stage 1 HTML prototype.

---

## Quick Start

```bash
cd cat2026
npm install
npm run dev
```

Open: http://localhost:5173

---

## Build Commands

```bash
npm install          # install all dependencies
npm run dev          # development server (hot reload)
npm run build        # production build → dist/
npm run preview      # preview production build locally
npm run type-check   # TypeScript type check only
```

---

## Project Structure

```
cat2026/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── main.tsx              # entry point + PWA SW
    ├── app/
    │   └── App.tsx           # main router + swipe nav
    ├── components/
    │   ├── Header.tsx        # live countdown + phase
    │   ├── BottomNav.tsx     # 5-tab navigation
    │   ├── StudyTimer.tsx    # floating FAB timer
    │   ├── Toast.tsx         # global toast system
    │   ├── EmptyState.tsx    # NO DATA states
    │   └── MasteryBar.tsx    # mastery level bars
    ├── features/
    │   ├── today/            # Today page + BlockCard
    │   ├── week/             # Week page + daily plan
    │   ├── mastery/          # Mastery tracker
    │   ├── phases/           # Phase roadmap
    │   ├── errors/           # Error log C1–C5
    │   ├── repair/           # Repair queue
    │   ├── retest/           # Retest queue
    │   ├── mocks/            # Mock analysis
    │   ├── schedule/         # Daily schedule
    │   ├── vision/           # Vision & Mission
    │   ├── syllabus/         # Full syllabus
    │   └── settings/         # Settings + export
    ├── pages/
    │   └── MorePage.tsx      # Hub + quick stats
    ├── data/
    │   └── config.ts         # All CAT static config
    ├── db/
    │   └── index.ts          # IndexedDB abstraction
    ├── repositories/
    │   ├── TaskRepository.ts
    │   ├── ErrorRepository.ts
    │   ├── MasteryRepository.ts
    │   └── index.ts          # Mock, Score, Settings repos
    ├── services/
    │   └── domain.ts         # Pure CAT business logic
    ├── hooks/
    │   ├── useCountdown.ts   # live countdown
    │   ├── usePhase.ts       # dynamic phase
    │   ├── useTasks.ts       # task CRUD
    │   └── index.ts          # errors, timer, stats hooks
    ├── types/
    │   └── index.ts          # all TypeScript types
    └── styles/
        └── globals.css       # complete design system
```

---

## Architecture

```
UI Components
    ↓
React Hooks (state + side effects)
    ↓
Repositories (data access layer)
    ↓
IndexedDB (db/index.ts abstraction)
    ↓
Browser IndexedDB (persistent storage)

+ Domain Service (pure logic, no side effects)
+ Config (single source of truth)
```

---

## IndexedDB Schema

| Store         | Key Path | Indexes                        |
|---------------|----------|--------------------------------|
| tasks         | id       | byDate, byStatus, bySubject    |
| errors        | id       | byType, bySubject, byRepair    |
| masteryTopics | id       | —                              |
| mocks         | id       | byDate                         |
| dailyScores   | date     | —                              |
| settings      | key      | —                              |

---

## Stage 5 — Android (Capacitor)

Stage 5 is prepared but **not executed** — this container has no
network access and no Android SDK, so `npm install`, `cap add
android`, and all device/build testing must run on your machine.

See **`STAGE5_SETUP.md`** for the exact command sequence, the native
code that was wired in (status bar, splash, back button, app-resume),
the pre-generated icon/splash assets in `android-assets/`, the
on-device persistence test protocol, and signing instructions.

Quick summary of the command sequence (full detail in STAGE5_SETUP.md):

```bash
npm install
npm run build
npx cap add android
npm run build && npx cap sync android
npx cap open android
# then Run ▶ in Android Studio on a device/emulator
```

## Daily Control System

The dashboard now derives the daily CAT control card from the Asia/Kolkata calendar and the app's date-specific adaptive task engine.
