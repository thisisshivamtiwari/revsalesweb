export interface TeamMember {
  userId: string;
  _id: string;
}

export interface Team {
  name: string;
  managerId: string;
  managerName: string;
  members: TeamMember[];
  createdBy: string;
  createdByName: string;
  createdAt: string;
  id: string;
  teamSize: number;
}

export interface TeamResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    totalCount: number;
    limit: number;
    offset: number;
    team: Team[];
  };
}

export interface TeamParams {
  limit?: number;
  offset?: number;
  search?: string;
} 