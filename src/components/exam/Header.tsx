'use client';

import { Group, Text, Badge, Progress, Stack, useMantineTheme } from '@mantine/core';
import { useExamStore } from '@/store/useExamStore';

interface HeaderProps {
  remainingSeconds: number;
}

// ── Sticky exam header: shows answer count, progress bar, and countdown timer ──
export function Header({ remainingSeconds }: HeaderProps) {
  const { primaryColor, other } = useMantineTheme();
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
    <Stack gap={0}>
      <Group
        justify="space-between"
        align="center"
        px="lg"
        py="sm"
        style={{
          background: 'var(--mantine-color-body)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Group gap="md">
          <Text fw={700} size="md" c={primaryColor}>
            Exam
          </Text>
          <Badge variant="light" color={other.semantic.muted} size="sm" radius="sm">
            {answered} of {total} answered
          </Badge>
        </Group>

        <Group gap="md">
          <Progress
            value={progressPct}
            size="sm"
            color={progressPct === 100 ? other.semantic.success : undefined}
            radius="xl"
            style={{ width: 120 }}
          />
          <Badge
            color={isUrgent ? other.semantic.danger : undefined}
            variant={isUrgent ? 'filled' : 'light'}
            size="lg"
            radius="sm"
            style={{
              fontVariantNumeric: 'tabular-nums',
              minWidth: 72,
              textAlign: 'center',
            }}
          >
            {timeStr}
          </Badge>
        </Group>
      </Group>
      <div
        style={{
          height: 2,
          background: `linear-gradient(90deg, var(--mantine-color-${primaryColor}-5) ${progressPct}%, var(--mantine-color-${other.semantic.muted}-2) ${progressPct}%)`,
        }}
      />
    </Stack>
  );
}
