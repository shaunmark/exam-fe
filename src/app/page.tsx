import {
  Container,
  Title,
  Text,
  Stack,
  Button,
  Card,
  Group,
  Badge,
  ThemeIcon,
} from "@mantine/core";
import Link from "next/link";
import { HOME } from "@/lib/constants";
import { semantic } from "@/lib/theme";

export default function Home() {
  return (
    <Container size="sm" py={80}>
      <Stack align="center" gap="xl">
        <Stack align="center" gap="xs">
          <ThemeIcon size={64} radius="xl" variant="gradient">
            <Text size="xl" fw={700} c="white">{HOME.TITLE[0]}</Text>
          </ThemeIcon>
          <Title order={1} ta="center">
            {HOME.TITLE}
          </Title>
          <Text c="dimmed" ta="center" maw={420} size="lg">
            {HOME.TAGLINE}
          </Text>
        </Stack>

        <Card w="100%" shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between" align="flex-start">
              <Stack gap={4}>
                <Text fw={600} size="lg">{HOME.DEMO_CARD_TITLE}</Text>
                <Text c="dimmed" size="sm">
                  {HOME.DEMO_CARD_DESCRIPTION}
                </Text>
              </Stack>
              <Badge variant="light" color={semantic.accent} size="lg">
                {HOME.DEMO_CARD_BADGE}
              </Badge>
            </Group>

            <Group gap="xs">
              <Badge variant="dot">{HOME.DEMO_CARD_QUESTIONS}</Badge>
              <Badge variant="dot" color={semantic.warning}>{HOME.DEMO_CARD_DURATION}</Badge>
            </Group>

            <Button
              component={Link}
              href="/exam/DEMO2025"
              size="md"
              variant="gradient"
              fullWidth
            >
              {HOME.DEMO_CTA}
            </Button>
          </Stack>
        </Card>

        <Text c="dimmed" size="xs" ta="center">
          {HOME.FOOTER}
        </Text>
      </Stack>
    </Container>
  );
}
