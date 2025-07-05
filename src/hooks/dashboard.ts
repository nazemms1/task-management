import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../store/slices/tasksSlice";
import { fetchUsers } from "../store/slices/usersSlice";
import type { AppDispatch, RootState } from "../store/store";
import {
  calculateTaskStats,
  generateStatsData,
  generateAdditionalStats,
} from "../utils/dashboardUtils";

export const useDashboardData = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { tasks, loading: tasksLoading } = useSelector(
    (state: RootState) => state.tasks
  );
  const { users, loading: usersLoading } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchUsers());
  }, [dispatch]);

  const safeTasks = tasks || [];
  const safeUsers = users || [];
  const isLoading = tasksLoading || usersLoading;

  const taskStats = calculateTaskStats(safeTasks);
  const statsData = generateStatsData(taskStats, safeUsers.length);
  const additionalStats = generateAdditionalStats(taskStats);

  return {
    tasks: safeTasks,
    users: safeUsers,
    isLoading,
    taskStats,
    statsData,
    additionalStats,
  };
};
