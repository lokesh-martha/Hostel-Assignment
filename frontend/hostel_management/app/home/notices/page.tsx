"use client";
import { useEffect, useState } from "react";
import styles from "./noticepage.module.css";
import { jwtDecode } from "jwt-decode";

type Notice = {
  _id: string;
  title: string;
  content: string;
  date: string;
};

type MyJwtPayload = {
    sub: string;
    username: string;
    role: string;
    iat: number;
    exp: number;
  };

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const itemsPerPage = 5;
  const getJwtFromCookie = () => {
    const cookies = document.cookie;
    return cookies
      .split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];
  };

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch("http://localhost:3000/students/GetAllNotices", {
          credentials: "include",
        });
        const data = await res.json();
        setNotices(data);
      } catch (error) {
        console.error("Failed to fetch notices:", error);
      }
    };

    const token = getJwtFromCookie();
    if (token) {
        const decoded = jwtDecode<MyJwtPayload>(token);
        setUserRole( decoded.role );
        
      }
    fetchNotices();
  }, []);

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const res = await fetch("http://localhost:3000/students/addnotice", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        const newNotice = await res.json();
        setNotices((prev) => [newNotice, ...prev]);
        setTitle("");
        setContent("");
        setShowForm(false);
      } else {
        console.error("Failed to add notice");
      }
    } catch (error) {
      console.error("Error adding notice:", error);
    }
  };

  const totalPages = Math.ceil(notices.length / itemsPerPage);
  const paginatedNotices = notices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>📢 Notices</h2>

      <div className={styles.grid}>
        {paginatedNotices.map((notice) => (
          <div key={notice._id} className={styles.noticeEntry}>
            <h3 className={styles.noticeTitle}>{notice.title}</h3>
            <p className={styles.noticeContent}>{notice.content}</p>
            <small className={styles.noticeDate}>
              {new Date(notice.date).toLocaleDateString()}
            </small>
          </div>
        ))}
      </div>

      {userRole === "admin" && (
        <>
          <button
            className={styles.toggleButton}
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? "Cancel" : "Add New Notice"}
          </button>

          {showForm && (
            <form onSubmit={handleAddNotice} className={styles.form}>
              <input
                type="text"
                placeholder="Notice Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
              />
              <textarea
                placeholder="Notice Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={styles.textarea}
              />
              <button type="submit" className={styles.submitButton}>
                Add Notice
              </button>
            </form>
          )}
        </>
      )}

      {notices.length > itemsPerPage && (
        <div className={styles.pagination}>
          <button
            className={styles.button}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={styles.button}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
