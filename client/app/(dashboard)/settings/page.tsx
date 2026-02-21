"use client";

import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Mail,
  Users,
  ShieldCheck,
} from "lucide-react";
import React from "react";

const Settings = () => {
  // const userSettings = {
  //   username: "johndoe",
  //   email: "john.doe@example.com",
  //   teamName: "Development Team",
  //   roleName: "Developer",
  // };
  const { user } = useAuth();

  if (!user) return null;

  const userSettings = {
    username: user.username || "Guest",
    email: user.email,
    teamName: "Development Team",
    roleName: "Developer",
  };


  return (
    <div className="px-6 py-5">
      <Header name="Settings" />

      {/* MAIN CONTAINER */}
      <div className="mt-4 max-w-3xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-dark-secondary dark:bg-dark-secondary">

        {/* SECTION: ACCOUNT */}
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
          Account
        </h2>

        <div className="space-y-3">
          <SettingRow
            icon={<User />}
            label="Username"
            value={userSettings.username}
            accent="from-blue-500 to-indigo-500"
          />

          <SettingRow
            icon={<Mail />}
            label="Email"
            value={userSettings.email}
            accent="from-emerald-500 to-teal-500"
          />
        </div>

        {/* DIVIDER */}
        <div className="my-6 border-t border-gray-200 dark:border-dark-tertiary" />

        {/* SECTION: ORGANIZATION */}
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
          Organization
        </h2>

        <div className="space-y-3">
          <SettingRow
            icon={<Users />}
            label="Team"
            value={userSettings.teamName}
            accent="from-violet-500 to-purple-500"
          />

          <SettingRow
            icon={<ShieldCheck />}
            label="Role"
            value={userSettings.roleName}
            accent="from-orange-500 to-amber-500"
            badge
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;

/* ------------------------------------------------------------------ */
/* 🔹 Reusable Row Component */
/* ------------------------------------------------------------------ */

type RowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  badge?: boolean;
};

const SettingRow = ({ icon, label, value, accent, badge }: RowProps) => {
  return (
    <div className="group relative flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 transition hover:bg-white hover:shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:hover:bg-dark-secondary">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${accent} text-white shadow-sm`}
        >
          {icon}
        </div>
        <div>
          <p className="text-lg font-medium text-gray-800 dark:text-black">
            {label}
          </p>
          <p className="text-sm text-gray-600 dark:text-neutral-400">
            {value}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      {badge && (
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-100">
          Protected
        </span>
      )}
    </div>
  );
};


