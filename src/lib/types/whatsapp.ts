export interface WhatsappRule {
  id: string
  name: string
  leadStatus: string
  createdBy: string
  imageUrl: string
  description: string
  createdAt: string
}

export interface WhatsappRulesResponse {
  status: boolean
  code: number
  message: string
  data: {
    total: number
    limit: number
    offset: number
    rules: WhatsappRule[]
  }
}

export interface WhatsappRulesParams {
  limit?: number
  pageNumber?: number
  search?: string
} 