// ── Frontend domain types (not leaked from backend) ──

export interface ExamMeta {
  id: string;
  code: string;
  title: string;
  description: string;
  durationMinutes: number;
  totalQuestions: number;
}

export interface ExamOption {
  id: string;
  label: string;
  text: string;
}

export interface ExamQuestion {
  id: string;
  index: number;
  text: string;
  options: ExamOption[];
}

export interface ExamDetail {
  meta: ExamMeta;
  questions: ExamQuestion[];
}

export interface AttemptStartResponse {
  attemptId: string;
  endsAt: string; // ISO date string
  questions: ExamQuestion[];
}

export interface AnswerPayload {
  questionId: string;
  selectedOption: string;
  isMarkedForReview: boolean;
}

export interface SubmitPayload {
  attemptId: string;
  answers: AnswerPayload[];
}

export interface SubmitResponse {
  message: string;
}

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
