import axios from 'axios';
import { getAuthToken } from './api';

const BASE_URL = 'https://rworldbelite.retvenslabs.com/api';

export interface Lead {
  formId: number;
  name: string;
  email: string;
  city: string;
  phoneNumber: string;
  leadOrigin: string | null;
  leadSource: string | null;
  leadOwner: string;
  leadOwnerName: string;
  status: string | null;
  statuName: string | null;
  statusColor: string | null;
  leadLabel: string | null;
  leadLabelName: string | null;
  leadLabelColor: string | null;
  createdTime: string;
  createdAt: string;
  updatedAt: string;
  leadId: number;
}

export interface LeadsResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    total: number;
    limit: number;
    offset: number;
    leads: Lead[];
  };
}

export const getLeads = async (
  startDate: string,
  endDate: string,
  status: string = '',
  limit: number = 100,
  offset: number = 1
): Promise<LeadsResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<LeadsResponse>(
      `${BASE_URL}/sales/lead/getTodaysLeads`,
      {
        params: {
          startDate,
          endDate,
          status,
          limit,
          offset,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
}; 