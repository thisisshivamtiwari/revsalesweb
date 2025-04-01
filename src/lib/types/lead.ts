export interface LeadRule {
  id: string;
  name: string;
  companyId: number;
  leadSource: string;
  formField: string | null;
  operation: string;
  fieldValue: string;
  assignedTo: string;
  description: string;
  createdBy: string;
  createdAt: string;
  isCampaign: boolean;
  campaignName: string | null;
}

export interface LeadRulesResponse {
  total: number;
  limit: number;
  offset: number;
  rules: LeadRule[];
}

export interface LeadRulesQueryParams {
  limit: number;
  pageNumber: number;
  search?: string;
} 