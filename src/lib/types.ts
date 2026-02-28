// ── Frontend domain types (not leaked from backend) ──

// ── Exam metadata shown on the landing page ──
export interface ExamMeta {
  id: string;
  code: string;
  title: string;
  description: string;
  durationMins: number;
  totalQuestions: number;
}

// ── Single answer option within a question ──
export interface ExamOption {
  id: string;
  label: string;
  text: string;
}

// ── A question with its list of options ──
export interface ExamQuestion {
  id: string;
  index: number;
  text: string;
  options: ExamOption[];
}

// ── API response types (from backend) ──
export interface ApiQuestion {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  /** Display order of the question (1-based). Questions are sorted by this field. */
  order: number;
  /** Points awarded for a correct answer. Defaults to 1 in the DB schema. */
  marks: number;
}

export interface ApiExamDetail {
  id: string;
  code: string;
  title: string;
  description: string;
  durationMins: number;
  totalQuestions: number;
  questions: ApiQuestion[];
}

// ── Full exam detail (metadata + questions) ──
export interface ExamDetail extends ExamMeta {
  questions: ExamQuestion[];
}

// ── Payload for POST /attempt/start ──
export interface StartAttemptPayload {
  examCode: string;
  userId: string;
}

// ── Response from POST /attempt/start ──
export interface AttemptStartResponse {
  attemptId: string;
  endsAt: string; // ISO date string
}

// ── Single answer sent in the submit payload ──
export interface AnswerPayload {
  questionId: string;
  selectedOption: string;
  isMarkedForReview: boolean;
}

// ── Full payload for POST /attempt/submit ──
export interface SubmitPayload {
  attemptId: string;
  answers: AnswerPayload[];
}

// ── Response from POST /attempt/submit ──
export interface SubmitResponse {
  message: string;
}

// ── Custom error class thrown by apiFetch on non-OK responses ──
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: unknown,
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}
