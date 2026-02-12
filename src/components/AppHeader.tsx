'use client';

import Link from 'next/link';
import {
  Group,
  Text,
  Anchor,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from '@mantine/core';

// ── Common header with nav links and color scheme toggle ──
export function AppHeader() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header
      style={{
        borderBottom: '1px solid var(--mantine-color-default-border)',
        background: 'var(--mantine-color-body)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Group justify="space-between" px="lg" py="sm">
        <Group gap="xl">
          <Anchor component={Link} href="/" underline="never">
            <Text fw={700} size="md" variant="gradient">
              Exam Platform
            </Text>
          </Anchor>

          <Anchor
            component={Link}
            href="/exams"
            size="sm"
            fw={500}
            c="dimmed"
            underline="never"
            style={{ letterSpacing: 0.3 }}
          >
            Exams
          </Anchor>
        </Group>

        <ActionIcon
          onClick={toggleColorScheme}
          variant="default"
          size="lg"
          radius="xl"
          aria-label="Toggle color scheme"
        >
          {computedColorScheme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19'}
        </ActionIcon>
      </Group>
    </header>
  );
}
