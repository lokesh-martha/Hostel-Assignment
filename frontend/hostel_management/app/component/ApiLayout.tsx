"use client";

import Header from "./Header";
import Footer from "./Footer";
import { ReactNode, useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { jwtDecode } from "jwt-decode";
import { useUser } from "../context/UserContext";

type MyJwtPayload = {
  role: string;
  username: string;
  exp: number;
};

export default function ApiClientLayout({ children }: { children: ReactNode }) {
  const {user}=useUser()
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = user?.token;
    if (token) {
      const decoded = jwtDecode<MyJwtPayload>(token);
      setRole(decoded.role);
    }
  }, []);

  return (
    <>
      <Header />
      <div className="flex flex-1">
        <AdminSidebar /> 
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
      <Footer />
    </>
  );
}
