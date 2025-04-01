import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQuery } from "@/lib/utils/baseQuery"

interface Organizer {
  name: string
  email: string
}

interface Attendee {
  _id: string
  name: string
  email: string
  status: string
}

export interface Meeting {
  _id: string
  meetingId: string
  leadId: number
  taskId?: string
  companyId: number
  title: string
  description: string
  startTime: string
  endTime: string
  organizer: Organizer
  attendees: Attendee[]
  location: string
  meetingStatus: string
  isRecurring: boolean
  recurrenceDetails: any
  MOM: string
  link?: string
  createdBy: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

interface MeetingsResponse {
  status: boolean
  code: number
  message: string
  data: {
    total: number
    limit: number
    pageNumber: number
    meetings: Meeting[]
  }
}

interface GetMeetingsParams {
  startDate: string
  endDate: string
  limit?: number
  pageNumber?: number
  search?: string
}

export const meetingsApi = createApi({
  reducerPath: "meetingsApi",
  baseQuery,
  endpoints: (builder) => ({
    getMeetings: builder.query<MeetingsResponse, GetMeetingsParams>({
      query: ({ startDate, endDate, limit = 10, pageNumber = 1, search = "" }) => ({
        url: "/lead/meeting/getMeetings",
        params: {
          startDate,
          endDate,
          limit,
          pageNumber,
          search,
        },
      }),
    }),
  }),
})

export const { useGetMeetingsQuery } = meetingsApi 