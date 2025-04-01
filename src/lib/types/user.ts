export interface Department {
  id: number;
  name: string;
}

export interface Designation {
  id: number;
  name: string;
}

export interface DepartmentResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    departments: Department[];
  };
}

export interface DesignationResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    designations: Designation[];
  };
}

export interface ImageUploadResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    imageUrl: string;
  };
}

export interface UserDetails {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: number;
  profileImg: string;
  departmentId: number;
  departmentName: string;
  designationId: number;
  designationName: string;
}

export interface UserDetailsResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    user: UserDetails;
  };
}

export interface EditUserRequest {
  departmentId?: number;
  designationId?: number;
  phoneNumber?: string;
  fullName?: string;
  email?: string;
  profileImg?: string;
} 