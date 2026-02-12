'use client';

import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';

// ── Temporary floating toggle button for light/dark mode ──
export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ActionIcon
      onClick={toggleColorScheme}
      variant="default"
      size="lg"
      radius="xl"
      aria-label="Toggle color scheme"
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      {computedColorScheme === 'dark' ? '☀️' : '🌙'}
    </ActionIcon>
  );
}
