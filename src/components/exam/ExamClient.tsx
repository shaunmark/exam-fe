'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Grid,
  Card,
  Modal,
  Button,
  Text,
  Stack,
  Group,
  Drawer,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useExamStore } from '@/store/useExamStore';
import {
  persistToSession,
  restoreFromSession,
  clearSession,
} from '@/store/useExamStore';
import { submitAttempt, SUBMIT_URL } from '@/lib/exam-api';
import type { AnswerPayload, SubmitPayload } from '@/lib/types';
import { Header } from './Header';
import { QuestionCard } from './QuestionCard';
import { Controls } from './Controls';
import { PalettePanel } from './PalettePanel';

// ── Utility: compute seconds left from an ISO deadline string ──
function getRemainingSeconds(endsAt: string | null): number {
  if (!endsAt) return 0;
  return Math.max(0, Math.floor((new Date(endsAt).getTime() - Date.now()) / 1000));
}

// ── Main exam-taking orchestrator: timer, submit, layout, persistence ──
export function ExamClient() {
  const router = useRouter();
  const { other } = useMantineTheme();

  // ── Zustand store bindings ──
  const store = useExamStore();
  const {
    attemptId,
    endsAt,
    questions,
    answers,
    markedForReview,
    submitted,
    markSubmitted,
    hydrate,
    reset,
  } = store;

  // ── Local UI state ──
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingSeconds(endsAt),
  );
  const [timerReady, setTimerReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const submittedRef = useRef(false); // prevents double-submit across renders

  // ── Restore from sessionStorage on mount ──
  useEffect(() => {
    if (!attemptId) {
      const saved = restoreFromSession();
      if (saved && saved.attemptId && !saved.submitted) {
        hydrate(saved);
      } else {
        router.replace('/');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Persist to sessionStorage on every state change ──
  useEffect(() => {
    if (!attemptId) return;
    const unsub = useExamStore.subscribe((state) => {
      persistToSession({
        attemptId: state.attemptId,
        endsAt: state.endsAt,
        questions: state.questions,
        currentIndex: state.currentIndex,
        answers: state.answers,
        markedForReview: state.markedForReview,
        visitedQuestions: state.visitedQuestions,
        submitted: state.submitted,
      });
    });
    return unsub;
  }, [attemptId]);

  // ── Timer: derive remaining time from endsAt every second ──
  useEffect(() => {
    if (!endsAt) return;

    const tick = () => {
      const secs = getRemainingSeconds(endsAt);
      setRemainingSeconds(secs);
      if (secs <= 0) {
        clearInterval(intervalId);
      }
    };

    tick();
    setTimerReady(true);
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, [endsAt]);

  // ── Submit handler ──
  const handleSubmit = useCallback(async () => {
    if (submittedRef.current || !attemptId) return;
    submittedRef.current = true;
    setSubmitting(true);
    setSubmitError(null);

    const payload: AnswerPayload[] = questions.map((q) => ({
      questionId: q.id,
      selectedOption: answers[q.id] ?? '',
      isMarkedForReview: markedForReview.includes(q.id),
    }));

    try {
      await submitAttempt({ attemptId, answers: payload });
      markSubmitted();
      clearSession();
      reset();
      router.replace(`/exam/result/${attemptId}`);
    } catch {
      submittedRef.current = false;
      setSubmitError('Failed to submit. Please try again.');
      setSubmitting(false);
    }
  }, [attemptId, questions, answers, markedForReview, markSubmitted, reset, router]);

  // ── Auto-submit on timer expiry (only after timer has initialized) ──
  useEffect(() => {
    if (!timerReady) return;
    if (remainingSeconds <= 0 && attemptId && !submitted && !submittedRef.current) {
      handleSubmit();
    }
  }, [timerReady, remainingSeconds, attemptId, submitted, handleSubmit]);

  // ── Option 1: Warn user before closing/navigating away during active exam ──
  useEffect(() => {
    if (!attemptId || submitted) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [attemptId, submitted]);

  // ── Option 2: Fire-and-forget beacon submit when tab is closed/hidden ──
  useEffect(() => {
    if (!attemptId || submitted) return;

    const beaconSubmit = () => {
      // Read latest state directly from Zustand (React state may be stale)
      const state = useExamStore.getState();
      if (!state.attemptId || state.submitted || submittedRef.current) return;

      const payload: SubmitPayload = {
        attemptId: state.attemptId,
        answers: state.questions.map((q) => ({
          questionId: q.id,
          selectedOption: state.answers[q.id] ?? '',
          isMarkedForReview: state.markedForReview.includes(q.id),
        })),
      };

      const blob = new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      });
      navigator.sendBeacon(SUBMIT_URL, blob);
    };

    // visibilitychange is more reliable on mobile than beforeunload
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        beaconSubmit();
      }
    };

    // beforeunload as fallback for desktop browsers
    const handleBeforeUnload = () => {
      beaconSubmit();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [attemptId, submitted]);

  // ── Guard: no exam loaded ──
  if (!attemptId || questions.length === 0) {
    return null;
  }

  const answeredCount = Object.keys(answers).length;

  // ── Shared palette widget (used in sidebar and mobile drawer) ──
  const paletteContent = <PalettePanel />;

  return (
    <Stack
      gap={0}
      style={{
        minHeight: '100vh',
        background: 'var(--mantine-color-body)',
      }}
    >
      {/* ── Sticky header: timer + progress ── */}
      <Header remainingSeconds={remainingSeconds} />

      {/* ── Main content: question + controls (left) and palette (right) ── */}
      <Grid gutter="lg" p="lg" style={{ flex: 1 }}>
        <Grid.Col span={{ base: 12, md: 9 }}>
          <Stack gap="sm">
            <QuestionCard />
            <Controls onEndTest={openModal} />
          </Stack>
        </Grid.Col>

        {/* ── Desktop: palette sidebar ── */}
        {!isMobile && (
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Card
              shadow="sm"
              padding="md"
              radius="md"
              withBorder
              style={{ position: 'sticky', top: 60 }}
            >
              {paletteContent}
            </Card>
          </Grid.Col>
        )}
      </Grid>

      {/* ── Mobile: palette in a bottom drawer ── */}
      {isMobile && (
        <>
          <Button
            variant="filled"
            size="compact-sm"
            radius="xl"
            onClick={openDrawer}
            style={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              zIndex: 50,
              boxShadow: 'var(--mantine-shadow-md)',
            }}
          >
            Palette
          </Button>
          <Drawer
            opened={drawerOpened}
            onClose={closeDrawer}
            position="bottom"
            size="60%"
            title="Question Palette"
            radius="md"
          >
            {paletteContent}
          </Drawer>
        </>
      )}

      {/* ── End Test confirmation modal ── */}
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title="Submit Exam"
        centered
        radius="md"
      >
        <Stack gap="md">
          <Text size="sm">
            You have answered <strong>{answeredCount}</strong> out of{' '}
            <strong>{questions.length}</strong> questions.
          </Text>
          {questions.length - answeredCount > 0 && (
            <Text c={other.semantic.warning} size="sm" fw={500}>
              {questions.length - answeredCount} question(s) unanswered.
            </Text>
          )}
          {submitError && (
            <Text c="red" size="sm">
              {submitError}
            </Text>
          )}
          <Group justify="flex-end" gap="xs">
            <Button
              variant="default"
              size="sm"
              onClick={closeModal}
              disabled={submitting}
            >
              Go Back
            </Button>
            <Button
              color={other.semantic.danger}
              size="sm"
              onClick={handleSubmit}
              loading={submitting}
            >
              Confirm Submit
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
