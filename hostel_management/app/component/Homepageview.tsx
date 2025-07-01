// components/Dashboard.tsx
type DashboardProps = {
    totalStudents: number;
    totalRooms: number;
  };
  
  export default function HomePage({ totalStudents, totalRooms }: DashboardProps) {
    const occupiedRooms = totalStudents ?? 0;
    const availableRooms = totalRooms - occupiedRooms;
  
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white font-[family-name:var(--font-geist-sans)]">
        <main className="flex-grow p-8 sm:p-20">
          <h2 className="text-2xl font-bold mb-8 text-center">Hostel Dashboard</h2>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 text-center">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Students</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalStudents}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Rooms</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalRooms}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Occupied Rooms</h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{occupiedRooms}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Available Rooms</h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{availableRooms}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
  