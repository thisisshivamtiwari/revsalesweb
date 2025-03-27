import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/lib/utils/baseQuery';

interface Attendee {
  name: string;
  email: string;
  status: string;
  _id: string;
}

interface Meeting {
  _id: string;
  meetingId: string;
  leadId: number;
  taskId: string;
  companyId: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  organizer: {
    name: string;
    email: string;
  };
  attendees: Attendee[];
  location: string;
  meetingStatus: string;
  isRecurring: boolean;
  recurrenceDetails: any;
  MOM: string;
  link: string;
  createdBy: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GetMeetingsResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    total: number;
    limit: number;
    pageNumber: number;
    meetings: Meeting[];
  };
}

interface GetMeetingsParams {
  limit?: number;
  pageNumber?: number;
  search?: string;
  startDate: string;
  endDate: string;
}

export const meetingsApi = createApi({
  reducerPath: 'meetingsApi',
  baseQuery,
  endpoints: (builder) => ({
    getMeetings: builder.query<GetMeetingsResponse, GetMeetingsParams>({
      query: (params) => ({
        url: '/lead/meeting/getMeetings',
        params,
      }),
    }),
  }),
});

export const { useGetMeetingsQuery } = meetingsApi; 