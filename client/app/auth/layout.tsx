"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLogo = pathname === "/auth/login";

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#eef4ff] via-[#f5f8ff] to-white">

      {/* Logo (only for register) */}
      {!hideLogo && (
        <div className="mb-6 flex items-center gap-2">
          <Image src="/auth/logo.svg" alt="Project Tool" width={36} height={36} />
          <span className="text-2xl font-semibold text-gray-700">Project Tool</span>
        </div>
      )}

      {/* Auth Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-8 pt-8 pb-7">
        {children}
      </div>

      {/* Secure Footer */}
      <div className="mt-5 flex items-center gap-2 text-xs text-gray-400">
        <Image src="/auth/lock.svg" alt="Secure" width={14} height={14} />
        <span>Secure encrypted connection</span>
      </div>
    </div>
  );
}
