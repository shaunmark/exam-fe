import { Container, Loader, Stack } from '@mantine/core';

export default function Loading() {
  return (
    <Container size="sm" py="xl">
      <Stack align="center" gap="md">
        <Loader size="lg" />
      </Stack>
    </Container>
  );
}
