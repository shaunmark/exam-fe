'use client';

import { SimpleGrid, Button, Stack, Text, Group, Badge } from '@mantine/core';
import { useExamStore, getQuestionStatus } from '@/store/useExamStore';
import type { QuestionStatus } from '@/store/useExamStore';

const STATUS_COLORS: Record<QuestionStatus, string> = {
  'not-visited': 'gray',
  'not-answered': 'red',
  answered: 'green',
  marked: 'violet',
  'answered-marked': 'teal',
};

const STATUS_LABELS: Record<QuestionStatus, string> = {
  'not-visited': 'Not Visited',
  'not-answered': 'Not Answered',
  answered: 'Answered',
  marked: 'Marked',
  'answered-marked': 'Answered & Marked',
};

export function PalettePanel() {
  const questions = useExamStore((s) => s.questions);
  const currentIndex = useExamStore((s) => s.currentIndex);
  const answers = useExamStore((s) => s.answers);
  const markedForReview = useExamStore((s) => s.markedForReview);
  const visitedQuestions = useExamStore((s) => s.visitedQuestions);
  const goToQuestion = useExamStore((s) => s.goToQuestion);

  return (
    <Stack gap="md">
      <Text fw={600} size="sm">
        Question Palette
      </Text>

      <SimpleGrid cols={5} spacing="xs">
        {questions.map((q, i) => {
          const status = getQuestionStatus(
            q.id,
            answers,
            markedForReview,
            visitedQuestions,
          );
          const isCurrent = i === currentIndex;

          return (
            <Button
              key={q.id}
              size="compact-sm"
              color={STATUS_COLORS[status]}
              variant={isCurrent ? 'filled' : 'light'}
              onClick={() => goToQuestion(i)}
              style={
                isCurrent
                  ? { outline: '2px solid var(--mantine-color-blue-5)' }
                  : undefined
              }
            >
              {i + 1}
            </Button>
          );
        })}
      </SimpleGrid>

      <Stack gap={4}>
        <Text fw={500} size="xs" c="dimmed">
          Legend
        </Text>
        <Group gap="xs" wrap="wrap">
          {(Object.keys(STATUS_COLORS) as QuestionStatus[]).map((status) => (
            <Badge
              key={status}
              color={STATUS_COLORS[status]}
              variant="light"
              size="xs"
            >
              {STATUS_LABELS[status]}
            </Badge>
          ))}
        </Group>
      </Stack>
    </Stack>
  );
}
