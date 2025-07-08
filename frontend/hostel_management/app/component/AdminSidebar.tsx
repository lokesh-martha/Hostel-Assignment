"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";

type MyJwtPayload = {
  sub: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
};

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const cookies = document.cookie;
    const token = cookies
      .split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (token) {
      try {
        const decoded = jwtDecode<MyJwtPayload>(token);
        setRole(decoded.role);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  const handleProtectedRoute = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (role) {
      router.push(path);
    } else {
      router.replace("/authentication");
    }
  };

  const handleProtectedRouteStudent = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    if (role === "admin") {
      router.push(path);
    } else {
      alert("You don't have access to this");
    }
  };

  const isActive = (href: string) => {
    if (href === "/api") {
      return pathname === "/api";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const linkClass = (href: string) =>
    `block hover:text-blue-600 px-3 py-2 rounded-md transition ${
      isActive(href)
        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
        : ""
    }`;

  return (
    <aside className="w-64 bg-slate-100 dark:bg-slate-900 text-gray-800 dark:text-gray-200 p-6 shadow-md">
      <nav className="space-y-4 text-base font-medium">
        <a
          href="/api"
          onClick={(e) => handleProtectedRoute(e, "/api")}
          className={linkClass("/api")}
        >
          🏠 Dashboard
        </a>

        {role === "admin" && (
          <a
            href="/api/students"
            onClick={(e) => handleProtectedRouteStudent(e, "/api/students")}
            className={linkClass("/api/students")}
          >
            👨‍🎓 Students
          </a>
        )}

        {
          <a
            href="/api/rooms"
            onClick={(e) => handleProtectedRoute(e, "/api/rooms")}
            className={linkClass("/api/rooms")}
          >
            🛏️ Rooms
          </a>
        }

        <a
          href="/api/complaints"
          onClick={(e) => handleProtectedRoute(e, "/api/complaints")}
          className={linkClass("/api/complaints")}
        >
          📩 Complaints
        </a>
        <a
          href="/api/notices"
          onClick={(e) => handleProtectedRoute(e, "/api/notices")}
          className={linkClass("/api/notices")}
        >
            📢 Notices
        </a>
      </nav>
    </aside>
  );
}
