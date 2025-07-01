"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";
import styles from "./addstudentpage.module.css"; // Import the combined CSS

export default function AddStudentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    UserName: "",
    RoomNumber: "",
    TotalFee: "5000",
    PhoneNumber: "",
    FeePaid: "",
  });

  const [roomOptions, setRoomOptions] = useState<
    { _id: string; RoomNumber: number }[]
  >([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:3000/students/activerooms", {
          method: "GET",
          credentials: "include",
        });

        const result = await res.json();

        if (Array.isArray(result)) {
          setRoomOptions(result);
        } else {
          console.error("Expected array of rooms but got:", result);
        }
      } catch (error) {
        console.error("Failed to fetch room numbers", error);
      }
    };

    fetchRooms();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoomChange = (selectedOption: any) => {
    setFormData((prev) => ({
      ...prev,
      RoomNumber: selectedOption?.value || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const TotalFee = parseFloat(formData.TotalFee);
    const FeePaid = parseFloat(formData.FeePaid);
    const FeeDue = TotalFee - FeePaid;

    const res = await fetch("http://localhost:3000/students", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        TotalFee,
        FeePaid,
        FeeDue,
      }),
    });

    if (res.ok) {
      router.push("/api/students");
    } else {
      alert("Failed to add student");
    }
  };

  const handleGoBack = () => {
    router.push("/api/students");
  };

  const roomOptionsFormatted = roomOptions.map((room) => ({
    value: room.RoomNumber,
    label: room.RoomNumber.toString(),
  }));

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.heading}>Add Student</h2>

        <label className={styles.label}>
          Name
          <input
            type="text"
            name="UserName"
            placeholder="Full name"
            value={formData.UserName}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </label>

        <div className={styles.row}>
          <label className={styles.label} style={{ flex: 1 }}>
            Room Number
            <div style={{ marginTop: "4px" }}>
              <Select
                options={roomOptionsFormatted}
                value={roomOptionsFormatted.find(
                  (option) => option.value === Number(formData.RoomNumber)
                )}
                onChange={handleRoomChange}
                placeholder="Room Number"
                isClearable
                styles={{
                  control: (base) => ({
                    ...base,
                    padding: "2px",
                    borderRadius: "5px",
                    border: "1px solid #d1d5db",
                    fontSize: "0.95rem",
                  }),
                }}
              />
            </div>
          </label>

          <label className={styles.label} style={{ flex: 1 }}>
            Fee Paid
            <input
              type="number"
              name="FeePaid"
              placeholder="Amount paid"
              value={formData.FeePaid}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </label>
        </div>

        <label className={styles.label}>
          Total Fee
          <input
            type="number"
            name="TotalFee"
            placeholder="Total fee"
            value={formData.TotalFee}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Phone Number
          <input
            type="text"
            name="PhoneNumber"
            placeholder="10-digit phone number"
            value={formData.PhoneNumber}
            onChange={handleChange}
            required
            pattern="\d{10}"
            title="Phone number must be exactly 10 digits"
            className={styles.input}
          />
        </label>

        <button type="submit" className={`${styles.button} ${styles.submitButton}`}>
          Submit
        </button>

        <button type="button" onClick={handleGoBack} className={`${styles.button} ${styles.goBackButton}`}>
          Go Back
        </button>
      </form>
    </div>
  );
}
