import { getAuthToken } from './api';

// Base URL from environment variable with fallback
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://rworldbelite.retvenslabs.com';

export interface TaskDistributionRule {
  id: string;
  name: string;
  leadStatus: string;
  type: string;
  deadline: number;
  assignedTo: string | null;
  createdBy: string;
  createdAt: string;
  description: string;
}

export interface GetRulesResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    total: number;
    limit: number;
    offset: number;
    rules: TaskDistributionRule[];
  };
}

export interface FetchRulesParams {
  pageNumber?: number;
  limit?: number;
  search?: string;
}

export async function fetchRules(params: FetchRulesParams = {}): Promise<GetRulesResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const { pageNumber = 1, limit = 6, search = '' } = params;
  
  try {
    const queryParams = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      limit: limit.toString(),
      search: search,
    });

    const response = await fetch(
      `${BASE_URL}/api/sales/task/getRule?${queryParams}`,
      {
        headers: {
          'Authorization': token,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GetRulesResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching task distribution rules:', error);
    throw error;
  }
} 