import type { Task, CreateTaskRequest, User } from "../types";

const BASE_URL = "https://6866267089803950dbb16477.mockapi.io/api/v1";

export interface ApiError {
  message: string;
  status: number;
  endpoint: string;
}

interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
}

class ApiService {
  private defaultTimeout = 10000;
  private defaultRetries = 3;

  private async request<T>(
    endpoint: string,
    options: RequestConfig = {}
  ): Promise<T> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      ...fetchOptions
    } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            ...fetchOptions?.headers,
          },
          ...fetchOptions,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.text().catch(() => "Unknown error");
          throw new Error(
            `API Error ${response.status}: ${response.statusText}. ${errorData}`
          );
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          return data;
        } else {
          if (fetchOptions.method === "DELETE") {
            return {} as T;
          }
          throw new Error("Invalid JSON response");
        }
      } catch (error) {
        lastError = error as Error;

        if (
          attempt < retries &&
          (lastError.name === "AbortError" ||
            lastError.message.includes("fetch") ||
            lastError.message.includes("Network"))
        ) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
          continue;
        }

        if (lastError.message.includes("Error 4")) {
          break;
        }
      }
    }

    clearTimeout(timeoutId);

    const apiError: ApiError = {
      message: lastError.message,
      status: lastError.message.includes("Error")
        ? parseInt(lastError.message.match(/Error (\d+)/)?.[1] || "500")
        : 500,
      endpoint,
    };

    throw apiError;
  }

  async getAll<T>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<T[]> {
    let url = endpoint;

    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    return this.request<T[]>(url);
  }

  async getById<T>(endpoint: string, id: string): Promise<T> {
    if (!id) {
      throw new Error("ID is required");
    }
    return this.request<T>(`${endpoint}/${id}`);
  }

  async create<T>(endpoint: string, data: unknown): Promise<T> {
    if (!data) {
      throw new Error("Data is required for creation");
    }

    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async update<T>(endpoint: string, id: string, data: unknown): Promise<T> {
    if (!id) {
      throw new Error("ID is required for update");
    }
    if (!data) {
      throw new Error("Data is required for update");
    }

    return this.request<T>(`${endpoint}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, id: string, data: unknown): Promise<T> {
    if (!id) {
      throw new Error("ID is required for patch");
    }
    if (!data) {
      throw new Error("Data is required for patch");
    }

    return this.request<T>(`${endpoint}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string, id: string): Promise<void> {
    if (!id) {
      throw new Error("ID is required for deletion");
    }

    await this.request(`${endpoint}/${id}`, {
      method: "DELETE",
    });
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.request("/users?limit=1");
      return true;
    } catch {
      return false;
    }
  }
}

const apiService = new ApiService();

export const tasksApi = {
  getAll: (params?: {
    search?: string;
    completed?: boolean;
    limit?: number;
    page?: number;
  }) => {
    const queryParams: Record<string, string> = {};

    if (params?.search) queryParams.search = params.search;
    if (params?.completed !== undefined)
      queryParams.completed = params.completed.toString();
    if (params?.limit) queryParams.limit = params.limit.toString();
    if (params?.page) queryParams.page = params.page.toString();

    return apiService.getAll<Task>(
      "/tasks",
      Object.keys(queryParams).length ? queryParams : undefined
    );
  },

  getById: (id: string) => apiService.getById<Task>("/tasks", id),

  create: (data: CreateTaskRequest) => {
    if (!data.title?.trim()) {
      throw new Error("Task title is required");
    }
    if (!data.assignedUserId) {
      throw new Error("Assigned user is required");
    }

    return apiService.create<Task>("/tasks", data);
  },

  update: (id: string, data: Partial<Task>) => {
    const { createdAt, updatedAt, ...updateData } = data as any;
    return apiService.update<Task>("/tasks", id, updateData);
  },

  patch: (id: string, data: Partial<Task>) => {
    const { createdAt, updatedAt, ...patchData } = data as any;
    return apiService.patch<Task>("/tasks", id, patchData);
  },

  delete: (id: string) => apiService.delete("/tasks", id),

  getByUserId: (userId: string) => {
    return apiService.getAll<Task>("/tasks", { assignedUserId: userId });
  },

  toggleCompleted: async (id: string, completed: boolean) => {
    return apiService.patch<Task>("/tasks", id, { completed });
  },
};

export const usersApi = {
  getAll: (params?: { search?: string; limit?: number; page?: number }) => {
    const queryParams: Record<string, string> = {};

    if (params?.search) queryParams.search = params.search;
    if (params?.limit) queryParams.limit = params.limit.toString();
    if (params?.page) queryParams.page = params.page.toString();

    return apiService.getAll<User>(
      "/users",
      Object.keys(queryParams).length ? queryParams : undefined
    );
  },

  getById: (id: string) => apiService.getById<User>("/users", id),

  create: (data: Omit<User, "id" | "createdAt" | "updatedAt">) => {
    if (!data.first_name?.trim() || !data.last_name?.trim()) {
      throw new Error("First name and last name are required");
    }

    return apiService.create<User>("/users", data);
  },

  update: (id: string, data: Partial<User>) => {
    const { createdAt, updatedAt, ...updateData } = data as any;
    return apiService.update<User>("/users", id, updateData);
  },

  delete: (id: string) => apiService.delete("/users", id),

  search: (query: string) => {
    return apiService.getAll<User>("/users", { search: query });
  },
};

export const checkApiConnection = async (): Promise<boolean> => {
  try {
    return await apiService.healthCheck();
  } catch {
    return false;
  }
};

export const handleApiError = (error: unknown): string => {
  if (error && typeof error === "object" && "message" in error) {
    const apiError = error as ApiError;

    switch (apiError.status) {
      case 400:
        return "Invalid request data";
      case 401:
        return "Authentication required";
      case 403:
        return "Access denied";
      case 404:
        return "Resource not found";
      case 429:
        return "Too many requests. Please try again later";
      case 500:
        return "Server error. Please try again later";
      default:
        return apiError.message || "An unexpected error occurred";
    }
  }

  return "Network error. Please check your connection";
};

export default apiService;
