import { apiFetch } from './api';
import {
  mockFetchExamByCode,
  mockStartAttempt,
  mockSubmitAttempt,
} from './mock-data';
import type {
  ExamMeta,
  AttemptStartResponse,
  SubmitPayload,
  SubmitResponse,
} from './types';

// ── Toggle mock mode: set to true to bypass real backend ──
const USE_MOCKS = true;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

// ── Full submit endpoint URL (used by sendBeacon for tab-close submission) ──
export const SUBMIT_URL = `${BASE_URL}/attempt/submit`;

// ── Fetch exam metadata by its unique code ──
export function fetchExamByCode(code: string): Promise<ExamMeta> {
  if (USE_MOCKS) return mockFetchExamByCode(code);
  return apiFetch<ExamMeta>(`/exam/${code}`);
}

// ── Start an exam attempt, returns attemptId + questions + deadline ──
export function startAttempt(examId: string): Promise<AttemptStartResponse> {
  if (USE_MOCKS) return mockStartAttempt(examId);
  return apiFetch<AttemptStartResponse>('/attempt/start', {
    method: 'POST',
    body: { examId },
  });
}

// ── Submit all answers for a given attempt ──
export function submitAttempt(payload: SubmitPayload): Promise<SubmitResponse> {
  if (USE_MOCKS) return mockSubmitAttempt();
  return apiFetch<SubmitResponse>('/attempt/submit', {
    method: 'POST',
    body: payload,
  });
}
