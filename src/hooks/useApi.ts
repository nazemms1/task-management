import { useState, useCallback } from "react";
import { notifications } from "@mantine/notifications";
import { handleApiError } from "../services/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = <T>() => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (apiCall: () => Promise<T>, showNotification = true) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await apiCall();
        setState({ data: result, loading: false, error: null });

        if (showNotification) {
          notifications.show({
            title: "Success",
            message: "Operation completed successfully",
            color: "green",
          });
        }

        return result;
      } catch (error) {
        const errorMessage = handleApiError(error);
        setState((prev) => ({ ...prev, loading: false, error: errorMessage }));

        if (showNotification) {
          notifications.show({
            title: "Error",
            message: errorMessage,
            color: "red",
          });
        }

        throw error;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
};
