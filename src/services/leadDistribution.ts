import { getAuthToken } from '@/services/api';

export interface LeadDistributionRule {
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
  id: string;
}

export interface GetRulesResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    total: number;
    limit: number;
    offset: number;
    rules: LeadDistributionRule[];
  };
}

export interface GetRulesParams {
  pageNumber?: number;
  limit?: number;
  search?: string;
}

// Use environment variable for API URL or default to the production URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://rworldbelite.retvenslabs.com';

export const fetchRules = async (params: GetRulesParams = {}): Promise<GetRulesResponse> => {
  try {
    console.log('Fetching lead distribution rules with params:', params);
    
    const token = getAuthToken();
    console.log('Auth token retrieved:', token ? `${token.substring(0, 10)}...` : 'null');
    
    if (!token) {
      console.error("No auth token available");
      return {
        status: false,
        code: 401,
        message: "Authentication required. Please login again.",
        data: {
          total: 0,
          limit: 6,
          offset: 1,
          rules: [],
        },
      };
    }

    const queryParams = new URLSearchParams();
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const apiUrl = `${API_BASE_URL}/api/sales/lead/getRule${queryString}`;
    
    console.log(`Fetching rules from: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    });

    console.log(`API response status: ${response.status}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error(`API error: ${response.status} ${response.statusText}`, errorData);
      return {
        status: false,
        code: response.status,
        message: errorData?.message || `API error: ${response.status} ${response.statusText}`,
        data: {
          total: 0,
          limit: 6,
          offset: 1,
          rules: [],
        },
      };
    }

    const data = await response.json();
    console.log('API response data:', data);
    
    return data;
  } catch (error) {
    console.error("Error fetching lead distribution rules:", error);
    
    return {
      status: false,
      code: 500,
      message: error instanceof Error ? error.message : "Failed to fetch lead distribution rules. Please try again later.",
      data: {
        total: 0,
        limit: 6,
        offset: 1,
        rules: [],
      },
    };
  }
}; 