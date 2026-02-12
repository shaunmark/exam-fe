import {
  Container,
  Stack,
  SimpleGrid,
  Card,
  Skeleton,
  Group,
} from '@mantine/core';

export default function ExamsLoading() {
  return (
    <Container size="lg" py={60}>
      <Stack gap="xl">
        <Stack gap="xs">
          <Skeleton height={36} width={250} />
          <Skeleton height={22} width={220} />
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <Stack gap="sm" style={{ flex: 1 }}>
                <Group justify="space-between" align="flex-start">
                  <Skeleton height={22} width="65%" />
                  <Skeleton height={18} width={60} radius="sm" />
                </Group>
                <Skeleton height={14} width="100%" />
                <Skeleton height={14} width="75%" />
                <Group gap="xs">
                  <Skeleton height={22} width={110} radius="xl" />
                  <Skeleton height={22} width={70} radius="xl" />
                </Group>
                <Skeleton height={36} width="100%" radius="md" mt="auto" />
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
