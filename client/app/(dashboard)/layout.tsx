// "use client";

// import Navbar from "@/components/Navbar";
// import Sidebar from "@/components/Sidebar";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import { useAppSelector } from "../redux";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const isSidebarCollapsed = useAppSelector(
//     (state) => state.global.isSidebarCollapsed
//   );
//   return (
//     <ProtectedRoute>
//       {/* <div className="flex min-h-screen bg-gray-50 dark:bg-dark-bg"> */}
//       <div className="relative min-h-screen bg-gray-50 dark:bg-dark-bg overflow-x-hidden">
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Main area */}
//         <div className={`flex flex-col w-full transition-all duration-300 ${
//             isSidebarCollapsed ? "ml-0" : "ml-0 md:ml-64"
//           }`}> {/* reserve sidebar width */}
          
//           {/* Navbar */}
//           <div className="h-16">
//             <Navbar />
//           </div>

//           {/* Page content */}
//           <main className="w-full flex-1 bg-gray-50 p-6 mt-0">
//             {children}
//           </main>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }

"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAppSelector } from "../redux";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );

  return (
    <ProtectedRoute>
      <div className="relative min-h-screen bg-gray-50 dark:bg-dark-bg overflow-x-hidden">
        {/* Fixed Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div
          className={`transition-all duration-300 ${
            isSidebarCollapsed ? "ml-0" : "ml-0 md:ml-64"
          }`}
        >
          <Navbar />

          <main className="w-full min-h-screen px-1 py-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
