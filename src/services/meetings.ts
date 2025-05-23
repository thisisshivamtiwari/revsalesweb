import { getAuthToken } from '@/services/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://rworldbelite.retvenslabs.com';

export interface Meeting {
  _id: string;
  meetingId: string;
  leadId: number;
  companyId: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  organizer: {
    name: string;
    email: string;
  };
  attendees: Array<{
    name: string;
    email: string;
    status: string;
    _id: string;
  }>;
  location: string;
  meetingStatus: string;
  isRecurring: boolean;
  recurrenceDetails: any;
  MOM: string;
  createdBy: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetMeetingsResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    total: number;
    limit: number;
    pageNumber: number;
    meetings: Meeting[];
  };
}

export interface GetMeetingsParams {
  limit?: number;
  pageNumber?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export const getMeetings = async (params: GetMeetingsParams = {}): Promise<GetMeetingsResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      return {
        status: false,
        code: 401,
        message: 'Authentication token not found. Please log in again.',
        data: {
          total: 0,
          limit: 10,
          pageNumber: 1,
          meetings: []
        }
      };
    }

    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);

    const response = await fetch(
      `${BASE_URL}/api/sales/lead/meeting/getMeetings?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GetMeetingsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return {
      status: false,
      code: 500,
      message: error instanceof Error ? error.message : 'An error occurred while fetching meetings',
      data: {
        total: 0,
        limit: 10,
        pageNumber: 1,
        meetings: []
      }
    };
  }
}; 