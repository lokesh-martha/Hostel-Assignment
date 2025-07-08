import styles from "./roompage.module.css";

type Room = {
  RoomNumber: string;
};

type StudentViewProps = {
  activeRooms: Room[];
  appliedRooms: string[];
  activePage: number;
  inactivePage: number;
  itemsPerPage: number;
  activeTotalPages: number;
  paginate: <T>(items: T[], page: number) => T[];
  handleApplyRoom: (roomNumber: string) => void;
  handleCancelApplication: (roomNumber: string) => void;
  setActivePage: React.Dispatch<React.SetStateAction<number>>;
  setInactivePage: React.Dispatch<React.SetStateAction<number>>;
};

export default function StudentView({
  activeRooms,
  appliedRooms,
  activePage,
  inactivePage,
  itemsPerPage,
  activeTotalPages,
  paginate,
  handleApplyRoom,
  handleCancelApplication,
  setActivePage,
  setInactivePage,
}: StudentViewProps) {
  return (
    <div className={styles.container}>
      <div className={styles.flexWrapper}>
        {/* Active Rooms */}
        <div className={styles.section}>
          <h2>Active Room Assignments</h2>
          <div className={styles.grid}>
            <div className={styles.header}>Room Number</div>
            {paginate(activeRooms, activePage).map((room, index) => {
              const isApplied = appliedRooms.includes(room.RoomNumber);
              return (
                <div key={`active-${index}`} className={styles.roomEntry}>
                  <span>{room.RoomNumber}</span>
                  {isApplied ? (
                    <div>
                      <button className={styles.appliedButton} disabled>
                        Applied
                      </button>
                      <button
                        className={styles.cancelButton}
                        onClick={() => handleCancelApplication(room.RoomNumber)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className={styles.applyButton}
                      onClick={() => handleApplyRoom(room.RoomNumber)}
                    >
                      Apply
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination for Active Rooms */}
          {activeRooms.length > itemsPerPage && (
            <div className={styles.pagination}>
              <button
                className={styles.button}
                onClick={() => setActivePage((p) => Math.max(p - 1, 1))}
                disabled={activePage === 1}
              >
                Previous
              </button>
              <span>
                Page {activePage} of {activeTotalPages}
              </span>
              <button
                className={styles.button}
                onClick={() =>
                  setActivePage((p) => Math.min(p + 1, activeTotalPages))
                }
                disabled={activePage === activeTotalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Applied Rooms */}
        {appliedRooms.length > 0 && (
          <div className={styles.section}>
            <h2>Applied Rooms</h2>
            <div className={styles.grid}>
              <div className={styles.header}>Room Number</div>
              {paginate(
                appliedRooms.map((room) => ({ RoomNumber: room })),
                inactivePage
              ).map((room, index) => (
                <div key={`applied-${index}`} className={styles.roomEntry}>
                  <span>{room.RoomNumber}</span>
                  <button className={styles.appliedButton} disabled>
                    Applied
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleCancelApplication(room.RoomNumber)}
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination for Applied Rooms */}
            {appliedRooms.length > itemsPerPage && (
              <div className={styles.pagination}>
                <button
                  className={styles.button}
                  onClick={() => setInactivePage((p) => Math.max(p - 1, 1))}
                  disabled={inactivePage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {inactivePage} of{" "}
                  {Math.ceil(appliedRooms.length / itemsPerPage)}
                </span>
                <button
                  className={styles.button}
                  onClick={() =>
                    setInactivePage((p) =>
                      Math.min(
                        p + 1,
                        Math.ceil(appliedRooms.length / itemsPerPage)
                      )
                    )
                  }
                  disabled={
                    inactivePage ===
                    Math.ceil(appliedRooms.length / itemsPerPage)
                  }
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
