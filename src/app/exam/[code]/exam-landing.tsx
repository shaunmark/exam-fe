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
  Divider,
  List,
} from '@mantine/core';
import { startAttempt } from '@/lib/exam-api';
import { useExamStore } from '@/store/useExamStore';
import type { ExamMeta } from '@/lib/types';
import { EXAM_LANDING } from '@/lib/constants';

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
      setStartError(EXAM_LANDING.ERROR_START_FAILED);
    } finally {
      setLoading(false);
    }
  };

  if (error || !exam) {
    return (
      <Container size="sm" py={80}>
        <Alert color="red" title="Error" radius="md">
          {error ?? EXAM_LANDING.ERROR_NOT_FOUND}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="sm" py={80}>
      <Stack gap="xl" align="center">
        <Stack align="center" gap="xs">
          <Badge variant="light" color="blue" size="lg" radius="sm">
            Exam Code: {exam.code}
          </Badge>
          <Title order={1} ta="center">
            {exam.title}
          </Title>
          <Text c="dimmed" ta="center" maw={440} size="md">
            {exam.description}
          </Text>
        </Stack>

        <Card w="100%" shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="lg">
            <Group justify="center" gap="lg">
              <Stack align="center" gap={2}>
                <Text size="xl" fw={700} c="blue">
                  {exam.totalQuestions}
                </Text>
                <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                  {EXAM_LANDING.STAT_QUESTIONS}
                </Text>
              </Stack>
              <Divider orientation="vertical" />
              <Stack align="center" gap={2}>
                <Text size="xl" fw={700} c="orange">
                  {exam.durationMinutes}
                </Text>
                <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                  {EXAM_LANDING.STAT_MINUTES}
                </Text>
              </Stack>
            </Group>

            <Divider />

            <Stack gap="xs">
              <Text fw={600} size="sm">
                {EXAM_LANDING.INSTRUCTIONS_TITLE}
              </Text>
              <List spacing="xs" size="sm" c="dimmed">
                {EXAM_LANDING.INSTRUCTIONS.map((text, i) => (
                  <List.Item key={i}>{text}</List.Item>
                ))}
              </List>
            </Stack>

            <Divider />

            {startError && (
              <Alert color="red" title="Error" radius="md">
                {startError}
              </Alert>
            )}

            <Button
              size="lg"
              onClick={handleStart}
              loading={loading}
              fullWidth
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
            >
              {EXAM_LANDING.START_CTA}
            </Button>

            <Text size="xs" c="dimmed" ta="center">
              {EXAM_LANDING.TIMER_WARNING}
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
