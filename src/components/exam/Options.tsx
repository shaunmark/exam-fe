'use client';

import { Radio, Stack } from '@mantine/core';
import type { ExamOption } from '@/lib/types';

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
      <Stack gap="sm">
        {options.map((opt) => (
          <Radio
            key={opt.id}
            value={opt.id}
            label={`${opt.label}. ${opt.text}`}
            styles={{
              radio: { cursor: 'pointer' },
              label: { cursor: 'pointer' },
            }}
          />
        ))}
      </Stack>
    </Radio.Group>
  );
}
