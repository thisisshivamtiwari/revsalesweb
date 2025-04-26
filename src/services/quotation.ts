import { getAuthToken } from './api';

// Base URL from environment variable with fallback
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://rworldbelite.retvenslabs.com';

// Interface for quotation data
export interface Quotation {
  id: string;
  name: string;
  total: number;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

// Interface for API response
export interface QuotationResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    total: number;
    limit: number;
    offset: number;
    quotations: Quotation[];
  };
}

// Interface for single quotation response
export interface SingleQuotationResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    quotation: Quotation;
  };
}

/**
 * Fetch quotations with pagination and search
 * @param pageNumber Page number for pagination
 * @param limit Number of items per page
 * @param search Optional search term
 * @returns Promise with quotation response
 */
export const fetchQuotations = async (
  pageNumber: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<QuotationResponse> => {
  try {
    // Always attempt to call the real API first
    const token = getAuthToken();
    console.log('Auth token retrieved:', token ? `${token.substring(0, 10)}...` : 'null');
    
    if (!token) {
      console.error('No authentication token found');
      
      // Only return mock data in development
      if (process.env.NODE_ENV !== 'production') {
        console.log('No auth token - using mock data');
        return generateMockQuotations(pageNumber, limit, search);
      }
      
      return {
        status: false,
        code: 401,
        message: 'No authentication token found',
        data: {
          total: 0,
          limit,
          offset: pageNumber,
          quotations: []
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

    const apiUrl = `${BASE_URL}/api/sales/quotation/getQuotation?${queryParams.toString()}`;
    console.log(`Fetching quotations from: ${apiUrl}`);

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
          return generateMockQuotations(pageNumber, limit, search);
        }
        
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response data:', data);
      
      // Check if the API response is properly formatted
      if (!data || !data.data || !data.data.quotations) {
        console.error('API response missing expected data structure:', data);
        
        if (process.env.NODE_ENV !== 'production') {
          console.log('Invalid API response format - using mock data in development');
          return generateMockQuotations(pageNumber, limit, search);
        }
        
        throw new Error('Invalid API response format');
      }
      
      return data;
    } catch (apiError) {
      console.error('API call failed:', apiError);
      
      // Only use mock data in development
      if (process.env.NODE_ENV !== 'production') {
        console.log('API call exception - using mock data in development');
        return generateMockQuotations(pageNumber, limit, search);
      }
      
      // In production, return a structured error response
      return {
        status: false,
        code: 500,
        message: apiError instanceof Error ? apiError.message : 'Failed to fetch quotations',
        data: {
          total: 0,
          limit,
          offset: pageNumber,
          quotations: []
        }
      };
    }
  } catch (error) {
    console.error('Error in fetchQuotations:', error);
    
    // Only use mock data in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Using mock data in development due to error:', error);
      return generateMockQuotations(pageNumber, limit, search);
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
        quotations: []
      }
    };
  }
};

/**
 * Fetch a single quotation by ID
 * @param id Quotation ID
 * @returns Promise with quotation data
 */
export const fetchQuotationById = async (id: string): Promise<SingleQuotationResponse> => {
  try {
    // For development, return mock data
    if (process.env.NODE_ENV !== 'production') {
      return {
        status: true,
        code: 200,
        message: 'Quotation fetched successfully',
        data: {
          quotation: generateMockQuotation(id)
        }
      };
    }
    
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${BASE_URL}/api/sales/quotation/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching quotation:', error);
    
    // Return mock data during development
    if (process.env.NODE_ENV !== 'production') {
      return {
        status: true,
        code: 200,
        message: 'Quotation fetched successfully',
        data: {
          quotation: generateMockQuotation(id)
        }
      };
    }
    
    return {
      status: false,
      code: 500,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      data: {
        quotation: {} as Quotation
      }
    };
  }
};

/**
 * Create a new quotation
 * @param quotationData The quotation data to create
 * @returns Promise with the created quotation
 */
export const createQuotation = async (quotationData: Partial<Quotation>): Promise<SingleQuotationResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${BASE_URL}/api/sales/quotations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(quotationData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      status: true,
      code: 201,
      message: 'Quotation created successfully',
      data: {
        quotation: data.quotation
      }
    };
  } catch (error) {
    console.error('Error creating quotation:', error);
    
    // Return mock data during development
    if (process.env.NODE_ENV !== 'production') {
      const newId = `q-${Date.now()}`;
      return {
        status: true,
        code: 201,
        message: 'Mock quotation created successfully',
        data: {
          quotation: {
            id: newId,
            name: quotationData.name || `#QUOT-${Math.floor(Math.random() * 1000)}`,
            total: quotationData.total || Math.floor(Math.random() * 10000) + 1000,
            createdBy: 'u-1',
            createdByName: 'John Doe',
            createdAt: new Date().toISOString()
          }
        }
      };
    }
    
    return {
      status: false,
      code: 500,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      data: {
        quotation: {} as Quotation
      }
    };
  }
};

// Helper function to generate a mock quotation
const generateMockQuotation = (id: string): Quotation => {
  return {
    id,
    name: `#QUOT - ${Math.floor(Math.random() * 100)}`,
    total: Math.floor(Math.random() * 50000) + 5000,
    createdBy: 'm7d495SP',
    createdByName: 'Yukta moolchandani',
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
  };
};

// Helper function to generate mock quotation data for development
const generateMockQuotations = (
  pageNumber: number,
  limit: number,
  search: string
): QuotationResponse => {
  // Create mock data similar to the API response
  const allQuotations: Quotation[] = Array.from({ length: 8 }, (_, i) => {
    return {
      id: `mock_${i + 1}`,
      name: `#QUOT - ${8 - i}`,
      total: [10000, 25000, 40000, 15000, 30000, 20000, 45000, 35000][i % 8],
      createdBy: 'm7d495SP',
      createdByName: 'Yukta moolchandani',
      createdAt: new Date(Date.now() - (i * 30) * 24 * 60 * 60 * 1000).toISOString()
    };
  });
  
  // Filter by search term if provided
  let filteredQuotations = [...allQuotations];
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredQuotations = filteredQuotations.filter(q => 
      q.name.toLowerCase().includes(searchLower) || 
      q.createdByName.toLowerCase().includes(searchLower)
    );
  }
  
  // Calculate pagination
  const totalItems = filteredQuotations.length;
  const startIndex = (pageNumber - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalItems);
  const paginatedQuotations = filteredQuotations.slice(startIndex, endIndex);
  
  return {
    status: true,
    code: 200,
    message: 'Quotations fetched successfully',
    data: {
      total: totalItems,
      limit: limit,
      offset: pageNumber,
      quotations: paginatedQuotations
    }
  };
}; 