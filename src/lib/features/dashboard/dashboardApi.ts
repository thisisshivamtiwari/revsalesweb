import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/lib/utils/baseQuery';

interface CallDetail {
  phoneNumber: string;
  callType: string;
  leadName: string;
  userName: string;
  count: number;
  duration: string;
}

interface CallDetailsResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    total: number;
    limit: number;
    offset: number;
    calls: CallDetail[];
  };
}

interface TeamPerformanceResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    dataRange: {
      startDate: string;
      endDate: string;
    };
    graphData: Array<{
      label: string;
      count: number;
    }>;
    tasks: {
      completedTask: number;
      assignedTask: number;
      completionPercentage: number;
    };
    proposal: {
      selectedPeriod: number;
      comparisonPeriod: number;
      growthPercentage: number;
    };
    meetings: {
      meetingDone: number;
      convertedLead: number;
      conversionPercentage: number;
      meetingDonePer: number;
    };
    revenue: {
      currentRevenue: number;
      lastRevenue: number;
      revenueGrowth: number;
      leadConversionPer: number;
    };
  };
}

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery,
  endpoints: (builder) => ({
    getCallDetails: builder.query<CallDetailsResponse, void>({
      query: () => ({
        url: '/lead/call/getCallDetails',
      }),
    }),
    getTeamPerformance: builder.query<TeamPerformanceResponse, void>({
      query: () => ({
        url: '/user/performance',
      }),
    }),
  }),
});

export const { useGetCallDetailsQuery, useGetTeamPerformanceQuery } = dashboardApi; 