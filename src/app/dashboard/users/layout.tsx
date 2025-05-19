"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner"; // Toast notifications

export default function UsersLayout({ children }: { children: ReactNode }) {
  return (
    <div className="">
      <div className="w-64 p-2">
        <h2 className="text-2xl font-bold">Quản lý người dùng</h2>
      </div>
      <div className="flex-1 p-6 bg-gray-100">
        {children} {/* Render the user-related pages */}
      </div>

      <Toaster position="top-right" className="z-50" />
    </div>
  );
}
