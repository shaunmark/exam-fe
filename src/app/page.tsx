import { Button, Container, Title, Text, Stack } from "@mantine/core";

export default function Home() {
  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Title order={1}>Mantine UI Setup Complete!</Title>
        <Text>
          Your Next.js project is now configured with Mantine UI. You can start using Mantine components immediately.
        </Text>
        <Button variant="filled" size="md">
          Get Started
        </Button>
      </Stack>
    </Container>
  );
}
