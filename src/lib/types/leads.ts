export interface Lead {
  createdAt: string;
  createdTime: string;
  email: string;
  leadId: string;
  leadOrigin: string;
  leadOwner: string;
  leadOwnerName: string;
  leadSource: string;
  name: string;
  phoneNumber: string;
  statuName: string;
  status: string;
  statusColor: string;
  updatedAt: string;
}

export interface LeadsResponse {
  code: number;
  data: {
    leads: Lead[];
    total: number;
  };
} 