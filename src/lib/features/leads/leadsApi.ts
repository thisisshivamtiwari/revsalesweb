import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/lib/utils/baseQuery';
import { LeadsResponse } from '@/lib/types/leads';

interface GetLeadsParams {
  limit?: number;
  pageNumber?: number;
  search?: string;
  startDate: string;
}

export const leadsApi = createApi({
  reducerPath: 'leadsApi',
  baseQuery,
  endpoints: (builder) => ({
    getTodaysLeads: builder.query<LeadsResponse, GetLeadsParams>({
      query: (params) => ({
        url: '/lead/getTodaysLeads',
        params,
      }),
    }),
  }),
});

export const { useGetTodaysLeadsQuery } = leadsApi; 