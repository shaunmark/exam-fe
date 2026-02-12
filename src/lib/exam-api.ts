import { apiFetch } from './api';
import type {
  ExamMeta,
  AttemptStartResponse,
  SubmitPayload,
  SubmitResponse,
} from './types';

export function fetchExamByCode(code: string): Promise<ExamMeta> {
  return apiFetch<ExamMeta>(`/exam/${code}`);
}

export function startAttempt(examId: string): Promise<AttemptStartResponse> {
  return apiFetch<AttemptStartResponse>('/attempt/start', {
    method: 'POST',
    body: { examId },
  });
}

export function submitAttempt(payload: SubmitPayload): Promise<SubmitResponse> {
  return apiFetch<SubmitResponse>('/attempt/submit', {
    method: 'POST',
    body: payload,
  });
}
