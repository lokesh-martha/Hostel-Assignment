"use client";
import { useEffect, useState } from "react";
import HomePage from "../component/Homepageview";
import { useUser } from "../context/UserContext";

export default function Home() {
  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const totalRooms = 100;
  const {user}=useUser()

  useEffect(() => {
    fetch("http://localhost:3000/students/GetTotalStudents", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized or failed request");
        }
        return res.json();
      })
      .then((data) => {
        setTotalStudents(data);
      })
      .catch((err) => console.error("Failed to fetch total students:", err));
  }, []);

    if (totalStudents === null) {
      return <div className="text-center mt-20 text-lg">Loading dashboard...</div>;
    }
  

  return <HomePage totalStudents={totalStudents} totalRooms={totalRooms} />;
}