import { createTheme } from '@mantine/core';
import type { QuestionStatus } from '@/store/useExamStore';

// ── Centralized theme configuration ──
// Change values here to update colors and styles across the entire application.
// All values are Mantine color keys (e.g. 'blue', 'red', 'teal').

// ── Semantic color names for non-primary colors ──
export const semantic = {
  danger: 'red',
  success: 'green',
  warning: 'orange',
  accent: 'teal',
  mark: 'violet',
  muted: 'gray',
} as const;

// ── Gradient presets ──
export const gradients = {
  primary: { from: 'blue', to: 'cyan' },
  success: { from: 'teal', to: 'green' },
} as const;

// ── Question palette: status → color mapping ──
export const paletteColors: Record<QuestionStatus, string> = {
  'not-visited': semantic.muted,
  'not-answered': semantic.danger,
  answered: semantic.success,
  marked: semantic.mark,
  'answered-marked': semantic.accent,
};

// ── Question palette: status → label mapping ──
export const paletteLabels: Record<QuestionStatus, string> = {
  'not-visited': 'Not Visited',
  'not-answered': 'Not Answered',
  answered: 'Answered',
  marked: 'Marked',
  'answered-marked': 'Ans + Marked',
};

// ── Mantine theme override — passed to MantineProvider ──
export const theme = createTheme({
  // Components without an explicit color prop default to this
  primaryColor: 'blue',

  // Buttons with variant="gradient" auto-use this (no gradient prop needed)
  defaultGradient: gradients.primary,

  // Shade index used for primary color in light vs dark mode
  primaryShade: { light: 6, dark: 7 },

  // Global default border-radius for components
  defaultRadius: 'md',

  // App-specific values accessible via useMantineTheme().other
  // or imported directly in server components
  other: {
    semantic,
    gradients,
    paletteColors,
    paletteLabels,
  },
});
