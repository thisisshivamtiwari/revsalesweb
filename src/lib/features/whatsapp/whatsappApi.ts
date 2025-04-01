import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { WhatsappRulesResponse, WhatsappRulesParams } from "@/lib/types/whatsapp"

interface LeadStatus {
  id: string
  name: string
  isAssginedToNewLead: boolean
  isFinalStatus: boolean
  isProposal: boolean
  color: string
  createdBy: string
  modifiedBy: string
  createdAt: string
  updatedAt: string
}

interface FormField {
  id: string
  name: string
  key: string
}

interface LeadStatusResponse {
  status: boolean
  code: number
  message: string
  data: {
    total: number
    limit: number
    offset: number
    status: LeadStatus[]
  }
}

interface FormFieldsResponse {
  status: boolean
  code: number
  message: string
  data: FormField[]
}

interface WhatsappRule {
  name: string
  leadStatus: string
  description: string
  imageUrl?: string
  index: number
  keys: string[]
}

interface AddRuleRequest {
  destributionRule: WhatsappRule[]
}

interface UpdateRuleRequest {
  id: string
  name: string
  leadStatus: string
  description: string
  imageUrl?: string
  keys: string[]
}

export const whatsappApi = createApi({
  reducerPath: "whatsappApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://rworldbelite.retvenslabs.com/api/sales/lead",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token")
      if (token) {
        headers.set("Authorization", token)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    getWhatsappRules: builder.query<WhatsappRulesResponse, WhatsappRulesParams>({
      query: (params) => ({
        url: "WA/getRule",
        params: {
          limit: params.limit,
          pageNumber: params.pageNumber,
          search: params.search,
        },
      }),
    }),
    getLeadStatus: builder.query<LeadStatusResponse, { limit: number; pageNumber: number; search: string }>({
      query: (params) => ({
        url: "getLeadStatus",
        params,
      }),
    }),
    getFormFields: builder.query<FormFieldsResponse, void>({
      query: () => "getFormFields",
    }),
    addRule: builder.mutation<{ status: boolean; code: number; message: string }, AddRuleRequest>({
      query: (data) => ({
        url: "WA/addRule",
        method: "POST",
        body: data,
      }),
    }),
    updateRule: builder.mutation<{ status: boolean; code: number; message: string }, UpdateRuleRequest>({
      query: (data) => ({
        url: "WA/updateRule",
        method: "PATCH",
        body: data,
      }),
    }),
    deleteRule: builder.mutation<{ status: boolean; code: number; message: string }, string>({
      query: (id) => ({
        url: `WA/deleteRule?id=${id}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const {
  useGetWhatsappRulesQuery,
  useGetLeadStatusQuery,
  useGetFormFieldsQuery,
  useAddRuleMutation,
  useUpdateRuleMutation,
  useDeleteRuleMutation,
} = whatsappApi 