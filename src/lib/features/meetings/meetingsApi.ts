import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

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
  baseQuery: fetchBaseQuery({
    baseUrl: "https://rworldbelite.retvenslabs.com/api/sales/lead/meeting",
    prepareHeaders: (headers) => {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiOTMzNjJjYmQ2YjdhODZlM2ZjZTRkZjdkNTMzMGJlMzI6NmQ1YmRlZGUyMGU4Y2Y3MGYxZmU4MzVlNzI5OTk4ZGFkZGUyODNjZDc5ZGM5MTVlOTE2ODEzMGM4YjE4OGE1ZWQ4MTc0ZjU2OTBhMmRjYWY1ZWQ5NjI0NTA2ODI4YWUxZWMyMGQxMTE1YzE4MjE0M2RkMDJlYmMwMmRhMGI4YWNhNjQ5NDYwZmJjMjg3N2M5MWU3OTJkMmNhZmQyNzI1YzM1OWY1NjFkMzhmMmFlMDAxOWM1MzQzMTcwOWI2NWFiNWI1YjlkYTc4NmIzNmI5MDk1OWJlOTA4ZWU1OTlhMGYxYjg1ZjhjNTczMzJmMTQ0ZTE3MWVjMWIwMDNiZDE1YTBmOGQyMjFiOGZiZTYzMWYzM2U1MGYwYjQ5NDczYzcwMDk2ZWFhOTEzYWM2YzRiZjI5NzMyOTgzOWJmZmE2MjhlOGVhMWJjNTQwYzZmYjNhZjkxZTVlOWYxODFlZGE1YjkwMjM1ZWQ5YzVlMDQwNjA3MDNjMTZiMDYwMWVjODBjOWQzOTE5MTRkMWE5YzRiZmYxZTRkM2Y2OTZkMDk4MjExMDYxMmQ3ZTIxODUwN2NmMWEwYWU0YWRhZWJhNzg2MzBkNzllZmIyZDM5Y2MyMzViYTkyOTRkZTFlYTAyY2NkMWZhODBkNjQyMmQ5MjAxNTU3ZjhjZjg4Njk1YTZiNjA4M2NhYzIwOTU2MDU4ODE0N2E2Y2QwODI4NzE1ZGFhNjBhMjI1MjdhMmViZGMxNDBlMjU4ZDRkMjRmYWZhMWRlMGQ1OTY2Y2M5ZjdmMzg1ZTk2ZmE1OTE2NGEyNzAxZDg3ODMyMzE5YTQ2MTljZDljN2RhY2NlYWYyZWIwMjMzMCIsImlhdCI6MTc0Mjk5NTQ1MH0.n63nw7SnSmyD8GPbn5E_v6Dif8dI-S4_gTpCWnVsfYE"
      headers.set("Authorization", token)
      return headers
    },
  }),
  endpoints: (builder) => ({
    getMeetings: builder.query<MeetingsResponse, GetMeetingsParams>({
      query: ({ startDate, endDate, limit = 10, pageNumber = 1, search = "" }) => ({
        url: "getMeetings",
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