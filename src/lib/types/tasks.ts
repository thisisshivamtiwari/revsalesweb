export interface Task {
  assignedBy: string;
  assignedTo: string;
  createdAt: string;
  createdBy: string;
  createdFor: string;
  deadline: string;
  description: string;
  id: string;
  leadId: number;
  leadName: string;
  phoneNumber: string;
  taskStatus: 'completed' | 'pending';
  taskTypeName: 'Follow-up' | 'Meeting' | 'Audit' | 'Proposal';
  title: string;
}

export interface TasksResponse {
  code: number;
  data: {
    tasks: Task[];
    total: number;
  };
  message: string;
  status: boolean;
} 