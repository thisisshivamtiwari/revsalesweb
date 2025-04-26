import { getAuthToken } from './api';

// Define the base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://rworldbelite.retvenslabs.com';

// Interface for a Wizard
export interface Wizard {
  id: string;
  name: string;
  steps: number;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  questions: number;
  assignedLeads: number;
}

// Interface for the API response
export interface GetWizardsResponse {
  status: boolean;
  code: number;
  message: string;
  data?: {
    total: number;
    limit: number;
    offset: number;
    wizards: Wizard[];
  };
}

/**
 * Fetches wizards with pagination and search
 * @param limit - Number of wizards per page
 * @param pageNumber - Current page number
 * @param search - Search query
 * @returns Promise with the response containing wizards
 */
export const getWizards = async (
  limit: number = 10,
  pageNumber: number = 1,
  search: string = ''
): Promise<GetWizardsResponse> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        status: false,
        code: 401,
        message: 'Authentication token is missing. Please log in again.',
      };
    }

    const response = await fetch(
      `${BASE_URL}/api/sales/lead/wizard/getWizard?limit=${limit}&pageNumber=${pageNumber}&search=${encodeURIComponent(search)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      }
    );

    // Parse the JSON response
    const data: GetWizardsResponse = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error fetching wizards:', error);
    // Return a standardized error response
    return {
      status: false,
      code: 500,
      message: 'An error occurred while fetching wizards. Please try again.',
    };
  }
}; 