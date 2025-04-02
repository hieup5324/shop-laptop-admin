"use client"; // Mark this as a client-side component
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // for routing
import { Toaster } from "sonner"; // Toast for notifications
import {
  FaHome,
  FaUsers,
  FaTag,
  FaCube,
  FaShoppingCart,
  FaMoneyBillAlt,
} from "react-icons/fa"; // Import React Icons

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
        <div className="text-2xl font-bold text-white mb-6">Admin Panel</div>
        <ul>
          <li>
            <button
              onClick={() => handleNavigation("")}
              className={`w-full text-left px-6 py-2 hover:bg-gray-700 text-white font-bold flex items-center space-x-3 ${
                activeTab === "dashboard" ? "bg-gray-700" : ""
              }`}
            >
              <FaHome className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("users")}
              className={`w-full text-left px-6 py-2 hover:bg-gray-700 text-white font-bold flex items-center space-x-3 ${
                activeTab === "users" ? "bg-gray-700" : ""
              }`}
            >
              <FaUsers className="w-5 h-5" />
              <span>Users</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("categories")}
              className={`w-full text-left px-6 py-2 hover:bg-gray-700 text-white font-bold flex items-center space-x-3 ${
                activeTab === "categories" ? "bg-gray-700" : ""
              }`}
            >
              <FaTag className="w-5 h-5" />
              <span>Product Categories</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("products")}
              className={`w-full text-left px-6 py-2 hover:bg-gray-700 text-white font-bold flex items-center space-x-3 ${
                activeTab === "products" ? "bg-gray-700" : ""
              }`}
            >
              <FaCube className="w-5 h-5" />
              <span>Products</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("orders")}
              className={`w-full text-left px-6 py-2 hover:bg-gray-700 text-white font-bold flex items-center space-x-3 ${
                activeTab === "orders" ? "bg-gray-700" : ""
              }`}
            >
              <FaShoppingCart className="w-5 h-5" />
              <span>Orders</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("transactions")}
              className={`w-full text-left px-6 py-2 hover:bg-gray-700 text-white font-bold flex items-center space-x-3 ${
                activeTab === "transactions" ? "bg-gray-700" : ""
              }`}
            >
              <FaMoneyBillAlt className="w-5 h-5" />
              <span>Transactions</span>
            </button>
          </li>
        </ul>
      </div>

      <div className="flex-1 p-6">{children}</div>

      <Toaster position="top-right" className="z-50" />
    </div>
  );
}
