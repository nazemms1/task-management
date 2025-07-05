import type {
  Task,
  TaskStats,
  StatCardData,
  AdditionalStatData,
} from "../types";
import { STAT_ICONS } from "../constants";

export const getTaskStatus = (task: Task): boolean => {
  return task.completed || task.is_completed || task.isCompleted || false;
};

export const getTaskDate = (task: Task): string | null => {
  return (
    task.startDate ||
    task.start_date ||
    task.createdAt ||
    task.created_at ||
    null
  );
};

export const calculateTaskStats = (tasks: Task[]): TaskStats => {
  const completedTasks = tasks.filter((task) => getTaskStatus(task)).length;
  const totalTasks = tasks.length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const tasksThisWeek = getTasksThisWeek(tasks);

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completionRate,
    tasksThisWeek,
  };
};

export const getTasksThisWeek = (tasks: Task[]): number => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return tasks.filter((task) => {
    const taskDate = getTaskDate(task);
    if (!taskDate) return false;
    return new Date(taskDate) >= oneWeekAgo;
  }).length;
};

export const generateStatsData = (
  taskStats: TaskStats,
  userCount: number
): StatCardData[] => {
  return [
    {
      title: "Total Tasks",
      value: taskStats.totalTasks,
      icon: STAT_ICONS.tasks,
      color: "#4A90E2",
      bgColor: "rgba(74, 144, 226, 0.1)",
      description: "All tasks in system",
    },
    {
      title: "Completed",
      value: taskStats.completedTasks,
      icon: STAT_ICONS.completed,
      color: "#51cf66",
      bgColor: "rgba(81, 207, 102, 0.1)",
      description: "Successfully finished",
    },
    {
      title: "Total Users",
      value: userCount,
      icon: STAT_ICONS.users,
      color: "#7c3aed",
      bgColor: "rgba(124, 58, 237, 0.1)",
      description: "Active users",
    },
    {
      title: "Pending",
      value: taskStats.pendingTasks,
      icon: STAT_ICONS.pending,
      color: "#ff8c42",
      bgColor: "rgba(255, 140, 66, 0.1)",
      description: "Awaiting completion",
    },
  ];
};

export const generateAdditionalStats = (
  taskStats: TaskStats
): AdditionalStatData[] => {
  return [
    {
      title: "This Week",
      value: taskStats.tasksThisWeek,
      icon: STAT_ICONS.calendar,
      color: "#20c997",
    },
    {
      title: "Completion Rate",
      value: `${taskStats.completionRate.toFixed(1)}%`,
      icon: STAT_ICONS.chart,
      color: "#6c757d",
    },
  ];
};
