'use client';

import { Card, Text, Badge, Group, Divider, Stack } from '@mantine/core';
import { useExamStore } from '@/store/useExamStore';
import { QUESTION_COLORS } from '@/lib/theme';
import { Options } from './Options';

// ── Displays the current question text, options, and marked-for-review badge ──
export function QuestionCard() {
  // ── Store bindings (individual selectors to minimize re-renders) ──
  const questions = useExamStore((s) => s.questions);
  const currentIndex = useExamStore((s) => s.currentIndex);
  const answers = useExamStore((s) => s.answers);
  const markedForReview = useExamStore((s) => s.markedForReview);
  const selectAnswer = useExamStore((s) => s.selectAnswer);

  const question = questions[currentIndex];
  if (!question) return null;

  // ── Derived: check if this question is flagged for review ──
  const isMarked = markedForReview.includes(question.id);
  const hasAnswer = question.id in answers;

  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Group gap="xs">
            <Badge
              variant="filled"
              color={QUESTION_COLORS.INDEX_BADGE}
              size="lg"
              radius="sm"
              style={{ minWidth: 40, textAlign: 'center' }}
            >
              {currentIndex + 1}
            </Badge>
            <Text size="sm" c="dimmed">
              of {questions.length}
            </Text>
          </Group>
          <Group gap="xs">
            {hasAnswer && (
              <Badge color={QUESTION_COLORS.ANSWERED_BADGE} variant="light" size="sm" radius="sm">
                Answered
              </Badge>
            )}
            {isMarked && (
              <Badge color={QUESTION_COLORS.MARKED_BADGE} variant="light" size="sm" radius="sm">
                Marked
              </Badge>
            )}
          </Group>
        </Group>

        <Divider />

        <Text size="md" fw={500} lh={1.6}>
          {question.text}
        </Text>

        <Options
          options={question.options}
          selectedOptionId={answers[question.id]}
          onSelect={(optionId) => selectAnswer(question.id, optionId)}
        />
      </Stack>
    </Card>
  );
}
