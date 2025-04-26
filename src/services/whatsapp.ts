import { getAuthToken } from './api';

// Define the base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://rworldbelite.retvenslabs.com';

// Interface for a WhatsApp rule
export interface WhatsAppRule {
  id: string;
  name: string;
  description: string;
  leadStatus: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  isActive: boolean;
  triggerType: string;
  triggerValue: string;
  imageUrl?: string;
  messageTemplate?: string;
}

// Interface for the API response
export interface WhatsAppResponse {
  status: boolean;
  message: string;
  data?: {
    rules: WhatsAppRule[];
    total: number;
  };
}

/**
 * Fetches WhatsApp automation rules with pagination and search
 * @param limit - Number of rules per page
 * @param pageNumber - Current page number
 * @param search - Search query
 * @returns Promise with the response containing WhatsApp rules
 */
export async function getWhatsAppRules(
  limit: number = 10, 
  page: number = 1, 
  searchQuery: string = ''
): Promise<WhatsAppResponse> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        status: false,
        message: 'Authentication required'
      };
    }
    
    // In a real implementation, this would be an API call
    // For now, we'll return mock data
    
    // Mock delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate mock data based on the search query
    const mockRules = generateMockRules(searchQuery);
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRules = mockRules.slice(startIndex, endIndex);
    
    return {
      status: true,
      message: 'WhatsApp rules fetched successfully',
      data: {
        rules: paginatedRules,
        total: mockRules.length
      }
    };
  } catch (error) {
    console.error('Error fetching WhatsApp rules:', error);
    return {
      status: false,
      message: 'Failed to fetch WhatsApp rules'
    };
  }
}

/**
 * Create a new WhatsApp rule
 * @param rule - The rule to create
 * @returns Promise with the response containing the created rule
 */
export async function createWhatsAppRule(rule: Omit<WhatsAppRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<WhatsAppResponse> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        status: false,
        message: 'Authentication required'
      };
    }
    
    // In a real implementation, this would be an API call
    // For now, we'll return mock success
    
    // Mock delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      status: true,
      message: 'WhatsApp rule created successfully'
    };
  } catch (error) {
    console.error('Error creating WhatsApp rule:', error);
    return {
      status: false,
      message: 'Failed to create WhatsApp rule'
    };
  }
}

/**
 * Update an existing WhatsApp rule
 * @param id - The ID of the rule to update
 * @param rule - The partial rule to update
 * @returns Promise with the response containing the updated rule
 */
export async function updateWhatsAppRule(id: string, rule: Partial<WhatsAppRule>): Promise<WhatsAppResponse> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        status: false,
        message: 'Authentication required'
      };
    }
    
    // In a real implementation, this would be an API call
    // For now, we'll return mock success
    
    // Mock delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      status: true,
      message: 'WhatsApp rule updated successfully'
    };
  } catch (error) {
    console.error('Error updating WhatsApp rule:', error);
    return {
      status: false,
      message: 'Failed to update WhatsApp rule'
    };
  }
}

/**
 * Delete an existing WhatsApp rule
 * @param id - The ID of the rule to delete
 * @returns Promise with the response indicating the rule was deleted
 */
export async function deleteWhatsAppRule(id: string): Promise<WhatsAppResponse> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        status: false,
        message: 'Authentication required'
      };
    }
    
    // In a real implementation, this would be an API call
    // For now, we'll return mock success
    
    // Mock delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      status: true,
      message: 'WhatsApp rule deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting WhatsApp rule:', error);
    return {
      status: false,
      message: 'Failed to delete WhatsApp rule'
    };
  }
}

/**
 * Get a specific WhatsApp rule by ID
 * @param id - The ID of the rule to fetch
 * @returns Promise with the response containing the rule
 */
export async function getWhatsAppRuleById(id: string): Promise<WhatsAppResponse> {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return {
        status: false,
        message: 'Authentication required'
      };
    }
    
    // In a real implementation, this would be an API call
    // For now, we'll return mock data
    
    // Mock delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Find the rule in our mock data
    const mockRules = generateMockRules();
    const rule = mockRules.find(rule => rule.id === id);
    
    if (!rule) {
      return {
        status: false,
        message: 'WhatsApp rule not found'
      };
    }
    
    return {
      status: true,
      message: 'WhatsApp rule fetched successfully',
      data: {
        rules: [rule],
        total: 1
      }
    };
  } catch (error) {
    console.error('Error fetching WhatsApp rule:', error);
    return {
      status: false,
      message: 'Failed to fetch WhatsApp rule'
    };
  }
}

// Helper function to generate mock data
function generateMockRules(searchQuery: string = ''): WhatsAppRule[] {
  const statuses = ['New Lead', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  const templates = [
    'Welcome to our business! We appreciate your interest.',
    'Thank you for your inquiry, a representative will contact you shortly.',
    'We noticed you haven\'t responded to our last message, are you still interested?',
    'Your proposal is ready for review, please check your email.',
    'Congratulations! Your deal has been approved.'
  ];
  
  const mockData: WhatsAppRule[] = [];
  
  // Generate 15 mock rules
  for (let i = 1; i <= 15; i++) {
    const name = `Rule ${i}: Follow-up ${i % 3 === 0 ? 'for new leads' : i % 2 === 0 ? 'after quotation' : 'for potential clients'}`;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const template = templates[Math.floor(Math.random() * templates.length)];
    const description = `Automatically sends a WhatsApp message when a lead status changes to ${status}. ${i % 2 === 0 ? 'Includes follow-up reminders.' : 'One-time message only.'}`;
    
    mockData.push({
      id: `rule-${i}`,
      name,
      description,
      leadStatus: status,
      createdBy: i % 3 === 0 ? 'John Doe' : i % 2 === 0 ? 'Jane Smith' : 'Mike Johnson',
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
      isActive: i % 4 !== 0,
      triggerType: 'status_change',
      triggerValue: status,
      messageTemplate: template,
      imageUrl: i % 3 === 0 ? `https://placehold.co/600x400/25D366/ffffff?text=WhatsApp+Template+${i}` : undefined
    });
  }
  
  // Filter based on search query if provided
  if (searchQuery) {
    const lowercaseQuery = searchQuery.toLowerCase();
    return mockData.filter(rule => 
      rule.name.toLowerCase().includes(lowercaseQuery) || 
      rule.description.toLowerCase().includes(lowercaseQuery) ||
      rule.leadStatus.toLowerCase().includes(lowercaseQuery)
    );
  }
  
  return mockData;
} 