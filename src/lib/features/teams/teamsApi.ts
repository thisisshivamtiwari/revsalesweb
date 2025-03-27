import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://rworldbelite.retvenslabs.com/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', token);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserPerformance: builder.query<GetUserPerformanceResponse, void>({
      query: () => '/sales/user/getUserPerformance',
    }),
  }),
});

export const { useGetUserPerformanceQuery } = teamsApi; 