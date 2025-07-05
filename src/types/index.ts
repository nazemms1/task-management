import type { Icon } from "@tabler/icons-react";

 export interface StatCardData {
  title: string;
  value: number | string;
  icon: Icon;
  color: string;
  bgColor: string;
  description?: string;
}

export interface AdditionalStatData {
  title: string;
  value: number | string;
  icon: Icon;
  color: string;
}

export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  tasksThisWeek: number;
}

export interface DashboardData {
  tasks: unknown[];
  users: unknown[];
  loading: boolean;
}

 export interface Task {
  id: string;
  title: string;
  description: string;
  completed?: boolean;
  is_completed?: boolean;
  isCompleted?: boolean;
  startDate?: string;
  start_date?: string;
  endDate?: string;
  end_date?: string;
  createdAt?: string;
  created_at?: string;
  assignedUserId?: string;
  user_name?: string;
  userName?: string;
  user_avatar?: string;
  userAvatar?: string;
}

 export interface User {
  id: string;
  name?: string;
  first_name?: string;
  firstName?: string;
  last_name?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}

 export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

 export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface LoadingProps {
  loading?: boolean;
  error?: string | null;
}
