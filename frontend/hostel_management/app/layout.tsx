import './globals.css';
import type { ReactNode } from 'react';
import { UserProvider } from './context/UserContext';

export const metadata = {
  title: 'Hostel Management System',
  description: 'Modern dashboard layout with sidebar, header, and footer',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-white font-sans">
        <UserProvider>{children}
        </UserProvider>
      </body>
    </html>
  );
}