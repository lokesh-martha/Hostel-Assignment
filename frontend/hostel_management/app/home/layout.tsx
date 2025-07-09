import type { ReactNode } from "react";
import ApiClientLayout from "../component/ApiLayout";

export const metadata = {
  title: "Hostel Management System",
  description: "Modern dashboard layout with sidebar, header, and footer",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-white font-sans">
      <ApiClientLayout>{children}</ApiClientLayout>
    </div>
  );
}
