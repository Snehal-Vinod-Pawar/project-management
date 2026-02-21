"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
// import AuthProvider from "./authProvider";
import StoreProvider, { useAppSelector } from "./redux";
import ProtectedRoute from "@/components/ProtectedRoute";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  return (
    <div className="flex min-h-screen w-full  bg-transparent dark:bg-dark-bg text-gray-900 dark:text-gray-200">
      <Sidebar />
      <main
        className={`flex w-full flex-col  bg-transparent dark:bg-dark-bg ${
          isSidebarCollapsed ? "" : "md:pl-64"
        }`}
      >
        <Navbar /> 
      <div className="flex-1 bg-gray-50 text-gray-900">
        {children}
      </div>
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute>
        <DashboardLayout>
          {children}
        </DashboardLayout>
    </ProtectedRoute>
  );
};

export default DashboardWrapper;