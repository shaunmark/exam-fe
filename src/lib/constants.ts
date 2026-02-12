// ── Hardcoded UI text (not from backend) ──

export const HOME = {
  TITLE: 'Exam Platform',
  TAGLINE:
    'Take timed exams, track your progress, and test your knowledge — all in one place.',
  DEMO_CARD_TITLE: 'General Knowledge — Demo',
  DEMO_CARD_DESCRIPTION: 'A quick 10-question demo to explore the platform.',
  DEMO_CARD_BADGE: 'Free',
  DEMO_CARD_QUESTIONS: '10 Questions',
  DEMO_CARD_DURATION: '10 Minutes',
  DEMO_CTA: 'Start Demo Exam',
  FOOTER: 'More exams coming soon.',
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
