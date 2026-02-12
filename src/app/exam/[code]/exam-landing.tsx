'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Card,
  Title,
  Text,
  Button,
  Stack,
  Group,
  Badge,
  Alert,
} from '@mantine/core';
import { startAttempt } from '@/lib/exam-api';
import { useExamStore } from '@/store/useExamStore';
import type { ExamMeta } from '@/lib/types';

interface ExamLandingProps {
  code: string;
  exam: ExamMeta | null;
  error: string | null;
}

export function ExamLanding({ code, exam, error }: ExamLandingProps) {
  const router = useRouter();
  const initialize = useExamStore((s) => s.initialize);
  const [loading, setLoading] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  const handleStart = async () => {
    if (!exam) return;
    setLoading(true);
    setStartError(null);

    try {
      const result = await startAttempt(exam.id);
      initialize({
        attemptId: result.attemptId,
        endsAt: result.endsAt,
        questions: result.questions,
      });
      router.push(`/exam/${code}/take`);
    } catch {
      setStartError('Failed to start the exam. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error || !exam) {
    return (
      <Container size="sm" py="xl">
        <Alert color="red" title="Error">
          {error ?? 'Exam not found.'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="sm" py="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Title order={2}>{exam.title}</Title>
          <Text c="dimmed">{exam.description}</Text>

          <Group gap="sm">
            <Badge variant="light" color="blue">
              {exam.totalQuestions} Questions
            </Badge>
            <Badge variant="light" color="teal">
              {exam.durationMinutes} Minutes
            </Badge>
          </Group>

          {startError && (
            <Alert color="red" title="Error">
              {startError}
            </Alert>
          )}

          <Button
            size="lg"
            onClick={handleStart}
            loading={loading}
            fullWidth
          >
            Start Exam
          </Button>
        </Stack>
      </Card>
    </Container>
  );
}
