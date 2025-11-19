'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Case, CaseStatus } from '@/types/api';
import { casesService } from '@/modules/cases/services/casesService';
import { filesService, FileRecord } from '@/modules/files';
import { FileUpload, FileList } from '@/modules/files/components';
import { useToast } from '@/hooks/use-toast';

export default function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const loadCase = async () => {
      try {
        const data = await casesService.getCase(id);
        setCaseData(data);
      } catch (error) {
        console.error('Error loading case:', error);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    const loadFiles = async () => {
      try {
        setFilesLoading(true);
        const filesData = await filesService.getFilesByCase(id);
        setFiles(filesData);
      } catch (error) {
        console.error('Error loading files:', error);
        toast({
          title: t('errors.loadFiles'),
          description: t('errors.tryAgain'),
          variant: 'destructive',
        });
      } finally {
        setFilesLoading(false);
      }
    };

    loadCase();
    loadFiles();
  }, [id, router, t, toast]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploadLoading(true);
      await filesService.uploadFile(id, selectedFile);
      
      toast({
        title: t('files.uploadSuccess'),
        description: t('files.fileUploaded'),
      });

      const filesData = await filesService.getFilesByCase(id);
      setFiles(filesData);
      setSelectedFile(null);
      setShowUpload(false);
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: t('errors.uploadFailed'),
        description: error.message || t('errors.tryAgain'),
        variant: 'destructive',
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const downloadUrl = await filesService.getDownloadUrl(fileId);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.click();
      
      toast({
        title: t('files.downloadStarted'),
        description: fileName,
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: t('errors.downloadFailed'),
        description: t('errors.tryAgain'),
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm(t('files.confirmDelete'))) return;

    try {
      setFilesLoading(true);
      await filesService.deleteFile(fileId);
      
      toast({
        title: t('files.deleteSuccess'),
        description: t('files.fileDeleted'),
      });

      const filesData = await filesService.getFilesByCase(id);
      setFiles(filesData);
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: t('errors.deleteFailed'),
        description: t('errors.tryAgain'),
        variant: 'destructive',
      });
    } finally {
      setFilesLoading(false);
    }
  };

  const getStatusColor = (status: CaseStatus) => {
    const colors = {
      [CaseStatus.NEW]: 'bg-blue-100 text-blue-800',
      [CaseStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
      [CaseStatus.COMPLETED]: 'bg-green-100 text-green-800',
      [CaseStatus.ARCHIVED]: 'bg-gray-100 text-gray-800',
    };
    return colors[status];
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (!caseData) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back')}
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{caseData.title}</h1>
              <p className="text-sm text-muted-foreground">
                {t('cases.createdAt')}: {new Date(caseData.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Badge className={getStatusColor(caseData.status)}>
              {t(`status.${caseData.status.toLowerCase()}`)}
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('cases.description')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {caseData.description || 'No description provided'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('files.title')}</CardTitle>
                  <CardDescription>{t('files.description')}</CardDescription>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => setShowUpload(!showUpload)}
                  disabled={uploadLoading || filesLoading}
                >
                  {showUpload ? t('common.cancel') : t('files.uploadFile')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showUpload && (
                <FileUpload
                  onFileSelect={handleFileSelect}
                  onUpload={handleUpload}
                  loading={uploadLoading}
                  disabled={filesLoading}
                />
              )}
              
              {filesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
                </div>
              ) : (
                <FileList
                  files={files}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                  loading={uploadLoading || filesLoading}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
