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
  useMantineTheme,
} from '@mantine/core';
import { startAttempt, getExamByCode } from '@/services/exam-api';
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
  const { primaryColor, other } = useMantineTheme();
  const initialize = useExamStore((s) => s.initialize);
  const [loading, setLoading] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  const handleStart = async () => {
    if (!exam) return;
    setLoading(true);
    setStartError(null);

    try {
      // First start the attempt
      const startResult = await startAttempt({ examCode: exam.code, userId: 'test-user' });
      
      // Then fetch the exam with questions
      const examDetail = await getExamByCode(exam.code);
      
      initialize({
        attemptId: startResult.attemptId,
        endsAt: startResult.endsAt,
        questions: examDetail.questions,
      });
      router.push(`/exam/${code}/take`);
    } catch {
      setStartError(EXAM_LANDING.ERROR_START_FAILED);
      setLoading(false);
    }
  };

  if (error || !exam) {
    return (
      <Container size="sm" py={80}>
        <Alert color={other.semantic.danger} title="Error" radius="md">
          {error ?? EXAM_LANDING.ERROR_NOT_FOUND}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="sm" py={80}>
      <Stack gap="xl" align="center">
        <Stack align="center" gap="xs">
          <Badge variant="light" size="lg" radius="sm">
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
                <Text size="xl" fw={700} c={primaryColor}>
                  {exam.totalQuestions}
                </Text>
                <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                  {EXAM_LANDING.STAT_QUESTIONS}
                </Text>
              </Stack>
              <Divider orientation="vertical" />
              <Stack align="center" gap={2}>
                <Text size="xl" fw={700} c={other.semantic.warning}>
                  {exam.durationMins}
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
              <Alert color={other.semantic.danger} title="Error" radius="md">
                {startError}
              </Alert>
            )}

            <Button
              size="lg"
              onClick={handleStart}
              loading={loading}
              fullWidth
              variant="gradient"
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
