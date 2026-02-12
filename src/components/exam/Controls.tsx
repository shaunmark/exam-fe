'use client';

import { Button, Group, Card } from '@mantine/core';
import { useExamStore } from '@/store/useExamStore';
import { CONTROL_COLORS } from '@/lib/theme';

interface ControlsProps {
  onEndTest: () => void;
}

// ── Navigation and action buttons below the question card ──
export function Controls({ onEndTest }: ControlsProps) {
  // ── Store bindings ──
  const questions = useExamStore((s) => s.questions);
  const currentIndex = useExamStore((s) => s.currentIndex);
  const answers = useExamStore((s) => s.answers);
  const markedForReview = useExamStore((s) => s.markedForReview);
  const next = useExamStore((s) => s.next);
  const prev = useExamStore((s) => s.prev);
  const toggleMark = useExamStore((s) => s.toggleMark);
  const clearAnswer = useExamStore((s) => s.clearAnswer);

  const question = questions[currentIndex];
  if (!question) return null;

  // ── Derived flags for button states ──
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;
  const hasAnswer = question.id in answers;
  const isMarked = markedForReview.includes(question.id);

  return (
    <Card padding="md" radius="md" withBorder>
      <Group justify="space-between">
        {/* ── Navigation ── */}
        <Group gap="xs">
          <Button
            variant="default"
            size="sm"
            onClick={prev}
            disabled={isFirst}
          >
            Previous
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={next}
            disabled={isLast}
          >
            Next
          </Button>
        </Group>

        {/* ── Actions ── */}
        <Group gap="xs">
          {hasAnswer && (
            <Button
              variant="subtle"
              color={CONTROL_COLORS.CLEAR}
              size="sm"
              onClick={() => clearAnswer(question.id)}
            >
              Clear
            </Button>
          )}
          <Button
            variant={isMarked ? 'filled' : 'light'}
            color={CONTROL_COLORS.MARK}
            size="sm"
            onClick={() => toggleMark(question.id)}
          >
            {isMarked ? 'Unmark' : 'Mark'}
          </Button>
          <Button
            color={CONTROL_COLORS.END_TEST}
            variant="light"
            size="sm"
            onClick={onEndTest}
          >
            End Test
          </Button>
        </Group>
      </Group>
    </Card>
  );
}
