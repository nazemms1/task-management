import type React from "react";
import { Container, Text, SimpleGrid, Grid } from "@mantine/core";
import {
  ProgressCard,
  QuickStatsCard,
  StatCard,
} from "../../components/Dashboard/DashboardCard";
import {  SPACING } from "../../constants";
import { useDashboardData } from "../../hooks/dashboard";

const Dashboard: React.FC = () => {
  const { isLoading, taskStats, statsData, additionalStats, users } =
    useDashboardData();

  if (isLoading) {
    return (
      <Container size="100%" p={SPACING.xxl}>
        <Text size="lg" ta="center">
          Loading dashboard...
        </Text>
      </Container>
    );
  }

  return (
    <Container
      size="100%"
      p={SPACING.xxl}
      style={{
        minHeight: "100vh",
      }}
    >
      <SimpleGrid
        cols={{ base: 1, xs: 2, sm: 2, md: 4 }}
        spacing={SPACING.xl}
        mb={SPACING.xxxl}
      >
        {statsData.map((stat) => (
          <StatCard key={stat.title} stat={stat} isLarge />
        ))}
      </SimpleGrid>

      <Grid gutter={SPACING.xxl}>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <ProgressCard
            taskStats={taskStats}
            additionalStats={additionalStats}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 4 }}>
          <QuickStatsCard taskStats={taskStats} userCount={users.length} />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default Dashboard;
