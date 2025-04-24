import { getAuthToken } from './api';

// Define the base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://rworldbelite.retvenslabs.com';

// Interface for a sub-service
export interface SubService {
  serviceId: string;
  count: number;
  serviceName: string;
}

// Interface for a service category
export interface ServiceCategory {
  serviceId?: string;
  serviceName: string | null;
  subServices: SubService[];
}

// Interface for a package
export interface Package {
  id: string;
  name: string;
  total: number;
  isMonthly: boolean;
  description: string;
  createdBy: string;
  createdByName: string;
  services: ServiceCategory[];
}

// Interface for the API response
export interface GetPackagesResponse {
  status: boolean;
  code: number;
  message: string;
  data?: {
    total: number;
    limit: number;
    offset: number;
    packages: Package[];
  };
}

/**
 * Fetches packages with pagination and search
 * @param limit - Number of packages per page
 * @param pageNumber - Current page number
 * @param search - Search query
 * @returns Promise with the response containing packages
 */
export const getPackages = async (
  limit: number = 10,
  pageNumber: number = 1,
  search: string = ''
): Promise<GetPackagesResponse> => {
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
      `${BASE_URL}/api/sales/package/getPackage?limit=${limit}&pageNumber=${pageNumber}&search=${encodeURIComponent(search)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      }
    );

    // Parse the JSON response
    const data: GetPackagesResponse = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error fetching packages:', error);
    // Return a standardized error response
    return {
      status: false,
      code: 500,
      message: 'An error occurred while fetching packages. Please try again.',
    };
  }
}; 