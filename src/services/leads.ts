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
    const token = getAuthToken();
    const response = await axios.get<QuotationsResponse>(
      `${BASE_URL}/sales/quotation/getQuotation`,
      {
        params: {
          limit,
          pageNumber: page,
          search,
          leadId,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching lead quotations:", error);
    throw error;
  }
};

export interface LeadAudit {
  name: string;
  url: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  leadId: number;
}

export interface GetLeadAuditResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    audit: LeadAudit[];
  };
}

export const getLeadAudit = async (leadId: string | number): Promise<GetLeadAuditResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<GetLeadAuditResponse>(
      `${BASE_URL}/sales/lead/audit/getAudit`,
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
    console.error('Error fetching lead audit:', error);
    throw error;
  }
};

export interface ScriptQuestion {
  id: string;
  questionNumber: number;
  question: string;
  answer: string;
}

export interface ScriptStep {
  id: string;
  name: string;
  stepNumber: number;
  questions: ScriptQuestion[];
}

export interface ScriptWizard {
  id: string;
  name: string;
  steps: ScriptStep[];
}

export interface GetScriptQuestionsResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    wizard: ScriptWizard;
  };
}

export const getLeadScriptQuestions = async (leadId: string | number): Promise<GetScriptQuestionsResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<GetScriptQuestionsResponse>(
      `${BASE_URL}/sales/lead/wizard/getWizardDetails`,
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
    console.error('Error fetching script questions:', error);
    throw error;
  }
};

// Add/Update Script Answers (full wizard)
export interface ScriptAnswerQuestion {
  id: string;
  question: string;
  answer: string;
}
export interface ScriptAnswerStep {
  id: string;
  name: string;
  stepNumber: number;
  questions: ScriptAnswerQuestion[];
}
export interface ScriptAnswerWizard {
  id: string;
  name: string;
  steps: ScriptAnswerStep[];
}
export interface AddOrUpdateScriptAnswersPayload {
  leadId: string | number;
  wizard: ScriptAnswerWizard;
}
export interface AddOrUpdateScriptAnswersResponse {
  status: boolean;
  code: number;
  message: string;
}
export const addOrUpdateScriptAnswers = async (
  payload: AddOrUpdateScriptAnswersPayload
): Promise<AddOrUpdateScriptAnswersResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.post<AddOrUpdateScriptAnswersResponse>(
      `${BASE_URL}/sales/lead/wizard/addScriptAnswer`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding/updating script answers:', error);
    throw error;
  }
};

// Call Summary Types and API
export interface LeadCallSummaryItem {
  phoneNumber: string;
  callType: string;
  leadName: string;
  userName: string;
  count: number;
  duration: string;
}
export interface GetLeadCallSummaryResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    total: number;
    limit: number;
    offset: number;
    calls: LeadCallSummaryItem[];
  };
}
export const getLeadCallSummary = async (
  phoneNumber: string,
  limit: number = 5,
  pageNumber: number = 1
): Promise<GetLeadCallSummaryResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<GetLeadCallSummaryResponse>(
      `${BASE_URL}/sales/lead/call/getCallDetails`,
      {
        params: { phoneNumber, limit, pageNumber },
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching call summary:', error);
    throw error;
  }
};

// Fetch all lead statuses
export interface LeadStatus {
  id: string;
  name: string;
  color: string;
  isAssginedToNewLead: boolean;
  isFinalStatus: boolean;
  isProposal: boolean;
}
export interface GetLeadStatusesResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    total: number;
    limit: number;
    offset: number;
    status: LeadStatus[];
  };
}
export const getLeadStatuses = async (limit = 20, pageNumber = 1, search = ""): Promise<GetLeadStatusesResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<GetLeadStatusesResponse>(
      `${BASE_URL}/sales/lead/getLeadStatus`,
      {
        params: { limit, pageNumber, search },
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching lead statuses:', error);
    throw error;
  }
};

// Update lead status
export interface UpdateLeadStatusResponse {
  status: boolean;
  code: number;
  message: string;
  data: any;
}
export const updateLeadStatus = async (leadId: string | number, status: string): Promise<UpdateLeadStatusResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.patch<UpdateLeadStatusResponse>(
      `${BASE_URL}/sales/lead/updateLeadDetails`,
      { leadId, status },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating lead status:', error);
    throw error;
  }
};

export interface AddNotePayload {
  notes: {
    leadId: number;
    title: string;
    description: string;
  }[];
}

export interface AddNoteResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    alreadyExistNotes: any[];
    addedNotes: {
      leadId: number;
      title: string;
      description: string;
    }[];
  };
}

export const addLeadNotes = async (payload: AddNotePayload): Promise<AddNoteResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.post<AddNoteResponse>(
      `${BASE_URL}/sales/lead/notes/addNotes`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding lead notes:', error);
    throw error;
  }
};






