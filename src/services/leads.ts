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

export interface LeadDetailsOther {
  [key: string]: string;
}

export interface LeadDetails {
  leadId: number;
  formId: number;
  name: string;
  email: string;
  phoneNumber: string;
  createdTime: string;
  city: string;
  leadOwner: string;
  leadOwnerName: string;
  leadOrigin: string;
  leadSource: string;
  campaignId: number;
  campaignName: string;
  amountClosed: number;
  amountProposed: number;
  modifiedBy: string;
  modifiedByName: string;
  status: string;
  statusName: string;
  color: string;
  leadLabel: string;
  labelName: string;
  labelColor: string;
  closingDate: string;
  createdAt: string;
  updatedAt: string;
  expectedClosingDate: string;
  proposalDate: string;
  quotationPitched: string;
  otherDetails: LeadDetailsOther;
}

export interface GetLeadDetailsResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    lead: LeadDetails;
  };
}

export const getLeadDetails = async (leadId: string | number): Promise<GetLeadDetailsResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<GetLeadDetailsResponse>(
      `${BASE_URL}/sales/lead/getLeadDetails`,
      {
        params: { leadId },
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching lead details:', error);
    throw error;
  }
};

export interface LeadActivityItem {
  createdAt: string;
  owner: string;
  ownerName: string;
  activity: string;
}

export interface LeadActivity {
  id: string | number;
  activities: LeadActivityItem[];
}

export interface GetLeadActivityResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    activity: LeadActivity;
  };
}

export const getLeadActivity = async (leadId: string | number): Promise<GetLeadActivityResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<GetLeadActivityResponse>(
      `${BASE_URL}/sales/lead/getLeadActivity`,
      {
        params: { leadId },
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching lead activity:', error);
    throw error;
  }
};

export interface LeadNote {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

export interface GetLeadNotesResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    total: number;
    limit: number;
    offset: number;
    notes: LeadNote[];
  };
}

export const getLeadNotes = async (leadId: string | number, pageNumber = 1, limit = 10): Promise<GetLeadNotesResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<GetLeadNotesResponse>(
      `${BASE_URL}/sales/lead/notes/getNotes`,
      {
        params: { leadId, pageNumber, limit },
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching lead notes:', error);
    throw error;
  }
};

export interface Quotation {
  id: string;
  name: string;
  total: number;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

export interface QuotationsResponse {
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

export const getLeadQuotations = async (
  leadId: string | number,
  page: number = 1,
  limit: number = 3,
  search: string = ""
): Promise<QuotationsResponse> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/sales/quotation/getQuotation?limit=${limit}&pageNumber=${page}&search=${search}&leadId=${leadId}`,
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching lead quotations:", error);
    throw error;
  }
}; 






