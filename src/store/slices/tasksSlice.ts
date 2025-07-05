import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { tasksApi, handleApiError } from "../../services/api";
import type { Task, CreateTaskRequest, TaskFilters } from "../../types";

interface TasksState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;
  filters: TaskFilters;
  totalTasks: number;
  currentPage: number;
  itemsPerPage: number;
}

const initialState: TasksState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  filters: {
    search: "",
    status: "all",
  },
  totalTasks: 0,
  currentPage: 1,
  itemsPerPage: 10,
};

// Async thunks محسنة
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (
    params?: {
      search?: string;
      completed?: boolean;
      limit?: number;
      page?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const tasks = await tasksApi.getAll(params);
      return tasks;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  "tasks/fetchTaskById",
  async (id: string, { rejectWithValue }) => {
    try {
      const task = await tasksApi.getById(id);
      return task;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData: CreateTaskRequest, { rejectWithValue }) => {
    try {
      const newTask = await tasksApi.create(taskData);
      return newTask;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (task: Task, { rejectWithValue }) => {
    try {
      const updatedTask = await tasksApi.update(task.id, task);
      return updatedTask;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const toggleTaskCompleted = createAsyncThunk(
  "tasks/toggleTaskCompleted",
  async (
    { id, completed }: { id: string; completed: boolean },
    { rejectWithValue }
  ) => {
    try {
      const updatedTask = await tasksApi.toggleCompleted(id, completed);
      return updatedTask;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id: string, { rejectWithValue }) => {
    try {
      await tasksApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchTasksByUser = createAsyncThunk(
  "tasks/fetchTasksByUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const tasks = await tasksApi.getByUserId(userId);
      return tasks;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<TaskFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { search: "", status: "all" };
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1;  
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
  },
  extraReducers: (builder) => {
    builder
       .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.totalTasks = action.payload.length;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

       .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

       .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload);  
        state.totalTasks += 1;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

       .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

       .addCase(toggleTaskCompleted.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })

       .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        state.totalTasks -= 1;
        if (state.currentTask?.id === action.payload) {
          state.currentTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

       .addCase(fetchTasksByUser.fulfilled, (state, action) => {
        state.loading = false;
         state.tasks = action.payload;
      });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  setCurrentPage,
  setItemsPerPage,
  clearCurrentTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;
