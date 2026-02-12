'use client';

import { Button, Group } from '@mantine/core';
import { useExamStore } from '@/store/useExamStore';

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
    <Group justify="space-between" mt="md">
      <Group gap="xs">
        <Button variant="default" onClick={prev} disabled={isFirst}>
          Previous
        </Button>
        <Button variant="default" onClick={next} disabled={isLast}>
          Next
        </Button>
      </Group>

      <Group gap="xs">
        {hasAnswer && (
          <Button
            variant="subtle"
            color="gray"
            onClick={() => clearAnswer(question.id)}
          >
            Clear
          </Button>
        )}
        <Button
          variant={isMarked ? 'filled' : 'light'}
          color="violet"
          onClick={() => toggleMark(question.id)}
        >
          {isMarked ? 'Unmark' : 'Mark for Review'}
        </Button>
        <Button color="red" variant="outline" onClick={onEndTest}>
          End Test
        </Button>
      </Group>
    </Group>
  );
}
