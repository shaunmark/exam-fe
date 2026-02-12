import { Container, Card, Title, Text, Stack, Button } from '@mantine/core';
import Link from 'next/link';

interface ResultPageProps {
  params: Promise<{ attemptId: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { attemptId } = await params;

  return (
    <Container size="sm" py="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md" align="center">
          <Title order={2}>Exam Submitted</Title>
          <Text c="dimmed" ta="center">
            Your exam has been submitted successfully.
          </Text>
          <Text size="sm" c="dimmed">
            Attempt ID: {attemptId}
          </Text>
          <Button component={Link} href="/" variant="light">
            Back to Home
          </Button>
        </Stack>
      </Card>
    </Container>
  );
}
