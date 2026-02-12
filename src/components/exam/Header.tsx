'use client';

import { Group, Text, Badge, Progress } from '@mantine/core';
import { useExamStore } from '@/store/useExamStore';

interface HeaderProps {
  remainingSeconds: number;
}

// ── Sticky exam header: shows answer count, progress bar, and countdown timer ──
export function Header({ remainingSeconds }: HeaderProps) {
  const questions = useExamStore((s) => s.questions);
  const answers = useExamStore((s) => s.answers);

  // ── Derived values ──
  const total = questions.length;
  const answered = Object.keys(answers).length;
  const progressPct = total > 0 ? (answered / total) * 100 : 0;

  // ── Format time as MM:SS, turns red when <= 60s ──
  const mins = Math.max(0, Math.floor(remainingSeconds / 60));
  const secs = Math.max(0, remainingSeconds % 60);
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const isUrgent = remainingSeconds <= 60;

  return (
    <Group
      justify="space-between"
      align="center"
      px="md"
      py="sm"
      style={{
        borderBottom: '1px solid var(--mantine-color-gray-3)',
        background: 'var(--mantine-color-body)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Group gap="sm">
        <Text fw={600} size="sm">
          Exam
        </Text>
        <Badge variant="light" size="sm">
          {answered}/{total} answered
        </Badge>
      </Group>

      <Progress
        value={progressPct}
        size="sm"
        style={{ flex: 1, maxWidth: 200 }}
      />

      <Badge
        color={isUrgent ? 'red' : 'blue'}
        variant="filled"
        size="lg"
      >
        {timeStr}
      </Badge>
    </Group>
  );
}
