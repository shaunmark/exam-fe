import { fetchExamByCode } from '@/lib/exam-api';
import { ExamLanding } from './exam-landing';

interface ExamPageProps {
  params: Promise<{ code: string }>;
}

export default async function ExamPage({ params }: ExamPageProps) {
  const { code } = await params;

  let exam;
  let error: string | null = null;

  try {
    exam = await fetchExamByCode(code);
  } catch {
    error = 'Failed to load exam. Please check the exam code and try again.';
  }

  if (error || !exam) {
    return <ExamLanding code={code} error={error} exam={null} />;
  }

  return <ExamLanding code={code} error={null} exam={exam} />;
}
