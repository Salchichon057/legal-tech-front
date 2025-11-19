import apiClient from '@/lib/api-client';
import { Case, ApiResponse } from '@/types/api';

export interface CreateCaseData {
  title: string;
  description?: string;
  status?: string;
}

export interface UpdateCaseData {
  title?: string;
  description?: string;
}

export interface QueryCasesParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export const casesService = {
  async getCases(params: QueryCasesParams = {}) {
    const { data } = await apiClient.get<ApiResponse<Case[]>>('/cases', { params });
    return data;
  },

  async getCase(id: string) {
    const { data } = await apiClient.get<ApiResponse<Case>>(`/cases/${id}`);
    return data.data;
  },

  async createCase(caseData: CreateCaseData) {
    const { data } = await apiClient.post<ApiResponse<Case>>('/cases', caseData);
    return data.data;
  },

  async updateCase(id: string, caseData: UpdateCaseData) {
    const { data } = await apiClient.patch<ApiResponse<Case>>(`/cases/${id}`, caseData);
    return data.data;
  },

  async deleteCase(id: string) {
    await apiClient.delete(`/cases/${id}`);
  },

  async updateStatus(id: string, status: string) {
    const { data } = await apiClient.patch<ApiResponse<Case>>(`/cases/${id}/status`, { status });
    return data.data;
  },
};
