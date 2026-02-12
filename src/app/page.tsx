import { Container, Title, Stack } from "@mantine/core";

export default function Home() {
  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Title order={1}>Home Page</Title>
      </Stack>
    </Container>
  );
}
