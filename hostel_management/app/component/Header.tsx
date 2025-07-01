"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie;
      const jwtToken = cookies
        .split("; ")
        .find((row) => row.startsWith("jwt="))
        ?.split("=")[1];

      setIsAuthenticated(!!jwtToken);
    };

    checkAuth();

    const interval = setInterval(checkAuth, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      process.env.token='';
      process.env.username='';
      process.env.role='';
      // alert(data.message);
      router.push("/authentication");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLogin = () => {
    router.push("/authentication");
  };

  return (
    <header className="bg-slate-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">🏠 Hostel Management</h1>
      <nav className="space-x-6 text-sm">
        {isAuthenticated ? (
          <button onClick={handleLogout} className="hover:underline">
            🔓 Logout
          </button>
        ) : (
          <button onClick={handleLogin} className="hover:underline">
            🔐 Login
          </button>
        )}
      </nav>
    </header>
  );
}
