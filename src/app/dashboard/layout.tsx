"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import {
  FaHome,
  FaUsers,
  FaTag,
  FaCube,
  FaShoppingCart,
  FaMoneyBillAlt,
  FaChartBar,
  FaHeadset,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

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
    } else {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } catch (error) {
        console.error("Token decoding error:", error);
      }
    }
  }, [router]);

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    router.push(`/dashboard/${tab}`);
  };

  return (
    <div className="flex">
      <div className="w-70 bg-gray-800 min-h-screen p-6">
        <div className="text-2xl font-bold text-white mb-6">Quản trị viên</div>
        <ul>
          <li>
            <button
              onClick={() => handleNavigation("")}
              className={`w-full text-left px-6 py-2 hover:bg-gray-700 text-white font-bold flex items-center space-x-3 ${
                activeTab === "dashboard" ? "bg-gray-700" : ""
              }`}
            >
              <FaHome className="w-5 h-5" />
              <span>Trang chủ</span>
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
              <span>Người dùng</span>
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
              <span>Danh mục</span>
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
              <span>Sản phẩm</span>
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
              <span>Lịch sử đơn hàng</span>
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
              <span>Lịch sử giao dịch</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("chat")}
              className={`w-full text-left px-6 py-2 hover:bg-gray-700 text-white font-bold flex items-center space-x-3 ${
                activeTab === "chat" ? "bg-gray-700" : ""
              }`}
            >
              <FaHeadset className="w-5 h-5" />
              <span>Hỗ trợ khách hàng</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("statistics")}
              className={`w-full text-left px-6 py-2 hover:bg-gray-700 text-white font-bold flex items-center space-x-3 ${
                activeTab === "statistics" ? "bg-gray-700" : ""
              }`}
            >
              <FaChartBar className="w-5 h-5" />
              <span>Thống kê</span>
            </button>
          </li>
          <li className="mt-auto">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
              className="w-full text-left px-6 py-2 hover:bg-gray-700 text-white font-bold flex items-center space-x-3"
            >
              <LogOut className="w-5 h-5" />
              <span>Đăng xuất</span>
            </button>
          </li>
        </ul>
      </div>

      <div className="flex-1 p-6">{children}</div>

      <Toaster position="top-right" className="z-50" />
    </div>
  );
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const routes = [
    {
      href: "/dashboard",
      label: "Tổng quan",
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/statistics",
      label: "Thống kê",
      active: pathname === "/dashboard/statistics",
    },
    {
      href: "/dashboard/orders",
      label: "Đơn hàng",
      active: pathname === "/dashboard/orders",
    },
    {
      href: "/dashboard/products",
      label: "Sản phẩm",
      active: pathname === "/dashboard/products",
    },
    {
      href: "/dashboard/categories",
      label: "Danh mục",
      active: pathname === "/dashboard/categories",
    },
    {
      href: "/dashboard/users",
      label: "Người dùng",
      active: pathname === "/dashboard/users",
    },
  ];

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pl-1 pr-0">
          <div className="px-7">
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setOpen(false)}
            >
              <span className="font-bold">Shop Laptop</span>
            </Link>
          </div>
          <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
            <div className="flex flex-col gap-2 px-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    route.active ? "bg-accent" : "transparent"
                  )}
                >
                  {route.label}
                </Link>
              ))}
              <Button
                variant="ghost"
                className="flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </Button>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <div className="hidden lg:block">
        <div className="flex h-full w-[240px] flex-col">
          <div className="px-7">
            <Link href="/" className="flex items-center">
              <span className="font-bold">Shop Laptop</span>
            </Link>
          </div>
          <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
            <div className="flex flex-col gap-2 px-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    route.active ? "bg-accent" : "transparent"
                  )}
                >
                  {route.label}
                </Link>
              ))}
              <Button
                variant="ghost"
                className="flex items-center gap-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </Button>
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
