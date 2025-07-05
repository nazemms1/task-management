import {
  Card,
  Text,
  Group,
  Badge,
  Progress,
  SimpleGrid,
  Stack,
  Box,
  ThemeIcon,
} from "@mantine/core";
import { IconFileText, IconChartLine } from "@tabler/icons-react";
import { COLORS, SPACING } from "../../constants";
import type { StatCardData, TaskStats, AdditionalStatData } from "../../types";

interface StatCardProps {
  stat: StatCardData;
  isLarge?: boolean;
}

export const StatCard = ({ stat, isLarge = true }: StatCardProps) => (
  <Card
    shadow="sm"
    padding={isLarge ? SPACING.xxl : SPACING.xl}
    radius="0.75rem"
    style={{
      border: `0.0625rem solid ${COLORS.bgBorder}`,
      transition: "all 0.2s ease",
      cursor: "default",
    }}
    styles={{
      root: {
        "&:hover": {
          transform: "translateY(-0.125rem)",
          boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.1)",
        },
      },
    }}
  >
    <Group
      justify="space-between"
      align="flex-start"
      mb={isLarge ? SPACING.md : SPACING.sm}
    >
      <Stack gap={SPACING.xs} style={{ flex: 1 }}>
        <Text
          size={isLarge ? "0.875rem" : "0.75rem"}
          c={COLORS.textSecondary}
          fw={500}
          tt="uppercase"
          style={{ letterSpacing: "0.03125rem" }}
        >
          {stat.title}
        </Text>
        <Text
          fw={700}
          size={isLarge ? "2rem" : "1.5rem"}
          c={COLORS.textPrimary}
          style={{ lineHeight: 1.2 }}
        >
          {stat.value}
        </Text>
        {stat.description && isLarge && (
          <Text size="0.75rem" c={COLORS.textMuted}>
            {stat.description}
          </Text>
        )}
      </Stack>

      <ThemeIcon
        size={isLarge ? "3rem" : "2.5rem"}
        radius="0.75rem"
        style={{
          backgroundColor: stat.bgColor,
          border: "none",
        }}
      >
        <stat.icon
          size={isLarge ? "1.5rem" : "1.25rem"}
          color={stat.color}
          style={{ strokeWidth: 1.5 }}
        />
      </ThemeIcon>
    </Group>
  </Card>
);

interface ProgressCardProps {
  taskStats: TaskStats;
  additionalStats: AdditionalStatData[];
}

export const ProgressCard = ({
  taskStats,
  additionalStats,
}: ProgressCardProps) => (
  <Card
    shadow="sm"
    padding={SPACING.xxl}
    radius="0.75rem"
    style={{
      border: `0.0625rem solid ${COLORS.bgBorder}`,
      height: "100%",
    }}
  >
    <Stack gap={SPACING.lg}>
      <Group justify="space-between" align="center">
        <Text size="1.25rem" fw={600} c={COLORS.textPrimary}>
          Task Progress Overview
        </Text>
        <ThemeIcon
          size="2.5rem"
          radius={SPACING.sm}
          style={{ backgroundColor: "rgba(74, 144, 226, 0.1)" }}
        >
          <IconFileText size="1.25rem" color={COLORS.primary} />
        </ThemeIcon>
      </Group>

      <Box>
        <Group justify="space-between" mb={SPACING.sm}>
          <Text size="0.875rem" c={COLORS.textSecondary} fw={500}>
            Completion Progress
          </Text>
          <Text size="0.875rem" fw={600} c={COLORS.textPrimary}>
            {taskStats.completionRate.toFixed(1)}%
          </Text>
        </Group>

        <Progress
          value={taskStats.completionRate}
          size="0.75rem"
          radius="0.375rem"
          styles={{
            root: {
              backgroundColor: COLORS.bgLight,
            },
            section: {
              background: `linear-gradient(45deg, ${COLORS.success}, #69db7c)`,
            },
          }}
        />
      </Box>

      <Group justify="space-between" align="center">
        <Group gap={SPACING.sm}>
          <Text size="0.875rem" c={COLORS.textSecondary}>
            {taskStats.completedTasks} of {taskStats.totalTasks} completed
          </Text>
        </Group>

        <Badge
          color="orange"
          variant="light"
          size="md"
          radius="0.375rem"
          style={{
            fontWeight: 500,
            fontSize: "0.75rem",
          }}
        >
          {taskStats.pendingTasks} remaining
        </Badge>
      </Group>

      <SimpleGrid cols={2} spacing={SPACING.md} mt={SPACING.sm}>
        {additionalStats.map((stat) => (
          <Box
            key={stat.title}
            p={SPACING.md}
            style={{
              backgroundColor: COLORS.bgLight,
              borderRadius: SPACING.sm,
              border: `0.0625rem solid ${COLORS.bgBorder}`,
            }}
          >
            <Group gap={SPACING.sm} align="center">
              <ThemeIcon
                size="1.5rem"
                radius="0.25rem"
                style={{ backgroundColor: "white" }}
              >
                <stat.icon size="0.875rem" color={stat.color} />
              </ThemeIcon>
              <Stack gap="0.125rem" style={{ flex: 1 }}>
                <Text size="0.75rem" c={COLORS.textSecondary} fw={500}>
                  {stat.title}
                </Text>
                <Text size="0.875rem" fw={600} c={COLORS.textPrimary}>
                  {stat.value}
                </Text>
              </Stack>
            </Group>
          </Box>
        ))}
      </SimpleGrid>
    </Stack>
  </Card>
);

