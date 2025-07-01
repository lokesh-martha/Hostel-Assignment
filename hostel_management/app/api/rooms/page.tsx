"use client";

import React, { useEffect, useState } from "react";
import AdminView from "@/app/component/Adminview";
import StudentView from "@/app/component/Studentview";
import { jwtDecode } from "jwt-decode";

type Room = { RoomNumber: string };
type InactiveRoom = { RoomNumber: string; UserName: string };
type Application = {
  _id: string;
  StudentName: string;
  PreviousRoom: string;
  AppliedRoom: string;
  Status: string;
};
type MyJwtPayload = {
  sub: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
};

const getJwtFromCookie = () => {
  const cookies = document.cookie;
  return (
    cookies
      .split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1] || null
  );
};

export default function RoomsPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [activeRooms, setActiveRooms] = useState<Room[]>([]);
  const [inactiveRooms, setInactiveRooms] = useState<InactiveRoom[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [appliedRooms, setAppliedRooms] = useState<string[]>([]);
  const [activePage, setActivePage] = useState(1);
  const [inactivePage, setInactivePage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const jwt = getJwtFromCookie();
    if (jwt) {
      const decoded = jwtDecode<MyJwtPayload>(jwt);
      setUsername(decoded.username);
      setRole(decoded.role);
    }
  }, []);

  useEffect(() => {
    if (!username || !role) return;

    if (role === "student") {
      fetch(`http://localhost:3000/students/activerooms?username=${username}`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setActiveRooms(data));

      fetch("http://localhost:3000/students/GetStudentDetails", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setInactiveRooms(data));

      fetch("http://localhost:3000/students/applications", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data: Application[]) => {
          setApplications(data);
          const userName = data[0]?.StudentName || "";
          const pendingRooms = data
            .filter(
              (app) => app.StudentName === userName && app.Status === "Pending"
            )
            .map((app) => app.AppliedRoom);
          setAppliedRooms(pendingRooms);
        });
    } else if (role === "admin") {
      fetchApplications();
    }
  }, [username, role]);

  const fetchApplications = async () => {
    const response = await fetch("http://localhost:3000/students/applications", {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    setApplications(data);
  };

  const handleApplyRoom = async (roomNumber: string) => {
    const previousRoom = inactiveRooms[0]?.RoomNumber || "";
    const studentName = username || "";
  
    const response = await fetch("http://localhost:3000/students/applyRoom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        StudentName: studentName,
        PreviousRoom: previousRoom,
        AppliedRoom: roomNumber,
      }),
    });
  
    const result = await response.json();
  
    if (response.ok && !(result.success === false)) {
      setAppliedRooms((prev) => [...prev, roomNumber]);
      setActiveRooms((prev) =>
        prev.filter((room) => room.RoomNumber !== roomNumber)
      );
    }
  
    alert(result.message || "Application submitted.");
  };
  
  

  const handleCancelApplication = async (roomNumber: string) => {
    const studentName = username || "";

    await fetch(`http://localhost:3000/students/applications/DeleteApplication`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        StudentName: studentName,
        AppliedRoom: roomNumber,
      }),
    });

    setAppliedRooms((prev) => prev.filter((room) => room !== roomNumber));
  };

  const handleAccept = async (id: string) => {
    await fetch(`http://localhost:3000/students/applications/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Accepted" }),
    });
    fetchApplications();
  };

  const handleReject = async (id: string) => {
    await fetch(`http://localhost:3000/students/applications/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Rejected" }),
    });
    fetchApplications();
  };

  const paginate = <T,>(data: T[], page: number): T[] =>
    data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const activeTotalPages = Math.ceil(activeRooms.length / itemsPerPage);

  if (!role) return <div>Loading...</div>;

  return role === "admin" ? (
    <AdminView
      applications={applications}
      handleAccept={handleAccept}
      handleReject={handleReject}
    />
  ) : (
    <StudentView
      activeRooms={activeRooms}
      appliedRooms={appliedRooms}
      activePage={activePage}
      inactivePage={inactivePage}
      itemsPerPage={itemsPerPage}
      activeTotalPages={activeTotalPages}
      paginate={paginate}
      handleApplyRoom={handleApplyRoom}
      handleCancelApplication={handleCancelApplication}
      setActivePage={setActivePage}
      setInactivePage={setInactivePage}
    />
  );
}
