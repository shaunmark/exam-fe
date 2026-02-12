# Exam Platform — Frontend

Online exam-taking platform built with Next.js (App Router), Mantine UI, Zustand, and TypeScript.

## Tech Stack

- **Next.js 15** — App Router, SSR
- **TypeScript** — Strict mode
- **Mantine v8** — UI components
- **Zustand 5** — Client state management
- **Fetch API** — No React Query (MVP)
- **Yarn 4** — Package manager

Backend: **NestJS** (separate repo)

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn 4

### Environment

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Falls back to `http://localhost:3001` if not set.

### Install & Run

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                          # Root layout (MantineProvider)
│   ├── page.tsx                            # Home page
│   ├── exam/
│   │   ├── [code]/
│   │   │   ├── page.tsx                    # Exam landing (SSR — fetches exam metadata)
│   │   │   ├── exam-landing.tsx            # Client component — Start Exam button
│   │   │   └── take/
│   │   │       └── page.tsx                # Exam-taking page (renders ExamClient)
│   │   └── result/
│   │       └── [attemptId]/
│   │           ├── page.tsx                # Submission confirmation
│   │           └── loading.tsx             # Loading state
├── components/
│   └── exam/
│       ├── ExamClient.tsx                  # Main exam orchestrator (timer, submit, layout)
│       ├── Header.tsx                      # Timer, progress bar, answer count
│       ├── QuestionCard.tsx                # Current question display
│       ├── Options.tsx                     # Radio group for answer options
│       ├── Controls.tsx                    # Prev/Next, Mark, Clear, End Test
│       └── PalettePanel.tsx                # Question navigation palette with status colors
├── lib/
│   ├── api.ts                              # Generic apiFetch<T>() with error handling
│   ├── exam-api.ts                         # Typed API functions (fetchExam, start, submit)
│   └── types.ts                            # Frontend domain types (not leaked from backend)
└── store/
    └── useExamStore.ts                     # Zustand store + selectors + session persistence
```

## Architecture

### API Layer (`src/lib/`)

- **`api.ts`** — Centralized `apiFetch<T>()` generic function. Handles JSON serialization, error responses (`ApiError` class), and base URL configuration.
- **`exam-api.ts`** — Typed endpoint functions:
  - `fetchExamByCode(code)` — `GET /exam/:code`
  - `startAttempt(examId)` — `POST /attempt/start`
  - `submitAttempt(payload)` — `POST /attempt/submit`
- **`types.ts`** — Frontend-only interfaces (`ExamMeta`, `ExamQuestion`, `ExamOption`, `AttemptStartResponse`, `SubmitPayload`, etc.). Backend response types are **not** leaked.

### Zustand Store (`src/store/useExamStore.ts`)

**State:**

| Field              | Type                    | Description                  |
| ------------------ | ----------------------- | ---------------------------- |
| `attemptId`        | `string \| null`        | Current attempt ID           |
| `endsAt`           | `string \| null`        | ISO timestamp for exam end   |
| `questions`        | `ExamQuestion[]`        | All questions for the exam   |
| `currentIndex`     | `number`                | Currently viewed question    |
| `answers`          | `Record<string,string>` | questionId → selected option |
| `markedForReview`  | `string[]`              | Question IDs marked          |
| `visitedQuestions` | `string[]`              | Question IDs visited         |
| `submitted`        | `boolean`               | Whether exam was submitted   |

**Actions:** `initialize`, `selectAnswer`, `clearAnswer`, `toggleMark`, `next`, `prev`, `goToQuestion`, `markSubmitted`, `reset`, `hydrate`

**Derived selectors (not stored):**

- `getQuestionStatus()` — Returns one of: `not-visited`, `not-answered`, `answered`, `marked`, `answered-marked`
- Timer is derived from `endsAt` in `ExamClient` via `setInterval`

**Session persistence:** State is persisted to `sessionStorage` on every change and restored on page reload.

### Exam Flow

1. **`/exam/[code]`** — SSR page fetches exam metadata. Renders `ExamLanding` client component.
2. **Start Exam** — Calls `POST /attempt/start`, initializes Zustand store, navigates to `/exam/[code]/take`.
3. **`/exam/[code]/take`** — Renders `ExamClient` which orchestrates:
   - **Timer** — Derived from `endsAt`, recalculated every second, auto-submits at 0.
   - **Question navigation** — Via palette or Prev/Next buttons.
   - **Answer selection** — Radio group, stored in Zustand.
   - **Mark for review** — Toggle per question.
   - **Mobile support** — Palette in a bottom `Drawer`.
4. **Submit** — Transforms `store.answers` into `AnswerPayload[]`, calls `POST /attempt/submit`, clears session, redirects to `/exam/result/[attemptId]`.
5. **`/exam/result/[attemptId]`** — Confirmation page.

### Question Status Colors (Palette)

| Status             | Color  |
| ------------------ | ------ |
| Not Visited        | Gray   |
| Not Answered       | Red    |
| Answered           | Green  |
| Marked for Review  | Violet |
| Answered + Marked  | Teal   |

## Scripts

| Command            | Description          |
| ------------------ | -------------------- |
| `yarn dev`         | Start dev server     |
| `yarn build`       | Production build     |
| `yarn start`       | Start prod server    |
| `yarn lint`        | Run ESLint           |
| `yarn format`      | Format with Prettier |
| `yarn format:check`| Check formatting     |
