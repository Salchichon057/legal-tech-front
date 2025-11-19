'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { casesService } from '@/modules/cases/services/casesService';
import { createCaseSchema } from '@/lib/validators/case.validator';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function NewCasePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const validatedData = createCaseSchema.parse({ title, description });
      await casesService.createCase(validatedData);
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create case. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back')}
            </Link>
          </Button>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="container mx-auto max-w-2xl flex-1 px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('cases.newCase')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="title">{t('cases.caseTitle')}</Label>
                <Input
                  id="title"
                  placeholder={t('cases.titlePlaceholder')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t('cases.description')}</Label>
                <textarea
                  id="description"
                  placeholder={t('cases.descriptionPlaceholder')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
              </div>
              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? t('common.loading') : t('cases.create')}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/dashboard">{t('common.cancel')}</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
