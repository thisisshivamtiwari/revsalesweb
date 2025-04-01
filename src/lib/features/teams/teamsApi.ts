import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { TeamResponse, TeamParams } from '../../types/team'

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

interface AddMemberRequest {
  departmentId: number;
  designationId: number;
  email: string;
  fullName: string;
  nickName: string;
  phoneNumber: number;
  reportTo: string;
}

interface AddMemberResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    member: {
      _id: string;
      fullName: string;
      email: string;
      phoneNumber: number;
      departmentId: number;
      designationId: number;
      reportTo: string;
    }
  }
}

interface GetMembersParams {
  pageNumber?: number;
  limit?: number;
  search?: string;
  id?: string;
}

interface Member {
  _id: string;
  id: string;
  fullName: string;
  email: string;
  phoneNumber: number;
  departmentId: number;
  designationId: number;
  designationName: string;
  profileImg: string;
}

interface GetMembersResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    total: number;
    limit: number;
    pageNumber: number;
    members: Member[];
  };
}

interface Team {
  id: string;
  name: string;
  managerId: string;
  members: Array<{
    userId: string;
    fullName: string;
    profileImg?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface CreateTeamRequest {
  team: {
    name: string;
    managerId: string;
    members: Array<{ userId: string }>;
  }
}

interface CreateTeamResponse {
  success: boolean;
  message: string;
  data: {
    team: Team;
  }
}

interface UpdateTeamRequest {
  team: {
    id: string;
    managerId: string;
    members: Array<{
      userId: string;
      type: 'add' | 'remove';
    }>;
  }
}

interface UpdateTeamResponse {
  success: boolean;
  message: string;
  data: {
    team: Team;
  }
}

interface DeleteTeamResponse {
  success: boolean;
  message: string;
}

interface LeadRulesResponse {
  status: boolean;
  code: number;
  message: string;
  data: any;
}

interface LeadRulesQueryParams {
  // Add any necessary query parameters here
}

export const teamsApi = createApi({
  reducerPath: 'teamsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('authorization', token)
      }
      return headers
    },
  }),
  tagTypes: ['Teams'],
  endpoints: (builder) => ({
    getTeams: builder.query<TeamResponse, TeamParams>({
      query: (params = { limit: 5, offset: 1 }) => ({
        url: 'team/getTeam',
        method: 'GET',
        params,
      }),
      providesTags: ['Teams'],
    }),
    getUserPerformance: builder.query<GetUserPerformanceResponse, void>({
      query: () => ({
        url: '/sales/user/getUserPerformance',
      }),
    }),
    addMember: builder.mutation<AddMemberResponse, AddMemberRequest>({
      query: (data) => ({
        url: '/team/addMember',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Teams'],
    }),
    getMembers: builder.query<GetMembersResponse, GetMembersParams>({
      query: (params = { pageNumber: 1, limit: 100 }) => ({
        url: '/team/getMembers',
        method: 'GET',
        params,
      }),
    }),
    createTeam: builder.mutation<CreateTeamResponse, CreateTeamRequest>({
      query: (body) => ({
        url: '/team/createTeam',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Teams'],
    }),
    updateTeam: builder.mutation<UpdateTeamResponse, UpdateTeamRequest>({
      query: (body) => ({
        url: '/team/updateTeam',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Teams'],
    }),
    deleteTeam: builder.mutation<DeleteTeamResponse, string>({
      query: (id) => ({
        url: `/team/deleteTeam?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Teams'],
    }),
    getLeadRules: builder.query<{ status: boolean; code: number; message: string; data: LeadRulesResponse }, LeadRulesQueryParams>({
      query: (params) => ({
        url: 'lead/getRule',
        method: 'GET',
        params,
      }),
    }),
  }),
})

export const { 
  useGetTeamsQuery, 
  useGetUserPerformanceQuery,
  useAddMemberMutation,
  useGetMembersQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useGetLeadRulesQuery,
} = teamsApi 