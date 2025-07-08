"use client";
import { useEffect, useState } from "react";
import HomePage from "../component/Homepageview";

export default function Home() {
  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const totalRooms = 100;

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
        // console.log(data);
        setTotalStudents(data);
      })
      .catch((err) => console.error("Failed to fetch total students:", err));
  }, []);

  // const occupiedRooms = totalStudents ?? 0;
  // const availableRooms = totalRooms - occupiedRooms;
    if (totalStudents === null) {
      return <div className="text-center mt-20 text-lg">Loading dashboard...</div>;
    }
  

  return <HomePage totalStudents={totalStudents} totalRooms={totalRooms} />;
  // return (
  //   <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white font-[family-name:var(--font-geist-sans)]">
  //     <main className="flex-grow p-8 sm:p-20">
  //       <h2 className="text-2xl font-bold mb-8 text-center">
  //         Hostel Dashboard
  //       </h2>

  //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 text-center">
  //         <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
  //           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
  //             Total Students
  //           </h3>
  //           <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
  //             {totalStudents === null ? "Loading..." : totalStudents}
  //           </p>
  //         </div>
  //         <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
  //           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
  //             Total Rooms
  //           </h3>
  //           <p className="text-2xl font-bold text-green-600 dark:text-green-400">
  //             {totalRooms}
  //           </p>
  //         </div>
  //         <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
  //           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
  //             Occupied Rooms
  //           </h3>
  //           <p className="text-2xl font-bold text-red-600 dark:text-red-400">
  //             {occupiedRooms}
  //           </p>
  //         </div>
  //         <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
  //           <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
  //             Available Rooms
  //           </h3>
  //           <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
  //             {availableRooms}
  //           </p>
  //         </div>
  //       </div>
  //     </main>
  //   </div>
  // );
}
