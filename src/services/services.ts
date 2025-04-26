import { getAuthToken } from './api';

// Base URL from environment variable with fallback
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://rworldbelite.retvenslabs.com';

// Interface for subservice data
export interface Subservice {
  _id: string;
  companyId: number;
  id: string;
  parentId: string;
  name: string;
  price: number;
  isParent: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface for service data
export interface Service {
  id: string;
  name: string;
  price: number;
  isParent: boolean;
  createdAt: string;
  updatedAt: string;
  subservices: Subservice[];
}

// Interface for API response
export interface ServicesResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    total: number;
    limit: number;
    offset: number;
    services: Service[];
  };
}

/**
 * Fetch services with pagination and search
 * @param pageNumber Page number for pagination
 * @param limit Number of items per page
 * @param search Optional search term
 * @returns Promise with services response
 */
export const fetchServices = async (
  pageNumber: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<ServicesResponse> => {
  try {
    // Always attempt to call the real API first
    const token = getAuthToken();
    console.log('Auth token retrieved:', token ? `${token.substring(0, 10)}...` : 'null');
    
    if (!token) {
      console.error('No authentication token found');
      
      // Only return mock data in development
      if (process.env.NODE_ENV !== 'production') {
        console.log('No auth token - using mock data');
        return generateMockServices(pageNumber, limit, search);
      }
      
      return {
        status: false,
        code: 401,
        message: 'No authentication token found',
        data: {
          total: 0,
          limit,
          offset: pageNumber,
          services: []
        }
      };
    }

    const queryParams = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      limit: limit.toString(),
    });

    if (search) {
      queryParams.append('search', search);
    }

    const apiUrl = `${BASE_URL}/api/sales/services/getServices?${queryParams.toString()}`;
    console.log(`Fetching services from: ${apiUrl}`);

    try {
      const response = await fetch(
        apiUrl,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
        }
      );

      // Log the response status for debugging
      console.log(`API response status: ${response.status}`);
      
      if (!response.ok) {
        console.error(`API error: ${response.status}`);
        
        // Only use mock data in development
        if (process.env.NODE_ENV !== 'production') {
          console.log(`API returned ${response.status} - using mock data in development only`);
          return generateMockServices(pageNumber, limit, search);
        }
        
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response data:', data);
      
      // Check if the API response is properly formatted
      if (!data || !data.data || !data.data.services) {
        console.error('API response missing expected data structure:', data);
        
        if (process.env.NODE_ENV !== 'production') {
          console.log('Invalid API response format - using mock data in development');
          return generateMockServices(pageNumber, limit, search);
        }
        
        throw new Error('Invalid API response format');
      }
      
      return data;
    } catch (apiError) {
      console.error('API call failed:', apiError);
      
      // Only use mock data in development
      if (process.env.NODE_ENV !== 'production') {
        console.log('API call exception - using mock data in development');
        return generateMockServices(pageNumber, limit, search);
      }
      
      // In production, return a structured error response
      return {
        status: false,
        code: 500,
        message: apiError instanceof Error ? apiError.message : 'Failed to fetch services',
        data: {
          total: 0,
          limit,
          offset: pageNumber,
          services: []
        }
      };
    }
  } catch (error) {
    console.error('Error in fetchServices:', error);
    
    // Only use mock data in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Using mock data in development due to error:', error);
      return generateMockServices(pageNumber, limit, search);
    }
    
    // In production, return a structured error response
    return {
      status: false,
      code: 500,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      data: {
        total: 0,
        limit,
        offset: pageNumber,
        services: []
      }
    };
  }
};

