'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Case, CaseStatus } from '@/types/api';
import { casesService } from '@/modules/cases/services/casesService';
import { authService } from '@/modules/auth/services/authService';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { FileText, Plus, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!authService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);

        try {
          const casesData = await casesService.getCases({ page: 1, limit: 20 });
          setCases(casesData.data || []);
        } catch (casesError) {
          console.warn('Could not load cases:', casesError);
          setCases([]);
        }
      } catch (error) {
        console.error('Dashboard load error:', error);
        authService.logout();
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
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
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">LegalTech Platform</h1>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">{t('dashboard.title')}</h2>
            <p className="text-muted-foreground">{t('dashboard.welcomeBack')}</p>
          </div>
          <Button asChild>
            <Link href="/cases/new">
              <Plus className="mr-2 h-4 w-4" />
              {t('dashboard.createCase')}
            </Link>
          </Button>
        </div>

        {cases.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">{t('dashboard.noCases')}</h3>
              <p className="mb-4 text-center text-muted-foreground">
                {t('dashboard.createFirst')}
              </p>
              <Button asChild>
                <Link href="/cases/new">{t('dashboard.createCase')}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cases.map((caseItem) => (
              <Card key={caseItem.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{caseItem.title}</CardTitle>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(caseItem.status)}`}
                    >
                      {caseItem.status.replace('_', ' ')}
                    </span>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {caseItem.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {caseItem._count?.files || 0} file{caseItem._count?.files !== 1 && 's'}
                    </span>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/cases/${caseItem.id}`}>View</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
