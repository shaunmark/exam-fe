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

export const UPLOAD = {
  TITLE: 'Upload Exam Data',
  SUBTITLE: 'Import exam data from Excel files into the system',
  INSTRUCTIONS_TITLE: 'Instructions',
  FILE_REQUIREMENTS_TITLE: 'Excel File Requirements:',
  FILE_REQUIREMENTS: [
    'File must be in .xlsx format',
    'Maximum file size: 10MB',
    'Must contain two sheets: "Exams" and "Questions"',
  ],
  EXAMS_SHEET_TITLE: 'Exams Sheet Columns:',
  EXAMS_SHEET_COLUMNS: [
    { name: 'code', required: true, description: 'Unique exam identifier' },
    { name: 'title', required: true, description: 'Exam display title' },
    { name: 'durationMins', required: true, description: 'Exam duration in minutes' },
    { name: 'description', required: false, description: 'Exam description' },
    { name: 'isActive', required: false, description: 'Whether exam is available' },
  ],
  QUESTIONS_SHEET_TITLE: 'Questions Sheet Columns:',
  QUESTIONS_SHEET_COLUMNS: [
    { name: 'examCode', required: true, description: 'Must match an exam code' },
    { name: 'text', required: true, description: 'Question text' },
    { name: 'optionA, optionB, optionC, optionD', required: true, description: 'Answer options' },
    { name: 'correctOption', required: true, description: 'Must be A, B, C, or D' },
    { name: 'order', required: false, description: 'Display order' },
    { name: 'marks', required: false, description: 'Points for correct answer' },
  ],
  DOWNLOAD_TEMPLATE: 'Download Template',
  DOWNLOAD_SUBTITLE: 'Download a sample template to get started',
  CHOOSE_FILE: 'Choose File',
  ACCEPTED_FORMAT: 'Accepted format: .xlsx (Max size: 10MB)',
  DRAG_DROP: 'Drag & Drop Excel File Here',
  OR_CLICK: 'or click to browse',
  BACK_TO_EXAMS: '← Back to Exams',
  TEMPLATE_FILENAME: 'exam-template.xlsx',
  // Sample data for template
  SAMPLE_EXAMS: [
    {
      code: 'MATH-001',
      title: 'Mathematics Exam',
      durationMins: 60,
      description: 'Basic math test covering algebra and geometry',
      isActive: true,
    },
    {
      code: 'SCI-001',
      title: 'Science Exam',
      durationMins: 90,
      description: 'General science covering physics, chemistry, and biology',
      isActive: true,
    },
  ],
  SAMPLE_QUESTIONS: [
    {
      examCode: 'MATH-001',
      text: 'What is 2 + 2?',
      optionA: '3',
      optionB: '4',
      optionC: '5',
      optionD: '6',
      correctOption: 'B',
      order: 1,
      marks: 1,
    },
    {
      examCode: 'MATH-001',
      text: 'What is 5 × 5?',
      optionA: '20',
      optionB: '25',
      optionC: '30',
      optionD: '35',
      correctOption: 'B',
      order: 2,
      marks: 1,
    },
    {
      examCode: 'SCI-001',
      text: 'What is H2O?',
      optionA: 'Hydrogen',
      optionB: 'Water',
      optionC: 'Oxygen',
      optionD: 'Carbon',
      correctOption: 'B',
      order: 1,
      marks: 1,
    },
  ],
} as const;
