'use client';

import { Radio, Stack, Card, Text, Group } from '@mantine/core';
import type { ExamOption } from '@/lib/types';
import { QUESTION_COLORS } from '@/lib/theme';

interface OptionsProps {
  options: ExamOption[];
  selectedOptionId: string | undefined;
  onSelect: (optionId: string) => void;
}

// ── Radio group for answer options — controlled by parent via props ──
export function Options({ options, selectedOptionId, onSelect }: OptionsProps) {
  return (
    <Radio.Group
      value={selectedOptionId ?? ''}
      onChange={(val) => onSelect(val)}
    >
      <Stack gap="xs">
        {options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <Card
              key={opt.id}
              padding="sm"
              radius="sm"
              withBorder
              style={{
                cursor: 'pointer',
                borderColor: isSelected
                  ? `var(--mantine-color-${QUESTION_COLORS.SELECTED_OPTION_BORDER}-5)`
                  : undefined,
                background: isSelected
                  ? `var(--mantine-color-${QUESTION_COLORS.SELECTED_OPTION_BG}-0)`
                  : undefined,
              }}
              onClick={() => onSelect(opt.id)}
            >
              <Group gap="sm" wrap="nowrap">
                <Radio
                  value={opt.id}
                  styles={{
                    radio: { cursor: 'pointer' },
                  }}
                />
                <Text size="sm">
                  <Text span fw={600} c="dimmed">
                    {opt.label}.
                  </Text>{' '}
                  {opt.text}
                </Text>
              </Group>
            </Card>
          );
        })}
      </Stack>
    </Radio.Group>
  );
}
