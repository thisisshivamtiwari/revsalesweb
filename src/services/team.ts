import { getAuthToken } from '@/services/api';

export interface TeamMember {
  userId: string;
  _id: string;
}

export interface Team {
  name: string;
  managerId: string;
  managerName: string;
  members: TeamMember[];
  createdBy: string;
  createdByName: string;
  createdAt: string;
  id: string;
  teamSize: number;
}

export interface GetTeamsResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    totalCount: number;
    limit: number;
    offset: number;
    team: Team[];
  };
}

export interface GetTeamsParams {
  pageNumber?: number;
  search?: string;
}

// Use environment variable for API URL or default to the production URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://rworldbelite.retvenslabs.com';

export const fetchTeams = async (params: GetTeamsParams = {}): Promise<GetTeamsResponse> => {
  try {
    console.log('Fetching teams with params:', params);
    
    const token = getAuthToken();
    console.log('Auth token retrieved:', token ? `${token.substring(0, 10)}...` : 'null');
    
    if (!token) {
      console.error("No auth token available");
      return {
        status: false,
        code: 401,
        message: "Authentication required. Please login again.",
        data: {
          totalCount: 0,
          limit: 10,
          offset: 0,
          team: [],
        },
      };
    }

    const queryParams = new URLSearchParams();
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const apiUrl = `${API_BASE_URL}/api/sales/team/getTeam${queryString}`;
    
    console.log(`Fetching teams from: ${apiUrl}`);
    
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
          totalCount: 0,
          limit: 10,
          offset: 0,
          team: [],
        },
      };
    }

    const data = await response.json();
    console.log('API response data:', data);
    
    return data;
  } catch (error) {
    console.error("Error fetching teams:", error);
    
    return {
      status: false,
      code: 500,
      message: error instanceof Error ? error.message : "Failed to fetch teams. Please try again later.",
      data: {
        totalCount: 0,
        limit: 10,
        offset: 0,
        team: [],
      },
    };
  }
}; 