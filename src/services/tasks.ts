import axios from 'axios';
import { getAuthToken } from '@/services/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://rworldbelite.retvenslabs.com';

export interface Task {
  id: string;
  leadId: number;
  taskTypeId: string;
  assignedTo: string;
  assignedBy: string;
  createdBy: string;
  createdFor: string;
  title: string;
  deadline: string;
  taskStatus: 'pending' | 'completed';
  description: string;
  createdAt: string;
  leadName: string;
  phoneNumber: string;
  taskTypeName: string;
  meetingID: string;
  taskType: string;
}

export interface GetTasksResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    total: number;
    limit: number;
    offset: number;
    tasks: Task[];
  };
}

export interface GetTasksParams {
  limit?: number;
  pageNumber?: number;
  status?: 'pending' | 'completed';
  startDate?: string;
  endDate?: string;
}

export const getTasks = async (params: GetTasksParams = {}): Promise<GetTasksResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      return {
        status: false,
        code: 401,
        message: 'Authentication token not found. Please log in again.',
        data: {
          total: 0,
          limit: 10,
          offset: 1,
          tasks: []
        }
      };
    }

    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(
      `${BASE_URL}/api/sales/task/getTasks?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GetTasksResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return {
      status: false,
      code: 500,
      message: error instanceof Error ? error.message : 'An error occurred while fetching tasks',
      data: {
        total: 0,
        limit: 10,
        offset: 1,
        tasks: []
      }
    };
  }
};

export const completeTask = async (
  taskId: string,
  leadId: number,
  notes?: string
): Promise<{ status: boolean; message: string }> => {
  try {
    const token = getAuthToken();
    const response = await axios.patch(
      `${BASE_URL}/api/sales/task/updateTask`,
      {
        taskId,
        leadId,
        status: 'completed',
        notes,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error completing task:', error);
    throw error;
  }
}; 