import type { QuestionStatus } from '@/store/useExamStore';

// ── Centralized color configuration ──
// Change values here to update colors across the entire application.
// All values are Mantine color names (e.g. 'blue', 'red', 'teal').

// ── Brand / Global ──
export const COLORS = {
  PRIMARY: 'blue',
  PRIMARY_GRADIENT: { from: 'blue', to: 'cyan' },
  ACCENT: 'teal',
  DANGER: 'red',
  WARNING: 'orange',
  SUCCESS: 'green',
  SUCCESS_GRADIENT: { from: 'teal', to: 'green' },
  MUTED: 'gray',
} as const;

// ── Exam header ──
export const HEADER_COLORS = {
  TITLE: COLORS.PRIMARY,
  ANSWER_COUNT_BADGE: COLORS.MUTED,
  PROGRESS_DEFAULT: COLORS.PRIMARY,
  PROGRESS_COMPLETE: COLORS.SUCCESS,
  TIMER_NORMAL: COLORS.PRIMARY,
  TIMER_URGENT: COLORS.DANGER,
  STRIP_FILL: COLORS.PRIMARY,
  STRIP_TRACK: COLORS.MUTED,
} as const;

// ── Question card ──
export const QUESTION_COLORS = {
  INDEX_BADGE: COLORS.PRIMARY,
  ANSWERED_BADGE: COLORS.SUCCESS,
  MARKED_BADGE: 'violet',
  SELECTED_OPTION_BORDER: COLORS.PRIMARY,
  SELECTED_OPTION_BG: COLORS.PRIMARY,
} as const;

// ── Controls ──
export const CONTROL_COLORS = {
  CLEAR: COLORS.MUTED,
  MARK: 'violet',
  END_TEST: COLORS.DANGER,
} as const;

// ── Question palette: status → color mapping ──
export const PALETTE_COLORS: Record<QuestionStatus, string> = {
  'not-visited': COLORS.MUTED,
  'not-answered': COLORS.DANGER,
  answered: COLORS.SUCCESS,
  marked: 'violet',
  'answered-marked': COLORS.ACCENT,
} as const;

// ── Question palette: status → human-readable label ──
export const PALETTE_LABELS: Record<QuestionStatus, string> = {
  'not-visited': 'Not Visited',
  'not-answered': 'Not Answered',
  answered: 'Answered',
  marked: 'Marked',
  'answered-marked': 'Ans + Marked',
} as const;

// ── Palette: current question highlight ──
export const PALETTE_CURRENT_SHADOW = COLORS.PRIMARY;

// ── Mobile FAB ──
export const FAB_COLOR = COLORS.PRIMARY;

// ── Modal ──
export const MODAL_COLORS = {
  UNANSWERED_WARNING: COLORS.WARNING,
  SUBMIT: COLORS.DANGER,
} as const;

// ── Landing page ──
export const LANDING_COLORS = {
  CODE_BADGE: COLORS.PRIMARY,
  STAT_QUESTIONS: COLORS.PRIMARY,
  STAT_DURATION: COLORS.WARNING,
  ERROR: COLORS.DANGER,
} as const;

// ── Home page ──
export const HOME_COLORS = {
  BADGE_FREE: COLORS.ACCENT,
  BADGE_QUESTIONS: COLORS.PRIMARY,
  BADGE_DURATION: COLORS.WARNING,
} as const;

// ── Result page ──
export const RESULT_COLORS = {
  SUCCESS_GRADIENT: COLORS.SUCCESS_GRADIENT,
} as const;
