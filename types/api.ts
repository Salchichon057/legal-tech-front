export enum CaseStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export interface User {
  id: string;
  cognitoUserId: string;
  email: string;
  name: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Case {
  id: string;
  title: string;
  description?: string;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isDeleted: boolean;
  user?: {
    id: string;
    name: string;
  };
  _count?: {
    files: number;
  };
}

export interface File {
  id: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  uploadedAt: string;
  caseId: string;
  uploadedBy: string;
  isDeleted: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
