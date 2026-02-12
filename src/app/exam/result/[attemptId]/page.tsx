import {
  Container,
  Card,
  Title,
  Text,
  Stack,
  Button,
  ThemeIcon,
  Divider,
  Code,
} from '@mantine/core';
import Link from 'next/link';
import { RESULT } from '@/lib/constants';

interface ResultPageProps {
  params: Promise<{ attemptId: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { attemptId } = await params;

  return (
    <Container size="sm" py={80}>
      <Stack align="center" gap="xl">
        <Stack align="center" gap="xs">
          <ThemeIcon
            size={64}
            radius="xl"
            variant="gradient"
            gradient={{ from: 'teal', to: 'green' }}
          >
            <Text size="xl" fw={700} c="white">
              ✓
            </Text>
          </ThemeIcon>
          <Title order={1} ta="center">
            {RESULT.TITLE}
          </Title>
          <Text c="dimmed" ta="center" maw={400} size="md">
            {RESULT.MESSAGE}
          </Text>
        </Stack>

        <Card w="100%" shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="md" align="center">
            <Text c="dimmed" ta="center" size="sm">
              {RESULT.SUBTITLE}
            </Text>

            <Divider w="100%" />

            <Stack gap={4} align="center">
              <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                Attempt ID
              </Text>
              <Code>{attemptId}</Code>
            </Stack>

            <Divider w="100%" />

            <Button
              component={Link}
              href="/"
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
              size="md"
              fullWidth
            >
              {RESULT.BACK_CTA}
            </Button>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
