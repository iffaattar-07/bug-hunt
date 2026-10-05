import type { Metadata } from 'next';
import './globals.css';
import { LabProvider } from '@/context/LabContext';
import { Navbar } from '@/components/layout/Navbar';
import { SceneBackdrop } from '@/components/ui/SceneBackdrop';
import { Cursor } from '@/components/ui/Cursor';

export const metadata: Metadata = {
  title: 'Bug Hunt | Field Ops Debug Lab',
  description:
    'Find the bug. Prove the fix. An interactive field-ops lab for real software engineering debugging.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="grain flex min-h-screen flex-col bg-ink-900 font-sans text-fg antialiased">
        <SceneBackdrop />
        <Cursor />
        <LabProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </LabProvider>
      </body>
    </html>
  );
}
