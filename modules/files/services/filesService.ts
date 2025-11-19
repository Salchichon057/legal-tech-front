import apiClient from '@/lib/api-client';
import type {
  FileRecord,
  UploadFileResponse,
  GetFilesResponse,
  DownloadUrlResponse,
} from '../types';

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/gif',
];

class FilesService {
  async uploadFile(caseId: string, file: File): Promise<FileRecord> {
    this.validateFile(file);

    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<UploadFileResponse>(
      `/cases/${caseId}/files`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data;
  }

  async getFilesByCase(caseId: string): Promise<FileRecord[]> {
    const response = await apiClient.get<GetFilesResponse>(
      `/cases/${caseId}/files`
    );
    return response.data.data;
  }

  async getDownloadUrl(fileId: string): Promise<string> {
    const response = await apiClient.get<DownloadUrlResponse>(
      `/files/${fileId}/download`
    );
    return response.data.data.downloadUrl;
  }

  async deleteFile(fileId: string): Promise<void> {
    await apiClient.delete(`/files/${fileId}`);
  }

  private validateFile(file: File): void {
    const maxSize = MAX_FILE_SIZE_MB * 1024 * 1024;
    
    if (file.size > maxSize) {
      throw new Error(`File size exceeds maximum of ${MAX_FILE_SIZE_MB}MB`);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error(
        `File type ${file.type} is not allowed. Allowed types: PDF, Word, Images (JPEG, PNG, GIF)`
      );
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

export const filesService = new FilesService();
