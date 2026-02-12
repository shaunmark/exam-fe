// ── Hardcoded UI text (not from backend) ──

export const HOME = {
  TITLE: 'Exam Platform',
  TAGLINE:
    'Take timed exams, track your progress, and test your knowledge — all in one place.',
  CTA: 'Browse Exams',
} as const;

export const EXAM_LIST = {
  TITLE: 'Available Exams',
  SUBTITLE: 'Choose an exam to get started.',
  EMPTY: 'No exams available at the moment. Check back later.',
  ERROR: 'Failed to load exams. Please try again later.',
  CARD_QUESTIONS: 'questions',
  CARD_MINUTES: 'min',
  CARD_CTA: 'Start Exam',
} as const;

export const EXAM_LANDING = {
  INSTRUCTIONS_TITLE: 'Instructions',
  INSTRUCTIONS: [
    'All questions are multiple choice with a single correct answer.',
    'You can navigate between questions and mark them for review.',
    'The timer starts as soon as you begin. The exam auto-submits when time runs out.',
    'You can submit early using the "End Test" button.',
  ],
  START_CTA: 'Start Exam',
  TIMER_WARNING: 'Once started, the timer cannot be paused.',
  ERROR_NOT_FOUND: 'Exam not found.',
  ERROR_START_FAILED: 'Failed to start the exam. Please try again.',
  ERROR_LOAD_FAILED:
    'Failed to load exam. Please check the exam code and try again.',
  STAT_QUESTIONS: 'Questions',
  STAT_MINUTES: 'Minutes',
} as const;

export const RESULT = {
  TITLE: 'Exam Submitted',
  MESSAGE: 'Your exam has been submitted successfully.',
  SUBTITLE: 'Your responses have been recorded. You can close this page.',
  BACK_CTA: 'Back to Home',
} as const;
