import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { MeetingsResponse } from "@/lib/types/meetings"

interface GetMeetingsParams {
  limit?: number
  pageNumber?: number
  search?: string
  startDate: string
  endDate: string
}

export const meetingsApi = createApi({
  reducerPath: "meetingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token")
      if (token) {
        headers.set("Authorization", token)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    getMeetings: builder.query<MeetingsResponse, GetMeetingsParams>({
      query: (params) => ({
        url: "/lead/meeting/getMeetings",
        method: "GET",
        params: {
          limit: params.limit || 10,
          pageNumber: params.pageNumber || 1,
          search: params.search || "",
          startDate: params.startDate,
          endDate: params.endDate,
        },
      }),
    }),
  }),
})

export const { useGetMeetingsQuery } = meetingsApi 