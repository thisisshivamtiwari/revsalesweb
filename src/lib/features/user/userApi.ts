import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/lib/utils/baseQuery';
import type { 
  UserDetailsResponse, 
  EditUserRequest,
  DepartmentResponse,
  DesignationResponse,
  ImageUploadResponse 
} from '@/lib/types/user';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUserDetails: builder.query<UserDetailsResponse, void>({
      query: () => ({
        url: '/user/getUserDetails',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    editUser: builder.mutation<UserDetailsResponse, EditUserRequest>({
      query: (userData) => ({
        url: '/user/editUser',
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    getDepartments: builder.query<DepartmentResponse, void>({
      query: () => ({
        url: '/user/getDepartment',
        method: 'GET',
      }),
    }),
    getDesignations: builder.query<DesignationResponse, number>({
      query: (departmentId) => ({
        url: '/user/getDesignation',
        method: 'GET',
        params: { departmentId },
      }),
    }),
    uploadImage: builder.mutation<ImageUploadResponse, FormData>({
      query: (formData) => ({
        url: '/user/uploadImage',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { 
  useGetUserDetailsQuery, 
  useEditUserMutation,
  useGetDepartmentsQuery,
  useGetDesignationsQuery,
  useUploadImageMutation,
} = userApi; 