interface QuickStatsCardProps {
  taskStats: TaskStats;
  userCount: number;
}

export const QuickStatsCard = ({
  taskStats,
  userCount,
}: QuickStatsCardProps) => (
  <Card
    shadow="sm"
    padding={SPACING.xxl}
    radius="0.75rem"
    style={{
      border: `0.0625rem solid ${COLORS.bgBorder}`,
      height: "100%",
    }}
  >
    <Stack gap={SPACING.lg}>
      <Group justify="space-between" align="center">
        <Text size="1.25rem" fw={600} c={COLORS.textPrimary}>
          Quick Stats
        </Text>
        <ThemeIcon
          size="2.5rem"
          radius={SPACING.sm}
          style={{ backgroundColor: "rgba(124, 58, 237, 0.1)" }}
        >
          <IconChartLine size="1.25rem" color={COLORS.purple} />
        </ThemeIcon>
      </Group>

      <Stack gap={SPACING.lg}>
        <Box
          p={SPACING.lg}
          style={{
            backgroundColor: COLORS.bgLight,
            borderRadius: SPACING.sm,
            border: `0.0625rem solid ${COLORS.bgBorder}`,
          }}
        >
          <Group justify="space-between" mb={SPACING.sm}>
            <Text size="0.875rem" fw={500} c={COLORS.textDark}>
              Task Distribution
            </Text>
          </Group>
          <Group justify="space-between">
            <Group gap="0.375rem">
              <Box
                w="0.75rem"
                h="0.75rem"
                style={{
                  backgroundColor: COLORS.success,
                  borderRadius: "50%",
                }}
              />
              <Text size="0.75rem" c={COLORS.textSecondary}>
                Completed: {taskStats.completedTasks}
              </Text>
            </Group>
            <Group gap="0.375rem">
              <Box
                w="0.75rem"
                h="0.75rem"
                style={{
                  backgroundColor: COLORS.warning,
                  borderRadius: "50%",
                }}
              />
              <Text size="0.75rem" c={COLORS.textSecondary}>
                Pending: {taskStats.pendingTasks}
              </Text>
            </Group>
          </Group>
        </Box>

        <Box
          p={SPACING.lg}
          style={{
            backgroundColor: COLORS.bgLight,
            borderRadius: SPACING.sm,
            border: `0.0625rem solid ${COLORS.bgBorder}`,
          }}
        >
          <Text size="0.875rem" fw={500} c={COLORS.textDark} mb={SPACING.sm}>
            System Status
          </Text>
          <Stack gap={SPACING.sm}>
            <Group justify="space-between">
              <Text size="0.75rem" c={COLORS.textSecondary}>
                Total Users
              </Text>
              <Badge color="blue" variant="light" size="sm">
                {userCount}
              </Badge>
            </Group>
            <Group justify="space-between">
              <Text size="0.75rem" c={COLORS.textSecondary}>
                Active Tasks
              </Text>
              <Badge color="green" variant="light" size="sm">
                {taskStats.totalTasks}
              </Badge>
            </Group>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  </Card>
);
