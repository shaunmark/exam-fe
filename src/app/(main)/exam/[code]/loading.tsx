import {
  Container,
  Stack,
  Card,
  Skeleton,
  Group,
  Divider,
} from '@mantine/core';

export default function ExamLandingLoading() {
  return (
    <Container size="sm" py={80}>
      <Stack gap="xl" align="center">
        <Stack align="center" gap="xs">
          <Skeleton height={26} width={160} radius="sm" />
          <Skeleton height={40} width="55%" />
          <Skeleton height={18} width={340} />
        </Stack>

        <Card w="100%" shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="lg">
            <Group justify="center" gap="lg">
              <Stack align="center" gap={2}>
                <Skeleton height={28} width={30} />
                <Skeleton height={10} width={64} />
              </Stack>
              <Divider orientation="vertical" />
              <Stack align="center" gap={2}>
                <Skeleton height={28} width={30} />
                <Skeleton height={10} width={50} />
              </Stack>
            </Group>

            <Divider />

            <Stack gap="xs">
              <Skeleton height={14} width={90} />
              <Skeleton height={14} width="95%" />
              <Skeleton height={14} width="90%" />
              <Skeleton height={14} width="92%" />
              <Skeleton height={14} width="75%" />
            </Stack>

            <Divider />

            <Skeleton height={50} width="100%" radius="md" />
            <Skeleton height={12} width={220} mx="auto" />
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
