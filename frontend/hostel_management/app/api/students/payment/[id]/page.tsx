"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function PaymentHistory() {
  const params = useParams();
  const studentId = params.id as string;

  const [paymentHistory, setPaymentHistory] = useState<
    { AmountPaid: number; PaymentDate: string }[]
  >([]);
  const [showHistory, setShowHistory] = useState(false);
  const [amount, setAmount] = useState("");

  const togglePaymentHistory = async () => {
    if (!showHistory) {
      const res = await fetch("http://localhost:3000/students/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id: studentId }),
      });

      const data = await res.json();
      setPaymentHistory(data);
    }

    setShowHistory(!showHistory);
  };

  const handlePayment = async () => {
    if (!amount) return alert("Please enter an amount.");
  
    try {
      const res = await fetch("http://localhost:3000/students/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          studentId,
          amountPaid: Number(amount),
          paymentDate: new Date().toISOString(),
        }),
      });
  
      if (!res.ok) {
        throw new Error("Payment failed");
      }
  
      const result = await res.json();
      alert(`Payment successful: ₹${amount}`);
      setAmount("");
      setShowHistory(false); // Refresh history
      await togglePaymentHistory(); // Re-fetch updated history
    } catch (error) {
      alert("Error processing payment.");
      console.error(error);
    }
  };
  

  return (
    <div style={{
      padding: "2rem",
      maxWidth: "600px",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f9f9f9",
      borderRadius: "8px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Student Fee Portal</h2>

      <div style={{ marginBottom: "2rem" }}>
        <h3>Pay Remaining Fee</h3>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            padding: "0.5rem",
            marginRight: "1rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "60%"
          }}
        />
        <button
          onClick={handlePayment}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Pay
        </button>
      </div>

      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <button
          onClick={togglePaymentHistory}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          {showHistory ? "Hide Payment History" : "Show Payment History"}
        </button>
      </div>

      {showHistory && (
        <div>
          <h3>Payment History</h3>
          {paymentHistory.length === 0 ? (
            <p>No payments found.</p>
          ) : (
            <ul style={{ paddingLeft: "1rem" }}>
              {paymentHistory.map((payment, index) => (
                <li key={index} style={{ marginBottom: "0.5rem" }}>
                  ₹{payment.AmountPaid} on{" "}
                  {new Date(payment.PaymentDate).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
