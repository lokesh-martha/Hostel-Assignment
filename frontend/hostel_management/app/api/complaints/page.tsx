"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ComplaintPage.module.css";


type Complaint = {
  _id: string;
  UserName: string;
  RoomNumber: number;
  Complaint: string;
  Status: "Pending" | "InProgress" | "Resolved" | "Closed";
};

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const deleteComplaint = async (id: string) => {
    const res = await fetch(`http://localhost:3000/complaints/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    }
  };
  useEffect(() => {
    const url = "http://localhost:3000/complaints";

    fetch(url, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setComplaints(data))
      .catch((error) => console.error("Error fetching complaints:", error));
  }, []);

  const updateStatus = async (id: string, status: Complaint["Status"]) => {
    const res = await fetch(`http://localhost:3000/complaints/${id}/status`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ Status: status }),
    });

    if (res.ok) {
      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? { ...c, Status: status } : c))
      );
    }
  };
  const filteredComplaints = complaints.filter(
    (complaint) =>
      (complaint.UserName?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) || complaint.RoomNumber.toString().includes(searchQuery)
  );

  return (
    <div className={styles.container}>
  <h1 className={styles.title}>Complaints</h1>

  <div className={styles.header}>
    <input
      type="text"
      placeholder="Search by name or room..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className={styles.searchInput}
    />
    <button
      onClick={() => router.push("/api/complaints/add")}
      className={styles.addButton}
    >
      ➕ Add Complaint
    </button>
  </div>

  <table className={styles.table}>
    <thead>
      <tr className={styles.tableHeader}>
        <th>Name</th>
        <th>Room</th>
        <th>Complaint</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredComplaints.map((c) => (
        <tr key={c._id}>
          <td>{c.UserName}</td>
          <td>{c.RoomNumber}</td>
          <td>{c.Complaint}</td>
          <td>
            <select
              value={c.Status}
              onChange={(e) =>
                updateStatus(c._id, e.target.value as Complaint["Status"])
              }
              className={styles.statusSelect}
            >
              <option value="Pending">Pending</option>
              <option value="InProgress">InProgress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </td>
          <td>
            <button
              onClick={() => deleteComplaint(c._id)}
              className={styles.deleteButton}
            >
              🗑️ Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
}
