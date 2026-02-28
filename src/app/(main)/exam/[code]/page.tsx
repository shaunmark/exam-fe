import { fetchExamMetaByCode } from '@/services/exam-api';
import { EXAM_LANDING } from '@/lib/constants';
import { ExamLanding } from './exam-landing';

interface ExamPageProps {
  params: Promise<{ code: string }>;
}

export default async function ExamPage({ params }: ExamPageProps) {
  const { code } = await params;

  let exam;
  let error: string | null = null;

  try {
    exam = await fetchExamMetaByCode(code);
  } catch {
    error = EXAM_LANDING.ERROR_LOAD_FAILED;
  }

  if (error || !exam) {
    return <ExamLanding code={code} error={error} exam={null} />;
  }

  return <ExamLanding code={code} error={null} exam={exam} />;
}
