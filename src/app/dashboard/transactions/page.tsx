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
import { formatPriceVND } from "@/lib/format-price";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [transStatus, setTransStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/vnpay", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            page: currentPage,
            page_size: pageSize,
            search: searchTerm,
            trans_status: transStatus !== "all" ? transStatus : undefined,
          },
        });

        setUsers(response.data.data);
        setTotalPages(response.data.paging.totalPages);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();
  }, [currentPage, pageSize, searchTerm, transStatus]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Search transactions..."
            className="p-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium whitespace-nowrap">Trạng thái giao dịch:</span>
            <Select value={transStatus} onValueChange={setTransStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Trạng thái giao dịch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="success">Giao dịch thành công</SelectItem>
                <SelectItem value="failed">Giao dịch thất bại</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-2">#</TableHead>
            <TableHead className="p-2">Created At</TableHead>
            <TableHead className="p-2">Bank</TableHead>
            <TableHead className="p-2">Bank Transaction</TableHead>
            <TableHead className="p-2">Card Type</TableHead>
            <TableHead className="p-2">Amount</TableHead>
            <TableHead className="p-2">Transaction Status</TableHead>
            <TableHead className="p-2">Actions</TableHead>
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
              <TableCell className="p-2">{user.bank_code}</TableCell>
              <TableCell className="p-2">{user.bank_tran_no}</TableCell>
              <TableCell className="p-2">{user.card_type}</TableCell>
              <TableCell className="p-2">{`${formatPriceVND(
                user.amount
              )} VNĐ`}</TableCell>
              <TableCell className="p-2">{user.transaction_status}</TableCell>
              <TableCell className="p-2">
                <Button variant="outline" className="mr-2">
                  View
                </Button>
                <Button variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          className="mr-4 border-black"
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
                      className={`w-10 h-10 ${
                        currentPage === page ? "" : "border-black"
                      }`}
                      onClick={() => handlePageChange(page)}
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
                  className={`w-10 h-10 ${
                    currentPage === page ? "" : "border-black"
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              );
            })}
        </div>
        <Button
          variant="outline"
          className="border-black"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default UsersPage;
