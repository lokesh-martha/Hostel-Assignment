"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useUser } from "../context/UserContext";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

export default function Home() {
  type MyJwtPayload = {
    sub: string;
    username: string;
    role: string;
    iat: number;
    exp: number;
  };

  const router = useRouter();
  const { setUser } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const getJwtFromCookie = () => {
    const cookies = document.cookie;
    return cookies
      .split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];
  };
  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const response = await fetch('http://localhost:3000/auth/google/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },mode: "cors", 
        credentials:'include',
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      if (!response.ok) {
        throw new Error('Google authentication failed');
      }
      const data = await response.json();
      const token = getJwtFromCookie();
      
      if (token) {
        const decoded = jwtDecode<MyJwtPayload>(token);
        setUser({ username: decoded.username, role: decoded.role });
        process.env.token=token; 
        process.env.role = decoded.role;
        process.env.username = decoded.username;
        router.push("/api");
      }
    } catch (error) {
      console.error('Google login failed:', error);
      alert('Google authentication failed. Please try again.');
    }
  };

  const login = async () => {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    const token = getJwtFromCookie();
    if (token) {
      const decoded = jwtDecode<MyJwtPayload>(token);
      setUser({ username: decoded.username, role: decoded.role });
      process.env.role = decoded.role;
      process.env.username = decoded.username;
      process.env.token = token;
    }

    if (!token) {
      alert(data.message || "Authentication failed");
      router.push("/authentication");
      return;
    }

    router.push("/api");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          width: "300px",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>Login</h1>
        
        <div style={{ textAlign: "left", marginBottom: "10px" }}>
          <label htmlFor="username" style={{ display: "block", marginBottom: "5px" }}>
            Username
          </label>
          <input
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ textAlign: "left", marginBottom: "10px" }}>
          <label htmlFor="username" style={{ display: "block", marginBottom: "5px" }}>
            Password
          </label>
          <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        </div>
        
        <button
          onClick={login}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
        

        <button
          onClick={() => router.push("/authentication/register")}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Register
        </button>
        <div className="flex justify-center mt-4">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string }>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              console.log('Google login failed');
            }}
          />
        </GoogleOAuthProvider></div>
      </div>
    </div>
  );
}
