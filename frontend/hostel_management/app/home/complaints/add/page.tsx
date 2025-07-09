"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

export default function AddComplaintPage() {
  const {user}=useUser()
  const router = useRouter();
  const [formData, setFormData] = useState({
    UserName: user?.username || "",
    RoomNumber: "",
    Complaint: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/complaints", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) router.push("/home/complaints");
    else alert("Failed to submit complaint");
  };

  const handleGoBack = () => {
    router.push("/home/complaints");
  };

  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "420px",
          width: "100%",
          backgroundColor: "#ffffff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "#111827",
          }}
        >
          Submit Complaint
        </h2>

        <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>
          Name
          <input
            name="UserName"
            placeholder="Your name"
            onChange={handleChange}
            value={formData.UserName}
            required
            readOnly={user?.role !== "admin"}
            style={{
              marginTop: "6px",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              fontSize: "0.95rem",
              width: "100%",
            }}
          />
        </label>

        <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>
          Room Number
          <input
            name="RoomNumber"
            placeholder="Enter room number"
            type="number"
            onChange={handleChange}
            value={formData.RoomNumber}
            required
            style={{
              marginTop: "6px",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              fontSize: "0.95rem",
              width: "100%",
            }}
          />
        </label>

        <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>
          Complaint
          <textarea
            name="Complaint"
            placeholder="Describe your complaint"
            onChange={handleChange}
            value={formData.Complaint}
            required
            rows={4}
            style={{
              marginTop: "6px",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              fontSize: "0.95rem",
              resize: "vertical",
              width: "100%",
            }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: "12px",
            backgroundColor: "#2563eb",
            color: "#fff",
            fontWeight: "600",
            fontSize: "1rem",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>

        <button
          type="button"
          onClick={handleGoBack}
          style={{
            padding: "12px",
            backgroundColor: "#6b7280",
            color: "#fff",
            fontWeight: "600",
            fontSize: "1rem",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
      </form>
    </div>
  );
}
