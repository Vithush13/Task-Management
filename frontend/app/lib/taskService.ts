import api from './api';
import { Task, TaskRequest, ApiResponse } from '../types';

interface TaskFilters {
  status?: string;
  priority?: string;
}

interface PaginatedResponse {
  content: Task[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

const TaskService = {
  async getTasks(
    filters: TaskFilters = {},
    page = 0,
    size = 10,
    sortBy = 'dueDate',
    sortDirection = 'asc'
  ): Promise<ApiResponse<PaginatedResponse>> {
    const params = {
      page,
      size,
      sortBy,
      sortDirection,
      ...filters
    };
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  async getTaskById(id: string | number): Promise<ApiResponse<Task>> {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  async createTask(taskData: TaskRequest): Promise<ApiResponse<Task>> {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  async updateTask(id: string | number, taskData: TaskRequest): Promise<ApiResponse<Task>> {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  async deleteTask(id: string | number): Promise<ApiResponse<null>> {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  async markAsCompleted(id: string | number): Promise<ApiResponse<Task>> {
    const response = await api.patch(`/tasks/${id}/complete`);
    return response.data;
  }
};

export default TaskService;