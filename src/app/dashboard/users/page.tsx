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
import { toast } from "sonner";

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/users", {
        params: {
          page: currentPage,
          page_size: pageSize,
          search: searchTerm,
        },
      });

      setUsers(response.data.data);
      setTotalPages(response.data.paging.totalPages);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, searchTerm]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3001/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user", error);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <Input
              type="text"
              placeholder="Tìm kiếm người dùng"
              className="p-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
            <TableHead className="p-2">Họ và tên</TableHead>
            <TableHead className="p-2">Email</TableHead>
            <TableHead className="p-2">Ngày tạo</TableHead>
            <TableHead className="p-2">Chức vụ</TableHead>
            <TableHead className="p-2">Hành động</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell className="p-2">
                {(currentPage - 1) * pageSize + index + 1}
              </TableCell>
              <TableCell className="p-2">
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell className="p-2">{user.email}</TableCell>
              <TableCell className="p-2">
                {dayjs(user.createdAt).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell className="p-2">{user.role}</TableCell>
              <TableCell className="p-2">
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Xóa
                </Button>
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
              // Hiển thị trang đầu tiên, cuối cùng, và các trang xung quanh trang hiện tại
              if (page === 1 || page === totalPages) return true;
              if (Math.abs(page - currentPage) <= 2) return true;
              return false;
            })
            .map((page, index, array) => {
              // Thêm dấu "..." giữa các khoảng trống
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
