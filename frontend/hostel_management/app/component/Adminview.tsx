import { useState } from "react";
import styles from './roompage.module.css';

type Application = {
  _id: string;
  StudentName: string;
  PreviousRoom: string;
  AppliedRoom: string;
  Status: string;
};

type AdminViewProps = {
  applications: Application[];
  handleAccept: (id: string) => void;
  handleReject: (id: string) => void;
};

export default function AdminView({ applications, handleAccept, handleReject }: AdminViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const paginatedApps = applications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={styles.container}>
      <h2>Room Applications</h2>
      <div className={styles.grid}>
        <div className={styles.header}>
          Student Name - Previous Room - Applied Room
        </div>
        {paginatedApps.map((app) => (
          <div key={app._id} className={styles.roomEntry}>
            <span>
              {app.StudentName} - {app.PreviousRoom} → {app.AppliedRoom} ({app.Status})
            </span>
            <div>
              <button className={styles.applyButton} onClick={() => handleAccept(app._id)}>
                Accept
              </button>
              <button className={styles.cancelButton} onClick={() => handleReject(app._id)}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {applications.length > itemsPerPage && (
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
