import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  status: boolean
  code: number
  message: string
  data: {
    currentScreen: number
    fullName: string
    companyId: number
    profileImg: string
    token: string
  }
}

export const authApi = createApi({
  reducerPath: "authApi",
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
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: credentials,
      }),
    }),
  }),
})

export const { useLoginMutation } = authApi 