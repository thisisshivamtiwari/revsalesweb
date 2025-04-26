import { getAuthToken } from './api';

// Define the base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://rworldbelite.retvenslabs.com';

// Interface for a WhatsApp rule
export interface WhatsAppRule {
  id: string;
  name: string;
  leadStatus: string;
  createdBy: string;
  imageUrl: string;
  description: string;
  createdAt: string;
}

// Interface for the API response
export interface GetWhatsAppRulesResponse {
  status: boolean;
  code: number;
  message: string;
  data?: {
    total: number;
    limit: number;
    offset: number;
    rules: WhatsAppRule[];
  };
}

/**
 * Fetches WhatsApp automation rules with pagination and search
 * @param limit - Number of rules per page
 * @param pageNumber - Current page number
 * @param search - Search query
 * @returns Promise with the response containing WhatsApp automation rules
 */
export const getWhatsAppRules = async (
  limit: number = 10,
  pageNumber: number = 1,
  search: string = ''
): Promise<GetWhatsAppRulesResponse> => {
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
      `${BASE_URL}/api/sales/lead/WA/getRule?limit=${limit}&pageNumber=${pageNumber}&search=${encodeURIComponent(search)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      }
    );

    // Parse the JSON response
    const data: GetWhatsAppRulesResponse = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error fetching WhatsApp rules:', error);
    // Return a standardized error response
    return {
      status: false,
      code: 500,
      message: 'An error occurred while fetching WhatsApp automation rules. Please try again.',
    };
  }
}; 