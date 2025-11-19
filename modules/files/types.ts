export interface FileRecord {
  id: string;
  fileName: string;
  storageKey: string;
  mimeType: string;
  fileSizeBytes: number;
  uploadedAt: string;
  caseId: string;
  uploadedBy: string;
}

export interface DownloadInfo {
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  downloadUrl: string;
  expiresIn: number;
}

export interface UploadFileResponse {
  success: boolean;
  data: FileRecord;
}

export interface GetFilesResponse {
  success: boolean;
  data: FileRecord[];
}

export interface DownloadUrlResponse {
  success: boolean;
  data: DownloadInfo;
}
