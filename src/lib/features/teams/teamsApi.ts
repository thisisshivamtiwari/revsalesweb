import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/lib/utils/baseQuery';

interface UserPerformance {
  fullName: string;
  totalLeads: number;
  amountClosed: number;
  userId: string;
}

interface GetUserPerformanceResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    total: number;
    limit: number;
    offset: number;
    performance: UserPerformance[];
  };
}

export const teamsApi = createApi({
  reducerPath: 'teamsApi',
  baseQuery,
  endpoints: (builder) => ({
    getUserPerformance: builder.query<GetUserPerformanceResponse, void>({
      query: () => ({
        url: '/sales/user/getUserPerformance',
      }),
    }),
  }),
});

export const { useGetUserPerformanceQuery } = teamsApi; 