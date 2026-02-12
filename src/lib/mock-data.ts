import type {
  ExamMeta,
  ExamQuestion,
  AttemptStartResponse,
  SubmitResponse,
} from './types';

// ── Mock exam catalogue (used by listing + detail endpoints) ──
const MOCK_EXAMS: ExamMeta[] = [
  {
    id: 'exam-001',
    code: 'DEMO2025',
    title: 'General Knowledge — Demo Exam',
    description:
      'A 10-question demo exam to test the platform. Covers science, history, and geography.',
    durationMinutes: 10,
    totalQuestions: 10,
  },
  {
    id: 'exam-002',
    code: 'MATH101',
    title: 'Mathematics Fundamentals',
    description:
      'Test your basics in arithmetic, algebra, and geometry. Suitable for all levels.',
    durationMinutes: 30,
    totalQuestions: 20,
  },
  {
    id: 'exam-003',
    code: 'SCI200',
    title: 'Science & Nature',
    description:
      'From physics to biology — how well do you know the natural world?',
    durationMinutes: 20,
    totalQuestions: 15,
  },
  {
    id: 'exam-004',
    code: 'HIST300',
    title: 'World History',
    description:
      'Journey through key events that shaped the modern world.',
    durationMinutes: 25,
    totalQuestions: 15,
  },
  {
    id: 'exam-005',
    code: 'ENG150',
    title: 'English Grammar & Vocabulary',
    description:
      'Assess your command of English with grammar, vocabulary, and comprehension questions.',
    durationMinutes: 15,
    totalQuestions: 20,
  },
  {
    id: 'exam-006',
    code: 'CS100',
    title: 'Computer Science Basics',
    description:
      'Data structures, algorithms, and fundamental CS concepts.',
    durationMinutes: 45,
    totalQuestions: 25,
  },
];

const MOCK_QUESTIONS: ExamQuestion[] = [
  {
    id: 'q1',
    index: 0,
    text: 'What is the chemical symbol for water?',
    options: [
      { id: 'q1-a', label: 'A', text: 'H2O' },
      { id: 'q1-b', label: 'B', text: 'CO2' },
      { id: 'q1-c', label: 'C', text: 'NaCl' },
      { id: 'q1-d', label: 'D', text: 'O2' },
    ],
  },
  {
    id: 'q2',
    index: 1,
    text: 'Which planet is known as the Red Planet?',
    options: [
      { id: 'q2-a', label: 'A', text: 'Venus' },
      { id: 'q2-b', label: 'B', text: 'Mars' },
      { id: 'q2-c', label: 'C', text: 'Jupiter' },
      { id: 'q2-d', label: 'D', text: 'Saturn' },
    ],
  },
  {
    id: 'q3',
    index: 2,
    text: 'Who wrote "Hamlet"?',
    options: [
      { id: 'q3-a', label: 'A', text: 'Charles Dickens' },
      { id: 'q3-b', label: 'B', text: 'William Shakespeare' },
      { id: 'q3-c', label: 'C', text: 'Jane Austen' },
      { id: 'q3-d', label: 'D', text: 'Mark Twain' },
    ],
  },
  {
    id: 'q4',
    index: 3,
    text: 'What is the largest ocean on Earth?',
    options: [
      { id: 'q4-a', label: 'A', text: 'Atlantic Ocean' },
      { id: 'q4-b', label: 'B', text: 'Indian Ocean' },
      { id: 'q4-c', label: 'C', text: 'Pacific Ocean' },
      { id: 'q4-d', label: 'D', text: 'Arctic Ocean' },
    ],
  },
  {
    id: 'q5',
    index: 4,
    text: 'What gas do plants absorb from the atmosphere?',
    options: [
      { id: 'q5-a', label: 'A', text: 'Oxygen' },
      { id: 'q5-b', label: 'B', text: 'Nitrogen' },
      { id: 'q5-c', label: 'C', text: 'Carbon Dioxide' },
      { id: 'q5-d', label: 'D', text: 'Hydrogen' },
    ],
  },
  {
    id: 'q6',
    index: 5,
    text: 'In which year did World War II end?',
    options: [
      { id: 'q6-a', label: 'A', text: '1943' },
      { id: 'q6-b', label: 'B', text: '1945' },
      { id: 'q6-c', label: 'C', text: '1947' },
      { id: 'q6-d', label: 'D', text: '1950' },
    ],
  },
  {
    id: 'q7',
    index: 6,
    text: 'What is the speed of light approximately?',
    options: [
      { id: 'q7-a', label: 'A', text: '3 × 10⁸ m/s' },
      { id: 'q7-b', label: 'B', text: '3 × 10⁶ m/s' },
      { id: 'q7-c', label: 'C', text: '3 × 10¹⁰ m/s' },
      { id: 'q7-d', label: 'D', text: '3 × 10⁴ m/s' },
    ],
  },
  {
    id: 'q8',
    index: 7,
    text: 'Which country is home to the kangaroo?',
    options: [
      { id: 'q8-a', label: 'A', text: 'New Zealand' },
      { id: 'q8-b', label: 'B', text: 'South Africa' },
      { id: 'q8-c', label: 'C', text: 'Australia' },
      { id: 'q8-d', label: 'D', text: 'Brazil' },
    ],
  },
  {
    id: 'q9',
    index: 8,
    text: 'What is the powerhouse of the cell?',
    options: [
      { id: 'q9-a', label: 'A', text: 'Nucleus' },
      { id: 'q9-b', label: 'B', text: 'Ribosome' },
      { id: 'q9-c', label: 'C', text: 'Mitochondria' },
      { id: 'q9-d', label: 'D', text: 'Golgi Apparatus' },
    ],
  },
  {
    id: 'q10',
    index: 9,
    text: 'Which element has the atomic number 1?',
    options: [
      { id: 'q10-a', label: 'A', text: 'Helium' },
      { id: 'q10-b', label: 'B', text: 'Hydrogen' },
      { id: 'q10-c', label: 'C', text: 'Lithium' },
      { id: 'q10-d', label: 'D', text: 'Carbon' },
    ],
  },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockFetchExams(): Promise<ExamMeta[]> {
  await delay(200);
  return MOCK_EXAMS;
}

export async function mockFetchExamByCode(_code: string): Promise<ExamMeta> {
  await delay(200);
  const found = MOCK_EXAMS.find((e) => e.code === _code);
  return found ?? { ...MOCK_EXAMS[0], code: _code };
}

export async function mockStartAttempt(
  _examId: string,
): Promise<AttemptStartResponse> {
  await delay(200);
  const exam = MOCK_EXAMS.find((e) => e.id === _examId) ?? MOCK_EXAMS[0];
  const endsAt = new Date(Date.now() + exam.durationMinutes * 60 * 1000).toISOString();
  return {
    attemptId: `attempt-${Date.now()}`,
    endsAt,
    questions: MOCK_QUESTIONS,
  };
}

export async function mockSubmitAttempt(): Promise<SubmitResponse> {
  await delay(200);
  return { message: 'Exam submitted successfully.' };
}
