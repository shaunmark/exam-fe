'use client';

import {
  SimpleGrid,
  Button,
  Stack,
  Text,
  Group,
  Divider,
  useMantineTheme,
} from '@mantine/core';
import { useExamStore, getQuestionStatus } from '@/store/useExamStore';
import type { QuestionStatus } from '@/store/useExamStore';

// ── Question navigation grid with color-coded status indicators ──
export function PalettePanel() {
  const { primaryColor, other } = useMantineTheme();

  // ── Store bindings ──
  const questions = useExamStore((s) => s.questions);
  const currentIndex = useExamStore((s) => s.currentIndex);
  const answers = useExamStore((s) => s.answers);
  const markedForReview = useExamStore((s) => s.markedForReview);
  const visitedQuestions = useExamStore((s) => s.visitedQuestions);
  const goToQuestion = useExamStore((s) => s.goToQuestion);

  return (
    <Stack gap="sm">
      <Text fw={700} size="sm">
        Questions
      </Text>

      <SimpleGrid cols={5} spacing={6}>
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
              color={other.paletteColors[status]}
              variant={isCurrent ? 'filled' : 'light'}
              onClick={() => goToQuestion(i)}
              radius="sm"
              style={{
                fontWeight: isCurrent ? 700 : 500,
                ...(isCurrent && {
                  boxShadow: `0 0 0 2px var(--mantine-color-${primaryColor}-5)`,
                }),
              }}
            >
              {i + 1}
            </Button>
          );
        })}
      </SimpleGrid>

      <Divider />

      <Stack gap={6}>
        {(Object.keys(other.paletteColors) as QuestionStatus[]).map((status) => (
          <Group key={status} gap="xs" wrap="nowrap">
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: `var(--mantine-color-${other.paletteColors[status]}-5)`,
                flexShrink: 0,
              }}
            />
            <Text size="xs" c="dimmed">
              {other.paletteLabels[status]}
            </Text>
          </Group>
        ))}
      </Stack>
    </Stack>
  );
}
