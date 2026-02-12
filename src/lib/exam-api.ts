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

const USE_MOCKS = true;

export function fetchExamByCode(code: string): Promise<ExamMeta> {
  if (USE_MOCKS) return mockFetchExamByCode(code);
  return apiFetch<ExamMeta>(`/exam/${code}`);
}

export function startAttempt(examId: string): Promise<AttemptStartResponse> {
  if (USE_MOCKS) return mockStartAttempt(examId);
  return apiFetch<AttemptStartResponse>('/attempt/start', {
    method: 'POST',
    body: { examId },
  });
}

export function submitAttempt(payload: SubmitPayload): Promise<SubmitResponse> {
  if (USE_MOCKS) return mockSubmitAttempt();
  return apiFetch<SubmitResponse>('/attempt/submit', {
    method: 'POST',
    body: payload,
  });
}
