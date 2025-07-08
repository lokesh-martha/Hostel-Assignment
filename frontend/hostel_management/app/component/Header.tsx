"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [feeDue, setFeeDue] = useState(false);
  const [feeAmount, setFeeAmount] = useState(0);
  const [showFeeDetails, setShowFeeDetails] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(true); 
  const [username, setUsername] = useState<string|undefined>(""); 

  useEffect(() => {
    setUsername(process.env.username)
    if (!isAuthenticated || !username) return;

    const eventSource = new EventSource(`http://localhost:3000/students/fee-status/${username}`,{
      withCredentials:true
    });

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setFeeDue(data.feeDue > 0);
        setFeeAmount(data.feeDue);
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [isAuthenticated, username]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsAuthenticated(false);
      setUsername("");
      router.push("/authentication");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLogin = () => {
    router.push("/authentication");
  };

  return (
    <header className="bg-slate-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">🏠 Hostel Management</h1>
      <nav className="space-x-6 text-sm flex items-center relative">
        {feeDue && (
          <div className="relative">
            <button onClick={() => setShowFeeDetails(!showFeeDetails)} className="text-xl relative">
              🔔
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {showFeeDetails && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg p-4 z-10">
                <p className="font-semibold">Fee Due</p>
                <p>Amount: ₹{feeAmount}</p>
              </div>
            )}
          </div>
        )}

        {isAuthenticated ? (
          <button onClick={handleLogout} className="hover:underline">
            🔓 Logout
          </button>
        ) : (
          <button onClick={handleLogin} className="hover:underline">
            🔐 Login
          </button>
        )}
      </nav>
    </header>
  );
}
