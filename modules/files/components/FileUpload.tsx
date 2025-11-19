'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUpload: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function FileUpload({ onFileSelect, onUpload, loading, disabled }: FileUploadProps) {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onUpload();
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={handleFileChange}
          disabled={disabled || loading}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
        />
        <Upload className="mb-2 h-10 w-10 text-muted-foreground" />
        <p className="mb-1 text-sm font-medium">
          {t('files.dragDrop')} or <span className="text-primary">browse</span>
        </p>
        <p className="text-xs text-muted-foreground">
          PDF, Word, Images (max 10MB)
        </p>
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
          <div className="flex-1 truncate">
            <p className="text-sm font-medium">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleUploadClick}
              disabled={loading || disabled}
            >
              {loading ? t('common.uploading') : t('files.upload')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={loading || disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
