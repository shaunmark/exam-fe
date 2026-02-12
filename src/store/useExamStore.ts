import { create } from 'zustand';
import type { ExamQuestion } from '@/lib/types';

// ── Serializable state (Sets stored as arrays for sessionStorage compat) ──

interface ExamState {
  attemptId: string | null;
  endsAt: string | null;
  questions: ExamQuestion[];
  currentIndex: number;
  answers: Record<string, string>;
  markedForReview: string[];
  visitedQuestions: string[];
  submitted: boolean;
}

interface ExamActions {
  initialize: (payload: {
    attemptId: string;
    endsAt: string;
    questions: ExamQuestion[];
  }) => void;
  selectAnswer: (questionId: string, optionId: string) => void;
  clearAnswer: (questionId: string) => void;
  toggleMark: (questionId: string) => void;
  next: () => void;
  prev: () => void;
  goToQuestion: (index: number) => void;
  markSubmitted: () => void;
  reset: () => void;
  hydrate: (state: ExamState) => void;
}

export type ExamStore = ExamState & ExamActions;

const initialState: ExamState = {
  attemptId: null,
  endsAt: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  markedForReview: [],
  visitedQuestions: [],
  submitted: false,
};

export const useExamStore = create<ExamStore>()((set, get) => ({
  ...initialState,

  initialize: ({ attemptId, endsAt, questions }) => {
    const firstQuestionId = questions[0]?.id;
    set({
      ...initialState,
      attemptId,
      endsAt,
      questions,
      visitedQuestions: firstQuestionId ? [firstQuestionId] : [],
    });
  },

  selectAnswer: (questionId, optionId) => {
    set((s) => ({
      answers: { ...s.answers, [questionId]: optionId },
    }));
  },

  clearAnswer: (questionId) => {
    set((s) => {
      const { [questionId]: _, ...rest } = s.answers;
      return { answers: rest };
    });
  },

  toggleMark: (questionId) => {
    set((s) => {
      const marked = s.markedForReview.includes(questionId)
        ? s.markedForReview.filter((id) => id !== questionId)
        : [...s.markedForReview, questionId];
      return { markedForReview: marked };
    });
  },

  next: () => {
    const { currentIndex, questions } = get();
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextId = questions[nextIndex].id;
      set((s) => ({
        currentIndex: nextIndex,
        visitedQuestions: s.visitedQuestions.includes(nextId)
          ? s.visitedQuestions
          : [...s.visitedQuestions, nextId],
      }));
    }
  },

  prev: () => {
    const { currentIndex, questions } = get();
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevId = questions[prevIndex].id;
      set((s) => ({
        currentIndex: prevIndex,
        visitedQuestions: s.visitedQuestions.includes(prevId)
          ? s.visitedQuestions
          : [...s.visitedQuestions, prevId],
      }));
    }
  },

  goToQuestion: (index) => {
    const { questions } = get();
    if (index >= 0 && index < questions.length) {
      const qId = questions[index].id;
      set((s) => ({
        currentIndex: index,
        visitedQuestions: s.visitedQuestions.includes(qId)
          ? s.visitedQuestions
          : [...s.visitedQuestions, qId],
      }));
    }
  },

  markSubmitted: () => set({ submitted: true }),

  reset: () => set(initialState),

  hydrate: (state) => set(state),
}));

// ── Derived selectors (not stored) ──

export type QuestionStatus =
  | 'not-visited'
  | 'not-answered'
  | 'answered'
  | 'marked'
  | 'answered-marked';

export function getQuestionStatus(
  questionId: string,
  answers: Record<string, string>,
  markedForReview: string[],
  visitedQuestions: string[],
): QuestionStatus {
  const isAnswered = questionId in answers;
  const isMarked = markedForReview.includes(questionId);
  const isVisited = visitedQuestions.includes(questionId);

  if (isAnswered && isMarked) return 'answered-marked';
  if (isMarked) return 'marked';
  if (isAnswered) return 'answered';
  if (isVisited) return 'not-answered';
  return 'not-visited';
}

// ── SessionStorage persistence ──

const STORAGE_KEY = 'exam-state';

export function persistToSession(state: ExamState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // silently fail if storage is full
  }
}

export function restoreFromSession(): ExamState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ExamState;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}
