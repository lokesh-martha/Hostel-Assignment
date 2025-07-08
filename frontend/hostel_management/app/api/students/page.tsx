"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./StudentsPage.module.css";

type Student = {
  _id: string;
  Name:string;
  UserName: string;
  RoomNumber: string;
  TotalFee: number;
  FeePaid: number;
  FeeDue: number;
  PhoneNumber: string;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const getJwtFromCookie = () => {
    const cookies = document.cookie;
    return (
      cookies
        .split("; ")
        .find((row) => row.startsWith("jwt="))
        ?.split("=")[1] || null
    );
  };

  useEffect(() => {
    const jwt = getJwtFromCookie();
    if (jwt) {
      setToken(jwt);
    }
  }, []);
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:3000/students/GetStudentDetails", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          console.error("Expected an array but got:", data);
        }
      });
  }, [token]);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (!confirm || !token) return;

    const res = await fetch(`http://localhost:3000/students/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      setStudents((prev) => prev.filter((student) => student._id !== id));
    }
  };

  // console.log(students)
  const filteredStudents = students.filter(
    (student) =>
      (student.Name?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) || student.RoomNumber.toString().includes(searchQuery)
  );

  return (
    <div className={styles.container}>
      <h1>Students</h1>
      <div className={styles.header}>
        <input
          type="text"
          placeholder="Search by name or room..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <button
          onClick={() => router.push("/api/students/add")}
          className={styles.addButton}
        >
          ➕ Add Student
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeader}>
            <th className={styles.tableCell}>Name</th>
            <th className={styles.tableCell}>Room</th>
            <th className={styles.tableCell}>Total Fee</th>
            <th className={styles.tableCell}>Fee Paid</th>
            <th className={styles.tableCell}>Pending Fee</th>
            <th className={styles.tableCell}>Phone Number</th>
            <th className={styles.tableCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student._id}>
              <td className={styles.tableCell}>{student.Name}</td>
              <td className={styles.tableCell}>{student.RoomNumber}</td>
              <td className={styles.tableCell}>₹{student.TotalFee}</td>
              <td className={styles.tableCell}>₹{student.FeePaid}</td>
              <td className={styles.tableCell}>₹{student.FeeDue}</td>
              <td className={styles.tableCell}>{student.PhoneNumber}</td>
              <td className={styles.tableCell}>
                <button
                  className={styles.actionButton}
                  onClick={() =>
                    router.push(`/api/students/edit/${student._id}`)
                  }
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(student._id)}
                  className={styles.actionButton}
                >
                  🗑️
                </button>
                <button
                  onClick={() =>
                    router.push(`/api/students/payment/${student._id}`)
                  }
                  className={styles.actionButton}
                >
                  📄 
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
