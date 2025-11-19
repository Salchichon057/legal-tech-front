'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/shared/language-switcher';
import { authService } from '@/modules/auth/services/authService';
import { registerSchema } from '@/lib/validators/auth.validator';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const validatedData = registerSchema.parse({ name, email, password });
      await authService.register(validatedData);
      const loginResult = await authService.login({ email, password });
      
      if (loginResult.accessToken) {
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push('/dashboard');
      } else {
        throw new Error('Login failed - no token received');
      }
    } catch (err: any) {
      if (err.name === 'ZodError') {
        setError(err.errors[0].message);
      } else if (err?.response?.data?.error?.message) {
        const messages = err.response.data.error.message;
        setError(Array.isArray(messages) ? messages[0] : messages);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('auth.registerError'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('auth.register')}</CardTitle>
          <CardDescription>{t('app.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">{t('auth.name')}</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <PasswordInput
                id="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Must contain uppercase, lowercase, number, and special character
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? `${t('common.loading')}...` : t('auth.registerButton')}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                {t('auth.login')}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
