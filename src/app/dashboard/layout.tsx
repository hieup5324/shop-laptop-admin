"use client"; // Mark this as a client-side component
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // for routing
import { Toaster } from "sonner"; // Toast for notifications

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    router.push(`/dashboard/${tab}`);
  };

  return (
    <div className="flex">
      <div className="w-64 bg-gray-800 min-h-screen p-6">
        <div className="text-2xl font-bold mb-6">Admin Panel</div>
        <ul>
          <li>
            <button
              onClick={() => handleNavigation("")}
              className={`w-full text-left px-6 py-2 hover:bg-gray-700 ${
                activeTab === "dashboard" ? "bg-gray-700" : ""
              }`}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("users")}
              className={`w-full text-left px-6 py-2 hover:bg-gray-700 ${
                activeTab === "users" ? "bg-gray-700" : ""
              }`}
            >
              Users
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("categories")} // New category link
              className={`w-full text-left px-6 py-2 hover:bg-gray-700 ${
                activeTab === "categories" ? "bg-gray-700" : ""
              }`}
            >
              Product Categories
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("products")}
              className={`w-full text-left px-6 py-2 hover:bg-gray-700 ${
                activeTab === "products" ? "bg-gray-700" : ""
              }`}
            >
              Products
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("transactions")}
              className={`w-full text-left px-6 py-2 hover:bg-gray-700 ${
                activeTab === "transactions" ? "bg-gray-700" : ""
              }`}
            >
              Transactions
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("revenue")}
              className={`w-full text-left px-6 py-2 hover:bg-gray-700 ${
                activeTab === "revenue" ? "bg-gray-700" : ""
              }`}
            >
              Revenue
            </button>
          </li>
        </ul>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6">
        {children} {/* Render the content passed in */}
      </div>

      {/* Global Toast notifications */}
      <Toaster position="top-right" className="z-50" />
    </div>
  );
}
