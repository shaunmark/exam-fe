import {
  Container,
  Title,
  Text,
  Stack,
  SimpleGrid,
  Card,
  Group,
  Badge,
  Button,
  Alert,
} from '@mantine/core';
import Link from 'next/link';
import { fetchExams } from '@/services/exam-api';
import { EXAM_LIST } from '@/lib/constants';
import { semantic } from '@/lib/theme';

export default async function ExamsPage() {
  let exams;
  let error: string | null = null;

  try {
    exams = await fetchExams();
  } catch {
    error = EXAM_LIST.ERROR;
  }

  return (
    <Container size="lg" py={60}>
      <Stack gap="xl">
        <Stack gap="xs">
          <Title order={1}>{EXAM_LIST.TITLE}</Title>
          <Text c="dimmed" size="lg">
            {EXAM_LIST.SUBTITLE}
          </Text>
        </Stack>

        {error && (
          <Alert color={semantic.danger} title="Error" radius="md">
            {error}
          </Alert>
        )}

        {exams && exams.length === 0 && (
          <Text c="dimmed" ta="center" py="xl">
            {EXAM_LIST.EMPTY}
          </Text>
        )}

        {exams && exams.length > 0 && (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {exams.map((exam) => (
              <Card
                key={exam.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <Stack gap="sm" style={{ flex: 1 }}>
                  <Group justify="space-between" align="flex-start">
                    <Text fw={600} size="lg" style={{ flex: 1 }}>
                      {exam.title}
                    </Text>
                    <Badge variant="light" size="sm" radius="sm">
                      {exam.code}
                    </Badge>
                  </Group>

                  <Text c="dimmed" size="sm" lineClamp={2} style={{ flex: 1 }}>
                    {exam.description}
                  </Text>

                  <Group gap="xs">
                    <Badge variant="dot">
                      {exam.totalQuestions} {EXAM_LIST.CARD_QUESTIONS}
                    </Badge>
                    <Badge variant="dot" color={semantic.warning}>
                      {exam.durationMins} {EXAM_LIST.CARD_MINUTES}
                    </Badge>
                  </Group>

                  <Button
                    component={Link}
                    href={`/exam/${exam.code}`}
                    variant="light"
                    fullWidth
                    mt="auto"
                  >
                    {EXAM_LIST.CARD_CTA}
                  </Button>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
}
