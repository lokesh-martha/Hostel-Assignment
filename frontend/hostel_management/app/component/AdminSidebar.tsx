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
    if (href === "/home") {
      return pathname === "/home";
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
          href="/home"
          onClick={(e) => handleProtectedRoute(e, "/home")}
          className={linkClass("/home")}
        >
          🏠 Dashboard
        </a>

        {role === "admin" && (
          <a
            href="/home/students"
            onClick={(e) => handleProtectedRouteStudent(e, "/home/students")}
            className={linkClass("/home/students")}
          >
            👨‍🎓 Students
          </a>
        )}

        {
          <a
            href="/home/rooms"
            onClick={(e) => handleProtectedRoute(e, "/home/rooms")}
            className={linkClass("/home/rooms")}
          >
            🛏️ Rooms
          </a>
        }

        <a
          href="/home/complaints"
          onClick={(e) => handleProtectedRoute(e, "/home/complaints")}
          className={linkClass("/home/complaints")}
        >
          📩 Complaints
        </a>
        <a
          href="/home/notices"
          onClick={(e) => handleProtectedRoute(e, "/home/notices")}
          className={linkClass("/home/notices")}
        >
            📢 Notices
        </a>
      </nav>
    </aside>
  );
}
