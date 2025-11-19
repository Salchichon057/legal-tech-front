'use client';

import { Download, Trash2, FileText, Image as ImageIcon, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import type { FileRecord } from '../types';

interface FileListProps {
  files: FileRecord[];
  onDownload: (fileId: string, fileName: string) => void;
  onDelete: (fileId: string) => void;
  loading?: boolean;
}

export function FileList({ files, onDownload, onDelete, loading }: FileListProps) {
  const { t } = useTranslation();

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />;
    }
    if (mimeType === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    if (mimeType.includes('word') || mimeType.includes('document')) {
      return <FileText className="h-8 w-8 text-blue-600" />;
    }
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{t('files.noFiles')}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {files.map((file) => (
        <Card key={file.id}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="shrink-0">{getFileIcon(file.mimeType)}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{file.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.fileSizeBytes)} • {formatDate(file.uploadedAt)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(file.id, file.fileName)}
                disabled={loading}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(file.id)}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
