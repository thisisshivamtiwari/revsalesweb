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
    token: string;
    role: string;
    fullName: string;
    // Add any other user data fields returned by the API
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
export const storeUserData = (userData: { role: string; fullName: string }): void => {
  localStorage.setItem('user_data', JSON.stringify(userData));
};

/**
 * Retrieves stored user data
 * @returns The stored user data or null if not found
 */
export const getUserData = (): { role: string; fullName: string } | null => {
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
 