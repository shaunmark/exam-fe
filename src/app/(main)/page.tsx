import {
  Container,
  Title,
  Text,
  Stack,
  Button,
  ThemeIcon,
} from "@mantine/core";
import Link from "next/link";
import { HOME } from "@/lib/constants";

export default function Home() {
  return (
    <Container size="sm" py={120}>
      <Stack align="center" gap="xl">
        <ThemeIcon size={64} radius="xl" variant="gradient">
          <Text size="xl" fw={700} c="white">{HOME.TITLE[0]}</Text>
        </ThemeIcon>

        <Stack align="center" gap="xs">
          <Title order={1} ta="center">
            {HOME.TITLE}
          </Title>
          <Text c="dimmed" ta="center" maw={420} size="lg">
            {HOME.TAGLINE}
          </Text>
        </Stack>

        <Button
          component={Link}
          href="/exam"
          size="lg"
          variant="gradient"
        >
          {HOME.CTA}
        </Button>
      </Stack>
    </Container>
  );
}
