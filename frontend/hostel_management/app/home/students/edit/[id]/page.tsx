"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;

  const [formData, setFormData] = useState({
    UserName: "",
    RoomNumber: "",
    TotalFee: "",
    FeePaid: "",
    PhoneNumber: "",
  });

  const [roomOptions, setRoomOptions] = useState<
    { _id: string; RoomNumber: number }[]
  >([]);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId) return;
      const res = await fetch(`http://localhost:3000/students/${studentId}`, {
        credentials: "include",
      });
      const data = await res.json();
      setFormData({
        UserName: data.UserName || "",
        RoomNumber: data.RoomNumber?.toString() || "",
        TotalFee: data.TotalFee?.toString() || "",
        FeePaid: data.FeePaid?.toString() || "",
        PhoneNumber: data.PhoneNumber?.toString() || "",
      });
    };

    const fetchRooms = async () => {
      const res = await fetch("http://localhost:3000/students/activerooms", {
        credentials: "include",
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setRoomOptions(data);
      } else {
        console.error("Expected array of rooms but got:", data);
      }
    };

    fetchStudent();
    fetchRooms();
  }, [studentId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClick = () => {
    router.push("/home/students");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const TotalFee = parseFloat(formData.TotalFee);
    const FeePaid = parseFloat(formData.FeePaid);
    const FeeDue = TotalFee - FeePaid;

    const res = await fetch(`http://localhost:3000/students/${studentId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, TotalFee, FeePaid, FeeDue }),
    });

    const response = await res.json();
    if (res.ok) {
      router.push("/home/students");
    } else {
      alert(response.message || "Failed to update student");
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem", // reduced gap between fields
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "#fff",
          padding: "1.25rem", // reduced padding
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Edit Student
        </h2>

        <label
          style={{ fontSize: "0.9rem", fontWeight: 500, marginBottom: "2px" }}
        >
          Name
        </label>
        <input
          name="UserName"
          value={formData.UserName}
          onChange={handleChange}
          placeholder="Enter full name"
          required
          style={{ ...inputStyle, marginTop: "1px" }}
        />

        <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>
          Room Number
          <select
            name="RoomNumber"
            value={formData.RoomNumber}
            onChange={handleChange}
            required
            style={{
              marginTop: "1px",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #d1d5db",
              fontSize: "0.95rem",
              width: "100%",
            }}
          >
            {/* Show previous room if not in active list */}
            {!roomOptions.some(
              (room) => room.RoomNumber.toString() === formData.RoomNumber
            ) &&
              formData.RoomNumber && (
                <option value={formData.RoomNumber}>
                  Room {formData.RoomNumber} (Previous)
                </option>
              )}

            {/* Active room options */}
            {roomOptions.map((room) => (
              <option key={room._id} value={room.RoomNumber.toString()}>
                Room {room.RoomNumber}
              </option>
            ))}
          </select>
        </label>

        <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>Total Fee</label>
        <input
          name="TotalFee"
          value={formData.TotalFee}
          onChange={handleChange}
          placeholder="Enter total fee"
          type="number"
          required
          style={inputStyle}
        />

        <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>Fee Paid</label>
        <input
          name="FeePaid"
          value={formData.FeePaid}
          onChange={handleChange}
          placeholder="Enter fee paid"
          type="number"
          required
          style={inputStyle}
        />

        <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>
          Phone Number
        </label>
        <input
          name="PhoneNumber"
          value={formData.PhoneNumber}
          onChange={handleChange}
          placeholder="Enter 10-digit phone number"
          type="text"
          pattern="\d{10}"
          title="Phone number must be exactly 10 digits"
          required
          style={inputStyle}
        />

        <button type="submit" style={submitButtonStyle}>
          Update
        </button>
        <button type="button" onClick={handleClick} style={backButtonStyle}>
          Go Back
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: "2px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const submitButtonStyle = {
  padding: "5px",
  backgroundColor: "#0070f3",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const backButtonStyle = {
  padding: "10px",
  backgroundColor: "#6b7280",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
