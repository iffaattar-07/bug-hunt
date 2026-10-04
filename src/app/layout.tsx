import type { Metadata } from 'next';
import './globals.css';
import { LabProvider } from '@/context/LabContext';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'Bug Hunt | Interactive Developer Debugging Lab',
  description: 'Find the bug. Understand the failure. Prove the fix. An interactive developer debugging lab.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dev-bg text-dev-text antialiased min-h-screen flex flex-col font-sans">
        <LabProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
        </LabProvider>
      </body>
    </html>
  );
}
