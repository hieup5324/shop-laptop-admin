"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Import Button from ShadCN
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import dayjs from "dayjs";
import { Input } from "@/components/ui/input";
import React from "react";
import ViewOrderModal from "./view-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPriceVND } from "@/lib/format-price";

const OrdersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3001/order/test?is_admin=true",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              page: currentPage,
              page_size: pageSize,
              search: searchTerm,
              payment_status:
                paymentStatus !== "all" ? paymentStatus : undefined,
            },
          }
        );

        setUsers(response.data.data);
        setTotalPages(response.data.paging.totalPages);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, [currentPage, pageSize, searchTerm, paymentStatus]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleViewClick = (order: any) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Search for a user"
            className="p-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium whitespace-nowrap">
              Trạng thái thanh toán:
            </span>
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Trạng thái thanh toán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="pending">Chưa thanh toán</SelectItem>
                <SelectItem value="success">Đã thanh toán</SelectItem>
                <SelectItem value="failed">Thanh toán thất bại</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* <Button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
          Add New
        </Button> */}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-2">#</TableHead>
            <TableHead className="p-2">Created At</TableHead>
            <TableHead className="p-2">Order Code</TableHead>
            <TableHead className="p-2">Partner Order Code</TableHead>
            <TableHead className="p-2">Total Price</TableHead>
            <TableHead className="p-2">Payment Type</TableHead>
            <TableHead className="p-2">Status Payment</TableHead>
            <TableHead className="p-2">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell className="p-2">
                {(currentPage - 1) * pageSize + index + 1}
              </TableCell>
              <TableCell className="p-2">
                {dayjs(user.createdAt).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell className="p-2">{user.order_code}</TableCell>
              <TableCell className="p-2">{user.order_code_transport}</TableCell>
              <TableCell className="p-2">
                {formatPriceVND(user.total_price)} VNĐ
              </TableCell>
              <TableCell className="p-2">{user.payment_type}</TableCell>
              <TableCell className="p-2">{user.status_payment}</TableCell>
              <TableCell className="p-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleViewClick(user)}
                  >
                    View Order
                  </Button>
                  {user.transaction_id && (
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = `/dashboard/transactions?transaction_id=${user.transaction_id}`}
                    >
                      View Transaction
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          className="mr-4"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              if (page === 1 || page === totalPages) return true;
              if (Math.abs(page - currentPage) <= 2) return true;
              return false;
            })
            .map((page, index, array) => {
              if (index > 0 && page - array[index - 1] > 1) {
                return (
                  <React.Fragment key={`ellipsis-${page}`}>
                    <span className="px-2">...</span>
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                      className="w-10 h-10"
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                );
              }
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => handlePageChange(page)}
                  className="w-10 h-10"
                >
                  {page}
                </Button>
              );
            })}
        </div>
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      <ViewOrderModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrdersPage;
