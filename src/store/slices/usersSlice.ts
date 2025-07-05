import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { usersApi, handleApiError } from "../../services/api";
import type { User, UserFilters } from "../../types";

interface UsersState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  filters: UserFilters;
  totalUsers: number;
  currentPage: number;
  itemsPerPage: number;
}

const initialState: UsersState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  filters: {
    search: "",
    status: "all",
  },
  totalUsers: 0,
  currentPage: 1,
  itemsPerPage: 10,
};

 export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    params?: { search?: string; limit?: number; page?: number },
    { rejectWithValue }
  ) => {
    try {
      const users = await usersApi.getAll(params);
       const processedUsers = users.map((user) => ({
        ...user,
        name: `${user.first_name} ${user.last_name}`,
        email:
          user.email ||
          `${user.first_name.toLowerCase()}.${user.last_name.toLowerCase()}@example.com`,
      }));
      return processedUsers;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id: string, { rejectWithValue }) => {
    try {
      const user = await usersApi.getById(id);
      return {
        ...user,
        name: `${user.first_name} ${user.last_name}`,
        email:
          user.email ||
          `${user.first_name.toLowerCase()}.${user.last_name.toLowerCase()}@example.com`,
      };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const searchUsers = createAsyncThunk(
  "users/searchUsers",
  async (query: string, { rejectWithValue }) => {
    try {
      const users = await usersApi.search(query);
      return users.map((user) => ({
        ...user,
        name: `${user.first_name} ${user.last_name}`,
      }));
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (
    userData: Omit<User, "id" | "createdAt" | "updatedAt">,
    { rejectWithValue }
  ) => {
    try {
      const newUser = await usersApi.create(userData);
      return {
        ...newUser,
        name: `${newUser.first_name} ${newUser.last_name}`,
      };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (
    { id, userData }: { id: string; userData: Partial<User> },
    { rejectWithValue }
  ) => {
    try {
      const updatedUser = await usersApi.update(id, userData);
      return {
        ...updatedUser,
        name: `${updatedUser.first_name} ${updatedUser.last_name}`,
      };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: string, { rejectWithValue }) => {
    try {
      await usersApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<UserFilters>>) => {
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
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
       .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.totalUsers = action.payload.length;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

       .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

       .addCase(searchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })

       .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.unshift(action.payload);
        state.totalUsers += 1;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

       .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

       .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
        state.totalUsers -= 1;
        if (state.currentUser?.id === action.payload) {
          state.currentUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  setCurrentPage,
  setItemsPerPage,
  clearCurrentUser,
} = usersSlice.actions;

export default usersSlice.reducer;
