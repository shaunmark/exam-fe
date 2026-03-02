import { apiFetch } from './api';
import type {
  ExamMeta,
  ExamDetail,
  ApiExamDetail,
  AttemptStartResponse,
  SubmitPayload,
  SubmitResponse,
  StartAttemptPayload,
  ExcelUploadResponse,
  ExcelConflictError,
} from '../lib/types';
import { ExcelValidationError } from '../lib/types';

// ── Parse API response to our frontend format ──
function parseApiExamDetail(apiExam: ApiExamDetail): ExamDetail {
  return {
    id: apiExam.id,
    code: apiExam.code,
    title: apiExam.title,
    description: apiExam.description,
    durationMins: apiExam.durationMins,
    totalQuestions: apiExam.totalQuestions,
    questions: apiExam.questions.map((q) => ({
      id: q.id,
      index: q.order - 1, // Convert 1-based to 0-based
      text: q.text,
      options: [
        { id: 'A', label: 'A', text: q.optionA },
        { id: 'B', label: 'B', text: q.optionB },
        { id: 'C', label: 'C', text: q.optionC },
        { id: 'D', label: 'D', text: q.optionD },
      ],
    })),
  };
}


const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

// ── Full submit endpoint URL (used by sendBeacon for tab-close submission) ──
export const SUBMIT_URL = `${BASE_URL}/attempt/submit`;

// ── Fetch all available exams for the listing page ──
export function fetchExams(): Promise<ExamMeta[]> {
  return apiFetch<ExamMeta[]>('/exam');
}

// ── Fetch exam metadata by its unique code ──
export function fetchExamMetaByCode(code: string): Promise<ExamMeta> {
  return apiFetch<ExamMeta>(`/exam/${code}/meta`);
}

export function fetchExamByCode(code: string): Promise<ExamMeta> {
  return apiFetch<ExamMeta>(`/exam/${code}`);
}

// ── Fetch exam with questions by its unique code ──
export async function getExamByCode(code: string): Promise<ExamDetail> {
  const apiExam = await apiFetch<ApiExamDetail>(`/exam/${code}`);
  return parseApiExamDetail(apiExam);
}

// ── Start an exam attempt, returns attemptId + questions + deadline ──
export function startAttempt(payload: StartAttemptPayload): Promise<AttemptStartResponse> {
  return apiFetch<AttemptStartResponse>('/attempt/start', {
    method: 'POST',
    body: payload,
  });
}

// ── Submit all answers for a given attempt ──
export function submitAttempt(payload: SubmitPayload): Promise<SubmitResponse> {
  return apiFetch<SubmitResponse>('/attempt/submit', {
    method: 'POST',
    body: payload,
  });
}

// ── Upload Excel file for exam data import ──
export async function uploadExcelFile(file: File, conflictStrategy: 'error' | 'skip' | 'update' = 'error'): Promise<ExcelUploadResponse> {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
  
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${BASE_URL}/upload/excel?conflictStrategy=${conflictStrategy}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    
    // Handle specific conflict errors
    if (errorBody?.type === 'DATABASE_CONFLICTS' || errorBody?.type === 'ALL_DUPLICATES') {
      const conflictError: ExcelConflictError = {
        message: errorBody.message,
        type: errorBody.type,
        conflicts: errorBody.conflicts || [],
        suggestion: errorBody.suggestion
      };
      throw new ExcelValidationError(conflictError.message, [conflictError.type, ...conflictError.conflicts.map((c: {code: string, title: string}) => c.code)]);
    }
    
    throw new ExcelValidationError(
      errorBody?.message || 'Upload failed',
      errorBody?.errors || ['Unknown error occurred']
    );
  }

  return response.json() as Promise<ExcelUploadResponse>;
}
