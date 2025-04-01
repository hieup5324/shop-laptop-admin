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

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
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

    fetchUsers();
  }, [currentPage, pageSize, searchTerm]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Input
            type="text"
            placeholder="Search for a user"
            className="p-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
          Add New
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="p-2">#</TableHead>
            <TableHead className="p-2">Name</TableHead>
            <TableHead className="p-2">Email</TableHead>
            <TableHead className="p-2">Created At</TableHead>
            <TableHead className="p-2">Role</TableHead>
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
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell className="p-2">{user.email}</TableCell>
              <TableCell className="p-2">
                {dayjs(user.createdAt).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell className="p-2">{user.role}</TableCell>
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
          className="mr-4"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <div>
          <span>
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default UsersPage;
