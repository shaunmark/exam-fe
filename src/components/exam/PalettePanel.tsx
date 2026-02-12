'use client';

import {
  SimpleGrid,
  Button,
  Stack,
  Text,
  Group,
  Divider,
} from '@mantine/core';
import { useExamStore, getQuestionStatus } from '@/store/useExamStore';
import type { QuestionStatus } from '@/store/useExamStore';
import { PALETTE_COLORS, PALETTE_LABELS, PALETTE_CURRENT_SHADOW } from '@/lib/theme';

// ── Question navigation grid with color-coded status indicators ──
export function PalettePanel() {
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
              color={PALETTE_COLORS[status]}
              variant={isCurrent ? 'filled' : 'light'}
              onClick={() => goToQuestion(i)}
              radius="sm"
              style={{
                fontWeight: isCurrent ? 700 : 500,
                ...(isCurrent && {
                  boxShadow: `0 0 0 2px var(--mantine-color-${PALETTE_CURRENT_SHADOW}-5)`,
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
        {(Object.keys(PALETTE_COLORS) as QuestionStatus[]).map((status) => (
          <Group key={status} gap="xs" wrap="nowrap">
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: `var(--mantine-color-${PALETTE_COLORS[status]}-5)`,
                flexShrink: 0,
              }}
            />
            <Text size="xs" c="dimmed">
              {PALETTE_LABELS[status]}
            </Text>
          </Group>
        ))}
      </Stack>
    </Stack>
  );
}