// Helper function to generate mock service data for development
const generateMockServices = (
  pageNumber: number,
  limit: number,
  search: string
): ServicesResponse => {
  // Create mock data similar to the API response
  const allServices: Service[] = [
    {
      id: "RoA0I5khY4kpjAecgc49CawCLIbs1hp8",
      name: "Branding",
      price: 5000,
      isParent: true,
      createdAt: "2025-02-04T13:27:26.064Z",
      updatedAt: "2025-02-04T13:27:26.064Z",
      subservices: [
        {
          _id: "67a2193025cf1b1eb573e470",
          companyId: 54219705,
          id: "oVBW1q2qp3ULzyWEh99z178n6kLwZfZD",
          parentId: "RoA0I5khY4kpjAecgc49CawCLIbs1hp8",
          name: "Logo Design & Name suggestions",
          price: 0,
          isParent: false,
          isDeleted: false,
          createdAt: "2025-02-04T13:42:08.718Z",
          updatedAt: "2025-02-04T13:42:08.718Z"
        },
        {
          _id: "67a2195525cf1b1eb573e476",
          companyId: 54219705,
          id: "su6Ht2iccbkUPQ9i1hvLij54tV3YkBSt",
          parentId: "RoA0I5khY4kpjAecgc49CawCLIbs1hp8",
          name: "Menus (Restaurant & IRD)",
          price: 0,
          isParent: false,
          isDeleted: false,
          createdAt: "2025-02-04T13:42:45.509Z",
          updatedAt: "2025-02-04T13:42:45.509Z"
        },
      ]
    },
    {
      id: "WuoOnFyRo9s2gcQEzaT9oD04MTGajzWG",
      name: "Performance Marketing",
      price: 5000,
      isParent: true,
      createdAt: "2025-02-04T14:07:00.801Z",
      updatedAt: "2025-02-04T14:07:00.801Z",
      subservices: [
        {
          _id: "67a21f1925cf1b1eb5741de0",
          companyId: 54219705,
          id: "H0RDIclk6pSl1NRXg0lyb14f5xTahYiA",
          parentId: "WuoOnFyRo9s2gcQEzaT9oD04MTGajzWG",
          name: "Google Ads Management",
          price: 0,
          isParent: false,
          isDeleted: false,
          createdAt: "2025-02-04T14:07:21.636Z",
          updatedAt: "2025-02-04T14:07:21.636Z"
        },
      ]
    },
    {
      id: "HjrjjtMtGGhNEBj5AU5L8U6exxuuIitD",
      name: "Photography and Videography",
      price: 10000,
      isParent: true,
      createdAt: "2025-02-04T13:27:39.948Z",
      updatedAt: "2025-02-04T13:27:39.948Z",
      subservices: [
        {
          _id: "67a2189125cf1b1eb573e448",
          companyId: 54219705,
          id: "R5e9jffS1W94ZHa7sGpaiSuaaqQawrTV",
          parentId: "HjrjjtMtGGhNEBj5AU5L8U6exxuuIitD",
          name: "Room Photography (All Categories)",
          price: 0,
          isParent: false,
          isDeleted: false,
          createdAt: "2025-02-04T13:39:29.995Z",
          updatedAt: "2025-02-04T13:39:29.995Z"
        },
      ]
    },
    {
      id: "Jfy6giF4aY80XO69p18AtCnVJZ9mcdjh",
      name: "Revenue Management",
      price: 5000,
      isParent: true,
      createdAt: "2025-02-04T13:24:54.620Z",
      updatedAt: "2025-02-04T13:24:54.620Z",
      subservices: [
        {
          _id: "67a21b9a25cf1b1eb573e4e4",
          companyId: 54219705,
          id: "OMSLvBuwQfMutR49tyDr8IWjs2LoBpSR",
          parentId: "Jfy6giF4aY80XO69p18AtCnVJZ9mcdjh",
          name: "New OTA Contracting",
          price: 0,
          isParent: false,
          isDeleted: false,
          createdAt: "2025-02-04T13:52:26.115Z",
          updatedAt: "2025-02-04T13:52:26.115Z"
        },
      ]
    },
    {
      id: "nog3bNElrBclcG2iWWbHoSisafakNQrg",
      name: "Social Media Marketing",
      price: 5000,
      isParent: true,
      createdAt: "2025-02-04T13:25:23.563Z",
      updatedAt: "2025-02-04T13:25:23.563Z",
      subservices: [
        {
          _id: "67a21e0825cf1b1eb5741d94",
          companyId: 54219705,
          id: "JXJFJRIjeBGKJphjsgSo4v7f7gb7WIpb",
          parentId: "nog3bNElrBclcG2iWWbHoSisafakNQrg",
          name: "Brainstorming on Ideation",
          price: 0,
          isParent: false,
          isDeleted: false,
          createdAt: "2025-02-04T14:02:48.552Z",
          updatedAt: "2025-02-04T14:02:48.552Z"
        },
      ]
    },
    {
      id: "jALDUysWqA8HiObxSOHDM2B62RFWHdFE",
      name: "Website Creation",
      price: 10000,
      isParent: true,
      createdAt: "2025-02-04T13:27:50.032Z",
      updatedAt: "2025-02-04T13:27:50.032Z",
      subservices: [
        {
          _id: "67a216d725cf1b1eb573e3d8",
          companyId: 54219705,
          id: "uKNxenZHff29dXAdZh22hR73mioypyHf",
          parentId: "jALDUysWqA8HiObxSOHDM2B62RFWHdFE",
          name: "Content Writing",
          price: 0,
          isParent: false,
          isDeleted: false,
          createdAt: "2025-02-04T13:32:07.499Z",
          updatedAt: "2025-02-04T13:32:07.499Z"
        },
      ]
    }
  ];
  
  // Filter by search term if provided
  let filteredServices = [...allServices];
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredServices = filteredServices.filter(s => 
      s.name.toLowerCase().includes(searchLower) || 
      s.subservices.some(sub => sub.name.toLowerCase().includes(searchLower))
    );
  }
  
  // Calculate pagination
  const totalItems = filteredServices.length;
  const startIndex = (pageNumber - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalItems);
  const paginatedServices = filteredServices.slice(startIndex, endIndex);
  
  return {
    status: true,
    code: 200,
    message: 'Services fetched successfully',
    data: {
      total: totalItems,
      limit: limit,
      offset: pageNumber,
      services: paginatedServices
    }
  };
}; 


              