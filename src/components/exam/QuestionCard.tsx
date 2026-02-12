'use client';

import { Card, Text, Badge, Group } from '@mantine/core';
import { useExamStore } from '@/store/useExamStore';
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

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">
          Question {currentIndex + 1} of {questions.length}
        </Text>
        {isMarked && (
          <Badge color="violet" variant="light">
            Marked for Review
          </Badge>
        )}
      </Group>

      <Text mb="lg">{question.text}</Text>

      <Options
        options={question.options}
        selectedOptionId={answers[question.id]}
        onSelect={(optionId) => selectAnswer(question.id, optionId)}
      />
    </Card>
  );
}
