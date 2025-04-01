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

interface UserDetails {
  _id: string
  fullName: string
  email: string
  phoneNumber: number
  profileImg: string
  departmentId: number
  departmentName: string
  designationId: number
  designationName: string
}

interface UserDetailsResponse {
  status: boolean
  code: number
  message: string
  data: {
    user: UserDetails
  }
}

interface EditUserRequest {
  departmentId: number
  designationId: number
  phoneNumber: string
  fullName: string
  email: string
  profileImg: string
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
  tagTypes: ["User"],
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
    getUserDetails: builder.query<UserDetailsResponse, void>({
      query: () => ({
        url: "/user/getUserDetails",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    editUser: builder.mutation<UserDetailsResponse, EditUserRequest>({
      query: (userData) => ({
        url: "/user/editUser",
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
})

export const { 
  useLoginMutation, 
  useGetUserDetailsQuery,
  useEditUserMutation,
} = authApi 