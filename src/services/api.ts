/**
 * API Service for RevSales
 * Handles all API interactions with the backend
 */

// Base URL should be moved to environment variables in production
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://rworldbelite.retvenslabs.com';

/**
 * Interface for login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Interface for login response data
 */
export interface LoginResponse {
  status: boolean;
  code: number;
  message: string;
  data?: {
    currentScreen: number;
    fullName: string;
    companyId: number;
    role: string;
    profileImg: string;
    token: string;
  };
}

/**
 * Interface for generic export response
 */
export interface ExportResponse {
  status: boolean;
  code: number;
  message: string;
  data?: {
    url?: string;
    [key: string]: any; // This allows for dynamic data types in the response
  };
}

/**
 * Authenticates a user with the given credentials
 * @param credentials - Email and password
 * @returns Promise with login response
 */
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/api/sales/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    // Parse the JSON response
    const data: LoginResponse = await response.json();
    
    // For security reasons, avoid logging sensitive information in production
    if (process.env.NODE_ENV !== 'production') {
      console.log('Login response:', { ...data, data: data.data ? { ...data.data, token: '[REDACTED]' } : undefined });
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    // Return a standardized error response
    return {
      status: false,
      code: 500,
      message: 'An error occurred during login. Please try again.',
    };
  }
};

/**
 * Export data of any type based on selected filters
 * 
 * @param dataType - Type of data to export (leads, tasks, etc.)
 * @param startDate - Start date for date range filter
 * @param endDate - End date for date range filter
 * @param filters - Additional filters specific to the data type
 * @returns Promise with export response containing download URL
 */
export const exportAllData = async (
  dataType: string,
  startDate: string,
  endDate: string,
  filters?: Record<string, string>
): Promise<ExportResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      return {
        status: false,
        code: 401,
        message: 'Authentication token not found. Please log in again.'
      };
    }

    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('startDate', startDate);
    queryParams.append('endDate', endDate);
    
    // Add any additional filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }

    // Select the correct endpoint based on dataType
    let endpoint = '';
    switch (dataType) {
      case 'leads':
        endpoint = '/api/sales/leads/export';
        break;
      case 'tasks':
        endpoint = '/api/sales/tasks/export';
        break;
      case 'proposals':
        endpoint = '/api/sales/proposals/export';
        break;
      case 'scripts':
        endpoint = '/api/sales/scripts/export';
        break;
      case 'meetings':
        endpoint = '/api/sales/meetings/export';
        break;
      default:
        endpoint = '/api/sales/export/all';
    }

    const response = await fetch(`${BASE_URL}${endpoint}?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        status: false,
        code: response.status,
        message: errorData.message || 'Failed to export data. Please try again.'
      };
    }

    const data = await response.json();
    
    // Mock response data for development and testing
    // In production, remove this and use the actual API response
    if (process.env.NODE_ENV !== 'production') {
      // Generate mock data based on the requested data type
      const mockData = generateMockData(dataType, 10);
      
      return {
        status: true,
        code: 200,
        message: 'Data exported successfully',
        data: {
          url: 'https://example.com/download/export-123456.csv', // Mock download URL
          [dataType]: mockData // Add the actual data to the response
        }
      };
    }

    return {
      status: true,
      code: 200,
      message: 'Data exported successfully',
      data: data
    };

  } catch (error) {
    console.error('Error exporting data:', error);
    return {
      status: false,
      code: 500,
      message: error instanceof Error ? error.message : 'An unexpected error occurred while exporting data'
    };
  }
};

// Helper function to generate mock data for development and testing
const generateMockData = (dataType: string, count: number): any[] => {
  const mockData = [];
  
  for (let i = 0; i < count; i++) {
    if (dataType === 'leads') {
      mockData.push({
        id: `lead-${i+1}`,
        firstName: `John${i+1}`,
        lastName: `Doe${i+1}`,
        email: `johndoe${i+1}@example.com`,
        phone: `+1 555-${100+i}`,
        status: ['New', 'Contacted', 'Qualified', 'Proposal', 'Closed'][i % 5],
        owner: `user-${(i % 3) + 1}`,
        source: ['Website', 'Referral', 'Cold Call', 'Event', 'Social Media'][i % 5],
        createdAt: new Date(Date.now() - (i * 86400000)).toISOString() // Days back from today
      });
    } else if (dataType === 'tasks') {
      mockData.push({
        id: `task-${i+1}`,
        title: `Task ${i+1}`,
        description: `This is a sample task description ${i+1}`,
        status: ['Pending', 'In Progress', 'Completed', 'Cancelled'][i % 4],
        assignee: `user-${(i % 3) + 1}`,
        dueDate: new Date(Date.now() + ((i+1) * 86400000)).toISOString(),
        createdAt: new Date(Date.now() - (i * 43200000)).toISOString() // Half days back
      });
    } else if (dataType === 'proposals') {
      mockData.push({
        id: `proposal-${i+1}`,
        title: `Proposal for Client ${i+1}`,
        clientName: `Client ${i+1}`,
        value: 1000 * (i+1),
        status: ['Draft', 'Sent', 'Accepted', 'Rejected'][i % 4],
        createdBy: `user-${(i % 3) + 1}`,
        createdAt: new Date(Date.now() - (i * 86400000)).toISOString()
      });
    } else if (dataType === 'scripts') {
      mockData.push({
        id: `script-${i+1}`,
        title: `Sales Script ${i+1}`,
        version: `1.${i}`,
        category: ['Cold Call', 'Follow Up', 'Demo', 'Closing'][i % 4],
        createdBy: `user-${(i % 3) + 1}`,
        usageCount: i * 5,
        createdAt: new Date(Date.now() - (i * 86400000 * 2)).toISOString() // 2 days back each
      });
    } else if (dataType === 'meetings') {
      mockData.push({
        id: `meeting-${i+1}`,
        title: `Meeting with Client ${i+1}`,
        clientName: `Client ${i+1}`,
        type: ['Discovery', 'Demo', 'Follow-up', 'Closing'][i % 4],
        date: new Date(Date.now() + ((i+1) * 86400000 * 3)).toISOString(), // 3 days forward each
        duration: 30 + (i % 4) * 15, // 30, 45, 60, 75 min
        attendees: [`user-${(i % 3) + 1}`, `client-${i+1}`],
        createdAt: new Date(Date.now() - (i * 86400000)).toISOString()
      });
    } else {
      // Generic data for any other type
      mockData.push({
        id: `item-${i+1}`,
        name: `Item ${i+1}`,
        description: `Description for item ${i+1}`,
        type: dataType,
        createdAt: new Date(Date.now() - (i * 86400000)).toISOString()
      });
    }
  }
  
  return mockData;
};

/**
 * Stores authentication token securely
 * @param token - JWT token from authentication response
 */
export const storeAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

/**
 * Retrieves the stored authentication token
 * @returns The stored token or null if not found
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Removes the stored authentication token (for logout)
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

/**
 * Stores user data in localStorage for quick access
 * @param userData - User data to store
 */
export const storeUserData = (userData: any): void => {
  localStorage.setItem('user_data', JSON.stringify(userData));
};

/**
 * Retrieves stored user data
 * @returns The stored user data or null if not found
 */
export const getUserData = (): any | null => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

/**
 * Removes stored user data (for logout)
 */
export const removeUserData = (): void => {
  localStorage.removeItem('user_data');
};

/**
 * Complete logout functionality
 */
export const logoutUser = (): void => {
  removeAuthToken();
  removeUserData();
}; 
 