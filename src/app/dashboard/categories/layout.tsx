"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner"; // Toast notifications

export default function CategoriesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="">
      <div className="w-100 p-2">
        <h2 className="text-2xl font-bold">Product Categories</h2>
      </div>
      <div className="flex-1 p-6 bg-gray-100">{children}</div>

      <Toaster position="top-right" className="z-50" />
    </div>
  );
}
