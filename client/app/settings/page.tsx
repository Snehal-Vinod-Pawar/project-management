import Header from "@/components/Header";
import {
  User,
  Mail,
  Users,
  ShieldCheck,
} from "lucide-react";
import React from "react";

const Settings = () => {
  const userSettings = {
    username: "johndoe",
    email: "john.doe@example.com",
    teamName: "Development Team",
    roleName: "Developer",
  };

  return (
    <div className="px-6 py-6">
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


// import Header from "@/components/Header";
// import {
//   User,
//   Mail,
//   Users,
//   ShieldCheck,
// } from "lucide-react";
// import React from "react";

// const Settings = () => {
//   const userSettings = {
//     username: "johndoe",
//     email: "john.doe@example.com",
//     teamName: "Development Team",
//     roleName: "Developer",
//   };

//   return (
//     <div className="px-6 py-4">
//       <Header name="Settings" />

//       {/* MAIN CARD */}
//       <div className="mt-4 max-w-3xl rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-dark-secondary dark:bg-dark-secondary">
        
//         {/* ACCOUNT */}
//         <Section title="Account">
//           <SettingRow
//             icon={<User size={16} />}
//             label="Username"
//             value={userSettings.username}
//             accent="from-blue-500 to-indigo-500"
//           />
//           <SettingRow
//             icon={<Mail size={16} />}
//             label="Email"
//             value={userSettings.email}
//             accent="from-emerald-500 to-teal-500"
//           />
//         </Section>

//         {/* ORGANIZATION */}
//         <Section title="Organization">
//           <SettingRow
//             icon={<Users size={16} />}
//             label="Team"
//             value={userSettings.teamName}
//             accent="from-violet-500 to-purple-500"
//           />
//           <SettingRow
//             icon={<ShieldCheck size={16} />}
//             label="Role"
//             value={userSettings.roleName}
//             accent="from-orange-500 to-amber-500"
//             badge
//           />
//         </Section>
//       </div>
//     </div>
//   );
// };

// export default Settings;

// /* ------------------------------------------------------------------ */
// /* Reusable Components */
// /* ------------------------------------------------------------------ */

// const Section = ({
//   title,
//   children,
// }: {
//   title: string;
//   children: React.ReactNode;
// }) => (
//   <div className="mb-5">
//     <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
//       {title}
//     </h2>
//     <div className="space-y-2">{children}</div>
//   </div>
// );

// const SettingRow = ({
//   icon,
//   label,
//   value,
//   accent,
//   badge,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
//   accent: string;
//   badge?: boolean;
// }) => {
//   return (
//     <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2 hover:bg-white transition dark:border-dark-tertiary dark:bg-dark-tertiary">
//       <div className="flex items-center gap-3">
//         <div
//           className={`flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br ${accent} text-white`}
//         >
//           {icon}
//         </div>
//         <div>
//           <p className="text-sm font-medium text-gray-800 dark:text-black">
//             {label}
//           </p>
//           <p className="text-xs text-gray-500 dark:text-neutral-400">
//             {value}
//           </p>
//         </div>
//       </div>

//       {badge && (
//         <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-100">
//           Protected
//         </span>
//       )}
//     </div>
//   );
// };
