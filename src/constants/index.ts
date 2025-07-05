import {
  IconChecklist,
  IconTrendingUp,
  IconUsers,
  IconClock,
  IconCalendar,
  IconChartLine,
} from "@tabler/icons-react";

export const STATUS_COLORS = {
  COMPLETED: "green",
  PENDING: "orange",
  OVERDUE: "red",
  IN_PROGRESS: "blue",
} as const;

export const TOAST_MESSAGES = {
  TASK_CREATED: "Task created successfully",
  TASK_UPDATED: "Task updated successfully",
  TASK_DELETED: "Task deleted successfully",
  TASK_ERROR: "Failed to perform task operation",
  EXPORT_SUCCESS: "Data exported successfully",
  EXPORT_ERROR: "Failed to export data",
} as const;

export const COLORS = {
  primary: "#4A90E2",
  success: "#51cf66",
  warning: "#ff8c42",
  purple: "#7c3aed",
  info: "#20c997",
  secondary: "#6c757d",
  textPrimary: "#212529",
  textSecondary: "#6c757d",
  textMuted: "#adb5bd",
  textDark: "#495057",
  bgLight: "#f8f9fa",
  bgBorder: "#e9ecef",
  bgMain: "#f5f7fa",
} as const;

export const SPACING = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.25rem",
  xxl: "1.5rem",
  xxxl: "2rem",
} as const;

export const STAT_ICONS = {
  tasks: IconChecklist,
  completed: IconTrendingUp,
  users: IconUsers,
  pending: IconClock,
  calendar: IconCalendar,
  chart: IconChartLine,
} as const;
