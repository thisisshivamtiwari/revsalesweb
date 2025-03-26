import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/lib/utils/baseQuery';
import { TasksResponse } from '@/lib/types/tasks';

interface GetTasksParams {
  limit: number;
  pageNumber: number;
  search?: string;
  status?: 'completed' | 'pending';
  startDate: string;
  endDate: string;
}

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery,
  endpoints: (builder) => ({
    getTasks: builder.query<TasksResponse, GetTasksParams>({
      query: ({ limit, pageNumber, search, status, startDate, endDate }) => ({
        url: '/task/getTasks',
        method: 'GET',
        params: {
          limit,
          pageNumber,
          search,
          status,
          startDate,
          endDate,
        },
      }),
    }),
  }),
});

export const { useGetTasksQuery } = tasksApi; 