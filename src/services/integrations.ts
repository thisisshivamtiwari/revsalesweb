import { getAuthToken } from './api';

// Define the base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://rworldbelite.retvenslabs.com';

// Interface for a single integration app
export interface IntegrationApp {
  appName: string;
  appId: string;
  logo: string;
  buttons: string[];
}

// Interface for the API response
export interface GetIntegrationsResponse {
  status: boolean;
  code: number;
  message: string;
  data?: IntegrationApp[];
}

/**
 * Fetches all integration applications for a company
 * @param companyId - The company ID to fetch integrations for
 * @returns Promise with the response containing integration apps
 */
export const getIntegrationApps = async (companyId: number): Promise<GetIntegrationsResponse> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        status: false,
        code: 401,
        message: 'Authentication token is missing. Please log in again.',
      };
    }

    const response = await fetch(`${BASE_URL}/api/sales/lead/getLeadApp?companyId=${companyId}`, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    });

    // Parse the JSON response
    const data: GetIntegrationsResponse = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error fetching integration apps:', error);
    // Return a standardized error response
    return {
      status: false,
      code: 500,
      message: 'An error occurred while fetching integrations. Please try again.',
    };
  }
};

/**
 * Unlinks an integration application
 * @param companyId - The company ID
 * @param appId - The application ID to unlink
 * @returns Promise with the response
 */
export const unlinkIntegration = async (companyId: number, appId: string): Promise<{ status: boolean; message: string }> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        status: false,
        message: 'Authentication token is missing. Please log in again.',
      };
    }

    // This is a placeholder - you'll need to implement the actual API endpoint
    const response = await fetch(`${BASE_URL}/api/sales/lead/unlinkApp`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        companyId,
        appId
      }),
    });

    const data = await response.json();
    return {
      status: data.status,
      message: data.message || 'Integration unlinked successfully',
    };
  } catch (error) {
    console.error('Error unlinking integration:', error);
    return {
      status: false,
      message: 'An error occurred while unlinking the integration. Please try again.',
    };
  }
};

/**
 * Opens the page management interface for a social media app
 * @param appId - The application ID to manage pages for
 * @returns Promise with the response containing the management URL
 */
export const manageIntegrationPages = async (appId: string): Promise<{ status: boolean; message: string; url?: string }> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        status: false,
        message: 'Authentication token is missing. Please log in again.',
      };
    }

    // This is a placeholder - you'll need to implement the actual API endpoint
    const response = await fetch(`${BASE_URL}/api/sales/lead/managePages`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appId
      }),
    });

    const data = await response.json();
    return {
      status: data.status,
      message: data.message || 'Redirecting to manage pages...',
      url: data.data?.url,
    };
  } catch (error) {
    console.error('Error managing integration pages:', error);
    return {
      status: false,
      message: 'An error occurred while accessing page management. Please try again.',
    };
  }
}; 