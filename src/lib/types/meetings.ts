export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  status: string;
  attendees: string[];
  location?: string;
}

export interface MeetingsResponse {
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