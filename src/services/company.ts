import { getAuthToken } from './api';

// Define the base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://rworldbelite.retvenslabs.com';

// Interface for social media links
export interface SocialMedia {
  facebook: string;
  twitter: string;
  linkedIn: string;
  instagram: string;
  youtube: string;
  website: string;
}

// Interface for company address
export interface CompanyAddress {
  latitude: string;
  longitude: string;
  city: string;
  pinCode: string;
  state: string;
  country: string;
  fullAddress: string;
}

// Interface for company details
export interface CompanyDetails {
  socialMedia: SocialMedia;
  address: CompanyAddress;
  companyId: number;
  companyName: string;
  category: string;
  email: string;
  phoneNumber: string;
  managedHotel: number;
  createdAt: string;
  updatedAt: string;
  about: string;
  aboutTeam: string;
  featuredImage: string[];
  profilePic: string;
  slogan: string;
  teamSize: string;
  createdBy: string;
  terms: any[];
  gstNumber: string;
  brandColor: string;
}

// Interface for the API response
export interface GetCompanyDetailsResponse {
  status: boolean;
  code: number;
  message: string;
  data?: {
    companyDetails: CompanyDetails;
  };
}

/**
 * Fetches company details
 * @returns Promise with the response containing company details
 */
export const getCompanyDetails = async (): Promise<GetCompanyDetailsResponse> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        status: false,
        code: 401,
        message: 'Authentication token is missing. Please log in again.',
      };
    }

    const response = await fetch(`${BASE_URL}/api/sales/company/getCompanyDetails`, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    });

    // Parse the JSON response
    const data: GetCompanyDetailsResponse = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error fetching company details:', error);
    // Return a standardized error response
    return {
      status: false,
      code: 500,
      message: 'An error occurred while fetching company details. Please try again.',
    };
  }
};

/**
 * Updates company details
 * @param companyDetails - The updated company details
 * @returns Promise with the response
 */
export const updateCompanyDetails = async (companyDetails: Partial<CompanyDetails>): Promise<{ status: boolean; message: string }> => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        status: false,
        message: 'Authentication token is missing. Please log in again.',
      };
    }

    // This is a placeholder - you'll need to implement the actual API endpoint
    const response = await fetch(`${BASE_URL}/api/sales/company/updateCompanyDetails`, {
      method: 'PUT',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(companyDetails),
    });

    const data = await response.json();
    return {
      status: data.status,
      message: data.message || 'Company details updated successfully',
    };
  } catch (error) {
    console.error('Error updating company details:', error);
    return {
      status: false,
      message: 'An error occurred while updating company details. Please try again.',
    };
  }
}; 