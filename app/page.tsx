import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">LegalTech Platform</h1>
          <nav className="flex gap-4">
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center">
        <div className="container max-w-2xl px-4 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight">
            Manage Your Legal Cases
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Professional case management platform for law firms. Organize cases, manage documents, and track progress all in one place.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
